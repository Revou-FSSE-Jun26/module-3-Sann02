"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import { FormError } from "@/components/FormField";
import { CheckIcon, PackageIcon, ShieldIcon, TruckIcon, UserIcon } from "@/components/Icons";
import ProductImage from "@/components/ProductImage";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import { buttonStyles, cn, formatPrice } from "@/lib/utils";

/**
 * /checkout: order summary + "Confirm order" -> POST /orders.
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm font-medium text-slate-500">Loading your cart…</p>
        </div>
      </div>
    );
  }

  if (currentUser?.role === "admin") {
    return (
      <Card className="mx-auto max-w-lg space-y-3 py-12 text-center" data-testid="checkout-admin-blocked">
        <h1 className="font-display text-xl font-bold">Admins cannot check out</h1>
        <p className="text-sm text-slate-500">Log in as a customer to place an order.</p>
        <Link href="/dashboard" className="inline-block font-bold text-brand-600 hover:underline">
          Go to dashboard
        </Link>
      </Card>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <Card className="mx-auto max-w-lg space-y-3 py-12 text-center">
        <h1 className="font-display text-xl font-bold">Nothing to check out</h1>
        <p className="text-sm text-slate-500">Your cart is empty.</p>
        <Link href="/products" className="inline-block font-bold text-brand-600 hover:underline">
          Browse products
        </Link>
      </Card>
    );
  }

  return (
    <section aria-labelledby="checkout-heading" className="mx-auto max-w-5xl space-y-8">
      {/* Progress stepper */}
      <div>
        <ol aria-label="Checkout progress" className="flex items-center gap-0">
          {["Cart", "Checkout", "Done"].map((step, i) => {
            const done = i === 0;
            const current = i === 1;
            return (
              <li key={step} className="flex items-center">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      done
                        ? "bg-emerald-500 text-white"
                        : current
                          ? "text-white"
                          : "bg-slate-200 text-slate-500",
                    )}
                    style={current ? { background: "linear-gradient(135deg, #2448e0, #3866f5)" } : undefined}
                  >
                    {done ? <CheckIcon size={14} aria-hidden="true" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      done ? "text-emerald-700" : current ? "text-brand-700" : "text-slate-400",
                    )}
                  >
                    {step}
                  </span>
                </span>
                {i < 2 && <span aria-hidden="true" className="mx-3 h-px w-8 bg-slate-300" />}
              </li>
            );
          })}
        </ol>
        <h1
          id="checkout-heading"
          className="mt-4 font-display text-3xl font-extrabold text-slate-900"
        >
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-4">
          {/* Customer info */}
          <Card className="overflow-hidden p-0">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <UserIcon size={16} aria-hidden="true" />
              </span>
              <h2 className="font-display text-base font-bold text-slate-900">Customer</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-slate-600">
                Ordering as{" "}
                <span className="font-bold text-slate-900">{currentUser?.username}</span>{" "}
                <span className="text-slate-400">({currentUser?.email})</span>
              </p>
            </div>
          </Card>

          {/* Delivery info */}
          <Card className="overflow-hidden p-0">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <TruckIcon size={16} aria-hidden="true" />
              </span>
              <h2 className="font-display text-base font-bold text-slate-900">Delivery</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-slate-600">
                Standard delivery, 2 to 4 business days.{" "}
                <span className="font-bold text-emerald-600">Free shipping</span> applied to this order.
              </p>
            </div>
          </Card>

          {/* Security note */}
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
            <ShieldIcon size={18} className="shrink-0 text-emerald-600" aria-hidden="true" />
            <p className="text-sm font-medium text-emerald-700">
              Your order is protected by secure, encrypted checkout.
            </p>
          </div>
        </div>

        {/* Order summary sidebar */}
        <Card as="aside" className="overflow-hidden p-0 lg:sticky lg:top-36">
          {/* Header */}
          <div
            className="px-5 py-4 text-white"
            style={{ background: "linear-gradient(135deg, #1c38b8, #2448e0)" }}
          >
            <div className="flex items-center gap-2">
              <PackageIcon size={16} aria-hidden="true" />
              <h2 className="font-display text-base font-bold">Order Summary</h2>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <ul className="divide-y divide-slate-100 text-sm">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-3 py-3">
                  <div className="overflow-hidden rounded-lg ring-1 ring-slate-200">
                    <ProductImage
                      product={product}
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 object-cover"
                    />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-slate-900">{product.name}</span>
                    <span className="text-slate-400">Qty {quantity}</span>
                  </span>
                  <span className="font-bold tabular-nums text-slate-900">
                    {formatPrice(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-slate-200 pt-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Shipping</dt>
                <dd className="font-bold text-emerald-600">Free</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="font-bold text-slate-900">
                  Total ({itemCount} item{itemCount === 1 ? "" : "s"})
                </dt>
                <dd
                  className="font-display text-2xl font-extrabold tabular-nums text-brand-700"
                  data-testid="checkout-total"
                >
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <FormError message={error} />

            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting || items.length === 0}
              className="btn-shine w-full min-h-11 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100"
              style={{ background: submitting || items.length === 0 ? undefined : "linear-gradient(135deg, #2448e0, #3866f5)" }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Placing order…
                </span>
              ) : (
                "Confirm order"
              )}
            </button>

            <Link
              href="/cart"
              className={cn(buttonStyles.secondary, "w-full")}
            >
              ← Back to cart
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
