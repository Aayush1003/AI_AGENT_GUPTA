# AI Digital Life Orchestrator Agent

Full-stack AI agent powered by Gemini API for intelligent personal productivity management. Built with React + Node.js.

## Architecture

```
├── backend/          # Express.js + TypeScript + Gemini API
│   ├── src/
│   │   ├── api/          # Chat API endpoints
│   │   ├── services/     # Gemini & business logic
│   │   ├── db/           # MongoDB models & connection
│   │   ├── middleware/   # Auth, error handling
│   │   └── integrations/ # (Phase 2+) Calendar, Email, etc.
│   └── package.json
│
└── frontend/         # React + TypeScript + Tailwind
    ├── src/
    │   ├── components/    # Chat UI components
    │   ├── services/      # API client
    │   ├── App.tsx
    │   └── index.tsx
    └── package.json
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and add your Gemini API key
npm install
```

**Environment Variables Needed:**
- `GEMINI_API_KEY` - Your Google Gemini API key (get it from: https://ai.google.dev)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (optional for Phase 1)

**Run Backend:**
```bash
npm run dev
```

Server will start at `http://localhost:5000`

**Health Check:**
```bash
curl http://localhost:5000/health
```

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

Frontend will open at `http://localhost:3000`

## API Endpoints

### Public (No Auth Required)

**POST** `/api/demo/chat` - Quick demo without persistence
```json
{
  "message": "What should I prioritize today?"
}
```

Response:
```json
{
  "message": "Your AI response here..."
}
```

### Health Check

**GET** `/health` - Server status
```json
{
  "status": "ok",
  "timestamp": "2024-04-08T10:00:00Z"
}
```

### Authenticated (Phase 2+)

- `POST /api/chat` - Chat with persistence
- `POST /api/chat/stream` - Streaming responses
- `GET /api/chat/history/:conversationId` - Get conversation history

## Development Workflow

### Phase 1 (Current): Foundation
- ✅ Chat interface + Gemini integration
- ✅ Backend API structure
- ✅ Frontend UI components
- 🔄 **Next**: Install dependencies & test end-to-end

### Phase 2 (Next): Intelligence
- Memory & learning system
- RAG (Retrieval-Augmented Generation)
- User preference tracking
- Function-calling for autonomous actions

### Phase 3 (Later): Integrations
- Calendar sync (Google Calendar)
- Email management (Gmail)
- Task management (Todoist)
- Proactive recommendations

## Installation & Dependency Setup

### Backend Dependencies
```bash
cd backend
npm install
```

Key dependencies:
- `@google/generative-ai` - Gemini API client
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment configuration
- `jsonwebtoken` - JWT auth
- `cors` - Cross-origin support

### Frontend Dependencies
```bash
cd frontend
npm install
```

Key dependencies:
- `react` 18.2
- `axios` - HTTP client
- `tailwindcss` - Styling
- `uuid` - Unique ID generation

## Architecture Decisions

### Why This Stack?

| Component | Choice | Reason |
|-----------|--------|--------|
| **LLM** | Gemini API | Free tier, streaming, function-calling support |
| **Backend** | Node.js/Express | Lightweight, easy to deploy, JS ecosystem |
| **Frontend** | React | Component reusability, rich ecosystem |
| **Database** | MongoDB | Flexible schema, good for conversation history |
| **Styling** | Tailwind CSS | Utility-first, minimal CSS overhead |
| **Deployment** | Vercel + GCP Cloud Run | Serverless, auto-scaling, cost-effective |

### Data Flow

```
User Input
    ↓
Frontend (React)
    ↓
Backend API (/api/demo/chat)
    ↓
Gemini Service (geminiService.ts)
    ↓
Google Gemini API
    ↓
Response Stream
    ↓
Frontend Display
```

## Key Features

### Phase 1 Delivered
✅ Real-time chat interface
✅ Gemini AI responses
✅ Streaming capabilities  
✅ Error handling
✅ Dev-friendly structure

### Future Capabilities
🔄 Memory & context awareness
🔄 Document retrieval (RAG)
🔄 Calendar integration
🔄 Email management
🔄 Task prioritization
🔄 Autonomous recommendations

## Troubleshooting

### Issue: Backend not connecting
```
❌ Error: GEMINI_API_KEY not found
```
**Solution**: Add `GEMINI_API_KEY=your_key` to `backend/.env`

Get API key at: https://ai.google.dev/tutorials/setup

### Issue: Frontend can't reach backend
```
❌ CORS error or "Cannot reach localhost:5000"
```
**Solution**:
1. Ensure backend is running: `npm run dev` in `/backend`
2. Check `backend/.env` has `CORS_ORIGIN=http://localhost:3000`
3. Check `frontend/.env` has `REACT_APP_API_URL=http://localhost:5000`

### Issue: "Cannot find module @google/generative-ai"
```bash
cd backend
npm install @google/generative-ai
```

## Testing the Agent

### 1. Test Demo Endpoint
```bash
curl -X POST http://localhost:5000/api/demo/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, tell me about yourself"}'
```

### 2. Test Frontend UI
1. Open http://localhost:3000
2. Type a message like: "Help me organize my tasks for today"
3. Watch the AI respond in real-time

### 3. Test Streaming
```bash
curl -X POST http://localhost:5000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"What is productivity?","conversationId":"test-123"}'
```

## Performance Targets

- Chat response: < 3 seconds
- Frontend load: < 1 second
- API latency: < 500ms

## File Structure Reference

```
.
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express app entry point
│   │   ├── api/
│   │   │   └── chat.ts       # Chat routes
│   │   ├── services/
│   │   │   └── geminiService.ts  # Gemini wrapper
│   │   ├── db/
│   │   │   ├── User.ts
│   │   │   ├── Message.ts
│   │   │   ├── Conversation.ts
│   │   │   └── connection.ts
│   │   └── middleware/
│   │       └── auth.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── index.tsx         # React entry
│   │   ├── App.tsx           # Main component
│   │   ├── index.css         # Global styles
│   │   ├── components/
│   │   │   └── ChatContainer.tsx
│   │   └── services/
│   │       └── api.ts        # API client
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── AGENT_ARCHITECTURE.md     # Full design document
├── README.md                 # This file
└── LICENSE
```

## Next Steps

1. **Get Gemini API Key**
   - Visit https://ai.google.dev
   - Create API key
   - Add to `backend/.env`

2. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Run Both Services**
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm start`

4. **Test the Agent**
   - Open http://localhost:3000
   - Chat with your AI agent!

5. **Phase 2 Next**
   - Add memory system
   - Implement RAG
   - Database persistence

## Monitoring & Debugging

### Backend Logs
```bash
# Watch server logs
cd backend && npm run dev
```

### Frontend Console
- Open DevTools (F12 in browser)
- Check Console tab for errors

### API Testing
```bash
# Using curl
curl -X POST http://localhost:5000/api/demo/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Using Postman/Thunder Client
POST http://localhost:5000/api/demo/chat
Body: {{ "message": "test" }}
```

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test locally
4. Commit: `git commit -m "Add feature X"`
5. Push: `git push origin feature/your-feature`
6. Open a PR

## License

MIT - See [LICENSE](LICENSE) for details

## Support

Need help? Check:
- [Gemini API Docs](https://ai.google.dev)
- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [MongoDB Docs](https://docs.mongodb.com)

---

**Status**: Phase 1 - Foundation (MVP) ✅ In Development

Last Updated: April 8, 2026
