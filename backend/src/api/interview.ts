import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  interviewAgentService,
  InterviewContext,
} from '../services/interviewAgentService';
import { Message } from '../db/Message';
import { Conversation } from '../db/Conversation';
import { AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /api/interview/start
 * Start a new interview session
 */
router.post('/start', async (req: AuthRequest, res: Response) => {
  try {
    const {
      mode,
      difficulty = 'intermediate',
      topic,
      company,
      role,
      resumeText,
      questionCount = 5,
    } = req.body;
    const userId = req.userId || 'demo-user';

    if (!mode || !['interview', 'exam', 'resume', 'behavioral', 'technical'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    const conversationId = uuidv4();

    const context: InterviewContext = {
      mode,
      difficulty,
      topic,
      company,
      role,
      resumeText,
      questionCount,
      currentQuestion: 1,
    };

    // Start session
    const response = await interviewAgentService.startSession(context);

    if (!response.success) {
      return res.status(500).json({ error: response.error });
    }

    // Save conversation
    const conversation = new Conversation({
      conversationId,
      userId,
      title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} - ${topic || role || 'Session'}`,
      context,
    });
    await conversation.save();

    // Save initial message
    const assistantMsg = new Message({
      conversationId,
      userId,
      role: 'assistant',
      content: response.content,
    });
    await assistantMsg.save();

    res.json({
      success: true,
      conversationId,
      message: response.content,
      mode: response.mode,
    });
  } catch (error) {
    console.error('Interview start error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to start interview',
    });
  }
});

/**
 * POST /api/interview/answer
 * Submit an answer and get feedback
 */
router.post('/answer', async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, answer } = req.body;
    const userId = req.userId || 'demo-user';

    if (!conversationId || !answer) {
      return res.status(400).json({ error: 'Conversation ID and answer are required' });
    }

    // Get conversation and context
    const conversation = await Conversation.findOne({ conversationId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const context = conversation.context as InterviewContext;

    // Get previous messages
    const previousMessages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    const history = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Save user answer
    const userMsg = new Message({
      conversationId,
      userId,
      role: 'user',
      content: answer,
    });
    await userMsg.save();

    // Get evaluation
    const evaluation = await interviewAgentService.evaluateAnswer(answer, context, history);

    if (!evaluation.success) {
      return res.status(500).json({ error: evaluation.error });
    }

    // Save assistant feedback
    const assistantMsg = new Message({
      conversationId,
      userId,
      role: 'assistant',
      content: evaluation.content,
    });
    await assistantMsg.save();

    // Increment question count
    if (context.currentQuestion) {
      context.currentQuestion++;
    }
    conversation.context = context;
    await conversation.save();

    res.json({
      success: true,
      conversationId,
      message: evaluation.content,
      feedback: evaluation.feedback,
      score: evaluation.score,
      nextQuestion: evaluation.nextQuestion,
      currentQuestion: context.currentQuestion,
      totalQuestions: context.questionCount,
    });
  } catch (error) {
    console.error('Interview answer error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to process answer',
    });
  }
});

/**
 * POST /api/interview/analyze-resume
 * Analyze and provide feedback on a resume
 */
router.post('/analyze-resume', async (req: AuthRequest, res: Response) => {
  try {
    const { resumeText } = req.body;
    const userId = req.userId || 'demo-user';

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const conversationId = uuidv4();

    // Analyze resume
    const analysis = await interviewAgentService.analyzeResume(resumeText);

    if (!analysis.success) {
      return res.status(500).json({ error: analysis.error });
    }

    // Save conversation
    const conversation = new Conversation({
      conversationId,
      userId,
      title: 'Resume Analysis',
      context: {
        mode: 'resume',
        difficulty: 'N/A',
      },
    });
    await conversation.save();

    // Save messages
    const userMsg = new Message({
      conversationId,
      userId,
      role: 'user',
      content: `Please analyze my resume:\n\n${resumeText}`,
    });
    await userMsg.save();

    const assistantMsg = new Message({
      conversationId,
      userId,
      role: 'assistant',
      content: analysis.content,
    });
    await assistantMsg.save();

    res.json({
      success: true,
      conversationId,
      analysis: analysis.content,
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to analyze resume',
    });
  }
});

/**
 * GET /api/interview/history/:conversationId
 * Get interview history and context
 */
router.get('/history/:conversationId', async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    const conversation = await Conversation.findOne({ conversationId });

    if (!messages.length) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      conversationId,
      title: conversation?.title,
      context: conversation?.context,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt,
      })),
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch history',
    });
  }
});

export default router;
