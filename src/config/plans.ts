export type BillingMode = "payment" | "subscription";

export type PlanId = "clothes_payg" | "clothes_a_monthly" | "clothes_b_monthly";

export type PlanConfig = {
  id: PlanId;
  label: string;
  backendType: string;
  billingMode: BillingMode;
  credits: number;
  value: number;
  currency: "USD";
  stripePriceId?: string;
  itemVariant: string;
};

export const plans: Record<PlanId, PlanConfig> = {
  clothes_payg: {
    id: "clothes_payg",
    label: "Pay As You Go",
    backendType: "clothes_payg",
    billingMode: "payment",
    credits: 10,
    value: 0.99,
    currency: "USD",
    itemVariant: "10 credits"
  },
  clothes_a_monthly: {
    id: "clothes_a_monthly",
    label: "Basic Monthly",
    backendType: "clothes_a_monthly",
    billingMode: "subscription",
    credits: 100,
    value: 7.99,
    currency: "USD",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_CLOTHES_A_MONTHLY_PRICE_ID,
    itemVariant: "monthly"
  },
  clothes_b_monthly: {
    id: "clothes_b_monthly",
    label: "Pro Monthly",
    backendType: "clothes_b_monthly",
    billingMode: "subscription",
    credits: 300,
    value: 14.99,
    currency: "USD",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_CLOTHES_B_MONTHLY_PRICE_ID,
    itemVariant: "monthly"
  }
};

export function getPlanLabel(plan?: string | null) {
  if (!plan) return "Free";
  return plans[plan as PlanId]?.label ?? "Free";
}
