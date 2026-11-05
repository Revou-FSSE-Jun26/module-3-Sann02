"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import { ArrowLeftIcon } from "@/components/Icons";
import LoadError from "@/components/LoadError";
import { ListSkeleton } from "@/components/Skeletons";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { fetchOrder } from "@/lib/apiClient";
import { ApiError, isAuthExpiredError } from "@/lib/errors";
import { formatDate, formatPrice, getOrderStatusClasses } from "@/lib/utils";

/** /orders/[id]: items, quantities and totals. Customers may only open their own orders. */
export default function OrderDetail({ orderId }: { orderId: number }) {
  // This page is customer-only (guarded by CustomerRoute); admins use /dashboard/orders.
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const loadOrder = useCallback(async () => {
    try {
      return await fetchOrder(orderId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      // Expired/invalid token: log out and send to /login instead of a dead-end error.
      if (isAuthExpiredError(error)) {
        logout();
        toast.error("Your session expired. Please log in again.");
        router.replace("/login");
        return null;
      }
      throw error;
    }
  }, [orderId, logout, router]);

  const { data: order, error, loading, reload } = useApiData(loadOrder);

  if (loading) return <ListSkeleton rows={4} />;
  if (error) return <LoadError message={error} onRetry={reload} />;

  // Same "not found" for missing and for someone else's order (don't leak which ids exist).
  if (!order || order.user_id !== currentUser?.id) {
    return (
      <Card className="mx-auto max-w-lg space-y-3 py-8 text-center">
        <h1 className="text-xl font-semibold">Order not found</h1>
        <p className="text-sm text-slate-600">We couldn&apos;t find order #{orderId} in your account.</p>
        <Link href="/orders" className="inline-block font-semibold text-brand-600 hover:underline">
          Back to my orders
        </Link>
      </Card>
    );
  }

  return (
    <article className="space-y-4">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Back to my orders
      </Link>
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">Order #{order.id}</h1>
            <p className="text-sm text-slate-500">Placed {formatDate(order.created_at)}</p>
          </div>
          <span className={getOrderStatusClasses(order.status)}>{order.status}</span>
        </div>
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Product</th>
                <th scope="col" className="px-4 py-3 font-semibold">Price</th>
                <th scope="col" className="px-4 py-3 font-semibold">Qty</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{item.product_name ?? `Product #${item.product_id}`}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(item.price_at_purchase)}</td>
                  <td className="px-4 py-3 tabular-nums">{item.quantity}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {formatPrice(item.price_at_purchase * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3">
          <span className="font-semibold">Total</span>
          <span className="font-display text-lg font-extrabold text-brand-700 tabular-nums">{formatPrice(order.total_amount)}</span>
        </div>
      </Card>
    </article>
  );
}
