import React, { useState, useRef, useEffect } from 'react';
import { submitAnswer, startInterviewSession } from '../services/api';
import { InterviewSetupConfig } from './InterviewSetup';

interface InterviewMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback?: string;
  score?: number;
}

interface InterviewChatProps {
  config: InterviewSetupConfig;
  onBack: () => void;
}

export const InterviewChat: React.FC<InterviewChatProps> = ({ config, onBack }) => {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [hasNextQuestion, setHasNextQuestion] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize interview session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const response = await startInterviewSession(config);

        if (!response.success) {
          setError(response.error || 'Failed to start session');
          return;
        }

        setConversationId(response.conversationId);
        setMessages([
          {
            id: '0',
            role: 'assistant',
            content: response.message,
          },
        ]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to initialize session';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [config]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading || !conversationId) return;

    // Add user message
    const userMessage: InterviewMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await submitAnswer(conversationId, input);

      if (!response.success) {
        setError(response.error || 'Failed to process answer');
        return;
      }

      const assistantMessage: InterviewMessage = {
        id: Date.now().toString() + '1',
        role: 'assistant',
        content: response.message,
        feedback: response.feedback,
        score: response.score,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setScore(response.score || null);
      setCurrentQuestion(response.currentQuestion || currentQuestion + 1);
      setHasNextQuestion(response.nextQuestion !== false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to submit answer';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getModeLabel = (): string => {
    const labels: { [key in InterviewSetupConfig['mode']]: string } = {
      interview: 'Mock Interview',
      exam: 'Exam Preparation',
      resume: 'Resume Review',
      behavioral: 'Behavioral Interview',
      technical: 'Technical Problem Solving',
    };
    return labels[config.mode];
  };

  const getModeIcon = (): string => {
    const icons: { [key in InterviewSetupConfig['mode']]: string } = {
      interview: '💼',
      exam: '📋',
      resume: '📄',
      behavioral: '🤝',
      technical: '💻',
    };
    return icons[config.mode];
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Initializing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getModeIcon()} {getModeLabel()}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Question {currentQuestion} of {config.questionCount || '∞'}
              {score !== null && ` • Score: ${score}/100`}
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm font-semibold transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}

        {messages.map((message, index) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xl lg:max-w-2xl rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* Feedback Section */}
              {message.feedback && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                  <h4 className="font-semibold text-yellow-300">Feedback:</h4>
                  <p className="text-sm whitespace-pre-wrap">{message.feedback}</p>
                </div>
              )}

              {/* Score Display */}
              {message.score !== undefined && (
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-sm font-semibold">Score:</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        message.score >= 80
                          ? 'bg-green-500'
                          : message.score >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${message.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold">{message.score}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Session Complete Message */}
      {!hasNextQuestion && messages.length > 0 && (
        <div className="bg-green-900 border border-green-700 text-green-200 p-4 mx-6 rounded-lg mb-4 text-center">
          <p className="font-semibold">✅ Interview session complete!</p>
          <p className="text-sm mt-1">You can review your responses or start a new session.</p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-700 bg-gray-800 p-6">
        <form onSubmit={handleSubmitAnswer} className="space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              config.mode === 'resume'
                ? 'Provide feedback on your resume improvements...'
                : 'Type your answer here...'
            }
            disabled={isLoading || !hasNextQuestion}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows={3}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !hasNextQuestion}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            {isLoading ? 'Processing...' : hasNextQuestion ? 'Submit Answer' : 'Session Complete'}
          </button>

          {!hasNextQuestion && (
            <button
              type="button"
              onClick={onBack}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Start New Session
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default InterviewChat;
