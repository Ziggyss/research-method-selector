import { Check } from 'lucide-react';
import type { FlowStep } from '../types/research';

const STEPS: { id: FlowStep; label: string; shortLabel: string }[] = [
  { id: 'decision', label: 'Decision', shortLabel: 'Decision' },
  { id: 'unknowns', label: 'Unknowns', shortLabel: 'Unknowns' },
  { id: 'stage', label: 'Stage', shortLabel: 'Stage' },
  { id: 'evidence', label: 'Evidence', shortLabel: 'Evidence' },
  { id: 'risk', label: 'Risk', shortLabel: 'Risk' },
  { id: 'constraints', label: 'Constraints', shortLabel: 'Constraints' },
  { id: 'recommendation', label: 'Recommendation', shortLabel: 'Reco.' },
  { id: 'plan', label: 'Research plan', shortLabel: 'Plan' },
];

interface StepperProps {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
  onStepClick: (step: FlowStep) => void;
}

export function Stepper({ currentStep, completedSteps, onStepClick }: StepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:block w-44 flex-shrink-0">
        <div className="sticky top-24 space-y-0.5">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isComplete = completedSteps.includes(step.id);
            const isAccessible = isComplete || isActive || index === currentIndex + 1;

            return (
              <button
                key={step.id}
                onClick={() => isAccessible && onStepClick(step.id)}
                disabled={!isAccessible}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  isActive
                    ? 'text-brand-purple font-medium'
                    : isComplete
                    ? 'text-charcoal-muted hover:bg-warm-50 cursor-pointer'
                    : 'text-warm-400 cursor-default'
                }`}
                style={isActive ? { background: 'linear-gradient(135deg, #ede9fe 0%, #fce7d6 100%)' } : {}}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium border ${
                    isActive
                      ? 'text-white border-brand-purple'
                      : isComplete
                      ? 'bg-white border-charcoal-muted text-charcoal-muted'
                      : 'bg-white border-warm-300 text-warm-400'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #7c3aed 0%, #f97316 100%)' } : {}}
                >
                  {isComplete && !isActive ? <Check size={11} /> : index + 1}
                </div>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile top progress */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-charcoal-muted">
            Step {currentIndex + 1} of {STEPS.length}
          </span>
          <span className="text-xs font-medium text-charcoal">
            {STEPS[currentIndex]?.label}
          </span>
        </div>
        <div className="w-full bg-warm-200 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / STEPS.length) * 100}%`,
              background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #f97316 100%)',
            }}
          />
        </div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isComplete = completedSteps.includes(step.id);
            return (
              <button
                key={step.id}
                onClick={() => (isComplete || isActive) && onStepClick(step.id)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : isComplete
                    ? 'bg-warm-100 text-charcoal-muted'
                    : 'bg-warm-100 text-warm-400'
                }`}
                style={isActive ? { background: 'linear-gradient(135deg, #7c3aed 0%, #f97316 100%)' } : {}}
              >
                {step.shortLabel}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
