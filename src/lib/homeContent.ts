import { BadgeCheck, Camera, Repeat2, RotateCcw, ShieldCheck, Upload, Users } from "lucide-react";
import type { PageSlug } from "@/lib/site";

export const trustItemKeys = ["tryFirst", "mobile", "encrypted", "inclusive"] as const;
export const trustItemIcons = [BadgeCheck, RotateCcw, ShieldCheck, Users];

export const howStepKeys = ["upload", "choose", "generate"] as const;
export const howStepIcons = [Upload, Camera, Repeat2];

export const exampleCardKeys = ["shopping", "headshots", "creators"] as const;

export const storySectionKeys = ["headshot", "tryBefore", "inclusive"] as const;

export const whyItemKeys = ["realism", "noPaywall", "mobile", "progress"] as const;

export const useCaseKeys = ["plusSize", "men", "virtual"] as const;
export const useCaseSlugs: PageSlug[] = ["plus-size-virtual-try-on", "mens-ai-clothes-changer", "virtual-try-on-clothes"];

export const faqKeys = ["free", "reference", "photos", "face", "privacy"] as const;

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
