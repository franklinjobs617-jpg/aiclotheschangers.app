import crypto from "node:crypto";
import { extensionFor, uploadBufferToR2 } from "@/lib/server/r2";

const CREDIT_API_BASE = (process.env.CREDIT_API_BASE ?? "https://api.aiclotheschangers.app/prod-api").replace(/\/$/, "");
const CREDIT_INTERNAL_TOKEN = process.env.CREDIT_INTERNAL_TOKEN ?? "";
const SEEDDREAM_API_URL = process.env.SEEDDREAM_API_URL ?? "https://ark.cn-beijing.volces.com/api/v3/images/generations";
const SEEDDREAM_API_KEY = process.env.SEEDDREAM_API_KEY ?? "";
const SEEDDREAM_MODEL = process.env.SEEDDREAM_MODEL ?? "doubao-seedream-5-0-260128";

export type GenerateBody = {
  personImage?: unknown;
  garmentImage?: unknown;
  quality?: unknown;
  garmentType?: unknown;
  amount?: unknown;
  idempotencyKey?: unknown;
};

type CreditReserve = {
  source?: string;
  freeReserved?: number;
  paidReserved?: number;
  [key: string]: unknown;
};

export type TimingEntry = {
  name: string;
  ms: number;
};

export type TryonTask = {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: number;
  updatedAt: number;
  elapsedMs?: number;
  timings: TimingEntry[];
  imageUrl?: string;
  credit?: CreditReserve;
  error?: string;
  code?: string;
  detail?: unknown;
};

type StartTaskInput = {
  body: GenerateBody;
  personImage: string;
  garmentImage: string;
  visitorId: string;
  auth: string;
};

const globalTaskStore = globalThis as typeof globalThis & {
  __closeTryonTasks?: Map<string, TryonTask>;
};
const tasks = globalTaskStore.__closeTryonTasks ?? new Map<string, TryonTask>();
globalTaskStore.__closeTryonTasks = tasks;
const TASK_TTL_MS = 1000 * 60 * 60;

async function measure<T>(timings: TimingEntry[], name: string, fn: () => Promise<T>) {
  const startedAt = Date.now();
  try {
    return await fn();
  } finally {
    timings.push({ name, ms: Date.now() - startedAt });
  }
}

export function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function generationCost(body: GenerateBody) {
  const quality = stringValue(body.quality).toLowerCase();
  if (["hd", "high", "high_quality", "quality"].includes(quality)) return 2;
  const amount = Number(body.amount || 1);
  return Number.isFinite(amount) ? Math.max(1, Math.min(Math.trunc(amount), 10)) : 1;
}

function seedreamSize(body: GenerateBody) {
  const quality = stringValue(body.quality).toLowerCase();
  if (["hd", "high", "high_quality", "quality"].includes(quality)) {
    return process.env.SEEDDREAM_HD_SIZE || "4k";
  }
  return process.env.SEEDDREAM_FAST_SIZE || "2k";
}

function buildPrompt(body: GenerateBody) {
  const garmentType = stringValue(body.garmentType) || "clothing";
  const quality = "fast";
  return [
    "Create a realistic virtual try-on result using the first image as the person/model and the second image as the garment reference.",
    "Preserve the person's face, identity, pose, body shape, hair, skin tone, camera angle, and background as much as possible.",
    `Replace only the visible ${garmentType} with the reference garment.`,
    "Preserve the garment's color, pattern, material, neckline, sleeves, waistline, hem, fit, and key design details.",
    "Make the garment naturally follow the body with realistic folds, lighting, shadows, and occlusion.",
    "Do not change the person's body proportions. Do not add text, watermark, extra limbs, duplicate people, or unrelated accessories.",
    `Output one polished ecommerce-quality try-on image. Mode: ${quality}.`,
  ].join(" ");
}

async function readJson(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

async function callCredit(action: "reserve" | "commit" | "refund", payload: Record<string, unknown>, auth: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-App-Type": "close",
  };
  if (auth) headers.Authorization = auth;
  if ((action === "commit" || action === "refund") && CREDIT_INTERNAL_TOKEN) {
    headers["X-Internal-Token"] = CREDIT_INTERNAL_TOKEN;
  }

  const response = await fetch(`${CREDIT_API_BASE}/credit/${action}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await readJson(response);
  if (!response.ok || Number(data?.code ?? 200) !== 200) {
    throw Object.assign(new Error(String(data?.msg || data?.error || "credit error")), {
      status: response.status,
      code: String(data?.code || "CREDIT_ERROR"),
      detail: data,
    });
  }
  return (data?.data || {}) as CreditReserve;
}

function commitPayload(base: Record<string, unknown>, reserve: CreditReserve) {
  return {
    ...base,
    source: stringValue(reserve.source),
    freeAmount: Number(reserve.freeReserved || 0),
    paidAmount: Number(reserve.paidReserved || 0),
  };
}

async function callSeedream(personImage: string, garmentImage: string, body: GenerateBody) {
  if (!SEEDDREAM_API_KEY) {
    throw Object.assign(new Error("SEEDDREAM_API_KEY is not configured"), { code: "SEEDDREAM_NOT_CONFIGURED" });
  }

  const response = await fetch(SEEDDREAM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SEEDDREAM_API_KEY}`,
    },
    body: JSON.stringify({
      model: SEEDDREAM_MODEL,
      prompt: buildPrompt(body),
      image: [personImage, garmentImage],
      sequential_image_generation: "disabled",
      response_format: "url",
      size: seedreamSize(body),
      stream: false,
      watermark: true,
    }),
    cache: "no-store",
  });

  const data = await readJson(response);
  if (!response.ok) {
    throw Object.assign(new Error(String(data?.message || data?.error || "Seedream generation failed")), {
      code: String(data?.code || "SEEDDREAM_ERROR"),
      detail: data,
    });
  }

  const items = Array.isArray(data?.data) ? data.data : Array.isArray(data?.images) ? data.images : [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    for (const key of ["url", "image_url", "content"]) {
      const value = (item as Record<string, unknown>)[key];
      if (typeof value === "string" && value) return value;
    }
  }
  for (const key of ["url", "image_url", "result"]) {
    const value = data?.[key];
    if (typeof value === "string" && value) return value;
  }
  throw Object.assign(new Error("Seedream response did not contain an image url"), { code: "SEEDDREAM_EMPTY_RESULT", detail: data });
}

