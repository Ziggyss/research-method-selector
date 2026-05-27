import type { IntakeAnswers, Recommendation, ResearchMethod, StarterResearchPlan } from '../types/research';
import { METHODS } from '../data/methods';

type MethodScore = { method: ResearchMethod; score: number };

function scoreMethod(method: ResearchMethod, answers: IntakeAnswers): number {
  let score = 0;
  const {
    uncertainties,
    stage,
    evidenceNeeds,
    riskLevel,
    sensitiveContexts,
    timeline,
    participantAccess,
    prototypeAvailability,
    existingEvidence,
  } = answers;

  const id = method.id;

  // Exploratory signals
  const isExploratory =
    uncertainties.includes('problem_not_understood') ||
    uncertainties.includes('user_needs_workflows') ||
    uncertainties.includes('why_behaviour');

  if (isExploratory) {
    if (id === 'semi_structured_interviews') score += 10;
    if (id === 'contextual_inquiry') score += 8;
    if (id === 'existing_evidence_review') score += 6;
    if (id === 'survey') score -= 5;
    if (id === 'moderated_usability_testing') score -= 4;
  }

  // Concept evaluation
  if (uncertainties.includes('evaluate_concept')) {
    if (id === 'concept_testing_interviews') score += 10;
    if (id === 'semi_structured_interviews') score += 4;
  }

  // Usability testing signals
  if (uncertainties.includes('test_usability')) {
    if (id === 'moderated_usability_testing') score += 12;
    if (id === 'unmoderated_usability_testing') score += 6;
    if (id === 'accessibility_review') score += 3;
  }

  // Prevalence signals
  if (uncertainties.includes('how_common') || evidenceNeeds.includes('prevalence')) {
    if (id === 'survey') score += 8;
    if (id === 'analytics_review') score += 7;
    // But reduce survey score if problem not understood
    if (id === 'survey' && isExploratory) score -= 6;
  }

  // Trust / confidence / risk
  if (uncertainties.includes('trust_confidence_risk')) {
    if (id === 'concept_testing_interviews') score += 10;
    if (id === 'moderated_usability_testing') score += 6;
    if (id === 'semi_structured_interviews') score += 5;
    if (id === 'survey') score -= 4; // Unreliable for trust
  }

  // Stakeholder alignment
  if (uncertainties.includes('stakeholder_alignment') || evidenceNeeds.includes('stakeholder_alignment')) {
    if (id === 'stakeholder_interviews') score += 10;
    if (id === 'assumption_mapping') score += 8;
    if (id === 'research_framing_workshop') score += 6;
    if (id === 'journey_mapping_workshop') score += 4;
  }

  // High-risk / regulated
  if (
    uncertainties.includes('high_risk_workflow') ||
    riskLevel === 'critical' ||
    sensitiveContexts.some((c) => ['healthcare_clinical', 'legal', 'compliance_audit'].includes(c))
  ) {
    if (id === 'formative_usability_evaluation') score += 12;
    if (id === 'critical_task_analysis') score += 10;
    if (id === 'summative_validation_planning') score += 6;
    if (id === 'moderated_usability_testing') score += 5;
  }

  // AI / agentic signals
  if (
    sensitiveContexts.includes('ai_recommendations') ||
    sensitiveContexts.includes('automation_agentic')
  ) {
    if (id === 'concept_testing_interviews') score += 6;
    if (id === 'moderated_usability_testing') score += 5;
  }

  // Stage-based scoring
  if (stage === 'early_idea' || stage === 'problem_discovery') {
    if (id === 'semi_structured_interviews') score += 6;
    if (id === 'contextual_inquiry') score += 5;
    if (id === 'existing_evidence_review') score += 5;
    if (id === 'stakeholder_interviews') score += 3;
    if (id === 'assumption_mapping') score += 4;
    if (id === 'moderated_usability_testing') score -= 6;
    if (id === 'survey') score -= 4;
  }

  if (stage === 'concept') {
    if (id === 'concept_testing_interviews') score += 6;
    if (id === 'semi_structured_interviews') score += 4;
    if (id === 'co_design_workshop') score += 3;
  }

  if (stage === 'prototype') {
    if (id === 'moderated_usability_testing') score += 8;
    if (id === 'unmoderated_usability_testing') score += 4;
    if (id === 'first_click_testing') score += 3;
    if (id === 'tree_testing') score += 3;
  }

  if (stage === 'live_product' || stage === 'post_release') {
    if (id === 'analytics_review') score += 6;
    if (id === 'semi_structured_interviews') score += 5;
    if (id === 'survey') score += 3;
    if (id === 'benchmarking_study') score += 3;
    if (id === 'unmoderated_usability_testing') score += 3;
  }

  if (stage === 'regulated_validation') {
    if (id === 'formative_usability_evaluation') score += 10;
    if (id === 'critical_task_analysis') score += 10;
    if (id === 'summative_validation_planning') score += 8;
  }

  // Evidence need scoring
  if (evidenceNeeds.includes('behaviour_context')) {
    if (id === 'semi_structured_interviews') score += 5;
    if (id === 'contextual_inquiry') score += 5;
    if (id === 'diary_study') score += 3;
  }

  // AI-generated prototype — treat as a testable artefact (similar to low-fidelity)
  if (prototypeAvailability === 'ai_generated') {
    if (id === 'moderated_usability_testing') score += 7;
    if (id === 'concept_testing_interviews') score += 5;
    if (id === 'unmoderated_usability_testing') score += 2;
  }

  if (evidenceNeeds.includes('task_performance')) {
    if (prototypeAvailability !== 'none' && prototypeAvailability !== '') {
      if (id === 'moderated_usability_testing') score += 8;
      if (id === 'unmoderated_usability_testing') score += 4;
    }
  }

  if (evidenceNeeds.includes('journey_service')) {
    if (id === 'contextual_inquiry') score += 5;
    if (id === 'journey_mapping_workshop') score += 4;
    if (id === 'service_blueprinting') score += 4;
    if (id === 'analytics_review') score += 3;
  }

  if (evidenceNeeds.includes('risk_safety')) {
    if (id === 'formative_usability_evaluation') score += 8;
    if (id === 'critical_task_analysis') score += 8;
    if (id === 'moderated_usability_testing') score += 4;
  }

  if (evidenceNeeds.includes('market_context')) {
    if (id === 'semi_structured_interviews') score += 3;
    if (id === 'survey') score += 4;
  }

  // Fix: needs_pain_points was a silent dead option with no scoring rules
  if (evidenceNeeds.includes('needs_pain_points')) {
    if (id === 'semi_structured_interviews') score += 5;
    if (id === 'contextual_inquiry') score += 5;
    if (id === 'concept_testing_interviews') score += 3;
  }

  // Existing evidence
  if (existingEvidence.includes('analytics') && id === 'analytics_review') score += 4;
  if (existingEvidence.includes('previous_research') && id === 'existing_evidence_review') score += 3;
  if (
    existingEvidence.includes('none') &&
    (id === 'semi_structured_interviews' || id === 'existing_evidence_review')
  )
    score += 3;

  // Timeline constraints
  if (timeline === '1_week') {
    if (id === 'existing_evidence_review') score += 5;
    if (id === 'unmoderated_usability_testing') score += 4;
    if (id === 'analytics_review') score += 4;
    if (id === 'diary_study') score -= 8;
    if (id === 'benchmarking_study') score -= 4;
    if (id === 'summative_validation_planning') score -= 8;
  }

  if (timeline === '2_weeks') {
    if (id === 'moderated_usability_testing') score += 3;
    if (id === 'semi_structured_interviews') score += 3;
    if (id === 'diary_study') score -= 4;
  }

  // Participant access
  if (participantAccess === 'difficult') {
    if (id === 'existing_evidence_review') score += 4;
    if (id === 'analytics_review') score += 4;
    if (id === 'unmoderated_usability_testing') score += 3;
    if (id === 'moderated_usability_testing') score -= 3;
  }

  // Prototype availability affects usability testing scores
  if (prototypeAvailability === 'none') {
    if (id === 'moderated_usability_testing') score -= 8;
    if (id === 'unmoderated_usability_testing') score -= 8;
    if (id === 'first_click_testing') score -= 6;
    // Fix: tree_testing also requires a testable artefact
    if (id === 'tree_testing') score -= 6;
    // Fix: concept_testing_interviews requires some stimulus — without one, defer to semi_structured_interviews
    if (id === 'concept_testing_interviews') score -= 10;
  }

  // Fix: task_performance evidence need with no prototype — promote contextual observation as valid alternative
  if (evidenceNeeds.includes('task_performance') && (prototypeAvailability === 'none' || prototypeAvailability === '')) {
    if (id === 'contextual_inquiry') score += 6;
  }

  // Fix: formative_usability_evaluation requires a testable product — suppress at early stages with no prototype
  if ((stage === 'early_idea' || stage === 'problem_discovery') && id === 'formative_usability_evaluation') {
    score -= 10;
  }
  if (prototypeAvailability === 'none' && id === 'formative_usability_evaluation') {
    score -= 8;
  }

  // Fix: critical_task_analysis requires understanding tasks to exist first — meaningless before problem discovery
  if ((stage === 'early_idea' || stage === 'problem_discovery') && id === 'critical_task_analysis') {
    score -= 12;
  }

  // Fix: in regulated_validation stage, moderated usability testing is the practical execution method — give it appropriate weight
  if (stage === 'regulated_validation' && id === 'moderated_usability_testing') {
    score += 6;
  }

  // Fix: prioritise_options uncertainty — previously had no scoring rules
  if (uncertainties.includes('prioritise_options')) {
    if (id === 'assumption_mapping') score += 7;
    if (id === 'concept_testing_interviews') score += 5;
    if (id === 'semi_structured_interviews') score += 4;
    if (id === 'stakeholder_interviews') score += 4;
    if (id === 'survey') score += 3;
    if (stage === 'live_product' || stage === 'post_release') {
      if (id === 'ab_test') score += 6;
      if (id === 'analytics_review') score += 4;
    }
  }

  // Fix: comparison evidence need — previously had no scoring rules
  if (evidenceNeeds.includes('comparison')) {
    if (stage === 'live_product' || stage === 'post_release') {
      if (id === 'ab_test') score += 8;
      if (id === 'benchmarking_study') score += 5;
    }
    if (prototypeAvailability !== 'none' && prototypeAvailability !== '') {
      if (id === 'first_click_testing') score += 5;
      if (id === 'moderated_usability_testing') score += 4;
      if (id === 'benchmarking_study') score += 3;
    }
    if (stage === 'concept' || stage === 'early_idea') {
      if (id === 'concept_testing_interviews') score += 7;
    }
  }

  // Fix: researcher availability — previously unused. Simpler/self-service methods boosted for non-researchers.
  if (answers.researcherAvailability === 'pm_led' || answers.researcherAvailability === 'designer_led') {
    if (id === 'unmoderated_usability_testing') score += 4;
    if (id === 'analytics_review') score += 3;
    if (id === 'existing_evidence_review') score += 3;
    if (id === 'first_click_testing') score += 2;
    if (id === 'survey') score += 2;
    // Methods requiring skilled facilitation or regulatory knowledge are harder without a researcher
    if (id === 'contextual_inquiry') score -= 5;
    if (id === 'formative_usability_evaluation') score -= 6;
    if (id === 'diary_study') score -= 3;
    if (id === 'service_blueprinting') score -= 3;
  }

  return score;
}

