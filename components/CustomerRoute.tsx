"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import RouteStatus from "@/components/RouteStatus";
import { useAuth } from "@/hooks/useAuth";

/**
 * Authentication + authorization gate for customer-only pages (e.g. /orders).
 * guest -> /login, admin -> /dashboard, customer -> renders the page.
 * Admins have their own all-orders overview at /dashboard/orders.
 */
export default function CustomerRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) router.replace("/login"); // login checked first
    else if (isAdmin) router.replace("/dashboard");
  }, [isReady, isLoggedIn, isAdmin, router]);

  if (!isReady) return <RouteStatus />;
  if (!isLoggedIn) return <RouteStatus message="Please log in. Redirecting to /login…" />;
  if (isAdmin) return <RouteStatus message="Admins use the dashboard. Redirecting…" />;
  return <>{children}</>;
}
