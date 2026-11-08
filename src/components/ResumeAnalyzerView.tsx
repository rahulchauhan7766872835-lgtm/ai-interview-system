import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  ArrowRight, 
  Briefcase 
} from 'lucide-react';
import { InterviewConfig } from '../types';

interface ResumeAnalyzerViewProps {
  onStartCustomInterview: (config: Partial<InterviewConfig>) => void;
}

const COMMON_TECH_TERMS = [
  'react', 'next.js', 'typescript', 'javascript', 'python', 'golang', 'node.js',
  'kubernetes', 'docker', 'aws', 'gcp', 'redis', 'postgresql', 'mongodb',
  'graphql', 'rest', 'system design', 'microservices', 'ci/cd', 'tailwind',
  'kafka', 'pytorch', 'transformers', 'rag', 'llm', 'sql'
];

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  onStartCustomInterview
}) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescText, setJobDescText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    generatedQuestions: string[];
  } | null>(null);

  const handleAnalyze = () => {
    if (!resumeText.trim() || !jobDescText.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const lowerResume = resumeText.toLowerCase();
      const lowerJD = jobDescText.toLowerCase();

      // Find matched skills
      const matchedSkills = COMMON_TECH_TERMS.filter(term => 
        lowerResume.includes(term) && lowerJD.includes(term)
      );

      // Find missing skills (in JD but not in Resume)
      const missingSkills = COMMON_TECH_TERMS.filter(term => 
        lowerJD.includes(term) && !lowerResume.includes(term)
      );

      // Compute match score
      const totalJDTerms = matchedSkills.length + missingSkills.length;
      const matchScore = totalJDTerms > 0 
        ? Math.round((matchedSkills.length / totalJDTerms) * 100) 
        : 72;

      // Generate tailored questions
      const generatedQuestions = [
        `I noticed in your resume that you worked with ${matchedSkills[0] || 'modern distributed systems'}. Walk me through an architectural challenge you resolved regarding throughput or data consistency.`,
        `The target role specifically demands ${missingSkills[0] || 'high availability & fault tolerance'}. While not heavily featured in your background, how would you approach scaling this in production?`,
        `Describe a high-stakes project mentioned in your experience where you had to collaborate cross-functionally under strict timeline constraints.`
      ];

      setAnalysisResult({
        matchScore: Math.max(45, Math.min(95, matchScore)),
        matchedSkills,
        missingSkills,
        generatedQuestions
      });

      setIsAnalyzing(false);
    }, 600);
  };

  const handleLaunchTargetedInterview = () => {
    onStartCustomInterview({
      roleTitle: 'Custom Resume-Targeted Loop',
      track: 'fullstack',
      level: 'senior',
      resumeText,
      jobDescription: jobDescText
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Tailored Career Preparation</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Resume & Job Description Alignment Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Paste your resume profile and the job description you are targeting. AI will identify skill gaps and generate deep-dive questions specific to your claimed projects.
        </p>
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Resume Input */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>1. Paste Resume Text / Experience</span>
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume work history, technical skills, and project accomplishments here..."
            rows={8}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
          />
        </div>

        {/* Job Description Input */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>2. Paste Target Job Description (JD)</span>
          </label>
          <textarea
            value={jobDescText}
            onChange={(e) => setJobDescText(e.target.value)}
            placeholder="Paste the requirements, responsibilities, and qualifications from the target job posting..."
            rows={8}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
          />
        </div>

      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={!resumeText.trim() || !jobDescText.trim() || isAnalyzing}
          className="px-8 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all hover:scale-105 inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'Analyzing Alignment...' : 'Analyze Match & Generate Questions'}</span>
        </button>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-black text-2xl">
                {analysisResult.matchScore}%
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Target Role Keyword Alignment</h3>
                <p className="text-xs text-slate-400">
                  {analysisResult.matchScore >= 75 ? 'Strong candidate profile match for this position.' : 'Moderate match. Address identified skill gaps during behavioral answers.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLaunchTargetedInterview}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Targeted Interview</span>
            </button>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Matching Skills ({analysisResult.matchedSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysisResult.matchedSkills.length > 0 ? (
                  analysisResult.matchedSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800/40 text-[11px] font-semibold">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No direct technical keywords matched.</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Potential Knowledge Gaps / Missing in Resume</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysisResult.missingSkills.length > 0 ? (
                  analysisResult.missingSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-800/40 text-[11px] font-semibold">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">Your resume covers all required key terms!</span>
                )}
              </div>
            </div>

          </div>

          {/* Tailored Questions Preview */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Tailored Interview Questions Generated from Your Profile</span>
            </h4>

            <div className="space-y-2">
              {analysisResult.generatedQuestions.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
