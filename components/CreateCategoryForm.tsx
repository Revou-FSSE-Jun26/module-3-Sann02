"use client";

import { useState, type FormEvent } from "react";
import Card from "@/components/Card";
import FormField, { FormError } from "@/components/FormField";
import { getErrorMessage } from "@/lib/errors";
import type { CategoryFormData } from "@/lib/types";

type CategoryErrors = Partial<Record<keyof CategoryFormData, string>>;

export function validateCategory(form: CategoryFormData): CategoryErrors {
  const errors: CategoryErrors = {};
  const name = form.name.trim();
  if (!name) errors.name = "Category name is required";
  else if (name.length > 100) errors.name = "Category name must be 100 characters or fewer";
  return errors;
}

interface CreateCategoryFormProps {
  /** POST or PUT; throw to keep the form filled in. */
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialValues?: CategoryFormData;
  title?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

const EMPTY: CategoryFormData = { name: "", description: "" };

/** Validated category form; used for create and (with initialValues) for edit. */
export default function CreateCategoryForm({
  onSubmit,
  initialValues = EMPTY,
  title = "New category",
  submitLabel = "Create category",
  onCancel,
}: CreateCategoryFormProps) {
  const [form, setForm] = useState<CategoryFormData>(initialValues);
  const [errors, setErrors] = useState<CategoryErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof CategoryFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errs = validateCategory(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
      if (initialValues === EMPTY) setForm(EMPTY); // reset only when creating
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Saving failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card as="section" className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-3" aria-label={title}>
        <FormField
          label="Category name"
          name="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
        />
        <FormField
          label="Description (optional)"
          name="description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <FormError message={submitError} />
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 min-h-11 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : submitLabel}
          </button>
        </div>
      </form>
    </Card>
  );
}