function deriveRationale(primary: ResearchMethod, answers: IntakeAnswers): string[] {
  const rationale: string[] = [];
  const { uncertainties, stage, riskLevel } = answers;

  const isExploratory =
    uncertainties.includes('problem_not_understood') ||
    uncertainties.includes('user_needs_workflows') ||
    uncertainties.includes('why_behaviour');

  if (primary.id === 'semi_structured_interviews') {
    if (isExploratory)
      rationale.push(
        'The main uncertainty is behavioural and contextual, not simply attitudinal. Interviews are the appropriate starting point for generating the depth of understanding this decision requires.'
      );
    if (stage === 'early_idea' || stage === 'problem_discovery')
      rationale.push(
        'At this stage, open-ended exploration is more valuable than structured testing. Interviews allow you to follow the participant rather than confirming a pre-set hypothesis.'
      );
  }

  if (primary.id === 'moderated_usability_testing') {
    if (answers.prototypeAvailability !== 'none')
      rationale.push(
        'A prototype exists and the primary question is about task completion. Moderated usability testing will identify the specific points where users struggle, and why, in a way that analytics or unmoderated testing cannot.'
      );
  }

  if (primary.id === 'concept_testing_interviews') {
    rationale.push(
      'The question is about whether the concept is understood and trusted, not whether a detailed interface is usable. Concept testing interviews explore reactions in context rather than measuring task performance.'
    );
    if (uncertainties.includes('trust_confidence_risk'))
      rationale.push(
        'Trust and risk perception need to be explored through rich conversation, not inferred from survey responses, which are highly susceptible to novelty bias and social desirability effects.'
      );
  }

  if (primary.id === 'formative_usability_evaluation' || primary.id === 'critical_task_analysis') {
    rationale.push(
      'The risk level and context require structured evaluation linked explicitly to use-related risks and critical tasks. Informal testing is insufficient — the evidence must be documented and traceable.'
    );
    if (riskLevel === 'critical')
      rationale.push(
        'Given the critical risk level, evidence must be linked to specific hazards and risk controls, not collected as general usability feedback.'
      );
  }

  if (primary.id === 'contextual_inquiry') {
    rationale.push(
      'The primary uncertainty is about what users actually do in their work environment, not just what they report. Contextual inquiry involves observing users in or near their real working context — this produces richer, more accurate data than a remote interview alone.'
    );
    if (stage === 'early_idea' || stage === 'problem_discovery')
      rationale.push(
        'At this stage, you need to understand the problem in its real setting. Seeing the work happen — the tools, the workarounds, the interruptions — reveals things that no interview or survey can capture.'
      );
  }

  if (primary.id === 'stakeholder_interviews') {
    rationale.push(
      'The primary need is alignment — getting the team and decision-makers onto the same page about what the research should address. Stakeholder interviews surface assumptions, constraints, and priorities before fieldwork begins.'
    );
    rationale.push(
      'Note: stakeholder interviews are a preparation method, not a substitute for research with users. Use the outputs to frame objectives, then validate with actual users.'
    );
  }

  if (primary.id === 'analytics_review') {
    rationale.push(
      'You have existing behavioural data and the primary question is about what is happening at scale. Analytics review is the right starting point — it tells you where users are struggling or dropping off before committing to qualitative fieldwork.'
    );
    rationale.push(
      'Analytics explains what is happening, not why. Pair this with interviews or usability testing once the data has surfaced clear patterns worth investigating.'
    );
  }

  if (primary.id === 'existing_evidence_review') {
    rationale.push(
      'Before generating new data, it is worth establishing what is already known. An evidence review prevents duplication, surfaces relevant prior findings, and helps focus any subsequent research on genuine gaps.'
    );
  }

  if (primary.id === 'assumption_mapping') {
    rationale.push(
      'The team has multiple competing hypotheses or directions. Before investing in research, mapping and prioritising the assumptions behind the decision will ensure the research targets the highest-risk unknowns rather than confirming what is already believed.'
    );
  }

  if (rationale.length === 0) {
    rationale.push(
      `This method fits the combination of uncertainty type, product stage, and evidence need identified in your answers.`
    );
  }

  return rationale;
}

