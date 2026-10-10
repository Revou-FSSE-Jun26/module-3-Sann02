"use client";

import type { ChangeEvent, FormEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Called on Enter / submit, e.g. to push the query into the URL right away. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
}

/** Controlled search input: the parent owns the text in state. */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search products...",
}: SearchBarProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // no full page reload
    onSubmit?.(value);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex-1">
      <label htmlFor="product-search" className="mb-1 block text-sm font-medium text-gray-700">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      />
    </form>
  );
}
