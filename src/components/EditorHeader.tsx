"use client";

import Link from "next/link";
import { Shirt, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { localizedPath, type Locale } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";

export function EditorHeader({ locale }: { locale: Locale }) {
  const brand = useTranslations()("brand");
  const t = useTranslations("nav");
  const { openLoginModal } = useAuth();
  const isZh = locale === "zh";

  return (
    <header className="editor-header">
      <div className="editor-header-inner">
        <Link href={localizedPath(locale)} className="brand" aria-label="AI clothes changer home">
          <span className="brand-mark">
            <Shirt size={18} />
          </span>
          <span>{brand}</span>
        </Link>

        <div className="editor-header-actions">
          <button type="button" className="editor-upgrade-button">
            <Crown size={16} />
            {isZh ? "升级PRO" : "Upgrade PRO"}
          </button>
          <button type="button" className="login-link" onClick={openLoginModal}>
            {t("login")}
          </button>
        </div>
      </div>
    </header>
  );
}