function deriveWarnings(_primary: ResearchMethod, answers: IntakeAnswers): string[] {
  const warnings: string[] = [];
  const { uncertainties, stage, evidenceNeeds, riskLevel, sensitiveContexts } = answers;

  const isExploratory =
    uncertainties.includes('problem_not_understood') ||
    uncertainties.includes('user_needs_workflows') ||
    uncertainties.includes('why_behaviour');

  if (isExploratory && evidenceNeeds.includes('prevalence')) {
    warnings.push(
      'Do not run a survey yet: the problem space is not clear enough to design questions that measure the right things. Survey results from this stage often confirm existing assumptions rather than revealing new insight.'
    );
  }

  if (
    (stage === 'early_idea' || stage === 'problem_discovery') &&
    uncertainties.includes('test_usability')
  ) {
    warnings.push(
      'Do not jump into usability testing before the problem is understood. Usability testing evaluates whether an interface works — it cannot tell you whether you are solving the right problem.'
    );
  }

  if (uncertainties.includes('evaluate_concept') || uncertainties.includes('trust_confidence_risk')) {
    warnings.push(
      '"Users said they liked it" is not proof of demand. Novelty bias and social desirability are significant in concept testing — the question is whether users understand the concept and trust it in realistic conditions, not whether they express enthusiasm.'
    );
  }

  if (riskLevel === 'high' || riskLevel === 'critical') {
    warnings.push(
      'Do not treat informal feedback as validation evidence. High-risk decisions require structured evidence with explicit links between user groups, tasks, and risk controls.'
    );
  }

  if (sensitiveContexts.includes('ai_recommendations') || sensitiveContexts.includes('automation_agentic')) {
    warnings.push(
      'Abstract survey responses about trust in AI are unreliable. Trust should be explored in context — through realistic scenarios and prototype walkthroughs — not as a generic preference question.'
    );
  }

  if (answers.prototypeAvailability === 'ai_generated') {
    warnings.push(
      'AI-generated prototypes can be tested, but be clear with participants about what they are seeing. If the prototype uses placeholder content or AI-generated copy, this can skew reactions — participants may respond to the content rather than the design. Screen carefully for participants who can engage with the interface critically rather than the surface-level presentation.'
    );
  }

  if (answers.researcherAvailability === 'pm_led') {
    warnings.push(
      'This research will be led by a product manager rather than a trained researcher. Some methods — particularly those requiring skilled facilitation or neutral probing — are harder to run rigorously without research experience. Consider keeping the approach simple, using unmoderated methods where possible, or involving an external researcher for anything that requires careful facilitation.'
    );
  }

  if (answers.researcherAvailability === 'designer_led' && _primary.id === 'moderated_usability_testing') {
    warnings.push(
      'Designer-facilitated usability testing on your own design introduces significant facilitation bias risk. Designers unconsciously explain, prompt, or react in ways that affect participant behaviour. Use a structured think-aloud protocol, have a second person observe and take notes separately, and — where possible — have someone other than the designer facilitate. If that is not possible, consider unmoderated testing as an alternative.'
    );
  }

  if (
    uncertainties.includes('stakeholder_alignment') &&
    !evidenceNeeds.includes('behaviour_context') &&
    !evidenceNeeds.includes('task_performance')
  ) {
    warnings.push(
      'Workshops are alignment tools, not substitutes for user evidence. Stakeholder agreement about what users need is not the same as evidence about what users actually experience.'
    );
  }

  if (
    riskLevel === 'critical' ||
    stage === 'regulated_validation' ||
    sensitiveContexts.some((c) => ['healthcare_clinical', 'compliance_audit'].includes(c))
  ) {
    warnings.push(
      'Do not claim regulatory compliance without documented rationale. Participant groups must be justified by use characteristics — not simply job titles or convenience sampling.'
    );
  }

  // Stage/risk contradiction: regulated_validation with low or medium risk
  if (stage === 'regulated_validation' && (riskLevel === 'low' || riskLevel === 'medium')) {
    warnings.push(
      'The stage you selected — regulated validation — is inherently high-stakes. If this work is genuinely for regulatory submission or compliance evidence, the risk level is likely higher than selected. Consider revisiting your risk assessment.'
    );
  }

  // Warn when evaluate_concept and how_common are selected together — survey is premature
  if (uncertainties.includes('evaluate_concept') && uncertainties.includes('how_common')) {
    warnings.push(
      'Understand the concept before trying to measure it at scale. Running a survey about a concept users have not yet seen will produce unreliable data. Validate understanding and reaction first, then measure prevalence once you have clear hypotheses.'
    );
  }

  // Treat "unknown" researcher availability as a safety flag — same as pm_led
  if (answers.researcherAvailability === 'unknown' || answers.researcherAvailability === '') {
    warnings.push(
      'It is unclear who will lead this research. Methods that require skilled facilitation, neutral probing, or structured documentation are harder to run well without a trained researcher. If no researcher is involved, keep the approach simple and consider getting external support for anything complex or high-risk.'
    );
  }

  // Recording and observer rigour warning for non-researcher-led sessions
  if (
    answers.researcherAvailability === 'pm_led' ||
    answers.researcherAvailability === 'designer_led' ||
    answers.researcherAvailability === 'unknown' ||
    answers.researcherAvailability === ''
  ) {
    warnings.push(
      'Record every session, and arrange a separate observer or note-taker. The facilitator cannot run the conversation and capture everything accurately at the same time — critical moments get missed, and memory fills in gaps in ways that introduce bias. Recordings also make findings verifiable and shareable with the wider team, reducing the risk of findings being filtered through a single person\'s interpretation.'
    );
  }

  return warnings;
}

