import { ContentSections } from "@/components/ContentSections";
import { HeroTool } from "@/components/HeroTool";
import { faqs, howSteps } from "@/lib/homeContent";
import { absoluteLocalizedUrl, type Locale } from "@/lib/site";

export function HomePage({ locale }: { locale: Locale }) {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "AI Clothes Changer",
      operatingSystem: "Web",
      applicationCategory: "MultimediaApplication",
      url: absoluteLocalizedUrl(locale),
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      featureList:
        "Virtual Try-On, AI Outfit Changer, Plus Size Models, Men's Fashion Try-On, Upload Clothing Reference, AI Clothes Changer",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "1200"
      },
      potentialAction: {
        "@type": "UseAction",
        target: absoluteLocalizedUrl(locale, "editor")
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to change clothes in photos with AI",
      step: howSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.text
      }))
    },
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "AI Virtual Try-On Results",
      description: "Gallery of AI-generated virtual try-on examples showing realistic fabric textures, draping, and lighting across different body types and outfit styles."
    }
  ];

  return (
    <>
      <HeroTool locale={locale} />
      <ContentSections locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </>
  );
}
