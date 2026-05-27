import type {
  DecisionOwner,
  Uncertainty,
  ResearchStage,
  EvidenceNeed,
  RiskLevel,
  SensitiveContext,
  Timeline,
  ParticipantAccess,
  ResearcherAvailability,
  PrototypeAvailability,
  ExistingEvidence,
} from '../types/research';

export const DECISION_OWNER_OPTIONS: { value: DecisionOwner; label: string }[] = [
  { value: 'pm', label: 'Product manager' },
  { value: 'design_lead', label: 'Design lead' },
  { value: 'engineering_lead', label: 'Engineering lead' },
  { value: 'senior_leadership', label: 'Senior leadership' },
  { value: 'clinical_safety_lead', label: 'Clinical / safety lead' },
  { value: 'customer_implementation', label: 'Customer / implementation team' },
  { value: 'other', label: 'Other' },
];

export const UNCERTAINTY_OPTIONS: { value: Uncertainty; label: string; description: string }[] = [
  { value: 'problem_not_understood', label: 'We do not understand the problem yet', description: "We haven't defined what we're actually trying to solve. We need to explore before deciding what to build or fix." },
  { value: 'user_needs_workflows', label: 'We do not understand user needs or workflows', description: "We don't know what users actually do day-to-day, what they need, or how their work is structured." },
  { value: 'why_behaviour', label: 'We do not know why users behave a certain way', description: "We can see what's happening (e.g. users drop off, avoid a feature) but don't know the reasons behind it." },
  { value: 'evaluate_concept', label: 'We need to evaluate a concept or idea', description: "We have a rough direction or idea and want to know if it makes sense, resonates, or addresses the right problem — before designing in detail." },
  { value: 'test_usability', label: 'We need to test whether a design is usable', description: "We have a design or prototype and want to watch real users try to use it — to find where they struggle or get confused." },
  { value: 'how_common', label: 'We need to understand how common something is', description: "We think we've found a problem or need, and want to know how widespread it is across our user base — not just a few cases." },
  { value: 'prioritise_options', label: 'We need to prioritise between options', description: "We have more than one idea, feature, or direction and need to decide which matters most or which to tackle first." },
  { value: 'trust_confidence_risk', label: 'We need to understand trust, confidence, or perceived risk', description: "We want to know how comfortable users feel — particularly with AI recommendations, automated decisions, or high-stakes actions." },
  { value: 'high_risk_workflow', label: 'We need to validate a high-risk or regulated workflow', description: "The workflow involves safety-critical, clinical, legal, or compliance-sensitive steps. The evidence needs to meet a higher standard." },
  { value: 'stakeholder_alignment', label: 'We need stakeholder alignment', description: "Different people in the organisation disagree about what users need. We need to get everyone on the same page before moving forward." },
];

export const STAGE_OPTIONS: { value: ResearchStage; label: string; description: string }[] = [
  { value: 'early_idea', label: 'Early idea / opportunity area', description: 'No defined solution yet — exploring what problems are worth solving.' },
  { value: 'problem_discovery', label: 'Problem discovery', description: 'Actively investigating a known problem area to understand it in depth.' },
  { value: 'concept', label: 'Concept direction', description: 'One or more concepts exist but are not yet designed in detail.' },
  { value: 'prototype', label: 'Prototype', description: 'A prototype exists — could be low or high fidelity.' },
  { value: 'live_product', label: 'Live product or service', description: 'The product or service is in use by real customers or users.' },
  { value: 'post_release', label: 'Post-release optimisation', description: 'Improving or iterating on a live product based on usage data or feedback.' },
  { value: 'regulated_validation', label: 'Regulated validation / compliance evidence', description: 'Generating evidence for regulatory submission, clinical use, or compliance audit.' },
];

