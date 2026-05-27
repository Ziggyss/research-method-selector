import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { IntakeAnswers, FlowStep, Recommendation } from '../types/research';
import { Stepper } from './Stepper';
import { QuestionCard } from './QuestionCard';
import { MultiSelectChips } from './MultiSelectChips';
import { MultiSelectCards } from './MultiSelectCards';
import { SingleSelectCards } from './SelectableCards';
import { StepNavigation } from './StepNavigation';
import { RecommendationSummary } from './RecommendationSummary';
import { ResearchPlan } from './ResearchPlan';
import { ExportActions } from './ExportActions';
import { DiscussionGuide } from './DiscussionGuide';
import { BiasChecker } from './BiasChecker';
import {
  DECISION_OWNER_OPTIONS,
  UNCERTAINTY_OPTIONS,
  STAGE_OPTIONS,
  EVIDENCE_NEED_OPTIONS,
  RISK_LEVEL_OPTIONS,
  SENSITIVE_CONTEXT_OPTIONS,
  TIMELINE_OPTIONS,
  PARTICIPANT_ACCESS_OPTIONS,
  RESEARCHER_AVAILABILITY_OPTIONS,
  PROTOTYPE_AVAILABILITY_OPTIONS,
  EXISTING_EVIDENCE_OPTIONS,
} from '../data/questions';
import { generateRecommendation } from '../logic/recommendationEngine';

const FLOW_STEPS: FlowStep[] = [
  'decision', 'unknowns', 'stage', 'evidence', 'risk', 'constraints', 'recommendation', 'plan',
];

const EMPTY_ANSWERS: IntakeAnswers = {
  decision: '',
  decisionOwners: [],
  uncertainties: [],
  uncertaintyDescription: '',
  stage: '',
  evidenceNeeds: [],
  convincingEvidence: '',
  riskLevel: '',
  sensitiveContexts: [],
  timeline: '',
  participantAccess: '',
  researcherAvailability: '',
  prototypeAvailability: '',
  existingEvidence: [],
  additionalContext: '',
  researcherName: '',
  researcherEmail: '',
};

