"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  exampleCardImages,
  exampleCardKeys,
  faqKeys,
  howStepIcons,
  howStepKeys,
  storySectionImages,
  storySectionKeys,
  trustItemIcons,
  trustItemKeys,
  useCaseKeys,
  useCaseSlugs,
  whyItemKeys
} from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/site";

export function ContentSections({ locale }: { locale: Locale }) {
  const t = useTranslations("sections");
  const trustT = useTranslations("trustItems");
  const howT = useTranslations("howSteps");
  const exampleT = useTranslations("exampleCards");
  const storyT = useTranslations("storySections");
  const whyT = useTranslations("whyItems");
  const useCaseT = useTranslations("useCases");
  const faqT = useTranslations("faqs");
  const commonT = useTranslations("common");

  return (
    <>
      <section className="trust-strip">
        <div className="container trust-grid">
          {trustItemKeys.map((key, i) => {
            const Icon = trustItemIcons[i];
            return (
              <article key={key}>
                <Icon size={22} />
                <div>
                  <h2>{trustT(`${key}.title`)}</h2>
                  <p>{trustT(`${key}.text`)}</p>
                </div>
              </article>
            );
          })}
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
                  <Link className="story-cta" href="#tool">
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
