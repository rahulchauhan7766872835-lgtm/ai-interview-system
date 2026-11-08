import React, { useState } from 'react';
import { 
  Flame, 
  RotateCw, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  Trophy 
} from 'lucide-react';
import { FLASHCARD_DRILLS } from '../data/flashcards';

export const FlashcardDrillView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [reviewIds, setReviewIds] = useState<string[]>([]);

  const currentCard = FLASHCARD_DRILLS[currentIndex];
  const isFinished = currentIndex >= FLASHCARD_DRILLS.length;

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleAnswer = (known: boolean) => {
    if (known) {
      setMasteredIds(prev => [...prev, currentCard.id]);
    } else {
      setReviewIds(prev => [...prev, currentCard.id]);
    }
    setIsFlipped(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds([]);
    setReviewIds([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Rapid-Fire Conceptual Drills</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          60-Second Flashcard Recall
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Sharpen instant recall of foundational principles, acronyms, and trade-offs before high-stakes interview loops.
        </p>
      </div>

      {/* Progress & Score Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
        <span>Progress: <strong>{Math.min(currentIndex + 1, FLASHCARD_DRILLS.length)} / {FLASHCARD_DRILLS.length}</strong></span>
        <div className="flex items-center space-x-3">
          <span className="text-emerald-400 font-bold">Mastered: {masteredIds.length}</span>
          <span className="text-amber-400 font-bold">Needs Review: {reviewIds.length}</span>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Flashcard 3D flip card */}
          <div
            onClick={handleFlip}
            className="w-full min-h-[300px] glass-panel rounded-3xl p-8 border border-slate-800 cursor-pointer flex flex-col justify-between shadow-2xl hover:border-indigo-500/50 transition-all select-none relative overflow-hidden group"
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-400 border border-slate-700">
                {currentCard.topic} • {currentCard.track.toUpperCase()}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                <span>{isFlipped ? 'Click to see Prompt' : 'Click to Reveal Answer'}</span>
              </span>
            </div>

            {/* Main Content */}
            <div className="py-6 text-center">
              {!isFlipped ? (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Interview Prompt:
                  </span>
                  <p className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                    {currentCard.front}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Model Benchmark Answer:
                  </span>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl mx-auto">
                    {currentCard.back}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1.5 pt-3">
                    {currentCard.keyKeywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom cue */}
            <div className="text-center text-[11px] text-slate-500">
              {isFlipped ? 'Rate your recall below to advance' : 'Think about your answer, then click to check'}
            </div>
          </div>

          {/* Action rating buttons */}
          {isFlipped && (
            <div className="flex items-center justify-center space-x-4 animate-in fade-in duration-200">
              <button
                onClick={() => handleAnswer(false)}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center space-x-2 transition-all shadow"
              >
                <XCircle className="w-4 h-4 text-amber-400" />
                <span>Review Later</span>
              </button>

              <button
                onClick={() => handleAnswer(true)}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 flex items-center space-x-2 transition-all shadow"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Mastered This Concept</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion Screen */
        <div className="glass-card rounded-3xl p-10 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white">Drill Session Complete!</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            You reviewed {FLASHCARD_DRILLS.length} core interview prompts. Mastered: <strong>{masteredIds.length}</strong>, Needs Review: <strong>{reviewIds.length}</strong>.
          </p>

          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
          >
            Restart Drill
          </button>
        </div>
      )}

    </div>
  );
};
