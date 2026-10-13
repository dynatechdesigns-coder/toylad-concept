# Toylad Concept: Website

Luxury showcase, menu and booking site for Toylad Concept: custom cakes, artisanal pastries, event decoration and full event management.

## Stack
- React + Vite (JavaScript/JSX), Tailwind CSS v4 via `@tailwindcss/vite`, Lucide React icons
- No backend: forms compose a pre-filled WhatsApp message (`https://wa.me/<number>?text=`)
- Commands: `npm run dev` · `npm run build` · `npm run lint`

## Structure
```text
src/
  components/layout/    Navbar, Footer, FloatingWhatsApp
  components/sections/  Hero, Services, Gallery, Packages, Testimonials, Booking
  components/ui/        Container, Button, SectionHeading, SmartImage
  data/                 site.js (contact, WhatsApp, locations, hours, socials, academy), services.js,
                        gallery.js, packages.js, testimonials.js, stats.js
  App.jsx  main.jsx  index.css
public/images/          local images (placeholders until real photos arrive)
```

## Design tokens (defined once in `src/index.css` under `@theme`)
| Token           | Value   | Use                                                  |
|-----------------|---------|------------------------------------------------------|
| cream           | #FFFDF9 | page background                                      |
| butter-soft     | #FFF6DE | alternate section background                         |
| espresso        | #231915 | body text                                            |
| terracotta      | #D56231 | brand primary: icons, borders, large headline accents|
| terracotta-deep | #B9532A | primary button fill (white text), small accent text  |
| butter          | #FDD878 | highlights, badges, stars, "sunny" CTA (espresso text)|
| teal            | #3C7D90 | secondary: links, icons, secondary buttons (white text)|
| navy            | #1F2A3C | dark contrast sections, text on butter-soft          |

- Fonts: `font-display` = Playfair Display (headings, 500–700); `font-sans` = Plus Jakarta Sans (body, 400–700). Google Fonts, linked in `index.html`.
- Type scale: h1 `text-4xl md:text-6xl`; h2 `text-3xl md:text-5xl`; h3 `text-xl md:text-2xl`; body `text-base md:text-lg leading-relaxed`.
- Spacing: sections `py-20 md:py-28`; container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`; grid gaps `gap-6 md:gap-8`.
- Shape: cards `rounded-3xl`, buttons and pills `rounded-full`, images `rounded-2xl`. Shadow `shadow-sm`, `hover:shadow-xl`.
- Motion: `transition duration-300 ease-out`; cards `hover:-translate-y-1`; images `group-hover:scale-105`. Always add `motion-reduce:` fallbacks.

## Coding rules
- Mobile-first: base classes target phones, then `sm: md: lg:`. Check at 360px; no horizontal scroll.
- Use token classes only (`bg-cream`, `text-espresso`, `bg-terracotta-deep`), plus `text-white` where the token table calls for white text. No raw hex in JSX. Exception: WhatsApp buttons may use #25D366.
- Contrast: small text never in `terracotta` or `butter`; use `terracotta-deep`. Never white text on `butter`. On `butter-soft`, use `navy` instead of `teal` for small text.
- Content lives in `src/data/*`. Components map over data; no hard-coded content lists in JSX.
- Functional components, one per file, PascalCase filenames, default exports.
- Each section has an `id` matching its nav anchor and `scroll-mt-24`; `html` has `scroll-smooth`.
- Accessibility: semantic landmarks, alt text on every image, labelled form fields, `aria-label` on icon-only buttons, Esc closes menus and modals.
- Focus rings: `focus-visible:ring-2 ring-teal`.
- Images: local files only, from free-license sources (Unsplash, Pexels, Pixabay) with credits logged in IMAGE-CREDITS.md; never hotlink or use Google Images/Pinterest. Max 1600px wide, under ~300KB.
- Image loading: `loading="lazy"` except the hero; fixed aspect ratios to prevent layout shift.
- Testimonials use initials avatars, never stock photos of faces.
- Keep components under ~150 lines; split if larger. No new dependencies without asking.
- Placeholder contact details, prices and stats are marked `// TODO` in `src/data/`.
