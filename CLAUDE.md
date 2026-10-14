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
  components/ui/        Container, Button, SectionHeading, SmartImage, Modal, StarRating    components/feedback/  the public /feedback page
  data/                 site.js (contact, WhatsApp, locations, hours, socials, academy), services.js,
                        gallery.js, packages.js, stats.js, crm.js (lead statuses), orders.js, celebrations.js (greeting templates), feedback.js, privacy.js
  admin/                lazy-loaded: /admin (AdminApp sections: Photos, Prospects, Orders, Customers, Celebrations, Feedback, Reports; api.js) and owner mode on the public site (OwnerBar, OwnerGalleryTools)
  hooks/  utils/        useUploadedPhotos, useOwnerSession, gallery.js (All/category rules), cloudinary.js, booking.js, format.js
  App.jsx  Root.jsx (picks site or admin)  main.jsx  index.css
api/
  _lib/                 http.js (route wrapper, HttpError), auth.js (session), db.js, cloudinary.js, validate.js, rateLimit.js, photos.js, customers.js, leads.js, orders.js, feedback.js, reports.js, celebrations.js, digest.js
  auth/[action].js      login, logout, me in one function (Vercel Hobby allows 12 functions; there are 11, so merge rather than add files)
  photos.js enquiries.js feedback.js  public: published photos; save an enquiry; leave a review and list approved ones (honeypot, rate limit)
  admin/                photos/ (index + [id]), leads.js, customers.js, orders.js (one item with ?id=), tools/[action].js (upload-signature, health, reports, celebrations, feedback)
  cron/daily-digest.js  morning email via Vercel Cron (06:00 UTC), protected by CRON_SECRET
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
- Testimonials are approved customer reviews from the database (customer's permission AND owner's approval), shown with initials avatars and a shortened name. Never invent reviews.
- Keep components under ~150 lines; split if larger. No new dependencies without asking.
- Placeholder contact details, prices and stats are marked `// TODO` in `src/data/`.

## Backend and security rules
- Env vars, server only (never `VITE_`-prefixed, never committed, documented in README.md): `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_PASSWORD_HASH` (bcrypt), `SESSION_SECRET` (32+ chars). Optional, for the morning email only: `RESEND_API_KEY`, `OWNER_EMAIL`, `CRON_SECRET`.
- Wrap every handler in `route()` from `api/_lib/http.js`; every `/api/admin/*` route passes `{ auth: true }`. Validate all input on the server and throw `HttpError(status, message)`; responses are JSON, errors are `{ error }`.
- Uploads go from the browser straight to Cloudinary with a signed request (folder `toylad/gallery`). Read image URL and size from Cloudinary, never from the browser. Show uploads through `cloudinaryUrl()` (`f_auto,q_auto`).
- Session is an httpOnly, Secure, SameSite=Lax JWT cookie (7 days). Nothing secret in localStorage or the bundle. The public gallery must still work when the API fails: stock photos are the fallback (`showStockPhotos` in `gallery.js`).
- Admin screens: plain wording for a non-technical owner, tap targets at least 48px, new dashboard areas go in `sections` in `AdminApp.jsx`. Customer data (`customers`, `leads`) is personal data (Nigeria Data Protection Act 2023): never pre-tick consent, never block the WhatsApp booking on a failed save, keep "Delete customer" removing everything personal (their orders stay, anonymous, for sales reports), and update `data/privacy.js` when what is collected changes.
