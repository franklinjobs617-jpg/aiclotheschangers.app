"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { pricingFaqKeys, pricingPlanBenefits, pricingPlanFeatured, pricingPlanKeys, pricingSecurity } from "@/lib/content";
import { localizedPath, type Locale, type PageSlug } from "@/lib/site";

export function TopicPage({ locale, slug }: { locale: Locale; slug: Exclude<PageSlug, ""> }) {
  const isPricing = slug === "pricing";
  const commonT = useTranslations("common");

  return (
    <div className="topic-shell">
      <section className="topic-hero">
        <div className="container narrow">
          {isPricing ? (
            <PricingHero />
          ) : (
            <TopicHero slug={slug as Exclude<PageSlug, "" | "pricing">} />
          )}
          <Link className="primary-button" href={`${localizedPath(locale)}#tool`}>
            {commonT("startTryOn")}
          </Link>
        </div>
      </section>

      {isPricing ? <PricingContent /> : <StandardContent slug={slug as Exclude<PageSlug, "" | "pricing">} />}
    </div>
  );
}

function TopicHero({ slug }: { slug: Exclude<PageSlug, "" | "pricing"> }) {
  const t = useTranslations(`topicPages.${slug}`);
  return (
    <>
      <span>{t("eyebrow")}</span>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </>
  );
}

function PricingHero() {
  const t = useTranslations("pricing");
  return (
    <>
      <span>{t("eyebrow")}</span>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </>
  );
}

function StandardContent({ slug }: { slug: Exclude<PageSlug, "" | "pricing"> }) {
  const t = useTranslations(`topicPages.${slug}`);
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")];
  const bodyTexts = slug === "about-us" || slug === "privacy-policy" || slug === "terms-of-service"
    ? [t("body1"), t("body2"), t("body3")]
    : [t("body1"), t("body2")];

  return (
    <section className="section">
      <div className="container topic-grid">
        <div className="topic-copy">
          {bodyTexts.filter(Boolean).map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <div className="topic-list">
          {bullets.map((item) => (
            <div key={item}>
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingContent() {
  const t = useTranslations("pricing");
  const commonT = useTranslations("common");

  return (
    <>
      <section className="section">
        <div className="container pricing-grid">
          {pricingPlanKeys.map((key, i) => (
            <article className={pricingPlanFeatured[i] ? "price-card featured" : "price-card"} key={key}>
              <h2>{t(`${key}.name`)}</h2>
              <p>{t(`${key}.description`)}</p>
              <div className="price">
                <strong>{t(`${key}.price`)}</strong>
                <span>/{t(`${key}.period`)}</span>
              </div>
              <button type="button">{t(`${key}.cta`)}</button>
              <div className="credits">{t(`${key}.credits`)}</div>
              <ul>
                {pricingPlanBenefits[key].map((benefit) => (
                  <li key={benefit}>
                    <CheckCircle2 size={16} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <span>{commonT("paymentUx")}</span>
            <h2>{commonT("clearCredits")}</h2>
            <p>{commonT("clearCreditsText")}</p>
          </div>
          <div className="reason-grid">
            {pricingSecurity.map((item) => {
              const Icon = item.icon;
              return (
                <article className="reason-card" key={item.titleKey}>
                  <Icon size={28} />
                  <h3>{item.titleKey}</h3>
                  <p>{item.textKey}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container narrow">
          <div className="section-head">
            <span>{commonT("faq")}</span>
            <h2>{commonT("pricingFaqs")}</h2>
          </div>
          <div className="faq-list">
            {pricingFaqKeys.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
