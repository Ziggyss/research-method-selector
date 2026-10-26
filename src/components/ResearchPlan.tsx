import { useState } from 'react';
import { Square, Copy, CheckCheck, ChevronDown, ChevronUp, Mail, Printer } from 'lucide-react';
import type { StarterResearchPlan } from '../types/research';

interface ResearchPlanProps {
  plan: StarterResearchPlan;
  recommendation: {
    primaryMethod: { name: string };
    suggestedDesign: { sessionLength: string };
  };
  researcherName?: string;
  researcherEmail?: string;
}

function buildConsentUrl(plan: StarterResearchPlan, recommendation: ResearchPlanProps['recommendation'], researcherName: string, researcherEmail: string): string {
  const base = `${window.location.origin}/consent`;
  const params = new URLSearchParams({
    study: plan.title,
    method: recommendation.primaryMethod.name,
    duration: recommendation.suggestedDesign.sessionLength,
    aims: plan.objectives.filter(Boolean).slice(0, 3).join('; '),
    ...(researcherName && { researcher: researcherName }),
    ...(researcherEmail && { email: researcherEmail }),
  });
  return `${base}?${params.toString()}`;
}

function SectionGroup({ label, accent, children }: {
  label: string;
  accent: 'purple' | 'blue' | 'green' | 'amber' | 'teal';
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    purple: 'border-brand-purple bg-purple-50/70 text-brand-purple',
    blue:   'border-blue-400 bg-blue-50/70 text-blue-700',
    green:  'border-green-500 bg-green-50/70 text-green-700',
    amber:  'border-amber-400 bg-amber-50/70 text-amber-700',
    teal:   'border-teal-500 bg-teal-50/70 text-teal-700',
  };
  return (
    <div className="space-y-3">
      <div className={`border-l-4 pl-3 py-1.5 rounded-r-lg ${styles[accent]}`}>
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? '' : 'mb-5 pb-5 border-b border-warm-100'}>
      <h4 className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">{title}</h4>
      {children}
    </div>
  );
}

function EditableProseBlock({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      className="w-full text-sm text-charcoal leading-relaxed bg-warm-50 border border-warm-200 rounded-xl px-4 py-3 resize-y min-h-[60px] focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function EditableListItems({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const filtered = items.filter(Boolean);
  const updateItem = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const addItem = () => onChange([...items, '']);
  if (filtered.length === 0 && items.length === 0) {
    return (
      <button onClick={addItem} className="text-xs text-brand-purple hover:underline">+ Add item</button>
    );
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 items-start">
          <textarea
            className="flex-1 text-sm text-charcoal leading-relaxed bg-warm-50 border border-warm-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
            rows={2}
            value={item}
            onChange={e => updateItem(i, e.target.value)}
          />
          <button
            onClick={() => removeItem(i)}
            className="text-warm-300 hover:text-red-400 transition-colors mt-2 flex-shrink-0 text-lg leading-none"
            title="Remove"
          >×</button>
        </li>
      ))}
      <button onClick={addItem} className="text-xs text-brand-purple hover:underline mt-1">+ Add item</button>
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

