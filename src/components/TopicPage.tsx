"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  FileText,
  Lock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  absoluteLocalizedUrl,
  localizedPath,
  type Locale,
  type PageSlug,
} from "@/lib/site";
import { useAuth } from "@/context/AuthContext";
import { plans } from "@/config/plans";
import { startCheckout } from "@/lib/checkout";

const heroImages = [
  {
    src: "/85a52f41-3dad-4774-a469-b4ad5f324a7e.webp",
    alt: "AI clothes changer before and after result",
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/f2f8a4a8cf184daf8d01b04c117d82fe/1730889159329.jpg",
    alt: "AI clothing style sample",
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/3b42fc5d7ade49b3b7df539ba3c0b7c4/1730889163517.jpg",
    alt: "Virtual try on sample model",
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/2eb9275d461341fb9775a5158005a0bd/1730889167016.jpg",
    alt: "AI outfit changer example",
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/b6d53a681d3644259dcb70bc0ee5e4e6/1730889171190.jpg",
    alt: "AI clothes changer sample portrait",
  },
] as const;

const exampleCardImages = [
  "https://images.insmind.com/market-operations/market/side/21551ac66006432b9759facb4fdf771d/1730889665936.jpg",
  "https://images.insmind.com/market-operations/market/side/ce79b59be1d84e9788fcc4491ae13da4/1730889563222.jpg",
  "https://images.insmind.com/market-operations/market/side/d8ddda7f875c43fa9f20bf0c8b6548d2/1730889600007.jpg",
] as const;

const storySectionImages = [
  "/88147673-f5b7-473b-9d57-aef4b2857b5b.png",
  "https://images.insmind.com/market-operations/market/side/21551ac66006432b9759facb4fdf771d/1730889665936.jpg",
  "https://images.insmind.com/market-operations/market/side/d8ddda7f875c43fa9f20bf0c8b6548d2/1730889600007.jpg",
] as const;

const darkCtaClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#222529] px-5 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-[#353b44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23a7a0]";

const outlineLinkClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold !text-[#1d8a84] transition-colors hover:border-[#23a7a0]/40 hover:bg-[#effbf8]";

const pageShellClass = "overflow-x-hidden bg-white";
const CONTENT_UPDATED_AT = "2026-05-14";

export function TopicPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: Exclude<PageSlug, "">;
}) {
  const isPricing = slug === "pricing";
  const isAbout = slug === "about-us";
  const isLegal = slug === "privacy-policy" || slug === "terms-of-service";
  const isSpecialty =
    slug === "plus-size-virtual-try-on" || slug === "mens-ai-clothes-changer";
  const isVirtual = slug === "virtual-try-on-clothes";
  const commonT = useTranslations("common");
  const pricingPageT = useTranslations("pricingPage");

  if (isPricing) return <PricingPage locale={locale} />;
  if (isAbout) return <AboutPageContent locale={locale} />;
  if (isLegal) return <LegalPageContent locale={locale} slug={slug} />;
  if (isVirtual) return <VirtualTryOnContent locale={locale} />;

  return (
    <div className={pageShellClass}>
      <VisibleBreadcrumb locale={locale} slug={slug} currentSlug={slug} />
      <section className="bg-gradient-to-b from-[#f8fafb] to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="min-w-0 max-w-2xl">
            <TopicHero slug={slug as Exclude<PageSlug, "" | "pricing">} />
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                className={darkCtaClass}
                href={localizedPath(locale, "editor")}
              >
                {commonT("startTryOn")}
              </Link>
              <span className="text-sm text-[#69717f]">
                {commonT("previewFirst")}
              </span>
            </div>
          </div>

          {isSpecialty ? <TopicHeroPanel slug={slug} locale={locale} /> : null}
        </div>
      </section>

      {isSpecialty ? (
        <SpecialtyContent locale={locale} slug={slug} />
      ) : (
        <StandardContent slug={slug as Exclude<PageSlug, "" | "pricing">} />
      )}
    </div>
  );
}