export const EVIDENCE_NEED_OPTIONS: { value: EvidenceNeed; label: string; description: string }[] = [
  { value: 'behaviour_context', label: 'Deep understanding of behaviours and context', description: "You want to understand how users actually work — in their real environment, with all its complexity — not just what they say they do." },
  { value: 'needs_pain_points', label: 'User needs, pain points, and motivations', description: "You want to know what users are trying to achieve, where they get frustrated, and what would make their work easier." },
  { value: 'task_performance', label: 'Observed task performance', description: "You want to watch someone actually try to complete a task and see where they succeed, fail, hesitate, or go wrong." },
  { value: 'prevalence', label: 'Prevalence or confidence at scale', description: "You need numbers — how common is this problem or behaviour across your whole user base, not just among a handful of people?" },
  { value: 'comparison', label: 'Comparison between options', description: "You need to compare two or more designs, approaches, or ideas to determine which performs better or is preferred." },
  { value: 'journey_service', label: 'Journey or service breakdown', description: "You want to map the full end-to-end experience — across steps, teams, or channels — to find where things break down." },
  { value: 'risk_safety', label: 'Risk / safety evidence', description: "You need evidence specifically about whether a workflow could lead to harm, serious error, or compliance failure." },
  { value: 'stakeholder_alignment', label: 'Stakeholder alignment', description: "The main goal is getting internal teams to agree on priorities or direction — not generating new evidence from users." },
  { value: 'market_context', label: 'Market or competitor context', description: "You want to understand how users perceive your product relative to alternatives, or what the broader landscape looks like." },
];

export const RISK_LEVEL_OPTIONS: { value: RiskLevel; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Minor usability or preference issue with limited downstream impact.' },
  { value: 'medium', label: 'Medium', description: 'Affects adoption, efficiency, satisfaction, or delivery cost.' },
  { value: 'high', label: 'High', description: 'Affects customer retention, safety, compliance, revenue, or major strategic investment.' },
  { value: 'critical', label: 'Critical', description: 'Regulated, safety-related, clinical, legal, financial, or operationally sensitive.' },
];

export const SENSITIVE_CONTEXT_OPTIONS: { value: SensitiveContext; label: string }[] = [
  { value: 'healthcare_clinical', label: 'Healthcare or clinical workflow' },
  { value: 'legal', label: 'Legal workflow' },
  { value: 'financial', label: 'Financial decision-making' },
  { value: 'ai_recommendations', label: 'AI-generated recommendations' },
  { value: 'automation_agentic', label: 'Automation or agentic behaviour' },
  { value: 'sensitive_data', label: 'Sensitive personal data' },
  { value: 'accessibility_risk', label: 'Accessibility risk' },
  { value: 'compliance_audit', label: 'Compliance or audit relevance' },
  { value: 'none', label: 'None of these' },
];

export const TIMELINE_OPTIONS: { value: Timeline; label: string }[] = [
  { value: '1_week', label: '1 week' },
  { value: '2_weeks', label: '2 weeks' },
  { value: '3_4_weeks', label: '3–4 weeks' },
  { value: '1_2_months', label: '1–2 months' },
  { value: 'flexible', label: 'Flexible' },
];

export const PARTICIPANT_ACCESS_OPTIONS: { value: ParticipantAccess; label: string }[] = [
  { value: 'easy', label: 'Easy — participants readily available' },
  { value: 'moderate', label: 'Moderate — some effort to recruit' },
  { value: 'difficult', label: 'Difficult — hard to reach population' },
  { value: 'unknown', label: 'Unknown' },
];

export const RESEARCHER_AVAILABILITY_OPTIONS: { value: ResearcherAvailability; label: string }[] = [
  { value: 'dedicated', label: 'Dedicated researcher' },
  { value: 'designer_led', label: 'Designer-led' },
  { value: 'pm_led', label: 'PM-led' },
  { value: 'external', label: 'External support' },
  { value: 'unknown', label: 'Unknown' },
];

export const PROTOTYPE_AVAILABILITY_OPTIONS: { value: PrototypeAvailability; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sketches', label: 'Sketches or wireframes' },
  { value: 'low_fidelity', label: 'Low-fidelity prototype' },
  { value: 'ai_generated', label: 'AI-generated prototype' },
  { value: 'high_fidelity', label: 'High-fidelity prototype' },
  { value: 'working_build', label: 'Working build' },
  { value: 'live_product', label: 'Live product' },
];

export const EXISTING_EVIDENCE_OPTIONS: { value: ExistingEvidence; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'analytics', label: 'Analytics data' },
  { value: 'support_tickets', label: 'Support tickets or call logs' },
  { value: 'previous_research', label: 'Previous research' },
  { value: 'sales_feedback', label: 'Sales or commercial feedback' },
  { value: 'customer_calls', label: 'Customer calls or success notes' },
  { value: 'repository_evidence', label: 'Research repository evidence' },
  { value: 'other', label: 'Other existing evidence' },
];
