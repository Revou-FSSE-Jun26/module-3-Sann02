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
      <label htmlFor="category-filter" className="mb-1 block text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
