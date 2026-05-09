"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  exampleCardImages,
  heroImages,
  pricingFaqKeys,
  pricingPlanBenefits,
  pricingSecurity,
  storySectionImages
} from "@/lib/content";
import { localizedPath, type Locale, type PageSlug } from "@/lib/site";

const specialtyPageData = {
  "plus-size-virtual-try-on": {
    image: storySectionImages[2],
    accentImage: heroImages[2].src,
    eyebrow: "Plus Size First",
    stats: ["Curvy model path", "Realistic drape", "Free preview"],
    featureTitle: "AI styling for every body shape",
    featureText:
      "This page turns the project strategy into a focused path for users who cannot judge fit from narrow model libraries. It keeps the free preview, privacy, and realistic fabric details visible before conversion.",
    proofTitle: "What makes the plus size path different",
    proofItems: ["Curve-aware outfit previews", "Front-facing full-body guidance", "No forced checkout before judging quality"],
    related: [
      ["Men's AI Clothes Changer", "mens-ai-clothes-changer" as const],
      ["Virtual Try On Clothes", "virtual-try-on-clothes" as const]
    ]
  },
  "mens-ai-clothes-changer": {
    image: storySectionImages[0],
    accentImage: exampleCardImages[1],
    eyebrow: "Men's Fashion",
    stats: ["Suits", "Streetwear", "Profile photos"],
    featureTitle: "A try-on path for men's shirts, suits, and everyday looks",
    featureText:
      "Men's intent is often practical: profile photos, workwear, shopping decisions, jackets, and clean outfit swaps. This page gives those searches a direct path into the same simple AI clothes changer flow.",
    proofTitle: "Built for overlooked men's try-on needs",
    proofItems: ["Professional headshot outfit swaps", "Casual and streetwear previews", "Upload photo or clothing reference"],
    related: [
      ["Plus Size Virtual Try-On", "plus-size-virtual-try-on" as const],
      ["Virtual Try On Clothes", "virtual-try-on-clothes" as const]
    ]
  }
} as const;

const trustNotes = [
  { icon: BadgeCheck, title: "10 free credits", text: "New users can test quality before choosing a paid plan." },
  { icon: RotateCcw, title: "Failed jobs refunded", text: "System failures should return credits instead of burning trust." },
  { icon: ShieldCheck, title: "Privacy-first uploads", text: "Uploaded photos are encrypted during processing and deleted after try-on." }
];

