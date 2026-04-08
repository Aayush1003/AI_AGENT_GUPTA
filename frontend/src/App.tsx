import React, { useState } from 'react';
import ChatContainer from './components/ChatContainer';
import InterviewSetup from './components/InterviewSetup';
import InterviewChat from './components/InterviewChat';
import { InterviewSetupConfig } from './components/InterviewSetup';

type AppMode = 'home' | 'chat' | 'interview-setup' | 'interview-chat';

export const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('home');
  const [interviewConfig, setInterviewConfig] = useState<InterviewSetupConfig | null>(null);

  const handleStartInterview = (config: InterviewSetupConfig) => {
    setInterviewConfig(config);
    setMode('interview-chat');
  };

  const handleBackToHome = () => {
    setMode('home');
    setInterviewConfig(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {mode === 'home' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 px-4">
            <h1 className="text-5xl font-bold text-white mb-4">AI Personal Agent</h1>
            <p className="text-xl text-gray-300 mb-8">
              Supercharge your productivity and career growth
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Regular Chat */}
              <button
                onClick={() => setMode('chat')}
                className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-3">💬</div>
                <h2 className="text-2xl font-bold mb-2">Chat with AI</h2>
                <p className="text-blue-100">
                  Talk to your personal productivity agent for any task
                </p>
              </button>

              {/* Interview Prep */}
              <button
                onClick={() => setMode('interview-setup')}
                className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-3">🎯</div>
                <h2 className="text-2xl font-bold mb-2">Interview Prep</h2>
                <p className="text-purple-100">
                  Get AI coaching for interviews, exams & resume review
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'chat' && <ChatContainer onBack={handleBackToHome} />}

      {mode === 'interview-setup' && (
        <InterviewSetup onStart={handleStartInterview} />
      )}

      {mode === 'interview-chat' && interviewConfig && (
        <InterviewChat config={interviewConfig} onBack={handleBackToHome} />
      )}
    </div>
  );
};

export default App;
