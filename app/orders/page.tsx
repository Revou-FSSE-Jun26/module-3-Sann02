import type { Metadata } from "next";
import Card from "@/components/Card";
import { getOrders } from "@/lib/api";
import { formatDate, formatPrice, getOrderStatusClasses } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders",
  description: "Recent RevoShop orders.",
};

/** The API returns every order; show the most recent ones. */
const MAX_ORDERS = 20;

/** Server Component: GET /orders. */
export default async function OrdersPage() {
  const orders = await getOrders();
  const recent = [...orders].sort((a, b) => b.id - a.id).slice(0, MAX_ORDERS);

  const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section aria-labelledby="orders-heading" className="space-y-4">
      <div className="space-y-2">
        <h1 id="orders-heading" className="text-2xl font-bold">
          Orders
        </h1>
        <p className="text-sm text-gray-500">
          Showing the {recent.length} most recent of {orders.length} orders
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Orders by status">
          {Object.entries(statusCounts).map(([status, count]) => (
            <li key={status} className={getOrderStatusClasses(status)}>
              {status}: {count}
            </li>
          ))}
        </ul>
      </div>

      {recent.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {recent.map((order) => (
            <li key={order.id}>
              <Card className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    User #{order.user_id} &middot; {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{formatPrice(order.total_amount)}</span>
                  <span className={getOrderStatusClasses(order.status)}>{order.status}</span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
