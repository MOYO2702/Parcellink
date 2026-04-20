# ParcelLink: Step-by-Step Publishing Guide

## 🚀 Complete Walkthrough to Publish Your Website

Follow these steps in order. Copy-paste each command into PowerShell.

---

## STEP 1: PREPARE GitHub Account (Website Only - 2 min)

### 1.1 Create GitHub Account
- Go to [github.com](https://github.com)
- Click **Sign up**
- Enter email, password, verify
- Choose your username (example: `yourusername`)

### 1.2 Create New Repository
- Log in to GitHub
- Click **+** (top right) → **New repository**
- **Repository name**: `parcellink`
- **Visibility**: `Public` (free tier)
- Leave everything else unchecked
- Click **Create repository**
- **COPY the URL** shown (looks like: `https://github.com/yourusername/parcellink.git`)

---

## STEP 2: PUSH Your Code to GitHub (5 min)

### 2.1 Open PowerShell in Your Project Folder

```powershell
cd C:\Users\olaye\Documents\ParcelLink
```

Verify you're in the right place:
```powershell
dir
```
Should show: `index.html`, `backend/`, `css/`, `js/`, `package.json`, etc.

### 2.2 Initialize Git (First Time Only)

```powershell
git init
```

### 2.3 Configure Your Git Identity (First Time Only)

```powershell
git config --global user.name "Your Full Name"
```

```powershell
git config --global user.email "your-email@gmail.com"
```

### 2.4 Create `.gitignore` File

```powershell
@"
node_modules/
.env
.env.local
.DS_Store
*.log
npm-debug.log*
"@ | Out-File -Encoding UTF8 .gitignore
```

### 2.5 Stage All Your Files

```powershell
git add .
```

Check what's staged:
```powershell
git status
```

You should see green text with your files listed.

### 2.6 Create Your First Commit

```powershell
git commit -m "Initial ParcelLink commit"
```

### 2.7 Add GitHub as Remote

Replace `yourusername` with your actual GitHub username:

```powershell
git remote add origin https://github.com/yourusername/parcellink.git
```

Verify it was added:
```powershell
git remote -v
```

Should show two lines with your GitHub URL.

### 2.8 Rename Branch to `main`

```powershell
git branch -M main
```

### 2.9 Push to GitHub

```powershell
git push -u origin main
```

**First time**: GitHub may ask for credentials. Choose "GitHub CLI" or follow the prompt. It will open a browser to authenticate.

**Output**: You'll see files uploading... Done! ✅

### 2.10 Verify on GitHub

- Go to [github.com](https://github.com) → Log in
- Click your profile → **Repositories**
- Click **parcellink**
- See all your files? ✅

---

## STEP 3: DEPLOY to Render (3 min)

### 3.1 Create Render Account

- Go to [render.com](https://render.com)
- Click **Sign up**
- Choose **GitHub** (sign in with GitHub account you just created)
- Click **Authorize** when prompted

### 3.2 Create New Web Service

- Render dashboard → Click **New +** (top right)
- Select **Web Service**
- Render will scan your GitHub repos...
- Find and click **parcellink** → **Connect**

### 3.3 Configure Service

Fill in the deployment form:

| Field | Value |
|-------|-------|
| **Name** | `parcellink-api` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Starter` |

**Scroll down** to Advanced Settings:
- **Auto-Deploy**: Toggle **ON** (auto-redeploy on GitHub push)
- **Health Check Path**: `/api/status`
- Use an always-on paid instance so the homepage does not pause on the first visit after inactivity

### 3.4 Add Environment Variables

Scroll to **Environment** tab. Add these variables (click **Add Environment Variable** for each):

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `ADMIN_PASSWORD` | `YourSecurePassword123!` |
| `EMAIL_HOST` | `smtp.office365.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_SECURE` | `false` |
| `EMAIL_USER` | `admin@parcellinkuae.com` |
| `EMAIL_PASS` | `your_mailbox_password_or_app_password` |
| `EMAIL_FROM` | `admin@parcellinkuae.com` |
| `EMAIL_REPLY_TO` | `admin@parcellinkuae.com` |
| `NODE_ENV` | `production` |

**Note**: Use real SMTP credentials so registration and notification emails work in production.

### 3.5 Deploy

Click **Create Web Service** button.

**Wait 2-3 minutes**. You'll see a build log scrolling on the screen. Watch for:
- ✅ "Build completed successfully"
- ✅ "Deploying..."
- ✅ "Service live"

When you see a green checkmark and the URL appears, your site is LIVE! 🎉

### 3.6 Get Your Live URL

At the top of the Render page, you'll see your service URL:
```
https://parcellink-api.onrender.com
```

Copy this! This is your live website. ✅

---

## STEP 4: TEST Your Live Website (5 min)

### 4.1 Test Homepage

Open your browser and go to:
```
https://parcellink-api.onrender.com
```

You should see the ParcelLink homepage! 🎉

### 4.2 Test API Health Check

```
https://parcellink-api.onrender.com/api/status
```

Should return:
```
ParcelLink backend is running 🚀
```

### 4.3 Test Navigation

Click around the site:
- ✅ Home page loads
- ✅ "Send" page works
- ✅ "Track" page works
- ✅ "Services" page works
- ✅ "Help" page works
- ✅ Links don't show 404 errors

### 4.4 Verify User Registration

Go to: `https://parcellink-api.onrender.com/register`

Register a verification account:
- Full Name: `Operations User`
- Email: `ops@parcellinkuae.com`
- Password: `StrongPass123!`

Should see success message (or error if DB issue — that's okay; we'll fix later).

---

## STEP 5: MAKE CHANGES & AUTO-DEPLOY (Future Updates)

Every time you make changes locally:

```powershell
# 1. Make changes in VS Code
# 2. Stage changes
git add .

# 3. Commit with a message
git commit -m "Fixed login page styling"

# 4. Push to GitHub
git push
```

**Render automatically detects the push** → rebuilds → deploys (2-3 min).

You can monitor in Render dashboard → Logs tab.

---

## 🆘 Troubleshooting

### "Build failed" error
- Check Render logs (Logs tab in dashboard)
- Common issues:
  - `package.json` not in root folder
  - Missing dependencies (run `npm install` locally to test)
  - Typo in `start` command

**Fix**: Correct the issue locally → `git push` → Render auto-rebuilds

### "Cannot find module" error
```powershell
# Locally, ensure all dependencies are installed
npm install
```

Then push again.

### Homepage shows 404
- Ensure `backend/server.mjs` serves static files (check line ~600+)
- If not served, add this before `app.listen()`:
```javascript
app.use(express.static(ROOT));
app.get('*', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));
```

### API endpoints return 404
- Check that routes are defined in `backend/server.mjs`
- Test locally first: `npm start` → `curl http://localhost:3000/api/status`

### First visit is slow after inactivity
- Confirm the web service is on Render `Starter` or another always-on paid plan
- Free web services can sleep after inactivity, which delays the first request
- With an always-on plan, the homepage and other site routes should load immediately

---

## ✅ Final Checklist

- [ ] GitHub account created
- [ ] Repository `parcellink` created and code pushed
- [ ] Render account created with GitHub auth
- [ ] Web Service deployed on Render
- [ ] Live URL shows ParcelLink homepage
- [ ] API `/api/status` endpoint works
- [ ] Navigation pages load without 404s
- [ ] Ready for custom domain (Step B from earlier guides)

---

## 🎉 CONGRATULATIONS!

Your ParcelLink website is **LIVE** and **AUTO-DEPLOYS** every time you push to GitHub!

### Share your live URL:
```
https://parcellink-api.onrender.com
```

### Next Steps (Optional):
1. Add a custom domain (see HOSTING_GUIDE.md, Step B)
2. Set up professional email (see HOSTING_GUIDE.md, "Domains & Email")
3. Configure payment processing (integrate Stripe/PayPal)
4. Launch to production!

---

**Questions?** Check Render docs: [render.com/docs](https://render.com/docs)
