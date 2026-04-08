# 🚀 Getting Started Guide

Complete step-by-step instructions to get the AI Digital Life Orchestrator Agent running.

## ⚡ Lightning Quick Start (5 minutes)

### 1. Prerequisites

Make sure you have:
- ✅ **Node.js v16+** - Download from https://nodejs.org
- ✅ **Gemini API Key** - Get it free from https://ai.google.dev
- ✅ **Git** - For version control

Verify installation:
```bash
node --version   # Should be v16+
npm --version    # Should be v8+
```

### 2. Clone/Open Project

```bash
cd c:\Users\Dell\Desktop\github-repo\AI_AGENT_GUPTA
```

### 3. Get Your API Key

1. Go to **https://ai.google.dev**
2. Click "Get API Key"
3. Create a new API key
4. Copy the key (you'll need it in step 5)

### 4. Setup Backend

```bash
cd backend
npm install

# Create .env file
copy .env.example .env

# Edit .env and add:
# GEMINI_API_KEY=your_key_here
```

**Windows**: Edit `backend\.env` in Notepad
```
GEMINI_API_KEY=YOUR_ACTUAL_KEY_HERE
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-agent-db
JWT_SECRET=dev-secret-key
CORS_ORIGIN=http://localhost:3000
```

### 5. Setup Frontend

In a **new** terminal:
```bash
cd frontend
npm install

# No API key needed for frontend
copy .env.example .env
```

### 6. Run Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You'll see:
```
✅ Server running at http://localhost:5000
📊 Health check: http://localhost:5000/health
💬 Demo chat: POST http://localhost:5000/api/demo/chat
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Browser will open to `http://localhost:3000`

### 7. Chat!

In the browser at http://localhost:3000:
```
You: "What should I prioritize today?"
Agent: "Based on your productivity patterns, here are my recommendations..."
```

---

## 📋 Step-by-Step Detailed Setup

### Step 1: Project Structure Overview

```
AI_AGENT_GUPTA/
├── backend/              ← Express server (port 5000)
│   ├── src/
│   ├── package.json
│   └── .env              ← Add GEMINI_API_KEY here
│
├── frontend/             ← React app (port 3000)
│   ├── src/
│   ├── package.json
│   └── .env
│
├── README.md             ← Project overview
├── SETUP.md              ← Detailed docs
├── AGENT_ARCHITECTURE.md ← Full design
└── setup.bat / setup.sh  ← Auto-setup scripts
```

### Step 2: Install Node.js

**On Windows:**
- Download: https://nodejs.org/en/download/
- Run the installer
- Restart your computer
- Verify: Open PowerShell or CMD and type `node -v`

**On Mac:**
```bash
brew install node
```

**On Linux:**
```bash
sudo apt-get install nodejs npm
```

### Step 3: Get Gemini API Key

**Detailed steps:**

1. Open https://ai.google.dev/tutorials/setup
2. Click "Get API Key"
3. If not logged in, sign in with Google account
4. Click "Create API Key in new project" or select existing project
5. Copy the API key (looks like: `AIza...`)
6. Keep it safe - don't commit to GitHub!

### Step 4: Clone or Enter Project

```bash
# If cloning from GitHub
git clone https://github.com/your-username/AI_AGENT_GUPTA.git
cd AI_AGENT_GUPTA

# Or if already here
cd c:\Users\Dell\Desktop\github-repo\AI_AGENT_GUPTA
```

### Step 5: Setup Backend

```bash
cd backend

# Install all dependencies (might take 2-3 minutes)
npm install

# Create environment file
copy .env.example .env

# Edit .env with your API key
```

**Windows - Edit `.env`:**
- Right-click `backend\.env`
- Open with Notepad
- Find the line: `GEMINI_API_KEY=your_gemini_api_key_here`
- Replace with: `GEMINI_API_KEY=AIza_YOUR_ACTUAL_KEY`
- Save (Ctrl+S)

**Mac/Linux - Edit `.env`:**
```bash
nano .env
# Find GEMINI_API_KEY line, replace with your key
# Press Ctrl+X, Y, Enter to save
```

### Step 6: Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running at http://localhost:5000
📊 Health check: http://localhost:5000/health
💬 Demo chat: POST http://localhost:5000/api/demo/chat
```

**If you see errors:**

| Error | Solution |
|-------|----------|
| `GEMINI_API_KEY not found` | Check `.env` file, your key must be correct |
| `Port 5000 in use` | Change PORT in `.env` or kill process using port |
| `Cannot find module @google/generative-ai` | Run `npm install` again |

### Step 7: Setup Frontend

**In a new terminal:**

```bash
cd frontend

# Install dependencies
npm install

# Create .env (no API key needed)
copy .env.example .env
```

### Step 8: Start Frontend

```bash
npm start
```

**Expected:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

Wait for browser to automatically open to http://localhost:3000

### Step 9: Test the Chat

**In browser (http://localhost:3000):**

1. Type: `"Hello! Tell me about yourself"`
2. Press Send button (📤)
3. Watch AI respond in real-time
4. Try: `"Help me organize my day"`

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] **Backend running**: `http://localhost:5000/health` returns `{"status":"ok"}`
- [ ] **Frontend running**: `http://localhost:3000` displays chat UI
- [ ] **Chat works**: Send message, get AI response within 3 seconds
- [ ] **API key valid**: No `GEMINI_API_KEY` errors in backend console
- [ ] **No database errors**: (MongoDB is optional in Phase 1)

**Test via command line:**
```bash
curl -X POST http://localhost:5000/api/demo/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello\"}"
```

Should return:
```json
{"message": "Your AI response here..."}
```

---

## 🔧 Commands Reference

### Backend (in `backend/` directory)

```bash
npm run dev           # Dev mode with auto-reload
npm run build         # Compile TypeScript
npm start             # Run compiled version
npm run lint          # Check code quality
npm run format        # Auto-format code
```

### Frontend (in `frontend/` directory)

```bash
npm start             # Dev server (opens browser)
npm run build         # Build for production
npm test              # Run tests
npm run eject         # Eject from Create React App (irreversible!)
```

### Root (in project root)

```bash
npm run setup         # Install dependencies for both
npm run dev           # Run both backend + frontend together
npm run build         # Build both
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "GEMINI_API_KEY not provided"**
```
Solution:
1. Edit backend/.env
2. Add: GEMINI_API_KEY=AIza_YOUR_KEY
3. Restart backend (stop with Ctrl+C, run npm run dev again)
```

**Problem: "Port 5000 already in use"**
```
Windows:
  netstat -ano | findstr :5000
  taskkill /PID XXXX /F

Mac/Linux:
  lsof -i :5000
  kill -9 <PID>

Or change PORT in .env to 5001
```

**Problem: "Cannot find module"**
```
Solution:
1. Delete node_modules folder
2. Delete package-lock.json
3. Run: npm install
4. Run: npm run dev
```

### Frontend Issues

**Problem: "Cannot reach localhost:5000"**
```
Check:
1. Backend is running (see backend console)
2. backend/.env has CORS_ORIGIN=http://localhost:3000
3. Both running on correct ports (5000 and 3000)
```

**Problem: "Blank page at http://localhost:3000"**
```
Solution:
1. Open DevTools (F12)
2. Check Console tab for errors
3. Clear browser cache (Ctrl+Shift+Delete)
4. Refresh page (Ctrl+R)
```

**Problem: "Module not found" in React**
```
Solution:
1. Ensure you're in frontend/ directory
2. Run: npm install
3. Restart: npm start
```

### General Issues

**Problem: "npm: command not found"**
```
Solution:
1. Install Node.js from https://nodejs.org
2. Restart terminal/PowerShell
3. Verify: npm -v
```

**Problem: "git: command not found"**
```
Solution:
1. Install Git from https://git-scm.com
2. Restart terminal
3. Verify: git --version
```

---

## 🚀 Next Steps

### If Everything Works ✅

Great! Your AI agent is running. Next:

1. **Explore the code** - Check out `backend/src/services/geminiService.ts`
2. **Try different prompts** - See how the AI responds
3. **Read the docs** - Check [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md)
4. **Start Phase 2** - Add memory & learning system (see plan)

### To Deploy

**Frontend to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Follow prompts
```

**Backend to GCP Cloud Run:**
- See [SETUP.md](SETUP.md) for detailed deployment guide

---

## 📚 Additional Resources

### Learning

- **Gemini API**: https://ai.google.dev
- **Express.js**: https://expressjs.com
- **React**: https://react.dev
- **MongoDB**: https://docs.mongodb.com

### Tools

- **VS Code**: https://code.visualstudio.com (recommended editor)
- **Postman/Thunder Client**: For API testing
- **Git**: https://git-scm.com

### Documentation in This Project

- [README.md](README.md) - Project overview
- [SETUP.md](SETUP.md) - Technical setup & API docs
- [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md) - Full design document
- [GETTING_STARTED.md](GETTING_STARTED.md) - This file

---

## 💡 Pro Tips

1. **Use environment variables** - Never commit `.env` files with real keys
2. **Keep API key safe** - Treat like a password
3. **Dev mode** - Use `npm run dev` (auto-reload) not `npm start`
4. **Check logs** - Always look at console for error messages
5. **Test API first** - Before debugging frontend, test backend with curl

---

## 🆘 Still Need Help?

1. **Check error messages** - Read the full error in terminal
2. **Google the error** - Most issues are common
3. **Re-read SETUP.md** - Often has the answer
4. **Review your .env** - 90% of issues are environment variables
5. **Restart services** - Kill terminal and start fresh

---

**You're all set! 🎉 Now open http://localhost:3000 and chat with your AI agent!**
