"use client";

import type { ChangeEvent, FormEvent } from "react";
import { SearchIcon } from "@/components/Icons";

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
      <label htmlFor="product-search" className="mb-1.5 block text-sm font-semibold text-slate-700">
        Search products
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="product-search"
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm transition-colors duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
      </div>
    </form>
  );
}
