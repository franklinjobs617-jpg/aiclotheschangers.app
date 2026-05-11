import os
import hashlib
import hmac
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from urllib.parse import quote, urlparse

import requests
from flask import Blueprint, jsonify, request


def _load_local_env() -> None:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for filename in (".env.local", ".env"):
        env_path = os.path.join(base_dir, filename)
        if not os.path.exists(env_path):
            continue
        with open(env_path, "r", encoding="utf-8") as env_file:
            for raw_line in env_file:
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = value


_load_local_env()

tryon_bp = Blueprint("tryon", __name__)

PROJECT = os.getenv("TRYON_PROJECT", "aiclotheschangers").strip()
APP_TYPE = os.getenv("TRYON_APP_TYPE", "9").strip()

CREDIT_API_BASE = os.getenv("CREDIT_API_BASE", "https://api.aiclotheschangers.app/prod-api").rstrip("/")
CREDIT_TIMEOUT = max(2, int(os.getenv("CREDIT_TIMEOUT", "8")))
CREDIT_INTERNAL_TOKEN = "close_credit_123_random_64_chars"

TRYON_PROXY_TOKEN = "close_tryon_123_random_64_chars"

SEEDDREAM_API_KEY = "3a4b60e4-f692-4210-b26e-a03c636fc804"
SEEDDREAM_API_URL = os.getenv(
    "SEEDDREAM_API_URL",
    "https://ark.cn-beijing.volces.com/api/v3/images/generations",
).strip()
SEEDDREAM_MODEL = os.getenv("SEEDDREAM_MODEL", "doubao-seedream-5-0-260128").strip()
SEEDDREAM_SIZE = os.getenv("SEEDDREAM_SIZE", "2K").strip()
SEEDDREAM_TIMEOUT = max(30, int(os.getenv("SEEDDREAM_TIMEOUT", "180")))

R2_ACCOUNT_ID = "4b7df56cc93623eac7d6aa490862972a"
R2_ENDPOINT = "https://4b7df56cc93623eac7d6aa490862972a.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID = "2882744e1ae960ef12d2e277c7ae0b96"
R2_SECRET_ACCESS_KEY = "929078ca5a4fe0858d84dc53fa6ad4c53bfc93abce3d930fc007b9e4f3761e89"
R2_BUCKET = "close"
R2_PUBLIC_BASE_URL = "https://cdn.aiclotheschangers.app"
RESULT_DOWNLOAD_TIMEOUT = max(10, int(os.getenv("RESULT_DOWNLOAD_TIMEOUT", "60")))


@tryon_bp.route("/api/tryon/health", methods=["GET"])
@tryon_bp.route("/tryon/health", methods=["GET"])
def tryon_health():
    return jsonify({
        "ok": True,
        "service": "tryon",
        "model": SEEDDREAM_MODEL,
    }), 200


@tryon_bp.route("/api/tryon/generate", methods=["POST", "OPTIONS"])
@tryon_bp.route("/tryon/generate", methods=["POST", "OPTIONS"])
def generate_tryon():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    proxy_error = _validate_proxy_token()
    if proxy_error:
        return proxy_error

    body = request.get_json(silent=True) or {}
    person_image = _first_present(body, ["personImage", "modelImage", "model_image"])
    garment_image = _first_present(body, ["garmentImage", "outfitImage", "garment_image"])
    if not person_image or not garment_image:
        return jsonify({"code": "BAD_REQUEST", "error": "personImage and garmentImage are required"}), 400

    amount = _generation_cost(body)
    visitor_id = str(body.get("visitorId") or "").strip()
    auth_header = _extract_auth_header()

    reserve_payload = {
        "project": PROJECT,
        "appType": APP_TYPE,
        "visitorId": visitor_id,
        "amount": amount,
        "idempotencyKey": str(body.get("idempotencyKey") or "").strip(),
    }

    reserve = None
    try:
        reserve = _call_credit("reserve", reserve_payload, auth_header)
        result_url = _call_seeddream(person_image, garment_image, body)
        result_url = _mirror_result_to_r2(result_url)
        _call_credit("commit", _commit_payload(reserve_payload, reserve), auth_header)
        return jsonify({
            "imageUrl": result_url,
            "credit": reserve,
        }), 200
    except CreditApiError as exc:
        return jsonify({"code": exc.code, "error": exc.message, "detail": exc.detail}), exc.status
    except Exception as exc:
        if reserve:
            _refund_reserved_credit(reserve_payload, reserve, auth_header)
        return jsonify({"code": "TRYON_GENERATION_FAILED", "error": str(exc)}), 502


def _validate_proxy_token():
    if not TRYON_PROXY_TOKEN:
        return None
    token = (request.headers.get("X-Proxy-Token") or "").strip()
    if token != TRYON_PROXY_TOKEN:
        return jsonify({"code": "UNAUTHORIZED", "error": "invalid proxy token"}), 401
    return None


