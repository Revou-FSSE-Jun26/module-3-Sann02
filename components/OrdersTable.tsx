"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import type { OrderWithItems } from "@/lib/types";
import { formatDate, formatPrice, getOrderStatusClasses } from "@/lib/utils";

interface OrdersTableProps {
  orders: OrderWithItems[];
  /** Admin view adds a User column. */
  showUser?: boolean;
  /** Rows link to /orders/[id] when true. */
  linkRows?: boolean;
  emptyMessage?: string;
}

function itemCount(order: OrderWithItems): number {
  return (order.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
}

/** Shared table for the customer (/orders) and admin (/dashboard/orders) views. */
export default function OrdersTable({
  orders,
  showUser = false,
  linkRows = false,
  emptyMessage = "No orders yet.",
}: OrdersTableProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <Card className="py-10 text-center text-sm text-gray-500" data-testid="orders-empty">
        {emptyMessage}
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[600px] text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th scope="col" className="p-3 font-semibold">{showUser ? "Order" : "Order ID"}</th>
            {showUser && <th scope="col" className="p-3 font-semibold">User</th>}
            <th scope="col" className="p-3 font-semibold">Date</th>
            <th scope="col" className="p-3 font-semibold">Items</th>
            <th scope="col" className="p-3 font-semibold">Status</th>
            <th scope="col" className="p-3 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const count = itemCount(order);
            return (
              <tr
                key={order.id}
                data-testid="order-row"
                onClick={linkRows ? () => router.push(`/orders/${order.id}`) : undefined}
                className={linkRows ? "cursor-pointer border-t border-gray-100 hover:bg-blue-50" : "border-t border-gray-100"}
              >
                <td className="p-3 font-semibold">
                  {linkRows ? (
                    // A real link keeps the row reachable by keyboard and screen readers.
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      #{order.id}
                    </Link>
                  ) : (
                    `#${order.id}`
                  )}
                </td>
                {showUser && <td className="p-3">User #{order.user_id}</td>}
                <td className="p-3 text-gray-600">{formatDate(order.created_at)}</td>
                <td className="p-3">
                  {count} item{count === 1 ? "" : "s"}
                </td>
                <td className="p-3">
                  <span className={getOrderStatusClasses(order.status)}>{order.status}</span>
                </td>
                <td className="p-3 text-right font-semibold tabular-nums">{formatPrice(order.total_amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
