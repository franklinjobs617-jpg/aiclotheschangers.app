"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { localizedPath, type Locale, type PageSlug } from "@/lib/site";

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

export function TopicPage({ locale, slug }: { locale: Locale; slug: Exclude<PageSlug, ""> }) {
  const isPricing = slug === "pricing";
  const isAbout = slug === "about-us";
  const isSpecialty = slug === "plus-size-virtual-try-on" || slug === "mens-ai-clothes-changer";
  const commonT = useTranslations("common");
  const pricingPageT = useTranslations("pricingPage");

  if (isPricing) return <PricingPage locale={locale} />;
  if (isAbout) return <AboutPageContent locale={locale} />;

  return (
    <div className="topic-shell">
      <section className="topic-hero">
        <div className="container topic-hero-grid">
          <div className="topic-hero-copy">
            <TopicHero slug={slug as Exclude<PageSlug, "" | "pricing">} />
            <div className="topic-hero-actions">
              <Link className="primary-button" href={`${localizedPath(locale)}#tool`}>
                {commonT("startTryOn")}
              </Link>
              <span>{commonT("previewFirst")}</span>
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

  return (
    <article className="about-page">
      <section className="about-editorial-hero">
        <div className="container narrow">
          <span>{t("sloganLabel")}</span>
          <h1>{t("slogan")}</h1>
        </div>
      </section>

      <section className="section about-editorial-body">
        <div className="container about-article-grid">
          <aside className="about-sidebar" aria-label="About page sections">
            {sectionKeys.map((key) => (
              <a href={`#${key}`} key={key}>
                {t(`sidebar.${key}`)}
              </a>
            ))}
          </aside>

          <div className="about-article">
            <section id="redefining" className="about-copy-block lead">
              <span>{t("aboutLabel")}</span>
              <h2>{t("sections.redefining.title")}</h2>
              <p>{t("sections.redefining.body")}</p>
            </section>

            <section id="mission" className="about-copy-block">
              <span>{t("sections.mission.label")}</span>
              <h2>{t("sections.mission.title")}</h2>
              <p>{t("sections.mission.body1")}</p>
              <p>{t("sections.mission.body2")}</p>
            </section>

            <section id="technology" className="about-copy-block">
              <span>{t("sections.technology.label")}</span>
              <h2>{t("sections.technology.title")}</h2>
              <div className="about-tech-list">
                {technologyKeys.map((key, index) => (
                  <article key={key}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{t(`technology.${key}.title`)}</h3>
                      <p>{t(`technology.${key}.text`)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="privacy" className="about-copy-block privacy">
              <span>{t("sections.privacy.label")}</span>
              <h2>{t("sections.privacy.title")}</h2>
              <p>{t("sections.privacy.body")}</p>
            </section>

            <section id="join" className="about-join-card">
              <div>
                <span>{t("sections.join.label")}</span>
                <h2>{t("sections.join.title")}</h2>
                <p>{t("sections.join.body")}</p>
              </div>
              <Link className="primary-button" href={`${localizedPath(locale)}#tool`}>
                {t("sections.join.cta")}
              </Link>
            </section>
          </div>
        </div>
      </section>
    </article>
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

function PricingPage({ locale }: { locale: Locale }) {
  const t = useTranslations("pricing");
  const commonT = useTranslations("common");
  const pricingPageT = useTranslations("pricingPage");
  const planKeys = ["free", "creator", "pro"] as const;
  const trustNoteKeys = ["freeCredits", "refunds", "privacy"] as const;
  const securityKeys = ["stripeFirst", "paymentRecovery", "creditsRefresh", "hdAfterValue", "riskControl"] as const;
  const faqKeys = ["freeCredits", "hdExtra", "failedJobs", "renewal", "cancel"] as const;

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="container pricing-hero-inner">
          <span>{t("eyebrow")}</span>
          <h1>{pricingPageT("heroTitle")}</h1>
          <p>
            {pricingPageT("heroBody")}
            <strong> {pricingPageT("heroHighlight")}</strong>
          </p>
          <div className="billing-toggle" aria-label="Billing cycle">
            <button type="button">{pricingPageT("yearlyLabel")}</button>
            <button type="button" className="active">{pricingPageT("monthlyLabel")}</button>
          </div>
        </div>
      </section>

      <section className="pricing-plans-section">
        <div className="container pricing-plans-grid">
          {planKeys.map((key) => (
            <article className={key === "creator" ? "price-card featured" : "price-card"} key={key}>
              {key === "creator" ? <span className="plan-badge">{pricingPageT("featuredBadge")}</span> : null}
              <h2>{t(`${key}.name`)}</h2>
              <p>{t(`${key}.description`)}</p>
              <div className="price">
                <strong>{t(`${key}.price`)}</strong>
                <span>/{t(`${key}.period`)}</span>
              </div>
              <Link className="price-button" href={key === "free" ? `${localizedPath(locale)}#tool` : "#"}>
                {t(`${key}.cta`)}
              </Link>
              <div className="credits">{t(`${key}.credits`)}</div>
              <ul>
                {[1, 2, 3, 4].map((benefitIndex) => (
                  <li key={benefitIndex}>
                    <CheckCircle2 size={16} />
                    {pricingPageT(`planBenefits.${key}.${benefitIndex}`)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="container topup-panel">
          <div>
            <span>{pricingPageT("topupLabel")}</span>
            <h2>{t("starter.name")}: {t("starter.price")}</h2>
            <p>{t("starter.description")} {pricingPageT("topupFootnote")}</p>
          </div>
          <Link className="primary-button" href="#">
            {t("starter.cta")}
          </Link>
        </div>
      </section>

      <section className="pricing-trust-strip">
        <div className="container pricing-trust-grid">
          {trustNoteKeys.map((key) => {
            const Icon = trustNoteIconMap[key];
            return (
              <article key={key}>
                <Icon size={18} />
                <div>
                  <h2>{pricingPageT(`trustNotes.${key}.title`)}</h2>
                  <p>{pricingPageT(`trustNotes.${key}.text`)}</p>
                </div>
              </article>
            );
          })}
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
            {securityKeys.map((key) => {
              const Icon = pricingSecurityIconMap[key];
              return (
                <article className="reason-card" key={key}>
                  <Icon size={28} />
                  <h3>{pricingPageT(`security.${key}.title`)}</h3>
                  <p>{pricingPageT(`security.${key}.text`)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section faq-section pricing-faq-section">
        <div className="container narrow">
          <div className="section-head">
            <span>{commonT("faq")}</span>
            <h2>{commonT("pricingFaqs")}</h2>
          </div>
          <div className="faq-list">
            {faqKeys.map((key) => (
              <details key={key}>
                <summary>{pricingPageT(`faqs.${key}.question`)}</summary>
                <p>{pricingPageT(`faqs.${key}.answer`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
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

function TopicHeroPanel({ locale, slug }: { locale: Locale; slug: keyof typeof specialtyPageData }) {
  const t = useTranslations(`specialtyPages.${slug}`);
  const data = specialtyPageData[slug];
  return (
    <div className="topic-visual-panel">
      <Image src={data.image} alt="" width={820} height={560} />
      <div className="topic-floating-card">
        <span>{t("eyebrow")}</span>
        <strong>{t("stat")}</strong>
      </div>
      <div className="topic-mini-stack">
        <Image src={data.accentImage} alt="" width={84} height={84} />
        <Link href={`${localizedPath(locale)}#tool`}>{t("cta")}</Link>
      </div>
    </div>
  );
}

function SpecialtyContent({ locale, slug }: { locale: Locale; slug: keyof typeof specialtyPageData }) {
  const t = useTranslations(`topicPages.${slug}`);
  const specialtyT = useTranslations(`specialtyPages.${slug}`);
  const data = specialtyPageData[slug];
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")];
  const proofKeys = ["1", "2", "3"] as const;
  const relatedKeys = ["1", "2"] as const;

  return (
    <>
      <section className="section topic-feature-section">
        <div className="container topic-feature-grid">
          <div className="topic-copy">
            <span className="topic-kicker">{specialtyT("eyebrow")}</span>
            <h2>{specialtyT("featureTitle")}</h2>
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
            <p>{specialtyT("featureText")}</p>
          </div>
          <div className="topic-list topic-list-cards">
            {bullets.map((item) => (
              <div key={item}>
                <CheckCircle2 size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft topic-proof-section">
        <div className="container topic-proof-grid">
          <div className="topic-proof-media">
            <Image src={data.image} alt="" width={820} height={560} />
          </div>
          <div className="topic-copy">
            <span className="topic-kicker">{specialtyT("proofLabel")}</span>
            <h2>{specialtyT("proofTitle")}</h2>
            <div className="topic-proof-list">
              {proofKeys.map((key) => (
                <p key={key}>
                  <span />
                  {specialtyT(`proofItems.${key}`)}
                </p>
              ))}
            </div>
            <div className="topic-related-row">
              {relatedKeys.map((key, index) => (
                <Link href={localizedPath(locale, data.related[index][1])} key={key}>
                  {specialtyT(`related.${key}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const specialtyPageData = {
  "plus-size-virtual-try-on": {
    image: storySectionImages[2],
    accentImage: heroImages[2].src,
    related: [
      ["Men's AI Clothes Changer", "mens-ai-clothes-changer" as const],
      ["Virtual Try On Clothes", "virtual-try-on-clothes" as const]
    ]
  },
  "mens-ai-clothes-changer": {
    image: storySectionImages[0],
    accentImage: exampleCardImages[1],
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
