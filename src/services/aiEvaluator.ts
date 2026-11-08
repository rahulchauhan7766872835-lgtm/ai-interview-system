import { Question, QuestionEvaluation, OverallEvaluation, InterviewConfig, UserSettings } from '../types';

const COMMON_FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'actually',
  'basically',
  'you know',
  'kind of',
  'sort of',
  'i mean',
  'literally'
];

export class AIEvaluatorService {
  /**
   * Evaluates an individual question response
   */
  public async evaluateAnswer(
    question: Question,
    candidateAnswer: string,
    durationSeconds: number,
    codeSnippet?: string,
    settings?: UserSettings
  ): Promise<QuestionEvaluation> {
    // If user provided a Gemini API Key, attempt live LLM evaluation
    if (settings?.apiKey && settings.aiProvider === 'gemini') {
      try {
        const geminiResult = await this.evaluateWithGemini(question, candidateAnswer, durationSeconds, codeSnippet, settings.apiKey);
        if (geminiResult) return geminiResult;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local heuristic evaluator:', err);
      }
    }

    // Default high-precision heuristic & rubric evaluation
    return this.evaluateLocally(question, candidateAnswer, durationSeconds, codeSnippet);
  }

  /**
   * Deterministic local rubric & NLP heuristic evaluator
   */
  private evaluateLocally(
    question: Question,
    candidateAnswer: string,
    durationSeconds: number,
    codeSnippet?: string
  ): QuestionEvaluation {
    const cleanAnswer = candidateAnswer.trim();
    const wordCount = cleanAnswer ? cleanAnswer.split(/\s+/).length : 0;
    const durationMinutes = Math.max(0.1, durationSeconds / 60);
    const wpm = Math.round(wordCount / durationMinutes);

    // 1. Analyze filler words
    const lowerText = cleanAnswer.toLowerCase();
    const fillerWordsUsed: { word: string; count: number }[] = [];
    let fillerWordTotal = 0;

    for (const filler of COMMON_FILLER_WORDS) {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches && matches.length > 0) {
        fillerWordsUsed.push({ word: filler, count: matches.length });
        fillerWordTotal += matches.length;
      }
    }

    // 2. Analyze Rubric Key Points Coverage
    const coveredPoints: string[] = [];
    const missingPoints: string[] = [];

    question.rubric.keyPoints.forEach(point => {
      // Extract key terms (words > 4 chars)
      const terms = point
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(t => t.length > 4 && !['about', 'using', 'which', 'their', 'there', 'where'].includes(t));

      const matchCount = terms.filter(t => lowerText.includes(t) || (codeSnippet && codeSnippet.toLowerCase().includes(t))).length;
      const coverageRatio = terms.length > 0 ? matchCount / terms.length : 0;

      if (coverageRatio >= 0.25 || lowerText.includes(point.toLowerCase().slice(0, 15))) {
        coveredPoints.push(point);
      } else {
        missingPoints.push(point);
      }
    });

    // 3. Behavioral STAR Check (if behavioral question)
    let starScoreBonus = 0;
    if (question.track === 'behavioral') {
      const hasSituation = /(situation|at my previous|we were working on|the project was|our team was)/i.test(lowerText);
      const hasTask = /(my task was|my responsibility|the challenge was|needed to|had to deliver)/i.test(lowerText);
      const hasAction = /(i implemented|i decided|i organized|i spearheaded|i scheduled|i analyzed|i resolved)/i.test(lowerText);
      const hasResult = /(result|outcome|improved by|reduced by|launched|delivered on time|metrics)/i.test(lowerText);

      const starPoints = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
      starScoreBonus = starPoints * 5; // up to 20 pts
    }

    // 4. Calculate Dimensions
    // Technical Accuracy (0-100)
    const keyPointRatio = question.rubric.keyPoints.length > 0 
      ? coveredPoints.length / question.rubric.keyPoints.length 
      : 0.5;
    
    let technicalAccuracy = Math.round(keyPointRatio * 75 + Math.min(25, wordCount / 10));
    if (wordCount < 20) technicalAccuracy = Math.min(technicalAccuracy, 30);
    if (codeSnippet && codeSnippet.length > 50) technicalAccuracy = Math.min(100, technicalAccuracy + 10);
    technicalAccuracy = Math.min(100, Math.max(15, technicalAccuracy));

    // Communication Clarity (0-100)
    let communicationClarity = 85;
    if (wpm < 80 || wpm > 190) communicationClarity -= 15;
    if (fillerWordTotal > 5) communicationClarity -= Math.min(25, fillerWordTotal * 3);
    if (wordCount < 30) communicationClarity -= 25;
    communicationClarity = Math.min(100, Math.max(20, communicationClarity));

