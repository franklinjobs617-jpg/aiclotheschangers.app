import { NextRequest } from "next/server";
import { POST as submitPost } from "../submit/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return submitPost(request);
}
