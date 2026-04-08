import axios from 'axios';
import { InterviewSetupConfig } from '../components/InterviewSetup';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ChatMessage {
  conversationId: string;
  message: string;
}

export interface ChatHistory {
  _id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface InterviewSessionResponse {
  success: boolean;
  conversationId: string;
  message: string;
  mode: string;
  error?: string;
}

export interface InterviewAnswerResponse {
  success: boolean;
  conversationId: string;
  message: string;
  feedback?: string;
  score?: number;
  nextQuestion: boolean;
  currentQuestion?: number;
  totalQuestions?: number;
  error?: string;
}

/**
 * Send a chat message and get a response
 */
export const sendMessage = async (
  conversationId: string,
  message: string
): Promise<ChatMessage> => {
  const response = await apiClient.post('/api/demo/chat', {
    conversationId,
    message,
  });
  return response.data;
};

/**
 * Start an interview session
 */
export const startInterviewSession = async (
  config: InterviewSetupConfig
): Promise<InterviewSessionResponse> => {
  const response = await apiClient.post('/api/interview/start', config);
  return response.data;
};

/**
 * Submit an answer to an interview question
 */
export const submitAnswer = async (
  conversationId: string,
  answer: string
): Promise<InterviewAnswerResponse> => {
  const response = await apiClient.post('/api/interview/answer', {
    conversationId,
    answer,
  });
  return response.data;
};

/**
 * Analyze a resume
 */
export const analyzeResume = async (resumeText: string): Promise<InterviewSessionResponse> => {
  const response = await apiClient.post('/api/interview/analyze-resume', {
    resumeText,
  });
  return response.data;
};

/**
 * Get conversation history
 */
export const getHistory = async (conversationId: string): Promise<ChatHistory[]> => {
  const response = await apiClient.get(`/api/chat/history/${conversationId}`);
  return response.data;
};

/**
 * Stream a chat message
 */
export const streamMessage = (
  conversationId: string,
  message: string,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void
): (() => void) => {
  const eventSource = new EventSource(
    `${API_URL}/api/chat/stream?conversationId=${conversationId}&message=${encodeURIComponent(
      message
    )}`
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.chunk) {
        onChunk(data.chunk);
      }
      if (data.done) {
        eventSource.close();
      }
    } catch (error) {
      console.error('Parse error:', error);
    }
  };

  eventSource.onerror = () => {
    onError('Stream error');
    eventSource.close();
  };

  return () => eventSource.close();
};

export default apiClient;
