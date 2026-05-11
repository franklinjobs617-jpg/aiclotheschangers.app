import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { GenerateBody, stringValue, submitTryonTask } from "@/lib/server/tryonTasks";

const VISITOR_COOKIE = "close_visitor_id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, code: string, error: string, detail?: unknown) {
  return NextResponse.json({ code, error, detail }, { status });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const existingVisitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  const visitorId = existingVisitorId || crypto.randomUUID();

  let body: GenerateBody;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "BAD_REQUEST", "Invalid JSON body");
  }

  const personImage = stringValue(body.personImage);
  const garmentImage = stringValue(body.garmentImage);
  if (!personImage || !garmentImage) {
    return jsonError(400, "BAD_REQUEST", "personImage and garmentImage are required");
  }

  try {
    const task = await submitTryonTask({
      body,
      personImage,
      garmentImage,
      visitorId,
      auth: request.headers.get("authorization") || "",
    });

    const response = NextResponse.json({
      taskId: task.id,
      status: task.status,
      timings: task.timings,
    }, { status: 202 });

    if (!existingVisitorId) {
      response.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return response;
  } catch (error) {
    const typed = error as Error & { status?: number; code?: string; detail?: unknown; task?: unknown };
    return jsonError(typed.status || 502, typed.code || "TRYON_SUBMIT_FAILED", typed.message || "Submit failed", {
      detail: typed.detail,
      task: typed.task,
    });
  }
}
