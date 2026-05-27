import { useState } from 'react';
import { Copy, CheckCheck, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { generateDiscussionGuide, guideToText } from '../logic/discussionGuideGenerator';
import type { StarterResearchPlan, ResearchMethod } from '../types/research';

interface DiscussionGuideProps {
  plan: StarterResearchPlan;
  method: ResearchMethod;
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

function CollapsibleSection({ heading, durationHint, facilNotes, questions, index }: {
  heading: string;
  durationHint: string;
  facilNotes?: string;
  questions: string[];
  index: number;
}) {
  const [open, setOpen] = useState(index <= 1);
  const isProbeBank = heading.toLowerCase().includes('probe');
  return (
    <div className={`border rounded-xl overflow-hidden ${isProbeBank ? 'border-blue-100' : 'border-warm-200'}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 transition-colors text-left ${isProbeBank ? 'bg-blue-50 hover:bg-blue-100' : 'bg-warm-50 hover:bg-warm-100'}`}
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronUp size={14} className="text-charcoal-muted flex-shrink-0" /> : <ChevronDown size={14} className="text-charcoal-muted flex-shrink-0" />}
          <span className="text-sm font-semibold text-charcoal">{heading}</span>
        </div>
        <span className="text-xs text-charcoal-muted whitespace-nowrap">{durationHint}</span>
      </button>
      {open && (
        <div className="px-4 py-4 bg-white">
          {facilNotes && (
            <p className="text-xs text-charcoal-muted bg-warm-50 border border-warm-200 rounded-lg px-3 py-2 mb-4 leading-relaxed">
              <span className="font-semibold">Facilitator note:</span> {facilNotes}
            </p>
          )}
          {isProbeBank ? (
            <ul className="space-y-2">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-charcoal leading-relaxed">
                  <span className="text-blue-300 flex-shrink-0 mt-0.5">—</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="space-y-2.5">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-3 text-sm text-charcoal leading-relaxed">
                  <span className="text-charcoal-muted font-medium flex-shrink-0 w-4 text-right">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

export function DiscussionGuide({ plan, method }: DiscussionGuideProps) {
  const guide = generateDiscussionGuide(plan, method);
  const fullText = guideToText(guide);
  const [introOpen, setIntroOpen] = useState(false);
  const [closingOpen, setClosingOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="card">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-charcoal-muted" />
            <h3 className="text-base font-semibold text-charcoal">{guide.title}</h3>
          </div>
          <CopyButton text={fullText} label="Copy full guide" />
        </div>
        <p className="text-xs text-charcoal-muted mb-1">
          Estimated session length: <span className="font-medium text-charcoal">{guide.totalDurationHint}</span>
        </p>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          This is a suggested starting point — adapt questions to your context and the participant's responses. The best conversations follow the participant, not the script.
        </p>
      </div>

      {/* Introduction */}
      <div className="border border-warm-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setIntroOpen(v => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-warm-50 hover:bg-warm-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            {introOpen ? <ChevronUp size={14} className="text-charcoal-muted flex-shrink-0" /> : <ChevronDown size={14} className="text-charcoal-muted flex-shrink-0" />}
            <span className="text-sm font-semibold text-charcoal">Introduction script</span>
          </div>
          <span className="text-xs text-charcoal-muted">Read aloud to participant</span>
        </button>
        {introOpen && (
          <div className="px-4 py-4 bg-white">
            <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">{guide.intro}</p>
          </div>
        )}
      </div>

      {/* Sections */}
      {guide.sections.map((s, i) => (
        <CollapsibleSection
          key={i}
          index={i}
          heading={s.heading}
          durationHint={s.durationHint}
          facilNotes={s.facilNotes}
          questions={s.questions}
        />
      ))}

      {/* Closing */}
      <div className="border border-warm-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setClosingOpen(v => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-warm-50 hover:bg-warm-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            {closingOpen ? <ChevronUp size={14} className="text-charcoal-muted flex-shrink-0" /> : <ChevronDown size={14} className="text-charcoal-muted flex-shrink-0" />}
            <span className="text-sm font-semibold text-charcoal">Closing script</span>
          </div>
          <span className="text-xs text-charcoal-muted">Read aloud to participant</span>
        </button>
        {closingOpen && (
          <div className="px-4 py-4 bg-white">
            <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">{guide.closing}</p>
          </div>
        )}
      </div>

      <div className="bg-warm-50 border border-warm-200 rounded-xl px-4 py-3">
        <p className="text-xs text-charcoal-muted leading-relaxed">
          <span className="font-semibold">Tip:</span> Pilot the guide with a colleague before your first real session. Run through it as if they are a participant — it will surface gaps, timing issues, and awkward phrasing before they matter.
        </p>
      </div>
    </div>
  );
}
