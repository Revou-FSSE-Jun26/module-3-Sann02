"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import RouteStatus from "@/components/RouteStatus";
import { useAuth } from "@/hooks/useAuth";

/** Authentication gate: any logged-in user passes; guests go to /login. */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // replace (not push) so Back doesn't return to the blocked page.
    if (isReady && !isLoggedIn) router.replace("/login");
  }, [isReady, isLoggedIn, router]);

  if (!isReady) return <RouteStatus />;
  if (!isLoggedIn) return <RouteStatus message="Please log in. Redirecting to /login…" />;
  return <>{children}</>;
}
