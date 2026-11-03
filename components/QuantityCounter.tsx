interface QuantityCounterProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  /** Used for accessible button labels, e.g. "Decrease quantity of Mouse". */
  label: string;
}

/** Controlled -/+ stepper; the parent owns the number, this only enforces min..max. */
export default function QuantityCounter({
  value,
  min = 1,
  max,
  onChange,
  label,
}: QuantityCounterProps) {
  const buttonClasses =
    "flex h-9 w-9 items-center justify-center rounded-lg text-lg leading-none text-slate-700 transition-colors duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center rounded-xl border border-slate-300 bg-white p-0.5">
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
      >
        &minus;
      </button>
      <span className="w-7 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        +
      </button>
    </div>
  );
}
