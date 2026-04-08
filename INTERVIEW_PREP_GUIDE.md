# 🎯 Interview & Exam Prep Agent - Quick Start Guide

## Overview

The Interview & Exam Prep Agent is a comprehensive coaching system integrated into your AI Personal Productivity Agent. It provides:

- ✅ **Mock Interviews** - Real interview simulations with personalized feedback
- ✅ **Exam Preparation** - Microsoft certification and technical exam practice
- ✅ **Resume Review** - ATS optimization and career document enhancement
- ✅ **Behavioral Coaching** - STAR method training and soft skills development
- ✅ **Technical Problem Solving** - Coding challenges and system design practice

## Quick Start (2 minutes)

### 1. Start Your Backend
```bash
cd backend
npm install
echo "GEMINI_API_KEY=your_key_here" > .env
npm run dev
```

### 2. Start Your Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Open Browser
Navigate to **http://localhost:3000**

### 4. Select Interview Prep
Click the **🎯 Interview Prep** button on the home screen

## Features

### Interview Modes

#### 💼 Mock Interview
Perfect for job hunting interviews. You can:
- Specify company and role
- Choose difficulty level (beginner → advanced)
- Practice behavioral + technical questions
- Get scored feedback on each answer

**Example:**
```
Company: Google
Role: Senior Software Engineer
Difficulty: Advanced
Questions: 10
```

#### 📋 Exam & Certification Prep
Prepare for Microsoft certifications and technical exams:
- Multiple choice and open-ended questions
- Detailed explanations for correct/incorrect answers
- Progress tracking
- Weak area identification

**Supported Topics:**
- Azure Fundamentals / Developer / Solutions Architect
- AWS Solutions Architect / Developer
- Kubernetes
- System Design
- Data Structures & Algorithms

#### 📄 Resume Review
Get professional resume feedback:
- Content and structure analysis
- ATS keyword optimization
- Formatting suggestions
- Specific improvements with examples
- Impact metrics recommendations

**How to use:**
1. Select "Resume Review" mode
2. Paste your current resume
3. Get detailed analysis and rewrite suggestions

#### 🤝 Behavioral Interview Coaching
Master behavioral interviews with STAR method:
- Setup: Describe the situation
- Task: Your responsibility
- Action: What you did
- Result: Outcomes and metrics

**Practice Areas:**
- Leadership & decision-making
- Conflict resolution
- Problem-solving
- Teamwork & collaboration
- Handling failure & learning

#### 💻 Technical Problem Solving
Solve real coding and design challenges:
- Coding problems (algorithms, data structures)
- System design challenges
- Code review and optimization
- Trade-off discussions

**Difficulty Levels:**
- Beginner: Basic problems
- Intermediate: Leetcode Medium level
- Advanced: FAANG-level challenges

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   └── interviewAgentService.ts    # Core interview logic
│   ├── api/
│   │   └── interview.ts                # API endpoints
│   └── index.ts                        # Updated with interview routes

frontend/
├── src/
│   ├── components/
│   │   ├── InterviewSetup.tsx          # Mode selection UI
│   │   ├── InterviewChat.tsx           # Interview interface
│   │   └── ChatContainer.tsx           # Updated with navigation
│   ├── services/
│   │   └── api.ts                      # Updated with interview endpoints
│   └── App.tsx                         # Updated with mode routing

.github/
├── interview-coach.agent.md            # Interview agent definition
└── instructions/
    └── interview-prep.instructions.md  # Development guidelines
```

## API Endpoints

### Start Interview Session
```bash
POST /api/interview/start
Body: {
  mode: "interview" | "exam" | "resume" | "behavioral" | "technical",
  difficulty: "beginner" | "intermediate" | "advanced",
  topic?: string,
  company?: string,
  role?: string,
  resumeText?: string,
  questionCount?: number
}

Response: {
  success: true,
  conversationId: string,
  message: string,
  mode: string
}
```

### Submit Answer
```bash
POST /api/interview/answer
Body: {
  conversationId: string,
  answer: string
}

Response: {
  success: true,
  conversationId: string,
  message: string,
  feedback?: string,
  score?: number,
  nextQuestion: boolean,
  currentQuestion?: number,
  totalQuestions?: number
}
```

### Analyze Resume
```bash
POST /api/interview/analyze-resume
Body: {
  resumeText: string
}

Response: {
  success: true,
  conversationId: string,
  analysis: string
}
```

### Get History
```bash
GET /api/interview/history/:conversationId

