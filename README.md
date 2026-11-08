# InterviewIQ Pro • AI Interview Preparation & Evaluation System

An advanced, production-grade AI-powered mock interview and rubric evaluation platform designed to help candidates prepare for and clear high-stakes technical, system design, and behavioral (STAR) interview loops.

![InterviewIQ Pro Preview](https://img.shields.io/badge/Status-Production%20Ready-emerald)
![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20TypeScript%20%7C%20TailwindCSS%20%7C%20Vite-6366f1)
![AI Engine](https://img.shields.io/badge/AI%20Engine-Gemini%20API%20%2B%20Offline%20Smart%20Evaluator-blue)

---

## 🚀 Key Features

### 1. 🎙️ Real-Time Voice & Speech Interaction
- **Speech-to-Text (STT)**: Native Web Speech recognition transcribes candidate verbal answers in real time.
- **Audio Waveform Visualizer**: Dynamic HTML5 Canvas rendering audio waves for both AI interviewer voice and candidate microphone.
- **Text-to-Speech (TTS)**: Realistic AI interviewer voices dynamically speak interview prompts, follow-ups, and hints.
- **Transcript Polish & Live Editor**: Editable transcript stream allows candidates to fix terms misheard by microphones (e.g. specialized library names, acronyms) or type answers directly.

### 2. 📹 Webcam & Interview Simulation Studio
- **Candidate Webcam Feed**: Practice eye contact and posture under realistic camera conditions.
- **Eye-Line Target Guide**: Overlay guideline assisting candidates in maintaining direct camera eye contact.
- **In-Interview Code Sandbox**: Integrated code editor supporting TypeScript, JavaScript, Python, and SQL with code execution for algorithmic and system design questions.

### 3. 🧠 Dual-Tier AI Evaluation Engine
- **Deterministic Offline Rubric Scorer (Works 100% out of the box)**:
  - **Rubric Key Points Matcher**: Matches coverage of core architectural concepts, failure modes, and edge cases.
  - **Behavioral STAR Parser**: Detects Situation, Task, Action, and Result indicators with metric verification.
  - **Speech Delivery Metrics**: Calculates Words Per Minute (WPM), speech cadence, and flags filler words (`um`, `uh`, `like`, `basically`, `actually`).
  - **Multi-Dimensional Competency Scoring (0-100)**:
    1. Technical Accuracy & Depth
    2. Communication Clarity & Articulation
    3. Structure & Depth (STAR framework adherence)
    4. Problem Solving & Critical Thinking
    5. Confidence & Delivery
- **Live Google Gemini LLM Integration**: Add a Gemini API key in Settings to unlock neural generative evaluation and contextual deep-dive critiques.

### 4. 📊 Comprehensive Evaluation Scorecards & PDF Export
- **Readiness Rating**: Categorizes performance into *Strong Hire*, *Hire*, *Leaning Hire*, or *Needs Practice*.
- **Question-by-Question Drilldown**:
  - Exact transcribed answer
  - Identified strengths & weaknesses
  - Omitted rubric concepts
  - Actionable feedback from the interviewer
  - 10/10 Benchmark model answer excerpt
- **One-Click PDF Report Generator**: Generates clean, printable evaluation scorecards for career coaches, mentors, or personal tracking.

### 5. 🎯 Specialized Career Tracks
- **Frontend Engineering**: React 19, Fiber reconciliation, Virtual DOM, Core Web Vitals (LCP, INP, CLS), CSS layout, async race conditions.
- **Backend Engineering**: ACID isolation levels, double-spending prevention, optimistic vs. pessimistic locking, cache stampede/avalanche, Redis single-flight.
- **System Design & Scalability**: Distributed rate limiting (1M RPS, sliding window, Redis Lua), TinyURL at scale (Base62, Kafka analytics stream).
- **Behavioral & Leadership (STAR)**: Handling architectural disagreements, production outages, extreme ownership, cross-team alignment.
- **AI & Machine Learning**: Enterprise RAG pipelines, semantic vs BM25 hybrid search, re-ranking, chunking strategies, hallucination guardrails.
- **Full Stack & DevOps**: JWT token rotation, XSS/CSRF mitigations, Kubernetes, CI/CD canary deployments.

### 6. 📄 Resume & Job Description Alignment Matcher
- Upload or paste your Resume and target Job Description.
- Computes matching skills, highlights critical knowledge gaps, and generates tailored interview questions specific to your claimed projects.

### 7. ⚡ 60-Second Rapid-Fire Flashcard Drills
- Flip-card drills for quick conceptual review of CAP theorem, consistent hashing, ACID, React memoization, and RAG retrieval.

---

## 🛠️ Project Structure

```
AI Interview Preparation & Evaluation System/
├── index.html                 # Main entry HTML with Google Fonts
├── package.json               # Scripts, dependencies, and configuration
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind styling and brand palette
├── tsconfig.json              # TypeScript compiler options
├── vite.config.ts             # Vite bundler configuration
└── src/
    ├── main.tsx               # React DOM entry point
    ├── App.tsx                # Central application router and state
    ├── index.css              # Tailwind base, utilities, glassmorphism styles
    ├── types/
    │   └── index.ts           # Interfaces for tracks, questions, evaluations, settings
    ├── data/
    │   ├── interviewTracks.ts # 8 career tracks metadata and AI interviewer personas
    │   ├── questionBank.ts    # Curated questions, rubrics, and benchmark model answers
    │   └── flashcards.ts      # Rapid-fire 60s drill cards
    ├── services/
    │   ├── speechService.ts   # Web Speech API (STT & TTS) wrapper
    │   ├── aiEvaluator.ts     # Local rubric heuristic engine & Gemini API integration
    │   ├── storageService.ts  # LocalStorage persistence for sessions and settings
    │   └── pdfReportGenerator.ts # Formatted PDF scorecard print exporter
    └── components/
        ├── Navbar.tsx         # Header navigation and status badges
        ├── DashboardView.tsx  # Hero overview, past sessions table, track catalog
        ├── InterviewRoom.tsx  # Dual-pane live interview simulation room
        ├── AudioWaveform.tsx  # Canvas animated audio wave visualizer
        ├── WebcamFeed.tsx     # Webcam simulation with eye-line target
        ├── CodeSandbox.tsx    # Live code editor with run/eval capabilities
        ├── SetupModal.tsx     # Interview configuration modal (tracks, personas, length)
        ├── EvaluationModal.tsx# Post-interview scorecard with confetti & breakdown
        ├── QuestionBankView.tsx # Filterable question library
        ├── FlashcardDrillView.tsx # Interactive flashcard recall mode
        ├── ResumeAnalyzerView.tsx # Resume & JD keyword gap analyzer
        └── SettingsModal.tsx  # API keys, voice pitch, speed, and audio settings
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+ recommended, v24+ supported)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Generates optimized production assets in the `dist/` directory.

---

## 💡 How to Use
1. **Quick Start**: From the Dashboard, click **"Launch Mock Interview"** or select any track (e.g., *Frontend Engineering*, *System Design*, or *Behavioral*).
2. **Interview Setup**: Pick your target experience level (Junior, Mid, Senior, Staff) and choose an AI persona (*Friendly Mentor Sarah*, *Strict Bar Raiser Marcus*, or *Architect Dr. Reed*).
3. **During the Interview**:
   - Listen to the AI interviewer speak the question (or read the prompt).
   - Click **"Speak Answer"** to speak your response via your microphone, or type your answer in the transcript box.
   - For technical questions, open the **Live Code Sandbox** to write and test code.
   - Need a nudge? Click **"Need a hint from the interviewer?"**.
4. **Instant Scorecard**: When finished, review your comprehensive AI Evaluation Scorecard detailing overall score, filler words, WPM, strengths, growth areas, and benchmark model answers. Click **"Download PDF"** to save or print!

---

## 📄 License
MIT License. Built for developers and interview candidates worldwide.
