export type CareerTrack = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'system-design' 
  | 'ai-ml' 
  | 'behavioral' 
  | 'product-management' 
  | 'devops-cloud';

export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';

export type InterviewFormat = 'mixed' | 'voice-only' | 'technical-code' | 'behavioral-star';

export type InterviewerPersona = 'friendly-mentor' | 'strict-bar-raiser' | 'analytical-architect';

export interface InterviewConfig {
  id: string;
  track: CareerTrack;
  roleTitle: string;
  level: ExperienceLevel;
  format: InterviewFormat;
  persona: InterviewerPersona;
  questionCount: number;
  durationMinutes: number;
  enableCamera: boolean;
  enableAudio: boolean;
  enableCodeEditor: boolean;
  resumeText?: string;
  jobDescription?: string;
}

export interface Question {
  id: string;
  track: CareerTrack;
  level: ExperienceLevel;
  category: string;
  title: string;
  prompt: string;
  rubric: {
    keyPoints: string[];
    starCriteria?: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    commonPitfalls: string[];
  };
  sampleAnswer: string;
  starterCode?: string;
  language?: string;
  hints: string[];
  suggestedDurationSeconds: number;
}

export interface QuestionEvaluation {
  questionId: string;
  questionTitle: string;
  candidateAnswer: string;
  codeSnippet?: string;
  durationSeconds: number;
  score: number; // 0 - 100
  dimensions: {
    technicalAccuracy: number; // 0-100
    communicationClarity: number; // 0-100
    structureAndDepth: number; // 0-100
    problemSolving: number; // 0-100
  };
  strengths: string[];
  weaknesses: string[];
  missingKeyPoints: string[];
  fillerWordsUsed: { word: string; count: number }[];
  fillerWordTotal: number;
  speechPaceWPM: number;
  actionableFeedback: string;
  idealAnswerExcerpt: string;
}

export interface OverallEvaluation {
  id: string;
  sessionId: string;
  completedAt: string;
  candidateName: string;
  config: InterviewConfig;
  overallScore: number; // 0 - 100
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Practice' | 'Significant Gap';
  summary: string;
  dimensionScores: {
    technicalProficiency: number;
    communication: number;
    structureSTAR: number;
    problemSolving: number;
    confidencePacing: number;
  };
  totalDurationSeconds: number;
  totalFillerWords: number;
  averageWPM: number;
  questionEvaluations: QuestionEvaluation[];
  topStrengths: string[];
  keyGrowthAreas: string[];
  recommendedDrills: string[];
}

export interface Flashcard {
  id: string;
  track: CareerTrack;
  topic: string;
  front: string;
  back: string;
  keyKeywords: string[];
}

export interface UserSettings {
  userName: string;
  aiProvider: 'gemini' | 'openai' | 'local';
  apiKey: string;
  modelName: string;
  speechVoiceURI: string;
  speechRate: number;
  speechPitch: number;
  autoSpeakQuestions: boolean;
  soundEffects: boolean;
  theme: 'dark' | 'light';
}
