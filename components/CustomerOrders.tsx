"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import LoadError from "@/components/LoadError";
import OrdersTable from "@/components/OrdersTable";
import { ListSkeleton } from "@/components/Skeletons";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { fetchOrders } from "@/lib/apiClient";
import { isAuthExpiredError } from "@/lib/errors";
import type { OrderWithItems } from "@/lib/types";

/** /orders: only the logged-in user's orders (the API filters by the JWT), newest first. */
export default function CustomerOrders() {
  const { currentUser, token, logout } = useAuth();
  const router = useRouter();

  const loadOrders = useCallback(async (): Promise<OrderWithItems[]> => {
    try {
      const orders = await fetchOrders(token);
      // Defence in depth: never show someone else's rows even if the API returned them.
      return orders.filter((o) => o.user_id === currentUser?.id).sort((a, b) => b.id - a.id);
    } catch (err) {
      // Expired/invalid token: log out and send to /login instead of a dead-end error.
      if (isAuthExpiredError(err)) {
        logout();
        toast.error("Your session expired. Please log in again.");
        router.replace("/login");
        return [];
      }
      throw err;
    }
  }, [token, currentUser?.id, logout, router]);

  const { data: orders, error, loading, reload } = useApiData(loadOrders);

  return (
    <section aria-labelledby="orders-heading" className="space-y-4">
      <div>
        <h1 id="orders-heading" className="font-display text-3xl font-extrabold text-slate-900">
          My orders
        </h1>
        <p className="text-sm text-slate-500">Orders placed by {currentUser?.username}. Click a row for details.</p>
      </div>
      {loading ? (
        <ListSkeleton rows={3} />
      ) : error ? (
        <LoadError message={error} onRetry={reload} />
      ) : (
        <>
          <OrdersTable orders={orders ?? []} linkRows emptyMessage="You haven't placed any orders yet." />
          {orders?.length === 0 && (
            <p className="text-center text-sm">
              <Link href="/products" className="font-semibold text-brand-600 hover:underline">
                Start shopping
              </Link>
            </p>
          )}
        </>
      )}
    </section>
  );
}
