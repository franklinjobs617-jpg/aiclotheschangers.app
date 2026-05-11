type UploadKind = "model" | "garment";

const R2_IMAGE_BASE_URL = "https://cdn.aiclotheschangers.app/image";

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isDataImage(value: string) {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(value);
}

async function uploadDataImageToR2(image: string, kind: UploadKind) {
  const response = await fetch("/api/uploads/r2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image, kind }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data?.url !== "string") {
    throw new Error(data?.error || "Image upload failed");
  }
  return data.url;
}

export async function toTryonImageUrl(image: string, kind: UploadKind) {
  if (isAbsoluteUrl(image)) {
    return image;
  }
  if (isDataImage(image)) {
    return uploadDataImageToR2(image, kind);
  }
  if (image.startsWith("/models/")) {
    return `${R2_IMAGE_BASE_URL}/${image.split("/").pop()}`;
  }
  if (image.startsWith("/")) {
    return `${R2_IMAGE_BASE_URL}/${image.slice(1)}`;
  }
  return image;
}