function AboutPageContent({ locale }: { locale: Locale }) {
  const t = useTranslations("aboutPage");
  const geoT = useTranslations("geo");
  const technologyKeys = ["realism", "inclusive", "stability"] as const;
  const trustBuilderKeys = ["who", "how", "why"] as const;
  const principleKeys = ["preview", "limits", "privacy"] as const;
  const sectionKeys = [
    "redefining",
    "mission",
    "technology",
    "principles",
    "privacy",
    "join",
  ] as const;
  const schema = [
    buildBreadcrumbSchema(locale, "about-us", t("slogan")),
    buildPageSchema(
      locale,
      "about-us",
      t("slogan"),
      t("sections.redefining.body")
    ),
    buildArticleSchema(
      locale,
      "about-us",
      t("slogan"),
      t("sections.redefining.body")
    ),
  ];

  return (
    <article className={pageShellClass}>
      <VisibleBreadcrumb
        locale={locale}
        slug="about-us"
        current={t("slogan")}
      />
      <section className="bg-gradient-to-b from-[#f8fafb] to-white px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-sm font-semibold text-[#1d8a84]">
            {t("sloganLabel")}
          </span>
          <h1 className="mt-3 break-words text-4xl font-semibold leading-tight text-[#222529] sm:text-5xl lg:text-6xl">
            {t("slogan")}
          </h1>
          <p className="mt-4 text-sm font-medium text-[#69717f]">
            <time dateTime={CONTENT_UPDATED_AT}>
              {geoT("updated", { date: CONTENT_UPDATED_AT })}
            </time>
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[220px_minmax(0,820px)] lg:gap-20">
          <aside
            className="grid gap-2 rounded-2xl border border-gray-200 bg-[#fbfcfd] p-4 lg:sticky lg:top-24"
            aria-label={t("aboutLabel")}
          >
            {sectionKeys.map((key) => (
              <a
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#59616d] transition-colors hover:bg-white hover:text-[#222529]"
                href={`#${key}`}
                key={key}
              >
                {t(`sidebar.${key}`)}
              </a>
            ))}
          </aside>

          <div className="grid gap-8">
            <section id="redefining" className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">
                {t("aboutLabel")}
              </span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
                {t("sections.redefining.title")}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">
                {t("sections.redefining.body")}
              </p>
            </section>

            <section id="mission" className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">
                {t("sections.mission.label")}
              </span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
                {t("sections.mission.title")}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">
                {t("sections.mission.body1")}
              </p>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">
                {t("sections.mission.body2")}
              </p>
            </section>

            <section id="technology" className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">
                {t("sections.technology.label")}
              </span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
                {t("sections.technology.title")}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">
                {t("sections.technology.body")}
              </p>
              <div className="mt-6 grid gap-4">
                {technologyKeys.map((key, index) => (
                  <article
                    className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]"
                    key={key}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#23a7a0]/25 bg-[#f2fffb] text-xs font-semibold text-[#1d8a84]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[#222529]">
                        {t(`technology.${key}.title`)}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#69717f]">
                        {t(`technology.${key}.text`)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="principles" className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">
                {t("principles.eyebrow")}
              </span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
                {t("principles.title")}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">
                {t("principles.text")}
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {principleKeys.map((key) => (
                  <article
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]"
                    key={key}
                  >
                    <h3 className="text-base font-semibold text-[#222529]">
                      {t(`principles.cards.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#69717f]">
                      {t(`principles.cards.${key}.text`)}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="privacy"
              className="rounded-3xl border border-[#23a7a0]/25 bg-[#f2fffb] p-6"
            >
              <span className="text-sm font-semibold text-[#1d8a84]">
                {t("sections.privacy.label")}
              </span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
                {t("sections.privacy.title")}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">
                {t("sections.privacy.body")}
              </p>
            </section>

            <section className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">
                {t("trustBuilder.eyebrow")}
              </span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
                {t("trustBuilder.title")}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {trustBuilderKeys.map((key) => (
                  <article
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]"
                    key={key}
                  >
                    <h3 className="text-base font-semibold text-[#222529]">
                      {t(`trustBuilder.cards.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#69717f]">
                      {t(`trustBuilder.cards.${key}.text`)}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="join"
              className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-[#fbfcfd] p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="text-sm font-semibold text-[#1d8a84]">
                  {t("sections.join.label")}
                </span>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529]">
                  {t("sections.join.title")}
                </h2>
                <p className="mt-3 text-base leading-7 text-[#69717f]">
                  {t("sections.join.body")}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#69717f]">
                  {t("contact.label")}{" "}
                  <a
                    className="font-semibold text-[#1d8a84] underline-offset-4 hover:underline"
                    href="mailto:admin@aiclotheschangers.app"
                  >
                    admin@aiclotheschangers.app
                  </a>
                </p>
              </div>
              <Link
                className={`${darkCtaClass} shrink-0`}
                href={localizedPath(locale, "editor")}
              >
                {t("sections.join.cta")}
              </Link>
            </section>
          </div>
        </div>
      </section>
      <JsonLd data={schema} />
    </article>
  );
}

function TopicHero({
  slug,
  showUpdated = true,
}: {
  slug: Exclude<PageSlug, "" | "pricing">;
  showUpdated?: boolean;
}) {
  const t = useTranslations(`topicPages.${slug}`);
  const geoT = useTranslations("geo");
  return (
    <>
      <span className="text-sm font-semibold text-[#23a7a0]">
        {t("eyebrow")}
      </span>
      <h1 className="mt-3 max-w-full break-words text-4xl font-semibold leading-tight text-[#222529] sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-full break-words text-base leading-7 text-[#69717f]">
        {t("description")}
      </p>
      {showUpdated ? (
        <p className="mt-4 text-sm font-medium text-[#69717f]">
          <time dateTime={CONTENT_UPDATED_AT}>
            {geoT("updated", { date: CONTENT_UPDATED_AT })}
          </time>
        </p>
      ) : null}
    </>
  );
}

function PricingPage({ locale }: { locale: Locale }) {
  const t = useTranslations("pricing");
  const commonT = useTranslations("common");
  const pricingPageT = useTranslations("pricingPage");
  const geoT = useTranslations("geo");
  const { openLoginModal } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    setCheckoutLoading(null);
  }, []);

  const handleCheckout = async (planId: string) => {
    const plan = plans[planId as keyof typeof plans];
    if (!plan) return;
    setCheckoutLoading(planId);
    try {
      await startCheckout(plan, openLoginModal);
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const topupPlanMap: Record<string, string> = {
    starter: "close_starter",
    value: "close_best_value",
    growth: "close_growth",
    business: "close_business",
  };

  const getSubscriptionPlanId = (planKey: string, cycle: "monthly" | "yearly"): string => {
    if (planKey === "starter") return cycle === "yearly" ? "close_standard_yearly" : "close_standard_monthly";
    if (planKey === "creator") return cycle === "yearly" ? "close_professional_yearly" : "close_professional_monthly";
    if (planKey === "pro") return "close_business";
    return "";
  };
  const planKeys = ["starter", "creator", "pro"] as const;
  const topupKeys = ["starter", "value", "growth", "business"] as const;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const trustNoteKeys = ["freeCredits", "refunds", "privacy"] as const;
  const securityKeys = [
    "stripeFirst",
    "paymentRecovery",
    "creditsRefresh",
    "hdAfterValue",
    "riskControl",
  ] as const;
  const faqKeys = [
    "freeCredits",
    "hdExtra",
    "failedJobs",
    "renewal",
    "cancel",
  ] as const;
  const advantageRowKeys = ["price", "credits", "quality", "watermark", "speed", "renewal", "bestFor"] as const;
  const chooseKeys = ["testing", "occasional", "regular"] as const;
  const creditRuleKeys = ["standard", "hd", "failed"] as const;
  const pricingFaqs = faqKeys.map(
    (key) =>
      [
        pricingPageT(`faqs.${key}.question`),
        pricingPageT(`faqs.${key}.answer`),
      ] as const
  );
  const planPrice = (key: typeof planKeys[number]) =>
    key === "pro" ? t(`${key}.price`) : t(`${key}.${billingCycle}Price`);
  const billingDescription = (key: typeof planKeys[number]) =>
    key === "pro" ? t(`${key}.billing`) : t(`${key}.${billingCycle}Billing`);
  const comparisonValue = (row: typeof advantageRowKeys[number], plan: typeof planKeys[number]) => {
    if (row === "price") {
      return plan === "pro" ? t(`${plan}.price`) : `${t(`${plan}.${billingCycle}Price`)}/${t(`${plan}.period`)}`;
    }
    if (row === "credits") return t(`${plan}.credits`);
    return pricingPageT(`comparison.rows.${row}.${plan}`);
  };
  const schema = [
    buildBreadcrumbSchema(locale, "pricing", t("title")),
    buildPageSchema(
      locale,
      "pricing",
      pricingPageT("heroTitle"),
      t("description")
    ),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "AI Clothes Changer",
      url: absoluteLocalizedUrl(locale, "pricing"),
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      offers: [
        {
          "@type": "Offer",
          name: t("starter.name"),
          price: "9.9",
          priceCurrency: "USD",
          description: t("starter.description"),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "9.9",
            priceCurrency: "USD",
            billingDuration: "P1Y",
          },
        },
        {
          "@type": "Offer",
          name: t("creator.name"),
          price: "24.9",
          priceCurrency: "USD",
          description: t("creator.description"),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "24.9",
            priceCurrency: "USD",
            billingDuration: "P1Y",
          },
        },
        {
          "@type": "Offer",
          name: t("pro.name"),
          price: "29.9",
          priceCurrency: "USD",
          description: t("pro.description"),
        },
      ],
    },
    buildFaqSchema(pricingFaqs),
  ];

  return (
    <div className={pageShellClass}>
      <VisibleBreadcrumb locale={locale} slug="pricing" current={t("title")} />
      <section className="w-full max-w-full overflow-hidden px-4 pb-8 pt-14 text-center sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto w-full max-w-[22rem] sm:max-w-4xl">
          <span className="text-sm font-semibold text-[#1d8a84]">
            {t("eyebrow")}
          </span>
          <h1 className="mx-auto mt-3 max-w-[22rem] break-words text-3xl font-semibold leading-tight text-[#222529] sm:max-w-3xl sm:text-5xl lg:text-6xl">
            {pricingPageT("heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-[22rem] break-words text-base leading-7 text-[#47505f] sm:max-w-3xl sm:text-lg">
            {pricingPageT("heroBody")}
            <strong> {pricingPageT("heroHighlight")}</strong>
          </p>
          <div
            className="mx-auto mt-8 grid min-h-11 w-full max-w-[22rem] grid-cols-2 gap-1 rounded-full bg-[#f1f3f5] p-1 sm:max-w-[26rem]"
            aria-label="Billing cycle"
          >
            <button
              type="button"
              className={`min-w-0 rounded-full px-2 text-sm font-medium leading-5 transition-colors sm:px-3 ${
                billingCycle === "monthly" ? "bg-white text-[#222529] shadow-sm" : "text-[#1d8a84]"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              {pricingPageT("monthlyLabel")}
            </button>
            <button
              type="button"
              className={`min-w-0 rounded-full px-2 text-sm font-medium leading-5 transition-colors sm:px-3 ${
                billingCycle === "yearly" ? "bg-white text-[#222529] shadow-sm" : "text-[#1d8a84]"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              {pricingPageT("yearlyLabel")}
              <span className="ml-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {pricingPageT("yearlySave")}
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="w-full max-w-full overflow-hidden px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[22rem] grid-cols-1 gap-4 sm:max-w-6xl md:grid-cols-3 p-6">
          {planKeys.map((key) => (
            <article
              className={`relative mx-auto flex w-full max-w-[22rem] min-w-0 flex-col rounded-2xl border bg-white p-5 sm:max-w-none sm:p-6 ${
                key === "creator"
                  ? "border-[#23a7a0] shadow-[0_18px_48px_rgba(0,205,176,0.14)] md:-translate-y-3"
                  : "border-gray-200"
              }`}
              key={key}
            >
              <div className="flex min-h-7 flex-wrap items-start justify-between gap-3">
                <h2 className="min-w-0 text-xl font-semibold leading-snug text-[#222529]">
                  {t(`${key}.name`)}
                </h2>
                {key === "creator" ? (
                  <span className="shrink-0 rounded-full bg-[#222529] px-3 py-1 text-xs font-semibold text-white">
                    {pricingPageT("featuredBadge")}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-[#69717f]">
                {t(`${key}.description`)}
              </p>
              <div className="mt-4 flex items-end gap-1">
                <strong className="text-4xl font-semibold text-[#222529]">
                  {planPrice(key)}
                </strong>
                {key === "pro" ? null : (
                  <span className="pb-1 text-sm text-[#69717f]">
                    /{t(`${key}.period`)}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-4">
                {billingDescription(key)}
              </p>
              <button
                className={`${darkCtaClass} mt-5 w-full px-4`}
                style={{ color: "#ffffff" }}
                onClick={() => handleCheckout(getSubscriptionPlanId(key, billingCycle))}
                disabled={checkoutLoading === getSubscriptionPlanId(key, billingCycle)}
              >
                {checkoutLoading === getSubscriptionPlanId(key, billingCycle)
                  ? "Processing..."
                  : t(`${key}.cta`)}
              </button>
              <div className="mt-4 rounded-lg bg-[#effbf8] px-3 py-2 text-sm font-semibold text-[#1d8a84]">
                {t(`${key}.credits`)}
              </div>
              <ul className="mt-5 grid gap-3">
                {[1, 2, 3, 4].map((benefitIndex) => (
                  <li
                    className="flex gap-2 text-sm leading-6 text-[#47505f]"
                    key={benefitIndex}
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-1 shrink-0 text-[#1d8a84]"
                    />
                    <span>
                      {pricingPageT(`planBenefits.${key}.${benefitIndex}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full max-w-full overflow-hidden px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-3xl border border-gray-200 bg-[#fbfcfd] p-5 sm:p-8">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <span className="text-sm font-semibold text-[#1d8a84]">
              {pricingPageT("topupLabel")}
            </span>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#222529] sm:text-3xl">
              {pricingPageT("topupTitle")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#69717f] sm:text-base">
              {pricingPageT("topupBody")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topupKeys.map((key) => (
              <article
                className={`rounded-2xl border bg-white p-5 text-center shadow-[0_10px_24px_rgba(24,31,52,0.035)] ${
                  key === "value" ? "border-[#23a7a0] ring-2 ring-[#23a7a0]/10" : "border-gray-200"
                }`}
                key={key}
              >
                <span className={`text-xs font-black uppercase tracking-widest ${key === "value" ? "text-[#1d8a84]" : "text-[#8b94a3]"}`}>
                  {pricingPageT(`topups.${key}.label`)}
                </span>
                <div className="mt-3 text-4xl font-semibold leading-none text-[#222529]">
                  {pricingPageT(`topups.${key}.credits`)}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest text-[#1d8a84]">
                  {pricingPageT("topupUnit")}
                </div>
                <div className="mt-5 text-2xl font-semibold text-[#222529]">
                  {pricingPageT(`topups.${key}.price`)}
                </div>
                <button
                  className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors"
                  style={
                    key === "value"
                      ? { color: "#ffffff", backgroundColor: "#222529" }
                      : { color: "#222529", backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }
                  }
                  onClick={() => handleCheckout(topupPlanMap[key])}
                  disabled={checkoutLoading === topupPlanMap[key]}
                >
                  {checkoutLoading === topupPlanMap[key]
                    ? "Processing..."
                    : pricingPageT("topupCta")}
                </button>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-xs font-semibold uppercase tracking-widest text-[#8b94a3]">
            {pricingPageT("topupFootnote")}
          </p>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-5">
            <span className="text-sm font-semibold text-[#1d8a84]">
              {pricingPageT("comparison.eyebrow")}
            </span>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#222529] sm:text-3xl">
              {pricingPageT("comparison.title")}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#69717f] sm:text-base">
              {pricingPageT("comparison.body")}
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-[0_10px_24px_rgba(24,31,52,0.035)]">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[#fbfcfd] text-[#222529]">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    {pricingPageT("comparison.feature")}
                  </th>
                  {planKeys.map((key) => (
                    <th
                      scope="col"
                      className={`px-5 py-4 font-semibold ${key === "creator" ? "bg-[#effbf8] text-[#1d8a84]" : ""}`}
                      key={key}
                    >
                      <span className="flex items-center gap-2">
                        {t(`${key}.name`)}
                        {key === "creator" ? (
                          <span className="rounded-full bg-[#222529] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                            {pricingPageT("featuredBadge")}
                          </span>
                        ) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-[#47505f]">
                {advantageRowKeys.map((row) => (
                  <tr key={row}>
                    <th scope="row" className="w-[190px] px-5 py-4 font-semibold text-[#222529]">
                      {pricingPageT(`comparison.labels.${row}`)}
                    </th>
                    {planKeys.map((key) => (
                      <td
                        className={`px-5 py-4 leading-6 ${key === "creator" ? "bg-[#f7fffd] font-semibold text-[#222529]" : ""}`}
                        key={key}
                      >
                        {comparisonValue(row, key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfd] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1fr]">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {pricingPageT("choose.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {pricingPageT("choose.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {pricingPageT("choose.body")}
            </p>
          </div>
          <div className="grid gap-3">
            {chooseKeys.map((key) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)]"
                key={key}
              >
                <h3 className="text-base font-semibold text-[#222529]">
                  {pricingPageT(`choose.cards.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">
                  {pricingPageT(`choose.cards.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1fr]">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {pricingPageT("creditRules.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {pricingPageT("creditRules.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {pricingPageT("creditRules.body")}
            </p>
          </div>
          <div className="grid gap-3">
            {creditRuleKeys.map((key) => (
              <article
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)] sm:flex-row sm:items-start"
                key={key}
              >
                <strong className="w-fit rounded-full bg-[#effbf8] px-3 py-1.5 text-sm font-semibold text-[#1d8a84]">
                  {pricingPageT(`creditRules.cards.${key}.value`)}
                </strong>
                <div>
                  <h3 className="text-base font-semibold text-[#222529]">
                    {pricingPageT(`creditRules.cards.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#69717f]">
                    {pricingPageT(`creditRules.cards.${key}.text`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfd] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
          {trustNoteKeys.map((key) => {
            const Icon = trustNoteIconMap[key];
            return (
              <article
                className="flex min-h-28 gap-3 rounded-2xl border border-gray-200 bg-[#fbfcfd] p-5"
                key={key}
              >
                <Icon size={18} className="mt-1 shrink-0 text-[#1d8a84]" />
                <div>
                  <h2 className="text-sm font-semibold text-[#222529]">
                    {pricingPageT(`trustNotes.${key}.title`)}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#69717f]">
                    {pricingPageT(`trustNotes.${key}.text`)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold text-[#1d8a84]">
              {commonT("paymentUx")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {commonT("clearCredits")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {commonT("clearCreditsText")}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {securityKeys.map((key) => {
              const Icon = pricingSecurityIconMap[key];
              return (
                <article
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]"
                  key={key}
                >
                  <Icon size={24} className="text-[#1d8a84]" />
                  <h3 className="mt-4 text-base font-semibold text-[#222529]">
                    {pricingPageT(`security.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#69717f]">
                    {pricingPageT(`security.${key}.text`)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfd] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold text-[#1d8a84]">
              {commonT("faq")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-[#222529]">
              {commonT("pricingFaqs")}
            </h2>
          </div>
          <div className="grid gap-3">
            {faqKeys.map((key) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-5"
                key={key}
              >
                <h3 className="text-base font-semibold text-[#222529]">
                  {geoT("faq.questionPrefix")}{" "}
                  {pricingPageT(`faqs.${key}.question`)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#69717f]">
                  {pricingPageT(`faqs.${key}.answer`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={schema} />
    </div>
  );
}

function StandardContent({
  slug,
}: {
  slug: Exclude<PageSlug, "" | "pricing">;
}) {
  const t = useTranslations(`topicPages.${slug}`);
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")];
  const bodyTexts =
    slug === "about-us" ||
    slug === "privacy-policy" ||
    slug === "terms-of-service"
      ? [t("body1"), t("body2"), t("body3")]
      : [t("body1"), t("body2")];

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="grid gap-4 text-base leading-7 text-[#47505f]">
          {bodyTexts.filter(Boolean).map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <div className="grid gap-3">
          {bullets.map((item) => (
            <div
              className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-[#fbfcfd] p-4"
              key={item}
            >
              <CheckCircle2
                size={18}
                className="mt-1 shrink-0 text-[#1d8a84]"
              />
              <span className="text-sm leading-6 text-[#47505f]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VirtualTryOnContent({ locale }: { locale: Locale }) {
  const t = useTranslations("topicPages.virtual-try-on-clothes");
  const detailT = useTranslations("topicPages.virtual-try-on-clothes.detail");
  const decisionKeys = ["shopping", "creator", "commerce"] as const;
  const comparisonKeys = ["identity", "edges", "useCase"] as const;
  const schema = [
    buildBreadcrumbSchema(locale, "virtual-try-on-clothes", t("title")),
    buildPageSchema(
      locale,
      "virtual-try-on-clothes",
      t("title"),
      t("description")
    ),
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: detailT("howTo.name"),
      step: [
        {
          "@type": "HowToStep",
          name: detailT("howTo.steps.upload"),
          text: t("bullet1"),
        },
        {
          "@type": "HowToStep",
          name: detailT("howTo.steps.choose"),
          text: t("bullet2"),
        },
        {
          "@type": "HowToStep",
          name: detailT("howTo.steps.compare"),
          text: t("bullet3"),
        },
      ],
    },
  ];

  return (
    <div className={pageShellClass}>
      <VisibleBreadcrumb
        locale={locale}
        slug="virtual-try-on-clothes"
        current={t("title")}
      />
      <section className="bg-gradient-to-b from-[#f8fafb] to-white px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="min-w-0 max-w-2xl">
            <TopicHero slug="virtual-try-on-clothes" showUpdated={false} />
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                className={darkCtaClass}
                href={localizedPath(locale, "editor")}
              >
                {detailT("cta")}
              </Link>
              <span className="text-sm text-[#69717f]">
                {detailT("ctaNote")}
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-[#f5f6f8] shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
            <Image
              src="/AI换装对比_纯人物无文字-转换自.webp"
              alt={detailT("heroAlt")}
              width={760}
              height={520}
              className="h-auto w-full max-w-full object-cover"
              priority
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-[0_14px_34px_rgba(24,31,52,0.12)] backdrop-blur">
              <span className="text-sm font-semibold text-[#1d8a84]">
                {detailT("overlayEyebrow")}
              </span>
              <strong className="mt-1 block text-lg font-semibold leading-snug text-[#222529]">
                {detailT("overlayTitle")}
              </strong>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {detailT("intent.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {detailT("intent.title")}
            </h2>
            <div className="mt-5 grid gap-4 text-base leading-7 text-[#47505f]">
              <p>{t("body1")}</p>
              <p>{t("body2")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-1">
            {decisionKeys.map((key) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]"
                key={key}
              >
                <h3 className="text-base font-semibold text-[#222529]">
                  {detailT(`intent.cards.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">
                  {detailT(`intent.cards.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#f7f8fa] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
            <Image
              src="/file_000000002ad871f6a73a5896f81959f.webp"
              alt={detailT("workflowAlt")}
              width={820}
              height={560}
              className="h-auto w-full object-cover"
            />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {detailT("practical.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {detailT("practical.title")}
            </h2>
            <div className="mt-6 grid gap-3">
              {[t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")].map(
                (item) => (
                  <p
                    className="flex gap-3 text-base leading-7 text-[#47505f]"
                    key={item}
                  >
                    <span className="mt-3 size-1.5 shrink-0 rounded-full bg-[#1d8a84]" />
                    {item}
                  </p>
                )
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className={outlineLinkClass}
                href={localizedPath(locale, "plus-size-virtual-try-on")}
              >
                {detailT("practical.related.plusSize")}
              </Link>
              <Link
                className={outlineLinkClass}
                href={localizedPath(locale, "mens-ai-clothes-changer")}
              >
                {detailT("practical.related.men")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {detailT("judge.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {detailT("judge.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {detailT("judge.body")}
            </p>
          </div>
          <div className="grid gap-3">
            {comparisonKeys.map((key) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)]"
                key={key}
              >
                <h3 className="text-base font-semibold text-[#222529]">
                  {detailT(`judge.cards.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">
                  {detailT(`judge.cards.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={schema} />
    </div>
  );
}

function LegalPageContent({
  locale,
  slug,
}: {
  locale: Locale;
  slug: "privacy-policy" | "terms-of-service";
}) {
  const t = useTranslations(`topicPages.${slug}`);
  const geoT = useTranslations("geo");
  const isPrivacy = slug === "privacy-policy";
  const legalKeys = isPrivacy
    ? (["uploads", "account", "safety", "deletion"] as const)
    : (["rights", "prohibited", "credits", "cancellation"] as const);
  const schema = [
    buildBreadcrumbSchema(locale, slug, t("title")),
    buildPageSchema(locale, slug, t("title"), t("description")),
    buildArticleSchema(locale, slug, t("title"), t("description")),
  ];

  return (
    <article className={pageShellClass}>
      <VisibleBreadcrumb locale={locale} slug={slug} current={t("title")} />
      <section className="bg-gradient-to-b from-[#f8fafb] to-white px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-sm font-semibold text-[#1d8a84]">
            {t("eyebrow")}
          </span>
          <h1 className="mt-3 break-words text-4xl font-semibold leading-tight text-[#222529] sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl break-words text-base leading-7 text-[#69717f]">
            {t("description")}
          </p>
          <p className="mt-4 text-sm font-medium text-[#69717f]">
            <time dateTime={CONTENT_UPDATED_AT}>
              {geoT("updated", { date: CONTENT_UPDATED_AT })}
            </time>
          </p>
        </div>
      </section>
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[300px_minmax(0,820px)] lg:gap-16">
          <aside className="rounded-3xl border border-[#23a7a0]/25 bg-[#f2fffb] p-6 lg:sticky lg:top-24">
            {isPrivacy ? (
              <Lock size={22} className="text-[#1d8a84]" />
            ) : (
              <FileText size={22} className="text-[#1d8a84]" />
            )}
            <h2 className="mt-4 text-lg font-semibold text-[#222529]">
              {t("legal.asideTitle")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#69717f]">
              {t("body1")}
            </p>
          </aside>
          <div className="grid gap-4">
            {legalKeys.map((key, index) => (
              <article
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5"
                key={key}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#effbf8] text-xs font-semibold text-[#1d8a84]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#222529]">
                    {t(`legal.sections.${key}.title`)}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#69717f]">
                    {t(`legal.sections.${key}.text`)}
                  </p>
                </div>
              </article>
            ))}
            <div className="rounded-3xl border border-gray-200 bg-[#fbfcfd] p-6">
              <h2 className="text-xl font-semibold text-[#222529]">
                {t("legal.summaryTitle")}
              </h2>
              <p className="mt-3 text-base leading-7 text-[#69717f]">
                {t("body2")}
              </p>
              <p className="mt-3 text-base leading-7 text-[#69717f]">
                {t("body3")}
              </p>
              <p className="mt-4 text-sm leading-6 text-[#69717f]">
                {t("legal.contact")}{" "}
                <a
                  className="font-semibold text-[#1d8a84] underline-offset-4 hover:underline"
                  href="mailto:admin@aiclotheschangers.app"
                >
                  admin@aiclotheschangers.app
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={schema} />
    </article>
  );
}

function TopicHeroPanel({
  locale,
  slug,
}: {
  locale: Locale;
  slug: keyof typeof specialtyPageData;
}) {
  const t = useTranslations(`specialtyPages.${slug}`);
  const data = specialtyPageData[slug];
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-[#f5f6f8] shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
      <Image
        src={data.heroImage}
        alt={t("heroAlt")}
        width={1536}
        height={864}
        className="h-auto w-full object-cover"
        priority
      />

      <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_16px_42px_rgba(24,31,52,0.12)] backdrop-blur">
        <Image
          src={data.accentImage}
          alt=""
          width={84}
          height={84}
          className="size-14 rounded-xl object-cover"
        />
        <Link
          href={localizedPath(locale, "editor")}
          className="pr-2 text-sm font-semibold text-[#1d8a84]"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}

function SpecialtyContent({
  locale,
  slug,
}: {
  locale: Locale;
  slug: keyof typeof specialtyPageData;
}) {
  if (slug === "mens-ai-clothes-changer") {
    return <MensSpecialtyContent locale={locale} />;
  }

  const t = useTranslations(`topicPages.${slug}`);
  const specialtyT = useTranslations(`specialtyPages.${slug}`);
  const data = specialtyPageData[slug];
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")];
  const proofKeys = ["1", "2", "3"] as const;
  const relatedKeys = ["1", "2"] as const;
  const intentKeys = ["representation", "drape", "photo"] as const;
  const guideKeys = ["fullBody", "shadows", "goal", "direction"] as const;
  const checkKeys = ["shoulders", "waist", "length", "drape"] as const;
  const comparisonKeys = ["photo", "preview", "limits", "bestFor"] as const;
  const faqKeys = ["guarantee", "photo", "model", "result"] as const;
  const faqCards = faqKeys.map(
    (key) =>
      [
        specialtyT(`faq.items.${key}.question`),
        specialtyT(`faq.items.${key}.answer`),
      ] as const
  );
  const schema = [
    buildBreadcrumbSchema(locale, slug, t("title")),
    buildPageSchema(locale, slug, t("title"), t("description")),
    buildArticleSchema(locale, slug, t("title"), t("description")),
    buildFaqSchema(faqCards),
  ];

  return (
    <>
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {specialtyT("featureTitle")}
            </h2>
            <div className="mt-5 grid gap-4 text-base leading-7 text-[#47505f]">
              <p>{t("body1")}</p>
              <p>{t("body2")}</p>
              <p>{specialtyT("featureText")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {bullets.map((item) => (
              <div
                className="flex min-h-28 items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]"
                key={item}
              >
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#23a7a0]"
                />
                <span className="text-sm leading-6 text-[#47505f]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("intent.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {specialtyT("intent.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {specialtyT("intent.text")}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {intentKeys.map((key, index) => (
              <article
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_24px_rgba(24,31,52,0.035)]"
                key={key}
              >
                <Image
                  src={data.intentImages[index]}
                  alt={specialtyT(`intent.cards.${key}.title`)}
                  width={420}
                  height={520}
                  className="h-72 w-full bg-[#eceef1] object-cover object-top"
                />
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[#222529]">
                    {specialtyT(`intent.cards.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#69717f]">
                    {specialtyT(`intent.cards.${key}.text`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfd] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("guide.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {specialtyT("guide.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {specialtyT("guide.text")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {guideKeys.map((key) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)]"
                key={key}
              >
                <h3 className="text-base font-semibold text-[#222529]">
                  {specialtyT(`guide.cards.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">
                  {specialtyT(`guide.cards.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("check.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {specialtyT("check.title")}
            </h2>
          </div>
          <div className="grid gap-3">
            {checkKeys.map((key) => (
              <article
                className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-5"
                key={key}
              >
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#1d8a84]"
                />
                <div>
                  <h3 className="text-base font-semibold text-[#222529]">
                    {specialtyT(`check.cards.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#69717f]">
                    {specialtyT(`check.cards.${key}.text`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SpecialtyComparisonSection
        eyebrow={specialtyT("comparison.eyebrow")}
        title={specialtyT("comparison.title")}
        text={specialtyT("comparison.text")}
        rows={comparisonKeys.map((key) => ({
          attribute: specialtyT(`comparison.rows.${key}.attribute`),
          preview: specialtyT(`comparison.rows.${key}.preview`),
          use: specialtyT(`comparison.rows.${key}.use`),
          limit: specialtyT(`comparison.rows.${key}.limit`),
        }))}
      />

      <section className="bg-[#f7f8fa] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
            <Image
              src={data.heroImage}
              alt={specialtyT("heroAlt")}
              width={1536}
              height={864}
              className="h-auto w-full object-cover"
            />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("proofLabel")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {specialtyT("proofTitle")}
            </h2>
            <div className="mt-6 grid gap-3">
              {proofKeys.map((key) => (
                <p
                  className="flex gap-3 text-base leading-7 text-[#47505f]"
                  key={key}
                >
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-[#1d8a84]" />
                  {specialtyT(`proofItems.${key}`)}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {relatedKeys.map((key, index) => (
                <Link
                  className={outlineLinkClass}
                  href={localizedPath(locale, data.related[index])}
                  key={key}
                >
                  {specialtyT(`related.${key}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SpecialtyFaqSection
        eyebrow={specialtyT("faq.eyebrow")}
        title={specialtyT("faq.title")}
        faqs={faqCards}
      />
      <JsonLd data={schema} />
    </>
  );
}

function MensSpecialtyContent({ locale }: { locale: Locale }) {
  const slug = "mens-ai-clothes-changer" as const;
  const t = useTranslations(`topicPages.${slug}`);
  const specialtyT = useTranslations(`specialtyPages.${slug}`);
  const data = specialtyPageData[slug];
  const intentKeys = ["workwear", "streetwear", "shopping"] as const;
  const guideKeys = ["pose", "torso", "occasion", "proportion"] as const;
  const checkKeys = ["shoulders", "shirt", "color", "face"] as const;
  const comparisonKeys = ["profile", "shirt", "suit", "streetwear"] as const;
  const faqKeys = ["profile", "outfits", "photo", "face"] as const;
  const proofKeys = ["1", "2", "3"] as const;
  const faqCards = faqKeys.map(
    (key) =>
      [
        specialtyT(`faq.items.${key}.question`),
        specialtyT(`faq.items.${key}.answer`),
      ] as const
  );
  const schema = [
    buildBreadcrumbSchema(locale, slug, t("title")),
    buildPageSchema(locale, slug, t("title"), t("description")),
    buildArticleSchema(locale, slug, t("title"), t("description")),
    buildFaqSchema(faqCards),
  ];

  return (
    <>
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <div className="rounded-3xl border border-gray-200 bg-[#fbfcfd] p-6">
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529]">
              {specialtyT("featureTitle")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {specialtyT("featureText")}
            </p>
            <div className="mt-6 grid gap-3">
              {proofKeys.map((key) => (
                <p
                  className="flex gap-3 text-sm leading-6 text-[#47505f]"
                  key={key}
                >
                  <CheckCircle2
                    size={17}
                    className="mt-1 shrink-0 text-[#1d8a84]"
                  />
                  {specialtyT(`proofItems.${key}`)}
                </p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {intentKeys.map((key, index) => (
              <article
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_24px_rgba(24,31,52,0.035)]"
                key={key}
              >
                <Image
                  src={data.intentImages[index]}
                  alt={specialtyT(`intent.cards.${key}.title`)}
                  width={420}
                  height={520}
                  className="h-64 w-full bg-[#eceef1] object-cover object-top"
                />
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[#222529]">
                    {specialtyT(`intent.cards.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#69717f]">
                    {specialtyT(`intent.cards.${key}.text`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fa] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {guideKeys.map((key, index) => (
              <article
                className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)] ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
                key={key}
              >
                <span className="text-xs font-semibold text-[#1d8a84]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold text-[#222529]">
                  {specialtyT(`guide.cards.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">
                  {specialtyT(`guide.cards.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("guide.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {specialtyT("guide.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {specialtyT("guide.text")}
            </p>
            <Link
              className={`${darkCtaClass} mt-7`}
              href={localizedPath(locale, "editor")}
            >
              {specialtyT("mensCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("check.eyebrow")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {specialtyT("check.title")}
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {checkKeys.map((key) => (
              <article
                className="rounded-2xl border border-gray-200 bg-white p-5"
                key={key}
              >
                <h3 className="text-base font-semibold text-[#222529]">
                  {specialtyT(`check.cards.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">
                  {specialtyT(`check.cards.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SpecialtyComparisonSection
        eyebrow={specialtyT("comparison.eyebrow")}
        title={specialtyT("comparison.title")}
        text={specialtyT("comparison.text")}
        rows={comparisonKeys.map((key) => ({
          attribute: specialtyT(`comparison.rows.${key}.attribute`),
          preview: specialtyT(`comparison.rows.${key}.preview`),
          use: specialtyT(`comparison.rows.${key}.use`),
          limit: specialtyT(`comparison.rows.${key}.limit`),
        }))}
      />

      <section className="bg-[#fbfcfd] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">
              {specialtyT("proofLabel")}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
              {specialtyT("proofTitle")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {specialtyT("intent.text")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className={outlineLinkClass}
                href={localizedPath(locale, "plus-size-virtual-try-on")}
              >
                {specialtyT("related.1")}
              </Link>
              <Link
                className={outlineLinkClass}
                href={localizedPath(locale, "virtual-try-on-clothes")}
              >
                {specialtyT("related.2")}
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
            <Image
              src={data.heroImage}
              alt={specialtyT("heroAlt")}
              width={1536}
              height={864}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>
      <SpecialtyFaqSection
        eyebrow={specialtyT("faq.eyebrow")}
        title={specialtyT("faq.title")}
        faqs={faqCards}
      />
      <JsonLd data={schema} />
    </>
  );
}

function SpecialtyComparisonSection({
  eyebrow,
  title,
  text,
  rows,
}: {
  eyebrow: string;
  title: string;
  text: string;
  rows: Array<{
    attribute: string;
    preview: string;
    use: string;
    limit: string;
  }>;
}) {
  const geoT = useTranslations("geo");

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold text-[#1d8a84]">
            {eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-[#69717f]">{text}</p>
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-[0_10px_24px_rgba(24,31,52,0.035)]">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-[#fbfcfd] text-[#222529]">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold">
                  {geoT("comparison.attribute")}
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  {geoT("comparison.preview")}
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  {geoT("comparison.use")}
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  {geoT("comparison.limit")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-[#47505f]">
              {rows.map((row) => (
                <tr key={row.attribute}>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[#222529]"
                  >
                    {row.attribute}
                  </th>
                  <td className="px-5 py-4">{row.preview}</td>
                  <td className="px-5 py-4">{row.use}</td>
                  <td className="px-5 py-4">{row.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function SpecialtyFaqSection({
  eyebrow,
  title,
  faqs,
}: {
  eyebrow: string;
  title: string;
  faqs: readonly (readonly [string, string])[];
}) {
  const geoT = useTranslations("geo");

  return (
    <section
      className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
      aria-labelledby="specialty-faq-heading"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
        <div>
          <span className="text-sm font-semibold text-[#1d8a84]">
            {eyebrow}
          </span>
          <h2
            id="specialty-faq-heading"
            className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl"
          >
            {title}
          </h2>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer]) => (
            <article
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)]"
              key={question}
            >
              <h3 className="text-base font-semibold text-[#222529]">
                {geoT("faq.questionPrefix")} {question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#69717f]">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function VisibleBreadcrumb({
  locale,
  slug,
  current,
  currentSlug,
}: {
  locale: Locale;
  slug: PageSlug;
  current?: string;
  currentSlug?: PageSlug;
}) {
  const geoT = useTranslations("geo");
  const brand = useTranslations()("brand");
  const labelSlug = currentSlug ?? slug;
  const currentLabel = current ?? geoT(`pageLabels.${labelSlug}`);

  return (
    <nav
      className="border-b border-gray-100 bg-white px-4 py-3 sm:px-6 lg:px-8"
      aria-label={geoT("breadcrumb.ariaLabel")}
    >
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-sm text-[#69717f]">
        <li>
          <Link
            className="font-medium text-[#1d8a84] hover:text-[#176f6a]"
            href={localizedPath(locale)}
          >
            {brand}
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-300">
          /
        </li>
        <li>
          <Link
            className="font-medium text-[#1d8a84] hover:text-[#176f6a]"
            href={localizedPath(locale, slug)}
          >
            {geoT(`pageLabels.${slug}`)}
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-300">
          /
        </li>
        <li className="max-w-full truncate text-[#222529]" aria-current="page">
          {currentLabel}
        </li>
      </ol>
    </nav>
  );
}

function buildBreadcrumbSchema(locale: Locale, slug: PageSlug, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "AI Clothes Changer",
        item: absoluteLocalizedUrl(locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: absoluteLocalizedUrl(locale, slug),
      },
    ],
  };
}

function buildPageSchema(
  locale: Locale,
  slug: PageSlug,
  name: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteLocalizedUrl(locale, slug),
    isPartOf: {
      "@type": "WebSite",
      name: "AI Clothes Changer",
      url: absoluteLocalizedUrl(locale),
    },
  };
}

function buildArticleSchema(
  locale: Locale,
  slug: PageSlug,
  headline: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteLocalizedUrl(locale, slug),
    datePublished: CONTENT_UPDATED_AT,
    dateModified: CONTENT_UPDATED_AT,
    author: {
      "@type": "Organization",
      name: "AI Clothes Changer",
      url: absoluteLocalizedUrl(locale),
    },
    publisher: {
      "@type": "Organization",
      name: "AI Clothes Changer",
      url: absoluteLocalizedUrl(locale),
    },
  };
}

function buildFaqSchema(faqs: readonly (readonly [string, string])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

const specialtyPageData = {
  "plus-size-virtual-try-on": {
    image: storySectionImages[2],
    heroImage: "/seo-assets/plus-size-try-on-comparison.png",
    accentImage: heroImages[2].src,
    intentImages: [
      "/models/model-11.webp",
      "/models/model-14.webp",
      "/models/model-18.webp",
    ],
    related: ["mens-ai-clothes-changer", "virtual-try-on-clothes"],
  },
  "mens-ai-clothes-changer": {
    image: storySectionImages[0],
    heroImage: "/seo-assets/mens-try-on-comparison.png",
    accentImage: exampleCardImages[1],
    intentImages: [
      "/models/model-21.webp",
      "/models/model-23.webp",
      "/models/model-27.webp",
    ],
    related: ["plus-size-virtual-try-on", "virtual-try-on-clothes"],
  },
} as const;

const trustNoteIconMap = {
  freeCredits: BadgeCheck,
  refunds: RotateCcw,
  privacy: ShieldCheck,
} as const;

const pricingSecurityIconMap = {
  stripeFirst: BadgeCheck,
  paymentRecovery: RotateCcw,
  creditsRefresh: CheckCircle2,
  hdAfterValue: CheckCircle2,
  riskControl: ShieldCheck,
} as const;
