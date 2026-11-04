"use client";

import { useState, type FormEvent } from "react";
import Card from "@/components/Card";
import FormField, { FormError } from "@/components/FormField";
import { getErrorMessage } from "@/lib/errors";
import type { CategoryFormData } from "@/lib/types";
import { buttonStyles, cn } from "@/lib/utils";

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
      <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
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
              className={cn(buttonStyles.secondary, "flex-1")}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className={cn(buttonStyles.primary, "flex-1")}
          >
            {submitting ? "Saving…" : submitLabel}
          </button>
        </div>
      </form>
    </Card>
  );
}
