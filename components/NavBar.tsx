"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
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

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavBar() {
  const pathname = usePathname();
  const { isLoggedIn, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const prevCount = useRef(itemCount);
  const [cartBounce, setCartBounce] = useState(false);

  /* Trigger bounce animation when cart count increases */
  useEffect(() => {
    if (itemCount > prevCount.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      prevCount.current = itemCount;
      return () => clearTimeout(t);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

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

        {/* Cart link with animated badge */}
        <li>
          <Link
            href="/cart"
            aria-current={cartActive ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200",
              cartActive
                ? "text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
            style={
              cartActive
                ? { background: "linear-gradient(135deg, #2448e0, #3866f5)" }
                : undefined
            }
          >
            <CartIcon size={18} />
            <span className="hidden sm:inline">Cart</span>
            <span
              data-testid="cart-count"
              aria-label={`${itemCount} items in cart`}
              className={cn(
                "inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums transition-all duration-200",
                cartActive
                  ? "bg-white text-brand-700"
                  : itemCount > 0
                    ? "text-white shadow-sm"
                    : "bg-slate-200 text-slate-500",
                cartBounce && "animate-cart-bounce",
              )}
              style={
                !cartActive && itemCount > 0
                  ? { background: "linear-gradient(135deg, #f97316, #fb923c)" }
                  : undefined
              }
            >
              {itemCount}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200",
        active
          ? "bg-brand-50 text-brand-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      {children}
      {/* Animated underline for active state */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
        />
      )}
    </Link>
  );
}