def _extract_auth_header() -> str:
    auth = (request.headers.get("Authorization") or "").strip()
    if auth.lower().startswith("bearer "):
        return auth
    return ""


def _generation_cost(body: Dict[str, Any]) -> int:
    quality = str(body.get("quality") or body.get("mode") or "").strip().lower()
    if quality in {"hd", "high", "high_quality", "quality"}:
        return 2
    try:
        amount = int(body.get("amount") or 1)
    except (TypeError, ValueError):
        amount = 1
    return max(1, min(amount, 10))


def _call_credit(action: str, payload: Dict[str, Any], auth_header: str) -> Dict[str, Any]:
    headers = {
        "Content-Type": "application/json",
        "X-App-Type": "close",
    }
    if auth_header:
        headers["Authorization"] = auth_header
    if action in {"commit", "refund"} and CREDIT_INTERNAL_TOKEN:
        headers["X-Internal-Token"] = CREDIT_INTERNAL_TOKEN

    try:
        resp = requests.post(
            f"{CREDIT_API_BASE}/credit/{action}",
            headers=headers,
            json=payload,
            timeout=CREDIT_TIMEOUT,
        )
    except requests.RequestException as exc:
        raise CreditApiError(503, "CREDIT_SERVICE_UNAVAILABLE", "credit service unavailable", str(exc))

    data = _safe_json(resp)
    if not resp.ok or int(data.get("code", 200)) != 200:
        raise CreditApiError(
            resp.status_code,
            str(data.get("code") or "CREDIT_ERROR"),
            str(data.get("msg") or data.get("error") or "credit error"),
            data,
        )
    return data.get("data") or {}


def _commit_payload(base_payload: Dict[str, Any], reserve: Dict[str, Any]) -> Dict[str, Any]:
    payload = dict(base_payload)
    payload["source"] = str(reserve.get("source") or "").strip()
    payload["freeAmount"] = int(reserve.get("freeReserved") or 0)
    payload["paidAmount"] = int(reserve.get("paidReserved") or 0)
    return payload


def _refund_reserved_credit(base_payload: Dict[str, Any], reserve: Dict[str, Any], auth_header: str) -> None:
    payload = _commit_payload(base_payload, reserve)
    try:
        _call_credit("refund", payload, auth_header)
    except Exception:
        # Keep the original generation error. Refund failures should be logged by Java or outer infrastructure.
        pass


def _call_seeddream(person_image: str, garment_image: str, body: Dict[str, Any]) -> str:
    if not SEEDDREAM_API_KEY:
        raise RuntimeError("SEEDDREAM_API_KEY is not configured")

    prompt = _build_tryon_prompt(body)
    payload = {
        "model": SEEDDREAM_MODEL,
        "prompt": prompt,
        "image": [person_image, garment_image],
        "sequential_image_generation": "disabled",
        "response_format": "url",
        "size": _seeddream_size(body),
        "stream": False,
        "watermark": True,
    }

    resp = requests.post(
        SEEDDREAM_API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {SEEDDREAM_API_KEY}",
        },
        json=payload,
        timeout=SEEDDREAM_TIMEOUT,
    )
    data = _safe_json(resp)
    if not resp.ok:
        raise RuntimeError(data.get("error") or data.get("message") or resp.text[:500])

    image_url = _extract_image_url(data)
    if not image_url:
        raise RuntimeError("Seedream response did not contain an image url")
    return image_url


def _seeddream_size(body: Dict[str, Any]) -> str:
    quality = str(body.get("quality") or "").strip().lower()
    if quality in {"hd", "high", "high_quality", "quality"}:
        return os.getenv("SEEDDREAM_HD_SIZE", "4k").strip() or "4k"
    return os.getenv("SEEDDREAM_FAST_SIZE", "2k").strip() or "2k"


def _mirror_result_to_r2(image_url: str) -> str:
    if not image_url or _is_r2_public_url(image_url):
        return image_url

    if not _has_r2_config():
        return image_url

    resp = requests.get(image_url, timeout=RESULT_DOWNLOAD_TIMEOUT)
    if not resp.ok:
        raise RuntimeError(f"failed to download generated image: {resp.status_code}")

    content_type = (resp.headers.get("Content-Type") or "image/jpeg").split(";")[0].strip().lower()
    if not content_type.startswith("image/"):
        content_type = "image/jpeg"

    return _upload_bytes_to_r2(resp.content, content_type, _r2_result_key(content_type))


def _has_r2_config() -> bool:
    return bool(R2_ENDPOINT and R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY and R2_BUCKET and R2_PUBLIC_BASE_URL)


