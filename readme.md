# DHClothing – Full‑Stack E‑Commerce Platform

DHClothing is a production‑ready MERN (MongoDB, Express, React, Node) application consisting of:

* Customer storefront (`frontend/`)
* Administrative dashboard (`admin/`)
* REST + payment + media backend API (`backend/`)

It supports rich product variant handling, bundle (tiered) pricing, OTP based signup & password reset, coupon management, multi‑gateway payments (COD, Stripe, Razorpay), Cloudinary media storage, and a role‑separated admin experience.

---
## Table of Contents
1. Features
2. Architecture & Folder Structure
3. Tech Stack
4. Data & Pricing Model
5. Bundle Pricing Logic (Deals)
6. Coupons System
7. Payments & Order Lifecycle
8. Authentication & Authorization
9. Environment Variables (.env) Reference
10. Local Development Setup
11. Build & Deployment Notes
12. API Endpoints Summary
13. Frontend & Admin Conventions
14. Image & Variant Handling
15. Toast / UX Feedback Events
16. Security Considerations
17. Troubleshooting Guide
18. Roadmap / Optional Enhancements

---
## 1. Features
**Core Commerce**
* Product catalog with categories & subcategories (includes custom subcategories: `Oversize`, `Regular Fit`, etc.).
* Product variants (color / image sets / per‑variant pricing) + base fallback images.
* Exclusive products flag – appear in a dedicated Exclusive section & page; excluded from generic listings.
* Bestseller toggle.

**Cart & Pricing**
* Variant & size aware cart structure.
* Greedy bundle (tier) pricing for qualifying subcategories, always choosing the cheaper of (raw sum) vs (deal price set).
* Dynamic shipping fee rules (COD only – flat ₹79; Online payments – free shipping).
* Real‑time savings calculation: shows “You save ₹X” vs singles pricing.
* Automatic toast when bundle pricing first becomes active ("Bundle pricing applied").

**Coupons**
* Admin creates coupons (percent / fixed) with toggle & optional expiry.
* Frontend public verification endpoint before applying.
* Stored on order (code + absolute discount) for audit.

**Authentication & Accounts**
* Email/password auth (JWT) for users & admin (separate admin auth middleware).
* OTP based signup flow (init + verify) via email.
* OTP based password reset (init + verify + reset).
* Auth‑gated actions: add to cart (must login BEFORE adding), viewing profile, placing orders, accessing Exclusive nav link.

**Orders & Payments**
* Payment methods: COD, Stripe, Razorpay.
* Unified order creation pipeline with payment method specific handling.
* Server computes canonical pricing: bundle logic + coupon + shipping to prevent client tampering.
* Payment verification endpoints (Stripe / Razorpay) to confirm and update order payment state.

**Admin Panel**
* Add / remove products with variant uploads (multi‑image via Multer + Cloudinary).
* Order management (status updates).
* Coupon management (create, list, toggle, verify test).
* Visual variant/color indicators (swatches) in admin & orders.

**Media & Infrastructure**
* Cloudinary for image hosting.
* Multer for multi‑part form handling (supports dynamic variant field naming).
* CORS allow‑list for production & local domains.

**UX / Quality of Life**
* Toast feedback for auth gating, coupon application, bundle activation, add/remove actions.
* Deal hints in cart (how many more items to unlock next tier).
* Exclusive nav link prompts login if not authenticated.

---
## 2. Architecture & Folder Structure
```
backend/        Express API, DB models, payment & coupon logic
frontend/       Customer storefront (React + Vite + Tailwind)
admin/          Admin dashboard (React + Vite + Tailwind)
```
Key backend directories:
* `config/` – DB & Cloudinary connectors.
* `models/` – Mongoose schemas (User, Product, Order, Coupon).
* `controllers/` – Domain logic for auth, products, cart, orders, coupons.
* `routes/` – Express routers per domain.
* `middleware/` – Auth (user/admin), Multer upload handler.

---
## 3. Tech Stack
**Backend**: Node.js, Express, Mongoose, JWT, Multer, Cloudinary SDK, Stripe SDK, Razorpay SDK, Nodemailer.
**Frontend/Admin**: React 18, Vite, React Router, Tailwind CSS, Axios, React Toastify.
**Database**: MongoDB (collections implicitly: products, users, orders, coupons).
**Deployment Targets**: (Adjust per environment) – Vercel / Render / traditional Node host for API; static hosting (Vercel / Netlify) for React apps; Cloudinary for assets.

---
## 4. Data & Pricing Model
### Product (simplified)
```
name: String
description: String
price: Number (base price)
image: [String] (fallback images)
variants: [ { id?, colorName?, colorHex?, images?, price?, ... } ]
category: String
subCategory: String (bundle pricing applies to Oversize / Regular Fit)
sizes: [String]
bestseller: Boolean
exclusive: Boolean (default false)
date: Number (timestamp)
```
### Cart Representation
Nested object keyed by `productId::variantId` (variantId may be omitted) → size → quantity.

