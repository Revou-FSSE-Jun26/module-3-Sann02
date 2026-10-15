"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import { FormError } from "@/components/FormField";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import { formatPrice } from "@/lib/utils";

/**
 * /checkout: order summary + "Confirm order" -> POST /orders (user from the JWT).
 * On 201 the cart is cleared and the customer lands on /orders.
 */
export default function CheckoutForm() {
  const { currentUser, token, logout } = useAuth();
  const { items, itemCount, total, isReady, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!token || items.length === 0) return;
    setError("");
    setSubmitting(true);
    try {
      const order = await createOrder(
        items.map(({ product, quantity }) => ({ product_id: product.id, quantity })),
        token,
      );
      clearCart();
      toast.success(`Order #${order.id} confirmed. Thank you!`);
      router.push("/orders");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Token expired: the session is no longer valid.
        logout();
        toast.error("Your session expired. Please log in again.");
        router.replace("/login");
        return;
      }
      const message = getErrorMessage(err, "Checkout failed. Please try again.");
      setError(message);
      toast.error(message);
      setSubmitting(false);
    }
  }

  if (!isReady) {
    return <p role="status" className="text-sm text-gray-500">Loading your cart…</p>;
  }

  if (items.length === 0 && !submitting) {
    return (
      <Card className="mx-auto max-w-lg space-y-3 py-10 text-center">
        <h1 className="text-xl font-semibold">Nothing to check out</h1>
        <p className="text-sm text-gray-500">Your cart is empty.</p>
        <Link href="/products" className="inline-block font-semibold text-blue-600 hover:underline">
          Browse products
        </Link>
      </Card>
    );
  }

  return (
    <section aria-labelledby="checkout-heading" className="mx-auto max-w-2xl space-y-4">
      <h1 id="checkout-heading" className="text-2xl font-bold">
        Checkout
      </h1>
      <Card className="space-y-4">
        <div>
          <h2 className="font-semibold">Order summary</h2>
          <p className="text-sm text-gray-500">
            Ordering as <span className="font-medium text-gray-700">{currentUser?.username}</span> ({currentUser?.email})
          </p>
        </div>
        <ul className="divide-y divide-gray-100 text-sm">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between gap-3 py-2">
              <span>
                {product.name} <span className="text-gray-500">&times; {quantity}</span>
              </span>
              <span className="font-medium tabular-nums">{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-gray-200 pt-3">
          <span className="font-semibold">
            Total ({itemCount} item{itemCount === 1 ? "" : "s"})
          </span>
          <span className="text-lg font-bold text-blue-700 tabular-nums" data-testid="checkout-total">
            {formatPrice(total)}
          </span>
        </div>
        <FormError message={error} />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href="/cart"
            className="rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to cart
          </Link>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || items.length === 0}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Confirm order"}
          </button>
        </div>
      </Card>
    </section>
  );
}
