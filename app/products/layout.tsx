import Link from "next/link";
import LayoutMountLogger from "@/components/LayoutMountLogger";

/**
 * Nested layout for /products and /products/[id].
 * It is preserved across navigation between those routes; only {children} changes.
 */
export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return (
    <div className="space-y-6">
      <LayoutMountLogger name="products/layout" />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="transition-colors duration-200 hover:text-brand-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-300">
            /
          </li>
          <li>
            <Link href="/products" className="font-semibold text-slate-700 transition-colors duration-200 hover:text-brand-700">
              Products
            </Link>
          </li>
        </ol>
      </nav>
      {children}
    </div>
  );
}
