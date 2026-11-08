import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { QUESTION_BANK } from '../data/questionBank';
import { CAREER_TRACKS } from '../data/interviewTracks';
import { CareerTrack, Question } from '../types';

interface QuestionBankViewProps {
  onPracticeQuestion: (question: Question) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onPracticeQuestion
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredQuestions = QUESTION_BANK.filter(q => {
    if (selectedTrack !== 'all' && q.track !== selectedTrack) return false;
    if (selectedLevel !== 'all' && q.level !== selectedLevel) return false;
    if (searchQuery.trim()) {
      const qText = `${q.title} ${q.prompt} ${q.category}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Interview Question Repository</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse real FAANG questions with comprehensive evaluation rubrics and model benchmark answers.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setSelectedTrack('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedTrack === 'all'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Tracks ({QUESTION_BANK.length})
        </button>

        {CAREER_TRACKS.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTrack(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTrack === t.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.title}
          </button>
        ))}

        {/* Level Selector */}
        <div className="ml-auto flex items-center space-x-2">
          <span className="text-xs text-slate-500">Level:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Levels</option>
            <option value="entry">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Staff / Lead</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-sm">
            No questions found matching your filter criteria.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-400 border border-slate-700">
                        {q.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Level: {q.level}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 hover:text-indigo-300 transition-colors">
                      {q.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {q.prompt}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPracticeQuestion(q);
                      }}
                      className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 flex items-center space-x-1.5 transition-all shadow"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Practice</span>
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-800 bg-slate-950/40 space-y-4 text-xs animate-in fade-in duration-150">
                    
                    {/* Full Prompt */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed">
                      <strong className="text-indigo-400 block mb-1 text-[11px] uppercase tracking-wider">
                        Full Question Prompt:
                      </strong>
                      {q.prompt}
                    </div>

                    {/* Rubric Key Points */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <strong className="text-slate-300 block text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Evaluation Rubric & Required Key Points</span>
                      </strong>
                      <ul className="space-y-1.5 pl-2 list-disc list-inside text-slate-400">
                        {q.rubric.keyPoints.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Pitfalls */}
                    {q.rubric.commonPitfalls && (
                      <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-2 text-rose-200">
                        <strong className="block text-[11px] uppercase tracking-wider flex items-center space-x-1.5 text-rose-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Common Pitfalls to Avoid</span>
                        </strong>
                        <ul className="space-y-1.5 pl-2 list-disc list-inside text-slate-300">
                          {q.rubric.commonPitfalls.map((pf, i) => (
                            <li key={i}>{pf}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benchmark Model Answer */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                      <strong className="text-emerald-400 block mb-1 text-[11px] uppercase tracking-wider">
                        Benchmark Ideal Answer (10/10 Standard):
                      </strong>
                      <p className="whitespace-pre-wrap">{q.sampleAnswer}</p>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
