"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartIcon } from "@/components/Icons";
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

  const cartActive = isActive(pathname, "/cart");

  return (
    <nav aria-label="Main">
      <ul className="flex flex-wrap items-center gap-1">
        {links.map(({ href, label }) => (
          <li key={href}>
            <NavItem href={href} active={isActive(pathname, href)}>
              {label}
            </NavItem>
          </li>
        ))}
        <li>
          <Link
            href="/cart"
            aria-current={cartActive ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200",
              cartActive
                ? "bg-brand-600 text-white"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <CartIcon />
            Cart
            <span
              data-testid="cart-count"
              aria-label={`${itemCount} items in cart`}
              className={cn(
                "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums",
                cartActive
                  ? "bg-white text-brand-700"
                  : itemCount > 0
                    ? "bg-accent-500 text-slate-950"
                    : "bg-slate-200 text-slate-600",
              )}
            >
              {itemCount}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function NavItem({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200",
        active
          ? "bg-brand-50 text-brand-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      {children}
    </Link>
  );
}