function deriveConfidence(answers: IntakeAnswers, _primaryId: string): 'Low' | 'Medium' | 'High' {
  const { timeline, participantAccess, existingEvidence, uncertainties, riskLevel } = answers;

  let score = 3; // Start at medium

  if (timeline === '1_week') score -= 1;
  if (timeline === 'flexible' || timeline === '1_2_months') score += 1;
  if (participantAccess === 'difficult') score -= 1;
  if (participantAccess === 'easy') score += 1;
  if (existingEvidence.includes('previous_research') || existingEvidence.includes('repository_evidence')) score += 1;
  if (existingEvidence.includes('none')) score -= 0.5;
  if (uncertainties.includes('problem_not_understood')) score -= 0.5;
  if (riskLevel === 'critical') score -= 1;

  if (score >= 4) return 'High';
  if (score <= 2) return 'Low';
  return 'Medium';
}

function generateResearchQuestions(primaryId: string, answers: IntakeAnswers): string[] {
  const questions: string[] = [];
  const { decision, uncertainties } = answers;

  if (primaryId === 'semi_structured_interviews' || primaryId === 'contextual_inquiry') {
    questions.push('How do users currently approach this workflow or task?');
    questions.push('What triggers the need to perform this task, and what is the typical context?');
    questions.push('Where do users experience friction, uncertainty, or rely on workarounds?');
    questions.push('What information do users depend on when making decisions in this context?');
    if (uncertainties.includes('why_behaviour'))
      questions.push('What factors explain why users take the approach they currently take?');
    if (decision.toLowerCase().includes('onboard'))
      questions.push('What makes users persist with or abandon the onboarding process?');
  }

  if (primaryId === 'moderated_usability_testing') {
    questions.push('Can users complete the priority tasks without assistance or significant errors?');
    questions.push('Where do users hesitate, make errors, or misinterpret the interface?');
    questions.push('Which parts of the workflow create unnecessary cognitive load or confusion?');
    questions.push('What expectations do users bring to each step, and where does the design violate those expectations?');
    questions.push('Which issues are severe enough to block task completion, and which are minor friction points?');
  }

  if (primaryId === 'concept_testing_interviews') {
    questions.push('What is the user\'s initial reaction to the concept, and what does it mean to them?');
    questions.push('What conditions would increase or reduce their willingness to use this in practice?');
    questions.push('Where do users feel uncertain, uncomfortable, or in need of more information or control?');
    if (answers.uncertainties.includes('trust_confidence_risk')) {
      questions.push('What conditions increase or reduce trust in the AI output?');
      questions.push('Where do users want transparency, human review, or the ability to override?');
      questions.push('What risks do users perceive when the AI takes action or makes a recommendation?');
    }
  }

  if (primaryId === 'formative_usability_evaluation' || primaryId === 'critical_task_analysis') {
    questions.push('Can users identify and complete the critical tasks without use error?');
    questions.push('Which task steps are most prone to error, and what are the conditions that trigger errors?');
    questions.push('Where do users misinterpret feedback, status, or system state in ways that could cause harm?');
    questions.push('Do users understand the consequences of actions, particularly irreversible or high-stakes steps?');
  }

  if (primaryId === 'analytics_review' || primaryId === 'survey') {
    questions.push('At what point in the flow do users drop off, and at what rate?');
    questions.push('Which features or steps are used more or less than expected?');
    questions.push('How does behaviour vary across different user segments or contexts?');
    if (primaryId === 'survey') {
      questions.push('How prevalent is this issue or need across the broader user population?');
      questions.push('What is the distribution of user attitudes or satisfaction levels?');
    }
  }

  if (questions.length === 0) {
    questions.push('What is the current state of user experience in this area?');
    questions.push('What are the key factors that influence user behaviour?');
    questions.push('What are the most significant barriers or friction points for users?');
  }

  return questions.slice(0, 8);
}