    // Structure & Depth (0-100)
    let structureAndDepth = Math.round(40 + (coveredPoints.length * 12) + starScoreBonus);
    if (wordCount > 150) structureAndDepth += 10;
    structureAndDepth = Math.min(100, Math.max(20, structureAndDepth));

    // Problem Solving (0-100)
    let problemSolving = Math.round((technicalAccuracy * 0.6) + (structureAndDepth * 0.4));

    // Overall Question Score
    const overallScore = Math.round(
      technicalAccuracy * 0.40 +
      communicationClarity * 0.25 +
      structureAndDepth * 0.20 +
      problemSolving * 0.15
    );

    // Strengths & Weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (coveredPoints.length > 0) {
      strengths.push(`Addressed core concepts: ${coveredPoints.slice(0, 2).map(p => p.split(':')[0]).join(', ')}.`);
    }
    if (wordCount >= 100) {
      strengths.push(`Thorough explanation with good elaboration (${wordCount} words).`);
    }
    if (wpm >= 110 && wpm <= 160) {
      strengths.push(`Optimal delivery cadence (${wpm} WPM).`);
    }
    if (codeSnippet && codeSnippet.trim().length > 30) {
      strengths.push('Provided concrete code/architectural implementation.');
    }

    if (missingPoints.length > 0) {
      weaknesses.push(`Omitted discussion on: ${missingPoints.slice(0, 2).map(p => p.split(':')[0]).join(', ')}.`);
    }
    if (fillerWordTotal >= 4) {
      weaknesses.push(`Noticed frequent filler words (${fillerWordTotal} total) such as "${fillerWordsUsed[0]?.word}".`);
    }
    if (wordCount < 40) {
      weaknesses.push('Response was overly brief. Elaborate on edge cases, tradeoffs, and failure modes.');
    }
    if (question.track === 'behavioral' && !lowerText.includes('result') && !lowerText.includes('outcome')) {
      weaknesses.push('Remember to highlight measurable outcomes or metrics in the Result phase of your story.');
    }

    if (strengths.length === 0) {
      strengths.push('Attempted the question and maintained promptness.');
    }

    let actionableFeedback = '';
    if (overallScore >= 85) {
      actionableFeedback = 'Exceptional, structured response. To reach Staff level, lead immediately with high-level architectural tradeoffs before drilling into component specifics.';
    } else if (overallScore >= 70) {
      actionableFeedback = `Good grasp of fundamentals. Elevate your answer by proactively addressing ${missingPoints[0] || 'potential scalability bottlenecks and edge cases'}.`;
    } else {
      actionableFeedback = `Focus on structured delivery. Practice phrasing your answer around key concepts: ${question.rubric.keyPoints.slice(0, 2).join('; ')}.`;
    }

    return {
      questionId: question.id,
      questionTitle: question.title,
      candidateAnswer: cleanAnswer || '(No vocal answer recorded)',
      codeSnippet,
      durationSeconds,
      score: overallScore,
      dimensions: {
        technicalAccuracy,
        communicationClarity,
        structureAndDepth,
        problemSolving
      },
      strengths,
      weaknesses,
      missingKeyPoints: missingPoints,
      fillerWordsUsed,
      fillerWordTotal,
      speechPaceWPM: wpm,
      actionableFeedback,
      idealAnswerExcerpt: question.sampleAnswer.slice(0, 300) + '...'
    };
  }

  /**
   * Live Gemini LLM evaluation if API key is provided
   */
  private async evaluateWithGemini(
    question: Question,
    candidateAnswer: string,
    durationSeconds: number,
    codeSnippet?: string,
    apiKey?: string
  ): Promise<QuestionEvaluation | null> {
    const prompt = `You are a Principal Engineering Bar Raiser conducting an interview.
Question: "${question.prompt}"
Rubric Key Points: ${JSON.stringify(question.rubric.keyPoints)}
Ideal Benchmark: "${question.sampleAnswer}"

Candidate Answer: "${candidateAnswer}"
${codeSnippet ? `Candidate Code: """\n${codeSnippet}\n"""` : ''}
Duration: ${durationSeconds} seconds

Respond ONLY with valid JSON with this exact schema:
{
  "score": <number 0-100>,
  "dimensions": {
    "technicalAccuracy": <number 0-100>,
    "communicationClarity": <number 0-100>,
    "structureAndDepth": <number 0-100>,
    "problemSolving": <number 0-100>
  },
  "strengths": [<string>, <string>],
  "weaknesses": [<string>, <string>],
  "missingKeyPoints": [<string>],
  "actionableFeedback": "<string>",
  "speechPaceWPM": <number estimated from words>
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);

    return {
      questionId: question.id,
      questionTitle: question.title,
      candidateAnswer,
      codeSnippet,
      durationSeconds,
      score: parsed.score || 75,
      dimensions: parsed.dimensions || { technicalAccuracy: 75, communicationClarity: 75, structureAndDepth: 75, problemSolving: 75 },
      strengths: parsed.strengths || ['Good overall understanding'],
      weaknesses: parsed.weaknesses || ['Could provide more specific details'],
      missingKeyPoints: parsed.missingKeyPoints || [],
      fillerWordsUsed: [],
      fillerWordTotal: 0,
      speechPaceWPM: parsed.speechPaceWPM || Math.round((candidateAnswer.split(/\s+/).length / (durationSeconds / 60))),
      actionableFeedback: parsed.actionableFeedback || 'Solid foundation; practice concise articulation.',
      idealAnswerExcerpt: question.sampleAnswer.slice(0, 300) + '...'
    };
  }

  /**
   * Compiles the full scorecard and overall evaluation
   */
  public compileOverallEvaluation(
    config: InterviewConfig,
    questions: Question[],
    evaluations: QuestionEvaluation[],
    candidateName: string = 'Candidate'
  ): OverallEvaluation {
    const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0);
    const avgScore = evaluations.length > 0 ? Math.round(totalScore / evaluations.length) : 0;

    const avgTech = Math.round(evaluations.reduce((s, e) => s + e.dimensions.technicalAccuracy, 0) / (evaluations.length || 1));
    const avgComm = Math.round(evaluations.reduce((s, e) => s + e.dimensions.communicationClarity, 0) / (evaluations.length || 1));
    const avgStruct = Math.round(evaluations.reduce((s, e) => s + e.dimensions.structureAndDepth, 0) / (evaluations.length || 1));
    const avgProblem = Math.round(evaluations.reduce((s, e) => s + e.dimensions.problemSolving, 0) / (evaluations.length || 1));
    const avgPace = Math.round(evaluations.reduce((s, e) => s + e.speechPaceWPM, 0) / (evaluations.length || 1));
    const totalFillers = evaluations.reduce((s, e) => s + e.fillerWordTotal, 0);
    const totalDuration = evaluations.reduce((s, e) => s + e.durationSeconds, 0);

    let verdict: OverallEvaluation['verdict'] = 'Needs Practice';
    if (avgScore >= 88) verdict = 'Strong Hire';
    else if (avgScore >= 75) verdict = 'Hire';
    else if (avgScore >= 65) verdict = 'Leaning Hire';
    else if (avgScore >= 50) verdict = 'Needs Practice';
    else verdict = 'Significant Gap';

    // Aggregate top strengths & growth areas
    const allStrengths = evaluations.flatMap(e => e.strengths);
    const topStrengths = Array.from(new Set(allStrengths)).slice(0, 4);

    const allWeaknesses = evaluations.flatMap(e => e.weaknesses);
    const keyGrowthAreas = Array.from(new Set(allWeaknesses)).slice(0, 4);

    const recommendedDrills = [
      'Rapid-Fire Flashcards for core architectural definitions',
      'STAR Framework practice emphasizing quantifiable metric results',
      'System design capacity estimations and trade-off justification'
    ];

    let summary = '';
    if (verdict === 'Strong Hire') {
      summary = `Outstanding interview performance across the ${config.roleTitle} role. Demonstrated deep technical command, crisp communication with minimal filler words, and structured reasoning.`;
    } else if (verdict === 'Hire') {
      summary = `Solid interview session demonstrating competent fundamentals and clear articulation. Ready for the next stage with targeted tuning on edge-case tradeoffs.`;
    } else {
      summary = `The candidate shows good enthusiasm and core knowledge, but needs more structured depth, fewer filler pauses, and more concrete examples to pass the bar.`;
    }

    return {
      id: 'eval-' + Date.now(),
      sessionId: config.id,
      completedAt: new Date().toISOString(),
      candidateName,
      config,
      overallScore: avgScore,
      verdict,
      summary,
      dimensionScores: {
        technicalProficiency: avgTech,
        communication: avgComm,
        structureSTAR: avgStruct,
        problemSolving: avgProblem,
        confidencePacing: Math.min(100, Math.max(20, 100 - (totalFillers * 3)))
      },
      totalDurationSeconds: totalDuration,
      totalFillerWords: totalFillers,
      averageWPM: avgPace,
      questionEvaluations: evaluations,
      topStrengths,
      keyGrowthAreas,
      recommendedDrills
    };
  }
}

export const aiEvaluator = new AIEvaluatorService();
