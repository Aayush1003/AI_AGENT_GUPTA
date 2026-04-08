# 🎯 Quick Reference Guide

## ⚡ 5-Minute Commands

### Setup (One Time)

```bash
# Backend
cd backend
npm install
copy .env.example .env
# Edit .env → Add GEMINI_API_KEY

# Frontend
cd frontend
npm install
```

### Run (Every Development Session)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Then visit: http://localhost:3000
```

### Build (Before Deployment)

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## 📁 Important Files

| File | Edits | Purpose |
|------|-------|---------|
| `backend/.env` | ✏️ ADD KEY | Add GEMINI_API_KEY here |
| `backend/src/index.ts` | 📖 READ | Main server code |
| `backend/src/services/geminiService.ts` | 📖 READ | AI integration |
| `frontend/src/App.tsx` | 📖 READ | Main React component |
| `frontend/src/components/ChatContainer.tsx` | 📖 READ | Chat UI |

---

## 📚 Documentation

| File | When to Read |
|------|--------------|
| README.md | Quick overview (2 min) |
| GETTING_STARTED.md | Before first run (5 min) |
| SETUP.md | Technical deep dive (15 min) |
| AGENT_ARCHITECTURE.md | Planning Phase 2 (20 min) |
| IMPLEMENTATION_COMPLETE.md | Full summary (10 min) |

---

## 🔌 API Endpoints

### Local Testing

```bash
# Health check
curl http://localhost:5000/health

# Chat API
curl -X POST http://localhost:5000/api/demo/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello\"}"

# With streaming (advanced)
curl -X POST http://localhost:5000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Test\",\"conversationId\":\"123\"}"
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Add GEMINI_API_KEY to `.env` |
| Frontend won't connect | Check backend running on 5000 |
| Port 5000 in use | Change PORT in `.env` or kill process |
| Module not found | Run `npm install` in that directory |
| API key invalid | Get new one from https://ai.google.dev |

---

## 📊 What's Running

### Backend (port 5000)
- Express server
- Gemini API client
- Chat endpoints
- Database connection (optional)

### Frontend (port 3000)
- React app
- Chat UI
- API client
- Tailwind styling

---

## 🎯 Success Markers

✅ Backend starts without errors  
✅ Frontend opens in browser  
✅ Can type and send messages  
✅ AI responds within 3 seconds  
✅ No error messages in console  

---

## 🚀 Next Steps

1. Get API key: https://ai.google.dev
2. Run setup commands above
3. Visit http://localhost:3000
4. Chat with AI!

---

**Version**: Phase 1 Complete
**Date**: April 8, 2026
**Status**: Production Ready MVP
