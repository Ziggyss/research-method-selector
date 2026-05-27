import { useState, useRef } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { checkQuestions } from '../logic/biasChecker';
import type { QuestionCheck, BiasType } from '../logic/biasChecker';

const SEVERITY_STYLES: Record<'warning' | 'suggestion', string> = {
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  suggestion: 'bg-blue-50 border-blue-200 text-blue-700',
};

const TYPE_LABELS: Record<BiasType, string> = {
  leading: 'Leading',
  closed: 'Closed question',
  double_barreled: 'Double-barreled',
  assumption: 'Assumption',
  accusatory: 'Accusatory framing',
  multiple_questions: 'Multiple questions',
  absolute: 'Absolute language',
  hypothetical: 'Hypothetical / future-facing',
};

function QuestionResult({ check, index }: { check: QuestionCheck; index: number }) {
  const clean = check.issues.length === 0;
  return (
    <div className={`rounded-xl border p-4 ${clean ? 'border-green-200 bg-green-50' : 'border-warm-200 bg-white'}`}>
      <div className="flex items-start gap-2.5 mb-2">
        {clean
          ? <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
          : <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
        }
        <p className="text-sm font-medium text-charcoal leading-snug">
          <span className="text-charcoal-muted mr-1.5">{index + 1}.</span>
          {check.raw}
        </p>
      </div>
      {clean
        ? <p className="text-xs text-green-700 pl-6">No issues detected.</p>
        : (
          <div className="pl-6 space-y-2.5 mt-3">
            {check.issues.map((issue, i) => (
              <div key={i} className={`rounded-lg border px-3 py-2.5 text-xs ${SEVERITY_STYLES[issue.severity]}`}>
                <p className="font-semibold mb-0.5">{TYPE_LABELS[issue.type]} — {issue.label}</p>
                <p className="leading-relaxed mb-1">{issue.explanation}</p>
                <p className="opacity-80"><span className="font-medium">Suggestion:</span> {issue.tip}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

export function BiasChecker() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<QuestionCheck[] | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const totalIssues = results?.reduce((acc, r) => acc + r.issues.length, 0) ?? 0;
  const cleanCount = results?.filter(r => r.issues.length === 0).length ?? 0;

  const run = () => {
    const checks = checkQuestions(input);
    setResults(checks.length > 0 ? checks : null);
  };

  const reset = () => {
    setInput('');
    setResults(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={15} className="text-charcoal-muted" />
          <h3 className="text-base font-semibold text-charcoal">Question bias checker</h3>
        </div>
        <p className="text-sm text-charcoal-muted leading-relaxed mb-4">
          Paste your interview or survey questions below — one per line. The checker will flag leading questions, assumptions, closed questions, and other common pitfalls.
        </p>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          placeholder={`Enter your questions here, one per line. For example:\n\nDon't you find the current process confusing?\nCan you walk me through a recent time you used the system?\nWhy do you enjoy using the tool?`}
          className="input-field w-full text-sm font-mono resize-y"
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={run}
            disabled={!input.trim()}
            className="btn-primary text-sm py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check questions
          </button>
          {results && (
            <button onClick={reset} className="btn-secondary text-sm py-2 inline-flex items-center gap-1.5">
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {results && (
        <>
          {/* Summary bar */}
          <div className={`rounded-xl border px-4 py-3 flex items-center gap-2.5 ${totalIssues === 0 ? 'bg-green-50 border-green-200' : 'bg-warm-100 border-warm-200'}`}>
            {totalIssues === 0
              ? <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
              : <Info size={15} className="text-charcoal-muted flex-shrink-0" />
            }
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {totalIssues === 0
                ? `All ${results.length} question${results.length !== 1 ? 's' : ''} look good — no issues detected.`
                : `${totalIssues} issue${totalIssues !== 1 ? 's' : ''} found across ${results.length - cleanCount} of ${results.length} question${results.length !== 1 ? 's' : ''}. ${cleanCount > 0 ? `${cleanCount} question${cleanCount !== 1 ? 's' : ''} passed with no issues.` : ''}`
              }
            </p>
          </div>

          <div className="space-y-3">
            {results.map((check, i) => (
              <QuestionResult key={i} check={check} index={i} />
            ))}
          </div>

          <div className="bg-warm-50 border border-warm-200 rounded-xl px-4 py-3">
            <p className="text-xs text-charcoal-muted leading-relaxed">
              <span className="font-semibold">Remember:</span> Automated checks can't catch every issue — review your questions with a colleague before use. Even well-worded questions can lead if the order or framing of the overall guide pushes participants in a particular direction.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
