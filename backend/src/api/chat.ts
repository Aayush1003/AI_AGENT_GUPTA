import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { geminiService } from '../services/geminiService';
import { Message } from '../db/Message';
import { Conversation } from '../db/Conversation';
import { AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /api/chat
 * Send a message and get a response from the AI agent
 */
router.post('/chat', async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, message } = req.body;
    const userId = req.userId || 'demo-user';

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate conversationId if not provided
    const cid = conversationId || uuidv4();

    // Fetch previous messages
    const previousMessages = await Message.find({ conversationId: cid }).sort({
      createdAt: 1,
    });

    // Build message history for Gemini
    const history = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add current user message
    history.push({ role: 'user', content: message });

    // Save user message to DB
    const userMsg = new Message({
      conversationId: cid,
      userId,
      role: 'user',
      content: message,
    });
    await userMsg.save();

    // Get response from Gemini
    const geminiResponse = await geminiService.chat(history);

    if (!geminiResponse.success) {
      return res.status(500).json({ error: geminiResponse.error });
    }

    // Save assistant response to DB
    const assistantMsg = new Message({
      conversationId: cid,
      userId,
      role: 'assistant',
      content: geminiResponse.content,
    });
    await assistantMsg.save();

    // Update or create conversation
    let conversation = await Conversation.findOne({ conversationId: cid });
    if (!conversation) {
      conversation = new Conversation({
        conversationId: cid,
        userId,
        title: message.substring(0, 50).concat('...'),
        context: {},
      });
      await conversation.save();
    }

    res.json({
      conversationId: cid,
      message: geminiResponse.content,
      tokensUsed: geminiResponse.tokensUsed,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/chat/stream
 * Stream a message response from the AI agent
 */
router.post('/chat/stream', async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, message } = req.body;
    const userId = req.userId || 'demo-user';

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate conversationId if not provided
    const cid = conversationId || uuidv4();

    // Fetch previous messages
    const previousMessages = await Message.find({ conversationId: cid }).sort({
      createdAt: 1,
    });

    // Build message history for Gemini
    const history = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add current user message
    history.push({ role: 'user', content: message });

    // Save user message to DB
    const userMsg = new Message({
      conversationId: cid,
      userId,
      role: 'user',
      content: message,
    });
    await userMsg.save();

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    try {
      // Stream response from Gemini
      for await (const chunk of geminiService.streamChat(history)) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      // Save complete assistant response to DB
      const assistantMsg = new Message({
        conversationId: cid,
        userId,
        role: 'assistant',
        content: fullResponse,
      });
      await assistantMsg.save();

      // Update or create conversation
      let conversation = await Conversation.findOne({ conversationId: cid });
      if (!conversation) {
        conversation = new Conversation({
          conversationId: cid,
          userId,
          title: message.substring(0, 50).concat('...'),
          context: {},
        });
        await conversation.save();
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error('Stream error:', error);
      res.write(
        `data: ${JSON.stringify({ error: 'Streaming error' })}\n\n`
      );
      res.end();
    }
  } catch (error) {
    console.error('Chat stream error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/chat/history/:conversationId
 * Get conversation history
 */
router.get('/history/:conversationId', async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
