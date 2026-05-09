import {
  BadgeCheck,
  Camera,
  CreditCard,
  Download,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Zap
} from "lucide-react";
import type { PageSlug } from "@/lib/site";

export const heroImages = [
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
];

export const trustItemKeys = ["tryFirst", "mobile", "encrypted", "inclusive"] as const;
export const trustItemIcons = [BadgeCheck, RotateCcw, ShieldCheck, Users];

export const howStepKeys = ["upload", "choose", "generate"] as const;
export const howStepIcons = [Upload, Camera, Sparkles];

export const exampleCardKeys = ["shopping", "headshots", "creators"] as const;
export const exampleCardImages = [
  "https://images.insmind.com/market-operations/market/side/21551ac66006432b9759facb4fdf771d/1730889665936.jpg",
  "https://images.insmind.com/market-operations/market/side/ce79b59be1d84e9788fcc4491ae13da4/1730889563222.jpg",
  "https://images.insmind.com/market-operations/market/side/d8ddda7f875c43fa9f20bf0c8b6548d2/1730889600007.jpg"
];

export const storySectionKeys = ["headshot", "tryBefore", "inclusive"] as const;
export const storySectionImages = [
  "https://images.insmind.com/market-operations/market/side/ce79b59be1d84e9788fcc4491ae13da4/1730889563222.jpg",
  "https://images.insmind.com/market-operations/market/side/21551ac66006432b9759facb4fdf771d/1730889665936.jpg",
  "https://images.insmind.com/market-operations/market/side/d8ddda7f875c43fa9f20bf0c8b6548d2/1730889600007.jpg"
];

export const whyItemKeys = ["realism", "noPaywall", "mobile", "progress"] as const;

export const useCaseKeys = ["plusSize", "men", "virtual"] as const;
export const useCaseSlugs: PageSlug[] = ["plus-size-virtual-try-on", "mens-ai-clothes-changer", "virtual-try-on-clothes"];

export const faqKeys = ["free", "reference", "photos", "face", "privacy"] as const;

export const pricingPlanKeys = ["free", "starter", "creator", "pro"] as const;
export const pricingPlanFeatured = [false, false, true, false];

export const pricingPlanBenefits: Record<string, string[]> = {
  free: ["10 free credits after sign up", "Mobile upload auto-fix", "10+ models including plus size and men", "Standard download"],
  starter: ["No subscription required", "Failed system generations refunded", "Continue the original task after payment", "Stripe checkout"],
  creator: ["100 credits per month", "HD unlock available", "Regenerate and try another model", "Cancel anytime"],
  pro: ["300 credits per month", "HD downloads included", "Generation history after login", "Priority generation queue"]
};

export const pricingFaqKeys = [
  { q: "How many credits do I get for free?", a: "New users get 10 free credits after sign up to test real virtual try-on quality before buying more." },
  { q: "Is HD download extra?", a: "HD downloads are included in the Pro Monthly plan. Other plans use credits for HD unlock." },
  { q: "Do failed generations consume credits?", a: "System failures are refunded automatically. You will not lose credits when the product cannot deliver a usable result." },
  { q: "Will the monthly plan renew automatically?", a: "Yes, Basic and Pro Monthly renew automatically. You can cancel anytime from your account." },
  { q: "Can I cancel anytime?", a: "Yes. Cancellation is easy to find and takes effect at the end of the current billing period." }
];

export const pricingSecurity = [
  { icon: CreditCard, titleKey: "Stripe first", textKey: "MVP checkout starts with Stripe for a cleaner overseas payment flow." },
  { icon: RefreshCw, titleKey: "Payment recovery", textKey: "Purchase context should restore the original try-on, download, or buy credits action." },
  { icon: Zap, titleKey: "Credits refresh", textKey: "Successful payment refreshes the user credits ledger and continues the task." },
  { icon: Download, titleKey: "HD after value", textKey: "HD download appears after users have already seen a useful result." },
  { icon: LockKeyhole, titleKey: "Risk control", textKey: "Image review and prompt filters should block NSFW and misuse before model calls." }
];

// JSON-LD schema data (English only, for structured data)
export const howSteps = [
  { title: "Upload a person photo", text: "Use a clear selfie, portrait, or full-body image. Front-facing photos with visible clothing outlines work best." },
  { title: "Choose the outfit source", text: "Upload a clothing reference, pick a preset style, or describe the outfit you want to try on." },
  { title: "Generate and compare", text: "Preview the result, compare before and after, regenerate if needed, then download or unlock HD." }
];

export const faqs: [string, string][] = [
  ["Is the AI clothes changer free?", "Yes. New users get 10 free credits so they can test real virtual try-on quality before buying more credits or a paid plan."],
  ["Can I upload a clothing photo as a reference?", "Yes. The intended workflow supports either uploading a clothing reference or using preset styles, so users can try a specific garment or explore a style idea."],
  ["What photos work best?", "Clear person photos work best, especially front-facing portraits or full-body images with visible clothing edges. Avoid heavy blur, extreme poses, or blocked outfits."],
  ["Will it keep my face and body shape?", "The product goal is to preserve identity, pose, lighting, and body proportions while changing the outfit area. Results can still vary by photo quality."],
  ["Do you save uploaded photos?", "Your photos are encrypted during processing and automatically deleted from our servers after the try-on is complete."]
];
