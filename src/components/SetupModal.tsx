import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Layers, 
  UserCheck, 
  Clock, 
  HelpCircle, 
  Video, 
  Mic, 
  Code, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { 
  CareerTrack, 
  ExperienceLevel, 
  InterviewFormat, 
  InterviewerPersona, 
  InterviewConfig 
} from '../types';
import { CAREER_TRACKS, PERSONA_CONFIGS } from '../data/interviewTracks';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInterview: (config: InterviewConfig) => void;
  initialTrack?: CareerTrack;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  isOpen,
  onClose,
  onStartInterview,
  initialTrack = 'frontend'
}) => {
  const [track, setTrack] = useState<CareerTrack>(initialTrack);
  const [level, setLevel] = useState<ExperienceLevel>('mid');
  const [format, setFormat] = useState<InterviewFormat>('mixed');
  const [persona, setPersona] = useState<InterviewerPersona>('friendly-mentor');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [enableCamera, setEnableCamera] = useState<boolean>(true);
  const [enableAudio, setEnableAudio] = useState<boolean>(true);
  const [enableCodeEditor, setEnableCodeEditor] = useState<boolean>(true);
  const [customJobDesc, setCustomJobDesc] = useState<string>('');

  if (!isOpen) return null;

  const currentTrackMeta = CAREER_TRACKS.find(t => t.id === track) || CAREER_TRACKS[0];

  const handleLaunch = () => {
    const config: InterviewConfig = {
      id: 'session-' + Date.now(),
      track,
      roleTitle: currentTrackMeta.title,
      level,
      format,
      persona,
      questionCount,
      durationMinutes,
      enableCamera,
      enableAudio,
      enableCodeEditor,
      jobDescription: customJobDesc.trim() || undefined
    };

    onStartInterview(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configure Your AI Mock Interview</h2>
              <p className="text-xs text-slate-400">Select track, difficulty, and interviewer persona to begin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-x-0 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Track Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              1. Choose Career Domain / Track
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CAREER_TRACKS.map(t => {
                const isSelected = track === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTrack(t.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 block w-max mb-1.5">
                      {t.badge}
                    </span>
                    <p className="text-xs font-bold line-clamp-1 text-slate-100">{t.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience Level & Persona Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                2. Target Experience Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'entry', label: 'Junior / Entry', desc: 'Fundamentals & syntax' },
                  { id: 'mid', label: 'Mid-Level', desc: 'Standard production systems' },
                  { id: 'senior', label: 'Senior (L5)', desc: 'Architecture & trade-offs' },
                  { id: 'lead', label: 'Lead / Staff (L6+)', desc: 'Cross-org & scalability' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id as ExperienceLevel)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      level === lvl.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{lvl.label}</div>
                    <div className="text-[10px] text-slate-500">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interviewer Persona */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                3. AI Interviewer Persona
              </label>
              <div className="space-y-2">
                {(Object.entries(PERSONA_CONFIGS) as [InterviewerPersona, typeof PERSONA_CONFIGS[InterviewerPersona]][]).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPersona(key)}
                    className={`w-full p-2 rounded-lg border text-left flex items-center space-x-3 transition-all ${
                      persona === key
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${p.avatarBg} flex items-center justify-center text-white text-xs font-bold shadow`}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-200">{p.name} <span className="text-[10px] text-indigo-400">({p.title})</span></div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{p.style}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Session Length & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Question Count</span>
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500"
              >
                <option value={2}>2 Questions (Quick 10m drill)</option>
                <option value={3}>3 Questions (Standard 20m)</option>
                <option value={5}>5 Questions (Comprehensive 40m)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Allocated Time</span>
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500"
              >
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={25}>25 Minutes</option>
                <option value={45}>45 Minutes (Full simulation)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Simulation Tools</span>
              </label>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEnableCamera(prev => !prev)}
                  className={`px-2 py-1 rounded text-xs border flex items-center space-x-1 ${
                    enableCamera ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>Cam</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEnableAudio(prev => !prev)}
                  className={`px-2 py-1 rounded text-xs border flex items-center space-x-1 ${
                    enableAudio ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>Mic</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEnableCodeEditor(prev => !prev)}
                  className={`px-2 py-1 rounded text-xs border flex items-center space-x-1 ${
                    enableCodeEditor ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Code className="w-3 h-3" />
                  <span>Code</span>
                </button>
              </div>
            </div>
          </div>

          {/* Optional: Tailor to Specific Job Description */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Optional: Paste Target Job Description or Company</span>
            </label>
            <textarea
              value={customJobDesc}
              onChange={(e) => setCustomJobDesc(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer at Stripe or Google Cloud. Focus on large-scale payments UI, micro-frontends, high performance..."
              rows={2}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleLaunch}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white shadow-xl shadow-indigo-600/25 flex items-center space-x-2 transition-all hover:scale-[1.02]"
          >
            <span>Enter Interview Room</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
