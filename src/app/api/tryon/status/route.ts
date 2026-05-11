import { NextRequest, NextResponse } from "next/server";
import { getTryonTask } from "@/lib/server/tryonTasks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get("id")?.trim();
  if (!taskId) {
    return NextResponse.json({ code: "BAD_REQUEST", error: "id is required" }, { status: 400 });
  }

  const task = getTryonTask(taskId);
  if (!task) {
    return NextResponse.json({ code: "NOT_FOUND", error: "task not found" }, { status: 404 });
  }

  return NextResponse.json({
    taskId: task.id,
    status: task.status,
    imageUrl: task.imageUrl,
    credit: task.credit,
    error: task.error,
    code: task.code,
    detail: task.detail,
    elapsedMs: task.elapsedMs,
    timings: task.timings,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  });
}
