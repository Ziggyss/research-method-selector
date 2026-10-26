import { ArrowRight, Lightbulb } from 'lucide-react';
import type { ExampleScenario } from '../data/exampleScenarios';

interface LandingPageProps {
  scenarios: ExampleScenario[];
  onStart: () => void;
  onLoadScenario: (scenario: ExampleScenario) => void;
}

export function LandingPage({ scenarios, onStart, onLoadScenario }: LandingPageProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="py-8 sm:py-14 text-center">
        {/* Gradient badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #fce7d6 100%)', color: '#7c3aed' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple inline-block" />
          ApprovalMax Research
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-charcoal tracking-tight mb-3">
          Research Method Selector
        </h1>
        <p className="text-lg sm:text-xl text-charcoal-muted font-normal mb-5">
          Choose the right research approach before the work starts.
        </p>
        <p className="text-base text-charcoal-muted max-w-xl mx-auto leading-relaxed mb-10">
          Answer a few questions about your decision, uncertainty, risk, and constraints. The tool will
          recommend suitable methods and generate a starter research plan.
        </p>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 text-base px-7 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #f97316 100%)' }}
        >
          Start method selection
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Example scenarios */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-charcoal-muted" />
          <span className="text-sm font-medium text-charcoal-muted">Try an example scenario</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onLoadScenario(scenario)}
              className="text-left card hover:border-brand-purple-light hover:shadow-md transition-all group"
            >
              <p className="text-sm font-medium text-charcoal mb-2 group-hover:text-charcoal leading-snug">
                {scenario.description}
              </p>
              <span className="text-xs text-charcoal-muted group-hover:text-brand-purple inline-flex items-center gap-1 mt-1 transition-colors">
                Try this example <ArrowRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 border-t border-warm-200 pt-8">
        <p className="text-xs text-warm-400 text-center leading-relaxed max-w-xl mx-auto">
          This tool provides recommendations and planning scaffolds to support research decision-making. It does not
          replace researcher judgement, and outputs should not be used as regulatory compliance sign-off.
        </p>
      </div>
    </div>
  );
}
