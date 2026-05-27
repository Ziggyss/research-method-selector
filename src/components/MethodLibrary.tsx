import { useState } from 'react';
import { Search } from 'lucide-react';
import { METHODS, METHOD_CATEGORIES } from '../data/methods';
import type { MethodCategory, ResearchMethod } from '../types/research';

function MethodCard({ method }: { method: ResearchMethod }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card hover:border-warm-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-charcoal-muted bg-warm-100 px-2 py-0.5 rounded-full">
            {method.category}
          </span>
          <h3 className="text-base font-semibold text-charcoal mt-2 mb-1">{method.name}</h3>
          <p className="text-sm text-charcoal-muted leading-relaxed">{method.description}</p>
        </div>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-sm text-charcoal-muted hover:text-charcoal transition-colors font-medium"
      >
        {expanded ? '↑ Less detail' : '↓ More detail'}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-warm-100 grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">Best used when</p>
            <ul className="space-y-1">
              {method.goodFor.map((g, i) => (
                <li key={i} className="text-sm text-charcoal flex gap-2">
                  <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">Weak when</p>
            <ul className="space-y-1">
              {method.weakFor.map((w, i) => (
                <li key={i} className="text-sm text-charcoal flex gap-2">
                  <span className="text-amber-400 flex-shrink-0 mt-0.5">△</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">Typical outputs</p>
            <ul className="space-y-1">
              {method.typicalOutputs.map((o, i) => (
                <li key={i} className="text-sm text-charcoal-muted">— {o}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">Planning considerations</p>
            <ul className="space-y-1">
              {method.planningConsiderations.map((c, i) => (
                <li key={i} className="text-sm text-charcoal-muted">— {c}</li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-1">Common misuse</p>
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 leading-relaxed">
              {method.commonMisuse}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function MethodLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MethodCategory | 'All'>('All');

  const filtered = METHODS.filter((m) => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.goodFor.some((g) => g.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-charcoal mb-2">Method library</h1>
        <p className="text-charcoal-muted">
          Browse all available research methods, when to use them, and where they are commonly misused.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Search methods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('All')}
          className={activeCategory === 'All' ? 'chip-selected' : 'chip-unselected'}
        >
          All ({METHODS.length})
        </button>
        {METHOD_CATEGORIES.map((cat) => {
          const count = METHODS.filter((m) => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'chip-selected' : 'chip-unselected'}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-charcoal-muted">No methods match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((method) => (
            <MethodCard key={method.id} method={method} />
          ))}
        </div>
      )}
    </div>
  );
}
