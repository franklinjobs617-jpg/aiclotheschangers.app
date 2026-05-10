"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  exampleCardKeys,
  faqKeys,
  howStepIcons,
  howStepKeys,
  storySectionKeys,
  trustItemIcons,
  trustItemKeys,
  useCaseKeys,
  useCaseSlugs,
  whyItemKeys
} from "@/lib/homeContent";
import { localizedPath, type Locale } from "@/lib/site";

const exampleCardImages = [
  "https://images.insmind.com/market-operations/market/side/21551ac66006432b9759facb4fdf771d/1730889665936.jpg",
  "https://images.insmind.com/market-operations/market/side/ce79b59be1d84e9788fcc4491ae13da4/1730889563222.jpg",
  "https://images.insmind.com/market-operations/market/side/d8ddda7f875c43fa9f20bf0c8b6548d2/1730889600007.jpg"
] as const;

const storySectionImages = [
  "/88147673-f5b7-473b-9d57-aef4b2857b5b.png",
  "/AI换装对比_纯人物无文字-转换自.webp",
  "/file_00000000d594720ca5615959f86e6a8c.png"
] as const;

export function ContentSections({ locale }: { locale: Locale }) {
  const t = useTranslations("sections");
  const trustT = useTranslations("trustItems");
  const howT = useTranslations("howSteps");
  const exampleT = useTranslations("exampleCards");
  const feedbackT = useTranslations("feedbackSection");
  const storyT = useTranslations("storySections");
  const whyT = useTranslations("whyItems");
  const useCaseT = useTranslations("useCases");
  const faqT = useTranslations("faqs");
  const commonT = useTranslations("common");
  const comparisonT = useTranslations("comparison");
  const feedbackHighlights = ["1", "2", "3"] as const;
  const editorHref = localizedPath(locale, "editor");

  return (
    <>
      <section className="trust-strip" aria-label={t("trust")}>
        <div className="container">
          <div className="trust-grid">
            {trustItemKeys.map((key, index) => {
              const Icon = trustItemIcons[index];
              return (
                <article key={key}>
                  <Icon size={18} />
                  <div>
                    <h2>{trustT(`${key}.title`)}</h2>
                    <p>{trustT(`${key}.text`)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <div className="section-head">
            <span>{commonT("howItWorks")}</span>
            <h2>{t("how")}</h2>
            <p>{t("howText")}</p>
          </div>
          <div className="steps-grid">
            {howStepKeys.map((key, index) => {
              const Icon = howStepIcons[index];
              return (
                <article className="step-card" key={key}>
                  <div className="step-content">
                    <div className="step-number">
                      <span>{index + 1}</span>
                      <Icon size={20} />
                    </div>
                    <h3>{howT(`${key}.title`)}</h3>
                    <p>{howT(`${key}.text`)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <span>{commonT("results")}</span>
            <h2>{t("examples")}</h2>
            <p>{t("examplesText")}</p>
          </div>
          <div className="example-grid">
            {exampleCardKeys.map((key, i) => (
              <article className="example-card" key={key}>
                <Image src={exampleCardImages[i]} alt={exampleT(`${key}.title`)} width={720} height={520} />
                <div>
                  <span>{exampleT(`${key}.tag`)}</span>
                  <h3>{exampleT(`${key}.title`)}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section story-section">
        <div className="container">
          <div className="story-stack">
            {storySectionKeys.map((key, index) => (
              <article className={index % 2 === 1 ? "story-row reverse" : "story-row"} key={key}>
                <div className="story-image">
                  <Image src={storySectionImages[index]} alt={storyT(`${key}.title`)} width={820} height={560} />
                </div>
                <div className="story-copy">
                  <h2>{storyT(`${key}.title`)}</h2>
                  <p>
                    {storyT(`${key}.before`)}
                    <strong>{storyT(`${key}.highlight`)}</strong>
                    {storyT(`${key}.after`)}
                  </p>
                  <Link className="story-cta" href={editorHref}>
                    {storyT(`${key}.cta`)}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span>{commonT("whyUs")}</span>
            <h2>{t("why")}</h2>
            <p>{t("whyText")}</p>
          </div>
          <div className="why-list">
            {whyItemKeys.map((key) => (
              <article key={key}>
                <Check size={18} />
                <div>
                  <h3>{whyT(`${key}.title`)}</h3>
                  <p>{whyT(`${key}.text`)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section comparison-section">
        <div className="container">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
            <div className="lg:sticky lg:top-24">
              <span className="text-sm font-semibold text-[#1d8a84]">{comparisonT("eyebrow")}</span>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#222529] sm:text-4xl">{comparisonT("title")}</h2>
              <p className="mt-4 text-base leading-7 text-[#69717f]">{comparisonT("description")}</p>
              <Link className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#222529] px-5 text-sm font-semibold !text-white transition-colors hover:bg-[#353b44]" href={editorHref}>
                {comparisonT("cta")}
              </Link>
            </div>
            <div className="grid gap-3" aria-label={comparisonT("title")}>
              {(["fabric", "body", "progress", "trust"] as const).map((key) => (
                <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(24,31,52,0.035)]" key={key}>
                  <h3 className="text-base font-semibold text-[#222529]">{comparisonT(`${key}.title`)}</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-[#f7f8fa] p-4">
                      <span className="text-xs font-semibold uppercase tracking-normal text-[#7a8391]">{comparisonT("generic")}</span>
                      <p className="mt-2 text-sm leading-6 text-[#69717f]">{comparisonT(`${key}.generic`)}</p>
                    </div>
                    <div className="rounded-xl border border-[#23a7a0]/25 bg-[#f2fffb] p-4">
                      <span className="text-xs font-semibold uppercase tracking-normal text-[#1d8a84]">{comparisonT("ours")}</span>
                      <p className="mt-2 text-sm leading-6 text-[#47505f]">{comparisonT(`${key}.ours`)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section why-section">
        <div className="container">
          <div className="section-head">
            <span>{commonT("useCases")}</span>
            <h2>{t("useCases")}</h2>
            <p>{t("useCasesText")}</p>
          </div>
          <div className="usecase-grid">
            {useCaseKeys.map((key, i) => (
              <Link className="usecase-card" href={localizedPath(locale, useCaseSlugs[i])} key={key}>
                <h3>{useCaseT(`${key}.title`)}</h3>
                <p>{useCaseT(`${key}.text`)}</p>
                <span>{commonT("openPath")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section feedback-section">
        <div className="container">
          <div className="section-head">
            <span>{feedbackT("eyebrow")}</span>
            <h2>{feedbackT("title")}</h2>
            <p>{feedbackT("description")}</p>
          </div>
          <div className="feedback-shell">
            <article className="feedback-featured">
              <span className="feedback-kicker">{feedbackT("featuredLabel")}</span>
              <p className="feedback-quote">"{feedbackT("featuredQuote")}"</p>
              <div className="feedback-person">
                <span className="feedback-avatar">N</span>
                <div>
                  <strong>{feedbackT("featuredName")}</strong>
                  <span>{feedbackT("featuredRole")}</span>
                </div>
              </div>
            </article>

            <div className="feedback-side">
              <article className="feedback-card">
                <p className="feedback-card-quote">"{feedbackT("secondary.shopping.quote")}"</p>
                <div className="feedback-person compact">
                  <span className="feedback-avatar">C</span>
                  <div>
                    <strong>{feedbackT("secondary.shopping.name")}</strong>
                    <span>{feedbackT("secondary.shopping.role")}</span>
                  </div>
                </div>
              </article>

              <article className="feedback-card">
                <p className="feedback-card-quote">"{feedbackT("secondary.fit.quote")}"</p>
                <div className="feedback-person compact">
                  <span className="feedback-avatar">M</span>
                  <div>
                    <strong>{feedbackT("secondary.fit.name")}</strong>
                    <span>{feedbackT("secondary.fit.role")}</span>
                  </div>
                </div>
              </article>

              <div className="feedback-tags" aria-label="Feedback highlights">
                {feedbackHighlights.map((key) => (
                  <span key={key}>{feedbackT(`highlights.${key}`)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container narrow">
          <div className="section-head">
            <span>{commonT("faq")}</span>
            <h2>{t("faq")}</h2>
          </div>
          <div className="faq-list">
            {faqKeys.map((key) => (
              <details key={key}>
                <summary>
                  {faqT(`${key}.question`)}
                  <ChevronDown size={20} />
                </summary>
                <p>{faqT(`${key}.answer`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
