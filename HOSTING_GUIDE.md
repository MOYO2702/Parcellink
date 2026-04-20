# ParcelLink Hosting Guide: Render & Hostinger

## Table of Contents
1. [Hosting on Render (Recommended for Backend)](#render-hosting)
2. [Hosting Frontend on Hostinger](#hostinger-hosting)
3. [Full Stack on Render](#full-stack-render)
4. [Environment Variables Setup](#environment-variables)

---

## 🚀 RENDER HOSTING (Recommended for Full Stack)

### Why Render?
- Always-on Starter web service removes first-visit cold starts
- Easy Node.js deployment
- Automatic deployments from GitHub
- Built-in PostgreSQL (optional)

### Step 1: Prepare Your Repository

#### 1.1 Create a GitHub Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial ParcelLink commit"

# Create repo on GitHub and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/parcellink.git
git push -u origin main
```

#### 1.2 Create `.gitignore` (if missing)
```
node_modules/
.env
.env.local
.DS_Store
*.log
npm-debug.log*
```

#### 1.3 Ensure `package.json` is in root
Verify your root `package.json` has:
```json
{
  "scripts": {
    "start": "node backend/server.mjs",
    "dev": "nodemon backend/server.mjs"
  }
}
```

### Step 2: Create Render Account & Deploy

#### 2.1 Sign Up to Render
- Go to [render.com](https://render.com)
- Click **Sign Up**
- Connect with GitHub account
- Authorize Render to access your repositories

#### 2.2 Create New Web Service
- Dashboard → **New +** → **Web Service**
- Select your `parcellink` repository
- Click **Connect**

#### 2.3 Configure Service
Fill in the deployment form:

| Field | Value |
|-------|-------|
| **Name** | `parcellink-api` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Starter` |

**Advanced Settings:**
- **Auto-Deploy**: Toggle ON (auto-deploy on GitHub push)
- **Health Check Path**: `/api/status`
- Keep the web service on an always-on paid plan so the homepage and other HTML routes load immediately on first visit

#### 2.4 Add Environment Variables
Go to **Environment** tab and add:

```
PORT=3000
ADMIN_PASSWORD=your_secure_admin_password
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=admin@parcellinkuae.com
EMAIL_PASS=your_mailbox_password_or_app_password
EMAIL_FROM=admin@parcellinkuae.com
EMAIL_REPLY_TO=admin@parcellinkuae.com
NODE_ENV=production
```

**Note**: Use verified SMTP credentials from your email provider (Microsoft 365, Google Workspace, SendGrid, etc.).

#### 2.5 Deploy
- Click **Create Web Service**
- Wait for build to complete (2-3 minutes)
- Your app URL: `https://parcellink-api.onrender.com`

#### 2.6 Test Deployment
```bash
# Test API is live
curl https://parcellink-api.onrender.com/_debug/isalive
# Response: {"pid": 123, "ts": 1707...}
```

---

## 🌐 HOSTINGER HOSTING (Frontend + PHP Backend Alternative)

### Option A: Static File Hosting (Frontend Only)

#### A.1 Build Frontend (Compile if needed)
Your frontend is already vanilla JS, so no build needed. Just compress:

```bash
# Create deployment folder
mkdir parcellink-deploy
cp -r css/ js/ images/ *.html auth/ parcellink-deploy/

# Create .htaccess for SPA routing (optional)
echo '
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
' > parcellink-deploy/.htaccess
```

#### A.2 Upload to Hostinger
1. **Log in** to Hostinger www.hostinger.com
2. Go to **Website** → **File Manager**
3. Delete default `index.html` in public_html/
4. Upload all files from `parcellink-deploy/` folder
5. Set **index.html** as default

#### A.3 Update API URLs in Frontend
Since backend is on Render, update `script.js`:

```javascript
// At the top of js/script.js
const API_BASE_URL = 'https://parcellink-api.onrender.com';
```

Update all fetch calls:
```javascript
// Before:
fetch('/api/login', {...})

// After:
fetch(`${API_BASE_URL}/api/login`, {...})
```

---

## 🔗 FULL STACK ON RENDER (All-in-One)

**Best Setup**: Backend on Render + Frontend on Render (same always-on service)

### Step 1: Modify Server to Serve Frontend

Edit `backend/server.mjs`:

```javascript
// After all API routes, add this BEFORE app.listen():

// ================= STATIC & SPA ROUTING =================
app.use(express.static(ROOT));

// HTML Routes (fallback to index.html for SPA)
const htmlFiles = ['index', 'send', 'track', 'dashboard', 'services', 'help', 'career', 'about', 'clientzone', 'admin'];
htmlFiles.forEach(file => {
  app.get(`/${file}`, (req, res) => {
    res.sendFile(path.join(ROOT, `${file}.html`));
  });
});

// Auth pages
app.get('/login', (req, res) => res.sendFile(path.join(ROOT, 'auth/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(ROOT, 'auth/register.html')));

// Fallback to index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ ParcelLink running on http://localhost:${PORT}`);
});
```

### Step 2: Deploy (Same as Backend Steps Above)

**Result**: Single URL serves both frontend + API
- Frontend: `https://parcellink-api.onrender.com`
- API: `https://parcellink-api.onrender.com/api/*`

---

## ⚙️ ENVIRONMENT VARIABLES SETUP

### SMTP Configuration

Use your production-capable SMTP provider credentials.

**Microsoft 365 (recommended for this project):**
```
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=admin@parcellinkuae.com
EMAIL_PASS=your_mailbox_password_or_app_password
EMAIL_FROM=admin@parcellinkuae.com
EMAIL_REPLY_TO=admin@parcellinkuae.com
```

### Production Email (Alternatives)

**Gmail SMTP**:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # NOT your regular password
```

**SendGrid**:
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_USER=apikey
EMAIL_PASS=SG.your-api-key
```

---

## 🔐 Security Checklist

- [ ] Change `ADMIN_PASSWORD` to strong password
- [ ] Use verified SMTP credentials for a real sender mailbox
- [ ] Enable HTTPS (automatic on Render/Hostinger)
- [ ] Set `NODE_ENV=production`
- [ ] Disable console logging in production

---

## 📊 Database Persistence

**Current Setup**: JSON files (`users.json`, `parcels.json`, `receipts.json`)

⚠️ **Issue**: On Render, files reset after every deployment (ephemeral storage)

### Solution 1: Use Render PostgreSQL (Recommended)

1. On Render dashboard, create **PostgreSQL** service
2. Get connection string
3. Install pool library:
```bash
npm install pg
```

4. Update `server.mjs` to use PostgreSQL instead of JSON

### Solution 2: Use External Database
- MongoDB Atlas (free tier)
- Firebase Realtime DB
- AWS DynamoDB

### Solution 3: Keep JSON (Short-term)
If testing only, JSON works fine. Just know data resets after deployment.

---

## 🚀 Deployment Checklist

### Before Deploying:
- [ ] All code committed to GitHub
- [ ] `.gitignore` excludes `node_modules/`
- [ ] `package.json` in root directory
- [ ] `PORT` env var configured on Render
- [ ] Email credentials ready
- [ ] Backend routes tested locally: `npm start`

### After Deploying:
- [ ] Test API endpoint: `/api/status`
- [ ] Test registration: POST `/api/register`
- [ ] Test login: POST `/api/login`
- [ ] Test tracking: GET `/api/track?code=PL-xxx`
- [ ] Frontend loads without 404 errors

---

## 🆘 Troubleshooting

### Render Build Fails
```bash
# Check logs on Render dashboard
# Common issues:
# 1. Missing package.json in root
# 2. Node version mismatch
#    Add to render.yaml:
name: parcellink
services:
  - type: web
    name: api
    runtime: node
    runtimeVersion: 18.18.2
```

### CORS Errors
- Ensure `CORS` enabled in `server.mjs`
- Update frontend API URLs to match backend domain

### "Cannot find module"
```bash
npm install  # Ensure all dependencies installed
```

### Files Disappearing (Render)
- JSON files are ephemeral
- Use PostgreSQL database instead

---

## 📝 Summary Table

| Platform | Frontend | Backend | Cost | Best For |
|----------|----------|---------|------|----------|
| **Render** | ✅ Single URL | ✅ Node.js | Starter | Full Stack |
| **Hostinger** | ✅ Static | ❌ No Node | $2-5/mo | Frontend only |
| **Combined** | Hostinger | Render | $0-5/mo | Hybrid |

---

## 💡 Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Deployment ready"
git push origin main

# 2. Render auto-deploys (if connected)
# Monitor at: https://dashboard.render.com

# 3. Test live
curl https://parcellink-api.onrender.com/_debug/isalive
```

---

**Need Help?**
- Render Docs: [render.com/docs](https://render.com/docs)
- Hostinger Support: [hostinger.com/support](https://hostinger.com/support)
- Node.js Deployment: [nodejs.org/en/docs/guides/nodejs-web-app/](https://nodejs.org/en/docs/guides/nodejs-web-app/)
