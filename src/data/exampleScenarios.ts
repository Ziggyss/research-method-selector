import type { IntakeAnswers } from '../types/research';

export interface ExampleScenario {
  id: string;
  title: string;
  description: string;
  answers: IntakeAnswers;
}

export const EXAMPLE_SCENARIOS: ExampleScenario[] = [
  {
    id: 'onboarding_abandonment',
    title: 'Why are users abandoning onboarding?',
    description: 'We need to understand why users abandon onboarding before completing setup.',
    answers: {
      decision:
        'We need to decide what to improve in the onboarding journey because users are abandoning before completing setup.',
      decisionOwners: ['pm', 'design_lead'],
      uncertainties: ['why_behaviour', 'user_needs_workflows', 'how_common'],
      uncertaintyDescription:
        'We see the drop-off in analytics but do not know why it is happening or where the friction is.',
      stage: 'live_product',
      evidenceNeeds: ['behaviour_context', 'journey_service'],
      convincingEvidence:
        'We need to understand the specific points of abandonment and the reasons behind them well enough to prioritise changes confidently.',
      riskLevel: 'medium',
      sensitiveContexts: ['none'],
      timeline: '3_4_weeks',
      participantAccess: 'moderate',
      researcherAvailability: 'dedicated',
      prototypeAvailability: 'live_product',
      existingEvidence: ['analytics', 'support_tickets'],
      additionalContext: '',
      researcherName: '',
      researcherEmail: '',
    },
  },
  {
    id: 'ai_trust',
    title: 'Would customers trust an AI assistant?',
    description: 'We need to know if customers would trust an AI assistant to help configure workflows.',
    answers: {
      decision:
        'We need to decide whether customers would trust an AI assistant to help configure complex workflows before we invest in building it.',
      decisionOwners: ['pm', 'senior_leadership'],
      uncertainties: ['evaluate_concept', 'trust_confidence_risk', 'user_needs_workflows'],
      uncertaintyDescription:
        'We are unsure whether users will trust AI-generated suggestions in high-stakes configuration scenarios.',
      stage: 'concept',
      evidenceNeeds: ['behaviour_context', 'risk_safety', 'needs_pain_points'],
      convincingEvidence:
        'We need to understand when and why users would trust or distrust AI recommendations in this context, and what conditions increase or reduce that trust.',
      riskLevel: 'high',
      sensitiveContexts: ['ai_recommendations', 'automation_agentic'],
      timeline: '3_4_weeks',
      participantAccess: 'moderate',
      researcherAvailability: 'dedicated',
      prototypeAvailability: 'low_fidelity',
      existingEvidence: ['none'],
      additionalContext: '',
      researcherName: '',
      researcherEmail: '',
    },
  },
  {
    id: 'redesigned_workflow',
    title: 'Can users complete our redesigned workflow?',
    description: 'We redesigned a workflow and need quick feedback before handover to engineering.',
    answers: {
      decision:
        'We need to know whether users can complete the redesigned approval workflow before we hand it over to engineering.',
      decisionOwners: ['design_lead', 'engineering_lead'],
      uncertainties: ['test_usability'],
      uncertaintyDescription:
        'We have redesigned the workflow and want to check that users can complete the key tasks without errors or confusion.',
      stage: 'prototype',
      evidenceNeeds: ['task_performance'],
      convincingEvidence:
        'We need evidence that users can complete the priority tasks without needing help or making critical errors.',
      riskLevel: 'medium',
      sensitiveContexts: ['none'],
      timeline: '2_weeks',
      participantAccess: 'easy',
      researcherAvailability: 'designer_led',
      prototypeAvailability: 'high_fidelity',
      existingEvidence: ['previous_research'],
      additionalContext: '',
      researcherName: '',
      researcherEmail: '',
    },
  },
];
