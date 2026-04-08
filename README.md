# AI Digital Life Orchestrator Agent

An AI-powered personal productivity agent that transforms how you live and work in the digital world.

## 🎯 Mission

Create an intelligent agent that:
- **Understands** your work style, preferences, and goals
- **Manages** your time, tasks, calendar, and communications
- **Predicts** your needs before you ask
- **Automates** routine decisions with your approval
- **Learns** from your feedback to get smarter over time

## 🚀 Quick Start

**See [SETUP.md](SETUP.md) for complete installation & development guide.**

### Minimal Setup (2 minutes)

```bash
# Backend
cd backend
npm install
echo "GEMINI_API_KEY=your_key_here" > .env
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

Then visit **http://localhost:3000** and chat with your AI agent!

## 📦 What's Included

### Phase 1: Foundation ✅ (Complete)
- ✅ React UI with real-time chat
- ✅ Express.js backend with Gemini integration
- ✅ Database models (User, Message, Conversation)
- ✅ Authentication middleware
- ✅ Error handling & CORS support

### Phase 2: Intelligence 🔄 (Next)
- Memory system with user profiles
- RAG (retrieval-augmented generation)
- Document upload & embeddings
- Preference learning

### Phase 3: Integrations 📅 (Later)
- Google Calendar sync
- Gmail integration
- Task management
- Proactive recommendations

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [SETUP.md](SETUP.md) | Installation, API docs, troubleshooting |
| [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md) | Full design & implementation plan |

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **AI** | Google Gemini API |
| **Database** | MongoDB (optional in Phase 1) |
| **Deployment** | Vercel + GCP Cloud Run |

## 🔑 Getting Started

1. **Get Gemini API Key**: https://ai.google.dev
2. **Clone & Install**: See [SETUP.md](SETUP.md)
3. **Run Services**: Backend on 5000, Frontend on 3000
4. **Chat**: Try "Help me organize my day"

## 💬 Test It

### Via CLI
```bash
curl -X POST http://localhost:5000/api/demo/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is productivity?"}'
```

### Via UI
1. Open http://localhost:3000
2. Type: "Schedule a meeting tomorrow at 2 PM"
3. See AI respond

## 📁 Project Structure

```
├── backend/              # Node.js + Express
│   ├── src/
│   │   ├── api/         # Chat endpoints
│   │   ├── services/    # Gemini service
│   │   ├── db/          # Database models
│   │   └── middleware/  # Auth, CORS
│   └── package.json
│
├── frontend/             # React app
│   ├── src/
│   │   ├── components/  # Chat UI
│   │   ├── services/    # API client
│   │   └── App.tsx
│   └── package.json
│
├── AGENT_ARCHITECTURE.md # Design doc
└── SETUP.md             # Dev guide
```

## 🛠️ Development

### Backend Commands
```bash
cd backend
npm run dev      # Start dev server
npm run build    # Build TypeScript
npm run lint     # Check code quality
npm run format   # Format code
```

### Frontend Commands
```bash
cd frontend
npm start        # Dev server
npm run build    # Production build
npm test         # Run tests
```

## 🐛 Common Issues

**Backend won't start?**
- Missing `GEMINI_API_KEY`: Get it at https://ai.google.dev and add to `.env`
- Port 5000 already in use: `lsof -i :5000` and kill the process

**Frontend won't connect?**
- Ensure backend is running: `http://localhost:5000/health`
- Check CORS settings in `backend/.env`

See [SETUP.md](SETUP.md) for more troubleshooting.

## 🎓 Learning Path

1. **Start**: Read this README
2. **Setup**: Follow [SETUP.md](SETUP.md)
3. **Design**: Review [AGENT_ARCHITECTURE.md](AGENT_ARCHITECTURE.md)
4. **Build**: Start Phase 2 enhancements
5. **Deploy**: Push to Vercel + Cloud Run

## 🌱 What's Next

- [ ] Add memory & learning system (Phase 2)
- [ ] Implement RAG for document retrieval
- [ ] Connect to Google Calendar
- [ ] Add Gmail integration
- [ ] Deploy to production

## 📊 Status

**Current Phase**: 1 - Foundation (MVP) ✅ Complete

**Key Metrics**
- Chat response time: < 3 seconds
- UI response: < 1 second
- Code coverage: TBD
- Uptime: 99.9% (target)

## 📄 License

MIT - See [LICENSE](LICENSE)

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes & test
4. Submit a PR
5. We'll review & merge

## 📞 Support

- **API Issues**: https://ai.google.dev/tutorials/setup
- **React Questions**: https://react.dev
- **Express Help**: https://expressjs.com

---

**Made with ❤️ to transform digital productivity**

🚀 **Ready to build the future of work?** See [SETUP.md](SETUP.md) to get started!
