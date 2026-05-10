"use client";

import Link from "next/link";
import { Crown, Menu, Shirt } from "lucide-react";
import { useTranslations } from "next-intl";
import { localizedPath, type Locale } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";

export function EditorHeader({ locale }: { locale: Locale }) {
  const brand = useTranslations()("brand");
  const t = useTranslations("nav");
  const { user, openLoginModal } = useAuth();
  const isZh = locale === "zh";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="flex h-16 w-full items-center justify-between px-4 max-[900px]:h-14">
        <div className="flex items-center gap-2.5">
          <button type="button" className="grid size-9 place-items-center rounded-lg border-0 bg-transparent text-gray-600 hover:bg-gray-100" aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
          <span className="h-8 w-px bg-gray-200" />
          <Link href={localizedPath(locale)} className="brand max-[900px]:[&>span:last-child]:hidden" aria-label="AI clothes changer home">
            <span className="brand-mark">
              <Shirt size={18} />
            </span>
            <span>{brand}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border-0 bg-[#23a7a0] px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 max-[640px]:h-9 max-[640px]:px-3">
            <Crown size={16} />
            {isZh ? "解锁PRO" : "Unlock PRO"}
          </button>
          {user ? (
            <span className="inline-flex min-h-8 items-center rounded-full border border-gray-200 bg-white px-3 text-[13px] font-extrabold text-gray-600">
              {user.credits ?? 0} {isZh ? "额度" : "credits"}
            </span>
          ) : (
            <button type="button" className="login-link max-[640px]:hidden" onClick={openLoginModal}>
              {t("login")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