function printConsentForm(plan: StarterResearchPlan) {
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="34" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/></svg>`;
  const sectionsHtml = plan.consentForm.sections.map((s, i) => {
    const isLast = i === plan.consentForm.sections.length - 1;
    return `<div class="section${isLast ? ' note' : ''}"><h3>${s.heading}</h3><p>${s.content.replace(/\n/g, '<br/>')}</p></div>`;
  }).join('');
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Participant Consent Form</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a1a;background:white}.page{max-width:720px;margin:0 auto;padding:40px 48px}.header{display:flex;align-items:center;gap:12px;padding-bottom:20px;border-bottom:2px solid #863bff;margin-bottom:28px}.header-org{font-size:15pt;font-weight:700;color:#1a1a1a}.header-sub{font-size:9pt;color:#666;margin-top:1px}h1{font-size:16pt;font-weight:700;margin-bottom:6px}.meta{font-size:9pt;color:#666;margin-bottom:28px}.section{margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid #e8e4df}.section:last-child{border-bottom:none}.section.note{background:#fffbf0;border:1px solid #f5e6b2;border-radius:6px;padding:14px 16px;margin-top:28px}.section.note h3{color:#92700a}h3{font-size:10pt;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#555;margin-bottom:8px}p{line-height:1.6;color:#2d2d2d;white-space:pre-wrap}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e8e4df;font-size:8pt;color:#999}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.no-print{display:none}.page{padding:20px 28px}}</style></head><body><div class="page"><div class="header">${logoSvg}<div><div class="header-org">ApprovalMax</div><div class="header-sub">Research &amp; UX</div></div></div><h1>Participant Consent Form</h1><p class="meta">Study: ${plan.title} &nbsp;|&nbsp; Date: _______________</p>${sectionsHtml}<div class="footer">ApprovalMax Ltd &nbsp;·&nbsp; www.oneadvanced.com &nbsp;·&nbsp; Generated by Research Method Selector</div></div><div class="no-print" style="text-align:center;padding:16px;background:#f5f3ef;"><button onclick="window.print()" style="background:#863bff;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">Print / Save as PDF</button></div></body></html>`;
  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
}