function OptionalDetail({ placeholder, value, onChange }: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(!!value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className="mt-3 pt-3 border-t border-warm-100">
      {!open ? (
        <button
          type="button"
          onClick={handleOpen}
          className="flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-charcoal transition-colors"
        >
          <ChevronDown size={13} />
          Add more detail (optional)
        </button>
      ) : (
        <textarea
          ref={textareaRef}
          className="input-field min-h-[72px] resize-y text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

type PlanTab = 'plan' | 'guide' | 'bias';

function PlanTabs({ recommendation, answers }: { recommendation: NonNullable<ReturnType<typeof generateRecommendation>>; answers: IntakeAnswers }) {
  const [tab, setTab] = useState<PlanTab>('plan');

  const tabs: { id: PlanTab; label: string }[] = [
    { id: 'plan', label: 'Research plan' },
    { id: 'guide', label: 'Discussion guide' },
    { id: 'bias', label: 'Question bias checker' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-charcoal mb-1">Starter research plan</h2>
        <p className="text-charcoal-muted">
          A planning scaffold to get the research started. Edit, adapt, and expand based on your specific context.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-warm-100 rounded-xl p-1 mb-5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 text-xs sm:text-sm font-medium py-2 px-2 sm:px-3 rounded-lg transition-colors ${
              tab === t.id
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'plan' && (
        <>
          <ExportActions recommendation={recommendation} researcherName={answers.researcherName} researcherEmail={answers.researcherEmail} />
          <div className="mt-5">
            <ResearchPlan plan={recommendation.starterPlan} />
          </div>
        </>
      )}
      {tab === 'guide' && (
        <DiscussionGuide plan={recommendation.starterPlan} method={recommendation.primaryMethod} />
      )}
      {tab === 'bias' && (
        <BiasChecker />
      )}
    </div>
  );
}

interface IntakeFlowProps {
  initialAnswers?: IntakeAnswers;
  initialStep?: FlowStep;
}

export function IntakeFlow({ initialAnswers, initialStep }: IntakeFlowProps) {
  const [answers, setAnswers] = useState<IntakeAnswers>(initialAnswers || EMPTY_ANSWERS);
  const [currentStep, setCurrentStep] = useState<FlowStep>(initialStep || 'decision');
  const [completedSteps, setCompletedSteps] = useState<FlowStep[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    if (Object.values(errors).some(Boolean)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [errors]);

  const update = <K extends keyof IntakeAnswers>(key: K, value: IntakeAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validateStep = (step: FlowStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 'decision') {
      if (!answers.decision.trim() || answers.decision.trim().length < 10) {
        newErrors.decision = 'Please describe the decision you need to make (at least 10 characters).';
      }
      if (answers.decisionOwners.length === 0) {
        newErrors.decisionOwners = 'Please select at least one decision owner.';
      }
    }

    if (step === 'unknowns') {
      if (answers.uncertainties.length === 0) {
        newErrors.uncertainties = 'Please select at least one source of uncertainty.';
      }
    }

    if (step === 'stage') {
      if (!answers.stage) {
        newErrors.stage = 'Please select the current stage.';
      }
    }

    if (step === 'evidence') {
      if (answers.evidenceNeeds.length === 0) {
        newErrors.evidenceNeeds = 'Please select at least one evidence need.';
      }
    }

    if (step === 'risk') {
      if (!answers.riskLevel) {
        newErrors.riskLevel = 'Please select the risk level.';
      }
    }

    if (step === 'constraints') {
      if (!answers.timeline) {
        newErrors.timeline = 'Please select a timeline.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) return;

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep === 'constraints') {
      const rec = generateRecommendation(answers);
      setRecommendation(rec);
      setCurrentStep('recommendation');
      if (!completedSteps.includes('recommendation')) {
        setCompletedSteps((prev) => [...prev, 'constraints']);
      }
      return;
    }

    const idx = FLOW_STEPS.indexOf(currentStep);
    if (idx < FLOW_STEPS.length - 1) {
      setCurrentStep(FLOW_STEPS[idx + 1]);
    }
  };

  const handleBack = () => {
    const idx = FLOW_STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(FLOW_STEPS[idx - 1]);
    }
  };

  const handleStepClick = (step: FlowStep) => {
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'decision':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-1">What decision needs to be made?</h2>
            </div>
            <QuestionCard
              question="What decision are you trying to make?"
              whyItMatters="The decision determines what kind of evidence is needed. 'We need to improve things' is not a decision — 'We need to decide whether to prioritise building X' is."
              error={errors.decision}
            >
              <textarea
                className="input-field min-h-[100px] resize-y"
                placeholder={`e.g. "Should we invest in building this feature?" or "Is this prototype usable enough to proceed?"`}
                value={answers.decision}
                onChange={(e) => update('decision', e.target.value)}
              />
            </QuestionCard>

            <QuestionCard
              question="Who needs to make or approve this decision?"
              error={errors.decisionOwners}
            >
              <MultiSelectChips
                options={DECISION_OWNER_OPTIONS}
                selected={answers.decisionOwners}
                onChange={(v) => update('decisionOwners', v)}
              />
            </QuestionCard>
          </div>
        );

      case 'unknowns':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-1">What are you most uncertain about?</h2>
              <p className="text-charcoal-muted">Aim for 2–3 that matter most.</p>
            </div>
            <QuestionCard
              question="What are you most uncertain about?"
              whyItMatters="The type of uncertainty determines the appropriate method. Behavioural uncertainty calls for qualitative exploration. Prevalence uncertainty calls for quantitative methods. Usability uncertainty calls for evaluation with a prototype."
              error={errors.uncertainties}
            >
              <MultiSelectCards
                options={UNCERTAINTY_OPTIONS}
                selected={answers.uncertainties}
                onChange={(v) => update('uncertainties', v)}
              />
              {answers.uncertainties.length > 4 && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mt-3">
                  You've selected {answers.uncertainties.length} — the more specific you can be, the better the recommendation.
                </p>
              )}
              <OptionalDetail
                placeholder="What specifically do you not know? What would change your understanding or decision?"
                value={answers.uncertaintyDescription}
                onChange={(v) => update('uncertaintyDescription', v)}
              />
            </QuestionCard>
          </div>
        );

      case 'stage':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-1">What stage is the work at?</h2>
            </div>
            <QuestionCard
              question="Select the current stage"
              whyItMatters="Researching a live product is different from researching an early concept. Using evaluative methods too early (before there is something to evaluate) wastes time. Using generative methods too late (when the design is already built) is too little, too late."
              error={errors.stage}
            >
              <SingleSelectCards
                options={STAGE_OPTIONS}
                selected={answers.stage}
                onChange={(v) => update('stage', v)}
              />
            </QuestionCard>
          </div>
        );

      case 'evidence':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-1">What kind of evidence do you need?</h2>
              <p className="text-charcoal-muted">Pick 1–3. Selecting everything reduces the precision of the recommendation.</p>
            </div>
            <QuestionCard
              question="What kind of evidence do you need most?"
              whyItMatters="Not sure which to pick? Choose behaviour or needs for understanding people's experience in depth. Choose observed task performance if you have a design to test. Choose prevalence to measure how common something is. Choose comparison if you're deciding between options."
              error={errors.evidenceNeeds}
            >
              <MultiSelectCards
                options={EVIDENCE_NEED_OPTIONS}
                selected={answers.evidenceNeeds}
                onChange={(v) => update('evidenceNeeds', v)}
              />
              {answers.evidenceNeeds.length > 3 && (
                <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  You've selected {answers.evidenceNeeds.length} — consider which 2–3 matter most for this decision.
                </p>
              )}
              <OptionalDetail
                placeholder={`What would make the findings convincing enough? e.g. "We need to know whether users can complete the task safely and independently."`}
                value={answers.convincingEvidence}
                onChange={(v) => update('convincingEvidence', v)}
              />
            </QuestionCard>
          </div>
        );

      case 'risk':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-1">How risky is the decision?</h2>
            </div>
            <QuestionCard
              question="How risky is the decision if we get it wrong?"
              whyItMatters="Low-risk decisions can tolerate more exploratory, lightweight evidence. High-risk or regulated decisions require structured, documented evidence with explicit links between user groups, tasks, and risk controls."
              error={errors.riskLevel}
            >
              <SingleSelectCards
                options={RISK_LEVEL_OPTIONS}
                selected={answers.riskLevel}
                onChange={(v) => update('riskLevel', v)}
              />
            </QuestionCard>

            <QuestionCard
              question="Are any of these contexts involved?"
              helperText="Select all that apply. If none apply, select 'None of these'."
            >
              <MultiSelectChips
                options={SENSITIVE_CONTEXT_OPTIONS}
                selected={answers.sensitiveContexts}
                onChange={(v) => update('sensitiveContexts', v)}
                exclusive="none"
              />
            </QuestionCard>
          </div>
        );

      case 'constraints':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-1">What constraints do you have?</h2>
            </div>
            <QuestionCard question="Who is leading this research?">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Your name</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="e.g. Lisa Wilton"
                    value={answers.researcherName}
                    onChange={(e) => update('researcherName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Your email</label>
                  <input
                    type="email"
                    className="input-field text-sm"
                    placeholder="e.g. lisa.wilton@oneadvanced.com"
                    value={answers.researcherEmail}
                    onChange={(e) => update('researcherEmail', e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-charcoal-muted mt-2">Used to pre-fill consent forms sent to participants. Optional, but recommended.</p>
            </QuestionCard>
            <QuestionCard
              question="Timeline and access"
              error={errors.timeline}
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Timeline</label>
                  <div className="flex flex-col gap-2">
                    {TIMELINE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('timeline', opt.value)}
                        className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                          answers.timeline === opt.value
                            ? 'border-charcoal bg-warm-50 text-charcoal font-medium ring-1 ring-charcoal'
                            : 'border-warm-200 bg-white text-charcoal-muted hover:border-warm-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Participant access</label>
                    <div className="flex flex-col gap-2">
                      {PARTICIPANT_ACCESS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('participantAccess', opt.value)}
                          className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                            answers.participantAccess === opt.value
                              ? 'border-charcoal bg-warm-50 text-charcoal font-medium ring-1 ring-charcoal'
                              : 'border-warm-200 bg-white text-charcoal-muted hover:border-warm-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </QuestionCard>

            <QuestionCard question="Resources and existing evidence">
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Researcher availability</label>
                  <div className="flex flex-col gap-2">
                    {RESEARCHER_AVAILABILITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('researcherAvailability', opt.value)}
                        className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                          answers.researcherAvailability === opt.value
                            ? 'border-charcoal bg-warm-50 text-charcoal font-medium ring-1 ring-charcoal'
                            : 'border-warm-200 bg-white text-charcoal-muted hover:border-warm-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Prototype availability</label>
                  <div className="flex flex-col gap-2">
                    {PROTOTYPE_AVAILABILITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('prototypeAvailability', opt.value)}
                        className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                          answers.prototypeAvailability === opt.value
                            ? 'border-charcoal bg-warm-50 text-charcoal font-medium ring-1 ring-charcoal'
                            : 'border-warm-200 bg-white text-charcoal-muted hover:border-warm-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Existing evidence available</label>
                <div className="mb-3 flex items-start gap-2.5 bg-warm-50 border border-warm-200 rounded-xl px-4 py-3">
                  <span className="text-warm-400 flex-shrink-0 mt-0.5 text-base leading-none">💡</span>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Before selecting, it's worth checking the{' '}
                    <a
                      href="https://app.condens.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-charcoal underline underline-offset-2 hover:text-charcoal-muted transition-colors"
                    >
                      OneAdvanced research magazine in Condens
                    </a>{' '}
                    — there may already be relevant findings from previous studies. If you find something useful, select it below so the recommendation takes it into account.
                  </p>
                </div>
                <MultiSelectChips
                  options={EXISTING_EVIDENCE_OPTIONS}
                  selected={answers.existingEvidence}
                  onChange={(v) => update('existingEvidence', v)}
                  exclusive="none"
                />
              </div>
              <OptionalDetail
                placeholder="Anything else that might affect the approach — team context, stakeholder dynamics, prior decisions, etc."
                value={answers.additionalContext}
                onChange={(v) => update('additionalContext', v)}
              />
            </QuestionCard>
          </div>
        );

      case 'recommendation':
        return recommendation ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-1">Research recommendation</h2>
              <p className="text-charcoal-muted">
                Based on your answers, here is the recommended approach. Use this as a starting point — researcher judgement should always inform the final decision.
              </p>
            </div>
            <RecommendationSummary
              recommendation={recommendation}
              onViewPlan={() => setCurrentStep('plan')}
            />
          </div>
        ) : null;

      case 'plan':
        return recommendation ? (
          <PlanTabs recommendation={recommendation} answers={answers} />
        ) : null;

      default:
        return null;
    }
  };

  const canContinue = () => {
    if (currentStep === 'plan') return false;
    return true;
  };

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* Desktop sidebar stepper — rendered inside Stepper via hidden class */}
      <Stepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />
      <div className="flex-1 min-w-0">
        {renderStep()}
        <StepNavigation
          currentStep={currentStep}
          onBack={handleBack}
          onContinue={handleContinue}
          canContinue={canContinue()}
        />
      </div>
    </div>
  );
}
