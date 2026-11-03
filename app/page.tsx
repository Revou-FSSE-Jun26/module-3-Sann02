import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";
import { getProductImage } from "@/lib/productImages";
import { buttonStyles } from "@/lib/utils";

export const metadata: Metadata = {
  // The root layout's title template only applies to child segments, so the
  // home page (same segment as the root layout) sets its full title itself.
  title: { absolute: "Home | RevoShop" },
  description: "Featured products from the RevoShop catalog.",
};

const FEATURED_COUNT = 5;

/** Server Component: fetches GET /products + GET /categories and builds the storefront. */
export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const featured = products.slice(0, FEATURED_COUNT);

  // One representative photo per category for the category tiles.
  const categoryTiles = categories.map((category) => {
    const items = products.filter((p) => p.category_id === category.id);
    return { category, count: items.length, image: getProductImage(items[0]?.name ?? category.name) };
  });

  const heroImages = products.slice(0, 3).map((p) => ({ name: p.name, src: getProductImage(p.name) }));

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-950 text-white">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
        />
        <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-16">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true" />
              New arrivals every week
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Welcome to RevoShop.{" "}
              <span className="text-accent-400">Everything you need,</span> one cart away.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-brand-100 sm:text-lg">
              Electronics, fashion, food and books from trusted sellers. Live stock, honest prices
              and free shipping on every order.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className={buttonStyles.accent}>
                Shop all products
                <ArrowRightIcon width={18} height={18} />
              </Link>
              <Link
                href="/categories"
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors duration-200 hover:bg-white/10"
              >
                Browse categories
              </Link>
            </div>
            <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-sm">
              <div className="flex items-center gap-2">
                <TruckIcon className="text-accent-400" />
                <dt className="sr-only">Shipping</dt>
                <dd className="text-brand-100">Free nationwide shipping</dd>
              </div>
              <div className="flex items-center gap-2">
                <ShieldIcon className="text-accent-400" />
                <dt className="sr-only">Payment</dt>
                <dd className="text-brand-100">Secure checkout</dd>
              </div>
            </dl>
          </div>

          {heroImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4" aria-hidden="true">
              {heroImages.map((img, i) => (
                <div
                  key={img.name}
                  className={
                    i === 0
                      ? "relative row-span-2 overflow-hidden rounded-2xl ring-1 ring-white/10"
                      : "relative overflow-hidden rounded-2xl ring-1 ring-white/10"
                  }
                >
                  <Image
                    src={img.src}
                    alt=""
                    width={600}
                    height={i === 0 ? 800 : 400}
                    priority={i === 0}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categoryTiles.length > 0 && (
        <section aria-labelledby="categories-heading" className="space-y-5">
          <SectionHeader
            id="categories-heading"
            title="Shop by category"
            subtitle="Find what you need faster"
            href="/categories"
            linkLabel="All categories"
          />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categoryTiles.map(({ category, count, image }) => (
              <li key={category.id}>
                <Link
                  href={`/products?category=${category.id}`}
                  className="group relative block overflow-hidden rounded-2xl bg-slate-900"
                >
                  <Image
                    src={image}
                    alt=""
                    width={400}
                    height={300}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="aspect-[4/3] w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-70"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block font-display text-lg font-semibold text-white">{category.name}</span>
                    <span className="block text-sm text-slate-200">
                      {count} item{count === 1 ? "" : "s"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Featured */}
      <section aria-labelledby="featured-heading" className="space-y-5">
        <SectionHeader
          id="featured-heading"
          title="Featured products"
          subtitle={`${featured.length} of ${products.length} products, picked for you`}
          href="/products"
          linkLabel="View all"
        />

        {featured.length === 0 ? (
          <p className="text-slate-500">No products yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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

      {/* Promo banner */}
      <section className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-accent-50 px-6 py-10 ring-1 ring-accent-200 sm:px-10 md:flex-row md:items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">New here? Your first order ships free.</h2>
          <p className="text-slate-600">Create an account in seconds and keep your cart on every device.</p>
        </div>
        <Link href="/register" className={buttonStyles.primary}>
          Create your account
          <ArrowRightIcon width={18} height={18} />
        </Link>
      </section>
    </div>
  );
}

function SectionHeader({
  id,
  title,
  subtitle,
  href,
  linkLabel,
}: {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-800"
      >
        {linkLabel}
        <ArrowRightIcon width={16} height={16} />
      </Link>
    </div>
  );
}
