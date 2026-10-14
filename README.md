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
- **Database:** MongoDB Atlas, database `toylad`, collection `photos`.
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
| `POST /api/admin/upload-signature` | owner | Signature for one direct Cloudinary upload. |
| `POST /api/admin/photos` | owner | Save a photo after it has uploaded. |
| `PATCH /api/admin/photos/:id` | owner | Change title, category, visibility or order. |
| `DELETE /api/admin/photos/:id` | owner | Delete from Cloudinary and MongoDB. |
| `GET /api/admin/health` | owner | Check the settings, the database and photo storage. Never returns secret values. |

Errors come back as JSON: `{ "error": "message" }`.

## Stock photos

Photos uploaded at `/admin` always show first in the gallery. To hide the stock photos once there are enough real ones, set `showStockPhotos` to `false` in `src/data/gallery.js`.
