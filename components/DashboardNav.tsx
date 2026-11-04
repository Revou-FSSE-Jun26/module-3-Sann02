"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Products" },
  { href: "/dashboard/categories", label: "Categories" },
  { href: "/dashboard/orders", label: "Orders" },
] as const;

/** Tabs between the three admin pages; hidden for anyone who isn't an admin. */
export default function DashboardNav() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;

  return (
    <nav
      aria-label="Dashboard"
      className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-card"
    >
      <span className="mr-2 px-3 text-sm font-semibold text-slate-500">Admin dashboard</span>
      {TABS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 items-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200",
              active ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
