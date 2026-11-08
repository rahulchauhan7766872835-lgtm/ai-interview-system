import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Volume2, 
  User, 
  Sparkles, 
  Check, 
  Info,
  ShieldCheck 
} from 'lucide-react';
import { UserSettings } from '../types';
import { speechService } from '../services/speechService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [form, setForm] = useState<UserSettings>(settings);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setForm(settings);
    const voices = speechService.getVoices();
    setAvailableVoices(voices);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center space-x-2.5">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">System & AI Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Candidate Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Candidate Name</span>
            </label>
            <input
              type="text"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Alex Johnson"
            />
          </div>

          {/* AI Provider Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Evaluation Engine</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, aiProvider: 'local' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  form.aiProvider === 'local'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold">Offline Smart Engine</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Works 100% offline with zero setup</div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, aiProvider: 'gemini' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  form.aiProvider === 'gemini'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold flex items-center space-x-1">
                  <span>Gemini LLM API</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Live neural LLM evaluations</div>
              </button>
            </div>

            {form.aiProvider === 'gemini' && (
              <div className="space-y-1.5 pt-2 animate-in fade-in duration-150">
                <label className="text-slate-400">Gemini API Key (optional):</label>
                <input
                  type="password"
                  value={form.apiKey}
                  onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  Leave blank to use the built-in deterministic heuristic rubric evaluator.
                </p>
              </div>
            )}
          </div>

          {/* Voice & Speech Synthesis */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Voice & Audio Settings</span>
            </label>

            {availableVoices.length > 0 && (
              <div className="space-y-1">
                <label className="text-slate-400">Interviewer Voice:</label>
                <select
                  value={form.speechVoiceURI}
                  onChange={(e) => setForm({ ...form, speechVoiceURI: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Default System Natural Voice</option>
                  {availableVoices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="text-slate-300">Auto-speak questions out loud</label>
              <input
                type="checkbox"
                checked={form.autoSpeakQuestions}
                onChange={(e) => setForm({ ...form, autoSpeakQuestions: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
