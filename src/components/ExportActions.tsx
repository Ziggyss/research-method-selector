import { useState } from 'react';
import { Copy, Download, CheckCheck, ChevronDown, ChevronUp, Link } from 'lucide-react';
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

// Condens-formatted project brief — structured for pasting into a new Condens project document
function planToCondensMarkdown(rec: Recommendation): string {
  const p = rec.starterPlan;
  const lines: string[] = [];

  lines.push(`# ${p.title}`);
  lines.push('');
  lines.push(`> **Before you start:** Remember to add the correct product area and sector tags to this Condens project.`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Project brief');
  lines.push('');
  lines.push('### Background');
  lines.push(p.background);
  lines.push('');
  lines.push('### Decision to support');
  lines.push(p.decision);
  lines.push('');
  lines.push('### Research objectives');
  p.objectives.filter(Boolean).forEach((o) => lines.push(`- ${o}`));
  lines.push('');
  lines.push('### Research questions');
  p.researchQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Study design');
  lines.push('');
  lines.push(`**Recommended method:** ${p.method}`);
  lines.push('');
  lines.push(`**Participants:** ${p.participants}`);
  lines.push('');
  lines.push(`**Recruitment considerations:** ${p.recruitmentConsiderations}`);
  lines.push('');
  lines.push(`**Estimated timeline:** ${p.timeline}`);
  lines.push('');
  lines.push('### Session outline');
  p.sessionOutline.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push('');
  lines.push('### Analysis approach');
  lines.push(p.analysisApproach);
  lines.push('');
  lines.push('### Expected outputs');
  p.outputs.filter(Boolean).forEach((o) => lines.push(`- ${o}`));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Risks and open questions');
  lines.push('');
  if (p.risksAndMitigations.filter(Boolean).length > 0) {
    lines.push('### Risks and mitigations');
    p.risksAndMitigations.filter(Boolean).forEach((r) => lines.push(`- ${r}`));
    lines.push('');
  }
  if (p.openQuestions.filter(Boolean).length > 0) {
    lines.push('### Open questions');
    p.openQuestions.filter(Boolean).forEach((q) => lines.push(`- ${q}`));
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('## Planning checklist');
  lines.push('');
  p.planningChecklist.forEach((c) => lines.push(`- [ ] ${c.item}`));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## What to add as separate Condens documents');
  lines.push('');
  lines.push('- **Discussion guide** — copy from the Discussion guide tab in Research Method Selector');
  lines.push('- **Screening survey** — copy from the Research plan tab');
  lines.push('- **Outreach email** — copy from the Research plan tab');
  lines.push('- **Consent form** — copy from the Research plan tab');
  lines.push('- **Participant tracker** — import the participant CSV exported from Research Method Selector');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`*Generated by OneAdvanced Research Method Selector · Method: ${rec.primaryMethod.name} · Confidence: ${rec.confidence} · Risk: ${rec.riskLevel}*`);
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

function recommendationSummaryText(rec: Recommendation): string {
  const lines: string[] = [];
  lines.push(`Research recommendation: ${rec.primaryMethod.name}`);
  lines.push(`Confidence: ${rec.confidence} | Risk: ${rec.riskLevel}`);
  lines.push('');
  lines.push('Why this fits:');
  rec.rationale.forEach((r) => lines.push(`- ${r}`));
  if (rec.warnings.length > 0) {
    lines.push('');
    lines.push('Watch out for:');
    rec.warnings.forEach((w) => lines.push(`- ${w}`));
  }
  if (rec.supportingMethods.length > 0) {
    lines.push('');
    lines.push(`Supporting methods: ${rec.supportingMethods.map((m) => m.name).join(', ')}`);
  }
  return lines.join('\n');
}

function buildConsentUrl(rec: Recommendation, researcherName: string, researcherEmail: string): string {
  const plan = rec.starterPlan;
  const base = `${window.location.origin}/consent`;
  const params = new URLSearchParams({
    study: plan.title,
    method: rec.primaryMethod.name,
    duration: rec.suggestedDesign.sessionLength,
    aims: plan.objectives.filter(Boolean).slice(0, 3).join('; '),
    ...(researcherName && { researcher: researcherName }),
    ...(researcherEmail && { email: researcherEmail }),
  });
  return `${base}?${params.toString()}`;
}

interface ExportActionsProps {
  recommendation: Recommendation;
  researcherName?: string;
  researcherEmail?: string;
}

export function ExportActions({ recommendation, researcherName = '', researcherEmail = '' }: ExportActionsProps) {
  const [copiedRec, setCopiedRec] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [copiedCondens, setCopiedCondens] = useState(false);
  const [copiedConsentLink, setCopiedConsentLink] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortening, setShortening] = useState(false);
  const [shortenError, setShortenError] = useState(false);
  const [condensGuideOpen, setCondensGuideOpen] = useState(false);

  const copyText = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenUrl = async (url: string) => {
    setShortening(true);
    setShortenError(false);
    try {
      const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.shorturl) {
        setShortUrl(data.shorturl);
      } else {
        setShortenError(true);
      }
    } catch {
      setShortenError(true);
    } finally {
      setShortening(false);
    }
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
      {/* Standard exports */}
      <div className="card">
        <h3 className="text-sm font-semibold text-charcoal mb-3">Export</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copyText(recommendationSummaryText(recommendation), setCopiedRec)}
            className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
          >
            {copiedRec ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
            Copy recommendation
          </button>
          <button
            onClick={() => copyText(planToMarkdown(recommendation), setCopiedPlan)}
            className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
          >
            {copiedPlan ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
            Copy starter plan
          </button>
          <button
            onClick={() => downloadFile(planToMarkdown(recommendation), 'research-plan.md', 'text/markdown')}
            className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
          >
            <Download size={14} />
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
            className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
          >
            <Download size={14} />
            Download JSON
          </button>
        </div>
      </div>

      {/* Consent link */}
      <div className="card">
        <h3 className="text-sm font-semibold text-charcoal mb-0.5">Consent form link</h3>
        <p className="text-xs text-charcoal-muted mb-3">Share with participants so they can sign the consent form before their session</p>
        <div className="bg-warm-50 border border-warm-200 rounded-lg px-3 py-2 mb-3 font-mono text-xs text-charcoal-muted break-all select-all">
          {shortUrl ?? buildConsentUrl(recommendation, researcherName, researcherEmail)}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copyText(shortUrl ?? buildConsentUrl(recommendation, researcherName, researcherEmail), setCopiedConsentLink)}
            className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
          >
            {copiedConsentLink ? <CheckCheck size={14} className="text-green-500" /> : <Link size={14} />}
            {copiedConsentLink ? 'Copied!' : 'Copy link'}
          </button>
          {!shortUrl && (
            <button
              onClick={() => shortenUrl(buildConsentUrl(recommendation, researcherName, researcherEmail))}
              disabled={shortening}
              className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2 disabled:opacity-50"
            >
              {shortening ? 'Shortening…' : 'Shorten URL'}
            </button>
          )}
        </div>
        {shortenError && (
          <p className="text-xs text-red-600 mt-2">Could not shorten URL — copy the full link instead.</p>
        )}
        {(!researcherName || !researcherEmail) && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
            Add your name and email in the Constraints step to include your contact details in the consent form.
          </p>
        )}
      </div>

      {/* Condens exports */}
      <div className="card border-blue-100 bg-blue-50/30">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-charcoal">Export for Condens</h3>
            <p className="text-xs text-charcoal-muted mt-0.5">Formatted for pasting directly into a new Condens project</p>
          </div>
          <button
            onClick={() => setCondensGuideOpen(v => !v)}
            className="inline-flex items-center gap-1 text-xs text-charcoal-muted hover:text-charcoal transition-colors"
          >
            How to use
            {condensGuideOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {condensGuideOpen && (
          <div className="mb-4 bg-white border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-charcoal mb-2">Setting up in Condens</p>
            <ol className="space-y-1.5">
              {[
                'In Condens, create a new project and give it the same name as your plan title.',
                'Add the correct product area and sector tags to the project.',
                'Click "Copy project brief" below and paste it into the project\'s main document.',
                'Add a new document for the discussion guide — copy it from the Discussion guide tab.',
                'Add documents for the screening survey, outreach email, and consent form — copy each from the Research plan tab.',
                'Click "Download participant CSV" and import it into Condens as your participant tracker.',
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-charcoal-muted leading-relaxed">
                  <span className="font-semibold text-charcoal flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copyText(planToCondensMarkdown(recommendation), setCopiedCondens)}
            className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
          >
            {copiedCondens ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
            Copy project brief
          </button>
          <button
            onClick={() => downloadFile(
              planToCondensMarkdown(recommendation),
              'condens-project-brief.md',
              'text/markdown'
            )}
            className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
          >
            <Download size={14} />
            Download project brief
          </button>
          <button
            onClick={() => downloadFile(
              participantCsvTemplate(recommendation),
              'participant-tracker.csv',
              'text/csv'
            )}
            className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
          >
            <Download size={14} />
            Download participant CSV
          </button>
        </div>
      </div>
    </div>
  );
}
