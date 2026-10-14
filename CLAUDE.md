# Toylad Concept: Website

Luxury showcase, menu and booking site for Toylad Concept: custom cakes, artisanal pastries, event decoration and full event management.

## Stack
- React + Vite (JavaScript/JSX), Tailwind CSS v4 via `@tailwindcss/vite`, Lucide React icons
- Booking forms compose a pre-filled WhatsApp message (`https://wa.me/<number>?text=`)
- Admin photo uploads: Vercel serverless functions in `/api` (Node runtime), MongoDB Atlas, Cloudinary
- Commands: `npm run dev` · `npm run build` · `npm run lint` · `npm run hash-password`. `npm run dev` serves the site and `/api` on port 3000 (`scripts/dev-api.js`)

## Structure
```text
src/
  components/layout/    Navbar, Footer, FloatingWhatsApp
  components/sections/  Hero, Services, Gallery, Packages, Testimonials, Booking
  components/ui/        Container, Button, SectionHeading, SmartImage
  data/                 site.js (contact, WhatsApp, locations, hours, socials, academy), services.js,
                        gallery.js, packages.js, testimonials.js, stats.js
  admin/                lazy-loaded /admin area: AdminApp (dashboard sections), login, photo screens, api.js
  hooks/  utils/        useUploadedPhotos (gallery fetch), cloudinary.js (image URLs), booking.js, format.js
  App.jsx  Root.jsx (picks site or admin)  main.jsx  index.css
api/
  _lib/                 http.js (route wrapper, HttpError), auth.js (session), db.js, cloudinary.js, photos.js
  auth/                 login, logout, me
  photos.js             public list of published photos
  admin/                upload-signature, health (connection check), photos/index (list, create), photos/[id] (edit, delete)
public/images/          local stock images    scripts/hash-password.js    vercel.json (/admin rewrite, noindex)
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
- Stock images: local files only, from free-license sources (Unsplash, Pexels, Pixabay) with credits logged in IMAGE-CREDITS.md; never hotlink or use Google Images/Pinterest. Max 1600px wide, under ~300KB.
- Image loading: `loading="lazy"` except the hero; fixed aspect ratios to prevent layout shift.
- Testimonials use initials avatars, never stock photos of faces.
- Keep components under ~150 lines; split if larger. No new dependencies without asking.
- Placeholder contact details, prices and stats are marked `// TODO` in `src/data/`.

## Backend and security rules
- Env vars, server only (never `VITE_`-prefixed, never committed, documented in README.md): `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_PASSWORD_HASH` (bcrypt), `SESSION_SECRET` (32+ chars).
- Wrap every handler in `route()` from `api/_lib/http.js`; every `/api/admin/*` route passes `{ auth: true }`. Validate all input on the server and throw `HttpError(status, message)`; responses are JSON, errors are `{ error }`.
- Uploads go from the browser straight to Cloudinary with a signed request (folder `toylad/gallery`). Read image URL and size from Cloudinary, never from the browser. Show uploads through `cloudinaryUrl()` (`f_auto,q_auto`).
- Session is an httpOnly, Secure, SameSite=Lax JWT cookie (7 days). Nothing secret in localStorage or the bundle.
- The public gallery must still work when the API fails: stock photos are the fallback (`showStockPhotos` in `gallery.js`).
- Admin screens: plain wording for a non-technical owner, tap targets at least 48px, new dashboard areas go in `sections` in `AdminApp.jsx`.
