import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// ─── Replace these with your EmailJS credentials ───────────────────────────
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
// ───────────────────────────────────────────────────────────────────────────

type YesNo = 'yes' | 'no' | null;

interface ConsentChoices {
  audio: YesNo;
  video: YesNo;
  noteTaker: YesNo;
  observer: YesNo;
  notesShared: YesNo;
  wordsQuoted: YesNo;
  recordingsShared: YesNo;
  understands: YesNo;
  agreesToParticipate: YesNo;
  recontact: YesNo;
}

function LogoMark() {
  return (
    <svg width="32" height="31" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
    </svg>
  );
}

function YesNoField({ label, value, onChange, required }: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  required?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-warm-100 last:border-0">
      <p className="text-sm text-charcoal leading-relaxed flex-1">{label}</p>
      <div className="flex gap-4 flex-shrink-0">
        {(['yes', 'no'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={label}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="accent-brand-purple w-4 h-4"
            />
            <span className="text-sm text-charcoal capitalize">{opt}</span>
          </label>
        ))}
        {required && value === null && (
          <span className="text-xs text-red-500 self-center">Required</span>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-charcoal mt-8 mb-3 pb-2 border-b-2 border-warm-200">
      {children}
    </h2>
  );
}

function InfoBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-charcoal mb-1">{heading}</h3>
      <div className="text-sm text-charcoal-muted leading-relaxed">{children}</div>
    </div>
  );
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function ConsentPage() {
  const params = new URLSearchParams(window.location.search);
  const studyName = params.get('study') || '';
  const sessionType = params.get('method') || 'research session';
  const duration = params.get('duration') || '';
  const aims = params.get('aims') || '';
  const researcherName = params.get('researcher') || '';
  const researcherEmail = params.get('email') || '';

  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [choices, setChoices] = useState<ConsentChoices>({
    audio: null,
    video: null,
    noteTaker: null,
    observer: null,
    notesShared: null,
    wordsQuoted: null,
    recordingsShared: null,
    understands: null,
    agreesToParticipate: null,
    recontact: null,
  });
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof ConsentChoices) => (v: YesNo) =>
    setChoices(prev => ({ ...prev, [key]: v }));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!participantName.trim()) newErrors.name = 'Please enter your full name.';
    if (!participantEmail.trim() || !participantEmail.includes('@'))
      newErrors.email = 'Please enter a valid email address.';
    // Required consent items
    if (choices.understands !== 'yes') newErrors.understands = 'You must confirm you understand what is being asked.';
    if (choices.agreesToParticipate !== 'yes') newErrors.agree = 'You must agree to take part to submit this form.';
    // All yes/no items must have an answer
    const unanswered = [
      choices.audio, choices.video, choices.noteTaker, choices.observer,
      choices.notesShared, choices.wordsQuoted, choices.recordingsShared,
    ].some(v => v === null);
    if (unanswered) newErrors.choices = 'Please answer all questions in the consent form.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSubmitState('submitting');

    const formatChoice = (v: YesNo) => v === 'yes' ? '✓ Yes' : '✗ No';
    const summary = [
      `Study: ${studyName || 'Not specified'}`,
      `Participant: ${participantName} (${participantEmail})`,
      `Submitted: ${new Date().toLocaleString('en-GB')}`,
      '',
      'DATA COLLECTION',
      `Audio recording: ${formatChoice(choices.audio)}`,
      `Video recording: ${formatChoice(choices.video)}`,
      `Note taker present: ${formatChoice(choices.noteTaker)}`,
      `Observer present: ${formatChoice(choices.observer)}`,
      '',
      'DATA HANDLING',
      `Notes analysed and shared with team: ${formatChoice(choices.notesShared)}`,
      `Words quoted in reports/presentations: ${formatChoice(choices.wordsQuoted)}`,
      '',
      'DATA SHARING',
      `Recordings shared with relevant team: ${formatChoice(choices.recordingsShared)}`,
      '',
      'TAKING PART',
      `Understands what is being asked: ${formatChoice(choices.understands)}`,
      `Agrees to take part: ${formatChoice(choices.agreesToParticipate)}`,
      `Consents to recontact for future research: ${formatChoice(choices.recontact)}`,
    ].join('\n');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          study_name: studyName || 'Not specified',
          participant_name: participantName,
          participant_email: participantEmail,
          consent_summary: summary,
          submitted_at: new Date().toLocaleString('en-GB'),
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitState('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitState('error');
    }
  };

  if (submitState === 'success') {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-charcoal mb-2">
            Thank you, {participantName.split(' ')[0]}
          </h1>
          <p className="text-charcoal-muted leading-relaxed mb-6">
            Your consent has been recorded. The research team will be in touch with session details.
          </p>
          {researcherEmail && (
            <p className="text-sm text-charcoal-muted">
              Questions? Contact <a href={`mailto:${researcherEmail}`} className="underline">{researcherEmail}</a>
            </p>
          )}
          <p className="text-xs text-warm-400 mt-4">You can close this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <header className="bg-white border-b border-warm-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <LogoMark />
          <div className="flex flex-col leading-none">
            <span className="font-semibold text-charcoal text-sm">OneAdvanced</span>
            <span className="text-[10px] text-charcoal-muted">Research &amp; UX</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal mb-1">Participant consent form</h1>
        {studyName && <p className="text-charcoal-muted mb-1">Study: <span className="font-medium text-charcoal">{studyName}</span></p>}
        <p className="text-sm text-charcoal-muted mb-6">
          Read the information below, then fill in and submit the consent form at the end.
        </p>

        {/* Errors summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">Please correct the errors below before submitting.</p>
          </div>
        )}

        {/* ── Your details ── */}
        <div className="card mb-1">
          <SectionHeading>Your details</SectionHeading>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Your name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your full name"
                value={participantName}
                onChange={e => { setParticipantName(e.target.value); setErrors(v => ({ ...v, name: '' })); }}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Your email address *</label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={participantEmail}
                onChange={e => { setParticipantEmail(e.target.value); setErrors(v => ({ ...v, email: '' })); }}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* ── Invitation ── */}
        <div className="card mb-1">
          <SectionHeading>Invitation to take part in research</SectionHeading>
          <p className="text-sm text-charcoal-muted leading-relaxed mb-4">
            Advanced does regular research to improve our products and services and to ensure we're meeting user needs and providing a good user experience.
          </p>
          <p className="text-sm text-charcoal mb-2">We invite you to take part in:</p>
          <ul className="list-disc list-inside text-sm text-charcoal space-y-1 mb-4 ml-1">
            <li className="font-medium">{sessionType}</li>
            {duration && <li>that will last around <span className="font-medium">{duration} minutes</span></li>}
            <li>It's your choice if you take part in research. If you do not want to take part, do not submit this form.</li>
          </ul>
          {researcherEmail && (
            <p className="text-sm text-charcoal-muted mb-3">
              You can contact us to discuss the project before agreeing to take part:{' '}
              <a href={`mailto:${researcherEmail}`} className="text-charcoal underline underline-offset-2">{researcherEmail}</a>
            </p>
          )}
          <p className="text-sm text-charcoal-muted mb-1">
            If you believe that your personal data has been misused or mishandled, you can contact the Data Protection Officer (DPO):{' '}
            <a href="mailto:dataprotectionoffice@oneadvanced.com" className="text-charcoal underline underline-offset-2">dataprotectionoffice@oneadvanced.com</a>
          </p>
          <p className="text-sm text-charcoal-muted">
            Our privacy policy is available at:{' '}
            <a href="https://www.oneadvanced.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-charcoal underline underline-offset-2">www.oneadvanced.com/privacy-policy</a>
          </p>
        </div>

        {/* ── About the session ── */}
        <div className="card mb-1">
          <SectionHeading>About the session</SectionHeading>
          {aims && (
            <InfoBlock heading="This research project aims to">
              <p>{aims}</p>
            </InfoBlock>
          )}
          <p className="text-sm text-charcoal font-medium mb-2">You should take away from this document that:</p>
          <ul className="list-disc list-inside text-sm text-charcoal-muted space-y-1 mb-4 ml-1">
            <li>it's your choice if you take part and you can withdraw at any time</li>
            <li>you can choose how your data is recorded and shared</li>
          </ul>
          <InfoBlock heading="Do I have to take part?">
            <p>No. It's your choice if you decide to take part. If you do not wish to take part, you do not need to provide a reason.</p>
          </InfoBlock>
          <InfoBlock heading="What will I be asked to do if I take part?">
            <p>
              You will be invited to take part in a {sessionType}{duration ? ` lasting around ${duration} minutes` : ''}.{' '}
              {researcherName && <>The session will be led by {researcherName}.</>}
            </p>
            <p className="mt-2">If at any point you want to stop the session or no longer want to take part, you can do so without giving a reason. Just ask us to stop, and we'll end your participation. Any data collected will be destroyed.</p>
          </InfoBlock>
        </div>

        {/* ── Data storage ── */}
        <div className="card mb-1">
          <SectionHeading>How we store and use your data</SectionHeading>
          <InfoBlock heading="Who is my data controller?">
            <p>By ticking the boxes below, you consent to Advanced processing your personal data for the purposes of carrying out research to improve our products and services, to ensure we are meeting users' needs and providing a good user experience.</p>
          </InfoBlock>
          <InfoBlock heading="How will my data be collected?">
            <p>The data that we collect will depend on what you consent to by ticking the boxes below. If you consent, we may collect audio or video recordings from the research session, and we may take notes. You have the right to choose not to be recorded.</p>
          </InfoBlock>
          <InfoBlock heading="How will my data be stored and who will have access to it?">
            <p>Your data will be stored for a period of 2 years but we normally delete data much sooner than this. We will store your data within software called Condens on secure EU servers. The data has strict access controls — only a small number of researchers can access the data and we ensure it is password protected to keep it secure.</p>
          </InfoBlock>
          <InfoBlock heading="How will my data be shared?">
            <p>We may pass your personal data on to other member firms of the Advanced group, third-party service providers contracted to Advanced (such as Condens), auditors and professional advisers, and law enforcement or regulatory agencies as required by law.</p>
          </InfoBlock>
          <InfoBlock heading="How can I request a copy of my data or ask for it to be deleted?">
            <p>
              {researcherEmail
                ? <>Contact <a href={`mailto:${researcherEmail}`} className="underline">{researcherEmail}</a>. </>
                : 'Contact the research team. '}
              Please note that we anonymise your data, which means we may no longer be able to identify which data belongs to you. If you feel your data is being mishandled, contact the Data Protection Office: <a href="mailto:dataprotectionoffice@oneadvanced.com" className="underline">dataprotectionoffice@oneadvanced.com</a>
            </p>
          </InfoBlock>
        </div>

        {/* ── Confidentiality ── */}
        <div className="card mb-1">
          <SectionHeading>Confidentiality</SectionHeading>
          <InfoBlock heading="Will my participation be kept confidential?">
            <p>We will write our reports in a way that no-one should be able to work out that you took part in the research. If you consent to audio and/or video recordings of the research, you may be recognisable.</p>
            <p className="mt-2">We take various steps to help protect your privacy. We may check in with you after the session to see if you're still happy with what you said. You can also ask to see a copy of our notes and you can withdraw any or all of what you've said at any point.</p>
          </InfoBlock>
          {researcherName && (
            <p className="text-sm text-charcoal-muted">
              For further information, contact: <span className="text-charcoal font-medium">{researcherName}</span>
              {researcherEmail && <> — <a href={`mailto:${researcherEmail}`} className="underline">{researcherEmail}</a></>}
            </p>
          )}
        </div>

        {/* ── Consent form ── */}
        <div className="card mb-6">
          <SectionHeading>Consent form</SectionHeading>
          <p className="text-sm text-charcoal-muted mb-5">
            Read the statements below. For each one, select Yes or No.
            {researcherEmail && <> If you have any questions, contact <a href={`mailto:${researcherEmail}`} className="underline">{researcherEmail}</a>.</>}
          </p>

          {errors.choices && (
            <p className="text-red-600 text-xs mb-4 flex items-center gap-1.5">
              <AlertCircle size={13} /> {errors.choices}
            </p>
          )}

          {/* Data collection */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">2. Data collection</p>
            <YesNoField label="I agree to be audio-recorded in the session." value={choices.audio} onChange={set('audio')} />
            <YesNoField label="I agree to be video-recorded in the session." value={choices.video} onChange={set('video')} />
            <YesNoField label="I agree for a note taker to be present in the session and for them to take notes." value={choices.noteTaker} onChange={set('noteTaker')} />
            <YesNoField label="I agree for an observer to be present in the session and for them to take notes." value={choices.observer} onChange={set('observer')} />
          </div>

          {/* Data handling */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">3. Data handling</p>
            <YesNoField label="I consent to notes from the session being analysed by and shared with the team." value={choices.notesShared} onChange={set('notesShared')} />
            <YesNoField label='I consent to my words being quoted in show and tells, presentations and reports (e.g. "one person said I find the service easy to use").' value={choices.wordsQuoted} onChange={set('wordsQuoted')} />
          </div>

          {/* Data sharing */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">4. Data sharing *</p>
            <YesNoField label="I consent to any recordings (video and/or audio) being shared with the relevant team." value={choices.recordingsShared} onChange={set('recordingsShared')} />
          </div>

          {/* Taking part */}
          <div>
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">5. Taking part *</p>
            <YesNoField label="I understand what is being asked of me in this research project." value={choices.understands} onChange={set('understands')} required />
            <YesNoField label="I agree to take part in this research project." value={choices.agreesToParticipate} onChange={set('agreesToParticipate')} required />
            <YesNoField label="I consent to being recontacted by this team or other teams in OneAdvanced for future research." value={choices.recontact} onChange={set('recontact')} />
          </div>

          {(errors.understands || errors.agree) && (
            <p className="text-red-600 text-xs mt-3 flex items-center gap-1.5">
              <AlertCircle size={13} /> {errors.understands || errors.agree}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitState === 'submitting'}
          className="btn-primary w-full py-3 text-base disabled:opacity-50"
        >
          {submitState === 'submitting' ? 'Submitting…' : 'Submit consent form'}
        </button>

        {submitState === 'error' && (
          <div className="mt-4 flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">Something went wrong — please try again or contact the research team directly.</p>
          </div>
        )}

        <p className="text-xs text-warm-400 text-center mt-6 leading-relaxed">
          OneAdvanced Ltd · <a href="https://www.oneadvanced.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline">Privacy policy</a> · <a href="mailto:dataprotectionoffice@oneadvanced.com" className="underline">Data Protection Office</a>
        </p>
      </main>
    </div>
  );
}
