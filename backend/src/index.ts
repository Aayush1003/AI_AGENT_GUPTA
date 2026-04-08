import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connection';
import { authMiddleware, errorHandler, corsMiddleware } from './middleware/auth';
import chatRouter from './api/chat';
import interviewRouter from './api/interview';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(corsMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/interview', interviewRouter);

// Demo endpoint (no auth required)
app.post('/api/demo/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Import here to avoid circular dependency
    const { geminiService } = await import('./services/geminiService');

    const response = await geminiService.chat([
      { role: 'user', content: message },
    ]);

    if (!response.success) {
      return res.status(500).json({ error: response.error });
    }

    res.json({
      message: response.content,
    });
  } catch (error) {
    console.error('Demo chat error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB if URI is provided
    if (process.env.MONGODB_URI) {
      await connectDB(process.env.MONGODB_URI);
    } else {
      console.log(
        '⚠️  MONGODB_URI not provided. Running in demo mode (no persistence)'
      );
    }

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running at http://localhost:${PORT}`
      );
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`💬 Demo chat: POST http://localhost:${PORT}/api/demo/chat`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();

export default app;
