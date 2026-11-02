"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import { FormError } from "@/components/FormField";
import { ShieldIcon, TruckIcon, UserIcon } from "@/components/Icons";
import ProductImage from "@/components/ProductImage";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import { buttonStyles, cn, formatPrice } from "@/lib/utils";

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
    return <p role="status" className="text-sm text-slate-500">Loading your cart…</p>;
  }

  // Direct visits must be blocked too; admins manage the shop, they don't buy.
  if (currentUser?.role === "admin") {
    return (
      <Card className="mx-auto max-w-lg space-y-3 py-10 text-center" data-testid="checkout-admin-blocked">
        <h1 className="text-xl font-semibold">Admins cannot check out</h1>
        <p className="text-sm text-slate-500">Log in as a customer to place an order.</p>
        <Link href="/dashboard" className="inline-block font-semibold text-brand-600 hover:underline">
          Go to dashboard
        </Link>
      </Card>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <Card className="mx-auto max-w-lg space-y-3 py-10 text-center">
        <h1 className="text-xl font-semibold">Nothing to check out</h1>
        <p className="text-sm text-slate-500">Your cart is empty.</p>
        <Link href="/products" className="inline-block font-semibold text-brand-600 hover:underline">
          Browse products
        </Link>
      </Card>
    );
  }

  return (
    <section aria-labelledby="checkout-heading" className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-3">
        <ol aria-label="Checkout progress" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <li className="text-emerald-700">1. Cart</li>
          <li aria-hidden="true" className="h-px w-6 bg-slate-300" />
          <li className="text-brand-700" aria-current="step">
            2. Checkout
          </li>
          <li aria-hidden="true" className="h-px w-6 bg-slate-300" />
          <li>3. Done</li>
        </ol>
        <h1 id="checkout-heading" className="text-3xl font-bold text-slate-900">
          Checkout
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-6">
          <Card className="space-y-3 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <UserIcon className="text-brand-600" /> Customer
            </h2>
            <p className="text-sm text-slate-600">
              Ordering as <span className="font-semibold text-slate-900">{currentUser?.username}</span>{" "}
              ({currentUser?.email})
            </p>
          </Card>

          <Card className="space-y-3 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <TruckIcon className="text-brand-600" /> Delivery
            </h2>
            <p className="text-sm text-slate-600">
              Standard delivery, 2 to 4 business days.{" "}
              <span className="font-semibold text-emerald-700">Free shipping</span> applied to this order.
            </p>
          </Card>
        </div>

        <Card as="aside" className="space-y-4 p-5 lg:sticky lg:top-36">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <ProductImage
                  product={product}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-slate-900">{product.name}</span>
                  <span className="text-slate-500">Qty {quantity}</span>
                </span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {formatPrice(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-slate-200 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Shipping</dt>
              <dd className="font-semibold text-emerald-700">Free</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="font-semibold text-slate-900">
                Total ({itemCount} item{itemCount === 1 ? "" : "s"})
              </dt>
              <dd className="font-display text-2xl font-bold tabular-nums text-slate-900" data-testid="checkout-total">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
          <FormError message={error} />
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || items.length === 0}
            className={cn(buttonStyles.primary, "w-full")}
          >
            {submitting ? "Placing order…" : "Confirm order"}
          </button>
          <Link href="/cart" className={cn(buttonStyles.secondary, "w-full")}>
            Back to cart
          </Link>
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldIcon width={14} height={14} /> Your order is protected by secure checkout
          </p>
        </Card>
      </div>
    </section>
  );
}
