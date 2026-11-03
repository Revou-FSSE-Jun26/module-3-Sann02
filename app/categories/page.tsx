import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import { ArrowRightIcon } from "@/components/Icons";
import { getCategories, getProducts } from "@/lib/api";
import { getProductImage } from "@/lib/productImages";

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
    <section aria-labelledby="categories-heading" className="space-y-6">
      <div>
        <h1 id="categories-heading" className="text-3xl font-bold text-slate-900">
          Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500">{categories.length} categories from the API</p>
      </div>

      {categories.length === 0 ? (
        <p className="text-slate-500">No categories yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = counts[category.id] ?? 0;
            const sample = products.find((p) => p.category_id === category.id);
            return (
              <li key={category.id}>
                <Card className="group flex h-full flex-col overflow-hidden p-0 transition-shadow duration-200 hover:shadow-card-hover">
                  <div className="overflow-hidden bg-slate-100">
                    <Image
                      src={getProductImage(sample?.name ?? category.name)}
                      alt=""
                      width={600}
                      height={360}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[5/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-semibold text-slate-900">{category.name}</h2>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {count} product{count === 1 ? "" : "s"}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-sm leading-relaxed text-slate-600">{category.description}</p>
                    )}
                    <Link
                      href={`/products?category=${category.id}`}
                      className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-800"
                    >
                      View products
                      <ArrowRightIcon width={16} height={16} />
                    </Link>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
