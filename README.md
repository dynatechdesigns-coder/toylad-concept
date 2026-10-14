# Toylad Concept website

Showcase, menu and booking site for Toylad Concept (custom cakes, pastries, event decoration and event management), with a private admin area at `/admin` where the owner uploads gallery photos from her phone.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site and the `/api` routes at http://localhost:3000. The admin area is at http://localhost:3000/admin. |
| `npx vercel dev` | Optional: runs the same thing through the Vercel CLI (needs `npx vercel login`). |
| `npm run build` | Builds the site into `dist/`. |
| `npm run lint` | Checks the code with Oxlint. |
| `npm run hash-password` | Asks for the admin password and prints its bcrypt hash. |

## How it works

- **Site:** React + Vite + Tailwind CSS. Booking forms open WhatsApp with a pre-filled message.
- **API:** Vercel serverless functions in `/api` (Node runtime).
- **Database:** MongoDB Atlas, database `toylad`, collections `photos`, `customers`, `leads` (enquiries) and `orders`.
- **Images:** Cloudinary, folder `toylad/gallery`. The browser uploads straight to Cloudinary using a signature from the API, so large phone photos never pass through Vercel.
- **Login:** one owner password. A correct password sets a signed, httpOnly session cookie that lasts 7 days.

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables) and, for local testing, in `.env`. They are read only by the `/api` functions and never reach the browser. `.env` is git-ignored: never commit it.

| Name | What it is |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string, starting with `mongodb+srv://`. |
| `CLOUDINARY_CLOUD_NAME` | Cloud name from the Cloudinary dashboard. |
| `CLOUDINARY_API_KEY` | API key from the Cloudinary dashboard. |
| `CLOUDINARY_API_SECRET` | API secret from the Cloudinary dashboard. |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the owner's password, from `npm run hash-password`. |
| `SESSION_SECRET` | Long random string (at least 32 characters) that signs the login cookie. |

In `.env`, wrap the hash in single quotes because it contains `$` signs:

```text
ADMIN_PASSWORD_HASH='$2b$12$...'
```

Generate a `SESSION_SECRET` with:

```text
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Until these are set, the public site still works and shows the stock photos.

## API

| Route | Access | Purpose |
|---|---|---|
| `POST /api/auth/login` | public | Check the password and start a session. |
| `POST /api/auth/logout` | public | End the session. |
| `GET /api/auth/me` | public | Say whether the visitor is logged in. |
| `GET /api/photos` | public | Published photos, in display order. |
| `GET /api/admin/photos` | owner | All photos, including hidden ones. |
| `POST /api/admin/tools/upload-signature` | owner | Signature for one direct Cloudinary upload. |
| `POST /api/admin/photos` | owner | Save a photo after it has uploaded. |
| `PATCH /api/admin/photos/:id` | owner | Change title, category, visibility or order. |
| `DELETE /api/admin/photos/:id` | owner | Delete from Cloudinary and MongoDB. |
| `GET /api/admin/tools/health` | owner | Check the settings, the database and photo storage. Never returns secret values. |
| `GET /api/admin/tools/reports` | owner | The numbers behind the Reports tab. |
| `GET /api/admin/orders` | owner | Every order with its customer. |
| `POST /api/admin/orders` | owner | New order for an existing (`customerId`) or new (`newCustomer`) customer; `leadId` confirms that enquiry. |
| `PATCH /api/admin/orders?id=…` | owner | Edit an order or change its status (confirmed, delivered, cancelled). |
| `POST /api/enquiries` | public | Save a copy of a booking-form enquiry: creates or updates the customer by phone and adds a lead. |
| `GET /api/admin/leads` | owner | Open enquiries, newest first (`?scope=all` for every enquiry). |
| `POST /api/admin/leads` | owner | Record an enquiry that came by WhatsApp, phone or walk-in. |
| `PATCH /api/admin/leads/:id` | owner | Change status (a reason is required for "lost") or the follow-up date. |
| `GET /api/admin/customers` | owner | All customers, most recently in touch first. |
| `GET /api/admin/customers/:id` | owner | One customer with all their enquiries. |
| `PATCH /api/admin/customers/:id` | owner | Edit details, consent or notes; `addNote` adds a dated note. |
| `DELETE /api/admin/customers/:id` | owner | Delete the customer and all their enquiries. Their orders stay, with no name, phone or notes. |

Errors come back as JSON: `{ "error": "message" }`.

## Customers and prospects

- **Booking form:** it opens WhatsApp exactly as before, and also sends a copy to `/api/enquiries` in the background. If saving fails the customer never notices.
- **Customers** are matched by phone number, stored as `+234…`. A second enquiry from the same number updates the same customer; it only fills in missing details and can turn offers consent on, never off.
- **Consent:** the offers box is never ticked for the customer. The date consent was given is stored with it.
- **Prospects tab:** enquiries not yet delivered or lost. An enquiry still "new" or "quoted" after 2 days gets a "Follow up" badge; opening WhatsApp from the card or marking it "quoted" restarts the 2 days.
- **Deleting a customer** in the Customers tab removes them and all their enquiries, for deletion requests under the Nigeria Data Protection Act 2023. Their orders are kept without anything that identifies them.
- **Privacy notice:** the wording is in `src/data/privacy.js`. The "kept for up to two years" period is a placeholder to confirm.
- **Spam protection:** a hidden honeypot field, and at most 5 enquiries per 10 minutes from one address (per server instance, so approximate).

## Orders and reports

- **Orders tab:** orders still to deliver come first, soonest first; those due within 7 days are marked "This week". Delivered and cancelled orders are listed under "Past orders".
- **From a prospect:** "Create order" on a prospect card fills in the customer, the item and the date, and marks the enquiry confirmed.
- **Reports:** cancelled orders never count. "This month" and top sellers go by the date the order was taken; "Busy months" goes by delivery date. Top sellers are ranked by how many orders included the item.
- **Loyal customers** have 3 or more orders. **Quiet customers** ordered before but not in the last 6 months; the "We miss you" button only appears for customers who agreed to offers.
- **Export to Excel** on the Reports tab saves customers or orders as a `.csv` file.
- **Deleting a customer** keeps their orders in the sales figures, but removes the link to them and the order notes.
- **Vercel function limit:** the Hobby plan allows 12 serverless functions and this project uses 11. Related routes share one file (`api/auth/[action].js`, `api/admin/tools/[action].js`, `api/admin/orders.js`).

## Gallery rules

- **All tab:** at most 10 photos. The owner's starred ("Feature on All") photos come first in her order, then her newest photos.
- **Category tabs:** at most 8 photos each, in the owner's order. The tab count is the number shown. Extra photos stay saved and show once she moves them up or hides an older one.
- **Stock photos:** in each category they only fill the spots the owner has not filled yet. To hide them completely, set `showStockPhotos` to `false` in `src/data/gallery.js`.
- **New uploads** join the end of their category, so they never push an older photo off the website.
- The numbers live in `src/utils/gallery.js`.

## Owner mode

When the owner is logged in, the public site shows her a small "Owner mode" bar and, in the gallery, an "Add photo" button plus star, hide, edit and delete buttons under her own photos. Visitors never see or download any of this: the code loads only after `/api/auth/me` confirms the session.
