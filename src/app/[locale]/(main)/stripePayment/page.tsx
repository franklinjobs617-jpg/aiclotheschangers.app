import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function StripePaymentPage() {
  return (
    <section className="section">
      <div className="container narrow" style={{ textAlign: "center", padding: "120px 0" }}>
        <h1>Processing Payment...</h1>
        <p style={{ color: "var(--muted)", marginTop: "16px" }}>
          Please wait while we confirm your payment.
        </p>
      </div>
    </section>
  );
}
