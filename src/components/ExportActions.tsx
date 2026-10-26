import { useState } from 'react';
import { Copy, Download, CheckCheck } from 'lucide-react';
import type { Recommendation } from '../types/research';

function planToMarkdown(rec: Recommendation): string {
  const p = rec.starterPlan;
  const lines: string[] = [];
  lines.push(`# ${p.title}`);
  lines.push('');
  lines.push(`## Background`);
  lines.push(p.background);
  lines.push('');
  lines.push(`## Decision to support`);
  lines.push(p.decision);
  lines.push('');
  lines.push(`## Research objectives`);
  p.objectives.filter(Boolean).forEach((o) => lines.push(`- ${o}`));
  lines.push('');
  lines.push(`## Research questions`);
  p.researchQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  lines.push('');
  lines.push(`## Recommended method`);
  lines.push(p.method);
  lines.push('');
  lines.push(`## Participants`);
  lines.push(p.participants);
  lines.push('');
  lines.push(`## Recruitment considerations`);
  lines.push(p.recruitmentConsiderations);
  lines.push('');
  lines.push(`## Materials needed`);
  p.materialsNeeded.forEach((m) => lines.push(`- ${m}`));
  lines.push('');
  lines.push(`## Session outline`);
  p.sessionOutline.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push('');
  lines.push(`## Data capture`);
  p.dataCapture.forEach((d) => lines.push(`- ${d}`));
  lines.push('');
  lines.push(`## Analysis approach`);
  lines.push(p.analysisApproach);
  lines.push('');
  lines.push(`## Outputs`);
  p.outputs.filter(Boolean).forEach((o) => lines.push(`- ${o}`));
  lines.push('');
  lines.push(`## Timeline`);
  lines.push(p.timeline);
  lines.push('');
  lines.push(`## Risks and mitigations`);
  p.risksAndMitigations.filter(Boolean).forEach((r) => lines.push(`- ${r}`));
  lines.push('');
  lines.push(`## Open questions`);
  p.openQuestions.filter(Boolean).forEach((q) => lines.push(`- ${q}`));
  lines.push('');
  lines.push(`## Planning checklist`);
  p.planningChecklist.forEach((c) => lines.push(`- [ ] ${c.item}`));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Screening survey');
  lines.push('');
  lines.push(p.screeningSurvey.intro);
  lines.push('');
  p.screeningSurvey.questions.forEach((q, i) => {
    lines.push(`${i + 1}. ${q.question}`);
    if (q.options) q.options.forEach((o) => lines.push(`   - ${o}`));
    if (q.type === 'yesno') { lines.push('   - Yes'); lines.push('   - No'); }
    if (q.type === 'text') lines.push('   *(Open text)*');
    if (q.screenerNote) lines.push(`   > Screener note: ${q.screenerNote}`);
    lines.push('');
  });
  lines.push('---');
  lines.push('');
  lines.push('## Outreach email');
  lines.push('');
  lines.push(`**Subject:** ${p.outreachEmail.subject}`);
  lines.push('');
  lines.push(p.outreachEmail.body);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Consent form');
  lines.push('');
  p.consentForm.sections.forEach((s) => {
    lines.push(`### ${s.heading}`);
    lines.push('');
    lines.push(s.content);
    lines.push('');
  });
  lines.push('---');
  lines.push('');
  lines.push(`**Primary method:** ${rec.primaryMethod.name}`);
  lines.push(`**Confidence:** ${rec.confidence}`);
  lines.push(`**Risk level:** ${rec.riskLevel}`);
  return lines.join('\n');
}

