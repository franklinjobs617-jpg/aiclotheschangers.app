"use client";

const STRIPE_PURCHASE_CONTEXT_KEY = "aicc_stripe_purchase_context";
const STRIPE_PURCHASE_CONTEXT_TTL_MS = 4 * 60 * 60 * 1000;

export type StripePurchaseContext = {
  kind: "subscription" | "credits";
  item_name: string;
  value: number;
  currency: "USD";
  quantity: number;
  item_variant: string;
  createdAt: number;
};

export function saveStripePurchaseContext(context: Omit<StripePurchaseContext, "createdAt">) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STRIPE_PURCHASE_CONTEXT_KEY,
    JSON.stringify({
      ...context,
      createdAt: Date.now()
    })
  );
}

export function readStripePurchaseContext(): StripePurchaseContext | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STRIPE_PURCHASE_CONTEXT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StripePurchaseContext;
    if (!parsed?.item_name || typeof parsed.value !== "number") return null;

    if (!parsed.createdAt || Date.now() - parsed.createdAt > STRIPE_PURCHASE_CONTEXT_TTL_MS) {
      clearStripePurchaseContext();
      return null;
    }

    return parsed;
  } catch {
    clearStripePurchaseContext();
    return null;
  }
}

export function clearStripePurchaseContext() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STRIPE_PURCHASE_CONTEXT_KEY);
}
