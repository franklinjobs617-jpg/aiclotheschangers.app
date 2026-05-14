"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

/* ── Feature list item ── */
function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-gray-600">
      <span className="text-gray-400">✦</span>
      <span>{text}</span>
    </div>
  );
}

/* ── Google login button ── */
function SocialButton({
  icon,
  label,
  onClick,
  dataModalLast,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  dataModalLast?: boolean;
}) {
  return (
    <button
      type="button"
      data-modal-last={dataModalLast ? true : undefined}
      className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white text-[14px] font-medium text-gray-700 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 active:scale-[0.98]"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [imgError, setImgError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const prevActiveElement = useRef<HTMLElement | null>(null);

  // Handle Escape key + focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (
        e.key === "Tab" &&
        modalRef.current &&
        !e.shiftKey &&
        document.activeElement === modalRef.current.querySelector("[data-modal-last]")
      ) {
        e.preventDefault();
        (modalRef.current.querySelector("[data-modal-first]") as HTMLElement)?.focus();
      }
      if (
        e.key === "Tab" &&
        e.shiftKey &&
        modalRef.current &&
        document.activeElement === modalRef.current.querySelector("[data-modal-first]")
      ) {
        e.preventDefault();
        (modalRef.current.querySelector("[data-modal-last]") as HTMLElement)?.focus();
      }
    },
    [onClose]
  );

  // Manage focus and body scroll lock
  useEffect(() => {
    if (!open) return;

    prevActiveElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const timer = requestAnimationFrame(() => {
      modalRef.current?.querySelector<HTMLElement>("[data-modal-first]")?.focus();
    });

    return () => {
      cancelAnimationFrame(timer);
      document.body.style.overflow = "";
      (prevActiveElement.current as HTMLElement)?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] animate-in fade-in-0 duration-200"
      onClick={onClose}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal — centered on screen */}
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 z-[101] w-[min(900px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/20 md:grid md:grid-cols-[340px_1fr]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        {/* ===== Left: Image Section ===== */}
        <div className="relative hidden min-h-[400px] overflow-hidden bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-500 md:block">
          {/* 图片 — 使用 object-contain 确保完整显示，不裁剪 */}
          <Image
            src="/cf2c28fe-55c4-4ddd-b1ca-574628d82657.png"
            alt=""
            fill
            sizes="(max-width: 768px) 0vw, 380px"
            className={`object-contain p-4 transition-opacity duration-300 ${imgError ? "opacity-0" : "opacity-100"}`}
            priority
            onError={() => setImgError(true)}
          />

          {/* 图片加载失败时的降级文案 */}
          {imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
              <div className="mb-4 text-6xl">👕</div>
              <h3 className="mb-3 text-[22px] font-bold leading-tight">
                AI Clothes<br />Changer
              </h3>
              <p className="max-w-[240px] text-[13px] leading-relaxed text-white/80">
                Transform your wardrobe with AI-powered virtual try-on technology
              </p>
            </div>
          )}

          {/* 底部品牌标识 */}
          <div className="absolute bottom-6 left-0 right-0 px-8">
            <p className="text-center text-[11px] text-white/50">
              AI-Powered Fashion
            </p>
          </div>
        </div>

        {/* ===== Right: Form Section ===== */}
        <div className="relative flex flex-col px-10 py-11 sm:px-8 sm:py-9">
          {/* Close button */}
          <button
            type="button"
            data-modal-first
            className="group absolute right-3.5 top-3.5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-gray-100 text-gray-500 outline-none transition-all duration-150 hover:bg-gray-200 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 active:scale-95"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} strokeWidth={2} />
          </button>

          {/* Title */}
          <h2
            id="login-title"
            className="mt-1 mb-5 text-[22px] font-semibold leading-snug tracking-tight text-gray-900"
          >
            Sign in to continue
          </h2>

          {/* Features list */}
          <ul className="mb-8 flex flex-col gap-2.5">
            <FeatureItem text="Connect your account credits" />
            <FeatureItem text="Save your try-on history after login" />
            <FeatureItem text="Use one secure Google account" />
          </ul>

          {/* Google login */}
          <div className="flex flex-col gap-3">
            <SocialButton
              dataModalLast
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              }
              label="Continue with Google"
              onClick={login}
            />
          </div>

          {/* Terms */}
          <p className="mt-auto pt-4 text-center text-[11px] leading-normal text-gray-400">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="font-medium text-gray-600 underline-offset-2 transition-colors duration-150 hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="font-medium text-gray-600 underline-offset-2 transition-colors duration-150 hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

// Backward compatibility alias
export function LoginModel(props: LoginModalProps) {
  return <LoginModal {...props} />;
}
