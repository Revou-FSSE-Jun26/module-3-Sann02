"use client";

import Link from "next/link";
import { useCallback } from "react";
import LoadError from "@/components/LoadError";
import OrdersTable from "@/components/OrdersTable";
import { ListSkeleton } from "@/components/Skeletons";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { fetchOrders } from "@/lib/apiClient";

/** /orders: only the logged-in user's orders (the API filters by the JWT), newest first. */
export default function CustomerOrders() {
  const { currentUser, token } = useAuth();

  const loadOrders = useCallback(async () => {
    const orders = await fetchOrders(token);
    // Defence in depth: never show someone else's rows even if the API returned them.
    return orders.filter((o) => o.user_id === currentUser?.id).sort((a, b) => b.id - a.id);
  }, [token, currentUser?.id]);

  const { data: orders, error, loading, reload } = useApiData(loadOrders);

  return (
    <section aria-labelledby="orders-heading" className="space-y-4">
      <div>
        <h1 id="orders-heading" className="text-2xl font-bold">
          My orders
        </h1>
        <p className="text-sm text-gray-500">Orders placed by {currentUser?.username}. Click a row for details.</p>
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
              <Link href="/products" className="font-semibold text-blue-600 hover:underline">
                Start shopping
              </Link>
            </p>
          )}
        </>
      )}
    </section>
  );
}