### Order
```
userId, items (array snapshot), amount (final charged), couponCode, discount,
address (object), status, paymentMethod, payment (boolean), date
```
### Coupon
```
code (unique), type (percent|fixed), value, active, expiresAt (timestamp|null)
```

---
## 5. Bundle Pricing Logic (Deals)
Implemented greedily per subcategory group, never increasing customer cost.

### Oversize Tiers
* 1 → 499
* 2 → 799
* 3 → 999
* 4+ → Greedy: apply as many 3× sets @999 then 2× @799 then 1× @499, but always compare to raw sum and choose the min.

### Regular Fit Tiers
* Baseline unit: 299
* 3 → 799
* 4 → 999
* 5+ → Greedy: apply 4× (999) then 3× (799) then singles at 299; choose min vs raw sum.

Activation triggers a one‑time toast: **"Bundle pricing applied"**.

Savings: `singlesTotal - bundleTotal` shown as “You save ₹X”.

---
## 6. Coupons System
* Types:
	* `percent` – discount = floor(subtotal * (value/100)).
	* `fixed` – discount = min(value, subtotal).
* Validation steps: existence → active flag → expiry (if `expiresAt`) → discount calculation.
* Applied after bundle pricing, before shipping (or after? The implementation stores discount separately; final `amount = (bundleSubtotal - discount) + shipping`).
* Admin endpoints for create/list/toggle; public verify endpoint for immediate UX feedback.

---
## 7. Payments & Order Lifecycle
Flow:
1. Frontend calculates optimistic total (bundle + coupon + shipping per method).
2. Backend recomputes canonical subtotal with bundle logic.
3. Coupon validated (if provided) and discount applied.
4. Shipping fee applied (COD=79 else 0).
5. Payment branch:
	 * COD: Order saved with `payment=false` initially (or true if immediate acceptance) – status `Order Placed`.
	 * Stripe: Create Payment Intent / or simple charge amount (in smallest currency unit), return client secret; verify endpoint updates `payment=true`.
	 * Razorpay: Create order (amount in paise), return order data; verification endpoint validates signature then marks paid.
6. Order listing (admin/user) displays consistent amount.

---
## 8. Authentication & Authorization
* JWT stored client‑side (token) – included via Authorization header.
* Middleware:
	* `authUser` – verifies token, attaches user.
	* `adminAuth` – admin credential check (separate login path).
* Gated actions: cart operations, orders, profile, Exclusive nav access, product creation/removal, coupon admin actions.
* OTP flows for signup & resets via Nodemailer (env email credentials needed if implemented; not detailed in code excerpt – add as required).

---
## 9. Environment Variables (.env) Reference
Create a `.env` in `backend/`:
```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@clusterX.mongodb.net
JWT_SECRET=<secure-random-string>

# Cloudinary
CLOUDINARY_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_SECRET_KEY=<api_secret>

# Stripe
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_WEBHOOK_SECRET=whsec_optional_if_using_webhooks

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Email / OTP (example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=app_or_smtp_password
```
Frontend/Admin (Vite) environment variables (prefix with `VITE_`):
```
VITE_BACKEND_URL=https://api.dhclothing.in
```

---
## 10. Local Development Setup
### Prerequisites
* Node.js 18+ (LTS recommended)
* MongoDB instance (local or Atlas)
* Cloudinary account (for image storage)
* Stripe & Razorpay test credentials (optional for payment testing)

### Install & Run
Backend:
```powershell
cd backend
npm install
npm run server   # nodemon
```
Frontend:
```powershell
cd frontend
npm install
npm run dev
```
Admin:
```powershell
cd admin
npm install
npm run dev
```
Access:
* Storefront: http://localhost:5173
* Admin: http://localhost:5174 (adjust if needed)
* API: http://localhost:4000

---
## 11. Build & Deployment Notes
Production builds (Vite):
```powershell
cd frontend; npm run build
cd ../admin; npm run build
```
Serve dist/ via static host / CDN. Ensure CORS origins updated if domains differ.
Backend: Deploy Node process with environment variables. Ensure `allowedOrigins` in `server.js` reflect final domains.

Image upload: Admin uses form-data with Multer `upload.any()` enabling dynamic variant fields (e.g., `variant_0_images[]`). After upload, Cloudinary URL references stored in product document.