function generateScreeningSurvey(primary: ResearchMethod, answers: IntakeAnswers): StarterResearchPlan['screeningSurvey'] {
  const { decision, sensitiveContexts } = answers;
  const isRegulated = sensitiveContexts.some((c) => ['healthcare_clinical', 'compliance_audit'].includes(c));
  const isUsabilityFocused = ['moderated_usability_testing', 'unmoderated_usability_testing', 'formative_usability_evaluation'].includes(primary.id);
  const isExploratory = ['semi_structured_interviews', 'contextual_inquiry', 'concept_testing_interviews'].includes(primary.id);

  const intro = `Thank you for your interest in taking part in research with OneAdvanced. We are looking for people to help us ${isUsabilityFocused ? 'test and give feedback on a design' : 'share their experience and perspective'} related to: ${decision.slice(0, 120)}${decision.length > 120 ? '...' : ''}

At OneAdvanced, we build software that supports mission-critical work across healthcare, legal, education, social care, and the public sector. Your input helps us make better decisions about the products and services we build — and ultimately improves outcomes for the people who use them every day.

This short survey (2–3 minutes) helps us check whether you match the profile we are looking for. We will contact suitable participants within [X] working days to explain more and arrange a session.`;

  const questions: StarterResearchPlan['screeningSurvey']['questions'] = [
    {
      question: 'What is your current job role or title?',
      type: 'text',
      screenerNote: 'Use to verify role relevance. Disqualify if outside target user group.',
    },
    {
      question: 'Which of the following best describes the sector you work in?',
      type: 'single',
      options: [
        'NHS or wider healthcare',
        'Social care',
        'Legal services',
        'Education',
        'Local or central government',
        'Housing',
        'Finance or professional services',
        'Private sector (other)',
        'Other',
      ],
      screenerNote: 'OneAdvanced serves regulated and public sector markets — filter for the specific sector relevant to this research. Adjust options as needed.',
    },
    {
      question: isUsabilityFocused
        ? 'How often do you use [product / system / workflow type] in your work?'
        : 'How often do you carry out [relevant task or activity] as part of your role?',
      type: 'single',
      options: ['Daily', 'Several times a week', 'Once a week', 'A few times a month', 'Rarely or never'],
      screenerNote: 'Qualify participants who use the relevant system or carry out the relevant task regularly. Frequency threshold depends on your research objectives.',
    },
    ...(isExploratory ? [{
      question: 'Can you briefly describe a recent situation where you [relevant task / decision / workflow]?',
      type: 'text' as const,
      screenerNote: 'Look for genuine experience. Thin or generic answers may indicate the participant lacks relevant context.',
    }] : []),
    ...(isUsabilityFocused ? [{
      question: 'Have you used [product name or type] before?',
      type: 'single' as const,
      options: ['Yes, I use it regularly', 'Yes, I have used it occasionally', 'No, but I am familiar with similar tools', 'No, I have not used anything like this'],
      screenerNote: 'Select target experience level based on whether you need novice users, experienced users, or a mix.',
    }] : []),
    ...(isRegulated ? [{
      question: 'Do you currently work directly with [clinical / safety-critical / regulated system] as part of your role?',
      type: 'yesno' as const,
      screenerNote: 'Required for regulated research. Only include participants with genuine operational exposure to the use context.',
    }] : []),
    {
      question: 'Are you available for a [session length] research session within the next [X] weeks?',
      type: 'yesno',
      screenerNote: 'Availability check. Follow up with specific scheduling options for qualified participants.',
    },
    {
      question: 'Do you have any accessibility requirements we should be aware of when planning the session?',
      type: 'text',
      screenerNote: 'Open field. Use to plan reasonable adjustments. Do not use as a screening criterion.',
    },
  ];

  return { intro, questions };
}

