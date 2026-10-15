import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import ProductPurchase from "@/components/ProductPurchase";
import { getCategories, getProduct } from "@/lib/api";
import { formatDate, formatPrice, getStockStatus } from "@/lib/utils";

/** "12" -> 12; anything that isn't a positive integer -> null. */
function parseId(raw: string): number | null {
  return /^\d+$/.test(raw) && Number(raw) > 0 ? Number(raw) : null;
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const id = parseId((await params).id);
  // Same GET as the page below; Next.js memoizes it, so only one request is sent.
  const product = id ? await getProduct(id) : null;
  if (!product) return { title: "Product not found" };
  return {
    title: product.name, // -> "<name> | RevoShop" via the root title template
    description: product.description ?? `Buy ${product.name} at RevoShop.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.category_id);
  const status = getStockStatus(product.stock_quantity);

  return (
    <article className="space-y-4">
      <Link href="/products" className="text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to all products
      </Link>

      <Card className="grid gap-6 p-6 md:grid-cols-2">
        <div
          aria-hidden="true"
          className="flex h-64 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 text-7xl font-bold text-blue-500"
        >
          {product.name.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {category && (
              <Link
                href={`/products?category=${category.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge variant={status} />
          </div>

          <p className="text-3xl font-bold text-blue-700">{formatPrice(product.price)}</p>

          {product.description && <p className="text-gray-700">{product.description}</p>}
          <ProductPurchase product={product} />

          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 text-sm">
            <div>
              <dt className="text-gray-500">Stock</dt>
              <dd className="font-semibold">{product.stock_quantity} units</dd>
            </div>
            <div>
              <dt className="text-gray-500">Product ID</dt>
              <dd className="font-semibold">#{product.id}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-gray-500">Added</dt>
              <dd className="font-semibold">{formatDate(product.created_at)}</dd>
            </div>
          </dl>
        </div>
      </Card>
    </article>
  );
}
