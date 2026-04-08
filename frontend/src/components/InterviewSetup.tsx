import React, { useState } from 'react';

export interface InterviewSetupConfig {
  mode: 'interview' | 'exam' | 'resume' | 'behavioral' | 'technical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
  company?: string;
  role?: string;
  resumeText?: string;
  questionCount?: number;
}

interface InterviewSetupProps {
  onStart: (config: InterviewSetupConfig) => void;
  isLoading?: boolean;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStart, isLoading = false }) => {
  const [mode, setMode] = useState<InterviewSetupConfig['mode']>('interview');
  const [difficulty, setDifficulty] = useState<InterviewSetupConfig['difficulty']>(
    'intermediate'
  );
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [topic, setTopic] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [questionCount, setQuestionCount] = useState(5);

  const modeDescriptions: { [key in InterviewSetupConfig['mode']]: string } = {
    interview: 'Get asked real interview questions with personalized feedback',
    exam: 'Practice for Microsoft certifications with exam-style questions',
    resume: 'Get actionable feedback to improve your resume',
    behavioral: 'Practice behavioral questions using the STAR method',
    technical: 'Solve technical problems with guided coaching',
  };

  const handleStart = () => {
    const config: InterviewSetupConfig = {
      mode,
      difficulty,
      ...(mode === 'interview' && { company, role }),
      ...(mode === 'exam' && { topic }),
      ...(mode === 'resume' && { resumeText }),
      ...(mode === 'behavioral' && { topic }),
      ...(mode === 'technical' && { topic }),
      questionCount,
    };
    onStart(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Interview & Exam Prep Agent</h1>
          <p className="text-gray-300">
            Prepare for interviews, exams, and career growth with AI coaching
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl space-y-6">
          {/* Mode Selector */}
          <div>
            <label className="block text-lg font-semibold mb-4">Select Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['interview', 'exam', 'resume', 'behavioral', 'technical'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    mode === m
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold capitalize">
                    {m === 'interview'
                      ? '💼 Mock Interview'
                      : m === 'exam'
                        ? '📋 Exam Prep'
                        : m === 'resume'
                          ? '📄 Resume Review'
                          : m === 'behavioral'
                            ? '🤝 Behavioral'
                            : '💻 Technical'}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{modeDescriptions[m]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-lg font-semibold mb-4">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-4">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-3 rounded-lg border-2 transition-all capitalize ${
                    difficulty === level
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Mode-Specific Fields */}
          {mode === 'interview' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Company (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google, Microsoft, Amazon"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'exam' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Exam Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Azure Fundamentals, AWS Solutions Architect"
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {mode === 'resume' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Paste Your Resume</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                rows={6}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {mode === 'behavioral' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Topic (Optional)</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Leadership, Conflict Resolution, Project Management"
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {mode === 'technical' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Problem Area (Optional)</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., System Design, Algorithms, Database Design"
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Question Count */}
          {mode !== 'resume' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={
              isLoading ||
              (mode === 'resume' && !resumeText) ||
              (mode === 'interview' && !role)
            }
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            {isLoading ? 'Starting Session...' : 'Start Interview Session'}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="font-bold mb-3">💡 Tips for Best Results</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>
              • Give detailed answers - the AI can provide better feedback with more context
            </li>
            <li>• Be honest about your experience level - we'll match the difficulty</li>
            <li>• Take your time thinking through responses - quality over speed</li>
            <li>
              • Resume review works best with current, well-formatted resumes in plain text
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
