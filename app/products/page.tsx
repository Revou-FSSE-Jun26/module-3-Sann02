import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse, search and filter every RevoShop product.",
};

/** Read a single string value from a search param (arrays/garbage -> undefined). */
function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * Server Component: reads ?search & ?category from the URL and refetches the
 * filtered list from the API. Whenever ProductGrid pushes a new URL, this runs
 * again on the server with the new filters.
 */
export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const params = await searchParams;
  const search = single(params.search)?.trim() || undefined;
  const rawCategory = single(params.category);
  const categoryId = rawCategory && /^\d+$/.test(rawCategory) ? Number(rawCategory) : undefined;

  const [products, categories] = await Promise.all([
    getProducts({ search, categoryId }),
    getCategories(),
  ]);

  return <ProductGrid products={products} categories={categories} />;
}
