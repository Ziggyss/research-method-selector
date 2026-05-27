import { Check } from 'lucide-react';

interface CardOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SingleSelectCardsProps<T extends string> {
  options: CardOption<T>[];
  selected: T | '';
  onChange: (value: T) => void;
}

export function SingleSelectCards<T extends string>({
  options,
  selected,
  onChange,
}: SingleSelectCardsProps<T>) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`text-left p-4 rounded-xl border transition-all ${
              isSelected
                ? 'border-charcoal bg-warm-50 shadow-sm ring-1 ring-charcoal'
                : 'border-warm-200 bg-white hover:border-warm-400 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={`text-sm font-medium ${isSelected ? 'text-charcoal' : 'text-charcoal'}`}>
                  {opt.label}
                </p>
                {opt.description && (
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">{opt.description}</p>
                )}
              </div>
              {isSelected && (
                <div className="w-5 h-5 bg-charcoal rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
