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
    <nav aria-label="Dashboard" className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
      <span className="mr-2 text-sm font-semibold text-gray-500">Admin dashboard</span>
      {TABS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
