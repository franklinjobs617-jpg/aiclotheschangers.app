# AI Clothes Changer Homepage Design

Source page: https://www.insmind.com/image-tools/ai-clothes-changer

## 1. Product Positioning

Build a conversion-focused AI clothes changer landing page inspired by insMind's tool page. The first screen should immediately communicate:

- Free online AI clothes changer
- Upload a photo and replace clothing with a prompt
- Fast, realistic fashion transformation
- Clear primary action: upload/start editing

The page should feel like a practical AI tool, not a generic marketing homepage. The tool interaction area is the core of the first screen.

## 2. Page Structure

1. Header
   - Logo on the left
   - Mega-nav style groups: AI Image, AI Video, Photo Editor, Resources
   - Pricing link
   - Login/Sign up button
   - Primary Create button

2. Hero / Tool Entry
   - Left copy: headline, supporting text, CTA
   - Right visual: collage of outfit transformation photos
   - Upload module below/alongside hero copy
   - Breadcrumb: Image / AI Clothes Changer

3. How It Works
   - Four steps copied in structure from the source page:
     - Upload Your Original Photo
     - Select the Original Clothes Area
     - Write Prompt
     - Generate and Download

4. Feature Story Blocks
   - Realistic and fast transformation
   - Style reimagination
   - Professional headshot clothing change
   - Costumes and creative looks

5. Use Cases
   - E-commerce
   - Fashion
   - Entertainment

6. Why Choose
   - Realistic
   - Quick Generation
   - AI-Powered

7. More AI Photo Editing Features
   - Horizontal grid of related tools

8. FAQ
   - What is an AI clothes changer?
   - Can you replace the person in the photo but keep the clothes?
   - How does AI clothing changer work?
   - Can it change clothes realistically?
   - Is it free?

9. Footer
   - Creative Tools
   - Resources
   - Support
   - Get App

## 3. Visual Direction

The source page uses a clean SaaS/tool design language:

- White background with soft lavender and pale blue hero tint
- Rounded cards, subtle shadows, large image tiles
- Bright blue/purple primary CTA
- Simple black text hierarchy
- Dense but readable SEO sections below the fold

Recommended palette:

- Primary blue: `#2358ff`
- Purple accent: `#7c3aed`
- Ink: `#12131a`
- Muted text: `#667085`
- Surface: `#ffffff`
- Soft section background: `#f6f7fb`
- Hero tint: `#eef2ff`
- Border: `#e6e8f0`

Typography:

- Use Inter or Geist Sans.
- Hero H1: 56-68px desktop, 40-46px tablet, 34-38px mobile.
- Section H2: 36-44px desktop, 28-34px mobile.
- Body: 16-18px.

## 4. Hero Behavior

The hero should be the usable homepage, not a decorative landing page.

Key elements:

- Headline: "Free Online AI Clothes Changer"
- Copy: "Try new styles instantly. Upload a photo, mark the clothing area, describe your outfit, and generate a realistic new look online."
- Primary CTA: "Upload a photo"
- Secondary CTA: "See how it works"
- Tool card with upload area, prompt box, clothing area chips, and start button
- Trust notes: "Free to start", "Realistic texture", "Fast generation"

## 5. Image Strategy

The source page relies heavily on fashion transformation images. For the initial clone, use remote source-page assets through `next/image` with remote patterns enabled:

- Hero collage:
  - `https://images.insmind.com/market-operations/market/side/aee6edb4c465434a9116acb3976ee78e/1730889129372.jpg`
  - `https://images.insmind.com/market-operations/market/side/f2f8a4a8cf184daf8d01b04c117d82fe/1730889159329.jpg`
  - `https://images.insmind.com/market-operations/market/side/3b42fc5d7ade49b3b7df539ba3c0b7c4/1730889163517.jpg`

- How-to and feature images:
  - `https://static.xsbapp.com/market-operations/market/side/1710752829039.png`
  - `https://images.insmind.com/market-operations/market/side/a92d6c3ebe084f3589befd1f9c5c7ee9/1740740221370.jpg`
  - `https://images.insmind.com/market-operations/market/side/d8ea4d857068454f9b0f8b9f3714a8c4/1740740237908.jpg`
  - `https://images.insmind.com/market-operations/market/side/17a65dd319454bdab9ce8eeaf2ecdcf9/1740740250558.jpg`

For production, replace these with owned or licensed assets.

## 6. Interaction Notes

Initial frontend-only behavior:

- Upload button opens a styled placeholder state.
- Prompt input accepts text.
- Clothing area chips are selectable visually.
- Start button changes the result card into a generated preview state.
- FAQ uses native `details/summary`.
- Mobile header opens a drawer.

Backend-ready future states:

- Idle
- Uploading
- Uploaded
- Masking clothing area
- Generating
- Result ready
- Error with retry
- Payment/credit gate for HD download

## 7. Responsive Rules

Desktop:

- Header max width around 1200-1280px.
- Hero uses two columns: copy/tool on the left, image collage on the right.
- Cards use 3 or 4 column grids depending on section density.

Tablet:

- Hero stacks into a single column.
- Keep upload card near the top.

Mobile:

- Header collapses to menu button.
- Hero CTA buttons stack only if needed.
- Image collage becomes a 2x2 grid.
- Cards become single column.

## 8. Implementation Scope For First Build

Create a Next.js + Tailwind project with:

- `src/app/page.tsx` as the homepage
- `src/app/layout.tsx` metadata and font setup
- `src/app/globals.css` Tailwind import and custom component classes
- `src/lib/content.ts` structured page content
- `src/components/SiteHeader.tsx`
- `src/components/HeroTool.tsx`
- `src/components/ContentSections.tsx`
- `src/components/SiteFooter.tsx`

This first build focuses on page fidelity, SEO structure, responsive design, and obvious future integration points.
