import Link from "next/link";
import LayoutMountLogger from "@/components/LayoutMountLogger";

/**
 * Nested layout for /products and /products/[id].
 * It is preserved across navigation between those routes; only {children} changes.
 */
export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return (
    <div className="space-y-4">
      <LayoutMountLogger name="products/layout" />
      <div className="flex flex-col gap-1 rounded-xl bg-blue-600 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">RevoShop Store</p>
        <nav aria-label="Breadcrumb" className="text-sm text-blue-100">
          <Link href="/" className="hover:text-white hover:underline">
            Home
          </Link>
          <span aria-hidden="true"> &rsaquo; </span>
          <Link href="/products" className="hover:text-white hover:underline">
            Products
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
