import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface InterviewContext {
  mode: 'interview' | 'exam' | 'resume' | 'behavioral' | 'technical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
  company?: string;
  role?: string;
  resumeText?: string;
  questionCount?: number;
  currentQuestion?: number;
}

export interface InterviewResponse {
  success: boolean;
  content?: string;
  feedback?: string;
  score?: number;
  nextQuestion?: boolean;
  mode: string;
  error?: string;
}

export class InterviewAgentService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  /**
   * Generate system prompt based on interview context
   */
  getSystemPrompt(context: InterviewContext): string {
    const base = `You are an expert interview coach and exam preparation specialist. You are helping someone prepare for technical interviews and Microsoft certifications.`;

    const prompts: { [key in InterviewContext['mode']]: string } = {
      interview: `${base}
Your role is to:
1. Ask relevant interview questions for the ${context.role || 'Software Engineer'} role at ${context.company || 'a tech company'}
2. Evaluate answers fairly and constructively
3. Provide specific feedback on what was good and what could be improved
4. Suggest follow-up questions to dig deeper
5. Rate responses on clarity, completeness, and technical accuracy

Keep questions at ${context.difficulty} level. Be supportive but honest about gaps.`,

      exam: `${base}
Your role is to help prepare for Microsoft certifications or technical exams:
1. Generate multiple-choice and open-ended questions
2. Include realistic scenarios from exams
3. Provide detailed explanations for correct/incorrect answers
4. Track progress and highlight weak areas
5. Simulate exam conditions with time pressure awareness

Difficulty: ${context.difficulty}
Topic: ${context.topic || 'General'}`,

      resume: `${base}
Your role is to optimize the user's resume:
1. Review their provided resume for content
2. Suggest improvements to keywords, formatting, and structure
3. Highlight accomplishments that stand out
4. Point out gaps or areas needing clarification
5. Provide version suggestions with explanations

Focus on ATS optimization, clarity, and impact.`,

      behavioral: `${base}
Your role is to conduct behavioral interview coaching:
1. Ask behavioral questions using STAR method (Situation, Task, Action, Result)
2. Evaluate responses for leadership, problem-solving, and collaboration signals
3. Identify red flags or missing details
4. Suggest more compelling ways to tell the story
5. Practice handling difficult situations

Topics: ${context.topic || 'General'}`,

      technical: `${base}
Your role is to coach on technical problem-solving:
1. Present coding challenges or system design problems
2. Guide through problem-solving approach without giving answers
3. Review code quality, efficiency, and edge case handling
4. Suggest optimizations and better approaches
5. Discuss trade-offs and design decisions

Difficulty: ${context.difficulty}`,
    };

    return prompts[context.mode];
  }

  /**
   * Start interview prep session
   */
  async startSession(context: InterviewContext): Promise<InterviewResponse> {
    try {
      const systemPrompt = this.getSystemPrompt(context);
      const modeLabel = this.getModeLabel(context.mode);

      let initialQuestion = '';

      if (context.mode === 'resume' && context.resumeText) {
        initialQuestion = `I'm helping you improve your resume. Here's what you've provided:\n\n${context.resumeText}\n\nAfter reviewing this, here are my initial thoughts and recommendations:`;
      } else if (context.mode === 'interview') {
        initialQuestion = `Great! I'm going to conduct a mock interview for a ${context.role || 'Software Engineer'} role${
          context.company ? ` at ${context.company}` : ''
        }. Let me start with my first question:\n\nCould you tell me about a challenging project you've worked on and how you overcame the obstacles?`;
      } else if (context.mode === 'exam') {
        initialQuestion = `Perfect! Let's start your ${modeLabel} prep session on ${context.topic || 'General topics'}. I'll give you 5 questions to start.\n\nQuestion 1 of 5:`;
      } else if (context.mode === 'behavioral') {
        initialQuestion = `Let's practice behavioral interview questions. These help me understand your approach to challenges and teamwork.\n\nHere's my first question:`;
      } else if (context.mode === 'technical') {
        initialQuestion = `Let's start with a technical problem. This is ${context.difficulty} level.\n\nProblem:`;
      }

      const response = await this.chat([
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: 'Start the session',
        },
      ]);

      if (!response.success) {
        return response;
      }

      return {
        success: true,
        content: initialQuestion + '\n\n' + response.content,
        mode: context.mode,
        nextQuestion: true,
      };
    } catch (error) {
      console.error('Interview session start error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start session',
        mode: context.mode,
      };
    }
  }

  /**
   * Process user answer and provide feedback
   */
  async evaluateAnswer(
    userAnswer: string,
    context: InterviewContext,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<InterviewResponse> {
    try {
      const systemPrompt = this.getSystemPrompt(context);

      const evaluationPrompt =
        context.mode === 'exam'
          ? `The user provided this answer: "${userAnswer}"\n\nPlease: 1) Rate if it's correct/incorrect, 2) Explain why, 3) Ask the next question if available, 4) Give a score 0-100.`
          : context.mode === 'resume'
            ? `Analyzing the user's input about their resume. Provide constructive feedback.`
            : `The user provided this answer: "${userAnswer}"\n\nPlease provide detailed feedback: 1) What was good, 2) What could improve, 3) What follow-up questions do you have.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...conversationHistory,
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ];

      const response = await this.chat(messages);

      if (!response.success) {
        return response;
      }

      return {
        success: true,
        content: response.content,
        feedback: response.content ? this.extractFeedback(response.content) : undefined,
        score: response.content ? this.extractScore(response.content) : undefined,
        mode: context.mode,
        nextQuestion: context.questionCount
          ? (context.currentQuestion || 1) < context.questionCount
          : true,
      };
    } catch (error) {
      console.error('Answer evaluation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to evaluate answer',
        mode: context.mode,
      };
    }
  }

  /**
   * Send a message in the interview session
   */
  async chat(messages: Array<{ role: string; content: string }>): Promise<InterviewResponse> {
    try {
      const userMessages = messages.filter((msg) => msg.role !== 'system');
      
      const historyMessages = userMessages.slice(0, -1).map((msg) => ({
        role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: msg.content }],
      }));

      const chat = this.model.startChat({
        history: historyMessages,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      });

      const userMessage = userMessages[userMessages.length - 1]?.content;
      if (!userMessage) {
        throw new Error('No user message provided');
      }

      const response = await chat.sendMessage(userMessage);
      const responseText = response.response.text();

      return {
        success: true,
        content: responseText,
        mode: 'interview',
      };
    } catch (error) {
      console.error('Gemini Chat error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        mode: 'interview',
      };
    }
  }

  /**
   * Get resume analysis
   */
  async analyzeResume(resumeText: string): Promise<InterviewResponse> {
    try {
      const systemPrompt = `You are an expert career coach and resume reviewer. Analyze this resume and provide:
1. Strengths (what stands out)
2. Areas for improvement
3. ATS optimization suggestions
4. Keyword recommendations
5. Specific rewrite suggestions for 2-3 bullet points`;

      const response = await this.chat([
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Please analyze this resume:\n\n${resumeText}`,
        },
      ]);

      return {
        success: response.success,
        content: response.content,
        mode: 'resume',
        error: response.error,
      };
    } catch (error) {
      console.error('Resume analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze resume',
        mode: 'resume',
      };
    }
  }

  /**
   * Extract feedback from response text
   */
  private extractFeedback(text: string): string {
    // Simple heuristic: look for feedback keywords
    const feedbackPatterns = ['Feedback:', 'Good:', 'Could improve:', 'Suggestion:'];
    for (const pattern of feedbackPatterns) {
      if (text.includes(pattern)) {
        return text.substring(text.indexOf(pattern));
      }
    }
    return text;
  }

  /**
   * Extract score from response text
   */
  private extractScore(text: string): number {
    const scoreMatch = text.match(/(\d+)(?:\s*\/\s*100|%)/i);
    if (scoreMatch) {
      return parseInt(scoreMatch[1], 10);
    }
    // Default scoring based on keywords
    if (text.toLowerCase().includes('excellent')) return 90;
    if (text.toLowerCase().includes('very good')) return 80;
    if (text.toLowerCase().includes('good')) return 75;
    if (text.toLowerCase().includes('needs improvement')) return 50;
    return 70;
  }

  /**
   * Get human-readable mode label
   */
  private getModeLabel(mode: InterviewContext['mode']): string {
    const labels: { [key in InterviewContext['mode']]: string } = {
      interview: 'Mock Interview',
      exam: 'Exam Preparation',
      resume: 'Resume Review',
      behavioral: 'Behavioral Interview',
      technical: 'Technical Problem Solving',
    };
    return labels[mode];
  }
}

export const interviewAgentService = new InterviewAgentService();
