"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { localizedPath, type Locale } from "@/lib/site";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const brand = useTranslations()("brand");
  const navItems = [
    [t("tryOn"), localizedPath(locale)],
    [t("plusSize"), localizedPath(locale, "plus-size-virtual-try-on")],
    [t("men"), localizedPath(locale, "mens-ai-clothes-changer")],
    [t("pricing"), localizedPath(locale, "pricing")],
    [t("about"), localizedPath(locale, "about-us")]
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href={localizedPath(locale)} className="brand" aria-label="AI clothes changer home">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          <span>{brand}</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link href={href} className="nav-link" key={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="#" className="login-link">
            {t("login")}
          </Link>
          <Link href="#tool" className="create-link">
            {t("create")}
          </Link>
          <button type="button" className="menu-button" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="mobile-panel">
          <div className="mobile-drawer">
            <div className="drawer-head">
              <span className="brand">
                <span className="brand-mark">
                  <Sparkles size={18} />
                </span>
                <span>{brand}</span>
              </span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <div className="mobile-links">
              {navItems.map(([label, href]) => (
                <Link href={href} key={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
              <Link href="#tool" className="mobile-create" onClick={() => setOpen(false)}>
                {t("create")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
