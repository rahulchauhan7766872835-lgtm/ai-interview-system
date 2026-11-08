import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Flame, 
  FileText, 
  Settings, 
  Play, 
  History 
} from 'lucide-react';
import { UserSettings } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'interview' | 'questions' | 'drills' | 'resume';
  setActiveTab: (tab: 'dashboard' | 'interview' | 'questions' | 'drills' | 'resume') => void;
  onOpenSetup: () => void;
  onOpenSettings: () => void;
  settings: UserSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSetup,
  onOpenSettings,
  settings
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                InterviewIQ
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
                AI Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">Smart Mock Prep & Evaluation</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'questions'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Question Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('drills')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'drills'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Flashcard Drills</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'resume'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume Matcher</span>
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-3">
          {/* AI Mode Indicator */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700/80 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${settings.apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
            <span>{settings.apiKey ? 'Gemini AI Active' : 'Offline Smart Evaluator'}</span>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Settings & API Key"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Start New Mock Interview Button */}
          <button
            onClick={onOpenSetup}
            className="px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Interview</span>
          </button>
        </div>

      </div>
    </header>
  );
};