export function TopicPage({ locale, slug }: { locale: Locale; slug: Exclude<PageSlug, ""> }) {
  const isPricing = slug === "pricing";
  const isAbout = slug === "about-us";
  const isSpecialty = slug === "plus-size-virtual-try-on" || slug === "mens-ai-clothes-changer";
  const commonT = useTranslations("common");

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
              <span>Preview first, upgrade later</span>
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
  const technology = [
    [
      "True-to-Life Realism",
      "Utilizing the state-of-the-art IDM-VTON model, we render realistic fabric textures, creases, and natural lighting that generic AI models often miss."
    ],
    [
      "Inclusivity by Design",
      "We noticed the industry lacked diversity. Our model library is the first to prioritize Plus-size and Men's fashion, ensuring every user finds a model that represents them."
    ],
    [
      "Technical Stability",
      "We've engineered our Web App to eliminate common industry bugs, such as the Android image rotation error and 30% loading freeze, providing a stable 15-second generation cycle."
    ]
  ];

  return (
    <article className="about-page">
      <section className="about-editorial-hero">
        <div className="container narrow">
          <span>Brand Slogan</span>
          <h1>Realistic AI Clothes Changer: Experience True Virtual Try-On Without the Paywall.</h1>
        </div>
      </section>

      <section className="section about-editorial-body">
        <div className="container about-article-grid">
          <aside className="about-sidebar" aria-label="About page sections">
            <a href="#redefining">Redefining</a>
            <a href="#mission">Mission</a>
            <a href="#technology">Technology</a>
            <a href="#privacy">Privacy</a>
            <a href="#join">Join us</a>
          </aside>

          <div className="about-article">
            <section id="redefining" className="about-copy-block lead">
              <span>About Us: aiclotheschanger.me</span>
              <h2>Redefining the Virtual Fitting Room</h2>
              <p>
                At aiclotheschanger.me, we believe that fashion technology should be accessible, transparent, and,
                above all, realistic. We observed a market filled with applications that demand payment before showing a
                single result. We decided to build a better way.
              </p>
            </section>

            <section id="mission" className="about-copy-block">
              <span>Our Mission</span>
              <h2>Quality First, Trust Always</h2>
              <p>
                We specialize in high-fidelity AI Clothes Changer technology. Our platform is not just about swapping
                pixels; it is about understanding how a silk dress drapes or how a denim jacket fits different body
                types.
              </p>
              <p>
                We are committed to solving the trust gap in the industry by offering a Try First, Pay Later model,
                giving every user 10 free credits to witness our quality before committing to a plan.
              </p>
            </section>

            <section id="technology" className="about-copy-block">
              <span>The Technology Behind the Result</span>
              <h2>Keeping the complexity for us, and the simplicity for you</h2>
              <div className="about-tech-list">
                {technology.map(([title, text], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="privacy" className="about-copy-block privacy">
              <span>Your Privacy is Non-Negotiable</span>
              <h2>Encrypted during processing, deleted after try-on</h2>
              <p>
                We strictly follow global data protection standards. Every image you upload is encrypted during
                processing and automatically deleted from our servers the moment your try-on is complete.
              </p>
            </section>

            <section id="join" className="about-join-card">
              <div>
                <span>Join the Fashion Revolution</span>
                <h2>Your personal, digital wardrobe</h2>
                <p>
                  Whether you are a shopper trying to avoid wrong-size returns or a fashion enthusiast exploring new
                  styles, aiclotheschanger.me is your personal, digital wardrobe.
                </p>
              </div>
              <Link className="primary-button" href={`${localizedPath(locale)}#tool`}>
                Start Try-On
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
  const planKeys = ["free", "creator", "pro"] as const;
  const feedback = [
    ["No paywall surprise", "I could test the first result before thinking about credits."],
    ["Clear credit math", "The plan tells me exactly how many try-ons I can run."],
    ["Refund logic matters", "Failed generations should not consume credits silently."]
  ];

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="container pricing-hero-inner">
          <span>{t("eyebrow")}</span>
          <h1>Plans & Pricing</h1>
          <p>
            Start with 10 free credits, then choose a small credit top-up or a monthly plan when you are ready.
            <strong> No hard paywall before the first useful preview.</strong>
          </p>
          <div className="billing-toggle" aria-label="Billing cycle">
            <button type="button">Yearly - Save 20%</button>
            <button type="button" className="active">Monthly</button>
          </div>
        </div>
      </section>

      <section className="pricing-plans-section">
        <div className="container pricing-plans-grid">
          {planKeys.map((key) => (
            <article className={key === "creator" ? "price-card featured" : "price-card"} key={key}>
              {key === "creator" ? <span className="plan-badge">Most practical</span> : null}
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

        <div className="container topup-panel">
          <div>
            <span>Or top up credits</span>
            <h2>{t("starter.name")}: {t("starter.price")}</h2>
            <p>{t("starter.description")} 1 AI try-on costs 1 credit.</p>
          </div>
          <Link className="primary-button" href="#">
            {t("starter.cta")}
          </Link>
        </div>
      </section>

      <section className="pricing-trust-strip">
        <div className="container pricing-trust-grid">
          {trustNotes.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon size={18} />
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
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

      <section className="section faq-section pricing-faq-section">
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
  const data = specialtyPageData[slug];
  return (
    <div className="topic-visual-panel">
      <Image src={data.image} alt="" width={820} height={560} />
      <div className="topic-floating-card">
        <span>{data.eyebrow}</span>
        <strong>{data.stats[0]}</strong>
      </div>
      <div className="topic-mini-stack">
        <Image src={data.accentImage} alt="" width={84} height={84} />
        <Link href={`${localizedPath(locale)}#tool`}>Try free</Link>
      </div>
    </div>
  );
}

function SpecialtyContent({ locale, slug }: { locale: Locale; slug: keyof typeof specialtyPageData }) {
  const t = useTranslations(`topicPages.${slug}`);
  const data = specialtyPageData[slug];
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3"), t("bullet4")];

  return (
    <>
      <section className="section topic-feature-section">
        <div className="container topic-feature-grid">
          <div className="topic-copy">
            <span className="topic-kicker">{data.eyebrow}</span>
            <h2>{data.featureTitle}</h2>
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
            <p>{data.featureText}</p>
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
            <span className="topic-kicker">Trust path</span>
            <h2>{data.proofTitle}</h2>
            <div className="topic-proof-list">
              {data.proofItems.map((item) => (
                <p key={item}>
                  <span />
                  {item}
                </p>
              ))}
            </div>
            <div className="topic-related-row">
              {data.related.map(([label, path]) => (
                <Link href={localizedPath(locale, path)} key={path}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
