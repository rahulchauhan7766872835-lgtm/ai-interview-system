import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Share2, 
  Printer 
} from 'lucide-react';
import { OverallEvaluation } from '../types';
import { PDFReportGenerator } from '../services/pdfReportGenerator';

interface EvaluationModalProps {
  evaluation: OverallEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
  onRetake: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  evaluation,
  isOpen,
  onClose,
  onRetake
}) => {
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number>(0);

  useEffect(() => {
    if (isOpen && evaluation && evaluation.overallScore >= 70) {
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen, evaluation]);

  if (!isOpen || !evaluation) return null;

  const handlePrint = () => {
    PDFReportGenerator.printEvaluationReport(evaluation);
  };

  const getVerdictBadge = (verdict: OverallEvaluation['verdict']) => {
    switch (verdict) {
      case 'Strong Hire':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Hire':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Leaning Hire':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-indigo-400';
    if (score >= 55) return 'text-cyan-400';
    return 'text-amber-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Evaluation Scorecard</h2>
              <p className="text-xs text-slate-400">
                {evaluation.config.roleTitle} ({evaluation.config.level.toUpperCase()}) • {new Date(evaluation.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Top Score & Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
            
            {/* Score Ring / Number */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Readiness Score
              </span>
              <div className={`text-6xl font-black ${getScoreColor(evaluation.overallScore)} tracking-tight`}>
                {evaluation.overallScore}
                <span className="text-xl text-slate-600 font-normal">/100</span>
              </div>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getVerdictBadge(evaluation.verdict)}`}>
                {evaluation.verdict}
              </div>
            </div>

            {/* AI Summary and Key Metas */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Executive Feedback Summary</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {evaluation.summary}
                </p>
              </div>

              {/* Delivery & Pacing Chips */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Speaking Pace</span>
                  <span className="text-sm font-bold text-indigo-300">{evaluation.averageWPM} WPM</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Filler Words</span>
                  <span className={`text-sm font-bold ${evaluation.totalFillerWords > 6 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {evaluation.totalFillerWords} used
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Duration</span>
                  <span className="text-sm font-bold text-slate-200">
                    {Math.round(evaluation.totalDurationSeconds / 60)} mins
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Competency Dimensions Bar Breakdown */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Core Competency Dimensions
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Technical Accuracy & Depth', value: evaluation.dimensionScores.technicalProficiency },
                { label: 'Communication & Articulation', value: evaluation.dimensionScores.communication },
                { label: 'Structure & Depth (STAR Method)', value: evaluation.dimensionScores.structureSTAR },
                { label: 'Problem Solving & Critical Thinking', value: evaluation.dimensionScores.problemSolving },
              ].map(dim => (
                <div key={dim.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">{dim.label}</span>
                    <span className="text-white font-bold">{dim.value}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                      style={{ width: `${dim.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Growth Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Strengths */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Identified Strengths</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-2 list-disc list-inside">
                {evaluation.topStrengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Targeted Growth Areas</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-2 list-disc list-inside">
                {evaluation.keyGrowthAreas.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question-by-Question Detailed Drilldown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Detailed Question Breakdown ({evaluation.questionEvaluations.length})</span>
            </h4>

            {evaluation.questionEvaluations.map((q, idx) => {
              const isExpanded = expandedQuestionIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedQuestionIdx(isExpanded ? -1 : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/60 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-100">{q.questionTitle}</div>
                        <div className="text-[11px] text-slate-400">
                          Duration: {q.durationSeconds}s • Pace: {q.speechPaceWPM} WPM
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(q.score)}`}>
                        {q.score} / 100
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800/80 space-y-4 bg-slate-950/40 text-xs animate-in fade-in duration-150">
                      
                      {/* Candidate's Answer */}
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                          Candidate Transcribed Answer:
                        </span>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed italic">
                          "{q.candidateAnswer}"
                        </div>
                      </div>

                      {/* Code if provided */}
                      {q.codeSnippet && (
                        <div>
                          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                            Submitted Code / Solution:
                          </span>
                          <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 font-mono text-xs overflow-x-auto">
                            {q.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {/* AI Actionable Feedback */}
                      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-indigo-200">
                        <strong className="text-indigo-400 block mb-1">AI Bar Raiser Feedback:</strong>
                        <p>{q.actionableFeedback}</p>
                      </div>

                      {/* Benchmark Model Answer */}
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        <strong className="text-emerald-400 block mb-1">Benchmark Ideal Answer Excerpt:</strong>
                        <p className="text-slate-400">{q.idealAnswerExcerpt}</p>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close & Go to Dashboard
          </button>

          <button
            onClick={onRetake}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all hover:scale-105"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake or Practice Another Track</span>
          </button>
        </div>

      </div>
    </div>
  );
};
