
interface Option<T extends string> {
  value: T;
  label: string;
}

interface MultiSelectChipsProps<T extends string> {
  options: Option<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
  exclusive?: T; // value that clears all others when selected
}

export function MultiSelectChips<T extends string>({
  options,
  selected,
  onChange,
  exclusive,
}: MultiSelectChipsProps<T>) {
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
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle(opt.value)}
          className={selected.includes(opt.value) ? 'chip-selected' : 'chip-unselected'}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
