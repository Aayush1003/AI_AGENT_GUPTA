# GitHub Actions Deployment - Setup Guide

Complete setup instructions for deploying your AI Agent application using GitHub Actions, Railway/Render, and Vercel/Netlify.

## Overview

Three GitHub Actions workflows will automate your deployment:
- **tests.yml** - Lints and builds on every push & PR (validates code quality)
- **backend-deploy.yml** - Deploys backend to Railway when main branch is pushed
- **frontend-deploy.yml** - Deploys frontend to Vercel when main branch is pushed

## Step 1: Set Up GitHub Secrets

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

### 1.1 Required Backend Secrets

Add these secrets (see detailed instructions below):

| Secret Name | Purpose | Where to Get |
|-------------|---------|-------------|
| `GEMINI_API_KEY` | Google Gemini API authentication | [AI Studio](https://ai.google.dev/) |
| `JWT_SECRET` | JWT token signing key (generate random) | Generate locally: `openssl rand -base64 32` |
| `RAILWAY_TOKEN` | Railway deployment authentication | Railway account → Account settings |
| `RAILWAY_BACKEND_SERVICE_ID` | Identifies your Railway backend service | Railway dashboard → Backend service |
| `FIREBASE_CONFIG` | Firebase service account JSON (stringified) | Firebase Console → Project settings |
| `CORS_ORIGIN` | Your deployed frontend URL | Set after frontend deployment (e.g., `https://app.vercel.app`) |

### 1.2 Required Frontend Secrets

| Secret Name | Purpose | Where to Get |
|-------------|---------|-------------|
| `VERCEL_TOKEN` | Vercel deployment authentication | Vercel Account → Settings → Tokens |
| `VERCEL_ORG_ID` | Your Vercel organization ID | Vercel Account → Settings → General |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Vercel project → Settings → General |
| `REACT_APP_API_URL` | Deployed backend URL | Set after backend deployment (e.g., `https://backend.up.railway.app`) |

---

## Step 2: Get Each Secret Value

### GEMINI_API_KEY

1. Go to [AI Studio](https://ai.google.dev/)
2. Click **"Get API key"** → **"Create API key in new Google Cloud project"**
3. Copy the API key
4. Add to GitHub Secrets as `GEMINI_API_KEY`

**Example**:
```
AIzaSyD7... (your actual key)
```

---

### JWT_SECRET

Generate a secure random string locally:

**Windows (PowerShell)**:
```powershell
# Generate 32-character random string
[Convert]::ToBase64String((Get-Random -InputObject (65..90+97..122+48..57) -Count 32 | ForEach-Object {[char]$_}) -join '')
```

**Mac/Linux**:
```bash
openssl rand -base64 32
```

**Example output**:
```
aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u=
```

Add to GitHub Secrets as `JWT_SECRET`

---

### FIREBASE_CONFIG

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Project settings** (gear icon) → **Service accounts**
4. Click **Generate new private key** (download JSON file)
5. Open the JSON file, copy entire contents
6. Convert to single line (remove newlines) - **important!**

**Example** (before conversion):
```json
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...",
  ...
}
```

**After conversion** (minified):
```
{"type":"service_account","project_id":"my-project","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...","client_email":"firebase-adminsdk@my-project.iam.gserviceaccount.com",...}
```

Add to GitHub Secrets as `FIREBASE_CONFIG`

**Note**: Store the original JSON file securely. Never commit to GitHub.

---

### RAILWAY_TOKEN

1. Go to [Railway.app](https://railway.app)
2. Log in → **Account** (bottom left)
3. Go to **Tokens** → **Create token**
4. Copy the token
5. Add to GitHub Secrets as `RAILWAY_TOKEN`

---

### RAILWAY_BACKEND_SERVICE_ID

1. In Railway, open your backend service
2. Go to **Settings** tab
3. Copy the **Service ID**
4. Add to GitHub Secrets as `RAILWAY_BACKEND_SERVICE_ID`

**Example**: `srv-a1b2c3d4e5f6g7h8i9j0`

---

### VERCEL_TOKEN

1. Go to [Vercel](https://vercel.com) → **Settings** → **Tokens**
2. Click **Create token**
3. Copy the token
4. Add to GitHub Secrets as `VERCEL_TOKEN`

---

### VERCEL_ORG_ID & VERCEL_PROJECT_ID

1. Go to [Vercel dashboard](https://vercel.com/dashboard)
2. Open your frontend project
3. Go to **Settings** → **General**
4. Copy:
   - **Project ID** → Add as `VERCEL_PROJECT_ID`
   - Look for **Team/Org ID** in URL or settings → Add as `VERCEL_ORG_ID`

---

### CORS_ORIGIN (Deployed Frontend URL)

**Add this AFTER frontend is deployed:**

1. Deploy frontend first (GitHub Actions will auto-deploy when you push)
2. In Vercel dashboard, find your deployed frontend URL (e.g., `https://my-app.vercel.app`)
3. Add to GitHub Secrets as `CORS_ORIGIN`

**Example**:
```
https://my-app.vercel.app
```

---

### REACT_APP_API_URL (Deployed Backend URL)

**Add this AFTER backend is deployed:**

1. Deploy backend first (GitHub Actions will auto-deploy when you push)
2. In Railway dashboard, go to Backend service → **Environment/Variables**
3. Find the public URL (e.g., `https://backend.up.railway.app` or `https://your-backend-randomid.up.railway.app`)
4. Add to GitHub Secrets as `REACT_APP_API_URL`

**Example**:
```
https://backend.up.railway.app
```

---

## Step 3: Deploy Backend First

### 3.1 Set Up Railway Backend Service

1. Go to [Railway.app](https://railway.app) → **New Project**
2. Choose **GitHub Repo**
3. Connect GitHub and select your repository
4. Choose **Deploy from GitHub repo**
5. Select `backend` as the root directory
6. Railway will detect Node.js automatically
7. Click **Deploy**

### 3.2 Set Backend Environment Variables in Railway

In Railway's **Backend Service**:

1. Go to **Variables** tab
2. Add these variables (they will be used by GitHub Actions + Railway):
   ```
   GEMINI_API_KEY = ${GEMINI_API_KEY}
   JWT_SECRET = ${JWT_SECRET}
   DB_TYPE = firebase
   FIREBASE_CONFIG = ${FIREBASE_CONFIG}
   CORS_ORIGIN = (leave empty for now, update after frontend deployment)
   PORT = 5000
   NODE_ENV = production
   ```

3. For production, set them to actual values or reference GitHub Secrets

### 3.3 Get Backend Public URL

In Railway **Backend Service → Deployments**:
- Find the public URL (e.g., `https://backend-*.up.railway.app`)
- Save this URL - you'll need it for `REACT_APP_API_URL`

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Project

1. Go to [Vercel](https://vercel.com) → **Add New Project**
2. Select **Import Git Repository**
3. Connect GitHub and select your repository
4. Select `frontend` as the **Root Directory**
5. Click **Deploy**

### 4.2 Set Frontend Environment Variables in Vercel

In Vercel **Project Settings → Environment Variables**:

1. Add:
   ```
   REACT_APP_API_URL = YOUR_BACKEND_URL
   ```
   (e.g., `https://backend-xyz.up.railway.app`)

2. Click **Save**
3. Redeploy from the Deployments tab

### 4.3 Get Frontend Public URL

In Vercel **Deployments**:
- Find the public URL (e.g., `https://my-app.vercel.app`)
- Save this URL

---

## Step 5: Update CORS_ORIGIN Secret

Now that both are deployed:

1. Go to GitHub **Settings → Secrets and variables → Actions**
2. **Update** `CORS_ORIGIN` → Set to your Vercel frontend URL
   ```
   https://my-app.vercel.app
   ```

3. In Railway backend settings, also update `CORS_ORIGIN` to match

---

## Step 6: Trigger Deployment

Push code to main branch to trigger workflows:

```bash
git add .
git commit -m "Add GitHub Actions CI/CD"
git push origin main
```

### 6.1 Monitor Workflows

1. Go to GitHub → **Actions** tab
2. Watch the workflows execute:
   - ✅ **tests.yml** - Runs first (lint, build validation)
   - ✅ **backend-deploy.yml** - Builds and deploys to Railway
   - ✅ **frontend-deploy.yml** - Builds and deploys to Vercel

---

## Step 7: Verify Deployment

### 7.1 Test Backend Health

```bash
curl https://your-backend-url.up.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-04-12T..."}
```

### 7.2 Test Frontend

1. Visit your Vercel URL: `https://my-app.vercel.app`
2. Application should load
3. Open browser DevTools → **Network** tab
4. Send a message in the chat
5. Verify API requests go to your backend URL
6. Chat should work end-to-end

### 7.3 Test Firebase Connection

1. In Firebase Console → **Firestore Database** → **Collections**
2. Send a message in the app
3. Verify `conversations` and `messages` collections are created and populated

---

## Troubleshooting

### "Backend deployment fails"

**Check**:
1. Is `GEMINI_API_KEY` set and valid in GitHub Secrets?
2. Is `FIREBASE_CONFIG` properly formatted (single line JSON)?
3. Railway logs for errors: Railway dashboard → Backend → Logs

**Fix**:
```bash
# Test backend builds locally first
cd backend
npm install
npm run build    # Should succeed
```

---

### "Frontend can't reach backend (CORS error)"

**Check**:
1. Is `CORS_ORIGIN` in **Railway backend variables** set to your Vercel frontend URL?
2. Is `REACT_APP_API_URL` in **Vercel frontend variables** set to your Railway backend URL?

**Fix**:
1. Update both URLs in their respective platform dashboards
2. Redeploy both services

---

### "GitHub Actions workflow fails"

**Check**:
1. Go to GitHub **Actions** → Failed workflow → View logs
2. Look for error messages
3. Common issues:
   - Missing secret (check secret name spelling)
   - Invalid secret format (Firebase JSON not stringified)
   - Node/npm version mismatch

---

## Quick Reference: All Secrets Checklist

```
□ GEMINI_API_KEY - from AI Studio
□ JWT_SECRET - generated locally
□ RAILWAY_TOKEN - from Railway Account
□ RAILWAY_BACKEND_SERVICE_ID - from Railway Backend Service
□ FIREBASE_CONFIG - Firebase service account JSON (stringified)
□ CORS_ORIGIN - Vercel frontend URL (set after frontend deploy)
□ VERCEL_TOKEN - from Vercel Account
□ VERCEL_ORG_ID - from Vercel Settings
□ VERCEL_PROJECT_ID - from Vercel Settings
□ REACT_APP_API_URL - Railway backend URL (set after backend deploy)
```

---

## Next Steps

1. **Add all GitHub Secrets** (Section 1-2)
2. **Set up Railway backend** (Section 3)
3. **Set up Vercel frontend** (Section 4)
4. **Update CORS_ORIGIN secret** (Section 5)
5. **Push to main to trigger workflows** (Section 6)
6. **Test deployment end-to-end** (Section 7)

Once deployed, on each push to main:
- GitHub Actions automatically runs tests
- Backend auto-deploys to Railway
- Frontend auto-deploys to Vercel
- No manual intervention needed!

---

## Optional: Using Render instead of Railway

If you prefer **Render** for the backend:

**Changes**:
1. Replace `railway-app/action@v1` with `curl` to Render API in `backend-deploy.yml`
2. Use `RENDER_API_KEY` and `RENDER_BACKEND_SERVICE_ID` instead of `RAILWAY_*`
3. Backend URL format: `https://your-service-name.onrender.com`

The workflow file includes commented code for this scenario.

---

## Optional: Using Netlify instead of Vercel

If you prefer **Netlify** for the frontend:

**Changes**:
1. Replace `vercel/action@main` with `netlify/actions/cli@master` in `frontend-deploy.yml`
2. Use `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` instead of Vercel tokens
3. Frontend URL format: `https://your-site-name.netlify.app`

The workflow file includes commented code for this scenario.
