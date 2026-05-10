"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { localizedPath, type Locale } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const brand = useTranslations()("brand");
  const { openLoginModal } = useAuth();
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
            <Image src="/brand/icon.svg" alt="" width={30} height={30} priority />
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
          <button type="button" className="login-link" onClick={openLoginModal}>
            {t("login")}
          </button>
          <Link href={localizedPath(locale, "editor")} className="create-link">
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
                  <Image src="/brand/icon.svg" alt="" width={30} height={30} />
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
              <button
                type="button"
                className="mobile-login"
                onClick={() => {
                  setOpen(false);
                  openLoginModal();
                }}
              >
                {t("login")}
              </button>
              <Link href={localizedPath(locale, "editor")} className="mobile-create" onClick={() => setOpen(false)}>
                {t("create")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
