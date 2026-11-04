"use client";

import { useId, useState, type FormEvent } from "react";
import Card from "@/components/Card";
import { FormError } from "@/components/FormField";
import type { Category, ProductFormData, ProductFormErrors } from "@/lib/types";
import { buttonStyles, cn } from "@/lib/utils";

interface AddProductFormProps {
  categories: Category[];
  /**
   * Receives validated, trimmed data. May be async (POST/PUT to the API);
   * throw to keep the form filled in and show the message.
   */
  onAddProduct: (data: ProductFormData) => void | Promise<void>;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  /** Pre-filled values, e.g. when editing an existing product. */
  initialValues?: ProductFormData;
  /** Clear the fields after a successful submit (create) or keep them (edit). */
  resetOnSuccess?: boolean;
  onCancel?: () => void;
}

export const EMPTY_PRODUCT_FORM: ProductFormData = {
  name: "",
  price: 0,
  stock_quantity: 0,
  category_id: 0,
  description: "",
};

type Field = keyof ProductFormData;
type Touched = Partial<Record<Field, boolean>>;

/** Pure validation; runs on every render so errors always match the current state. */
export function validateProduct(data: ProductFormData): ProductFormErrors {
  const errors: ProductFormErrors = {};
  const name = data.name.trim();
  if (!name) errors.name = "Name is required.";
  else if (name.length > 150) errors.name = "Name must be 150 characters or fewer.";
  if (!Number.isFinite(data.price) || data.price <= 0) {
    errors.price = "Price must be greater than 0.";
  }
  if (!Number.isInteger(data.stock_quantity) || data.stock_quantity < 0) {
    errors.stock_quantity = "Stock must be a whole number, 0 or more.";
  }
  if (!data.category_id) errors.category_id = "Please select a category.";
  if (data.description.length > 500) {
    errors.description = "Description must be 500 characters or fewer.";
  }
  return errors;
}

const inputClasses =
  "min-h-11 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm transition-colors duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-4";

const ALL_TOUCHED: Touched = {
  name: true,
  price: true,
  stock_quantity: true,
  category_id: true,
  description: true,
};

/**
 * The validated product form shared by CreateProductForm and EditProductForm.
 * Errors appear once a field is touched (edited or blurred), or for every field
 * when the user tries to submit.
 */
export default function AddProductForm({
  categories,
  onAddProduct,
  title = "Add a product",
  subtitle,
  submitLabel = "Add product",
  initialValues = EMPTY_PRODUCT_FORM,
  resetOnSuccess = true,
  onCancel,
}: AddProductFormProps) {
  const idPrefix = useId();
  const [form, setForm] = useState<ProductFormData>(initialValues);
  const [touched, setTouched] = useState<Touched>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = validateProduct(form);
  const hasErrors = Object.keys(errors).length > 0;

  function update<K extends Field>(field: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value })); // immutable update
    setTouched((prev) => ({ ...prev, [field]: true }));
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasErrors) {
      setTouched(ALL_TOUCHED); // reveal every message instead of failing silently
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await onAddProduct({ ...form, name: form.name.trim(), description: form.description.trim() });
      if (resetOnSuccess) {
        setForm(EMPTY_PRODUCT_FORM);
        setTouched({});
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Saving failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /** Shared a11y wiring for one field: id, error id, and whether to show the error. */
  function field(name: Field) {
    const id = `${idPrefix}-${name}`;
    const errorId = `${id}-error`;
    const error = touched[name] ? errors[name] : undefined;
    return {
      id,
      errorId,
      error,
      inputProps: {
        id,
        name,
        onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        className: cn(
          inputClasses,
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-100",
        ),
      },
    };
  }

  const nameField = field("name");
  const priceField = field("price");
  const stockField = field("stock_quantity");
  const categoryField = field("category_id");
  const descriptionField = field("description");

  const errorText = (f: { errorId: string; error?: string }) =>
    f.error && (
      <p id={f.errorId} className="mt-1.5 text-xs font-medium text-rose-600">
        {f.error}
      </p>
    );

  return (
    <Card as="section" className="space-y-3">
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-3" aria-label={title}>
        <div>
          <label htmlFor={nameField.id} className="mb-1.5 block text-sm font-semibold text-slate-700">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            {...nameField.inputProps}
          />
          {errorText(nameField)}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={priceField.id} className="mb-1.5 block text-sm font-semibold text-slate-700">
              Price (Rp)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
              {...priceField.inputProps}
            />
            {errorText(priceField)}
          </div>
          <div>
            <label htmlFor={stockField.id} className="mb-1.5 block text-sm font-semibold text-slate-700">
              Stock
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={form.stock_quantity}
              onChange={(e) => update("stock_quantity", Number(e.target.value))}
              {...stockField.inputProps}
            />
            {errorText(stockField)}
          </div>
        </div>

        <div>
          <label htmlFor={categoryField.id} className="mb-1.5 block text-sm font-semibold text-slate-700">
            Category
          </label>
          <select
            value={form.category_id ? String(form.category_id) : ""}
            onChange={(e) => update("category_id", Number(e.target.value))}
            {...categoryField.inputProps}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
          {errorText(categoryField)}
        </div>

        <div>
          <label htmlFor={descriptionField.id} className="mb-1.5 block text-sm font-semibold text-slate-700">
            Description <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            {...descriptionField.inputProps}
          />
          {errorText(descriptionField)}
        </div>

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
