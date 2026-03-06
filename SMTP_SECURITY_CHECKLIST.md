# ParcelLink SMTP + Security Checklist (Microsoft 365)

## Current blocker
`npm run smtp:check` returns:
- `535 5.7.139 ... user is locked by your organization's security defaults policy`

This means SMTP AUTH is still blocked at tenant security policy level.

## Unblock SMTP (now)
1. Entra Admin Center (`https://entra.microsoft.com`)
   - Identity → Overview → Properties → Manage security defaults
   - Set **Enable security defaults** to **No**
   - Save
2. Exchange Admin Center (`https://admin.exchange.microsoft.com`)
   - Settings → Mail flow
   - Ensure **Turn off SMTP AUTH protocol for your organization** is **OFF**
3. Microsoft 365 Admin Center (`https://admin.microsoft.com`)
   - Users → Active users → `admin@parcellinkuae.com`
   - Mail → Manage email apps
   - Ensure **Authenticated SMTP** is **ON**
4. Wait 10–15 minutes for policy propagation
5. Run in project folder:
   - `npm run smtp:check`

## Verify end-to-end
1. `npm start`
2. Register a new verification user in the app
3. Confirm server logs show welcome mail send success

## After SMTP works (hardening so you don’t forget)
1. Keep SMTP AUTH enabled only for the mailbox that sends app mail.
2. Rotate mailbox/app password and store only in `.env` / secret manager.
3. Plan migration from SMTP AUTH to Microsoft Graph mail sending (recommended).
4. Re-enable stronger org protections via Conditional Access + MFA policy.

## Quick commands
- SMTP check: `npm run smtp:check`
- DB health: `curl http://localhost:3000/api/db-health`
