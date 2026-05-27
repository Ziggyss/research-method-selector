export type ResearchStage =
  | 'early_idea'
  | 'problem_discovery'
  | 'concept'
  | 'prototype'
  | 'live_product'
  | 'post_release'
  | 'regulated_validation';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type EvidenceNeed =
  | 'behaviour_context'
  | 'needs_pain_points'
  | 'task_performance'
  | 'prevalence'
  | 'comparison'
  | 'journey_service'
  | 'risk_safety'
  | 'stakeholder_alignment'
  | 'market_context';

export type Uncertainty =
  | 'problem_not_understood'
  | 'user_needs_workflows'
  | 'why_behaviour'
  | 'evaluate_concept'
  | 'test_usability'
  | 'how_common'
  | 'prioritise_options'
  | 'trust_confidence_risk'
  | 'high_risk_workflow'
  | 'stakeholder_alignment';

export type DecisionOwner =
  | 'pm'
  | 'design_lead'
  | 'engineering_lead'
  | 'senior_leadership'
  | 'clinical_safety_lead'
  | 'customer_implementation'
  | 'other';

export type Timeline = '1_week' | '2_weeks' | '3_4_weeks' | '1_2_months' | 'flexible';

export type ParticipantAccess = 'easy' | 'moderate' | 'difficult' | 'unknown';

export type ResearcherAvailability =
  | 'dedicated'
  | 'designer_led'
  | 'pm_led'
  | 'external'
  | 'unknown';

export type PrototypeAvailability =
  | 'none'
  | 'sketches'
  | 'low_fidelity'
  | 'ai_generated'
  | 'high_fidelity'
  | 'working_build'
  | 'live_product';

export type ExistingEvidence =
  | 'none'
  | 'analytics'
  | 'support_tickets'
  | 'previous_research'
  | 'sales_feedback'
  | 'customer_calls'
  | 'repository_evidence'
  | 'other';

export type SensitiveContext =
  | 'healthcare_clinical'
  | 'legal'
  | 'financial'
  | 'ai_recommendations'
  | 'automation_agentic'
  | 'sensitive_data'
  | 'accessibility_risk'
  | 'compliance_audit'
  | 'none';

export interface IntakeAnswers {
  // Step 1: Decision
  decision: string;
  decisionOwners: DecisionOwner[];

  // Step 2: Unknowns
  uncertainties: Uncertainty[];
  uncertaintyDescription: string;

  // Step 3: Stage
  stage: ResearchStage | '';

  // Step 4: Evidence
  evidenceNeeds: EvidenceNeed[];
  convincingEvidence: string;

  // Step 5: Risk
  riskLevel: RiskLevel | '';
  sensitiveContexts: SensitiveContext[];

  // Step 6: Constraints
  timeline: Timeline | '';
  participantAccess: ParticipantAccess | '';
  researcherAvailability: ResearcherAvailability | '';
  prototypeAvailability: PrototypeAvailability | '';
  existingEvidence: ExistingEvidence[];
  additionalContext: string;
  researcherName: string;
  researcherEmail: string;
}

export type MethodCategory =
  | 'Exploratory'
  | 'Generative'
  | 'Evaluative'
  | 'Quantitative'
  | 'Strategic alignment'
  | 'Regulated / high-risk';

export interface ResearchMethod {
  id: string;
  name: string;
  category: MethodCategory;
  description: string;
  goodFor: string[];
  weakFor: string[];
  typicalOutputs: string[];
  cautionNotes: string[];
  planningConsiderations: string[];
  commonMisuse: string;
}

export interface StarterResearchPlan {
  title: string;
  background: string;
  decision: string;
  objectives: string[];
  researchQuestions: string[];
  method: string;
  participants: string;
  recruitmentConsiderations: string;
  materialsNeeded: string[];
  sessionOutline: string[];
  dataCapture: string[];
  analysisApproach: string;
  outputs: string[];
  timeline: string;
  risksAndMitigations: string[];
  openQuestions: string[];
  planningChecklist: { item: string; highRiskOnly: boolean }[];
  screeningSurvey: {
    intro: string;
    questions: { question: string; type: 'single' | 'multi' | 'text' | 'yesno'; options?: string[]; screenerNote?: string }[];
  };
  outreachEmail: {
    subject: string;
    body: string;
  };
  consentForm: {
    sections: { heading: string; content: string }[];
  };
}

export interface Recommendation {
  primaryMethod: ResearchMethod;
  supportingMethods: ResearchMethod[];
  confidence: 'Low' | 'Medium' | 'High';
  riskLevel: RiskLevel;
  effort: string;
  rationale: string[];
  warnings: string[];
  assumptions: string[];
  limitations: string[];
  nextActions: string[];
  whatIncreasesConfidence: string[];
  suggestedDesign: {
    participantType: string;
    sampleRange: string;
    sessionFormat: string;
    sessionLength: string;
    activities: string[];
    dataSources: string[];
    analysisApproach: string;
  };
  starterPlan: StarterResearchPlan;
}

export type AppView = 'landing' | 'flow' | 'library';

export type FlowStep =
  | 'decision'
  | 'unknowns'
  | 'stage'
  | 'evidence'
  | 'risk'
  | 'constraints'
  | 'recommendation'
  | 'plan';
