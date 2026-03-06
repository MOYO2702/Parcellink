# ParcelLink AI Assistant Instructions

## Quick Start
- **Run**: `npm start` (production) or `npm run dev` (with auto-reload via nodemon)
- **Stack**: Express.js backend (server.mjs) + vanilla JS frontend
- **Database**: JSON files in `/backend/` — no external DB (users.json, parcels.json, receipts.json)
- **Key Port**: 3000 (configurable via PORT env var)

## Architecture Overview

**Backend (server.mjs)**: Express.js server handling:
- User auth (register/login, dual ID support: email or auto-generated suiteNumber)
- Parcel CRUD with tracking codes, status history, pricing with dynamic discounts
- Payment processing and receipt generation
- Internal staff login system (hardcoded STAFF_MEMBERS array)
- Static file serving + HTML page routing with SPA fallback

**Frontend**: Multi-page vanilla JS (no frameworks) with:
- Global menu toggle and nav active state detection
- Tab-switched parcel quote forms (international/UAE domestic/corporate)
- Dynamic package block addition/removal for multi-package handling
- Tracking UI with timeline visualization
- Responsive design (Poppins font, Font Awesome icons)

## Critical Data Models

**User**: `{ id, fullName, email, suiteNumber (auto PLxxxxxx), passwordHash }`
**Parcel**: `{ trackingCode (PLyyyymmdd-xxxxx), sender/receiverName, from, to, dimensions, pricing: { baseCost, discount%, finalCost }, statusHistory: [{ status, location, timestamp, remark }] }`
**Receipt**: `{ receiptNumber (RCPyyyymmdd-xxxxx), trackingCode, userEmail, amount, paymentMethod, parcelDetails, paidAt, status: "Paid" }`

## API Endpoint Patterns

All endpoints return `{ success: bool, message: string, data: {} }` JSON.

**Auth**: `POST /api/register`, `POST /api/login`
**Parcels**: `POST /api/parcels` (create), `GET /api/track/:code` or `?code=` (fetch + status), `POST /api/parcels/:code/status` (update status)
**Payments**: `POST /api/payments`, `GET /api/receipts/:email`
**Staff**: `POST /api/staff-login` (hardcoded ADMIN_PASSWORD env var)
**Pages**: GET endpoints map .html files; fallback serves index.html for SPA navigation

## Frontend Patterns

All JS is **event-driven** with `DOMContentLoaded` listeners. Key patterns:

1. **Form Submission**: Listen on form, fetch POST to `/api/*`, handle JSON response
2. **Tab Switching**: Use `data-target` attribute to toggle `.active` class on forms/tabs
3. **Element Toggling**: Add/remove `.show`, `.active`, `.hidden` classes
4. **DOM Manipulation**: Query with `querySelectorAll`, iterate with `forEach`
5. **Async Ops**: Use `fetch()` API; errors show in response boxes with color coding (blue=loading, green=success, red=error)
6. **Navigation**: Nav links auto-set `.active` based on `location.pathname` normalization

## Key Business Logic

**Pricing**: Base rate (10 AED/kg international, 6 AED/kg UAE) + surcharges for dimensions + volume discount: 10% default, 20% if weight ≥ 100kg. Encoded in `calculateShippingCost()` helper.

**Authentication**: Users register with fullName + email + password; backend generates unique suiteNumber (PLxxxxxx). Login accepts **either** email or suiteNumber. Passwords hashed with bcryptjs (10 salt rounds).

**Tracking Codes**: Generated as `PL-YYYYMMDD-random6digits`; case-insensitive lookup with normalization.

**Receipts**: Generated when payment POST to `/api/payments`; stored separately, tied to parcel via trackingCode.

## Development Conventions

- **Logging**: Use `console.log()` with timestamps for flow tracking, `console.error()` for failures
- **Error Handling**: Try-catch all async ops; return JSON with `success: false` + readable message
- **Case Sensitivity**: Normalize emails/IDs to lowercase in comparisons
- **Environment Config**: Use `process.env.PORT`, `process.env.ADMIN_PASSWORD`, etc.; provide defaults
- **Static Files**: Served from `/` (CSS, JS, images), auth pages from `/auth`, API from `/api/*`

## Integration Points

**Email** (Nodemailer): Configured via `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` env vars. Currently sends welcome emails; errors logged but non-blocking.

**Static Routing**: `/css`, `/js`, `/images`, `/auth` explicitly mounted; everything else matched against `.html` files in ROOT or serves `index.html`.

**Page Routes**: GET / → index.html, /login → auth/login.html, /register → auth/register.html, /dashboard → dashboard.html, etc.

## When Modifying Code

1. **Adding API Routes**: Use same `{ success, message, data }` response pattern; add route before `app.listen()`
2. **Frontend Forms**: Wrap in DOMContentLoaded, use event delegation, validate inputs before fetch
3. **Database Ops**: Always use read*/write* helpers (readUsers, writeUsers, etc.); maintain JSON format with 2-space indentation
4. **New Pages**: Place .html in root or subdirectory; server will auto-route via fallback OR add explicit `app.get()` route
5. **Pricing Changes**: Modify `calculateShippingCost()` or base rates in form submission handler in script.js

## Common Gotchas

- **JSON Files Not Initializing**: read*/write* helpers create empty `[]` if file missing — no need to pre-populate
- **CORS**: Enabled globally; no auth tokens needed (session-less design)
- **Staff Login**: All staff share same password (ADMIN_PASSWORD); no per-user auth—consider improvement for production
- **Email Non-Blocking**: Email failures don't reject registration (`.catch(() => {})`)—expected behavior
- **URL Normalization**: Tracking code lookup strips leading `PL-` and case-insensitive; input can be partial or full format
