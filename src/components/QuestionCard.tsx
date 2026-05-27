import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  helperText?: string;
  whyItMatters?: string;
  children: React.ReactNode;
  error?: string;
}

export function QuestionCard({
  question,
  helperText,
  whyItMatters,
  children,
  error,
}: QuestionCardProps) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div className="card mb-5">
      <h3 className="text-base font-semibold text-charcoal mb-1">{question}</h3>
      {helperText && <p className="text-sm text-charcoal-muted mb-4 leading-relaxed">{helperText}</p>}
      {children}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {whyItMatters && (
        <div className="mt-4 border-t border-warm-100 pt-3">
          <button
            type="button"
            onClick={() => setShowWhy((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-charcoal transition-colors"
          >
            {showWhy ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            Why this matters
          </button>
          {showWhy && (
            <p className="mt-2 text-sm text-charcoal-muted leading-relaxed bg-warm-50 rounded-lg p-3">
              {whyItMatters}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
