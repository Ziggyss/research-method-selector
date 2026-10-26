import type { AppView } from '../types/research';
import { BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  view: AppView;
  onNavigate: (view: AppView) => void;
}

// Claude-style logo mark — the distinctive angled shape
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="28" rx="7" fill="#36cf8a" />
      {/* Stylised R / compass shape */}
      <path
        d="M7 20 L7 8 L16 8 C19 8 21 10 21 12.5 C21 15 19 17 16 17 L13 17 L20 20"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="10.5" cy="20.5" r="1" fill="white" />
    </svg>
  );
}

export function Layout({ children, view, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-warm-50">
      <header className="bg-white border-b border-warm-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <LogoMark size={28} />
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-charcoal text-sm tracking-tight">
                Research Method Selector
              </span>
              <span className="text-[10px] text-charcoal-muted tracking-wide font-normal">
                ApprovalMax
              </span>
            </div>
          </button>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'landing' || view === 'flow'
                  ? 'bg-brand-gradient-subtle text-brand-purple'
                  : 'text-charcoal-muted hover:bg-warm-50'
              }`}
            >
              <span className="hidden sm:inline">Method selector</span>
              <span className="sm:hidden">Selector</span>
            </button>
            <button
              onClick={() => onNavigate('library')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'library'
                  ? 'bg-brand-gradient-subtle text-brand-purple'
                  : 'text-charcoal-muted hover:bg-warm-50'
              }`}
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Method library</span>
              <span className="sm:hidden">Library</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
