# 🧪 Interview Agent - Testing & Verification Guide

## Pre-Flight Checklist

### Backend Setup
- [ ] Node.js v14+ installed
- [ ] MongoDB connection working
- [ ] Gemini API key configured in `.env`
- [ ] Backend dependencies installed: `npm install`
- [ ] No TypeScript errors: `npm run type-check`

### Frontend Setup
- [ ] React dependencies installed: `npm install`
- [ ] Frontend can build: `npm run build`
- [ ] Development server runs: `npm start`

## Manual Testing Steps

### 1. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected: ✅ Server runs on http://localhost:5000
Check: `curl http://localhost:5000/health`
Expected Response: `{"status":"ok","timestamp":"..."}`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Expected: ✅ Browser opens to http://localhost:3000

### 2. Test Home Screen
1. Open http://localhost:3000
2. You should see home screen with two buttons:
   - 💬 Chat with AI
   - 🎯 Interview Prep
3. ✅ Both buttons are clickable

### 3. Test Interview Setup
1. Click "🎯 Interview Prep" button
2. Should see interview mode selector with 5 options:
   - 💼 Mock Interview
   - 📋 Exam Prep
   - 📄 Resume Review
   - 🤝 Behavioral
   - 💻 Technical

### 4. Test Mock Interview Mode
1. Click "💼 Mock Interview"
2. Fill in:
   - Company: "Google" (optional)
   - Role: "Software Engineer"
   - Difficulty: "Intermediate"
   - Questions: 5
3. Click "Start Interview Session"

**Expected Results:**
- Loading spinner appears
- Interview starts with first question
- Question displays clearly
- Input area ready for answer
- Back button visible in header

### 5. Test Answer Submission
1. Type a detailed answer
2. Click "Submit Answer"

**Expected Results:**
- Message sent to backend
- Loading spinner shown
- Feedback displayed with:
  - Your answer
  - Assistant feedback
  - Score (0-100)
  - Progress counter
- Next question ready or "Session Complete" message

### 6. Test Exam Mode
1. Go back and select "📋 Exam Prep"
2. Fill in:
   - Topic: "Azure Fundamentals"
   - Difficulty: "Beginner"
   - Questions: 3
3. Click "Start Interview Session"

**Expected Results:**
- Exam questions display
- Multiple-choice or open-ended format
- Scoring visible after each answer

### 7. Test Resume Mode
1. Go back and select "📄 Resume Review"
2. Paste a resume (plain text)
3. Click "Start Interview Session"

**Expected Results:**
- Resume analysis displays
- Feedback includes:
  - Strengths
  - Areas for improvement
  - ATS suggestions
  - Specific rewrites

### 8. Test Behavioral Mode
1. Go back and select "🤝 Behavioral"
2. Fill in:
   - Topic: "Leadership" (optional)
   - Difficulty: "Intermediate"
   - Questions: 5
3. Click "Start Interview Session"

**Expected Results:**
- Behavioral questions using STAR format
- Feedback on storytelling quality
- Suggestions for improvement

### 9. Test Technical Mode
1. Go back and select "💻 Technical"
2. Fill in:
   - Topic: "System Design"
   - Difficulty: "Advanced"
   - Questions: 3
3. Click "Start Interview Session"

**Expected Results:**
- Technical problems displayed
- Guided problem-solving feedback
- Code review (if applicable)

### 10. Test Navigation
1. During any interview, click "← Back" button
2. Should return to home screen
3. New interview/chat starts fresh

## API Testing

### Test /api/interview/start
```bash
curl -X POST http://localhost:5000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "interview",
    "difficulty": "intermediate",
    "company": "Google",
    "role": "Software Engineer",
    "questionCount": 5
  }'
```

Expected Response:
```json
{
  "success": true,
  "conversationId": "uuid...",
  "message": "interview question...",
  "mode": "interview"
}
```

### Test /api/interview/answer
```bash
curl -X POST http://localhost:5000/api/interview/answer \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "uuid...",
    "answer": "I handled a difficult project by..."
  }'
```

Expected Response:
```json
{
  "success": true,
  "conversationId": "uuid...",
  "message": "feedback...",
  "feedback": "...",
  "score": 75,
  "nextQuestion": true,
  "currentQuestion": 2,
  "totalQuestions": 5
}
```

### Test /api/interview/analyze-resume
```bash
curl -X POST http://localhost:5000/api/interview/analyze-resume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Your resume content here..."
  }'
```

Expected Response:
```json
{
  "success": true,
  "conversationId": "uuid...",
  "analysis": "Resume analysis and suggestions..."
}
```

## Error Scenarios

### Scenario 1: Missing Gemini Key
**Setup:** Remove or clear GEMINI_API_KEY from .env
**Expected:** Backend logs error, but continues running
**Test:** Try to start interview → Should get clear error message

### Scenario 2: Backend Down
**Setup:** Kill backend process
**Expected:** Frontend shows connection error
**Test:** Try to start interview → Should show error

