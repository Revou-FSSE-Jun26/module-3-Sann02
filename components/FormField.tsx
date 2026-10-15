import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  label: string;
  /** Message rendered under the input (red) and announced via aria-describedby. */
  error?: string;
}

const base = "w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none";

/** Labelled, controlled text input with an accessible per-field error message. */
export default function FormField({ label, error, ...inputProps }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          base,
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
        )}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
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
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}
