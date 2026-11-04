import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ShieldIcon,
  SparklesIcon,
  TruckIcon,
  ZapIcon,
} from "@/components/Icons";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";
import { getProductImage } from "@/lib/productImages";
import { buttonStyles } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Home | RevoShop" },
  description: "Featured products from the RevoShop catalog.",
};

const FEATURED_COUNT = 5;

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const featured = products.slice(0, FEATURED_COUNT);

  const categoryTiles = categories.map((category) => {
    const items = products.filter((p) => p.category_id === category.id);
    // Pass the product itself (not just its name) so the tile uses the real
    // image_url; the name-only call always fell back to keyword placeholders.
    return { category, count: items.length, image: getProductImage(items[0] ?? category.name) };
  });

  const heroImages = products.slice(0, 3).map((p) => ({ name: p.name, src: getProductImage(p) }));

  return (
    <div className="space-y-20">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl text-white" style={{ minHeight: "480px" }}>
        {/* Gradient mesh background */}
        <div className="gradient-mesh absolute inset-0" />

        {/* Animated orb decorations */}
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(56 102 245 / 0.5), transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(249 115 22 / 0.4), transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute right-1/3 top-1/4 h-48 w-48 rounded-full opacity-30 blur-2xl"
          style={{ background: "radial-gradient(circle, rgb(168 85 247 / 0.5), transparent 70%)" }}
        />

        {/* Content */}
        <div className="relative grid items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-20">
          <div className="space-y-7 animate-fade-in">
            {/* Promo pill */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-brand-100 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" style={{ animation: "pulse-ring 1.5s ease-out infinite" }} />
                <span className="relative h-2 w-2 rounded-full bg-accent-400" />
              </span>
              New arrivals every week
            </span>

            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to RevoShop.
              <br />
              Everything you need, one cart away.
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
              Laptops, smartphones, TVs, PCs and audio gear from trusted sellers. Live stock, honest prices and{" "}
              <span className="font-semibold text-emerald-400">free shipping</span> on every order.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/products" className={`${buttonStyles.accent} btn-shine`}>
                <ZapIcon size={18} />
                Shop all products
              </Link>
              <Link
                href="/categories"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/20"
              >
                Browse categories
                <ArrowRightIcon size={16} />
              </Link>
            </div>

            {/* Trust badges */}
            <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
                  <TruckIcon size={14} />
                </span>
                <dd className="text-slate-300">Free nationwide shipping</dd>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <ShieldIcon size={14} />
                </span>
                <dd className="text-slate-300">Secure checkout</dd>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                  <SparklesIcon size={14} />
                </span>
                <dd className="text-slate-300">Premium quality</dd>
              </div>
            </dl>
          </div>

          {/* Hero images */}
          {heroImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4" aria-hidden="true">
              {heroImages.map((img, i) => (
                <div
                  key={img.name}
                  className={
                    i === 0
                      ? "relative row-span-2 overflow-hidden rounded-2xl ring-1 ring-white/20 shadow-2xl animate-float"
                      : "relative overflow-hidden rounded-2xl ring-1 ring-white/20 shadow-xl"
                  }
                  style={i === 1 ? { animationDelay: "1s" } : undefined}
                >
                  <Image
                    src={img.src}
                    alt=""
                    width={600}
                    height={i === 0 ? 800 : 400}
                    priority={i === 0}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CATEGORY TILES
      ════════════════════════════════════════ */}
      {categoryTiles.length > 0 && (
        <section aria-labelledby="categories-heading" className="space-y-6">
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
                  className="group relative block overflow-hidden rounded-2xl bg-slate-900 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <Image
                    src={image}
                    alt=""
                    width={400}
                    height={300}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="aspect-[4/3] w-full object-cover opacity-75 transition-all duration-500 group-hover:scale-110 group-hover:opacity-60"
                  />
                  {/* Gradient overlay */}
                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  {/* Glassmorphism label */}
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block font-display text-lg font-bold text-white drop-shadow-sm">{category.name}</span>
                    <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                      {count} item{count === 1 ? "" : "s"}
                    </span>
                  </span>
                  {/* Hover arrow */}
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/0 text-white/0 transition-all duration-300 group-hover:bg-white/20 group-hover:text-white group-hover:backdrop-blur-sm"
                  >
                    <ArrowRightIcon size={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════ */}
      <section aria-labelledby="featured-heading" className="space-y-6">
        <SectionHeader
          id="featured-heading"
          title="Featured products"
          subtitle={`${featured.length} of ${products.length} products, handpicked for you`}
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

      {/* ════════════════════════════════════════
          PROMO BANNER
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl text-white">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0f1a47 0%, #1c38b8 40%, #2448e0 70%, #3866f5 100%)",
          }}
        />
        {/* Decorative orbs */}
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #fb923c, transparent)" }} />
        <div aria-hidden="true" className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />

        <div className="relative flex flex-col items-start justify-between gap-6 px-8 py-12 sm:px-12 md:flex-row md:items-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100">
              <SparklesIcon size={12} />
              Limited time offer
            </span>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              New here? Your first order ships free.
            </h2>
            <p className="max-w-md text-slate-300">
              Create an account in seconds and keep your cart synced on every device.
            </p>
          </div>
          <Link
            href="/register"
            className="btn-shine shrink-0 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-7 py-3 text-sm font-bold text-brand-700 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_32px_-4px_rgb(255_255_255/0.4)]"
          >
            Create your account
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════════════
   SECTION HEADER
════════════════════════════════════════ */
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
        <h2 id={id} className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {title}
          {/* Gradient underline */}
          <span
            aria-hidden="true"
            className="mt-1 block h-1 w-12 rounded-full"
            style={{ background: "linear-gradient(90deg, #2448e0, #3866f5)" }}
          />
        </h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-brand-600 transition-all duration-200 hover:text-brand-700"
      >
        {linkLabel}
        <ArrowRightIcon
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
