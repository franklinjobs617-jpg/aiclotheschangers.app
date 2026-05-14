import { Suspense } from "react";
import type { Metadata } from "next";
import StripePaymentClient from "./StripePaymentClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function StripePaymentPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-semibold text-[#222529]">Loading...</h1>
        </section>
      }
    >
      <StripePaymentClient />
    </Suspense>
  );
}
