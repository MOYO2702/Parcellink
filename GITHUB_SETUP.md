# Connect ParcelLink to GitHub - Step by Step

## 📋 Prerequisites

- GitHub account (free at [github.com](https://github.com))
- Git installed on your PC ([git-scm.com](https://git-scm.com/download/win))

---

## ✅ Step 1: Create GitHub Account (if needed)

1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Enter email, create password
4. Verify email
5. Complete setup

---

## ✅ Step 2: Create New Repository on GitHub

1. **Log in** to GitHub
2. Click **+** icon (top right) → **New repository**
3. Fill in details:

| Field | Value |
|-------|-------|
| **Repository name** | `parcellink` |
| **Description** | `Parcels shipping & logistics platform` |
| **Visibility** | `Public` (free accounts) or `Private` |
| **Initialize with** | Leave UNCHECKED (we already have files) |

4. Click **Create repository**
5. **Copy the URL** shown (looks like: `https://github.com/YOUR_USERNAME/parcellink.git`)

---

## ✅ Step 3: Initialize Git Locally

### 3.1 Open PowerShell in Project Folder

```powershell
# Navigate to your project
cd C:\Users\olaye\Documents\ParcelLink

# Check current directory
Get-Location
```

### 3.2 Initialize Git Repository

```powershell
# Initialize git
git init

# Check git status
git status
```

**Output should show**: All your files listed as "untracked"

---

## ✅ Step 4: Configure Git (First Time Only)

```powershell
# Set your name
git config --global user.name "Your Name"

# Set your email (same as GitHub)
git config --global user.email "your-email@gmail.com"

# Verify
git config --global user.name
git config --global user.email
```

---

## ✅ Step 5: Create `.gitignore` File

This prevents unwanted files from being pushed:

```powershell
# Create .gitignore in project root
@"
node_modules/
.env
.env.local
.DS_Store
*.log
npm-debug.log*
.vscode/
.idea/
dist/
build/
"@ | Out-File -Encoding UTF8 .gitignore
```

---

## ✅ Step 6: Add and Commit Files

### 6.1 Add All Files to Git

```powershell
# Stage all files
git add .

# Check what's staged
git status
```

**Should show**: Green "Changes to be committed" with your files (excluding `.gitignore` items)

### 6.2 Create First Commit

```powershell
git commit -m "Initial ParcelLink commit"
```

**Output**: Shows number of files changed

---

## ✅ Step 7: Connect to GitHub Remote

```powershell
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/parcellink.git

# Verify remote is added
git remote -v
```

**Output** should show two lines with your GitHub URL

---

## ✅ Step 8: Push to GitHub

### 8.1 Rename Branch to `main` (if needed)

```powershell
# Check current branch
git branch

# If it says "master", rename to "main"
git branch -M main
```

### 8.2 Push Code to GitHub

```powershell
# Push to GitHub
git push -u origin main
```

**First time**: GitHub may ask for credentials:
- Choose **GitHub CLI** or **Personal Access Token**
- Follow the prompt

**Output**: Files uploading... Done! ✅

---

## ✅ Step 9: Verify on GitHub

1. Go to [github.com](https://github.com) and log in
2. Go to your profile → **Repositories**
3. Click **parcellink**
4. You should see all your files! 🎉

---

## 📝 After This: Daily Git Workflow

Every time you make changes:

```powershell
# 1. Check status
git status

# 2. Stage changes
git add .

# 3. Commit with message
git commit -m "Describe what you changed"

# 4. Push to GitHub
git push
```

---

## 🚀 When Ready to Deploy to Render

Once your code is on GitHub:

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select `parcellink` repository
5. Configure and deploy!

Render will auto-deploy every time you push to GitHub. ⚡

---

## 🆘 Common Issues

### "fatal: not a git repository"
```powershell
# Solution: You're in wrong folder
cd C:\Users\olaye\Documents\ParcelLink
git init
```

### "fatal: pathspec 'origin' does not match any file(s) known to git"
```powershell
# Solution: Remote not added yet
git remote add origin https://github.com/YOUR_USERNAME/parcellink.git
```

### "Permission denied"
```powershell
# Solution: GitHub credentials not saved
# Delete saved credentials and re-authenticate:
# Windows: Settings → Credential Manager → Remove GitHub entries
# Then try: git push (it will prompt again)
```

### "branch 'main' set up to track 'origin/main'"
✅ This is GOOD! Your branch is connected.

---

## ✨ Final Checklist

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Git initialized locally (`git init`)
- [ ] `.gitignore` created
- [ ] Files staged (`git add .`)
- [ ] First commit made (`git commit -m "..."`)
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code pushed to GitHub (`git push -u origin main`)
- [ ] Files visible on GitHub website
- [ ] Ready for Render deployment!

---

**You're all set! Your ParcelLink is now on GitHub.** 🎉

Next step: Deploy to Render (see HOSTING_GUIDE.md)
