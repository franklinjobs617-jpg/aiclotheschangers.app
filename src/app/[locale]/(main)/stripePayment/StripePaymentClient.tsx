"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = "https://api.aiclotheschangers.app/prod-api";
const POLL_INTERVAL = 3000;
const MAX_ATTEMPTS = 40;

type Status = "loading" | "success" | "failed" | "timeout";

export default function StripePaymentClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    let attempts = 0;
    let timer: ReturnType<typeof setInterval>;

    const checkStatus = async () => {
      attempts++;
      try {
        const res = await fetch(
          `${API_BASE}/stripe/check-order-status?sessionId=${encodeURIComponent(sessionId)}`
        );
        if (!res.ok) return;
        const json = await res.json();
        const orderStatus = json.data ?? json.status;

        if (orderStatus === "paid") {
          setStatus("success");
          clearInterval(timer);
        } else if (attempts >= MAX_ATTEMPTS) {
          setStatus("timeout");
          clearInterval(timer);
        }
      } catch {
        if (attempts >= MAX_ATTEMPTS) {
          setStatus("timeout");
          clearInterval(timer);
        }
      }
    };

    checkStatus();
    timer = setInterval(checkStatus, POLL_INTERVAL);

    return () => clearInterval(timer);
  }, [sessionId]);

  if (status === "loading") return <LoadingState />;
  if (status === "success") return <SuccessState />;
  return <FailState isTimeout={status === "timeout"} />;
}

/* ======================== Loading ======================== */

function LoadingState() {
  return (
    <section className="payment-result-page">
      <style>{loadingStyles}</style>
      <div className="pr-spinner-wrap">
        <div className="pr-spinner" />
        <div className="pr-spinner-dot" />
      </div>
      <h1 className="pr-title">Processing Payment...</h1>
      <p className="pr-sub">Please wait while we confirm your payment with Stripe.</p>
    </section>
  );
}

/* ======================== Success ======================== */

function SuccessState() {
  return (
    <section className="payment-result-page">
      <style>{successStyles}</style>

      {/* Firework particles */}
      <div className="pr-fw-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`pr-fw-particle pr-fw-${i + 1}`} />
        ))}
        <div className="pr-fw-ring pr-fw-ring-1" />
        <div className="pr-fw-ring pr-fw-ring-2" />
      </div>

      {/* Big check badge */}
      <div className="pr-success-badge">
        <svg viewBox="0 0 72 72" fill="none" className="pr-check-svg">
          <circle cx="36" cy="36" r="34" fill="url(#successGrad)" stroke="#fff" strokeWidth="3" />
          <path
            className="pr-check-path"
            d="M22 37 L32 47 L50 27"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <defs>
            <linearGradient id="successGrad" x1="0" y1="0" x2="72" y2="72">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Confetti */}
      <div className="pr-confetti">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`pr-confetti-piece pr-confetti-${(i % 6) + 1}`} style={{ left: `${5 + i * 4.5}%` }} />
        ))}
      </div>

      <div className="pr-card pr-card-success">
        <h1 className="pr-title" style={{ color: "#065f46" }}>Payment Successful!</h1>
        <p className="pr-sub">
          Your credits have been added to your account.
          <br />
          You are ready to create amazing outfits!
        </p>
      </div>

      <Link href="/editor/" className="pr-btn pr-btn-primary">
        Start Creating
      </Link>
    </section>
  );
}

/* ======================== Fail / Timeout ======================== */

