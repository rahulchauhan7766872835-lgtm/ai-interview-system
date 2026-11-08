import React, { useState, useEffect } from 'react';
import { 
  CareerTrack, 
  InterviewConfig, 
  OverallEvaluation, 
  Question, 
  QuestionEvaluation, 
  UserSettings 
} from './types';
import { StorageService, DEFAULT_SETTINGS } from './services/storageService';
import { aiEvaluator } from './services/aiEvaluator';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { InterviewRoom } from './components/InterviewRoom';
import { QuestionBankView } from './components/QuestionBankView';
import { FlashcardDrillView } from './components/FlashcardDrillView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { SetupModal } from './components/SetupModal';
import { EvaluationModal } from './components/EvaluationModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'interview' | 'questions' | 'drills' | 'resume'>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<OverallEvaluation[]>([]);

  // Modals state
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState<boolean>(false);

  // Active interview states
  const [activeConfig, setActiveConfig] = useState<InterviewConfig | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<OverallEvaluation | null>(null);
  const [initialSetupTrack, setInitialSetupTrack] = useState<CareerTrack>('frontend');

  // Load saved preferences & history on mount
  useEffect(() => {
    setSettings(StorageService.getSettings());
    setHistory(StorageService.getHistory());
  }, []);

  const handleStartInterview = (config: InterviewConfig) => {
    setActiveConfig(config);
    setActiveTab('interview');
  };

  const handleStartTrack = (track: CareerTrack) => {
    setInitialSetupTrack(track);
    setIsSetupOpen(true);
  };

  const handlePracticeQuestion = (question: Question) => {
    const config: InterviewConfig = {
      id: 'session-' + Date.now(),
      track: question.track,
      roleTitle: `${question.track.toUpperCase()} Practice`,
      level: question.level,
      format: 'mixed',
      persona: 'friendly-mentor',
      questionCount: 1,
      durationMinutes: 10,
      enableCamera: true,
      enableAudio: true,
      enableCodeEditor: true
    };
    handleStartInterview(config);
  };

  const handleFinishInterview = (evaluations: QuestionEvaluation[], questions: Question[]) => {
    if (!activeConfig) return;

    const finalEval = aiEvaluator.compileOverallEvaluation(
      activeConfig,
      questions,
      evaluations,
      settings.userName
    );

    setCurrentEvaluation(finalEval);
    StorageService.saveEvaluation(finalEval);
    setHistory(StorageService.getHistory());
    setIsEvaluationOpen(true);
    setActiveTab('dashboard');
  };

  const handleViewEvaluation = (evalItem: OverallEvaluation) => {
    setCurrentEvaluation(evalItem);
    setIsEvaluationOpen(true);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your past interview records?')) {
      StorageService.clearHistory();
      setHistory([]);
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        settings={settings}
      />

      {/* Main Tab Routing */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardView
            history={history}
            onStartTrack={handleStartTrack}
            onOpenSetup={() => setIsSetupOpen(true)}
            onViewEvaluation={handleViewEvaluation}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'interview' && activeConfig && (
          <InterviewRoom
            config={activeConfig}
            settings={settings}
            onFinishInterview={handleFinishInterview}
            onExit={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBankView
            onPracticeQuestion={handlePracticeQuestion}
          />
        )}

        {activeTab === 'drills' && (
          <FlashcardDrillView />
        )}

        {activeTab === 'resume' && (
          <ResumeAnalyzerView
            onStartCustomInterview={(partialConfig) => {
              const fullConfig: InterviewConfig = {
                id: 'session-' + Date.now(),
                track: partialConfig.track || 'fullstack',
                roleTitle: partialConfig.roleTitle || 'Custom Resume Mock',
                level: partialConfig.level || 'senior',
                format: 'mixed',
                persona: 'strict-bar-raiser',
                questionCount: 3,
                durationMinutes: 20,
                enableCamera: true,
                enableAudio: true,
                enableCodeEditor: true,
                resumeText: partialConfig.resumeText,
                jobDescription: partialConfig.jobDescription
              };
              handleStartInterview(fullConfig);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>InterviewIQ AI Pro</strong> • Advanced Mock Interview Preparation & Rubric Evaluation System
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Web Speech STT/TTS</span>
            <span>•</span>
            <span>FAANG Rubric Evaluator</span>
            <span>•</span>
            <span>Live Sandbox</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartInterview={handleStartInterview}
        initialTrack={initialSetupTrack}
      />

      <EvaluationModal
        evaluation={currentEvaluation}
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
        onRetake={() => {
          setIsEvaluationOpen(false);
          setIsSetupOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default App;