// Condens-formatted project brief — clean plain text for pasting into a Condens project document
function planToCondensText(rec: Recommendation): string {
  const p = rec.starterPlan;
  const divider = '──────────────────────────────────────────────────';
  const lines: string[] = [];

  lines.push('RESEARCH PLAN');
  lines.push(p.title);
  lines.push(`Method: ${rec.primaryMethod.name}  |  Confidence: ${rec.confidence}  |  Risk: ${rec.riskLevel}`);
  lines.push('');
  lines.push(divider);
  lines.push('');
  lines.push('BACKGROUND');
  lines.push('');
  lines.push(p.background);
  lines.push('');
  lines.push('DECISION TO SUPPORT');
  lines.push('');
  lines.push(p.decision);
  lines.push('');
  lines.push('RESEARCH OBJECTIVES');
  lines.push('');
  p.objectives.filter(Boolean).forEach((o) => lines.push(`  • ${o}`));
  lines.push('');
  lines.push('RESEARCH QUESTIONS');
  lines.push('');
  p.researchQuestions.forEach((q, i) => lines.push(`  ${i + 1}. ${q}`));
  lines.push('');
  lines.push(divider);
  lines.push('');
  lines.push('STUDY DESIGN');
  lines.push('');
  lines.push('Method');
  lines.push(p.method);
  lines.push('');
  lines.push('Participants');
  lines.push(p.participants);
  lines.push('');
  lines.push('Recruitment');
  lines.push(p.recruitmentConsiderations);
  lines.push('');
  lines.push('Timeline');
  lines.push(p.timeline);
  lines.push('');
  lines.push('SESSION OUTLINE');
  lines.push('');
  p.sessionOutline.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
  lines.push('');
  lines.push('DATA CAPTURE');
  lines.push('');
  p.dataCapture.forEach((d) => lines.push(`  • ${d}`));
  lines.push('');
  lines.push('ANALYSIS APPROACH');
  lines.push('');
  lines.push(p.analysisApproach);
  lines.push('');
  lines.push(divider);
  lines.push('');
  lines.push('OUTPUTS');
  lines.push('');
  p.outputs.filter(Boolean).forEach((o) => lines.push(`  • ${o}`));
  lines.push('');
  lines.push('RISKS AND MITIGATIONS');
  lines.push('');
  p.risksAndMitigations.filter(Boolean).forEach((r) => lines.push(`  • ${r}`));
  lines.push('');
  lines.push('OPEN QUESTIONS');
  lines.push('');
  p.openQuestions.filter(Boolean).forEach((q) => lines.push(`  • ${q}`));
  lines.push('');
  lines.push(divider);
  lines.push('');
  lines.push('PLANNING CHECKLIST');
  lines.push('');
  Array.from(new Set(p.planningChecklist.map((c) => c.group))).forEach((group) => {
    lines.push(group);
    p.planningChecklist.filter((c) => c.group === group).forEach((c) => lines.push(`  ☐  ${c.item}`));
    lines.push('');
  });
  lines.push(divider);
  lines.push('');
  lines.push('Add as separate Condens documents:');
  lines.push('  • Discussion guide — copy from the Discussion guide tab');
  lines.push('  • Screening survey — copy from the Research plan tab');
  lines.push('  • Outreach email — copy from the Research plan tab');
  lines.push('  • Consent form — copy from the Research plan tab');
  lines.push('  • Participant tracker — import the CSV from Research Method Selector');
  lines.push('');
  lines.push('Remember to add product area and sector tags to the Condens project.');
  lines.push('');
  lines.push(divider);
  lines.push('Generated by ApprovalMax Research Method Selector');
  return lines.join('\n');
}

// Participant tracker CSV — headers match a typical Condens participant import
function participantCsvTemplate(rec: Recommendation): string {
  const questions = rec.starterPlan.screeningSurvey.questions;

  // Fixed columns
  const fixedHeaders = [
    'Participant ID',
    'Full name',
    'Email address',
    'Organisation',
    'Role / job title',
    'Recruited (Y/N)',
    'Session date',
    'Session time',
    'Session format',
    'Notes',
  ];

  // One column per screener question
  const screenerHeaders = questions.map((q, i) => `Screener Q${i + 1}: ${q.question.replace(/,/g, ' ')}`);

  const headers = [...fixedHeaders, ...screenerHeaders];

  // Include screener answer options as a reference row (row 2, marked as a guide)
  const optionRow = [
    '(example)',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ...questions.map((q) => {
      if (q.options) return q.options.join(' / ');
      if (q.type === 'yesno') return 'Yes / No';
      if (q.type === 'text') return '(open text)';
      return '';
    }),
  ];

  const csvRows = [
    headers.map(h => `"${h}"`).join(','),
    optionRow.map(v => `"${v}"`).join(','),
  ];

  return csvRows.join('\n');
}

interface ExportActionsProps {
  recommendation: Recommendation;
}

export function ExportActions({ recommendation }: ExportActionsProps) {
  const [copiedCondens, setCopiedCondens] = useState(false);

  const copyText = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* Save plan */}
      <div className="card bg-warm-50">
        <h3 className="text-sm font-semibold text-charcoal mb-3">Save plan</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => downloadFile(planToMarkdown(recommendation), 'research-plan.md', 'text/markdown')}
            className="btn-secondary text-xs py-1.5 inline-flex items-center gap-1.5"
          >
            <Download size={13} />
            Download Markdown
          </button>
          <button
            onClick={() =>
              downloadFile(
                JSON.stringify({ recommendation }, null, 2),
                'research-recommendation.json',
                'application/json'
              )
            }
            className="btn-secondary text-xs py-1.5 inline-flex items-center gap-1.5"
          >
            <Download size={13} />
            Download JSON
          </button>
        </div>
      </div>

      {/* Condens exports */}
      <div className="card border-brand-purple/20 bg-purple-50/30">
        <h3 className="text-sm font-semibold text-charcoal mb-1">Set up in Condens</h3>
        <p className="text-xs text-charcoal-muted mb-3">Plain text format — paste directly into a new Condens project document.</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copyText(planToCondensText(recommendation), setCopiedCondens)}
            className="btn-secondary text-xs py-1.5 inline-flex items-center gap-1.5"
          >
            {copiedCondens ? <CheckCheck size={13} className="text-green-500" /> : <Copy size={13} />}
            Copy plan text
          </button>
          <button
            onClick={() => downloadFile(
              participantCsvTemplate(recommendation),
              'participant-tracker.csv',
              'text/csv'
            )}
            className="btn-secondary text-xs py-1.5 inline-flex items-center gap-1.5"
          >
            <Download size={13} />
            Download participant CSV
          </button>
        </div>
      </div>
    </div>
  );
}