Response: {
  conversationId: string,
  title: string,
  context: InterviewContext,
  messages: Array<{
    role: "user" | "assistant",
    content: string,
    timestamp: string
  }>
}
```

## Scoring System

| Score | Level | Interpretation |
|-------|-------|-----------------|
| 0-50 | Poor | Significant gaps, needs improvement |
| 50-70 | Fair | Good foundation, needs development |
| 70-85 | Good | Strong response with minor improvements |
| 85-100 | Excellent | Outstanding answer, ready for real interviews |

## Best Practices

### For Mock Interviews
1. **Be Detailed** - Give full context in your answers
2. **Use STAR** for behavioral questions
3. **Practice Multiple Times** - Don't just do one interview
4. **Review Feedback** - Study each critique carefully
5. **Apply Lessons** - Try better answers in next session

### For Exam Prep
1. **Start with Beginner** - Build foundation first
2. **Review Wrong Answers** - Understand why you were wrong
3. **Track Progress** - Monitor improvement over time
4. **Study Resources** - Use explanations for deeper learning
5. **Do Timed Practice** - Simulate exam conditions

### For Resume Review
1. **Use Current Resume** - Analyze your actual document
2. **Implement Changes** - Apply suggestions immediately
3. **Get Second Opinion** - Run through review multiple times
4. **Track Keywords** - Focus on ATS optimization
5. **Quantify Impact** - Add metrics to achievements

### For Behavioral Coaching
1. **Practice STAR** - Get comfortable with the structure
2. **Be Authentic** - Tell real stories from your experience
3. **Show Growth** - Demonstrate learning from mistakes
4. **Ask Questions** - Inquire about team and role
5. **Follow Up** - Practice interview close

### For Technical Solving
1. **Think Out Loud** - Explain your approach verbally
2. **Consider Edge Cases** - Don't miss boundary conditions
3. **Discuss Trade-offs** - Show system thinking
4. **Test Your Code** - Walk through examples
5. **Optimize** - Never stop at first solution

## Troubleshooting

### Session Not Starting
- Check your Gemini API key is set correctly
- Verify backend is running: `http://localhost:5000/health`
- Check browser console for errors

### API Connection Issues
- Ensure frontend and backend are running on correct ports
- Check CORS settings in backend
- Verify network connectivity

### Resume Analysis Not Working
- Paste plain text resume (not PDF/Word)
- Ensure resume has actual content
- Try shorter format first

### Scoring Issues
- Scores are calculated from feedback
- More detailed feedback = more accurate scoring
- Scores improve with better answers

## Command Reference

### Backend Commands
```bash
cd backend

# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Check types
npm run type-check
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Development mode
npm start

# Build for production
npm run build
```

## Next Steps

1. **Complete Your First Interview** - Try a mock interview in your target role
2. **Get Resume Analyzed** - Improve your career document
3. **Practice Behavioral Questions** - Get comfortable with STAR
4. **Tackle Technical Problems** - Build problem-solving skills
5. **Review Your Progress** - Check your conversation history

## Advanced Usage

### Custom Interview Config
```typescript
const config: InterviewSetupConfig = {
  mode: 'interview',
  difficulty: 'advanced',
  company: 'Your Target Company',
  role: 'Your Target Role',
  questionCount: 15
};

const response = await startInterviewSession(config);
```

### Track Your Progress
- Each session is saved in your conversation history
- Review past sessions to track improvement
- Identify patterns in your strengths/weaknesses
- Use data to focus practice areas

## Support

For issues or questions:
1. Check the [AGENT_ARCHITECTURE.md](../AGENT_ARCHITECTURE.md)
2. Review [Interview Instructions](.github/instructions/interview-prep.instructions.md)
3. Check your backend logs for errors
4. Verify API responses in browser DevTools

## Tips for Success

🎯 **Set Clear Goals** - Know what role/exam you're preparing for
📊 **Track Metrics** - Monitor your scores and feedback
🔄 **Practice Consistently** - Regular practice beats cramming
💭 **Reflect on Feedback** - Understand why you scored what you did
🎓 **Keep Learning** - Each session teaches something new

---

**Ready to level up your career? Start an interview session now!**

For more details, see:
- [Complete Architecture](../AGENT_ARCHITECTURE.md)
- [Development Instructions](.github/instructions/interview-prep.instructions.md)
- [Interview Agent Definition](.github/interview-coach.agent.md)
