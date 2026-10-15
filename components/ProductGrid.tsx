"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import toast from "react-hot-toast";
import CartSummary from "@/components/CartSummary";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { useCart } from "@/hooks/useCart";
import type { Category, Product } from "@/lib/types";

interface ProductGridProps {
  /** Products from the API, already filtered on the server by ?search & ?category. */
  products: Product[];
  categories: Category[];
}

/** Wait this long after the last keystroke before syncing the search into the URL. */
const SEARCH_DEBOUNCE_MS = 400;

function matchesSearch(product: Product, query: string): boolean {
  const term = query.trim().toLowerCase();
  return !term || product.name.toLowerCase().includes(term);
}

/**
 * The interactive catalog (Client Component).
 * - URL (?search, ?category) is the source of truth for what the server fetches.
 * - `query` mirrors the input so the list also filters instantly on every keystroke.
 * - the cart lives in CartContext (immutable updates, persisted to localStorage).
 */
export default function ProductGrid({ products, categories }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearch = searchParams.get("search") ?? "";
  const urlCategory = searchParams.get("category") ?? "";

  const [query, setQuery] = useState(urlSearch);
  const { items: cart, removeItem, clearCart } = useCart();
  // Shows the newly picked category immediately while the server refetches.
  const [categoryId, setOptimisticCategory] = useOptimistic(urlCategory);

  // Keep the input in sync when the URL changes from outside the search box
  // (back/forward, or clicking "Products" in the nav). Our own pushes are
  // ignored by comparing against the last value we pushed.
  const [lastPushedSearch, setLastPushedSearch] = useState(urlSearch);
  const [seenUrlSearch, setSeenUrlSearch] = useState(urlSearch);
  if (urlSearch !== seenUrlSearch) {
    setSeenUrlSearch(urlSearch);
    if (urlSearch !== lastPushedSearch) {
      setLastPushedSearch(urlSearch);
      setQuery(urlSearch);
    }
  }

  function pushFilters(search: string, category: string) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    const qs = params.toString();
    setLastPushedSearch(search.trim());
    startTransition(() => {
      setOptimisticCategory(category);
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  // Debounced URL sync while typing -> server refetches GET /products?search=...
  useEffect(() => {
    if (query.trim() === urlSearch) return;
    const timer = setTimeout(() => pushFilters(query, urlCategory), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // pushFilters is recreated each render; the inputs it reads are listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, urlSearch, urlCategory]);

  function removeFromCart(productId: number) {
    const name = cart.find((item) => item.product.id === productId)?.product.name ?? "Item";
    removeItem(productId);
    toast.success(`${name} removed from your cart.`);
  }

  function emptyCart() {
    clearCart();
    toast.success("Cart cleared.");
  }

  // Derived on every render, never stored.
  const visible = products.filter((p) => matchesSearch(p, query));
  const resultCount = visible.length;
  const activeCategory = categories.find((c) => String(c.id) === categoryId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section aria-labelledby="catalog-heading" className="space-y-4">
        <h1 id="catalog-heading" className="text-2xl font-bold">
          Products
        </h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(value) => pushFilters(value, urlCategory)}
          />
          <CategoryFilter
            categories={categories}
            value={categoryId}
            onChange={(next) => pushFilters(query, next)}
          />
        </div>

        <p className="text-sm text-gray-600" aria-live="polite">
          {urlSearch || activeCategory ? (
            <>
              Filtering by{" "}
              {urlSearch && <span className="font-semibold">&quot;{urlSearch}&quot;</span>}
              {urlSearch && activeCategory && " in "}
              {activeCategory && <span className="font-semibold">{activeCategory.name}</span>}
              {" · "}
            </>
          ) : (
            "Showing all products · "
          )}
          {resultCount} result{resultCount === 1 ? "" : "s"}
          {isPending && <span className="ml-2 text-blue-600">Updating…</span>}
        </p>

        {resultCount === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No products match your filters.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} href={`/products/${product.id}`} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <CartSummary items={cart} onRemove={removeFromCart} onClear={emptyCart} showCartLink />
      </div>
    </div>
  );
}
