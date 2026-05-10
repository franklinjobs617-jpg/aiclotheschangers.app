"use client";

import Link from "next/link";
import { Crown, Menu, Shirt } from "lucide-react";
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
        <div className="editor-header-left">
          <button type="button" className="editor-menu-button" aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
          <span className="editor-header-divider" />
          <Link href={localizedPath(locale)} className="brand editor-brand" aria-label="AI clothes changer home">
            <span className="brand-mark">
              <Shirt size={18} />
            </span>
            <span>{brand}</span>
          </Link>
        </div>

        <div className="editor-header-actions">
          <button type="button" className="editor-upgrade-button">
            <Crown size={16} />
            {isZh ? "解锁PRO" : "Unlock PRO"}
          </button>
          <button type="button" className="login-link editor-login-button" onClick={openLoginModal}>
            {t("login")}
          </button>
        </div>
      </div>
    </header>
  );
}
