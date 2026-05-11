import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { extensionFor, parseDataImage, uploadBufferToR2 } from "@/lib/server/r2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UploadBody = {
  image?: unknown;
  kind?: unknown;
};

function objectKey(kind: unknown, contentType: string) {
  const safeKind = typeof kind === "string" && kind.trim()
    ? kind.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 32)
    : "image";
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `image/uploads/${safeKind}/${year}/${month}/${crypto.randomUUID()}.${extensionFor(contentType)}`;
}

export async function POST(request: NextRequest) {
  let body: UploadBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.image !== "string") {
    return NextResponse.json({ error: "image is required" }, { status: 400 });
  }

  try {
    const { buffer, contentType } = parseDataImage(body.image);
    const key = objectKey(body.kind, contentType);
    const url = await uploadBufferToR2({ buffer, contentType, key });

    return NextResponse.json({
      key,
      url,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Upload failed",
    }, { status: 500 });
  }
}
