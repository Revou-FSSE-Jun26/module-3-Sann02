"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import RouteStatus from "@/components/RouteStatus";
import { useAuth } from "@/hooks/useAuth";

/**
 * Authentication + authorization gate:
 * guest -> /login, logged-in non-admin -> /, admin -> renders the page.
 */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) router.replace("/login"); // login checked first
    else if (!isAdmin) router.replace("/");
  }, [isReady, isLoggedIn, isAdmin, router]);

  if (!isReady) return <RouteStatus />;
  if (!isLoggedIn) return <RouteStatus message="Please log in. Redirecting to /login…" />;
  if (!isAdmin) return <RouteStatus message="Admins only. Redirecting to the home page…" />;
  return <>{children}</>;
}
