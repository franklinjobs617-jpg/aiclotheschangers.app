export type BillingMode = "payment" | "subscription";

export type PlanId =
  | "close_standard_monthly"
  | "close_standard_yearly"
  | "close_professional_monthly"
  | "close_professional_yearly"
  | "close_starter"
  | "close_best_value"
  | "close_growth"
  | "close_business";

export type PlanConfig = {
  id: PlanId;
  label: string;
  backendType: string;
  billingMode: BillingMode;
  credits: number;
  value: number;
  currency: "USD";
  stripePriceId: string;
  itemVariant: string;
};

export const plans: Record<PlanId, PlanConfig> = {
  close_standard_monthly: {
    id: "close_standard_monthly",
    label: "Standard Monthly",
    backendType: "close_standard_monthly",
    billingMode: "subscription",
    credits: 200,
    value: 15.9,
    currency: "USD",
    stripePriceId: "price_1TWuYe8mZdtey8u2iH6VBFiq",
    itemVariant: "monthly"
  },
  close_standard_yearly: {
    id: "close_standard_yearly",
    label: "Standard Yearly",
    backendType: "close_standard_yearly",
    billingMode: "subscription",
    credits: 200,
    value: 9.9,
    currency: "USD",
    stripePriceId: "price_1TWuZC8mZdtey8u28wafMPv9",
    itemVariant: "yearly"
  },
  close_professional_monthly: {
    id: "close_professional_monthly",
    label: "Professional Monthly",
    backendType: "close_professional_monthly",
    billingMode: "subscription",
    credits: 600,
    value: 34.9,
    currency: "USD",
    stripePriceId: "price_1TWua88mZdtey8u2JO8LbZY5",
    itemVariant: "monthly"
  },
  close_professional_yearly: {
    id: "close_professional_yearly",
    label: "Professional Yearly",
    backendType: "close_professional_yearly",
    billingMode: "subscription",
    credits: 600,
    value: 199,
    currency: "USD",
    stripePriceId: "price_1TWuai8mZdtey8u2txmf7lKC",
    itemVariant: "yearly"
  },
  close_starter: {
    id: "close_starter",
    label: "One-time Pack STARTER",
    backendType: "close_starter",
    billingMode: "payment",
    credits: 50,
    value: 4.9,
    currency: "USD",
    stripePriceId: "price_1TWuUj8mZdtey8u2UA8OUtZC",
    itemVariant: "50 credits"
  },
  close_best_value: {
    id: "close_best_value",
    label: "One-time Pack BEST VALUE",
    backendType: "close_best_value",
    billingMode: "payment",
    credits: 100,
    value: 9.9,
    currency: "USD",
    stripePriceId: "price_1TWuVt8mZdtey8u2A7Fi7VEG",
    itemVariant: "100 credits"
  },
  close_growth: {
    id: "close_growth",
    label: "One-time Pack GROWTH",
    backendType: "close_growth",
    billingMode: "payment",
    credits: 200,
    value: 19.9,
    currency: "USD",
    stripePriceId: "price_1TWuWx8mZdtey8u2apHNfHBt",
    itemVariant: "200 credits"
  },
  close_business: {
    id: "close_business",
    label: "One-time Pack BUSINESS",
    backendType: "close_business",
    billingMode: "payment",
    credits: 500,
    value: 49.9,
    currency: "USD",
    stripePriceId: "price_1TWuXa8mZdtey8u2S0R7MJpM",
    itemVariant: "500 credits"
  }
};

export function getPlanLabel(plan?: string | null) {
  if (!plan) return "Free";
  return plans[plan as PlanId]?.label ?? "Free";
}
