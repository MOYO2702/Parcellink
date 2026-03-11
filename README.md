# ParcelLink

ParcelLink is a lightweight Express + vanilla JS parcel tracking and shipping app.

Quick start (local):

```bash
# 1. Install dependencies
npm install

# 2. Copy .env.example -> .env and fill values
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env

# 3. Initialize PostgreSQL schema
npm run db:init

# 4. Run locally
npm start

# Open http://localhost:3000
```

Minimum required `.env` values:
- `ADMIN_PASSWORD`
- `AUTH_TOKEN_SECRET`
- `ALLOWED_ORIGINS`
- `DATABASE_URL` **or** `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`

Staff & investor login assignment:
- Create new admin/investor portal accounts with `POST /api/staff/register`.
- Backend auto-generates a persistent unique ID:
	- `ADM###` for admin accounts
	- `INV###` for investor accounts
- Users keep the same generated ID permanently and log in through `POST /api/staff-login`.
- Reset passwords (without changing Staff ID) with `POST /api/staff/reset-password`.
- List/search generated staff accounts with `POST /api/staff/accounts/search`.
- `STAFF_PROVISION_KEY` protects staff account creation (falls back to `ADMIN_PASSWORD` if not set).
- Legacy static IDs (like `ADM001`, `INV001`) are available for first-time bootstrap and are automatically disabled after at least one provisioned account exists.
- Set `ALLOW_LEGACY_STAFF_LOGIN=true` only if you intentionally want static IDs to keep working.

Example staff registration payload:

```json
{
	"fullName": "Jane Ops",
	"email": "jane.ops@parcellinkuae.com",
	"password": "StrongPass123!",
	"accountType": "admin",
	"role": "Operations Manager",
	"department": "Management",
	"provisionKey": "<STAFF_PROVISION_KEY>"
}
```

Email (company inbox) notes:
- Use your SMTP provider credentials in `EMAIL_*` values.
- Set `EMAIL_FROM` to your verified company sender.
- Set `EMAIL_REPLY_TO` to the inbox that should receive customer replies.
- If your provider requires SSL/TLS on port 465, set `EMAIL_SECURE=true`.

Useful local checks:

```bash
# API + DB health
curl http://localhost:3000/api/status
curl http://localhost:3000/api/db-health
```

Smoke test (recommended before deployment):

```bash
# Runs end-to-end checks and cleans up test data automatically
npm run smoke
```

`npm run smoke` validates:
- Auth flows (register/login by email and suite)
- Parcel lifecycle (create, track, status update)
- Payment and receipt generation
- Staff + investor login flows
- Investor interest submission and dashboard load
- Career application submission
- Generated ID formats (suite, tracking, receipt, investor inquiry, career application)

Optional smoke env vars:
- `SMOKE_BASE_URL` (default: `http://localhost:${PORT || 3000}`)
- `SMOKE_KEEP_DATA=true` (skip cleanup)

Deployment notes:
- This repo expects `backend/server.mjs` to serve static files and APIs.
- Recommended deployment: Render (connect GitHub repo, build: `npm install`, start: `npm start`).
- Add environment variables on Render (ADMIN_PASSWORD, EMAIL_*, DATABASE_URL, etc.).

Security & production checklist:
- Configure SPF/DKIM for transactional email provider.
- Add monitoring (Sentry) and backups.

See `PUBLISH_WEBSITE.md` and `HOSTING_GUIDE.md` for detailed deployment instructions.
