import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FlowStep } from '../types/research';

const FLOW_STEPS: FlowStep[] = [
  'decision', 'unknowns', 'stage', 'evidence', 'risk', 'constraints', 'recommendation', 'plan'
];

interface StepNavigationProps {
  currentStep: FlowStep;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  canContinue?: boolean;
}

export function StepNavigation({
  currentStep,
  onBack,
  onContinue,
  continueLabel,
  canContinue = true,
}: StepNavigationProps) {
  const currentIndex = FLOW_STEPS.indexOf(currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === FLOW_STEPS.length - 1;

  const label = continueLabel || (currentIndex === FLOW_STEPS.indexOf('constraints') ? 'Generate recommendation' : isLast ? 'Done' : 'Continue');

  return (
    <div className="flex items-center justify-between pt-4 border-t border-warm-100 mt-2">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
          isFirst
            ? 'text-warm-300 cursor-default'
            : 'text-charcoal-muted hover:text-charcoal'
        }`}
      >
        <ChevronLeft size={16} />
        Back
      </button>
      {!isLast && (
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="btn-primary flex items-center gap-1.5 text-sm"
        >
          {label}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