function FailState({ isTimeout }: { isTimeout: boolean }) {
  return (
    <section className="payment-result-page">
      <style>{failStyles}</style>

      {/* Shake illustration */}
      <div className="pr-fail-illustration">
        <div className="pr-fail-circle">
          <div className="pr-fail-inner">
            {isTimeout ? (
              /* Clock icon drawn with CSS */
              <div className="pr-clock">
                <div className="pr-clock-face">
                  <div className="pr-clock-hand pr-clock-hand-h" />
                  <div className="pr-clock-hand pr-clock-hand-m" />
                  <div className="pr-clock-dot" />
                </div>
              </div>
            ) : (
              /* X icon drawn with CSS */
              <div className="pr-x-icon">
                <div className="pr-x-line pr-x-line-1" />
                <div className="pr-x-line pr-x-line-2" />
              </div>
            )}
          </div>
        </div>

        {/* Broken card illustration */}
        <div className="pr-broken-card">
          <div className="pr-broken-left" />
          <div className="pr-broken-right" />
        </div>
      </div>

      <div className={`pr-card ${isTimeout ? "pr-card-timeout" : "pr-card-fail"}`}>
        <h1 className="pr-title" style={{ color: isTimeout ? "#92400e" : "#991b1b" }}>
          {isTimeout ? "Payment Verification Timeout" : "Payment Failed"}
        </h1>
        <p className="pr-sub">
          {isTimeout
            ? "We could not confirm your payment. If you were charged, please contact support and we will resolve it promptly."
            : "Something went wrong with your payment. Don't worry — you have not been charged."}
        </p>
      </div>

      <div className="pr-btn-row">
        <Link href="/pricing/" className="pr-btn pr-btn-primary" style={{ color: "#ffffff", display: "inline-flex" }}>
          Back to Pricing
        </Link>
        <a
          href="mailto:admin@aiclotheschangers.app"
          className="pr-btn pr-btn-outline"
          style={{ color: "#1d8a84", display: "inline-flex" }}
        >
          Contact Support
        </a>
      </div>
    </section>
  );
}

/* ======================== Styles: shared ======================== */

const loadingStyles = `
.payment-result-page {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 70vh; padding: 24px 16px; text-align: center;
}
.pr-spinner-wrap { position: relative; width: 64px; height: 64px; margin-bottom: 32px; }
.pr-spinner {
  width: 64px; height: 64px; border-radius: 50%;
  border: 4px solid #e5e7eb; border-top-color: #1d8a84;
  animation: pr-spin 0.9s linear infinite;
}
.pr-spinner-dot {
  position: absolute; top: 50%; left: 50%; width: 10px; height: 10px;
  margin: -5px 0 0 -5px; border-radius: 50%; background: #1d8a84;
  animation: pr-pulse-dot 1.4s ease-in-out infinite;
}
@keyframes pr-spin { to { transform: rotate(360deg); } }
@keyframes pr-pulse-dot {
  0%, 100% { transform: scale(0.6); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 1; }
}
.pr-title { font-size: 1.5rem; font-weight: 600; color: #222529; margin-top: 0; }
.pr-sub { font-size: 0.875rem; line-height: 1.6; color: #69717f; margin-top: 12px; max-width: 360px; }
`;

/* ======================== Styles: success ======================== */

