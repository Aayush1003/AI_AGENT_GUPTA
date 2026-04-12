# 🚀 Deployment Quick Reference

Copy-paste commands for faster deployment setup.

## Generate JWT Secret (local)

### Windows (PowerShell)
```powershell
# Run in PowerShell as Administrator
$randomBytes = Get-Random -InputObject (65..90+97..122+48..57) -Count 32 | ForEach-Object {[char]$_}
$jwtSecret = [Convert]::ToBase64String(([Text.Encoding]::UTF8.GetBytes(($randomBytes -join '') )))
Write-Host "JWT_SECRET=$jwtSecret"
```

### Mac/Linux
```bash
openssl rand -base64 32
```

---

## Test Backend Health (After Deployment)

```bash
# Replace with your actual Railway URL
curl https://your-backend-url.up.railway.app/health

# Expected response:
# {"status":"ok","timestamp":"2026-04-12T12:34:56.789Z"}
```

---

## Verify Local Build Works

```bash
# Backend
cd backend
npm install
npm run build
npm run lint

# Frontend
cd frontend
npm install
npm run build
```

---

## Push to GitHub (Trigger Workflows)

```bash
git add .
git commit -m "Add GitHub Actions CI/CD workflows"
git push origin main
```

Monitor workflows at: `https://github.com/YOUR_USERNAME/AI_AGENT_GUPTA/actions`

---

## GitHub Secrets Setup (One-Liner Format)

**Copy each command individually to set secrets:**

```bash
# Using GitHub CLI (if installed)
gh secret set GEMINI_API_KEY -b "your_api_key"
gh secret set JWT_SECRET -b "your_jwt_secret"
gh secret set RAILWAY_TOKEN -b "your_railway_token"
gh secret set RAILWAY_BACKEND_SERVICE_ID -b "srv_xxxxx"
gh secret set FIREBASE_CONFIG -b '{"type":"service_account",...}'
gh secret set VERCEL_TOKEN -b "your_vercel_token"
gh secret set VERCEL_ORG_ID -b "your_org_id"
gh secret set VERCEL_PROJECT_ID -b "your_project_id"
gh secret set CORS_ORIGIN -b "https://app.vercel.app"
gh secret set REACT_APP_API_URL -b "https://backend.up.railway.app"
```

**Via GitHub Web UI** (recommended):
1. Go to repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret from table above
4. Type name and value, click "Add secret"

---

## Common Deployment URLs

After deployment, your URLs will look like:

| Service | Deployed URL Example |
|---------|----------------------|
| Backend (Railway) | `https://backend-xyz.up.railway.app` |
| Frontend (Vercel) | `https://my-app.vercel.app` |
| Firebase Console | `https://console.firebase.google.com/project/my-project` |
| GitHub Actions | `https://github.com/USERNAME/AI_AGENT_GUPTA/actions` |

---

## Workflow Files Created

| File | Purpose | Trigger |
|------|---------|---------|
| `.github/workflows/tests.yml` | Lint + build validation | Every push + PR |
| `.github/workflows/backend-deploy.yml` | Deploy backend to Railway | Main branch push |
| `.github/workflows/frontend-deploy.yml` | Deploy frontend to Vercel | Main branch push |

---

## Environment Variables at a Glance

### Backend (.env.production)
```
GEMINI_API_KEY=your_key
JWT_SECRET=your_secret
PORT=5000
NODE_ENV=production
DB_TYPE=firebase
FIREBASE_CONFIG={"type":"service_account",...}
CORS_ORIGIN=https://app.vercel.app
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://backend-xyz.up.railway.app
CI=false
```

---

## Troubleshooting Workflows

**Check workflow logs:**
1. Go to GitHub → Actions tab
2. Click the failed workflow
3. Click the failed job
4. Scroll to see error messages
5. Common causes:
   - Missing secret (check spelling - case sensitive)
   - Invalid secret format
   - Root directory mismatch in platform settings

**Check platform logs:**
- Railway: Service → Logs tab
- Vercel: Deployments → View Deployment → Logs
- Firebase: Cloud Console → Logs Explorer

---

## Sync Secrets Between GitHub & Deployment Platforms

After setting GitHub Secrets, also set them in:

**Railway Backend Service → Variables:**
```
GEMINI_API_KEY
JWT_SECRET
FIREBASE_CONFIG
CORS_ORIGIN
```

**Vercel Frontend Project → Settings → Environment Variables:**
```
REACT_APP_API_URL
```

---

## Redeploy Without Code Changes

**Force redeploy in Railway:**
- Backend Service → Deployments → Latest → Click "Deploy" menu

**Force redeploy in Vercel:**
- Deployments → Click "..." on latest → Redeploy

**Or trigger via GitHub:**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## Check Deployment Status

```bash
# Backend health
curl -I https://backend-xyz.up.railway.app/health
# Should return: HTTP/2 200

# Frontend loads
curl -I https://app.vercel.app
# Should return: HTTP/2 200

# Test chat API
curl -X POST https://backend-xyz.up.railway.app/api/demo/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

---

## Enable GitHub Actions Debug Logging

If workflows fail mysteriously:

1. Go to repo → Settings → Secrets and variables → Actions
2. Add secret: `ACTIONS_STEP_DEBUG` = `true`
3. Re-run workflow
4. Logs will show verbose output

---

## Next Steps After Successful Deployment

1. ✅ Update README with live deployment URL
2. ✅ Add custom domain (optional)
3. ✅ Set up monitoring/alerting
4. ✅ Plan Phase 2 features (memory, RAG, embeddings)
5. ✅ Add end-to-end tests to CI/CD

---

**Need help?** See [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md) for detailed instructions.
