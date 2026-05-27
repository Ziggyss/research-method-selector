import { useState } from 'react';
import { Square, Copy, CheckCheck, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import type { StarterResearchPlan } from '../types/research';

interface ResearchPlanProps {
  plan: StarterResearchPlan;
}

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? '' : 'mb-5 pb-5 border-b border-warm-100'}>
      <h4 className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">{title}</h4>
      {children}
    </div>
  );
}

function ProseBlock({ text }: { text: string }) {
  return (
    <p className="text-sm text-charcoal leading-relaxed bg-warm-50 border border-warm-200 rounded-xl px-4 py-3">
      {text}
    </p>
  );
}

function ListItems({ items }: { items: string[] }) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return <p className="text-sm text-warm-400 italic">Not specified</p>;
  return (
    <ul className="space-y-1.5">
      {filtered.map((item, i) => (
        <li key={i} className="text-sm text-charcoal flex gap-2 leading-relaxed bg-warm-50 border border-warm-100 rounded-lg px-3 py-2">
          <span className="text-warm-400 flex-shrink-0 mt-0.5">—</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-muted hover:text-charcoal border border-warm-200 hover:border-warm-400 bg-white px-3 py-1.5 rounded-lg transition-colors"
    >
      {copied ? <CheckCheck size={13} className="text-green-500" /> : <Copy size={13} />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function CollapsibleCard({ title, badge, copyText, copyLabel, extraActions, children }: {
  title: string;
  badge?: string;
  copyText: string;
  copyLabel: string;
  extraActions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity min-w-0"
          >
            <h3 className="text-base font-semibold text-charcoal">{title}</h3>
            {open ? <ChevronUp size={15} className="text-charcoal-muted flex-shrink-0" /> : <ChevronDown size={15} className="text-charcoal-muted flex-shrink-0" />}
          </button>
          {badge && (
            <span className="text-xs font-medium text-charcoal-muted bg-warm-100 px-2 py-0.5 rounded-full flex-shrink-0">
              {badge}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={copyText} label={copyLabel} />
          {extraActions}
        </div>
      </div>
      {open && <div className="mt-4 pt-4 border-t border-warm-100">{children}</div>}
    </div>
  );
}

function openInOutlook(plan: StarterResearchPlan) {
  const subject = encodeURIComponent(plan.outreachEmail.subject);
  const body = encodeURIComponent(plan.outreachEmail.body);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}


function screeningSurveyText(plan: StarterResearchPlan): string {
  const { screeningSurvey } = plan;
  const lines: string[] = [];
  lines.push('PARTICIPANT SCREENING SURVEY');
  lines.push('');
  lines.push(screeningSurvey.intro);
  lines.push('');
  lines.push('---');
  screeningSurvey.questions.forEach((q, i) => {
    lines.push('');
    lines.push(`${i + 1}. ${q.question}`);
    if (q.options) q.options.forEach((o) => lines.push(`   ○ ${o}`));
    if (q.type === 'yesno') { lines.push('   ○ Yes'); lines.push('   ○ No'); }
    if (q.type === 'text') lines.push('   [Open text field]');
    if (q.screenerNote) lines.push(`   [Screener note: ${q.screenerNote}]`);
  });
  return lines.join('\n');
}

function outreachEmailText(plan: StarterResearchPlan): string {
  return `Subject: ${plan.outreachEmail.subject}\n\n${plan.outreachEmail.body}`;
}


export function ResearchPlan({ plan }: ResearchPlanProps) {
  return (
    <div className="space-y-4">
      {/* Title + background */}
      <div className="card">
        <h2 className="text-xl font-semibold text-charcoal mb-1">{plan.title}</h2>
        <p className="text-sm text-charcoal-muted leading-relaxed">{plan.background}</p>
      </div>

      {/* Decision, objectives, questions */}
      <div className="card">
        <Section title="Decision to support">
          <ProseBlock text={plan.decision} />
        </Section>

        <Section title="Research objectives">
          <ListItems items={plan.objectives} />
        </Section>

        <Section title="Research questions" last>
          <ol className="space-y-2">
            {plan.researchQuestions.map((q, i) => (
              <li key={i} className="text-sm text-charcoal flex gap-2.5 leading-relaxed bg-warm-50 border border-warm-100 rounded-lg px-3 py-2">
                <span className="text-charcoal-muted font-semibold flex-shrink-0">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ol>
        </Section>
      </div>

      {/* Method + participants */}
      <div className="card">
        <Section title="Recommended method">
          <ProseBlock text={plan.method} />
        </Section>

        <Section title="Participants">
          <ProseBlock text={plan.participants} />
        </Section>

        <Section title="Recruitment considerations">
          <ProseBlock text={plan.recruitmentConsiderations} />
        </Section>

        <Section title="Materials needed" last>
          <ListItems items={plan.materialsNeeded} />
        </Section>
      </div>

      {/* Session design */}
      <div className="card">
        <Section title="Session outline">
          <ol className="space-y-2">
            {plan.sessionOutline.map((item, i) => (
              <li key={i} className="text-sm text-charcoal flex gap-2.5 leading-relaxed bg-warm-50 border border-warm-100 rounded-lg px-3 py-2">
                <span className="text-charcoal-muted font-semibold flex-shrink-0">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Data capture">
          <ListItems items={plan.dataCapture} />
        </Section>

        <Section title="Analysis approach" last>
          <ProseBlock text={plan.analysisApproach} />
        </Section>
      </div>

      {/* Outputs, timeline, risks */}
      <div className="card">
        <Section title="Outputs">
          <ListItems items={plan.outputs} />
        </Section>

        <Section title="Timeline">
          <ProseBlock text={plan.timeline} />
        </Section>

        <Section title="Risks and mitigations">
          <ListItems items={plan.risksAndMitigations} />
        </Section>

        <Section title="Open questions" last>
          <ListItems items={plan.openQuestions} />
        </Section>
      </div>

      {/* Planning checklist */}
      <div className="card">
        <h4 className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-3">Planning checklist</h4>
        <ul className="space-y-2">
          {plan.planningChecklist.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 bg-warm-50 border border-warm-100 rounded-lg px-3 py-2.5">
              <Square size={14} className="text-warm-300 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-charcoal">{item.item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Screening survey */}
      <CollapsibleCard
        title="Suggested screening survey"
        badge="Recruitment"
        copyText={screeningSurveyText(plan)}
        copyLabel="Copy survey"
      >
        <div className="mb-4">
          <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">Introduction text</p>
          <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line bg-warm-50 rounded-lg p-4 border border-warm-200">
            {plan.screeningSurvey.intro}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-3">Questions</p>
          <ol className="space-y-3">
            {plan.screeningSurvey.questions.map((q, i) => (
              <li key={i} className="border border-warm-200 rounded-xl p-4 bg-white">
                <p className="text-sm font-medium text-charcoal mb-2">{i + 1}. {q.question}</p>
                {q.options && (
                  <ul className="space-y-1 mb-2">
                    {q.options.map((o, j) => (
                      <li key={j} className="text-sm text-charcoal-muted flex gap-2">
                        <span className="text-warm-300">○</span> {o}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === 'yesno' && (
                  <ul className="space-y-1 mb-2">
                    <li className="text-sm text-charcoal-muted flex gap-2"><span className="text-warm-300">○</span> Yes</li>
                    <li className="text-sm text-charcoal-muted flex gap-2"><span className="text-warm-300">○</span> No</li>
                  </ul>
                )}
                {q.type === 'text' && (
                  <p className="text-sm text-warm-400 italic mb-2">[Open text field]</p>
                )}
                {q.screenerNote && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-2">
                    Screener note: {q.screenerNote}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </CollapsibleCard>

      {/* Outreach email */}
      <CollapsibleCard
        title="Suggested outreach email"
        badge="Recruitment"
        copyText={outreachEmailText(plan)}
        copyLabel="Copy email"
        extraActions={
          <button
            onClick={() => openInOutlook(plan)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-muted hover:text-charcoal border border-warm-200 hover:border-warm-400 bg-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Mail size={13} />
            Open in Outlook
          </button>
        }
      >
        <div className="mb-3">
          <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-1">Subject line</p>
          <p className="text-sm text-charcoal font-medium bg-warm-50 border border-warm-200 rounded-lg px-4 py-2.5">
            {plan.outreachEmail.subject}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">Email body</p>
          <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line bg-warm-50 rounded-lg p-4 border border-warm-200">
            {plan.outreachEmail.body}
          </div>
        </div>
        <p className="text-xs text-charcoal-muted mt-3">
          Placeholders in [brackets] need to be filled in before sending. Review with your legal or comms team if sending externally.
        </p>
      </CollapsibleCard>
    </div>
  );
}
