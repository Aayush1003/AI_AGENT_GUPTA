import axios, { AxiosError, AxiosResponse } from 'axios';
import { InterviewSetupConfig } from '../components/InterviewSetup';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Request abort controller for cancellation
const requestControllers = new Map<string, AbortController>();

// Simple in-memory cache
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(
    public statusCode: number | undefined,
    public response: any,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Clear expired cache entries
 */
const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      responseCache.delete(key);
    }
  }
};

/**
 * Retry logic with exponential backoff
 */
const retryRequest = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0 || !shouldRetry(error)) {
      throw error;
    }
    const delay = RETRY_DELAY * (MAX_RETRIES - retries + 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1);
  }
};

/**
 * Determine if request should be retried
 */
const shouldRetry = (error: any): boolean => {
  const statusCode = error.response?.status;
  // Retry on network errors or 5xx errors, not 4xx (except 429)
  return (
    !error.response ||
    statusCode >= 500 ||
    statusCode === 429 ||
    error.code === 'ECONNABORTED'
  );
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: REQUEST_TIMEOUT,
});

/**
 * Request interceptor - add auth, logging
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handle errors, refresh tokens
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export interface RequestConfig {
  useCache?: boolean;
  timeout?: number;
  retries?: number;
}

/**
 * Send a chat message and get a response
 */
export const sendMessage = async (
  conversationId: string,
  message: string,
  config?: RequestConfig
): Promise<ChatMessage> => {
  return retryRequest(async () => {
    const response = await apiClient.post(
      '/api/demo/chat',
      { conversationId, message },
      { timeout: config?.timeout }
    );
    return response.data;
  }, config?.retries);
};

/**
 * Start an interview session
 */
export const startInterviewSession = async (
  config: InterviewSetupConfig,
  requestConfig?: RequestConfig
): Promise<InterviewSessionResponse> => {
  return retryRequest(async () => {
    const response = await apiClient.post('/api/interview/start', config, {
      timeout: requestConfig?.timeout,
    });
    return response.data;
  }, requestConfig?.retries);
};

/**
 * Submit an answer to an interview question
 */
export const submitAnswer = async (
  conversationId: string,
  answer: string,
  config?: RequestConfig
): Promise<InterviewAnswerResponse> => {
  return retryRequest(async () => {
    const response = await apiClient.post(
      '/api/interview/answer',
      { conversationId, answer },
      { timeout: config?.timeout }
    );
    return response.data;
  }, config?.retries);
};

/**
 * Analyze a resume
 */
export const analyzeResume = async (
  resumeText: string,
  config?: RequestConfig
): Promise<InterviewSessionResponse> => {
  return retryRequest(async () => {
    const response = await apiClient.post(
      '/api/interview/analyze-resume',
      { resumeText },
      { timeout: config?.timeout }
    );
    return response.data;
  }, config?.retries);
};

/**
 * Get conversation history with caching
 */
export const getHistory = async (
  conversationId: string,
  config?: RequestConfig
): Promise<ChatHistory[]> => {
  const cacheKey = `history_${conversationId}`;
  
  // Check cache if enabled
  if (config?.useCache !== false) {
    clearExpiredCache();
    const cached = responseCache.get(cacheKey);
    if (cached) {
      return cached.data;
    }
  }

  return retryRequest(async () => {
    const response = await apiClient.get(`/api/chat/history/${conversationId}`, {
      timeout: config?.timeout,
    });
    
    // Store in cache
    responseCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });
    
    return response.data;
  }, config?.retries);
};

/**
 * Cancel a specific ongoing request
 */
export const cancelRequest = (requestKey: string): void => {
  const controller = requestControllers.get(requestKey);
  if (controller) {
    controller.abort();
    requestControllers.delete(requestKey);
  }
};

/**
 * Cancel all ongoing requests
 */
export const cancelAllRequests = (): void => {
  requestControllers.forEach((controller) => controller.abort());
  requestControllers.clear();
};

/**
 * Stream a chat message with improved error handling and cancellation
 */
export const streamMessage = (
  conversationId: string,
  message: string,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onComplete?: () => void,
  requestKey?: string
): (() => void) => {
  const key = requestKey || `stream_${conversationId}_${Date.now()}`;
  
  try {
    const eventSource = new EventSource(
      `${API_URL}/api/chat/stream?conversationId=${encodeURIComponent(
        conversationId
      )}&message=${encodeURIComponent(message)}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.chunk) {
          onChunk(data.chunk);
        }
        if (data.done) {
          eventSource.close();
          requestControllers.delete(key);
          onComplete?.();
        }
      } catch (error) {
        console.error('Parse error:', error);
        onError('Failed to parse stream response');
      }
    };

    eventSource.onerror = (error) => {
      console.error('Stream error:', error);
      onError('Stream connection failed');
      eventSource.close();
      requestControllers.delete(key);
    };

    // Store reference for potential cancellation
    const fakeController = {
      abort: () => eventSource.close(),
    };
    requestControllers.set(key, fakeController as any);

    return () => {
      eventSource.close();
      requestControllers.delete(key);
    };
  } catch (error) {
    onError('Failed to establish stream connection');
    return () => {};
  }
};

/**
 * Utility: Get current request count
 */
export const getActiveRequestCount = (): number => {
  return requestControllers.size;
};

/**
 * Utility: Get cache stats
 */
export const getCacheStats = (): { size: number; entries: string[] } => {
  return {
    size: responseCache.size,
    entries: Array.from(responseCache.keys()),
  };
};

/**
 * Utility: Clear all cache
 */
export const clearCache = (): void => {
  responseCache.clear();
};

/**
 * Utility: Set cache entry manually
 */
export const setCacheEntry = (key: string, data: any): void => {
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Utility: Get cache entry if exists and not expired
 */
export const getCacheEntry = (key: string): any | null => {
  clearExpiredCache();
  const entry = responseCache.get(key);
  if (entry && Date.now() - entry.timestamp <= CACHE_DURATION) {
    return entry.data;
  }
  responseCache.delete(key);
  return null;
}

export default apiClient;
