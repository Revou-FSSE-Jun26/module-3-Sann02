"use client";

import { useId, useState, type FormEvent } from "react";
import Card from "@/components/Card";
import type { Category, ProductFormData, ProductFormErrors } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AddProductFormProps {
  categories: Category[];
  onAddProduct: (data: ProductFormData) => void;
}

const EMPTY_FORM: ProductFormData = {
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
  "w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none";

export default function AddProductForm({ categories, onAddProduct }: AddProductFormProps) {
  const idPrefix = useId();
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [touched, setTouched] = useState<Touched>({});
  const [successMessage, setSuccessMessage] = useState("");

  const errors = validateProduct(form);
  const hasErrors = Object.keys(errors).length > 0;

  function update<K extends Field>(field: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value })); // immutable update
    setTouched((prev) => ({ ...prev, [field]: true }));
    setSuccessMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasErrors) return;
    onAddProduct({ ...form, name: form.name.trim(), description: form.description.trim() });
    setSuccessMessage(`"${form.name.trim()}" was added to the list.`);
    setForm(EMPTY_FORM);
    setTouched({});
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
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        className: cn(
          inputClasses,
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
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
      <p id={f.errorId} className="mt-1 text-xs text-red-600">
        {f.error}
      </p>
    );

  return (
    <Card as="section" className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Add a product</h2>
        <p className="text-xs text-gray-500">
          Saved to this page only. Saving to the API comes in Checkpoint 3.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div>
          <label htmlFor={nameField.id} className="mb-1 block text-sm font-medium">
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
            <label htmlFor={priceField.id} className="mb-1 block text-sm font-medium">
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
            <label htmlFor={stockField.id} className="mb-1 block text-sm font-medium">
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
          <label htmlFor={categoryField.id} className="mb-1 block text-sm font-medium">
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
          <label htmlFor={descriptionField.id} className="mb-1 block text-sm font-medium">
            Description <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            {...descriptionField.inputProps}
          />
          {errorText(descriptionField)}
        </div>

        <button
          type="submit"
          disabled={hasErrors}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          Add product
        </button>
        {hasErrors && (
          <p className="text-xs text-gray-500">Fill in every required field to enable the button.</p>
        )}
        <p role="status" className="text-sm text-green-700">
          {successMessage}
        </p>
      </form>
    </Card>
  );
}
