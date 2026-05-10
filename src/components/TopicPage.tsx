"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, FileText, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { absoluteLocalizedUrl, localizedPath, type Locale, type PageSlug } from "@/lib/site";

const heroImages = [
  {
    src: "/85a52f41-3dad-4774-a469-b4ad5f324a7e.webp",
    alt: "AI clothes changer before and after result"
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/f2f8a4a8cf184daf8d01b04c117d82fe/1730889159329.jpg",
    alt: "AI clothing style sample"
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/3b42fc5d7ade49b3b7df539ba3c0b7c4/1730889163517.jpg",
    alt: "Virtual try on sample model"
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/2eb9275d461341fb9775a5158005a0bd/1730889167016.jpg",
    alt: "AI outfit changer example"
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/b6d53a681d3644259dcb70bc0ee5e4e6/1730889171190.jpg",
    alt: "AI clothes changer sample portrait"
  }
] as const;

const exampleCardImages = [
  "https://images.insmind.com/market-operations/market/side/21551ac66006432b9759facb4fdf771d/1730889665936.jpg",
  "https://images.insmind.com/market-operations/market/side/ce79b59be1d84e9788fcc4491ae13da4/1730889563222.jpg",
  "https://images.insmind.com/market-operations/market/side/d8ddda7f875c43fa9f20bf0c8b6548d2/1730889600007.jpg"
] as const;

const storySectionImages = [
  "/88147673-f5b7-473b-9d57-aef4b2857b5b.png",
  "https://images.insmind.com/market-operations/market/side/21551ac66006432b9759facb4fdf771d/1730889665936.jpg",
  "https://images.insmind.com/market-operations/market/side/d8ddda7f875c43fa9f20bf0c8b6548d2/1730889600007.jpg"
] as const;

const darkCtaClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#222529] px-5 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-[#353b44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23a7a0]";

const outlineLinkClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold !text-[#1d8a84] transition-colors hover:border-[#23a7a0]/40 hover:bg-[#effbf8]";

export function TopicPage({ locale, slug }: { locale: Locale; slug: Exclude<PageSlug, ""> }) {
  const isPricing = slug === "pricing";
  const isAbout = slug === "about-us";
  const isLegal = slug === "privacy-policy" || slug === "terms-of-service";
  const isSpecialty = slug === "plus-size-virtual-try-on" || slug === "mens-ai-clothes-changer";
  const isVirtual = slug === "virtual-try-on-clothes";
  const commonT = useTranslations("common");
  const pricingPageT = useTranslations("pricingPage");

  if (isPricing) return <PricingPage locale={locale} />;
  if (isAbout) return <AboutPageContent locale={locale} />;
  if (isLegal) return <LegalPageContent locale={locale} slug={slug} />;
  if (isVirtual) return <VirtualTryOnContent locale={locale} />;

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="bg-gradient-to-b from-[#f8fafb] to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="min-w-0 max-w-2xl">
            <TopicHero slug={slug as Exclude<PageSlug, "" | "pricing">} />
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link className={darkCtaClass} href={localizedPath(locale, "editor")}>
                {commonT("startTryOn")}
              </Link>
              <span className="text-sm text-[#69717f]">{commonT("previewFirst")}</span>
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
  const technologyKeys = ["realism", "inclusive", "stability"] as const;
  const sectionKeys = ["redefining", "mission", "technology", "privacy", "join"] as const;
  const isZh = locale === "zh";
  const schema = buildPageSchema(locale, "about-us", t("slogan"), t("sections.redefining.body"));

  return (
    <article className="overflow-x-hidden bg-white">
      <section className="bg-gradient-to-b from-[#f8fafb] to-white px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-sm font-semibold text-[#1d8a84]">{t("sloganLabel")}</span>
          <h1 className="mt-3 break-words text-4xl font-semibold leading-tight text-[#222529] sm:text-5xl lg:text-6xl">{t("slogan")}</h1>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[220px_minmax(0,820px)] lg:gap-20">
          <aside className="grid gap-2 rounded-2xl border border-gray-200 bg-[#fbfcfd] p-4 lg:sticky lg:top-24" aria-label="About page sections">
            {sectionKeys.map((key) => (
              <a className="rounded-lg px-3 py-2 text-sm font-semibold text-[#59616d] transition-colors hover:bg-white hover:text-[#222529]" href={`#${key}`} key={key}>
                {t(`sidebar.${key}`)}
              </a>
            ))}
          </aside>

          <div className="grid gap-8">
            <section id="redefining" className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">{t("aboutLabel")}</span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{t("sections.redefining.title")}</h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">{t("sections.redefining.body")}</p>
            </section>

            <section id="mission" className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">{t("sections.mission.label")}</span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{t("sections.mission.title")}</h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">{t("sections.mission.body1")}</p>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">{t("sections.mission.body2")}</p>
            </section>

            <section id="technology" className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">{t("sections.technology.label")}</span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{t("sections.technology.title")}</h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">
                {isZh
                  ? "我们会在产品页面说明图片如何处理、为什么需要 AI 辅助生成，以及哪些场景不适合使用。用户应该在上传前知道流程，而不是在支付后才发现限制。"
                  : "We explain how uploaded photos are handled, why AI-assisted generation is useful, and where the product should not be used. Users should understand the workflow before paying, not after."}
              </p>
              <div className="mt-6 grid gap-4">
                {technologyKeys.map((key, index) => (
                  <article className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]" key={key}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#23a7a0]/25 bg-[#f2fffb] text-xs font-semibold text-[#1d8a84]">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-[#222529]">{t(`technology.${key}.title`)}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#69717f]">{t(`technology.${key}.text`)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="privacy" className="rounded-3xl border border-[#23a7a0]/25 bg-[#f2fffb] p-6">
              <span className="text-sm font-semibold text-[#1d8a84]">{t("sections.privacy.label")}</span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{t("sections.privacy.title")}</h2>
              <p className="mt-4 text-base leading-8 text-[#3f4654]">{t("sections.privacy.body")}</p>
            </section>

            <section className="border-b border-gray-200 pb-8">
              <span className="text-sm font-semibold text-[#1d8a84]">{isZh ? "Who, How, Why" : "Who, How, Why"}</span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{isZh ? "我们如何建立用户信任" : "How we build user trust"}</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {(isZh
                  ? [
                      ["谁在做", "由 Buildwithtime 时间魔法工坊维护，专注把 AI 工具做成清晰、可试用、可解释的产品。"],
                      ["如何生成", "AI 用于服装试穿预览，页面会区分本地演示结果和正式 API 生成结果。"],
                      ["为什么存在", "帮助用户在购物、造型或拍摄前做更好的视觉判断，而不是制造强制付费压力。"]
                    ]
                  : [
                      ["Who", "Maintained by Buildwithtime, focused on turning AI tools into clear, testable, explainable products."],
                      ["How", "AI is used for outfit preview generation, and the product distinguishes local demo previews from production API results."],
                      ["Why", "To help shoppers, creators, and styling users make better visual decisions before buying, reshooting, or upgrading."]
                    ]).map(([title, text]) => (
                  <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]" key={title}>
                    <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="join" className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-[#fbfcfd] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-sm font-semibold text-[#1d8a84]">{t("sections.join.label")}</span>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529]">{t("sections.join.title")}</h2>
                <p className="mt-3 text-base leading-7 text-[#69717f]">{t("sections.join.body")}</p>
              </div>
              <Link className={`${darkCtaClass} shrink-0`} href={localizedPath(locale, "editor")}>
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

function TopicHero({ slug }: { slug: Exclude<PageSlug, "" | "pricing"> }) {
  const t = useTranslations(`topicPages.${slug}`);
  return (
    <>
      <span className="text-sm font-semibold text-[#23a7a0]">{t("eyebrow")}</span>
      <h1 className="mt-3 max-w-full break-words text-4xl font-semibold leading-tight text-[#222529] sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-full break-words text-base leading-7 text-[#69717f]">{t("description")}</p>
    </>
  );
}

function PricingPage({ locale }: { locale: Locale }) {
  const t = useTranslations("pricing");
  const commonT = useTranslations("common");
  const pricingPageT = useTranslations("pricingPage");
  const isZh = locale === "zh";
  const planKeys = ["starter", "creator", "pro"] as const;
  const trustNoteKeys = ["freeCredits", "refunds", "privacy"] as const;
  const securityKeys = ["stripeFirst", "paymentRecovery", "creditsRefresh", "hdAfterValue", "riskControl"] as const;
  const faqKeys = ["freeCredits", "hdExtra", "failedJobs", "renewal", "cancel"] as const;
  const chooseCards = isZh
    ? [
        ["只是想测试效果", "先用免费额度。用同一张清晰正面照测试 2-3 套衣服，重点看脸部保留、肩线、腰线和服装边缘。"],
        ["偶尔要多试几套", "选择一次性额度包。适合临时购物、头像更新或内容发布前的少量试穿，不产生订阅续费。"],
        ["经常做搭配或素材", "选择月度套餐。Basic 更适合固定周更或小批量图片；Pro 适合频繁生成和高清下载。"]
      ]
    : [
        ["Testing the quality", "Start with the free credits. Use one clear front-facing photo and compare 2-3 outfits for face preservation, shoulder line, waist placement, and garment edges."],
        ["Trying a few more looks", "Use the one-time credit pack for occasional shopping, profile updates, or content checks without starting a subscription."],
        ["Creating regularly", "Choose a monthly plan. Basic fits steady weekly use; Pro is better for frequent generations and HD downloads."]
      ];
  const creditRules = isZh
    ? [
        ["标准试穿", "1 credit", "先判断服装轮廓、风格、颜色和整体搭配方向。"],
        ["HD 下载", "+1 credit", "只在结果满意后再解锁更高清版本，避免先为不可用结果付费。"],
        ["系统失败", "自动返还", "服务端失败、超时或无法交付可用结果时，不应该消耗额度。"]
      ]
    : [
        ["Standard try-on", "1 credit", "Use this first to judge silhouette, color, style, and overall outfit direction."],
        ["HD download", "+1 credit", "Unlock higher quality only after the preview is useful, not before."],
        ["System failure", "Refunded", "Server failures, timeouts, or unusable delivery should not consume credits."]
      ];
  const schema = [
    buildBreadcrumbSchema(locale, "pricing", t("title")),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "AI Clothes Changer",
      url: absoluteLocalizedUrl(locale, "pricing"),
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", name: t("starter.name"), price: "0.99", priceCurrency: "USD", description: t("starter.description") },
        { "@type": "Offer", name: t("creator.name"), price: "7.99", priceCurrency: "USD", description: t("creator.description") },
        { "@type": "Offer", name: t("pro.name"), price: "14.99", priceCurrency: "USD", description: t("pro.description") }
      ]
    }
  ];

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="w-full max-w-full overflow-hidden px-4 pb-8 pt-14 text-center sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto w-full max-w-[22rem] sm:max-w-4xl">
          <span className="text-sm font-semibold text-[#1d8a84]">{t("eyebrow")}</span>
          <h1 className="mx-auto mt-3 max-w-[22rem] break-words text-3xl font-semibold leading-tight text-[#222529] sm:max-w-3xl sm:text-5xl lg:text-6xl">{pricingPageT("heroTitle")}</h1>
          <p className="mx-auto mt-4 max-w-[22rem] break-words text-base leading-7 text-[#47505f] sm:max-w-3xl sm:text-lg">
            {pricingPageT("heroBody")}
            <strong> {pricingPageT("heroHighlight")}</strong>
          </p>
          <div className="mx-auto mt-8 grid min-h-11 w-full max-w-[22rem] grid-cols-2 gap-1 rounded-full bg-[#f1f3f5] p-1 sm:max-w-[26rem]" aria-label="Billing cycle">
            <button type="button" className="min-w-0 rounded-full px-2 text-sm font-medium leading-5 text-[#1d8a84] sm:px-3">{pricingPageT("yearlyLabel")}</button>
            <button type="button" className="min-w-0 rounded-full bg-white px-2 text-sm font-medium leading-5 text-[#222529] shadow-sm sm:px-3">{pricingPageT("monthlyLabel")}</button>
          </div>
        </div>
      </section>

      <section className="w-full max-w-full overflow-hidden px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[22rem] grid-cols-1 gap-4 sm:max-w-6xl md:grid-cols-3">
          {planKeys.map((key) => (
            <article
              className={`relative mx-auto flex w-full max-w-[22rem] min-w-0 flex-col rounded-2xl border bg-white p-5 sm:max-w-none sm:p-6 ${
                key === "starter" ? "border-[#23a7a0] shadow-[0_18px_48px_rgba(0,205,176,0.14)] md:-translate-y-3" : "border-gray-200"
              }`}
              key={key}
            >
              <div className="flex min-h-7 flex-wrap items-start justify-between gap-3">
                <h2 className="min-w-0 text-xl font-semibold leading-snug text-[#222529]">{t(`${key}.name`)}</h2>
                {key === "starter" ? <span className="shrink-0 rounded-full bg-[#222529] px-3 py-1 text-xs font-semibold text-white">{pricingPageT("featuredBadge")}</span> : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-[#69717f]">{t(`${key}.description`)}</p>
              <div className="mt-4 flex items-end gap-1">
                <strong className="text-4xl font-semibold text-[#222529]">{t(`${key}.price`)}</strong>
                <span className="pb-1 text-sm text-[#69717f]">/{t(`${key}.period`)}</span>
              </div>
              <Link
                className={`${darkCtaClass} mt-5 w-full px-4`}
                href="#"
              >
                {t(`${key}.cta`)}
              </Link>
              <div className="mt-4 rounded-lg bg-[#effbf8] px-3 py-2 text-sm font-semibold text-[#1d8a84]">{t(`${key}.credits`)}</div>
              <ul className="mt-5 grid gap-3">
                {[1, 2, 3, 4].map((benefitIndex) => (
                  <li className="flex gap-2 text-sm leading-6 text-[#47505f]" key={benefitIndex}>
                    <CheckCircle2 size={16} className="mt-1 shrink-0 text-[#1d8a84]" />
                    <span>{pricingPageT(`planBenefits.${key}.${benefitIndex}`)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

      </section>

      <section className="bg-[#fbfcfd] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1fr]">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{isZh ? "额度如何选择" : "How to choose"}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{isZh ? "按你的使用频率选，不按焦虑付费" : "Choose by usage, not by pressure"}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {isZh
                ? "定价页应该帮用户做选择：先免费验证效果，偶尔使用买小额度包，经常生成再考虑月度套餐。"
                : "Pricing should help users decide: test quality for free, buy a small pack for occasional use, and move to monthly only when try-on becomes part of a regular workflow."}
            </p>
          </div>
          <div className="grid gap-3">
            {chooseCards.map(([title, text]) => (
              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)]" key={title}>
                <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1fr]">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{isZh ? "Credits explained" : "Credits explained"}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{isZh ? "先预览，再决定是否升级高清" : "Preview first, then decide if HD is worth it"}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {isZh
                ? "你应该在购买前知道每次试穿、高清下载和失败返还分别怎么计算。页面上的说明也会和账户里的额度消耗保持一致。"
                : "Users should know how try-ons, HD downloads, and failure refunds work before checkout. The visible explanation should match the credit behavior inside the account."}
            </p>
          </div>
          <div className="grid gap-3">
            {creditRules.map(([title, value, text]) => (
              <article className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)] sm:flex-row sm:items-start" key={title}>
                <strong className="w-fit rounded-full bg-[#effbf8] px-3 py-1.5 text-sm font-semibold text-[#1d8a84]">{value}</strong>
                <div>
                  <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#69717f]">{text}</p>
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
              <article className="flex min-h-28 gap-3 rounded-2xl border border-gray-200 bg-[#fbfcfd] p-5" key={key}>
                <Icon size={18} className="mt-1 shrink-0 text-[#1d8a84]" />
                <div>
                  <h2 className="text-sm font-semibold text-[#222529]">{pricingPageT(`trustNotes.${key}.title`)}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#69717f]">{pricingPageT(`trustNotes.${key}.text`)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold text-[#1d8a84]">{commonT("paymentUx")}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{commonT("clearCredits")}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">{commonT("clearCreditsText")}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {securityKeys.map((key) => {
              const Icon = pricingSecurityIconMap[key];
              return (
                <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]" key={key}>
                  <Icon size={24} className="text-[#1d8a84]" />
                  <h3 className="mt-4 text-base font-semibold text-[#222529]">{pricingPageT(`security.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#69717f]">{pricingPageT(`security.${key}.text`)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfd] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold text-[#1d8a84]">{commonT("faq")}</span>
            <h2 className="mt-3 text-3xl font-semibold text-[#222529]">{commonT("pricingFaqs")}</h2>
          </div>
          <div className="grid gap-3">
            {faqKeys.map((key) => (
              <details className="rounded-2xl border border-gray-200 bg-white p-5" key={key}>
                <summary className="cursor-pointer text-base font-semibold text-[#222529]">{pricingPageT(`faqs.${key}.question`)}</summary>
                <p className="mt-3 text-sm leading-6 text-[#69717f]">{pricingPageT(`faqs.${key}.answer`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={schema} />
    </div>
  );
}

function StandardContent({ slug }: { slug: Exclude<PageSlug, "" | "pricing"> }) {
  const t = useTranslations(`topicPages.${slug}`);
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")];
  const bodyTexts = slug === "about-us" || slug === "privacy-policy" || slug === "terms-of-service"
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
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-[#fbfcfd] p-4" key={item}>
              <CheckCircle2 size={18} className="mt-1 shrink-0 text-[#1d8a84]" />
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
  const isZh = locale === "zh";
  const decisionCards = isZh
    ? [
        ["购物前判断", "上传正面照和商品图，先判断颜色、廓形和整体风格是否适合。"],
        ["内容创作", "快速测试不同造型方向，减少真实拍摄前的试错成本。"],
        ["电商预览", "用更清晰的视觉示例解释服装效果，而不是只靠尺码表。"]
      ]
    : [
        ["Shopping confidence", "Upload a front-facing photo and garment image to judge color, silhouette, and overall style before buying."],
        ["Creator planning", "Test styling directions quickly before spending time on a real shoot."],
        ["Commerce previews", "Explain clothing outcomes visually instead of relying only on size charts."]
      ];
  const comparisonCards = isZh
    ? [
        ["先看人物是否保留", "脸部、姿势和身体比例应该仍然像原图，换装不应该让人物身份明显改变。"],
        ["再看服装边缘", "领口、袖口、腰部和下摆是最容易暴露问题的区域。"],
        ["最后看使用场景", "购物预览看搭配方向，头像照看专业感，商品图看是否能解释款式。"]
      ]
    : [
        ["Check identity first", "The face, pose, and body proportions should still feel like the original person."],
        ["Inspect garment edges", "Collars, cuffs, waistlines, and hems are the areas most likely to reveal a weak result."],
        ["Judge by the use case", "Shopping previews need outfit direction, profile photos need polish, and commerce images need clarity."]
      ];
  const schema = [
    buildBreadcrumbSchema(locale, "virtual-try-on-clothes", t("title")),
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: isZh ? "如何在线虚拟试穿衣服" : "How to virtually try on clothes online",
      step: [
        { "@type": "HowToStep", name: isZh ? "上传照片" : "Upload a photo", text: t("bullet1") },
        { "@type": "HowToStep", name: isZh ? "选择服装" : "Choose a clothing source", text: t("bullet2") },
        { "@type": "HowToStep", name: isZh ? "比较结果" : "Compare results", text: t("bullet3") }
      ]
    }
  ];

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="bg-gradient-to-b from-[#f8fafb] to-white px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="min-w-0 max-w-2xl">
            <TopicHero slug="virtual-try-on-clothes" />
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link className={darkCtaClass} href={localizedPath(locale, "editor")}>
                {isZh ? "打开试穿编辑器" : "Open try-on editor"}
              </Link>
              <span className="text-sm text-[#69717f]">{isZh ? "购物前先看效果" : "See the look before buying"}</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-[#f5f6f8] shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
            <Image src="/AI换装对比_纯人物无文字-转换自.webp" alt={isZh ? "AI 虚拟试穿前后对比示例" : "AI virtual try-on before and after comparison"} width={760} height={520} className="h-auto w-full max-w-full object-cover" priority />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-[0_14px_34px_rgba(24,31,52,0.12)] backdrop-blur">
              <span className="text-sm font-semibold text-[#1d8a84]">{isZh ? "Before / After" : "Before / After"}</span>
              <strong className="mt-1 block text-lg font-semibold leading-snug text-[#222529]">{isZh ? "用于购物决策的视觉预览" : "A visual preview for shopping decisions"}</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{isZh ? "User intent" : "User intent"}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{isZh ? "虚拟试穿不是玩具，它要解决购买前的不确定" : "Virtual try-on should solve uncertainty before purchase"}</h2>
            <div className="mt-5 grid gap-4 text-base leading-7 text-[#47505f]">
              <p>{t("body1")}</p>
              <p>{t("body2")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-1">
            {decisionCards.map(([title, text]) => (
              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]" key={title}>
                <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#f7f8fa] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
            <Image src="/file_000000002ad871f6a73a5896f81959f.webp" alt={isZh ? "AI 衣服试穿工作流示例" : "AI clothes try-on workflow example"} width={820} height={560} className="h-auto w-full object-cover" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{isZh ? "Practical tips" : "Practical tips"}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{isZh ? "照片越清晰，试穿判断越有价值" : "Better photos make try-on decisions more useful"}</h2>
            <div className="mt-6 grid gap-3">
              {[t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")].map((item) => (
                <p className="flex gap-3 text-base leading-7 text-[#47505f]" key={item}>
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-[#1d8a84]" />
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={outlineLinkClass} href={localizedPath(locale, "plus-size-virtual-try-on")}>{isZh ? "大码虚拟试穿" : "Plus Size Virtual Try-On"}</Link>
              <Link className={outlineLinkClass} href={localizedPath(locale, "mens-ai-clothes-changer")}>{isZh ? "男士 AI 换装" : "Men's AI Clothes Changer"}</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{isZh ? "如何判断结果" : "How to judge results"}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{isZh ? "虚拟试穿结果需要对比，而不是只看第一眼" : "A useful virtual try-on result is something you compare"}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">
              {isZh
                ? "好的试穿页面应该清楚说明用户能判断什么、不能承诺什么。AI 预览适合判断搭配方向，但不能替代真实尺码表、退换货政策或最终试穿。"
                : "A trustworthy page should explain what users can evaluate and where AI preview has limits. Virtual try-on is useful for styling direction, but it is not a final size guarantee."}
            </p>
          </div>
          <div className="grid gap-3">
            {comparisonCards.map(([title, text]) => (
              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)]" key={title}>
                <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={schema} />
    </div>
  );
}

function LegalPageContent({ locale, slug }: { locale: Locale; slug: "privacy-policy" | "terms-of-service" }) {
  const t = useTranslations(`topicPages.${slug}`);
  const isPrivacy = slug === "privacy-policy";
  const isZh = locale === "zh";
  const sections = isPrivacy
    ? (isZh
        ? [
            ["上传照片", "图片用于完成试穿生成。正式 API 接入后，上传图会在处理后自动删除。"],
            ["账户与积分", "登录信息用于保存 credits、计划和支付状态，不用于出售个人资料。"],
            ["安全审核", "系统会拦截不安全、露骨或滥用性质的上传和提示词。"],
            ["删除请求", "账户区会提供 Delete All My Data 入口，用于清除可删除的个人数据。"]
          ]
        : [
            ["Uploaded photos", "Images are used to complete the try-on workflow. After production API integration, uploads are deleted after processing."],
            ["Account and credits", "Login data is used to maintain credits, plan status, and billing state, not to sell personal information."],
            ["Safety review", "Unsafe, explicit, or abusive uploads and prompts may be blocked before generation."],
            ["Deletion requests", "The account area will include a Delete All My Data entry for removable personal data."]
          ])
    : (isZh
        ? [
            ["上传权利", "用户只能上传自己拥有或有权使用的图片和服装参考图。"],
            ["禁止用途", "禁止欺诈、冒充、露骨内容、侵权商业用途或绕过安全规则。"],
            ["积分与失败返还", "系统失败可返还积分；用户主动取消或违规请求不一定返还。"],
            ["订阅取消", "月度计划应提供清晰可见的一键取消入口。"]
          ]
        : [
            ["Upload rights", "Users may only upload photos and garment references they own or have permission to use."],
            ["Prohibited use", "Fraud, impersonation, explicit content, copyright abuse, and attempts to bypass safety rules are not allowed."],
            ["Credits and failed jobs", "System failures may be refunded; user cancellation or policy-violating requests may not be refundable."],
            ["Subscription cancellation", "Monthly plans should provide a clearly visible cancellation path."]
          ]);
  const schema = buildPageSchema(locale, slug, t("title"), t("description"));

  return (
    <article className="overflow-x-hidden bg-white">
      <section className="bg-gradient-to-b from-[#f8fafb] to-white px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-sm font-semibold text-[#1d8a84]">{t("eyebrow")}</span>
          <h1 className="mt-3 break-words text-4xl font-semibold leading-tight text-[#222529] sm:text-5xl lg:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-4 max-w-3xl break-words text-base leading-7 text-[#69717f]">{t("description")}</p>
        </div>
      </section>
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[300px_minmax(0,820px)] lg:gap-16">
          <aside className="rounded-3xl border border-[#23a7a0]/25 bg-[#f2fffb] p-6 lg:sticky lg:top-24">
            {isPrivacy ? <Lock size={22} className="text-[#1d8a84]" /> : <FileText size={22} className="text-[#1d8a84]" />}
            <h2 className="mt-4 text-lg font-semibold text-[#222529]">{isPrivacy ? (isZh ? "隐私承诺" : "Privacy promise") : (isZh ? "使用规则" : "Usage rules")}</h2>
            <p className="mt-3 text-sm leading-6 text-[#69717f]">{t("body1")}</p>
          </aside>
          <div className="grid gap-4">
            {sections.map(([title, text], index) => (
              <article className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5" key={title}>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#effbf8] text-xs font-semibold text-[#1d8a84]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-base font-semibold text-[#222529]">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#69717f]">{text}</p>
                </div>
              </article>
            ))}
            <div className="rounded-3xl border border-gray-200 bg-[#fbfcfd] p-6">
              <h2 className="text-xl font-semibold text-[#222529]">{isPrivacy ? (isZh ? "对用户最重要的事" : "What matters most for users") : (isZh ? "透明计费原则" : "Transparent billing principle")}</h2>
              <p className="mt-3 text-base leading-7 text-[#69717f]">{t("body2")}</p>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={schema} />
    </article>
  );
}

function TopicHeroPanel({ locale, slug }: { locale: Locale; slug: keyof typeof specialtyPageData }) {
  const t = useTranslations(`specialtyPages.${slug}`);
  const data = specialtyPageData[slug];
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-[#f5f6f8] shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
      <Image src={data.heroImage} alt={data.heroAlt[locale]} width={1536} height={864} className="h-auto w-full object-cover" priority />
      <div className="absolute left-5 top-5 w-44 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_16px_42px_rgba(24,31,52,0.12)] backdrop-blur">
        <span className="text-xs font-semibold text-[#1d8a84]">{t("eyebrow")}</span>
        <strong className="mt-1 block text-lg font-semibold leading-snug text-[#222529]">{t("stat")}</strong>
      </div>
      <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_16px_42px_rgba(24,31,52,0.12)] backdrop-blur">
        <Image src={data.accentImage} alt="" width={84} height={84} className="size-14 rounded-xl object-cover" />
        <Link href={localizedPath(locale, "editor")} className="pr-2 text-sm font-semibold text-[#1d8a84]">{t("cta")}</Link>
      </div>
    </div>
  );
}

function SpecialtyContent({ locale, slug }: { locale: Locale; slug: keyof typeof specialtyPageData }) {
  if (slug === "mens-ai-clothes-changer") {
    return <MensSpecialtyContent locale={locale} />;
  }

  const t = useTranslations(`topicPages.${slug}`);
  const specialtyT = useTranslations(`specialtyPages.${slug}`);
  const data = specialtyPageData[slug];
  const isZh = locale === "zh";
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")];
  const proofKeys = ["1", "2", "3"] as const;
  const relatedKeys = ["1", "2"] as const;
  const intentCards = data.intent[locale];
  const guideCards = data.guide[locale];
  const checkCards = data.checks[locale];
  const faqCards = data.faqs[locale];
  const schema = [
    buildBreadcrumbSchema(locale, slug, t("title")),
    buildPageSchema(locale, slug, t("title"), t("description")),
    buildFaqSchema(faqCards)
  ];

  return (
    <>
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{specialtyT("eyebrow")}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{specialtyT("featureTitle")}</h2>
            <div className="mt-5 grid gap-4 text-base leading-7 text-[#47505f]">
              <p>{t("body1")}</p>
              <p>{t("body2")}</p>
              <p>{specialtyT("featureText")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {bullets.map((item) => (
              <div className="flex min-h-28 items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]" key={item}>
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-[#23a7a0]" />
                <span className="text-sm leading-6 text-[#47505f]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold text-[#1d8a84]">{isZh ? "用户真正需要" : "What users need"}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{data.intentTitle[locale]}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">{data.intentText[locale]}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {intentCards.map(([title, text, image]) => (
              <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_24px_rgba(24,31,52,0.035)]" key={title}>
                <Image src={image} alt={title} width={420} height={520} className="h-72 w-full bg-[#eceef1] object-cover object-top" />
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfd] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{data.guideLabel[locale]}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{data.guideTitle[locale]}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">{data.guideText[locale]}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {guideCards.map(([title, text]) => (
              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)]" key={title}>
                <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{data.checkLabel[locale]}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{data.checkTitle[locale]}</h2>
          </div>
          <div className="grid gap-3">
            {checkCards.map(([title, text]) => (
              <article className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-5" key={title}>
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-[#1d8a84]" />
                <div>
                  <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#69717f]">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fa] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
            <Image src={data.heroImage} alt={data.heroAlt[locale]} width={1536} height={864} className="h-auto w-full object-cover" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{specialtyT("proofLabel")}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{specialtyT("proofTitle")}</h2>
            <div className="mt-6 grid gap-3">
              {proofKeys.map((key) => (
                <p className="flex gap-3 text-base leading-7 text-[#47505f]" key={key}>
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-[#1d8a84]" />
                  {specialtyT(`proofItems.${key}`)}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {relatedKeys.map((key, index) => (
                <Link className={outlineLinkClass} href={localizedPath(locale, data.related[index][1])} key={key}>
                  {specialtyT(`related.${key}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SpecialtyFaqSection
        eyebrow={isZh ? "常见问题" : "FAQ"}
        title={data.faqTitle[locale]}
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
  const isZh = locale === "zh";
  const intentCards = data.intent[locale];
  const guideCards = data.guide[locale];
  const checkCards = data.checks[locale];
  const faqCards = data.faqs[locale];
  const proofKeys = ["1", "2", "3"] as const;
  const schema = [
    buildBreadcrumbSchema(locale, slug, t("title")),
    buildPageSchema(locale, slug, t("title"), t("description")),
    buildFaqSchema(faqCards)
  ];

  return (
    <>
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <div className="rounded-3xl border border-gray-200 bg-[#fbfcfd] p-6">
            <span className="text-sm font-semibold text-[#1d8a84]">{specialtyT("eyebrow")}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529]">{specialtyT("featureTitle")}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">{specialtyT("featureText")}</p>
            <div className="mt-6 grid gap-3">
              {proofKeys.map((key) => (
                <p className="flex gap-3 text-sm leading-6 text-[#47505f]" key={key}>
                  <CheckCircle2 size={17} className="mt-1 shrink-0 text-[#1d8a84]" />
                  {specialtyT(`proofItems.${key}`)}
                </p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {intentCards.map(([title, text, image]) => (
              <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_24px_rgba(24,31,52,0.035)]" key={title}>
                <Image src={image} alt={title} width={420} height={520} className="h-64 w-full bg-[#eceef1] object-cover object-top" />
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fa] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {guideCards.map(([title, text], index) => (
              <article className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)] ${index === 0 ? "sm:col-span-2" : ""}`} key={title}>
                <span className="text-xs font-semibold text-[#1d8a84]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-base font-semibold text-[#222529]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
              </article>
            ))}
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{data.guideLabel[locale]}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{data.guideTitle[locale]}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">{data.guideText[locale]}</p>
            <Link className={`${darkCtaClass} mt-7`} href={localizedPath(locale, "editor")}>
              {isZh ? "选择男装模特" : "Choose a men's model"}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-[#1d8a84]">{data.checkLabel[locale]}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{data.checkTitle[locale]}</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {checkCards.map(([title, text]) => (
              <article className="rounded-2xl border border-gray-200 bg-white p-5" key={title}>
                <h3 className="text-base font-semibold text-[#222529]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#69717f]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfd] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <span className="text-sm font-semibold text-[#1d8a84]">{specialtyT("proofLabel")}</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{specialtyT("proofTitle")}</h2>
            <p className="mt-4 text-base leading-7 text-[#69717f]">{data.intentText[locale]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={outlineLinkClass} href={localizedPath(locale, "plus-size-virtual-try-on")}>{specialtyT("related.1")}</Link>
              <Link className={outlineLinkClass} href={localizedPath(locale, "virtual-try-on-clothes")}>{specialtyT("related.2")}</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_48px_rgba(24,31,52,0.08)]">
            <Image src={data.heroImage} alt={data.heroAlt[locale]} width={1536} height={864} className="h-auto w-full object-cover" />
          </div>
        </div>
      </section>
      <SpecialtyFaqSection
        eyebrow={isZh ? "常见问题" : "FAQ"}
        title={data.faqTitle[locale]}
        faqs={faqCards}
      />
      <JsonLd data={schema} />
    </>
  );
}

function SpecialtyFaqSection({ eyebrow, title, faqs }: { eyebrow: string; title: string; faqs: readonly (readonly [string, string])[] }) {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
        <div>
          <span className="text-sm font-semibold text-[#1d8a84]">{eyebrow}</span>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{title}</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer]) => (
            <details className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_20px_rgba(24,31,52,0.03)]" key={question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#222529]">
                <span>{question}</span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#effbf8] text-[#1d8a84] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#69717f]">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function buildBreadcrumbSchema(locale: Locale, slug: PageSlug, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AI Clothes Changer", item: absoluteLocalizedUrl(locale) },
      { "@type": "ListItem", position: 2, name, item: absoluteLocalizedUrl(locale, slug) }
    ]
  };
}

function buildPageSchema(locale: Locale, slug: PageSlug, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteLocalizedUrl(locale, slug),
    isPartOf: {
      "@type": "WebSite",
      name: "AI Clothes Changer",
      url: absoluteLocalizedUrl(locale)
    }
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
        text: answer
      }
    }))
  };
}

const specialtyPageData = {
  "plus-size-virtual-try-on": {
    image: storySectionImages[2],
    heroImage: "/seo-assets/plus-size-try-on-comparison.png",
    heroAlt: {
      en: "Plus size virtual try-on before and after comparison with realistic green dress drape",
      zh: "大码虚拟试穿前后对比，展示绿色连衣裙真实垂坠效果"
    },
    accentImage: heroImages[2].src,
    intentTitle: {
      en: "What plus size users need before trusting a virtual fitting room",
      zh: "大码用户在信任虚拟试穿前真正需要看到什么"
    },
    intentText: {
      en: "A useful plus size try-on page should help users see body representation, understand photo quality, and know the limits before checkout.",
      zh: "有用的大码试穿页面应该帮助用户看到体型代表性、理解照片质量要求，并在结账前知道效果边界。"
    },
    guideLabel: {
      en: "Photo guide",
      zh: "拍照建议"
    },
    guideTitle: {
      en: "What makes a plus size virtual try-on easier to trust",
      zh: "什么样的大码虚拟试穿更值得信任"
    },
    guideText: {
      en: "A helpful preview needs more than a clothing swap. It should preserve the person, show how fabric falls over curves, and make the limits clear before a user spends credits.",
      zh: "有用的预览不只是把衣服换上去。它需要尽量保留人物身份，展示面料在曲线上的垂坠，并在用户消耗额度前说明限制。"
    },
    guide: {
      en: [
        ["Use a full-body front photo", "Keep shoulders, waist, hips, and hem visible. Cropped mirror photos make sleeve length and drape harder to judge."],
        ["Avoid heavy shadows", "Natural light helps the model separate body shape from clothing folds and background noise."],
        ["Pick one garment goal", "Test a dress, jacket, or top clearly first. Mixing too many garment references can make the preview less reliable."],
        ["Treat it as fit direction", "Use the output to compare silhouette and styling, not as a final size guarantee."]
      ],
      zh: [
        ["使用正面全身照", "尽量露出肩部、腰部、臀部和下摆。裁切过多的镜自拍会让袖长和垂坠更难判断。"],
        ["避免重阴影", "自然光能帮助模型区分身体轮廓、衣服褶皱和背景干扰。"],
        ["一次测试一个目标", "先明确测试连衣裙、夹克或上衣。参考图过多会降低预览稳定性。"],
        ["把结果当作方向参考", "用它判断廓形和搭配方向，不把它当成最终尺码承诺。"]
      ]
    },
    checkLabel: {
      en: "Result checklist",
      zh: "结果检查"
    },
    checkTitle: {
      en: "Look at the parts that change purchase confidence",
      zh: "重点看真正影响购买信心的部分"
    },
    checks: {
      en: [
        ["Shoulder line", "The shoulder seam should sit naturally instead of sliding too far inward or outward."],
        ["Waist placement", "Check whether belts, seams, and dress shape land where you expect on your body."],
        ["Sleeve and hem length", "Compare sleeve ending, dress length, and pant break against the original pose."],
        ["Fabric drape", "Look for believable folds instead of a flat sticker-like garment."]
      ],
      zh: [
        ["肩线", "肩缝应该自然落位，而不是明显内缩或外扩。"],
        ["腰线位置", "检查腰带、接缝和连衣裙形状是否落在合理位置。"],
        ["袖长和下摆", "对比袖口、裙长、裤脚在原姿势上的变化是否自然。"],
        ["面料垂坠", "看褶皱是否可信，而不是像平贴在身上的贴纸。"]
      ]
    },
    faqTitle: {
      en: "Plus size virtual try-on questions users ask before uploading",
      zh: "上传前用户常问的大码虚拟试穿问题"
    },
    faqs: {
      en: [
        ["Is plus size virtual try-on a size guarantee?", "No. It is a visual preview for silhouette, styling direction, fabric drape, and photo planning. Always check the retailer's size chart, measurements, and return policy before buying."],
        ["What photo works best for curvy or plus size try-on?", "Use a clear front-facing full-body photo in natural light. Keep shoulders, waist, hips, legs, and garment edges visible so the preview can map the outfit more reliably."],
        ["Can I use a plus size model instead of my own photo?", "Yes. You can start with built-in plus size model examples when you want to compare outfit direction quickly, then upload your own photo for a more personal preview."],
        ["What should I check in the result?", "Look at shoulder line, waist placement, sleeve length, hem length, and fabric folds. These details are more useful than judging the image from a small thumbnail."]
      ],
      zh: [
        ["大码虚拟试穿能保证尺码准确吗？", "不能。它是用于判断廓形、搭配方向、面料垂坠和拍摄计划的视觉预览。购买前仍需查看商家的尺码表、具体尺寸和退换货政策。"],
        ["什么照片最适合大码或曲线体型试穿？", "建议使用自然光下的正面全身照，尽量露出肩部、腰部、臀部、腿部和服装边缘，让试穿预览更稳定。"],
        ["可以先用内置大码模特吗？", "可以。你可以先用内置大码模特快速比较风格方向，再上传自己的照片得到更个人化的预览。"],
        ["结果应该重点看哪里？", "重点看肩线、腰线、袖长、下摆和面料褶皱。这些细节比只看小缩略图更能判断结果是否有用。"]
      ]
    },
    intent: {
      en: [
        ["Body representation", "Use plus size and curvy model paths so users are not forced to infer fit from one narrow body type.", "/models/model-11.webp"],
        ["Drape and silhouette", "Judge sleeve length, waist placement, and garment fall before buying or styling.", "/models/model-14.webp"],
        ["Photo quality guidance", "Front-facing full-body photos in natural light make virtual try-on more useful.", "/models/model-18.webp"]
      ],
      zh: [
        ["体型代表性", "提供大码与曲线模特路径，减少用户只能从单一瘦模特推测效果的问题。", "/models/model-11.webp"],
        ["垂坠和廓形", "购买或搭配前先判断袖长、腰线和衣服下垂效果。", "/models/model-14.webp"],
        ["照片质量建议", "自然光下的正面全身照，会让虚拟试穿判断更有价值。", "/models/model-18.webp"]
      ]
    },
    related: [
      ["Men's AI Clothes Changer", "mens-ai-clothes-changer" as const],
      ["Virtual Try On Clothes", "virtual-try-on-clothes" as const]
    ]
  },
  "mens-ai-clothes-changer": {
    image: storySectionImages[0],
    heroImage: "/seo-assets/mens-try-on-comparison.png",
    heroAlt: {
      en: "Men's AI clothes changer before and after comparison from T-shirt to blazer outfit",
      zh: "男装 AI 换装前后对比，从 T 恤变成西装外套造型"
    },
    accentImage: exampleCardImages[1],
    intentTitle: {
      en: "Men's try-on intent is practical: shirts, jackets, suits, and profile photos",
      zh: "男士试穿意图更实用：衬衫、夹克、西装和头像照"
    },
    intentText: {
      en: "The page is written for users comparing everyday outfits, workwear, and cleaner profile looks, not just broad fashion effects.",
      zh: "本页面向比较日常穿搭、通勤服装和更干净头像效果的用户，而不是泛泛的时尚特效。"
    },
    guideLabel: {
      en: "Photo guide",
      zh: "拍照建议"
    },
    guideTitle: {
      en: "How to get a cleaner men's outfit preview",
      zh: "如何得到更干净的男装试穿预览"
    },
    guideText: {
      en: "Men's try-on pages should answer practical questions: does the jacket sharpen the profile, does the shirt length work, and does the outfit feel natural enough for shopping or a profile photo?",
      zh: "男装试穿页面要回答实用问题：夹克是否让形象更利落、衬衫长度是否合适、整体是否足够自然用于购物或头像照。"
    },
    guide: {
      en: [
        ["Use a simple pose", "A straight or slightly angled pose makes blazers, shirts, and trousers easier to align."],
        ["Keep the torso visible", "Profile crops can work, but full upper-body photos give better reads on jacket length and shirt fit."],
        ["Match the occasion", "Try workwear, streetwear, or profile looks separately so the result answers one clear intent."],
        ["Compare color and proportion", "Check whether the garment color works with skin tone, background, and body proportion."]
      ],
      zh: [
        ["使用简单姿势", "正面或轻微侧身更容易对齐西装外套、衬衫和裤装。"],
        ["露出上半身轮廓", "头像裁切也能用，但完整上半身更容易判断外套长度和衬衫版型。"],
        ["按场景分开测试", "通勤、街头、头像照分别测试，让每次结果回答一个明确需求。"],
        ["比较颜色和比例", "检查服装颜色是否适合肤色、背景和整体身体比例。"]
      ]
    },
    checkLabel: {
      en: "Result checklist",
      zh: "结果检查"
    },
    checkTitle: {
      en: "What to compare before you download or regenerate",
      zh: "下载或重新生成前应该比较什么"
    },
    checks: {
      en: [
        ["Blazer shoulders", "A good result should keep the jacket structured without making the body look stiff."],
        ["Shirt length", "Check whether the shirt tucks, hangs, or layers in a believable way."],
        ["Trouser or layer color", "Make sure the generated outfit still fits the photo lighting and background."],
        ["Face and posture", "The outfit should change without turning the person into someone else."]
      ],
      zh: [
        ["西装肩部", "好的结果应该保留外套结构，但不会让身体显得僵硬。"],
        ["衬衫长度", "检查衬衫塞入、自然下垂或叠穿效果是否可信。"],
        ["裤装和层次颜色", "生成服装要和照片光线、背景保持协调。"],
        ["脸部和姿态", "衣服改变了，但人物不应该变成另一个人。"]
      ]
    },
    faqTitle: {
      en: "Men's AI clothes changer questions before you try a look",
      zh: "试穿男装前用户常问的问题"
    },
    faqs: {
      en: [
        ["Can I use it for profile photos?", "Yes. Men's try-on is useful for testing shirts, jackets, and cleaner profile looks before reshooting or updating an avatar."],
        ["What men's outfits work best?", "Simple shirts, blazers, jackets, suits, streetwear layers, and clean workwear usually work best because the garment structure is easy to compare."],
        ["Should I upload a full-body or upper-body photo?", "For shirts and jackets, an upper-body photo can work. For suits, trousers, or full outfits, a full-body photo gives a better read on proportion and length."],
        ["Will the AI change my face?", "The product goal is to preserve face, posture, and identity while changing the outfit area. Clear lighting and a simple pose improve consistency."]
      ],
      zh: [
        ["可以用于头像照吗？", "可以。男装试穿很适合在重拍或更新头像前，测试衬衫、夹克和更干净的形象照效果。"],
        ["哪些男装效果最好？", "简单衬衫、西装外套、夹克、西装、街头叠穿和干净通勤装通常更稳定，因为服装结构更容易比较。"],
        ["应该上传全身照还是上半身照？", "只试衬衫和夹克时，上半身照也可以。试西装、裤装或整套搭配时，全身照更容易判断比例和长度。"],
        ["AI 会改变我的脸吗？", "产品目标是在更换服装区域时保留脸部、姿态和身份。清晰光线和简单姿势会让一致性更好。"]
      ]
    },
    intent: {
      en: [
        ["Workwear preview", "Test shirts, jackets, and cleaner looks before a profile update or shoot.", "/models/model-21.webp"],
        ["Streetwear check", "Compare casual layers and silhouettes quickly with a consistent model photo.", "/models/model-23.webp"],
        ["Shopping decision", "Use a garment reference to decide whether the color and fit direction are worth trying.", "/models/model-27.webp"]
      ],
      zh: [
        ["通勤服装预览", "在更新头像或拍摄前，先测试衬衫、夹克和更利落的造型。", "/models/model-21.webp"],
        ["街头风格检查", "用一致的模特照快速比较休闲层次和廓形。", "/models/model-23.webp"],
        ["购物判断", "上传服装参考图，先判断颜色和版型方向是否值得尝试。", "/models/model-27.webp"]
      ]
    },
    related: [
      ["Plus Size Virtual Try-On", "plus-size-virtual-try-on" as const],
      ["Virtual Try On Clothes", "virtual-try-on-clothes" as const]
    ]
  }
} as const;

const trustNoteIconMap = {
  freeCredits: BadgeCheck,
  refunds: RotateCcw,
  privacy: ShieldCheck
} as const;

const pricingSecurityIconMap = {
  stripeFirst: BadgeCheck,
  paymentRecovery: RotateCcw,
  creditsRefresh: CheckCircle2,
  hdAfterValue: CheckCircle2,
  riskControl: ShieldCheck
} as const;
