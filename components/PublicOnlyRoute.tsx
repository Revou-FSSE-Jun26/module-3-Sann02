"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import RouteStatus from "@/components/RouteStatus";
import { useAuth } from "@/hooks/useAuth";

/**
 * Only for logged-OUT users (/login, /register). Someone already signed in is
 * sent to where they would land after logging in: admins to /dashboard, others to /.
 */
export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && isLoggedIn) router.replace(isAdmin ? "/dashboard" : "/");
  }, [isReady, isLoggedIn, isAdmin, router]);

  if (!isReady) return <RouteStatus />;
  if (isLoggedIn) return <RouteStatus message="You're already logged in. Redirecting…" />;
  return <>{children}</>;
}
