import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

let client: S3Client | null = null;

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const endpoint = process.env.R2_ENDPOINT?.trim() || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    throw new Error("R2 upload is not configured");
  }
  if (secretAccessKey.startsWith("cfut_")) {
    throw new Error("R2_SECRET_ACCESS_KEY must be the R2 S3 secret access key, not a Cloudflare API token");
  }

  return { endpoint, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

function getR2Client() {
  if (client) return client;
  const config = getR2Config();
  client = new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return client;
}

export function parseDataImage(image: string) {
  const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/);
  if (!match) {
    throw new Error("Only base64 image data URLs are supported");
  }

  const contentType = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length) {
    throw new Error("Image is empty");
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large");
  }

  return { buffer, contentType };
}

export function extensionFor(contentType: string) {
  switch (contentType) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/heic":
      return "heic";
    case "image/heif":
      return "heif";
    default:
      return "bin";
  }
}

export function r2PublicUrl(key: string) {
  return `${getR2Config().publicBaseUrl}/${key}`;
}

export async function uploadBufferToR2(input: {
  buffer: Buffer;
  contentType: string;
  key: string;
  cacheControl?: string;
}) {
  const { bucket } = getR2Config();
  await getR2Client().send(new PutObjectCommand({
    Bucket: bucket,
    Key: input.key,
    Body: input.buffer,
    ContentType: input.contentType,
    CacheControl: input.cacheControl ?? "public, max-age=31536000, immutable",
  }));
  return r2PublicUrl(input.key);
}
