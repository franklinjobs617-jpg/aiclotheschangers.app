"use client";

import type { PlanConfig } from "@/config/plans";

const AUTH_TOKEN_KEY = "close_auth_token";
const AUTH_USER_KEY = "close_loggedInUser";
const API_BASE = "https://api.aiclotheschangers.app/prod-api";

export async function startCheckout(
  plan: PlanConfig,
  openLoginModal: () => void
): Promise<void> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!token || !rawUser) {
    openLoginModal();
    return;
  }

  let googleUserId: string;
  try {
    const user = JSON.parse(rawUser);
    googleUserId = user.googleUserId;
    if (!googleUserId) {
      openLoginModal();
      return;
    }
  } catch {
    openLoginModal();
    return;
  }

  const res = await fetch(`${API_BASE}/stripe/getPayUrl`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: plan.backendType,
      googleUserId,
      project: "aiclotheschanger",
    }),
  });

  if (!res.ok) {
    throw new Error(`Checkout request failed: ${res.status}`);
  }

  const json = await res.json();
  const url = json.data ?? json.url ?? json.checkoutUrl;

  if (typeof url === "string" && url.startsWith("http")) {
    window.location.href = url;
  } else {
    throw new Error("No checkout URL returned from server");
  }
}
