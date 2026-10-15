"use client";

import LoadError from "@/components/LoadError";
import OrdersTable from "@/components/OrdersTable";
import { ListSkeleton } from "@/components/Skeletons";
import { useApiData } from "@/hooks/useApiData";
import { fetchOrders } from "@/lib/apiClient";
import { formatPrice } from "@/lib/utils";

/** No token -> the API returns every user's orders. */
async function loadAllOrders() {
  const orders = await fetchOrders();
  return [...orders].sort((a, b) => b.id - a.id);
}

/** /dashboard/orders: read-only overview of all orders, with a User column. */
export default function AdminOrders() {
  const { data: orders, error, loading, reload } = useApiData(loadAllOrders);
  const revenue = (orders ?? []).reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <section aria-labelledby="admin-orders-heading" className="space-y-4">
      <div>
        <h1 id="admin-orders-heading" className="text-2xl font-bold">
          All orders
        </h1>
        <p className="text-sm text-gray-500">
          {orders ? `${orders.length} orders · ${formatPrice(revenue)} total` : "Every order across all users."}
        </p>
      </div>
      {loading ? (
        <ListSkeleton rows={5} />
      ) : error ? (
        <LoadError message={error} onRetry={reload} />
      ) : (
        <OrdersTable orders={orders ?? []} showUser />
      )}
    </section>
  );
}
