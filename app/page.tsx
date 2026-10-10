import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  // The root layout's title template only applies to child segments, so the
  // home page (same segment as the root layout) sets its full title itself.
  title: { absolute: "Home | RevoShop" },
  description: "Featured products from the RevoShop catalog.",
};

const FEATURED_COUNT = 5;

/** Server Component: fetches GET /products and shows the first 5 as read-only cards. */
export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, FEATURED_COUNT);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 px-6 py-10 text-white sm:px-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Welcome to RevoShop</h1>
        <p className="mt-2 max-w-xl text-blue-100">
          Your one-stop online shop. Every product below comes live from the RevoShop API.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 font-semibold text-blue-700 hover:bg-blue-50"
        >
          Shop all products
        </Link>
      </section>

      <section aria-labelledby="featured-heading" className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="featured-heading" className="text-2xl font-bold">
            Featured products
          </h2>
          <p className="text-sm text-gray-500">
            {featured.length} of {products.length} products
          </p>
        </div>

        {featured.length === 0 ? (
          <p className="text-gray-500">No products yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featured.map((product, index) => (
              <li key={product.id}>
                <ProductCard
                  product={product}
                  href={`/products/${product.id}`}
                  showActions={false}
                  featured={index === 0}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