function consentFormText(plan: StarterResearchPlan): string {
  const lines: string[] = ['PARTICIPANT CONSENT FORM', ''];
  plan.consentForm.sections.forEach((s) => {
    lines.push(s.heading.toUpperCase());
    lines.push('');
    lines.push(s.content);
    lines.push('');
    lines.push('---');
    lines.push('');
  });
  return lines.join('\n');
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


export function ResearchPlan({ plan, recommendation, researcherName = '', researcherEmail = '' }: ResearchPlanProps) {
  const [editedPlan, setEditedPlan] = useState<StarterResearchPlan>(plan);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortening, setShortening] = useState(false);
  const [shortenError, setShortenError] = useState(false);
  const [copiedConsentLink, setCopiedConsentLink] = useState(false);

  const updatePlan = <K extends keyof StarterResearchPlan>(key: K, value: StarterResearchPlan[K]) => {
    setEditedPlan(prev => ({ ...prev, [key]: value }));
  };

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
      if (data.shorturl) setShortUrl(data.shorturl);
      else setShortenError(true);
    } catch { setShortenError(true); }
    finally { setShortening(false); }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-2 text-xs text-charcoal-muted bg-warm-50 border border-warm-200 rounded-lg px-3 py-2">
        <span className="text-brand-purple">✎</span>
        All fields are editable — click any text to make changes
      </div>

      {/* Study brief */}
      <SectionGroup label="Study brief" accent="purple">
        <div className="card">
          <input
            type="text"
            className="text-xl font-semibold text-charcoal bg-transparent border-b border-transparent hover:border-warm-300 focus:border-brand-purple focus:outline-none w-full transition-colors pb-0.5"
            value={editedPlan.title}
            onChange={e => updatePlan('title', e.target.value)}
          />
          <textarea
            className="w-full text-sm text-charcoal-muted leading-relaxed bg-transparent border-b border-transparent hover:border-warm-200 focus:border-brand-purple focus:outline-none resize-y min-h-[48px] transition-colors"
            value={editedPlan.background}
            onChange={e => updatePlan('background', e.target.value)}
          />
        </div>
        <div className="card">
          <Section title="Decision to support">
            <EditableProseBlock value={editedPlan.decision} onChange={v => updatePlan('decision', v)} />
          </Section>
          <Section title="Research objectives">
            <EditableListItems items={editedPlan.objectives} onChange={v => updatePlan('objectives', v)} />
          </Section>
          <Section title="Research questions" last>
            <ol className="space-y-2">
              {editedPlan.researchQuestions.map((q, i) => (
                <li key={i} className="flex gap-2.5 items-start bg-warm-50 border border-warm-100 rounded-lg px-3 py-2">
                  <span className="text-charcoal-muted font-semibold flex-shrink-0 mt-1">{i + 1}.</span>
                  <textarea
                    className="flex-1 text-sm text-charcoal leading-relaxed resize-none bg-transparent focus:outline-none"
                    rows={2}
                    value={q}
                    onChange={e => {
                      const next = [...editedPlan.researchQuestions];
                      next[i] = e.target.value;
                      updatePlan('researchQuestions', next);
                    }}
                  />
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </SectionGroup>

      {/* Study design */}
      <SectionGroup label="Study design" accent="blue">
        <div className="card">
          <Section title="Recommended method">
            <EditableProseBlock value={editedPlan.method} onChange={v => updatePlan('method', v)} />
          </Section>
          <Section title="Participants">
            <EditableProseBlock value={editedPlan.participants} onChange={v => updatePlan('participants', v)} />
          </Section>
          <Section title="Recruitment considerations">
            <EditableProseBlock value={editedPlan.recruitmentConsiderations} onChange={v => updatePlan('recruitmentConsiderations', v)} />
          </Section>
          <Section title="Materials needed" last>
            <EditableListItems items={editedPlan.materialsNeeded} onChange={v => updatePlan('materialsNeeded', v)} />
          </Section>
        </div>
      </SectionGroup>

      {/* Fieldwork */}
      <SectionGroup label="Fieldwork" accent="green">
        <div className="card">
          <Section title="Session outline">
            <ol className="space-y-2">
              {editedPlan.sessionOutline.map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start bg-warm-50 border border-warm-100 rounded-lg px-3 py-2">
                  <span className="text-charcoal-muted font-semibold flex-shrink-0 mt-1">{i + 1}.</span>
                  <textarea
                    className="flex-1 text-sm text-charcoal leading-relaxed resize-none bg-transparent focus:outline-none"
                    rows={2}
                    value={item}
                    onChange={e => {
                      const next = [...editedPlan.sessionOutline];
                      next[i] = e.target.value;
                      updatePlan('sessionOutline', next);
                    }}
                  />
                </li>
              ))}
            </ol>
          </Section>
          <Section title="Data capture">
            <EditableListItems items={editedPlan.dataCapture} onChange={v => updatePlan('dataCapture', v)} />
          </Section>
          <Section title="Analysis approach" last>
            <EditableProseBlock value={editedPlan.analysisApproach} onChange={v => updatePlan('analysisApproach', v)} />
          </Section>
        </div>
      </SectionGroup>

      {/* Outcomes */}
      <SectionGroup label="Outcomes" accent="amber">
        <div className="card">
          <Section title="Outputs">
            <EditableListItems items={editedPlan.outputs} onChange={v => updatePlan('outputs', v)} />
          </Section>
          <Section title="Timeline">
            <EditableProseBlock value={editedPlan.timeline} onChange={v => updatePlan('timeline', v)} />
          </Section>
          <Section title="Risks and mitigations">
            <EditableListItems items={editedPlan.risksAndMitigations} onChange={v => updatePlan('risksAndMitigations', v)} />
          </Section>
          <Section title="Open questions" last>
            <EditableListItems items={editedPlan.openQuestions} onChange={v => updatePlan('openQuestions', v)} />
          </Section>
        </div>
      </SectionGroup>

      {/* Preparation */}
      <div className="card">
        <h4 className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-4">Planning checklist</h4>
        <div className="space-y-5">
          {Array.from(new Set(editedPlan.planningChecklist.map((c) => c.group))).map((group) => (
            <div key={group}>
              <p className={`text-xs font-semibold mb-2 ${group === 'Regulated / high-risk' ? 'text-amber-700' : 'text-charcoal'}`}>
                {group}
              </p>
              <ul className="space-y-1.5">
                {editedPlan.planningChecklist.filter((c) => c.group === group).map((item, i) => (
                  <li key={i} className={`flex items-start gap-2.5 rounded-lg px-3 py-2 ${group === 'Regulated / high-risk' ? 'bg-amber-50 border border-amber-100' : 'bg-warm-50 border border-warm-100'}`}>
                    <Square size={13} className={`flex-shrink-0 mt-0.5 ${group === 'Regulated / high-risk' ? 'text-amber-400' : 'text-warm-300'}`} />
                    <span className="text-sm text-charcoal">{item.item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Participant communications */}
      <SectionGroup label="Participant communications" accent="teal">
        {/* Consent link */}
        <div className="card">
          <h3 className="text-base font-semibold text-charcoal mb-0.5">Consent form link</h3>
          <p className="text-xs text-charcoal-muted mb-3">Send this to participants before their session — opens a digital consent form pre-filled with study details</p>
          <div className="bg-warm-50 border border-warm-200 rounded-lg px-3 py-2 mb-3 font-mono text-xs text-charcoal-muted overflow-hidden">
            <span className="block truncate select-all">
              {shortUrl ?? buildConsentUrl(plan, recommendation, researcherName, researcherEmail)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyText(shortUrl ?? buildConsentUrl(plan, recommendation, researcherName, researcherEmail), setCopiedConsentLink)}
              className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
            >
              {copiedConsentLink ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
              {copiedConsentLink ? 'Copied!' : 'Copy link'}
            </button>
            {!shortUrl && (
              <button
                onClick={() => shortenUrl(buildConsentUrl(plan, recommendation, researcherName, researcherEmail))}
                disabled={shortening}
                className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2 disabled:opacity-50"
              >
                {shortening ? 'Shortening…' : 'Shorten URL'}
              </button>
            )}
          </div>
          {shortenError && <p className="text-xs text-red-600 mt-2">Could not shorten URL — copy the full link instead.</p>}
          {(!researcherName || !researcherEmail) && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
              Add your name and email on step 1 to include your contact details in the consent form.
            </p>
          )}
        </div>

        {/* Screening survey */}
        <CollapsibleCard
          title="Suggested screening survey"
          badge="Recruitment"
          copyText={screeningSurveyText(editedPlan)}
          copyLabel="Copy survey"
        >
          <div className="mb-4">
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">Introduction text</p>
            <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line bg-warm-50 rounded-lg p-4 border border-warm-200">
              {editedPlan.screeningSurvey.intro}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-3">Questions</p>
            <ol className="space-y-3">
              {editedPlan.screeningSurvey.questions.map((q, i) => (
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
          copyText={outreachEmailText(editedPlan)}
          copyLabel="Copy email"
          extraActions={
            <button
              onClick={() => openInOutlook(editedPlan)}
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
              {editedPlan.outreachEmail.subject}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">Email body</p>
            <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line bg-warm-50 rounded-lg p-4 border border-warm-200">
              {editedPlan.outreachEmail.body}
            </div>
          </div>
          <p className="text-xs text-charcoal-muted mt-3">
            Placeholders in [brackets] need to be filled in before sending. Review with your legal or comms team if sending externally.
          </p>
        </CollapsibleCard>

        {/* Consent form */}
        <CollapsibleCard
          title="Suggested consent form"
          badge="Ethics & data"
          copyText={consentFormText(editedPlan)}
          copyLabel="Copy text"
          extraActions={
            <button
              onClick={() => printConsentForm(editedPlan)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-muted hover:text-charcoal border border-warm-200 hover:border-warm-400 bg-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <Printer size={13} />
              Print / PDF
            </button>
          }
        >
          <div className="space-y-4">
            {editedPlan.consentForm.sections.map((s, i) => (
              <div key={i} className={i === editedPlan.consentForm.sections.length - 1 ? 'bg-amber-50 border border-amber-100 rounded-xl p-4' : 'bg-warm-50 border border-warm-100 rounded-xl p-4'}>
                <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">{s.heading}</p>
                <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-charcoal-muted mt-4 border-t border-warm-100 pt-3">
            This is a starting point only. Always review consent forms with your legal, data protection, or ethics team before use.
          </p>
        </CollapsibleCard>
      </SectionGroup>

    </div>
  );
}
