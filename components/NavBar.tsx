"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

const PUBLIC_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
];

/** "/" matches exactly; other links also stay active on nested routes (/products/3). */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  // /dashboard must not light up on /dashboard/orders, which has its own link.
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavBar() {
  const pathname = usePathname();
  const { isLoggedIn, isAdmin } = useAuth();
  const { itemCount } = useCart();

  // Links depend on the role: customers get Orders + Cart, admins the dashboard.
  const links: NavLink[] = [...PUBLIC_LINKS];
  if (isLoggedIn) links.push({ href: "/orders", label: "My Orders" });
  if (isAdmin) links.push({ href: "/dashboard", label: "Dashboard" });

  return (
    <nav aria-label="Main">
      <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <NavItem href={href} active={isActive(pathname, href)}>
              {label}
            </NavItem>
          </li>
        ))}
        <li>
          <NavItem href="/cart" active={isActive(pathname, "/cart")}>
            Cart
            <span
              data-testid="cart-count"
              aria-label={`${itemCount} items in cart`}
              className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-semibold text-blue-700"
            >
              {itemCount}
            </span>
          </NavItem>
        </li>
      </ul>
    </nav>
  );
}

function NavItem({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition",
        active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      {children}
    </Link>
  );
}
