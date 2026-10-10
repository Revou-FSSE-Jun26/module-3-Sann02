import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse, search and filter every RevoShop product.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  await searchParams; // request-time route; filters are read by ProductGrid
  return <ProductGrid products={[]} categories={[]} />;
}