async function mirrorResultToR2(imageUrl: string) {
  const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (publicBase && imageUrl.startsWith(`${publicBase}/`)) return imageUrl;

  const response = await fetch(imageUrl, { cache: "no-store" });
  if (!response.ok) {
    throw Object.assign(new Error(`failed to download generated image: ${response.status}`), { code: "RESULT_DOWNLOAD_FAILED" });
  }
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() || "image/jpeg";
  const normalizedContentType = contentType.startsWith("image/") ? contentType : "image/jpeg";
  const key = `image/results/${crypto.randomUUID()}.${extensionFor(normalizedContentType)}`;
  return uploadBufferToR2({
    buffer: Buffer.from(arrayBuffer),
    contentType: normalizedContentType,
    key,
  });
}

function cleanupTasks() {
  const now = Date.now();
  for (const [id, task] of tasks) {
    if (now - task.updatedAt > TASK_TTL_MS) {
      tasks.delete(id);
    }
  }
}

function updateTask(id: string, patch: Partial<TryonTask>) {
  const current = tasks.get(id);
  if (!current) return;
  tasks.set(id, { ...current, ...patch, updatedAt: Date.now() });
}

async function runTask(taskId: string, input: StartTaskInput, reservePayload: Record<string, unknown>, reserve: CreditReserve, startedAt: number) {
  const timings = tasks.get(taskId)?.timings || [];
  updateTask(taskId, { status: "processing", timings, credit: reserve });

  try {
    const seedreamUrl = await measure(timings, "seedream.generate", () => callSeedream(input.personImage, input.garmentImage, input.body));
    const imageUrl = await measure(timings, "result.mirrorToR2", () => mirrorResultToR2(seedreamUrl));
    await measure(timings, "credit.commit", () => callCredit("commit", commitPayload(reservePayload, reserve), input.auth));

    const elapsedMs = Date.now() - startedAt;
    updateTask(taskId, {
      status: "completed",
      imageUrl,
      credit: reserve,
      elapsedMs,
      timings,
    });
    console.info("[tryon.task.completed]", { taskId, elapsedMs, timings, size: seedreamSize(input.body), model: SEEDDREAM_MODEL });
  } catch (error) {
    await measure(timings, "credit.refund", () => callCredit("refund", commitPayload(reservePayload, reserve), input.auth)).catch(() => undefined);
    const typed = error as Error & { code?: string; detail?: unknown };
    const elapsedMs = Date.now() - startedAt;
    updateTask(taskId, {
      status: "failed",
      error: typed.message || "Generation failed",
      code: typed.code || "TRYON_GENERATION_FAILED",
      detail: typed.detail,
      elapsedMs,
      timings,
    });
    console.info("[tryon.task.failed]", { taskId, elapsedMs, timings, code: typed.code, message: typed.message });
  }
}

export async function submitTryonTask(input: StartTaskInput) {
  cleanupTasks();

  const taskId = crypto.randomUUID();
  const startedAt = Date.now();
  const timings: TimingEntry[] = [];
  const reservePayload = {
    project: "aiclotheschangers",
    appType: "9",
    visitorId: input.visitorId,
    amount: generationCost(input.body),
    idempotencyKey: stringValue(input.body.idempotencyKey) || taskId,
  };

  const task: TryonTask = {
    id: taskId,
    status: "queued",
    createdAt: startedAt,
    updatedAt: startedAt,
    timings,
  };
  tasks.set(taskId, task);

  try {
    const reserve = await measure(timings, "credit.reserve", () => callCredit("reserve", reservePayload, input.auth));
    updateTask(taskId, { status: "processing", credit: reserve, timings });
    void runTask(taskId, input, reservePayload, reserve, startedAt);
    return tasks.get(taskId) as TryonTask;
  } catch (error) {
    const typed = error as Error & { code?: string; detail?: unknown; status?: number };
    updateTask(taskId, {
      status: "failed",
      error: typed.message || "Credit reserve failed",
      code: typed.code || "CREDIT_RESERVE_FAILED",
      detail: typed.detail,
      elapsedMs: Date.now() - startedAt,
      timings,
    });
    throw Object.assign(typed, { task: tasks.get(taskId) });
  }
}

export function getTryonTask(taskId: string) {
  cleanupTasks();
  return tasks.get(taskId) || null;
}