const successStyles = `
.payment-result-page {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 70vh; padding: 24px 16px; text-align: center; position: relative; overflow: hidden;
}

/* Firework burst */
.pr-fw-container { position: absolute; top: 20%; left: 50%; width: 0; height: 0; pointer-events: none; }
.pr-fw-particle {
  position: absolute; width: 6px; height: 6px; border-radius: 50%;
  animation: pr-fw-fly 1.2s ease-out forwards; opacity: 0;
}
.pr-fw-1  { background: #f59e0b; animation-delay: 0.0s; --fw-angle: 0deg;   --fw-dist: 110px; }
.pr-fw-2  { background: #ef4444; animation-delay: 0.05s; --fw-angle: 30deg;  --fw-dist: 130px; }
.pr-fw-3  { background: #3b82f6; animation-delay: 0.1s; --fw-angle: 60deg;  --fw-dist: 100px; }
.pr-fw-4  { background: #10b981; animation-delay: 0.02s; --fw-angle: 90deg;  --fw-dist: 120px; }
.pr-fw-5  { background: #f59e0b; animation-delay: 0.08s; --fw-angle: 120deg; --fw-dist: 140px; }
.pr-fw-6  { background: #ec4899; animation-delay: 0.12s; --fw-angle: 150deg; --fw-dist: 105px; }
.pr-fw-7  { background: #8b5cf6; animation-delay: 0.03s; --fw-angle: 180deg; --fw-dist: 125px; }
.pr-fw-8  { background: #ef4444; animation-delay: 0.07s; --fw-angle: 210deg; --fw-dist: 115px; }
.pr-fw-9  { background: #06b6d4; animation-delay: 0.11s; --fw-angle: 240deg; --fw-dist: 135px; }
.pr-fw-10 { background: #f59e0b; animation-delay: 0.04s; --fw-angle: 270deg; --fw-dist: 108px; }
.pr-fw-11 { background: #10b981; animation-delay: 0.09s; --fw-angle: 300deg; --fw-dist: 128px; }
.pr-fw-12 { background: #ec4899; animation-delay: 0.06s; --fw-angle: 330deg; --fw-dist: 118px; }

@keyframes pr-fw-fly {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  70%  { opacity: 1; }
  100% { transform: translate(calc(cos(var(--fw-angle)) * var(--fw-dist)), calc(sin(var(--fw-angle)) * var(--fw-dist))) scale(0); opacity: 0; }
}

/* Expanding rings */
.pr-fw-ring {
  position: absolute; border-radius: 50%; border: 3px solid #34d399;
  animation: pr-ring-expand 1.4s ease-out forwards; opacity: 0;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
}
.pr-fw-ring-1 { animation-delay: 0.1s; }
.pr-fw-ring-2 { animation-delay: 0.35s; border-color: #a7f3d0; }
@keyframes pr-ring-expand {
  0%   { width: 0; height: 0; opacity: 0.8; }
  100% { width: 220px; height: 220px; opacity: 0; }
}

/* Confetti */
.pr-confetti { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; }
.pr-confetti-piece {
  position: absolute; top: -10px; width: 8px; height: 14px; border-radius: 2px;
  animation: pr-confetti-fall 2.8s ease-in forwards;
}
.pr-confetti-1 { background: #f59e0b; animation-delay: 0.2s; }
.pr-confetti-2 { background: #ef4444; animation-delay: 0.5s; }
.pr-confetti-3 { background: #3b82f6; animation-delay: 0.8s; }
.pr-confetti-4 { background: #10b981; animation-delay: 0.3s; }
.pr-confetti-5 { background: #ec4899; animation-delay: 0.6s; }
.pr-confetti-6 { background: #8b5cf6; animation-delay: 0.9s; }

@keyframes pr-confetti-fall {
  0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg) scale(0.4); opacity: 0; }
}

/* Check badge */
.pr-success-badge {
  width: 100px; height: 100px; position: relative; z-index: 2;
  animation: pr-badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.pr-check-svg { width: 100%; height: 100%; }
.pr-check-path {
  stroke-dasharray: 60; stroke-dashoffset: 60;
  animation: pr-check-draw 0.5s ease-out 0.4s forwards;
}
@keyframes pr-badge-pop {
  0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
  60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes pr-check-draw {
  to { stroke-dashoffset: 0; }
}

/* Shared */
.pr-card {
  margin-top: 32px; padding: 28px 36px; border-radius: 20px; text-align: center;
  position: relative; z-index: 2; max-width: 440px;
}
.pr-card-success {
  border: 1px solid #d1fae5;
  background: linear-gradient(to bottom, rgba(209,250,229,0.4), #ffffff);
}
.pr-title { font-size: 1.5rem; font-weight: 600; color: #222529; margin: 0; }
.pr-sub { font-size: 0.875rem; line-height: 1.7; color: #69717f; margin-top: 12px; }
.pr-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 48px; padding: 0 32px; border-radius: 12px;
  font-size: 0.875rem; font-weight: 600; text-decoration: none;
  transition: all 0.2s; margin-top: 32px; position: relative; z-index: 2;
}
.pr-btn-primary {
  background: linear-gradient(to right, #222529, #353b44); color: #ffffff !important;
  box-shadow: 0 10px 15px -3px rgba(34,37,41,0.2);
}
.pr-btn-primary:hover { box-shadow: 0 20px 25px -5px rgba(34,37,41,0.25); transform: translateY(-1px); }
`;

/* ======================== Styles: fail ======================== */

