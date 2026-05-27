import { Check } from 'lucide-react';

interface CardOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface MultiSelectCardsProps<T extends string> {
  options: CardOption<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
  exclusive?: T;
}

export function MultiSelectCards<T extends string>({
  options,
  selected,
  onChange,
  exclusive,
}: MultiSelectCardsProps<T>) {
  const toggle = (value: T) => {
    if (exclusive && value === exclusive) {
      onChange(selected.includes(exclusive) ? [] : [exclusive]);
      return;
    }
    if (exclusive && selected.includes(exclusive)) {
      onChange([value]);
      return;
    }
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              isSelected
                ? 'border-charcoal bg-warm-50 shadow-sm ring-1 ring-charcoal'
                : 'border-warm-200 bg-white hover:border-warm-400 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-charcoal leading-snug">{opt.label}</p>
                {opt.description && (
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">{opt.description}</p>
                )}
              </div>
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  isSelected ? 'bg-charcoal border-charcoal' : 'border-warm-300 bg-white'
                }`}
              >
                {isSelected && <Check size={10} className="text-white" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
