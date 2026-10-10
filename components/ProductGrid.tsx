"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import AddProductForm from "@/components/AddProductForm";
import CartSummary from "@/components/CartSummary";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import type { CartItem, Category, Product, ProductFormData } from "@/lib/types";

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
 * - cart and locally added products live in state and are updated immutably.
 */
export default function ProductGrid({ products, categories }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearch = searchParams.get("search") ?? "";
  const urlCategory = searchParams.get("category") ?? "";

  const [query, setQuery] = useState(urlSearch);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
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

  function addToCart(product: Product, quantity: number) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (!existing) return [...prev, { product, quantity }];
      return prev.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity) }
          : item,
      );
    });
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function addProduct(data: ProductFormData) {
    const newProduct: Product = {
      ...data,
      id: Date.now(), // local-only id; the API assigns real ids in Checkpoint 3
      description: data.description || null,
      created_at: new Date().toISOString(),
    };
    setLocalProducts((prev) => [...prev, newProduct]);
  }

  // Derived on every render, never stored.
  const visibleApi = products.filter((p) => matchesSearch(p, query));
  const visibleLocal = localProducts.filter(
    (p) => matchesSearch(p, query) && (!categoryId || String(p.category_id) === categoryId),
  );
  const resultCount = visibleApi.length + visibleLocal.length;
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
            {visibleApi.map((product) => (
              <li key={product.id}>
                <ProductCard
                  product={product}
                  href={`/products/${product.id}`}
                  onAddToCart={addToCart}
                />
              </li>
            ))}
            {visibleLocal.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} featured onAddToCart={addToCart} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <CartSummary items={cart} onRemove={removeFromCart} onClear={() => setCart([])} />
        <AddProductForm categories={categories} onAddProduct={addProduct} />
      </div>
    </div>
  );
}
