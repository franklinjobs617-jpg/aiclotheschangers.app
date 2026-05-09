"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { localeLabels, type Locale } from "@/lib/site";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function switchLocale(newLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 30}`;
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div className="language-switcher" ref={ref}>
      <button type="button" className="language-button" onClick={() => setOpen(!open)}>
        {localeLabels[locale]}
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="language-dropdown">
          {Object.entries(localeLabels).map(([code, label]) => (
            <button
              type="button"
              key={code}
              className={code === locale ? "active" : ""}
              onClick={() => switchLocale(code as Locale)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
