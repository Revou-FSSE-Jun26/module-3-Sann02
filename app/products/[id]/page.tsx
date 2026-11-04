import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import { ArrowLeftIcon, ReturnIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import ProductPurchase from "@/components/ProductPurchase";
import { getCategories, getProduct } from "@/lib/api";
import { getProductImage } from "@/lib/productImages";
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

const PROMISES = [
  { icon: TruckIcon, text: "Free shipping, arrives in 2 to 4 days" },
  { icon: ReturnIcon, text: "Free 7-day returns" },
  { icon: ShieldIcon, text: "Secure checkout, buyer protection" },
];

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.category_id);
  const status = getStockStatus(product.stock_quantity);

  return (
    <article className="space-y-6">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-800"
      >
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Back to all products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
          <Image
            src={getProductImage(product)}
            alt={product.name}
            width={900}
            height={900}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            {category && (
              <Link
                href={`/products?category=${category.id}`}
                className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 transition-colors duration-200 hover:bg-brand-100"
              >
                {category.name}
              </Link>
            )}
            <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={status} />
              <span className="text-sm text-slate-500">
                {product.stock_quantity > 0 ? `${product.stock_quantity} units available` : "Currently unavailable"}
              </span>
            </div>
          </div>

          <p className="font-display text-4xl font-extrabold text-slate-900">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="max-w-prose leading-relaxed text-slate-600">{product.description}</p>
          )}

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
            <ProductPurchase product={product} />
            <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {PROMISES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-slate-600">
                  <Icon size={18} className="shrink-0 text-brand-600" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200/80">
              <dt className="text-slate-500">Stock</dt>
              <dd className="font-semibold text-slate-900">{product.stock_quantity} units</dd>
            </div>
            <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200/80">
              <dt className="text-slate-500">Product ID</dt>
              <dd className="font-semibold text-slate-900">#{product.id}</dd>
            </div>
            <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200/80">
              <dt className="text-slate-500">Added</dt>
              <dd className="font-semibold text-slate-900">{formatDate(product.created_at)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
