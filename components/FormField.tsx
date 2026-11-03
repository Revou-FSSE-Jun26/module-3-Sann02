import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  label: string;
  /** Message rendered under the input (red) and announced via aria-describedby. */
  error?: string;
}

const base = "min-h-11 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm transition-colors duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-4";

/** Labelled, controlled text input with an accessible per-field error message. */
export default function FormField({ label, error, ...inputProps }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          base,
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-100",
        )}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Form-level banner, e.g. "Invalid email or password" (401) or "Email already registered" (409). */
export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700">
      {message}
    </p>
  );
}
