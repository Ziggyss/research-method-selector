import type { ResearchMethod } from '../types/research';

export const METHODS: ResearchMethod[] = [
  {
    id: 'semi_structured_interviews',
    name: 'Semi-structured interviews',
    category: 'Exploratory',
    description:
      'In-depth conversations with individual participants to explore behaviours, motivations, needs, and context in their own words.',
    goodFor: [
      'Understanding why users behave the way they do',
      'Exploring unknown unknowns and hidden context',
      'Uncovering mental models and decision-making processes',
      'Early discovery where hypotheses are unclear',
      'Understanding workflows, needs, and pain points in depth',
    ],
    weakFor: [
      'Measuring prevalence or frequency of issues',
      'Generating statistically representative data',
      'Testing specific interface interactions',
    ],
    typicalOutputs: [
      'Synthesis of themes and patterns',
      'Personas or user profiles',
      'Need statements and opportunity areas',
      'Quotes and illustrative examples',
    ],
    cautionNotes: [
      'Self-report is not always reliable: what people say they do can differ from what they actually do.',
      'Small samples identify patterns but do not quantify prevalence.',
    ],
    planningConsiderations: [
      'Recruit participants who match actual use characteristics, not just job titles.',
      'Use a discussion guide, not a questionnaire — follow the participant.',
      'Allow at least 45–60 minutes per session.',
      'Plan thematic analysis with 5–8 participants minimum for initial patterns.',
    ],
    commonMisuse:
      'Using interview quotes as validation evidence or treating themes from 3 interviews as statistically representative.',
  },
  {
    id: 'contextual_inquiry',
    name: 'Contextual inquiry / workflow walkthroughs',
    category: 'Exploratory',
    description:
      'Observing and interviewing users in or near their actual work context to understand real workflows, tools, and environment.',
    goodFor: [
      'Understanding complex, multi-step workflows',
      'Identifying workarounds, hacks, and hidden steps',
      'Service or operational research where context matters',
      'Understanding what users do rather than what they report',
    ],
    weakFor: [
      'Remote or distributed user groups where observation is not practical',
      'Quick-turnaround timelines',
    ],
    typicalOutputs: [
      'Workflow documentation and journey maps',
      'Pain point and opportunity summaries',
      'Observation field notes and artefacts',
    ],
    cautionNotes: [
      'Observation can change behaviour — the Hawthorne effect is real.',
      'Requires access to work environments or realistic simulation.',
    ],
    planningConsiderations: [
      'Combine observation with a short debrief interview.',
      'Ask participants to narrate what they are doing and why.',
    ],
    commonMisuse:
      'Using a 30-minute interview as a substitute for genuine workflow observation.',
  },
  {
    id: 'diary_study',
    name: 'Diary study',
    category: 'Exploratory',
    description:
      'Participants record their experiences, behaviours, or contexts over time, capturing longitudinal data that single sessions miss.',
    goodFor: [
      'Understanding patterns over time',
      'Capturing episodic or infrequent behaviours',
      'Longitudinal experience or service journeys',
    ],
    weakFor: [
      'Short timelines',
      'Situations requiring immediate insight',
    ],
    typicalOutputs: ['Longitudinal behaviour patterns', 'Rich experience narratives'],
    cautionNotes: [
      'Dropout rates can be high — plan for attrition.',
      'Requires motivated participants and clear prompting.',
    ],
    planningConsiderations: [
      'Keep prompts brief and specific.',
      'Plan for follow-up interviews to interpret diary entries.',
    ],
    commonMisuse: 'Using diary studies when a timeline of 1–2 weeks makes longitudinal insight impossible.',
  },
  {
    id: 'existing_evidence_review',
    name: 'Existing evidence review',
    category: 'Exploratory',
    description:
      'Systematic review of available data sources — support tickets, analytics, previous research, sales calls — to identify known patterns before generating new data.',
    goodFor: [
      'Fast insight when time is short',
      'Identifying what is already known before starting new research',
      'Reducing duplication of prior work',
      'Generating focused hypotheses for subsequent research',
    ],
    weakFor: [
      'Answering genuinely novel questions with no prior data',
      'Validating assumptions — existing data may reflect existing biases',
    ],
    typicalOutputs: [
      'Evidence synthesis summary',
      'Known gaps and open questions',
      'Focused research hypotheses',
    ],
    cautionNotes: [
      'Existing evidence reflects what was asked before — it may not cover your current question.',
    ],
    planningConsiderations: [
      'Define the scope of sources to review before starting.',
      'Document what you reviewed and what was absent.',
    ],
    commonMisuse: 'Treating a review of existing data as a substitute for primary research when the question is genuinely new.',
  },
  {
    id: 'concept_testing_interviews',
    name: 'Concept testing interviews',
    category: 'Generative',
    description:
      'Structured interviews where participants react to early-stage concepts, ideas, or prototypes to explore desirability, trust, mental models, and likely adoption.',
    goodFor: [
      'Understanding reactions to new ideas before significant investment',
      'Exploring trust, risk perception, and confidence in AI or novel features',
      'Testing whether a concept resonates with the right people for the right reasons',
    ],
    weakFor: [
      'Predicting actual usage or adoption behaviour',
      'Testing detailed usability of interactions',
    ],
    typicalOutputs: [
      'Concept reception themes',
      'Trust and risk perception patterns',
      'Design implications and open questions',
    ],
    cautionNotes: [
      'Reported intent to use is not the same as actual usage — novelty bias and social desirability are common.',
      'Concept testing explores reaction, not validation.',
    ],
    planningConsiderations: [
      'Use realistic scenarios, not abstract descriptions.',
      'Probe reasons behind reactions, not just positive/negative ratings.',
    ],
    commonMisuse: 'Using "people said they liked it" as proof of demand or readiness for development investment.',
  },
  {
    id: 'co_design_workshop',
    name: 'Co-design workshop',
    category: 'Generative',
    description:
      'Facilitated sessions where users, designers, or stakeholders collaboratively generate ideas, explore design directions, or map service experiences.',
    goodFor: [
      'Generating ideas with users or stakeholders early in the process',
      'Building shared understanding of a problem space',
      'Exploring multiple design directions in parallel',
    ],
    weakFor: [
      'Validating assumptions about real user behaviour',
      'Generating statistically reliable evidence',
      'Replacing individual in-context research',
    ],
    typicalOutputs: [
      'Design concepts and sketches',
      'Shared mental models',
      'Prioritised opportunity areas',
    ],
    cautionNotes: [
      'Workshop outputs represent what participants imagine or prefer, not what they actually do.',
      'Groupthink and dominant voices can distort outputs.',
    ],
    planningConsiderations: [
      'Mix participants carefully — avoid stakeholder-heavy groups overriding user voices.',
      'Follow up with in-context research to validate workshop themes.',
    ],
    commonMisuse: 'Treating co-design outputs as user evidence or validation.',
  },
  {
    id: 'journey_mapping_workshop',
    name: 'Journey mapping workshop',
    category: 'Generative',
    description:
      'Facilitated sessions to map out user or service journeys, often drawing on existing research or participant input.',
    goodFor: [
      'Creating shared team understanding of a current or future journey',
      'Identifying gaps, pain points, and opportunities across a journey',
      'Service design and cross-team alignment',
    ],
    weakFor: [
      'Generating primary evidence about actual user experience',
      'Substituting for research with real users',
    ],
    typicalOutputs: ['Journey maps', 'Opportunity areas', 'Service improvement recommendations'],
    cautionNotes: [
      'Internally generated journey maps reflect team assumptions, not user reality, unless grounded in real research.',
    ],
    planningConsiderations: [
      'Ground the map in real research data wherever possible.',
      'Validate key assumptions with users after the workshop.',
    ],
    commonMisuse: 'Using a workshop-generated journey map as evidence of user experience.',
  },
  {
    id: 'service_blueprinting',
    name: 'Service blueprinting',
    category: 'Generative',
    description:
      'Detailed mapping of all frontstage and backstage elements of a service, linking user actions to organisational processes and systems.',
    goodFor: [
      'Understanding complex multi-actor services',
      'Identifying organisational pain points that affect user experience',
      'Planning service redesign',
    ],
    weakFor: [
      'Quick exploratory work',
      'Small-scale digital product research',
    ],
    typicalOutputs: ['Service blueprint', 'Handoff and process documentation', 'Improvement recommendations'],
    cautionNotes: ['Blueprints can become unwieldy — scope carefully.'],
    planningConsiderations: ['Involve operational and delivery teams, not just design.'],
    commonMisuse: 'Creating a blueprint without validating the user journey layer with real users.',
  },
  {
    id: 'moderated_usability_testing',
    name: 'Moderated usability testing',
    category: 'Evaluative',
    description:
      'Researcher-facilitated sessions where participants attempt realistic tasks using a prototype or live product, while the researcher observes and probes.',
    goodFor: [
      'Identifying usability issues and task completion barriers',
      'Understanding where and why users struggle',
      'Evaluating interface clarity, navigation, and cognitive load',
      'Informing iteration before handover or release',
    ],
    weakFor: [
      'Proving market demand or business case',
      'Quantifying the prevalence of issues across a population',
      'Testing complex multi-session workflows in a single session',
    ],
    typicalOutputs: [
      'Issue log with severity ratings',
      'Task completion observations',
      'Prioritised design recommendations',
      'Session recordings and highlights',
    ],
    cautionNotes: [
      'Small samples identify likely issues but do not reliably quantify prevalence.',
      'Usability testing does not validate whether users want or need the product.',
      'Facilitation bias can affect results — use consistent prompts and avoid leading questions.',
    ],
    planningConsiderations: [
      '5–8 participants per distinct user group is a reasonable starting point for qualitative issue identification.',
      'Define tasks based on real-world goals, not feature tours.',
      'Plan debrief or analysis session immediately after testing.',
    ],
    commonMisuse: 'Using usability test completion rates as proof of product-market fit or readiness for investment.',
  },
  {
    id: 'unmoderated_usability_testing',
    name: 'Unmoderated usability testing',
    category: 'Evaluative',
    description:
      'Participants complete tasks independently using a prototype or tool, with automatic recording of actions, time on task, and errors.',
    goodFor: [
      'Rapid issue identification for simple, well-defined tasks',
      'Testing with geographically distributed users',
      'Higher-volume testing when moderation is not feasible',
    ],
    weakFor: [
      'Complex workflows or emotionally sensitive topics',
      'Situations requiring real-time probing or clarification',
      'High-risk or regulated workflows where participant safety or compliance matters',
    ],
    typicalOutputs: ['Task completion rates', 'Error logs', 'Time on task', 'Drop-off points'],
    cautionNotes: [
      'You cannot probe unexpected behaviour in real time.',
      'Participant motivation and environment are uncontrolled.',
    ],
    planningConsiderations: [
      'Write very precise task instructions — ambiguity is much harder to recover from without a moderator.',
      'Pilot the tasks before full deployment.',
    ],
    commonMisuse: 'Using unmoderated testing for complex, sensitive, or safety-relevant workflows.',
  },
  {
    id: 'accessibility_review',
    name: 'Accessibility review',
    category: 'Evaluative',
    description:
      'Systematic evaluation of a design or product against accessibility standards and with assistive technology users.',
    goodFor: [
      'Identifying barriers for users with disabilities',
      'WCAG compliance checking',
      'Inclusive design quality assurance',
    ],
    weakFor: [
      'Replacing general usability testing',
      'Understanding non-accessibility-related issues',
    ],
    typicalOutputs: ['Accessibility issue log', 'WCAG conformance summary', 'Prioritised recommendations'],
    cautionNotes: [
      'Automated tools catch some issues but miss many — manual expert review and user testing are both needed.',
    ],
    planningConsiderations: [
      'Plan for both expert review and sessions with assistive technology users.',
      'Involve accessibility specialists early, not just as a final check.',
    ],
    commonMisuse: 'Running an automated scan and calling it an accessibility review.',
  },
  {
    id: 'first_click_testing',
    name: 'First-click testing',
    category: 'Evaluative',
    description:
      'Participants indicate where they would click first for a given task, testing navigational clarity and information architecture.',
    goodFor: [
      'Testing navigation and IA decisions quickly',
      'Identifying label clarity and findability issues',
    ],
    weakFor: [
      'Deep usability or workflow evaluation',
    ],
    typicalOutputs: ['Click maps', 'Success rates', 'Time to first click'],
    cautionNotes: ['First-click success does not guarantee task completion.'],
    planningConsiderations: ['Use realistic task scenarios, not "find the button" prompts.'],
    commonMisuse: 'Using first-click data to make major navigation decisions without follow-up testing.',
  },
  {
    id: 'tree_testing',
    name: 'Tree testing',
    category: 'Evaluative',
    description:
      'Participants navigate a text-only version of a site or product structure to find items, testing IA without visual design bias.',
    goodFor: [
      'Evaluating information architecture clarity',
      'Testing category and label decisions at scale',
    ],
    weakFor: [
      'Testing interaction design or visual hierarchy',
    ],
    typicalOutputs: ['Success rates per task', 'Directness scores', 'Where people go wrong'],
    cautionNotes: ['Tree testing removes visual context — results must be interpreted alongside design evaluation.'],
    planningConsiderations: ['Run tree testing before visual design is finalised to avoid rework.'],
    commonMisuse: 'Treating tree test success rates as proof that the full navigation experience works.',
  },
  {
    id: 'survey',
    name: 'Survey',
    category: 'Quantitative',
    description:
      'Structured questionnaire distributed to a sample of users or potential users to measure attitudes, frequency, prevalence, or satisfaction at scale.',
    goodFor: [
      'Measuring prevalence of known issues or needs',
      'Gathering data across a large or distributed population',
      'Quantifying satisfaction, CSAT, or NPS-style measures',
      'Testing clear hypotheses at scale after qualitative exploration',
    ],
    weakFor: [
      'Discovering unknown problems or needs',
      'Understanding why users behave the way they do',
      'Exploring novel concepts without existing frame of reference',
    ],
    typicalOutputs: ['Quantitative data summaries', 'Prevalence estimates', 'Segmentation data'],
    cautionNotes: [
      'Surveys measure what people report, not necessarily what they do.',
      'Without prior qualitative work, survey questions often measure the wrong things.',
      'Response bias, acquiescence bias, and low response rates can distort results.',
    ],
    planningConsiderations: [
      'Only design survey questions after qualitative exploration has produced clear hypotheses.',
      'Pilot the survey before full distribution.',
      'Plan sample size based on the precision needed for the decision.',
    ],
    commonMisuse: 'Running a survey before the problem space is understood, resulting in questions that measure the wrong things.',
  },
  {
    id: 'analytics_review',
    name: 'Analytics review',
    category: 'Quantitative',
    description:
      'Analysis of product usage data, funnel metrics, and behavioural telemetry to understand what users do at scale.',
    goodFor: [
      'Identifying where users drop off, struggle, or succeed',
      'Quantifying the scale of known problems',
      'Generating hypotheses for qualitative investigation',
      'Monitoring change impact after release',
    ],
    weakFor: [
      'Explaining why users behave the way they do',
      'Identifying problems that do not show up in measurable actions',
    ],
    typicalOutputs: ['Funnel analysis', 'Drop-off points', 'Feature usage data', 'Error rates'],
    cautionNotes: [
      'Analytics shows what happened, not why.',
      'What is not tracked is invisible — check for gaps in instrumentation.',
    ],
    planningConsiderations: [
      'Define the specific metrics and questions before pulling data.',
      'Pair analytics with qualitative methods to understand the why behind the what.',
    ],
    commonMisuse: 'Using analytics alone to make design decisions without understanding user intent or context.',
  },
  {
    id: 'benchmarking_study',
    name: 'Benchmarking study',
    category: 'Quantitative',
    description:
      'Structured measurement of usability or experience metrics against baseline or competitive benchmarks.',
    goodFor: [
      'Tracking experience quality over time',
      'Competitive comparison',
      'Demonstrating improvement after redesign',
    ],
    weakFor: [
      'Early discovery or exploratory work',
      'Understanding why metrics are at their current level',
    ],
    typicalOutputs: ['SUS scores', 'Task time/completion benchmarks', 'Comparative analysis'],
    cautionNotes: ['Benchmarks require controlled conditions to be comparable over time.'],
    planningConsiderations: ['Establish baseline before making changes if the goal is to demonstrate improvement.'],
    commonMisuse: 'Running a benchmarking study without a baseline to compare against.',
  },
  {
    id: 'ab_test',
    name: 'A/B test',
    category: 'Quantitative',
    description:
      'Controlled experiment comparing two or more design variants on a live product using behavioural outcome metrics.',
    goodFor: [
      'Testing specific design or copy changes on live products at scale',
      'Measuring behavioural outcomes rather than attitudes',
      'Making data-driven decisions on optimisation choices',
    ],
    weakFor: [
      'Understanding why one variant performs better',
      'Testing radically different experiences',
      'Early-stage exploration',
    ],
    typicalOutputs: ['Statistical significance results', 'Conversion/completion rate differences', 'Confidence intervals'],
    cautionNotes: [
      'A/B tests require sufficient traffic to reach statistical power — check before starting.',
      'They measure what happened, not whether the right question was asked.',
    ],
    planningConsiderations: [
      'Calculate required sample size before launching.',
      'Define success metrics in advance — do not go fishing after results are in.',
    ],
    commonMisuse: 'Running underpowered tests with too little traffic and drawing conclusions from noise.',
  },
  {
    id: 'stakeholder_interviews',
    name: 'Stakeholder interviews',
    category: 'Strategic alignment',
    description:
      'Structured or semi-structured interviews with internal stakeholders to understand organisational context, constraints, assumptions, and priorities.',
    goodFor: [
      'Understanding the business or organisational context for a decision',
      'Surfacing stakeholder assumptions and expectations',
      'Aligning on research objectives before starting',
      'Identifying constraints and dependencies',
    ],
    weakFor: [
      'Understanding user needs or behaviours',
      'Replacing user research',
    ],
    typicalOutputs: [
      'Stakeholder assumption map',
      'Organisational context summary',
      'Research brief alignment',
    ],
    cautionNotes: [
      'Stakeholder opinions are not user evidence.',
      'Aligning stakeholders is not the same as validating with users.',
    ],
    planningConsiderations: [
      'Use stakeholder interviews to frame research, not to replace it.',
      'Document assumptions explicitly so they can be tested.',
    ],
    commonMisuse: 'Treating stakeholder agreement as proof that something will work for users.',
  },
  {
    id: 'assumption_mapping',
    name: 'Assumption mapping workshop',
    category: 'Strategic alignment',
    description:
      'Facilitated team exercise to identify, surface, and prioritise assumptions underlying a product or service decision.',
    goodFor: [
      'Making team assumptions explicit before research',
      'Identifying the riskiest assumptions to test first',
      'Focusing limited research resource on high-value questions',
    ],
    weakFor: [
      'Generating user evidence',
      'Replacing user research',
    ],
    typicalOutputs: ['Assumption map', 'Prioritised research questions', 'Risk-weighted assumption list'],
    cautionNotes: ['Assumption mapping is a preparation tool, not a research method.'],
    planningConsiderations: [
      'Use the output to scope and prioritise subsequent user research.',
    ],
    commonMisuse: 'Substituting assumption mapping for user research.',
  },
  {
    id: 'research_framing_workshop',
    name: 'Research framing workshop',
    category: 'Strategic alignment',
    description:
      'Structured session to align the team on research objectives, questions, and success criteria before research begins.',
    goodFor: [
      'Ensuring research objectives are clear and agreed',
      'Preventing scope creep and misaligned expectations',
      'Aligning cross-functional teams before a research sprint',
    ],
    weakFor: [
      'Generating user evidence',
    ],
    typicalOutputs: ['Research brief', 'Agreed objectives and questions', 'Stakeholder expectations map'],
    cautionNotes: ['A well-framed brief does not replace rigorous execution.'],
    planningConsiderations: ['Run this before recruitment or fieldwork begins.'],
    commonMisuse: 'Spending more time framing than doing.',
  },
  {
    id: 'formative_usability_evaluation',
    name: 'Formative usability evaluation',
    category: 'Regulated / high-risk',
    description:
      'Structured usability evaluation designed to identify use-related risks and design issues in regulated, clinical, or high-stakes products. Follows or is informed by IEC 62366 or similar frameworks.',
    goodFor: [
      'Identifying use-related risks in regulated or safety-critical workflows',
      'Linking design evidence to hazard analysis',
      'Generating evidence for regulatory submissions',
    ],
    weakFor: [
      'Early exploratory work',
      'Low-risk consumer products',
    ],
    typicalOutputs: [
      'Use-related risk log',
      'Critical task findings',
      'Usability engineering file evidence',
    ],
    cautionNotes: [
      'Formative evaluation informs design iteration — it does not constitute summative validation.',
      'Participant group must be justified by use characteristics, not simply job title.',
      'Evidence must be documented with traceability to risk controls.',
    ],
    planningConsiderations: [
      'Define critical tasks and associated use-related risks before recruitment.',
      'Use a trained usability engineer or researcher experienced in regulatory contexts.',
      'Document all findings with reference to the hazard/risk framework.',
    ],
    commonMisuse: 'Treating any usability testing as formative evaluation without the structured risk-linked task analysis.',
  },
  {
    id: 'critical_task_analysis',
    name: 'Critical task analysis',
    category: 'Regulated / high-risk',
    description:
      'Structured analysis to identify which user tasks, if failed, could result in harm, error, or serious consequence — and to plan research accordingly.',
    goodFor: [
      'Scoping safety-critical usability research',
      'Linking research to risk-management frameworks',
      'Regulated product development',
    ],
    weakFor: [
      'Non-safety-critical or low-risk products',
    ],
    typicalOutputs: ['Critical task list', 'Risk-linked task matrix', 'Research scope definition'],
    cautionNotes: ['Critical task analysis requires input from risk management and domain experts, not just UX.'],
    planningConsiderations: [
      'Involve clinical, safety, or domain experts in the analysis.',
      'Link outputs to the usability engineering file or equivalent.',
    ],
    commonMisuse: 'Running a task analysis without connecting it to the formal risk-management process.',
  },
  {
    id: 'summative_validation_planning',
    name: 'Summative validation planning',
    category: 'Regulated / high-risk',
    description:
      'Planning and execution of a summative usability study intended to demonstrate that a product can be used safely and effectively by the intended user population.',
    goodFor: [
      'Regulatory submission evidence for safety-critical or medical products',
      'Demonstrating that a design has addressed critical use-related risks',
    ],
    weakFor: [
      'Early-stage products still undergoing design iteration',
      'Situations where design is not yet stable',
    ],
    typicalOutputs: ['Summative evaluation report', 'Protocol documentation', 'Regulatory evidence package'],
    cautionNotes: [
      'Summative validation should only occur when the design is stable and formative evaluation has been completed.',
      'Do not claim regulatory compliance without documented rationale and expert review.',
      'Participant groups must match the intended use population.',
    ],
    planningConsiderations: [
      'Work with a regulatory specialist or notified body early.',
      'Ensure the protocol is agreed before testing begins.',
    ],
    commonMisuse: 'Attempting summative validation before completing formative evaluation and design iteration.',
  },
];

export const getMethodById = (id: string): ResearchMethod | undefined =>
  METHODS.find((m) => m.id === id);

export const getMethodsByCategory = (category: string): ResearchMethod[] =>
  METHODS.filter((m) => m.category === category);

export const METHOD_CATEGORIES = [
  'Exploratory',
  'Generative',
  'Evaluative',
  'Quantitative',
  'Strategic alignment',
  'Regulated / high-risk',
] as const;
