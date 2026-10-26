import type { StarterResearchPlan, ResearchMethod } from '../types/research';

export interface GuideSection {
  heading: string;
  durationHint: string;
  questions: string[];
  facilNotes?: string;
}

export interface DiscussionGuide {
  title: string;
  intro: string;
  sections: GuideSection[];
  closing: string;
  totalDurationHint: string;
}

export function generateDiscussionGuide(plan: StarterResearchPlan, method: ResearchMethod): DiscussionGuide {
  const rqs = plan.researchQuestions.filter(Boolean);

  // Distribute research questions across middle sections
  const chunkRqs = (chunks: number): string[][] => {
    if (chunks <= 1 || rqs.length === 0) return [rqs];
    const size = Math.ceil(rqs.length / chunks);
    return Array.from({ length: chunks }, (_, i) => rqs.slice(i * size, (i + 1) * size)).filter(c => c.length > 0);
  };

  // Build method-specific probes from the session outline
  const probesFromOutline = plan.sessionOutline
    .filter(Boolean)
    .slice(1, -1) // drop first (intro) and last (wrap-up) items
    .map(step => `Take me through ${step.toLowerCase()}.`);

  const sections: GuideSection[] = [];

  // ── Opening / warm-up ──
  sections.push({
    heading: 'Welcome and warm-up',
    durationHint: '~5 min',
    facilNotes: 'Confirm recording consent and start recording before the first question. Recording is essential — you cannot facilitate well and capture accurately at the same time. If a participant declines recording, have a dedicated note-taker present or reschedule rather than relying on memory alone. Introduce the session purpose at a high level without leading detail.',
    questions: [
      `To start, could you tell me a little about your role and what you do day to day?`,
      `How long have you been in that role?`,
      `Roughly how much of your work involves [the product / process being studied]?`,
    ],
  });

  // ── Context setting ──
  sections.push({
    heading: 'Context and background',
    durationHint: '~10 min',
    facilNotes: 'Let participants describe their context in their own words before introducing any specifics.',
    questions: [
      `Before we get into specifics, can you describe how you currently approach [the area this research covers]?`,
      `What works well for you at the moment? What's more difficult?`,
      `When something doesn't go as expected, what happens?`,
    ],
  });

  // ── Core research question sections ──
  const rqChunks = chunkRqs(Math.min(3, Math.ceil(rqs.length / 2)));
  rqChunks.forEach((chunk, i) => {
    const sectionNumber = i + 1;
    const topicLabel = chunk.length === 1
      ? `"${chunk[0].replace(/\?$/, '').toLowerCase()}"`
      : `topic area ${sectionNumber}`;
    sections.push({
      heading: `Exploration ${sectionNumber} — ${chunk.length === 1 ? chunk[0].replace(/\?$/, '') : `Core questions (part ${sectionNumber})`}`,
      durationHint: '~10–15 min',
      facilNotes: `These questions address your research objective around ${topicLabel}. Follow up with probes from the list below whenever a participant gives a brief or surface-level answer.`,
      questions: [
        ...chunk.map(rq => {
          // Convert to open, natural interview prompts where possible
          const stripped = rq.replace(/\?$/, '').trim();
          if (/^(how|what|when|where|who|why|which)/i.test(stripped)) return rq;
          return `Tell me about ${stripped.charAt(0).toLowerCase()}${stripped.slice(1)}.`;
        }),
        ...(probesFromOutline.length > 0 && i === 0 ? probesFromOutline.slice(0, 2) : []),
      ],
    });
  });

  // ── Follow-up probe bank ──
  sections.push({
    heading: 'Follow-up probes (use any time)',
    durationHint: 'as needed',
    facilNotes: 'These are not questions to ask in order — they are tools to reach for when a participant gives a brief, surface-level, or unclear answer. Pick whichever fits the moment.',
    questions: [
      'Can you say a bit more about that?',
      'What did you mean when you said [X]?',
      'Can you walk me through what happened next?',
      'Why is that important to you?',
      'What would that look like in practice?',
      'How often does that happen?',
      'Was that typical, or was it more unusual?',
      'How did that make you feel?',
      'What would have made that easier?',
      'What were you expecting to happen?',
      'Is there anything else you would want me to know about that?',
    ],
  });

  // ── Task or stimulus section (if there's something to show/test) ──
  if (
    method.id !== 'semi_structured_interviews' &&
    method.id !== 'stakeholder_interviews' &&
    method.id !== 'contextual_inquiry' &&
    plan.materialsNeeded.some(m => /prototype|wireframe|design|sketch|screen|demo/i.test(m))
  ) {
    sections.push({
      heading: 'Task or stimulus walkthrough',
      durationHint: '~15–20 min',
      facilNotes: 'Present the prototype or stimulus at this point. Ask participants to think aloud as they work through it. Avoid jumping in to help — note what they say and where they hesitate.',
      questions: [
        'Before I show you anything, what would you expect to see here?',
        "Take your time and share what you're noticing as you look through this.",
        "Is there anything that wasn't what you expected?",
        'If this were your normal working environment, what would you do next?',
        'What, if anything, would you change about what you just saw?',
      ],
    });
  }

  // ── Wrap-up ──
  sections.push({
    heading: 'Closing',
    durationHint: '~5 min',
    facilNotes: 'Leave enough time for this — participants often share the most useful insights when they think the session is ending. After the session: stop the recording, save it immediately, and add it to the Condens project while your memory of the session is fresh. Write up your immediate observations (what surprised you, key quotes, anything that stood out) before your next session — do not wait until all sessions are complete.',
    questions: [
      "Is there anything important we haven't covered that you think we should know?",
      'If you could change one thing about [the product / process we discussed] today, what would it be?',
      'Are there other people whose perspective it might be worth getting on this?',
    ],
  });

  const sectionCount = sections.length;
  const totalMins = 5 + 10 + rqChunks.length * 12 + (sectionCount > 4 ? 20 : 0) + 5;

  return {
    title: `Discussion guide — ${plan.title}`,
    intro: `Welcome and thank you for taking the time to speak with us today. I'm [researcher name] from the ApprovalMax research team.\n\nThe purpose of this session is to help us better understand [topic area] — we're not testing you or your skills, and there are no right or wrong answers. We want to hear your honest thoughts and experiences.\n\nThis session will last approximately ${totalMins} minutes. With your permission, I'd like to record the session so we can refer back to it later — the recording will only be used internally by the research team. You can stop at any time.\n\nDo you have any questions before we start?`,
    sections,
    closing: `Thank you so much for your time today — your input is genuinely valuable and will directly inform our decisions. If anything comes to mind after the session that you'd like to share, feel free to reach out to the research team at [researcher email].\n\nWe'll be in touch about [next steps / findings / incentive if applicable].`,
    totalDurationHint: `~${totalMins} minutes`,
  };
}

export function guideToText(guide: DiscussionGuide): string {
  const lines: string[] = [];
  lines.push(guide.title.toUpperCase());
  lines.push('');
  lines.push(`Estimated duration: ${guide.totalDurationHint}`);
  lines.push('');
  lines.push('INTRODUCTION');
  lines.push('');
  lines.push(guide.intro);
  lines.push('');
  lines.push('---');
  guide.sections.forEach((s) => {
    lines.push('');
    lines.push(`${s.heading.toUpperCase()} (${s.durationHint})`);
    if (s.facilNotes) lines.push(`[Facilitator note: ${s.facilNotes}]`);
    lines.push('');
    const isProbeBank = s.heading.toLowerCase().includes('probe');
    s.questions.forEach((q, i) => lines.push(isProbeBank ? `- ${q}` : `${i + 1}. ${q}`));
    lines.push('');
    lines.push('---');
  });
  lines.push('');
  lines.push('CLOSING');
  lines.push('');
  lines.push(guide.closing);
  return lines.join('\n');
}
