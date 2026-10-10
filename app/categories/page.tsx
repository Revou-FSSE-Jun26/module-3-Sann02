import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Categories",
  description: "Shop RevoShop products by category.",
};

/** Server Component: GET /categories + GET /products to count products per category. */
export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const counts = products.reduce<Record<number, number>>((acc, product) => {
    acc[product.category_id] = (acc[product.category_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section aria-labelledby="categories-heading" className="space-y-4">
      <div>
        <h1 id="categories-heading" className="text-2xl font-bold">
          Categories
        </h1>
        <p className="text-sm text-gray-500">{categories.length} categories from the API</p>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = counts[category.id] ?? 0;
            return (
              <li key={category.id}>
                <Card className="flex h-full flex-col gap-2">
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                  <p className="text-sm font-medium text-gray-500">
                    {count} product{count === 1 ? "" : "s"}
                  </p>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="mt-auto text-sm font-semibold text-blue-600 hover:underline"
                  >
                    View products &rarr;
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