---
## 12. API Endpoints Summary
| Domain | Method | Path | Description | Auth |
|--------|--------|------|-------------|------|
| Health | GET | `/` | API status | None |
| User | POST | `/api/user/register` | Register (legacy direct) | None |
| User | POST | `/api/user/register-init` | Start OTP signup | None |
| User | POST | `/api/user/register-verify` | Complete OTP signup | None |
| User | POST | `/api/user/login` | Login | None |
| User | POST | `/api/user/admin` | Admin login | None |
| User | GET | `/api/user/profile` | Fetch profile | User |
| Password | POST | `/api/user/forgot-init` | Init reset OTP | None |
| Password | POST | `/api/user/forgot-verify` | Verify reset OTP | None |
| Password | POST | `/api/user/forgot-reset` | Reset password | None |
| Product | GET | `/api/product/list` | List products | None |
| Product | POST | `/api/product/single` | Single product by id | None |
| Product | POST | `/api/product/add` | Create product + variants | Admin |
| Product | POST | `/api/product/remove` | Remove product | Admin |
| Cart | POST | `/api/cart/get` | Get user cart | User |
| Cart | POST | `/api/cart/add` | Add item | User |
| Cart | POST | `/api/cart/update` | Update quantities | User |
| Coupon | POST | `/api/coupon/create` | Create coupon | Admin |
| Coupon | GET | `/api/coupon/list` | List coupons | Admin |
| Coupon | POST | `/api/coupon/toggle` | Activate/deactivate | Admin |
| Coupon | POST | `/api/coupon/verify` | Verify code (public) | None |
| Order | POST | `/api/order/place` | Place COD order | User |
| Order | POST | `/api/order/stripe` | Start Stripe payment | User |
| Order | POST | `/api/order/razorpay` | Start Razorpay payment | User |
| Order | POST | `/api/order/userorders` | User's orders | User |
| Order | POST | `/api/order/list` | All orders | Admin |
| Order | POST | `/api/order/status` | Update status | Admin |
| Payment | POST | `/api/order/verifyStripe` | Confirm Stripe payment | User |
| Payment | POST | `/api/order/verifyRazorpay` | Confirm Razorpay payment | User |

---
## 13. Frontend & Admin Conventions
* `ShopContext` centralizes cart state, pricing (bundle logic), and backend URL fallback.
* `productId::variantId` composite key for cart grouping.
* Exclusive products filtered out of general collections and shown in their dedicated components/pages.
* Add‑to‑Cart enforces login; if not authenticated: toast + redirect to `/login` (no silent cart mutation).

---
## 14. Image & Variant Handling
Variant array objects may contain:
```
{ id, colorName, colorHex, images: [url...], price }
```
Upload flow:
1. Admin selects images per variant (multi file input naming convention accepted by `upload.any()`).
2. Backend uploads each to Cloudinary.
3. Stores resulting URLs in `variants[i].images` or `image` fallback array.

---
## 15. Toast / UX Feedback Events
| Event | Message |
|-------|---------|
| Add to cart success | `Added to cart` (unless bundle triggers) |
| Bundle activation | `Bundle pricing applied` |
| Auth gate (add to cart) | `Please login first` (or similar) |
| Coupons | Success / invalid / expired / inactive (contextual) |
| Exclusive nav unauthenticated | Login prompt toast |

---
## 16. Security Considerations
* Server recomputes bundle & coupon totals; client numbers are advisory only.
* JWT secret stored server‑side, never exposed.
* CORS restricted to known production & local origins.
* Coupon verification separated from final order placement to reduce misuse; still validated again server‑side.
* Sensitive keys (.env) never committed.
* Multer file filtering (extend as needed) – currently permissive for variant flexibility; harden for production.

---
## 17. Troubleshooting Guide
| Issue | Cause | Fix |
|-------|-------|-----|
| CORS error | Origin not in `allowedOrigins` | Add domain to array & redeploy |
| Images not uploading | Missing Cloudinary env vars | Verify `CLOUDINARY_*` values |
| Coupon always invalid | Not active or expired timestamp | Toggle via admin; check system clock |
| Bundle not applying | Wrong subCategory spelling | Ensure exact `Oversize` or `Regular Fit` usage |
| Wrong order total vs cart | Stale backend logic / not restarted | Restart API after pricing changes |
| Stripe/Razorpay amount mismatch | Not using smallest currency unit | Confirm multiplication (INR → paise) |

---
## 18. Roadmap / Optional Enhancements
* Per‑line item annotations: which bundle deal applied.
* Advanced inventory (stock per variant+size).
* Search & filtering service (e.g., Algolia / Meilisearch).
* Webhook handling for asynchronous payment events.
* Pagination & caching (Redis) for high traffic scaling.
* Rate limiting (express-rate-limit) for auth & coupon endpoints.
* Accessibility & performance audits (Lighthouse CI).
* Internationalization & multi‑currency.

---
## License
Project currently unlicensed (default – all rights reserved). Add an OSI license file if you intend open source distribution.

## Acknowledgements
* React, Vite, Tailwind CSS
* Stripe & Razorpay SDKs
* Cloudinary for media hosting
* MongoDB / Mongoose

---
## Quick Start (TL;DR)
```powershell
# Backend
cd backend
cp .env.example .env   # (create and fill as described)
npm i
npm run server

# Frontend
cd ../frontend
npm i
npm run dev

# Admin
cd ../admin
npm i
npm run dev
```

Open: Storefront http://localhost:5173 – Admin http://localhost:5174 – API http://localhost:4000

Happy building! 🛠️

