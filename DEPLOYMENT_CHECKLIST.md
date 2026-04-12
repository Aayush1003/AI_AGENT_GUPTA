# 🚀 Deployment Checklist

Use this checklist to track your deployment setup progress.

## 📋 Pre-Deployment

- [ ] Repository is pushed to GitHub
- [ ] All code is committed (no uncommitted changes)
- [ ] `.github/workflows/` directory exists with 3 YAML files
- [ ] Environment templates exist: `backend/.env.production`, `frontend/.env.production`

## 🔐 GitHub Secrets Setup (10 secrets total)

### Backend Secrets
- [ ] `GEMINI_API_KEY` - Google Gemini API key
- [ ] `JWT_SECRET` - Random secure string
- [ ] `RAILWAY_TOKEN` - Railway account token
- [ ] `RAILWAY_BACKEND_SERVICE_ID` - Railway service ID
- [ ] `FIREBASE_CONFIG` - Firebase service account (stringified JSON)

### Frontend Secrets  
- [ ] `VERCEL_TOKEN` - Vercel account token
- [ ] `VERCEL_ORG_ID` - Vercel organization ID
- [ ] `VERCEL_PROJECT_ID` - Vercel project ID

### After First Deployment (deploy twice)
- [ ] `CORS_ORIGIN` - Your deployed frontend URL (e.g., `https://app.vercel.app`)
- [ ] `REACT_APP_API_URL` - Your deployed backend URL (e.g., `https://backend.up.railway.app`)

## 🏗️ Platform Setup

### Railway (Backend)
- [ ] Railway account created
- [ ] Backend service connected to GitHub repo
- [ ] Service auto-deploying on push
- [ ] Environment variables configured
- [ ] Public URL obtained (e.g., `https://backend-xyz.up.railway.app`)

### Vercel (Frontend)
- [ ] Vercel account created
- [ ] Frontend project connected to GitHub repo
- [ ] Project auto-deploying on push
- [ ] Environment variables configured
- [ ] Public URL obtained (e.g., `https://my-app.vercel.app`)

## 🔄 Deployment Process

- [ ] Step 1: Set all 8 initial GitHub Secrets (see DEPLOYMENT_SETUP.md)
- [ ] Step 2: Deploy backend to Railway (first automatic deployment)
- [ ] Step 3: Get backend URL from Railway
- [ ] Step 4: Deploy frontend to Vercel (first automatic deployment)
- [ ] Step 5: Get frontend URL from Vercel
- [ ] Step 6: Add final 2 secrets (`CORS_ORIGIN`, `REACT_APP_API_URL`)
- [ ] Step 7: Trigger re-deployment by pushing to main branch

## ✅ Verification

- [ ] GitHub Actions workflows show "passing" on all 3 workflows (tests, backend-deploy, frontend-deploy)
- [ ] Backend responds to `GET /health` endpoint
- [ ] Frontend loads without errors
- [ ] Frontend can communicate with backend (Network tab shows API calls)
- [ ] Chat works end-to-end (message sent → Gemini API → response received)
- [ ] Conversations appear in Firebase Firestore
- [ ] No CORS errors in browser console
- [ ] No 401/403 errors from backend

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't deploy | Check: GEMINI_API_KEY, FIREBASE_CONFIG format, Railway logs |
| Frontend won't deploy | Check: VERCEL_TOKEN, correct root directory setting |
| CORS errors | Check: CORS_ORIGIN matches Vercel frontend URL exactly |
| Chat doesn't work | Check: REACT_APP_API_URL correct, backend health endpoint responding |
| Secrets not found | Check: Secret names (case-sensitive), in correct repository Settings |

## 📞 Help & Documentation

- Backend deployment guide: [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md#step-3-deploy-backend-first)
- Frontend deployment guide: [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md#step-4-deploy-frontend-to-vercel)
- GitHub Actions runs: https://github.com/YOUR_USERNAME/AI_AGENT_GUPTA/actions
- Railway dashboard: https://railway.app
- Vercel dashboard: https://vercel.com/dashboard
- Firebase console: https://console.firebase.google.com/

---

**Last Updated**: April 12, 2026  
**By**: GitHub Copilot - Deployment Setup  
**Status**: 🟢 Ready for implementation