function generateOutreachEmail(primary: ResearchMethod, answers: IntakeAnswers): StarterResearchPlan['outreachEmail'] {
  const { decision } = answers;
  const isUsabilityFocused = ['moderated_usability_testing', 'unmoderated_usability_testing', 'formative_usability_evaluation'].includes(primary.id);
  const isExploratory = ['semi_structured_interviews', 'contextual_inquiry'].includes(primary.id);
  const sessionLength = isUsabilityFocused ? '60 minutes' : '45–60 minutes';
  const methodLabel = isUsabilityFocused
    ? 'design feedback session'
    : isExploratory
    ? 'research interview'
    : 'research session';

  const subject = `Invitation to take part in a ${methodLabel} — OneAdvanced research`;

  const body = `Hi [Name],

I'm reaching out from the research team at OneAdvanced. We're conducting research to help us better understand [brief context related to: ${decision.slice(0, 80)}], and we'd welcome your perspective.

We build software that supports mission-critical work across sectors like healthcare, legal, education, and social care — and the insight we gather from people doing this work every day is what helps us improve it. Based on [how we found you / your response to our screener], your experience seems like a great fit for what we're exploring.

What's involved:
— A ${sessionLength} ${methodLabel} with one of our researchers
— ${isUsabilityFocused ? "You'll be asked to try out a design and share your thoughts as you go — there are no right or wrong answers, and we're evaluating the design, not you" : 'A relaxed conversation about your experience and how you currently approach [relevant task or workflow]'}
— The session will be conducted [remotely via video call / in person at [location]]
— With your permission, we'd like to record the session for internal analysis only — recordings are not shared outside the research team

Your input will directly shape decisions about [brief outcome — e.g., how we improve X / whether we proceed with Y].

[Optional: As a thank you for your time, we're offering [incentive details].]

If you're interested, please [complete the short screener survey at this link / reply to this email] and we'll be in touch to arrange a time that suits you.

If now isn't the right time but you'd be open to future research, let me know and I'll add you to our participant pool.

Thank you — your perspective matters to us, and to the people who rely on the software we build.

[Your name]
[Job title]
OneAdvanced
[Email address]
[Phone number — optional]

---
This research is being conducted by OneAdvanced Ltd. Your participation is entirely voluntary. Any data collected will be handled in accordance with OneAdvanced's privacy policy: https://www.oneadvanced.com/privacy-policy/. If you have any questions about how your data will be used, please contact [research team email].`;

  return { subject, body };
}

function generateConsentForm(primary: ResearchMethod, answers: IntakeAnswers): StarterResearchPlan['consentForm'] {
  const { decision, sensitiveContexts, riskLevel } = answers;
  const isRegulated = sensitiveContexts.some((c) => ['healthcare_clinical', 'compliance_audit'].includes(c));
  const isHighRisk = riskLevel === 'high' || riskLevel === 'critical';
  const isUsabilityFocused = ['moderated_usability_testing', 'unmoderated_usability_testing', 'formative_usability_evaluation'].includes(primary.id);

  const sections: StarterResearchPlan['consentForm']['sections'] = [
    {
      heading: 'About this research',
      content: `This research is being conducted by OneAdvanced Ltd to help us improve our products and services. Specifically, we are researching: ${decision.slice(0, 120)}${decision.length > 120 ? '...' : ''}

OneAdvanced builds software that supports mission-critical work in healthcare, legal, education, social care, and the public sector. The insight we gather from participants like you directly informs how we design and develop software that makes a real difference to people's working lives.

The session will involve ${isUsabilityFocused ? 'trying out a design and sharing your thoughts as you go' : 'a conversation about your experience and how you approach [relevant tasks]'}. The session will last approximately [session length].

Your participation is entirely voluntary. You can withdraw at any time, including after the session, without giving a reason and without any consequence to your relationship with OneAdvanced or your employer.`,
    },
    {
      heading: 'What we will do with your data',
      content: `With your permission, we will record this session (audio/video) for internal research analysis only. Recordings will not be shared outside the OneAdvanced research team without your explicit permission.

Any notes, quotes, or findings from this session will be anonymised before being shared in internal reports or presentations. You will not be identifiable in any output without your express consent.

${isRegulated ? 'For regulatory or compliance purposes, some session data may need to be retained as part of a formal usability evidence record. This will be handled in accordance with applicable data protection requirements and will be explained to you in full before the session begins.' : ''}

Data will be stored securely by OneAdvanced in accordance with UK GDPR and our data retention policy, and deleted after [X months / as specified in our retention schedule]. You can request access to or deletion of your data at any time by contacting our research team at [research team email].

For more information about how OneAdvanced handles personal data, see our privacy policy: https://www.oneadvanced.com/privacy-policy/`,
    },
    {
      heading: 'Your rights',
      content: `Under UK GDPR, you have the right to:
— Withdraw from the research at any time, including during the session, without explanation or consequence
— Request access to the personal data we hold about you
— Request correction or deletion of your data
— Raise a concern about how your data is being handled

You do not have to answer any question you are not comfortable with. If you are uncertain about anything before or during the session, please ask.

If you have concerns about how your data is being handled, you can contact OneAdvanced's Data Protection Officer at [DPO email / dpo@oneadvanced.com]. You also have the right to raise a concern with the Information Commissioner's Office (ICO) at ico.org.uk.`,
    },
    {
      heading: 'Consent declaration',
      content: `Please confirm your agreement to each of the following by initialling or ticking:

☐  I have read and understood the participant information above and have had the opportunity to ask questions.

☐  I understand that my participation is voluntary and that I can withdraw at any time without consequence.

☐  I agree to take part in this OneAdvanced research session.

☐  I give permission for the session to be recorded (audio/video) for internal research analysis by the OneAdvanced research team.

☐  I understand that my responses will be anonymised before being shared in any internal reports or presentations.

${isHighRisk || isRegulated ? '☐  I understand that anonymised session data may be retained as part of a formal evidence record for regulatory, quality assurance, or compliance purposes.' : ''}

☐  I am happy to be contacted for future research by OneAdvanced. (Optional)

---

Participant name: ___________________________

Signature: ___________________________   Date: _______________

Researcher name: ___________________________

Signature: ___________________________   Date: _______________`,
    },
    {
      heading: 'Note to researchers',
      content: `Before using this consent form, review it with OneAdvanced's legal, compliance, or data protection team to confirm it meets current requirements${isRegulated ? ', including any specific obligations for regulated, clinical, or safety-critical research contexts' : ''}. This template is a starting point — it is not a legally reviewed document and should not be used without internal sign-off.`,
    },
  ];

  return { sections };
}