def _upload_bytes_to_r2(content: bytes, content_type: str, key: str) -> str:
    if R2_SECRET_ACCESS_KEY.startswith("cfut_"):
        raise RuntimeError("R2_SECRET_ACCESS_KEY must be the R2 S3 secret access key, not a Cloudflare API token")

    endpoint = R2_ENDPOINT.rstrip("/")
    parsed = urlparse(endpoint)
    host = parsed.netloc
    canonical_uri = f"/{quote(R2_BUCKET, safe='')}/{quote(key, safe='/')}"
    url = f"{endpoint}{canonical_uri}"

    content_hash = hashlib.sha256(content).hexdigest()
    now = datetime.now(timezone.utc)
    amz_date = now.strftime("%Y%m%dT%H%M%SZ")
    date_stamp = now.strftime("%Y%m%d")
    credential_scope = f"{date_stamp}/auto/s3/aws4_request"

    headers = {
        "Content-Type": content_type,
        "Host": host,
        "x-amz-content-sha256": content_hash,
        "x-amz-date": amz_date,
    }
    signed_headers = "content-type;host;x-amz-content-sha256;x-amz-date"
    canonical_headers = (
        f"content-type:{content_type}\n"
        f"host:{host}\n"
        f"x-amz-content-sha256:{content_hash}\n"
        f"x-amz-date:{amz_date}\n"
    )
    canonical_request = "\n".join([
        "PUT",
        canonical_uri,
        "",
        canonical_headers,
        signed_headers,
        content_hash,
    ])
    string_to_sign = "\n".join([
        "AWS4-HMAC-SHA256",
        amz_date,
        credential_scope,
        hashlib.sha256(canonical_request.encode("utf-8")).hexdigest(),
    ])
    signing_key = _aws_signing_key(R2_SECRET_ACCESS_KEY, date_stamp, "auto", "s3")
    signature = hmac.new(signing_key, string_to_sign.encode("utf-8"), hashlib.sha256).hexdigest()
    headers["Authorization"] = (
        "AWS4-HMAC-SHA256 "
        f"Credential={R2_ACCESS_KEY_ID}/{credential_scope}, "
        f"SignedHeaders={signed_headers}, "
        f"Signature={signature}"
    )

    upload = requests.put(url, headers=headers, data=content, timeout=RESULT_DOWNLOAD_TIMEOUT)
    if not upload.ok:
        raise RuntimeError(f"failed to upload generated image to R2: {upload.status_code} {upload.text[:300]}")
    return f"{R2_PUBLIC_BASE_URL}/{key}"


def _aws_signing_key(secret_key: str, date_stamp: str, region: str, service: str) -> bytes:
    date_key = hmac.new(("AWS4" + secret_key).encode("utf-8"), date_stamp.encode("utf-8"), hashlib.sha256).digest()
    region_key = hmac.new(date_key, region.encode("utf-8"), hashlib.sha256).digest()
    service_key = hmac.new(region_key, service.encode("utf-8"), hashlib.sha256).digest()
    return hmac.new(service_key, b"aws4_request", hashlib.sha256).digest()


def _r2_result_key(content_type: str) -> str:
    extension = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    }.get(content_type, "jpg")
    return f"image/results/{uuid.uuid4()}.{extension}"


def _is_r2_public_url(image_url: str) -> bool:
    if not R2_PUBLIC_BASE_URL:
        return False
    return image_url.startswith(f"{R2_PUBLIC_BASE_URL}/")


def _build_tryon_prompt(body: Dict[str, Any]) -> str:
    garment_type = str(body.get("garmentType") or "clothing").strip()
    quality = str(body.get("quality") or "fast").strip()
    return (
        "Create a realistic virtual try-on result using the first image as the person/model "
        "and the second image as the garment reference. Preserve the person's face, identity, "
        "pose, body shape, hair, skin tone, camera angle, and background as much as possible. "
        f"Replace only the visible {garment_type} with the reference garment. Preserve the "
        "garment's color, pattern, material, neckline, sleeves, waistline, hem, fit, and key "
        "design details. Make the garment naturally follow the body with realistic folds, "
        "lighting, shadows, and occlusion. Do not change the person's body proportions. "
        "Do not add text, watermark, extra limbs, duplicate people, or unrelated accessories. "
        f"Output one polished ecommerce-quality try-on image. Mode: {quality}."
    )


def _extract_image_url(data: Dict[str, Any]) -> Optional[str]:
    items: List[Dict[str, Any]] = data.get("data") or data.get("images") or []
    if isinstance(items, list):
        for item in items:
            if not isinstance(item, dict):
                continue
            for key in ("url", "image_url", "content"):
                value = item.get(key)
                if isinstance(value, str) and value:
                    return value
    for key in ("url", "image_url", "result"):
        value = data.get(key)
        if isinstance(value, str) and value:
            return value
    return None


def _safe_json(resp: requests.Response) -> Dict[str, Any]:
    try:
        data = resp.json()
        return data if isinstance(data, dict) else {}
    except ValueError:
        return {"message": resp.text[:500]}


def _first_present(body: Dict[str, Any], keys: List[str]) -> str:
    for key in keys:
        value = body.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


class CreditApiError(Exception):
    def __init__(self, status: int, code: str, message: str, detail: Any = None):
        super().__init__(message)
        self.status = status
        self.code = code
        self.message = message
        self.detail = detail
