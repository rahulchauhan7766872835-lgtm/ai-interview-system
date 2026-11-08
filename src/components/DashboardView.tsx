import React from 'react';
import { 
  Play, 
  Trophy, 
  TrendingUp, 
  Clock, 
  History, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  Flame, 
  BookOpen, 
  ChevronRight,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { CareerTrack, OverallEvaluation } from '../types';
import { CAREER_TRACKS } from '../data/interviewTracks';

interface DashboardViewProps {
  history: OverallEvaluation[];
  onStartTrack: (track: CareerTrack) => void;
  onOpenSetup: () => void;
  onViewEvaluation: (evalItem: OverallEvaluation) => void;
  onClearHistory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  onStartTrack,
  onOpenSetup,
  onViewEvaluation,
  onClearHistory
}) => {
  const totalSessions = history.length;
  const avgScore = totalSessions > 0 
    ? Math.round(history.reduce((s, h) => s + h.overallScore, 0) / totalSessions) 
    : 0;

  const highestScore = totalSessions > 0
    ? Math.max(...history.map(h => h.overallScore))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 overflow-hidden shadow-2xl">
        {/* Glow backdrop decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Bar Raiser Simulation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Crack Technical & Behavioral Interviews with <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">Instant AI Feedback</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Simulate realistic FAANG-style interview loops. Practice with real-time AI speech recognition, webcam posture cues, live code evaluation, and rubric-based hiring scorecards.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={onOpenSetup}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center space-x-2.5 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Mock Interview</span>
            </button>

            <button
              onClick={() => onStartTrack('system-design')}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-850 text-slate-200 border border-slate-700/80 hover:border-slate-600 flex items-center space-x-2 transition-colors"
            >
              <span>Practice System Design</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Interviews Completed</span>
            <History className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{totalSessions}</div>
          <div className="text-[11px] text-slate-500">All tracks recorded</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Average Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {avgScore ? `${avgScore}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500">Rubric composite score</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Peak Score</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {highestScore ? `${highestScore}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500">Personal best</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Interview Tracks</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400">8 Tracks</div>
          <div className="text-[11px] text-slate-500">FAANG & startup curricula</div>
        </div>
      </div>

      {/* Career Tracks Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Select a Career Track to Practice</h2>
            <p className="text-xs text-slate-400">Curated question banks, rubrics, and bar raiser personas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAREER_TRACKS.map(track => (
            <div
              key={track.id}
              onClick={() => onStartTrack(track.id)}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                    {track.badge}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {track.description}
                </p>
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                {track.coreSkills.slice(0, 3).map(skill => (
                  <span key={skill} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Interview History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>Past Interview Sessions</span>
            </h2>
            <p className="text-xs text-slate-400">Review your past performance scorecards and growth trends</p>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-500 hover:text-rose-400 flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-300">No mock interview sessions recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Launch your first mock interview loop to generate a comprehensive AI evaluation report and track your progress over time.
            </p>
            <button
              onClick={onOpenSetup}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Start First Interview
            </button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Role / Track</th>
                    <th className="px-5 py-3">Difficulty</th>
                    <th className="px-5 py-3">Overall Score</th>
                    <th className="px-5 py-3">Verdict</th>
                    <th className="px-5 py-3">Pacing</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-100">
                        {item.config.roleTitle}
                      </td>
                      <td className="px-5 py-3.5 uppercase font-medium text-slate-400">
                        {item.config.level}
                      </td>
                      <td className="px-5 py-3.5 font-black text-indigo-400">
                        {item.overallScore} / 100
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                          item.verdict === 'Strong Hire' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                          item.verdict === 'Hire' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                          'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {item.verdict}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {item.averageWPM} WPM ({item.totalFillerWords} fillers)
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {new Date(item.completedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onViewEvaluation(item)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold transition-colors inline-flex items-center space-x-1"
                        >
                          <span>View Scorecard</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
