"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  label: string;
  /** Icon slot (Lucide icon component). */
  icon?: React.ElementType;
  /** Message rendered under the input (red) and announced via aria-describedby. */
  error?: string;
}

/** Labelled, controlled text input with icon prefix, password toggle, and accessible error. */
export default function FormField({ label, icon: Icon, error, type, ...inputProps }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2",
              error ? "text-rose-400" : "text-slate-400",
            )}
          >
            <Icon size={16} />
          </span>
        )}

        <input
          id={id}
          type={inputType}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "min-h-11 w-full rounded-xl border bg-white py-2.5 text-sm text-slate-900 transition-all duration-200",
            "placeholder:text-slate-400 focus:outline-none focus:ring-4",
            Icon ? "pl-10" : "pl-3.5",
            isPassword ? "pr-10" : "pr-3.5",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-200 focus:border-brand-500 focus:ring-brand-100 hover:border-slate-300",
          )}
          {...inputProps}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-slate-600"
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        )}
      </div>

      {/* Error message with shake indicator */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
          style={{ animation: "scale-in 0.2s ease both" }}
        >
          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Form-level error banner (401 / 409 etc.) */
export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
      style={{ animation: "fade-in 0.25s ease both" }}
    >
      <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold">
        !
      </span>
      <p className="text-sm font-medium text-rose-700">{message}</p>
    </div>
  );
}