function generateStarterPlan(
  primary: ResearchMethod,
  supporting: ResearchMethod[],
  answers: IntakeAnswers,
  confidence: 'Low' | 'Medium' | 'High'
): StarterResearchPlan {
  const { decision, stage, riskLevel, timeline, sensitiveContexts, uncertainties } = answers;
  const isHighRisk = riskLevel === 'high' || riskLevel === 'critical';
  const isRegulated =
    stage === 'regulated_validation' ||
    sensitiveContexts.some((c) => ['healthcare_clinical', 'compliance_audit'].includes(c));

  const stageLabel = {
    early_idea: 'Early idea / opportunity',
    problem_discovery: 'Problem discovery',
    concept: 'Concept stage',
    prototype: 'Prototype stage',
    live_product: 'Live product',
    post_release: 'Post-release optimisation',
    regulated_validation: 'Regulated validation',
    '': 'Unknown stage',
  }[stage];

  const timelineLabel = {
    '1_week': '1 week',
    '2_weeks': '2 weeks',
    '3_4_weeks': '3–4 weeks',
    '1_2_months': '1–2 months',
    flexible: 'Flexible',
    '': 'To be confirmed',
  }[timeline];

  const researchQuestions = generateResearchQuestions(primary.id, answers);

  const checklist = [
    { item: 'Decision owner identified and engaged', highRiskOnly: false },
    { item: 'Research objective agreed with key stakeholders', highRiskOnly: false },
    { item: 'Target user group defined with clear inclusion criteria', highRiskOnly: false },
    { item: 'Recruitment route understood and feasible', highRiskOnly: false },
    { item: 'Existing evidence reviewed before starting new data collection', highRiskOnly: false },
    { item: 'Method selected with rationale documented', highRiskOnly: false },
    { item: 'Session recording confirmed — consent process in place, recording tool tested', highRiskOnly: false },
    { item: 'Observer or note-taker arranged (separate from facilitator)', highRiskOnly: false },
    { item: 'Risks and assumptions captured', highRiskOnly: false },
    { item: 'Materials needed identified', highRiskOnly: false },
    { item: 'Analysis approach agreed', highRiskOnly: false },
    { item: 'Output format agreed with decision owner', highRiskOnly: false },
    { item: 'Use-related risks reviewed', highRiskOnly: true },
    { item: 'Critical tasks identified and linked to risk analysis', highRiskOnly: true },
    { item: 'Participant rationale documented by use characteristics', highRiskOnly: true },
    { item: 'Traceability approach agreed for regulatory evidence', highRiskOnly: true },
    { item: 'Validation claims avoided unless evidence explicitly supports them', highRiskOnly: true },
  ];

  return {
    title: `Research plan: ${decision.slice(0, 80)}${decision.length > 80 ? '...' : ''}`,
    background: `This research is being planned at the ${stageLabel} stage. The team needs to make the following decision: ${decision}`,
    decision,
    objectives: [
      `Understand ${uncertainties.includes('problem_not_understood') ? 'the problem space and underlying user needs' : 'the specific aspects of user experience relevant to this decision'}`,
      `Generate evidence sufficient to support a confident decision about ${decision.slice(0, 60)}`,
      isHighRisk ? 'Document evidence with explicit links to known risks and assumptions' : '',
    ].filter(Boolean),
    researchQuestions,
    method: `Primary: ${primary.name}${supporting.length > 0 ? '. Supporting: ' + supporting.map((m) => m.name).join(', ') : ''}`,
    participants:
      isRegulated
        ? 'Participants must be selected to match the intended use population as defined in the risk or use specification. Justify participant selection by use characteristics, not convenience.'
        : 'Participants should be representative of the target user group. Define inclusion criteria based on role, experience, and context of use.',
    recruitmentConsiderations:
      'Define minimum inclusion criteria before starting recruitment. Allow additional time if the target group is hard to reach. Aim to recruit a range of experience levels where relevant to the question.',
    materialsNeeded: [
      'Discussion guide or task script',
      'Consent and information forms',
      `${answers.prototypeAvailability !== 'none' ? answers.prototypeAvailability === 'ai_generated' ? 'AI-generated prototype (confirm fidelity and content accuracy before sessions)' : 'Prototype or test environment' : 'Stimulus materials relevant to the method'}`,
      'Recording equipment or remote research tool',
      'Synthesis template or analysis framework',
    ],
    sessionOutline: primary.id === 'moderated_usability_testing' ? [
      'Welcome and consent (5 min)',
      'Warm-up questions about context and current approach (10 min)',
      'Task-based walkthrough with think-aloud protocol (25–35 min)',
      'Debrief questions about overall experience (10 min)',
      'Close and next steps (5 min)',
    ] : primary.id.includes('interview') || primary.id.includes('inquiry') ? [
      'Welcome and consent (5 min)',
      'Background and context questions (10 min)',
      'Core exploration of main themes (30–40 min)',
      'Follow-up on key moments or examples (10 min)',
      'Close and reflection (5 min)',
    ] : [
      'Introduction and objectives overview',
      'Core method activities',
      'Synthesis or debrief',
      'Next steps and output review',
    ],
    dataCapture: [
      'Session recordings (with consent)',
      'Observation notes and highlights',
      'Direct participant quotes',
      isHighRisk ? 'Risk-linked issue log' : 'Issue or theme log',
    ],
    analysisApproach:
      primary.category === 'Quantitative'
        ? 'Statistical summary of responses. Segment by relevant user characteristics. Identify significant patterns and anomalies.'
        : 'Thematic analysis across sessions. Identify recurring patterns, outliers, and key quotes. Prioritise themes by frequency and severity.',
    outputs: [
      'Summary of findings and key themes',
      'Prioritised recommendations linked to the original decision',
      isHighRisk ? 'Risk-linked evidence summary' : '',
      `Input to ${answers.decisionOwners.includes('senior_leadership') ? 'leadership review' : 'product planning'}`,
    ].filter(Boolean),
    timeline: `Target completion in ${timelineLabel}. Allow time for recruitment, fieldwork, analysis, and synthesis before the decision deadline.`,
    risksAndMitigations: [
      'Risk: Participants do not reflect actual user population. Mitigation: Define inclusion criteria tightly and verify before sessions.',
      confidence === 'Low' ? 'Risk: Timeline may be too short for robust findings. Mitigation: Scope the research tightly and be explicit about the limitations of findings.' : '',
      isHighRisk ? 'Risk: Evidence does not meet documentation standards required. Mitigation: Agree documentation approach with relevant stakeholders before research begins.' : '',
    ].filter(Boolean),
    openQuestions: [
      'Is the decision deadline confirmed, and does the timeline allow for proper analysis?',
      'Have we reviewed all existing evidence before starting new data collection?',
      isHighRisk ? 'Have we identified the critical tasks and linked them to the risk framework?' : '',
    ].filter(Boolean),
    planningChecklist: checklist.filter((c) => !c.highRiskOnly || isHighRisk || isRegulated),
    screeningSurvey: generateScreeningSurvey(primary, answers),
    outreachEmail: generateOutreachEmail(primary, answers),
    consentForm: generateConsentForm(primary, answers),
  };
}

