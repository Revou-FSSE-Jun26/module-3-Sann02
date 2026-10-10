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
    "flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-lg leading-none text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
      >
        &minus;
      </button>
      <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
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
