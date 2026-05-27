export type BiasType = 'leading' | 'closed' | 'double_barreled' | 'assumption' | 'accusatory' | 'multiple_questions' | 'absolute' | 'hypothetical';

export interface BiasIssue {
  type: BiasType;
  severity: 'warning' | 'suggestion';
  label: string;
  explanation: string;
  tip: string;
}

export interface QuestionCheck {
  raw: string;
  issues: BiasIssue[];
}

export function checkQuestion(raw: string): QuestionCheck {
  const trimmed = raw.trim();
  const issues: BiasIssue[] = [];

  if (!trimmed || trimmed.length < 5) return { raw, issues };

  // Multiple questions in one
  const qCount = (trimmed.match(/\?/g) || []).length;
  if (qCount > 1) {
    issues.push({
      type: 'multiple_questions',
      severity: 'warning',
      label: 'Multiple questions at once',
      explanation: 'Asking more than one thing at once can confuse participants and makes answers hard to interpret.',
      tip: 'Split into separate questions — one topic per question.',
    });
  }

  // Leading or suggestive language
  const leadingPatterns = [
    /wouldn['']t you/i,
    /don['']t you (think|agree|feel|find)/i,
    /\bsurely\b/i,
    /\bobviously\b/i,
    /\bclearly\b/i,
    /\bof course\b/i,
    /as you (know|can see)/i,
    /,\s*right\?/i,
    /,\s*correct\?/i,
    /isn['']t (it|that)\b/i,
    /you['']d agree/i,
    /\blet['']s be honest\b/i,
    /\bmost people\b/i,
    /\beveryone knows\b/i,
  ];
  if (leadingPatterns.some(p => p.test(trimmed))) {
    issues.push({
      type: 'leading',
      severity: 'warning',
      label: 'Leading or suggestive language',
      explanation: "This question nudges the participant towards a particular answer, which can bias their response.",
      tip: "Use neutral language. Instead of \"Don't you find X confusing?\" try \"How would you describe your experience with X?\"",
    });
  }

  // Closed yes/no question — exclude "Can you describe/tell/walk/show" which are soft openers, not yes/no questions
  const isSoftOpener = /^can you (describe|tell|walk|show|explain|share|give)\b/i.test(trimmed);
  const closedPatterns = [
    /^do you\b/i, /^does\b/i, /^did you\b/i,
    /^is (it|this|that|there|the)\b/i,
    /^are (you|there|these|those)\b/i,
    /^have you\b/i, /^will you\b/i, /^would you\b/i,
    /^has\b/i,
  ];
  const isStrictClosed = !isSoftOpener && (
    closedPatterns.some(p => p.test(trimmed)) ||
    /^can you\b/i.test(trimmed) ||
    /^could you\b/i.test(trimmed)
  );
  if (isStrictClosed && !isSoftOpener) {
    issues.push({
      type: 'closed',
      severity: 'suggestion',
      label: 'Closed question — likely a yes/no answer',
      explanation: 'Closed questions limit depth in qualitative research by inviting short, one-word answers.',
      tip: "Open it up: \"Tell me about...\", \"How do you...\", or \"Walk me through what happens when...\"",
    });
  }

  // Future-facing hypothetical questions — most common bias in concept testing
  const hypotheticalPatterns = [
    /\bwould you (use|buy|recommend|adopt|switch|consider|try)\b/i,
    /\bwould you be (likely|willing|interested|open)\b/i,
    /\bhow (useful|valuable|helpful|likely|often) would\b/i,
    /\bdo you think you (would|could|might)\b/i,
    /\bwould this (be|work|help|change|make)\b/i,
    /\bif (this|we|it) (existed|were available|was free|launched)\b/i,
  ];
  if (hypotheticalPatterns.some(p => p.test(trimmed))) {
    issues.push({
      type: 'hypothetical',
      severity: 'warning',
      label: 'Future-facing or hypothetical question',
      explanation: "People are poor predictors of their own future behaviour. Asking \"Would you use this?\" typically produces optimistic, socially desirable answers that do not reflect what people actually do.",
      tip: "Ground the question in past or present behaviour instead: \"Tell me about the last time you...\" or \"How do you currently handle...\"",
    });
  }

  // Assumption-laden framing
  const assumptionChecks: { pattern: RegExp; note: string }[] = [
    { pattern: /why do you (like|love|enjoy|prefer)\b/i, note: 'it assumes the participant likes or enjoys the thing' },
    { pattern: /what do you (enjoy|like|love) about\b/i, note: 'it assumes a positive experience' },
    { pattern: /what (worked|works) well\b/i, note: 'it assumes something worked well, which may not be true for every participant' },
    { pattern: /what did you (find|think was) (helpful|useful|good|great)\b/i, note: 'it assumes a positive experience' },
    { pattern: /how (useful|helpful|easy|convenient) (do you find|is)\b/i, note: 'it assumes a positive quality' },
    { pattern: /why do you use\b/i, note: 'it assumes they use it' },
  ];
  const matchedAssumption = assumptionChecks.find(({ pattern }) => pattern.test(trimmed));
  if (matchedAssumption) {
    issues.push({
      type: 'assumption',
      severity: 'warning',
      label: 'Assumption-laden framing',
      explanation: `This question contains an assumption — ${matchedAssumption.note} — which may not hold for every participant.`,
      tip: "First establish whether the premise holds: \"How would you describe your experience with X?\" before probing for positives or negatives.",
    });
  }

  // Accusatory framing
  const accusatoryPatterns = [
    /why didn['']t you/i, /why don['']t you/i, /why haven['']t you/i,
    /why won['']t you/i, /why aren['']t you/i, /why weren['']t you/i,
  ];
  if (accusatoryPatterns.some(p => p.test(trimmed))) {
    issues.push({
      type: 'accusatory',
      severity: 'suggestion',
      label: 'Potentially accusatory framing',
      explanation: "\"Why didn't you...\" can feel like a challenge, making participants defensive rather than reflective.",
      tip: "Try \"What got in the way of...\" or \"What would have made it easier to...\"",
    });
  }

  // Double-barreled question (heuristic)
  const wordCount = trimmed.split(/\s+/).length;
  if (
    qCount === 1 &&
    wordCount > 10 &&
    /\band\s+(also|why|how|what|when|do|does|did|would|could|is|are)\b/i.test(trimmed)
  ) {
    issues.push({
      type: 'double_barreled',
      severity: 'warning',
      label: 'Possibly double-barreled',
      explanation: 'This may be asking about two different things at once, making it hard for participants to know which part to address.',
      tip: 'Consider splitting into two separate questions.',
    });
  }

  // Absolute language
  if (/\b(always|never|everyone|nobody|everybody|no one)\b/i.test(trimmed)) {
    issues.push({
      type: 'absolute',
      severity: 'suggestion',
      label: 'Absolute language',
      explanation: "Words like \"always\", \"never\", or \"everyone\" can make participants feel they don't fit the extreme, suppressing honest answers.",
      tip: "Replace with \"typically\", \"often\", or \"in most cases\" to allow for nuance.",
    });
  }

  return { raw, issues };
}

export function checkQuestions(text: string): QuestionCheck[] {
  return text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(checkQuestion);
}
