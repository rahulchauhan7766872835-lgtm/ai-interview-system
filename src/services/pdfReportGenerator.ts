import { OverallEvaluation } from '../types';

export class PDFReportGenerator {
  public static printEvaluationReport(evaluation: OverallEvaluation): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate and print your evaluation report.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>InterviewIQ Evaluation Report - ${evaluation.candidateName} - ${evaluation.config.roleTitle}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 32px;
            line-height: 1.5;
          }
          .header {
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .title {
            font-size: 26px;
            font-weight: 800;
            color: #1e1b4b;
            margin: 0;
          }
          .subtitle {
            font-size: 14px;
            color: #64748b;
            margin-top: 4px;
          }
          .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .verdict-strong { background: #dcfce7; color: #15803d; }
          .verdict-hire { background: #e0e7ff; color: #4338ca; }
          .verdict-practice { background: #fef9c3; color: #a16207; }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }
          .card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            background: #f8fafc;
          }
          .metric-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
          }
          .metric-label { color: #475569; }
          .metric-value { font-weight: 700; color: #0f172a; }
          .score-circle {
            font-size: 42px;
            font-weight: 900;
            color: #4f46e5;
            text-align: center;
            margin: 8px 0;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin: 24px 0 12px 0;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 6px;
          }
          .q-box {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 14px;
            margin-bottom: 16px;
            page-break-inside: avoid;
          }
          .q-title {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
          }
          .pill {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 6px;
          }
          .pill-green { background: #dcfce7; color: #166534; }
          .pill-red { background: #fee2e2; color: #991b1b; }
          .answer-text {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            padding: 10px;
            border-radius: 4px;
            font-size: 13px;
            color: #334155;
            margin: 8px 0;
            font-style: italic;
          }
          .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">InterviewIQ • AI Candidate Evaluation Scorecard</h1>
            <div class="subtitle">Candidate: <strong>${evaluation.candidateName}</strong> | Role: <strong>${evaluation.config.roleTitle} (${evaluation.config.level.toUpperCase()})</strong> | Date: ${new Date(evaluation.completedAt).toLocaleDateString()}</div>
          </div>
          <div>
            <span class="badge ${evaluation.verdict === 'Strong Hire' ? 'verdict-strong' : evaluation.verdict === 'Hire' ? 'verdict-hire' : 'verdict-practice'}">
              ${evaluation.verdict}
            </span>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase;">Overall Performance</h3>
            <div class="score-circle">${evaluation.overallScore} <span style="font-size: 18px; color: #94a3b8;">/ 100</span></div>
            <p style="font-size: 13px; color: #334155; margin: 0; text-align: center;">${evaluation.summary}</p>
          </div>
          <div class="card">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; text-transform: uppercase;">Competency Breakdown</h3>
            <div class="metric-row"><span class="metric-label">Technical Proficiency</span><span class="metric-value">${evaluation.dimensionScores.technicalProficiency} / 100</span></div>
            <div class="metric-row"><span class="metric-label">Communication & Clarity</span><span class="metric-value">${evaluation.dimensionScores.communication} / 100</span></div>
            <div class="metric-row"><span class="metric-label">Structure & Depth (STAR)</span><span class="metric-value">${evaluation.dimensionScores.structureSTAR} / 100</span></div>
            <div class="metric-row"><span class="metric-label">Problem Solving</span><span class="metric-value">${evaluation.dimensionScores.problemSolving} / 100</span></div>
            <div class="metric-row"><span class="metric-label">Speech Pace / Fluency</span><span class="metric-value">${evaluation.averageWPM} WPM (${evaluation.totalFillerWords} fillers)</span></div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card" style="border-left: 4px solid #10b981;">
            <h4 style="margin: 0 0 8px 0; color: #047857;">Top Candidate Strengths</h4>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #334155;">
              ${evaluation.topStrengths.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
          <div class="card" style="border-left: 4px solid #f59e0b;">
            <h4 style="margin: 0 0 8px 0; color: #b45309;">Key Growth Areas</h4>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #334155;">
              ${evaluation.keyGrowthAreas.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        </div>

        <h3 class="section-title">Question-by-Question Evaluation</h3>
        ${evaluation.questionEvaluations.map((q, idx) => `
          <div class="q-box">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="q-title">Q${idx + 1}: ${q.questionTitle}</span>
              <span class="pill ${q.score >= 75 ? 'pill-green' : 'pill-red'}">Score: ${q.score}/100</span>
            </div>
            <div style="font-size: 12px; color: #64748b; margin: 4px 0;">Duration: ${q.durationSeconds}s | Pace: ${q.speechPaceWPM} WPM | Filler Words: ${q.fillerWordTotal}</div>
            
            <div class="answer-text">"${q.candidateAnswer}"</div>
            
            <div style="font-size: 13px; margin-top: 6px;">
              <strong>AI Feedback:</strong> ${q.actionableFeedback}
            </div>
          </div>
        `).join('')}

        <div class="footer">
          Generated automatically by InterviewIQ AI Evaluation Engine • Confidential Interview Assessment
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
