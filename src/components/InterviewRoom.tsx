import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Code, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Sparkles,
  RefreshCw,
  LogOut,
  Send
} from 'lucide-react';
import { 
  InterviewConfig, 
  Question, 
  QuestionEvaluation, 
  UserSettings 
} from '../types';
import { PERSONA_CONFIGS } from '../data/interviewTracks';
import { getQuestionsByTrack } from '../data/questionBank';
import { speechService } from '../services/speechService';
import { aiEvaluator } from '../services/aiEvaluator';
import { AudioWaveform } from './AudioWaveform';
import { WebcamFeed } from './WebcamFeed';
import { CodeSandbox } from './CodeSandbox';

interface InterviewRoomProps {
  config: InterviewConfig;
  settings: UserSettings;
  onFinishInterview: (evaluations: QuestionEvaluation[], questions: Question[]) => void;
  onExit: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  config,
  settings,
  onFinishInterview,
  onExit
}) => {
  // Questions pool
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [evaluations, setEvaluations] = useState<QuestionEvaluation[]>([]);

  // Candidate input states
  const [candidateTranscript, setCandidateTranscript] = useState<string>('');
  const [codeAnswer, setCodeAnswer] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [showCodeEditor, setShowCodeEditor] = useState<boolean>(config.enableCodeEditor);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [isEvaluatingCurrent, setIsEvaluatingCurrent] = useState<boolean>(false);

  // Timer states
  const [secondsRemaining, setSecondsRemaining] = useState<number>(config.durationMinutes * 60);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Persona info
  const persona = PERSONA_CONFIGS[config.persona];

  // Initialize questions
  useEffect(() => {
    let pool = getQuestionsByTrack(config.track, config.level);
    // Take requested question count
    pool = pool.slice(0, Math.min(pool.length, config.questionCount));
    if (pool.length === 0) {
      pool = getQuestionsByTrack('frontend'); // safety fallback
    }
    setQuestions(pool);
    setCurrentIndex(0);
    setQuestionStartTime(Date.now());
  }, [config]);

  const currentQuestion = questions[currentIndex] || null;

  // Speak question when current question changes
  useEffect(() => {
    if (!currentQuestion) return;

    setCandidateTranscript('');
    setCodeAnswer(currentQuestion.starterCode || '');
    setActiveHintIndex(-1);
    setQuestionStartTime(Date.now());

    if (settings.autoSpeakQuestions) {
      speakCurrentQuestion();
    }
  }, [currentIndex, currentQuestion]);

  // Overall session countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const speakCurrentQuestion = () => {
    if (!currentQuestion) return;
    setIsAiSpeaking(true);
    speechService.speak(currentQuestion.prompt, {
      rate: settings.speechRate,
      pitch: settings.speechPitch,
      voiceURI: settings.speechVoiceURI,
      onEnd: () => setIsAiSpeaking(false)
    });
  };

  const handleStopSpeaking = () => {
    speechService.stopSpeaking();
    setIsAiSpeaking(false);
  };

  // Toggle Voice Recognition (Mic)
  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      handleStopSpeaking();
      const started = speechService.startListening(
        (payload) => {
          setCandidateTranscript(prev => {
            // Append or update transcript cleanly
            if (payload.isFinal) {
              return prev ? `${prev} ${payload.transcript}` : payload.transcript;
            }
            return prev ? `${prev} ${payload.transcript}` : payload.transcript;
          });
        },
        (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        }
      );
      if (started) {
        setIsListening(true);
      }
    }
  };

  // Move to next question or complete
  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    }
    handleStopSpeaking();

    setIsEvaluatingCurrent(true);

    const questionDurationSeconds = Math.max(10, Math.round((Date.now() - questionStartTime) / 1000));
    
    // Evaluate current answer
    const qEval = await aiEvaluator.evaluateAnswer(
      currentQuestion,
      candidateTranscript,
      questionDurationSeconds,
      showCodeEditor ? codeAnswer : undefined,
      settings
    );

    const updatedEvaluations = [...evaluations, qEval];
    setEvaluations(updatedEvaluations);
    setIsEvaluatingCurrent(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all questions
      onFinishInterview(updatedEvaluations, questions);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-3 text-indigo-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="font-semibold text-lg">Preparing Interview Environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        
        {/* Track & Role Title */}
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {config.roleTitle} • {config.level.toUpperCase()}
          </div>
          <span className="text-slate-400 text-sm hidden sm:inline">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Question Progress Dots */}
        <div className="flex items-center space-x-1.5">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                  : idx < currentIndex
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
            secondsRemaining < 120 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-slate-900 text-slate-200 border-slate-700'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={onExit}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Leave Interview"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Dual Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: AI Interviewer Pane (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Interviewer Persona Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 relative overflow-hidden shadow-xl">
            
            {/* Background ambient glow */}
            <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${persona.avatarBg} opacity-10 blur-3xl pointer-events-none`} />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${persona.avatarBg} flex items-center justify-center text-white font-extrabold text-lg shadow-lg relative`}>
                  {persona.name.charAt(0)}
                  {isAiSpeaking && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{persona.name}</h3>
                  <p className="text-xs text-indigo-400">{persona.title}</p>
                </div>
              </div>

              {/* TTS Trigger / Stop Button */}
              <button
                onClick={isAiSpeaking ? handleStopSpeaking : speakCurrentQuestion}
                className={`p-2.5 rounded-xl border transition-all ${
                  isAiSpeaking 
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title={isAiSpeaking ? 'Mute AI voice' : 'Replay question audio'}
              >
                {isAiSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* AI Audio Waveform Indicator */}
            <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-900">
              <AudioWaveform
                isActive={isAiSpeaking}
                barColor="#818cf8"
                height={28}
                barCount={24}
              />
              <div className="text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
                {isAiSpeaking ? 'AI Interviewer Speaking...' : 'AI Listening & Analyzing'}
              </div>
            </div>

            {/* Question Category & Prompt */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-400 border border-slate-700">
                  {currentQuestion.category}
                </span>
                <span className="text-[11px] text-slate-500">
                  Target: ~{Math.round(currentQuestion.suggestedDurationSeconds / 60)} mins
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-100 leading-snug">
                {currentQuestion.title}
              </h4>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {currentQuestion.prompt}
              </div>
            </div>

            {/* Interviewer Hint Drawer */}
            {currentQuestion.hints && currentQuestion.hints.length > 0 && (
              <div className="border-t border-slate-800/80 pt-3">
                {activeHintIndex === -1 ? (
                  <button
                    onClick={() => setActiveHintIndex(0)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5 font-medium transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Need a nudge or clarification from the interviewer?</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider text-indigo-400">
                      <span>Interviewer Hint ({activeHintIndex + 1}/{currentQuestion.hints.length})</span>
                      {activeHintIndex + 1 < currentQuestion.hints.length && (
                        <button
                          onClick={() => setActiveHintIndex(prev => prev + 1)}
                          className="text-[10px] underline hover:text-white"
                        >
                          Next Hint
                        </button>
                      )}
                    </div>
                    <p className="leading-relaxed">{currentQuestion.hints[activeHintIndex]}</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Quick Tips Box */}
          <div className="glass-card rounded-xl p-4 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pro Tip from Bar Raiser</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {config.track === 'behavioral'
                ? 'Structure your response with the STAR framework: Situation (20%), Task (10%), Action (50%), Result (20% with quantitative metrics).'
                : 'State high-level architectural trade-offs first before diving into low-level implementation details.'}
            </p>
          </div>

        </div>

        {/* Right Side: Candidate Workspace Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Webcam & Mic Live Studio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Webcam feed */}
            {config.enableCamera && (
              <div>
                <WebcamFeed
                  isListening={isListening}
                  onToggleMic={toggleListening}
                />
              </div>
            )}

            {/* Candidate Voice Activity & Mic Panel */}
            <div className={`glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between ${!config.enableCamera ? 'md:col-span-2' : ''}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Speech-to-Text Input
                    </span>
                  </div>
                  <button
                    onClick={toggleListening}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow ${
                      isListening
                        ? 'bg-rose-500 text-white shadow-rose-500/25'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Mic</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Speak Answer</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Candidate Waveform */}
                <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-900 mb-3">
                  <AudioWaveform
                    isActive={isListening}
                    barColor="#10b981"
                    height={32}
                    barCount={30}
                  />
                  <div className="text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
                    {isListening ? 'Recording your speech in real-time...' : 'Click "Speak Answer" to talk'}
                  </div>
                </div>
              </div>

              {/* Word Count & Pace Info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Words: <strong>{candidateTranscript.trim() ? candidateTranscript.trim().split(/\s+/).length : 0}</strong></span>
                <span>Target: <strong>120 - 250 words</strong></span>
              </div>
            </div>

          </div>

          {/* Real-time Editable Transcript Input Box */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <span>Your Answer Transcript</span>
                <span className="text-[10px] font-normal text-slate-500 lowercase">(you can edit or type directly)</span>
              </label>

              {/* Code Sandbox Toggle Button */}
              {config.enableCodeEditor && (
                <button
                  type="button"
                  onClick={() => setShowCodeEditor(prev => !prev)}
                  className={`text-xs px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 transition-colors ${
                    showCodeEditor
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{showCodeEditor ? 'Hide Code Editor' : 'Show Code Editor'}</span>
                </button>
              )}
            </div>

            <textarea
              value={candidateTranscript}
              onChange={(e) => setCandidateTranscript(e.target.value)}
              placeholder="Your vocal transcript will appear here in real-time as you speak. You can also type or polish your thoughts here directly..."
              rows={5}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
            />
          </div>

          {/* In-Interview Code Editor (if toggled or enabled) */}
          {showCodeEditor && (
            <div className="h-64 sm:h-72">
              <CodeSandbox
                initialCode={codeAnswer || currentQuestion.starterCode}
                language={currentQuestion.language || 'typescript'}
                onChange={(code) => setCodeAnswer(code)}
              />
            </div>
          )}

          {/* Action Footer: Submit & Next */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSubmitAnswer}
              disabled={isEvaluatingCurrent}
              className="text-xs text-slate-400 hover:text-slate-200 underline disabled:opacity-50"
            >
              Skip question
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={isEvaluatingCurrent}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isEvaluatingCurrent ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Evaluating Rubric...</span>
                </>
              ) : currentIndex + 1 < questions.length ? (
                <>
                  <span>Submit Answer & Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete & Generate Evaluation</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