export function generateRecommendation(answers: IntakeAnswers): Recommendation {
  // Score all methods
  const scores: MethodScore[] = METHODS.map((method) => ({
    method,
    score: scoreMethod(method, answers),
  })).sort((a, b) => b.score - a.score);

  // Pick primary (highest score, must be positive)
  const primaryScore = scores[0];
  const primary = primaryScore.score > 0 ? primaryScore.method : METHODS.find((m) => m.id === 'semi_structured_interviews')!;

  // Supporting methods: next 2–4 with positive scores, excluding primary
  const supporting = scores
    .filter((s) => s.method.id !== primary.id && s.score > 2)
    .slice(0, 3)
    .map((s) => s.method);

  const confidence = deriveConfidence(answers, primary.id);
  const rationale = deriveRationale(primary, answers);
  const warnings = deriveWarnings(primary, answers);

  const effortMap: Record<string, string> = {
    '1_week': 'Low — constrained by timeline',
    '2_weeks': 'Medium — focused study',
    '3_4_weeks': 'Medium-high — full study',
    '1_2_months': 'High — thorough investigation',
    flexible: 'Medium — scope to be confirmed',
    '': 'To be confirmed',
  };

  const suggestedDesign = (() => {
    const isRegulated =
      answers.stage === 'regulated_validation' ||
      answers.sensitiveContexts.some((c) => ['healthcare_clinical', 'compliance_audit'].includes(c));

    const participantType = isRegulated
      ? 'Participants matching the intended use population as defined in the risk or use specification'
      : primary.id.includes('stakeholder')
      ? 'Internal stakeholders with relevant decision-making responsibility'
      : 'Users representative of the target population, selected by role and context of use';

    const sampleRange = isRegulated
      ? 'Sample size should be justified by the study scope and validated against regulatory expectations — not assumed from generic guidelines'
      : primary.category === 'Quantitative'
      ? 'Sample size depends on precision needed — for initial benchmarking, discuss with a statistician'
      : primary.id === 'moderated_usability_testing'
      ? '5–8 participants per distinct user group is a reasonable starting point for identifying likely usability issues'
      : '5–8 participants for initial patterns; additional participants if significant divergence in themes';

    return {
      participantType,
      sampleRange,
      sessionFormat: primary.category === 'Quantitative' ? 'Online, asynchronous' : 'Remote or in-person, depending on participant access',
      sessionLength: primary.id === 'moderated_usability_testing' ? '60–75 minutes' : primary.id.includes('interview') ? '45–60 minutes' : 'Variable — confirm based on method',
      activities: primary.goodFor.slice(0, 3),
      dataSources: [
        'Session recordings',
        primary.category === 'Quantitative' ? 'Quantitative response data' : 'Observation notes',
        'Participant quotes',
      ],
      analysisApproach: primary.category === 'Quantitative'
        ? 'Statistical analysis and data visualisation'
        : 'Thematic analysis with affinity mapping',
    };
  })();

  const starterPlan = generateStarterPlan(primary, supporting, answers, confidence);

  return {
    primaryMethod: primary,
    supportingMethods: supporting,
    confidence,
    riskLevel: (answers.riskLevel || 'medium') as any,
    effort: effortMap[answers.timeline || ''],
    rationale,
    warnings,
    assumptions: [
      'The decision described is the actual decision the team needs to make.',
      'Participants recruited will have genuine experience relevant to the question.',
      'Findings will be shared with and acted on by the decision owner.',
    ],
    limitations: [
      ...(confidence === 'Low' ? ['The constrained timeline limits the depth and reliability of findings possible.'] : []),
      ...(answers.uncertainties.includes('how_common') && answers.evidenceNeeds.includes('prevalence')
        ? ['Qualitative methods will identify patterns but cannot reliably quantify prevalence — a subsequent survey or analytics review may be needed.']
        : []),
      ...(answers.riskLevel === 'critical'
        ? ['High-risk or regulated decisions require explicit documentation and traceability that should be planned before research begins.']
        : []),
    ],
    nextActions: [
      // Only suggest reviewing existing evidence if they haven't already done so
      ...(answers.existingEvidence.includes('none') || answers.existingEvidence.length === 0
        ? ['Review any existing evidence (analytics, support tickets, previous research) before starting new data collection.']
        : ['Build on existing evidence — use what you already know to focus the research on genuine gaps.']),
      'Define and document the target user population and inclusion criteria.',
      `Agree the specific research questions and success criteria with ${answers.decisionOwners.length > 0 ? 'the decision owner' : 'relevant stakeholders'}.`,
      ...(answers.stage === 'regulated_validation' || answers.riskLevel === 'critical'
        ? ['Document the evidence plan — including participant rationale, critical tasks, and links to risk controls — before fieldwork begins.']
        : ['Plan your analysis approach before fieldwork begins, not after.']),
    ],
    whatIncreasesConfidence: [
      'Recruiting participants who genuinely match the target user population',
      'Recording sessions — recordings let you revisit moments you missed, share evidence with stakeholders, and reduce reliance on in-the-moment memory',
      'Having a dedicated observer separate from the facilitator — the facilitator cannot simultaneously run the session and capture everything accurately',
      'Triangulating findings across multiple methods or data sources',
      'Running analysis sessions with multiple team members to reduce individual bias',
      answers.riskLevel === 'critical' ? 'Documenting evidence with explicit traceability to risks and assumptions' : 'Documenting key assumptions before and after research',
    ],
    suggestedDesign,
    starterPlan,
  };
}
