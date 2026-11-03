"use client";

import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  /** Selected category id as a string ("" = all categories). */
  value: string;
  onChange: (categoryId: string) => void;
}

export default function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  return (
    <div className="sm:w-56">
      <label htmlFor="category-filter" className="mb-1.5 block text-sm font-semibold text-slate-700">
        Category
      </label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm transition-colors duration-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={String(category.id)}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
