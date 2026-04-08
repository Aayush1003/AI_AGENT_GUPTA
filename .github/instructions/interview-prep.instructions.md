---
name: Interview & Career Development Instructions
description: "Guidance for implementing interview prep features and career development tools in the AI Agent"
applyTo:
  - "backend/src/services/interviewAgentService.ts"
  - "backend/src/api/interview.ts"
  - "frontend/src/components/Interview*.tsx"
  - "frontend/src/services/api.ts"
---

# Interview & Career Development Code Conventions

## Backend (Node.js/TypeScript)

### Interview Agent Service
- Location: [backend/src/services/interviewAgentService.ts](../../backend/src/services/interviewAgentService.ts)
- Handles all interview prep logic, scoring, and feedback generation
- Modes: interview, exam, resume, behavioral, technical

### Interview API Routes
- Location: [backend/src/api/interview.ts](../../backend/src/api/interview.ts)
- Endpoints:
  - `POST /api/interview/start` - Initialize session
  - `POST /api/interview/answer` - Submit answer and get feedback
  - `POST /api/interview/analyze-resume` - Resume analysis
  - `GET /api/interview/history/:conversationId` - Get session history

### Key Functions
```typescript
// Start a session
startSession(context: InterviewContext): Promise<InterviewResponse>

// Evaluate user answers
evaluateAnswer(answer: string, context, history): Promise<InterviewResponse>

// Analyze resumes
analyzeResume(resumeText: string): Promise<InterviewResponse>
```

## Frontend (React/TypeScript)

### Components

#### InterviewSetup
- Location: [frontend/src/components/InterviewSetup.tsx](../../frontend/src/components/InterviewSetup.tsx)
- Allows users to select mode (interview, exam, resume, etc.)
- Configures difficulty and topic
- Handles mode-specific settings

#### InterviewChat
- Location: [frontend/src/components/InterviewChat.tsx](../../frontend/src/components/InterviewChat.tsx)
- Displays questions and feedback
- Handles user answers
- Shows scores and progress

### API Integration
- Location: [frontend/src/services/api.ts](../../frontend/src/services/api.ts)
- Functions:
  - `startInterviewSession(config)` - Begin session
  - `submitAnswer(conversationId, answer)` - Submit response
  - `analyzeResume(resumeText)` - Resume review

## Development Workflow

### When Adding Interview Features

1. **Backend First**: Implement service logic in `interviewAgentService.ts`
2. **API Routes**: Add endpoints in `interview.ts`
3. **Frontend**: Create/update React components
4. **API Integration**: Update `frontend/src/services/api.ts`
5. **Testing**: Test end-to-end flow

### Code Style

- Use TypeScript strictly (no `any` types)
- Define interfaces for all data structures
- Add JSDoc comments to public methods
- Follow async/await patterns (no callbacks)
- Handle errors with try-catch and meaningful messages

### Testing Interview Features

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start

# Test at http://localhost:3000
# Select "Interview Prep" from home screen
```

## Modes Explained

### Interview
- Simulates real interviews
- Company & role specific
- Behavioral + technical questions
- Real-time feedback and scoring

### Exam
- Practice certification exams
- Multiple choice & open-ended questions
- Detailed explanations for answers
- Progress tracking

### Resume
- Resume content analysis
- ATS keyword optimization
- Formatting suggestions
- Specific rewrites for impact

### Behavioral
- STAR method coaching
- Leadership & teamwork questions
- Soft skills evaluation
- Storytelling improvement

### Technical
- Coding challenges
- System design problems
- Code review and optimization
- Trade-off discussions

## Score Calculation

- 0-50: Needs significant improvement
- 50-70: Good foundation, room for growth
- 70-85: Strong response with minor improvements
- 85-100: Excellent answer

## Best Practices

1. **Always provide constructive feedback**
   - Highlight what was good
   - Suggest specific improvements
   - Offer examples

2. **Make it engaging**
   - Use encouraging tone
   - Celebrate progress
   - Keep interviews realistic

3. **Track progress across sessions**
   - Store conversation history
   - Calculate improvement trends
   - Personalize recommendations

4. **Respect user time**
   - Set reasonable time limits
   - Allow skipping questions
   - Support quick practice sessions

## Common Issues & Solutions

### Issue: Long feedback text
**Solution**: Summarize key points in feedback field, full explanation in message

### Issue: Scoring inconsistency
**Solution**: Use scoring rubric and normalize scores 0-100

### Issue: Resume parsing
**Solution**: Accept plain text since users paste from various sources

### Issue: Real-time scoring
**Solution**: Calculate score after each answer, update UI immediately

## Resources

- [Interview Agent Service](../../backend/src/services/interviewAgentService.ts)
- [Interview API](../../backend/src/api/interview.ts)
- [Interview Components](../../frontend/src/components)
- [Agent Architecture](../../AGENT_ARCHITECTURE.md)

---

**Created for:** Career Development & Interview Prep
**Audience:** Developers implementing interview features  
**Maintained by:** AI Agent Team
