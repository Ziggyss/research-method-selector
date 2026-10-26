import { AlertTriangle, CheckCircle2, Info, TrendingUp } from 'lucide-react';
import type { Recommendation } from '../types/research';

interface RecommendationSummaryProps {
  recommendation: Recommendation;
  onViewPlan: () => void;
}

export function RecommendationSummary({ recommendation, onViewPlan }: RecommendationSummaryProps) {
  const { primaryMethod, supportingMethods, confidence, riskLevel, effort, rationale, warnings, suggestedDesign, assumptions, limitations, whatIncreasesConfidence, nextActions } = recommendation;

  const riskBadge = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-amber-100 text-amber-800',
    critical: 'bg-red-100 text-red-800',
  }[riskLevel];

  const riskLabel = { low: 'Low risk', medium: 'Medium risk', high: 'High risk', critical: 'Critical risk' }[riskLevel];
  const confidenceClass = confidence === 'High' ? 'confidence-high' : confidence === 'Medium' ? 'confidence-medium' : 'confidence-low';

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="bg-warm-100 border border-warm-200 rounded-xl px-4 py-3 flex gap-2.5 items-start">
        <Info size={15} className="text-charcoal-muted flex-shrink-0 mt-0.5" />
        <p className="text-xs text-charcoal-muted leading-relaxed">
          This recommendation is a planning scaffold to support decision-making — not a final prescription or compliance sign-off. Researcher judgement should always inform the final approach.
        </p>
      </div>

      {/* Summary card */}
      <div className="card">
        <div className="mb-4">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-1">Primary recommendation</p>
              <h2 className="text-xl sm:text-2xl font-semibold text-charcoal">{primaryMethod.name}</h2>
              <p className="text-sm text-charcoal-muted mt-1">{primaryMethod.category}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${confidenceClass}`}>
              {confidence} confidence
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${riskBadge}`}>
              {riskLabel}
            </span>
            {effort && (
              <span className="bg-warm-100 text-charcoal-muted px-2.5 py-0.5 rounded-full text-xs font-medium">
                {effort}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-charcoal-muted leading-relaxed mb-4">{primaryMethod.description}</p>

        {supportingMethods.length > 0 && (
          <div>
            <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-2">Supporting methods</p>
            <div className="flex flex-wrap gap-2">
              {supportingMethods.map((m) => (
                <span key={m.id} className="bg-warm-100 text-charcoal px-3 py-1 rounded-full text-sm font-medium">
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-warm-100">
          <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-1">Best next action</p>
          <p className="text-sm text-charcoal">{nextActions[0]}</p>
        </div>
      </div>

      {/* Why this method fits */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} className="text-charcoal-muted" />
          <h3 className="text-base font-semibold text-charcoal">Why this method fits</h3>
        </div>
        <ul className="space-y-2">
          {rationale.map((r, i) => (
            <li key={i} className="text-sm text-charcoal-muted leading-relaxed flex gap-2">
              <span className="text-warm-400 mt-0.5 flex-shrink-0">—</span>
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-warm-100">
          <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-2">Good for</p>
          <ul className="space-y-1">
            {primaryMethod.goodFor.slice(0, 4).map((g, i) => (
              <li key={i} className="text-sm text-charcoal-muted flex gap-2">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="warning-card">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-600" />
            <h3 className="text-base font-semibold text-charcoal">What not to do</h3>
          </div>
          <ul className="space-y-2.5">
            {warnings.map((w, i) => (
              <li key={i} className="text-sm text-charcoal leading-relaxed flex gap-2">
                <span className="text-amber-500 flex-shrink-0 mt-0.5">!</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested research design */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-charcoal-muted" />
          <h3 className="text-base font-semibold text-charcoal">Suggested research design</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-1">Participant type</p>
            <p className="text-sm text-charcoal leading-relaxed">{suggestedDesign.participantType}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-1">Sample guidance</p>
            <p className="text-sm text-charcoal leading-relaxed">{suggestedDesign.sampleRange}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-1">Session format</p>
            <p className="text-sm text-charcoal">{suggestedDesign.sessionFormat}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-1">Session length</p>
            <p className="text-sm text-charcoal">{suggestedDesign.sessionLength}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-1">Analysis approach</p>
          <p className="text-sm text-charcoal">{suggestedDesign.analysisApproach}</p>
        </div>
      </div>

      {/* Confidence & limitations */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-charcoal-muted" />
          <h3 className="text-base font-semibold text-charcoal">Confidence and limitations</h3>
        </div>
        <div className="mb-4">
          <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-2">What would increase confidence</p>
          <ul className="space-y-1">
            {whatIncreasesConfidence.map((w, i) => (
              <li key={i} className="text-sm text-charcoal-muted flex gap-2">
                <span className="text-blue-400 flex-shrink-0 mt-0.5">+</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
        {assumptions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-2">Assumptions</p>
            <ul className="space-y-1">
              {assumptions.map((a, i) => (
                <li key={i} className="text-sm text-charcoal-muted flex gap-2">
                  <span className="text-warm-400 flex-shrink-0 mt-0.5">~</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
        {limitations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider mb-2">Limitations</p>
            <ul className="space-y-1">
              {limitations.map((l, i) => (
                <li key={i} className="text-sm text-charcoal-muted flex gap-2">
                  <span className="text-amber-400 flex-shrink-0 mt-0.5">△</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button onClick={onViewPlan} className="btn-primary w-full sm:w-auto">
          View starter research plan →
        </button>
      </div>

      {/* Contact research team */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Info size={16} className="text-charcoal-muted" />
          <h3 className="text-base font-semibold text-charcoal">Need more support?</h3>
        </div>
        <p className="text-sm text-charcoal-muted leading-relaxed mb-3">
          The ApprovalMax research team can help you refine your approach, review your plan, or get involved directly. If you're unsure where to start or want a second opinion, get in touch.
        </p>
        <a
          href="mailto:lisa.wilton@approvalmax.com?subject=Research support request"
          className="btn-secondary inline-flex items-center gap-1.5 text-sm py-2"
        >
          Contact the research team
        </a>
      </div>
    </div>
  );
}