const failStyles = `
.payment-result-page {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 70vh; padding: 24px 16px; text-align: center; position: relative;
}

/* Illustration */
.pr-fail-illustration { position: relative; margin-bottom: 8px; }

.pr-fail-circle {
  width: 110px; height: 110px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  animation: pr-fail-appear 0.5s ease-out forwards;
}
.pr-fail-inner { display: flex; align-items: center; justify-content: center; }

/* X icon */
.pr-x-icon { position: relative; width: 48px; height: 48px; }
.pr-x-line {
  position: absolute; top: 50%; left: 50%; width: 40px; height: 5px;
  border-radius: 3px; margin: -2.5px 0 0 -20px;
  animation: pr-x-draw 0.4s ease-out forwards;
}
.pr-x-line-1 { background: #ef4444; transform: rotate(45deg); animation-delay: 0.2s; }
.pr-x-line-2 { background: #ef4444; transform: rotate(-45deg); animation-delay: 0.35s; }

@keyframes pr-x-draw {
  0%   { transform: scaleX(0) rotate(var(--x-rot, 45deg)); }
  100% { transform: scaleX(1) rotate(var(--x-rot, 45deg)); }
}
.pr-x-line-1 { --x-rot: 45deg; }
.pr-x-line-2 { --x-rot: -45deg; }

/* Clock icon */
.pr-clock { width: 48px; height: 48px; position: relative; }
.pr-clock-face {
  width: 48px; height: 48px; border-radius: 50%; border: 4px solid #f59e0b;
  position: relative; animation: pr-clock-appear 0.4s ease-out forwards;
}
.pr-clock-dot {
  position: absolute; top: 50%; left: 50%; width: 6px; height: 6px;
  border-radius: 50%; background: #f59e0b; margin: -3px 0 0 -3px;
}
.pr-clock-hand {
  position: absolute; bottom: 50%; left: 50%; border-radius: 2px; background: #f59e0b;
  transform-origin: bottom center;
}
.pr-clock-hand-h { width: 3px; height: 12px; margin-left: -1.5px; animation: pr-rotate-h 3s linear infinite; }
.pr-clock-hand-m { width: 2px; height: 16px; margin-left: -1px; animation: pr-rotate-m 1.5s linear infinite; }

@keyframes pr-rotate-h  { to { transform: rotate(360deg); } }
@keyframes pr-rotate-m  { to { transform: rotate(360deg); } }
@keyframes pr-clock-appear {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

/* Broken card */
.pr-broken-card {
  position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%);
  width: 70px; height: 44px; display: flex; gap: 3px;
  animation: pr-broken-appear 0.6s ease-out 0.5s forwards; opacity: 0;
}
.pr-broken-left, .pr-broken-right {
  flex: 1; border-radius: 6px; border: 2px solid #d1d5db; background: #f9fafb;
}
.pr-broken-left  { transform: rotate(-6deg); animation: pr-crack-left 0.5s ease-out 0.6s forwards; }
.pr-broken-right { transform: rotate(6deg);  animation: pr-crack-right 0.5s ease-out 0.6s forwards; }

@keyframes pr-broken-appear { to { opacity: 1; } }
@keyframes pr-crack-left  { 0% { transform: rotate(0deg) translateX(0); } 100% { transform: rotate(-8deg) translateX(-4px); } }
@keyframes pr-crack-right { 0% { transform: rotate(0deg) translateX(0); } 100% { transform: rotate(8deg) translateX(4px); } }

@keyframes pr-fail-appear {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
}

.pr-card {
  margin-top: 28px; padding: 28px 36px; border-radius: 20px; text-align: center;
  max-width: 440px;
}
.pr-card-fail    { border: 1px solid #fee2e2; background: linear-gradient(to bottom, rgba(254,226,226,0.3), #ffffff); }
.pr-card-timeout { border: 1px solid #fef3c7; background: linear-gradient(to bottom, rgba(254,243,199,0.3), #ffffff); }
.pr-title { font-size: 1.5rem; font-weight: 600; margin: 0; }
.pr-sub { font-size: 0.875rem; line-height: 1.7; color: #69717f; margin-top: 12px; max-width: 380px; }

.pr-btn-row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 32px; }
.pr-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 48px; padding: 0 32px; border-radius: 12px;
  font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.pr-btn-primary {
  background-color: #222529; color: #ffffff !important;
  box-shadow: 0 10px 15px -3px rgba(34,37,41,0.15);
}
.pr-btn-primary:hover { background-color: #353b44; box-shadow: 0 20px 25px -5px rgba(34,37,41,0.2); transform: translateY(-1px); }
.pr-btn-outline {
  background-color: #ffffff; color: #1d8a84 !important;
  border: 1px solid #e5e7eb;
}
.pr-btn-outline:hover { border-color: rgba(35,167,160,0.4); background-color: #effbf8; }
`;