### Scenario 3: Invalid Mode
**Setup:** Send API request with invalid mode
**Expected:** 400 Bad Request response
**Test:**
```bash
curl -X POST http://localhost:5000/api/interview/start \
  -d '{"mode": "invalid"}' \
  -H "Content-Type: application/json"
```

### Scenario 4: Missing Required Field
**Setup:** Start interview without role (for interview mode)
**Expected:** Frontend validation prevents submission
**Test:** Try to click start without filling required fields

### Scenario 5: Empty Resume
**Setup:** Submit empty resume text
**Expected:** Frontend validation prevents submission
**Test:** Try to start resume review with empty text

## Performance Testing

### Load Test Backend
```bash
# Simple load test
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/interview/start \
    -H "Content-Type: application/json" \
    -d '{
      "mode": "exam",
      "difficulty": "beginner",
      "questionCount": 3
    }' &
done
wait
```

Expected: All requests complete successfully

### Memory Check
- Watch backend console for memory leaks
- Monitor process memory: `top` or Task Manager
- Run 20+ interviews and check if memory grows excessively

## Browser DevTools Testing

### Network Tab
1. Start an interview
2. Watch Network tab
3. Verify requests:
   - POST /api/interview/start → 200
   - POST /api/interview/answer → 200
   - All responses have proper structure

### Console Tab
1. Should see no critical errors
2. May see warnings (OK)
3. Check for TypeScript type errors

### React DevTools
1. Verify component hierarchy
2. App → InterviewChat → InterviewMessage components
3. Check state updates are clean

## Data Persistence

### Verify Conversation History
1. Complete an interview session
2. Check database (MongoDB):
```bash
db.conversations.findOne({mode: "interview"})
db.messages.find({role: "user"})
```

Expected: All messages and context saved

### Verify Resume Analysis Saved
1. Do a resume review
2. Check MongoDB:
```bash
db.conversations.findOne({title: "Resume Analysis"})
```

Expected: Resume text and analysis saved

## Cross-Browser Testing

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

Expected: Functionality works on all browsers

## Mobile Testing

Test on:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design works

Expected: 
- Text areas readable
- Buttons clickable
- No layout breaks

## Accessibility Testing

- [ ] Tab navigation works
- [ ] Screen reader friendly (if available)
- [ ] Color contrast sufficient
- [ ] Font sizes readable

## Regression Testing Checklist

After ANY changes, verify:

- [ ] Home screen shows both buttons
- [ ] Chat mode still works
- [ ] Interview modes load correctly
- [ ] Answers submit and get feedback
- [ ] Scores display properly
- [ ] Navigation between modes works
- [ ] No console errors
- [ ] Backend is responsive
- [ ] Database saves data
- [ ] API responses are consistent

## Success Criteria

✅ **All tests pass if:**
1. All UI interactions work smoothly
2. API calls return valid JSON responses
3. Scores display 0-100 range
4. Feedback is meaningful and specific
5. No console errors
6. Database saves all data
7. Navigation is smooth between modes
8. Performance is acceptable (<2s per API call)
9. Error handling is graceful
10. Mobile responsive and accessible

## Debugging Tips

### Backend Issues
```bash
# Check TypeScript
cd backend
npm run type-check

# Check logs
tail -f backend.log

# Debug Gemini
GEMINI_DEBUG=true npm run dev
```

### Frontend Issues
```bash
# Check component render
console.log('Rendering:', mode)

# Check API response
console.log('API Response:', response)

# Check state
console.log('State:', messages, isLoading)
```

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Cannot find module" | Run `npm install` in affected directory |
| "API not found" | Verify routes in backend/src/index.ts |
| "CORS error" | Check CORS middleware in index.ts |
| "Blank response" | Check Gemini API key and logs |
| "Interview won't start" | Check browser console and backend logs |
| "Feedback not showing" | Check API response structure in DevTools |

---

## Testing Checklist

```
Backend Setup
☐ Dependencies installed
☐ Type checking passes
☐ Server runs on 5000
☐ Health check works

Frontend Setup
☐ Dependencies installed
☐ Development server starts
☐ No build errors

Feature Testing
☐ Home screen displays
☐ Chat mode works
☐ Mock interview starts
☐ Exam prep starts
☐ Resume review starts
☐ Behavioral mode works
☐ Technical mode works
☐ Answers submit properly
☐ Feedback displays
☐ Scores show correctly
☐ Navigation works

API Testing
☐ /start endpoint works
☐ /answer endpoint works
☐ /analyze-resume works
☐ /history works

Data Testing
☐ Conversations saved
☐ Messages saved
☐ Context preserved
☐ History retrievable

Error Testing
☐ Invalid inputs handled
☐ Network errors handled
☐ Missing fields caught
☐ Error messages helpful

Performance
☐ <2s response time
☐ No memory leaks
☐ Smooth animations
☐ Responsive UI
```

---

**Testing Status:** Ready for QA
**Last Updated:** 2026-04-08
**Test Environment:** Local development

Run tests frequently throughout development!
