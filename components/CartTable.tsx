"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import { ArrowRightIcon, CartIcon, ShieldIcon, Trash2Icon } from "@/components/Icons";
import ProductImage from "@/components/ProductImage";
import QuantityCounter from "@/components/QuantityCounter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { buttonStyles, cn, formatPrice } from "@/lib/utils";

export default function CartTable() {
  const { isAdmin } = useAuth();
  const { items, itemCount, total, isReady, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  const isEmpty = items.length === 0;

  function handleRemove(productId: number, name: string) {
    removeItem(productId);
    toast.success(`${name} removed from your cart.`);
  }

  function handleClear() {
    clearCart();
    toast.success("Cart cleared.");
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

  return (
    <section aria-labelledby="cart-heading" className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 id="cart-heading" className="font-display text-3xl font-extrabold text-slate-900">
            Your cart
            <span
              aria-hidden="true"
              className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #2448e0, #3866f5)" }}
            >
              {itemCount}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEmpty ? "Nothing here yet." : `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout.`}
          </p>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-100 hover:border-rose-300"
          >
            <Trash2Icon size={14} aria-hidden="true" />
            Clear cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        {isEmpty ? (
          /* Empty state */
          <Card
            className="flex flex-col items-center gap-4 py-16 text-center"
            data-testid="cart-empty"
          >
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
              style={{ background: "linear-gradient(135deg, #eef4ff, #dae6ff)" }}
            >
              <CartIcon size={36} className="text-brand-500" />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-slate-900">Your cart is empty</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Browse the catalog and add something you love.
              </p>
            </div>
            <Link href="/products" className={cn(buttonStyles.primary, "btn-shine mt-2")}>
              <CartIcon size={16} aria-hidden="true" />
              Browse products
            </Link>
          </Card>
        ) : (
          /* Cart items table */
          <Card className="relative min-w-0 overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-sm" role="table">
              <thead>
                <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white text-left text-xs font-semibold text-slate-500">
                  <th scope="col" className="px-5 py-4">Product</th>
                  <th scope="col" className="px-4 py-4">Price</th>
                  <th scope="col" className="px-4 py-4">Quantity</th>
                  <th scope="col" className="px-4 py-4 text-right">Subtotal</th>
                  <th scope="col" className="px-4 py-4 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(({ product, quantity }) => (
                  <tr
                    key={product.id}
                    data-testid="cart-row"
                    className="group transition-colors duration-150 hover:bg-brand-50/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="overflow-hidden rounded-xl ring-1 ring-slate-200 shadow-sm">
                          <ProductImage
                            product={product}
                            width={56}
                            height={56}
                            className="h-14 w-14 shrink-0 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold text-slate-900 transition-colors duration-200 hover:text-brand-700"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4 tabular-nums text-slate-600">{formatPrice(product.price)}</td>
                    <td className="px-4 py-4">
                      <QuantityCounter
                        value={quantity}
                        max={product.stock_quantity}
                        onChange={(next) => updateQuantity(product.id, next)}
                        label={product.name}
                      />
                    </td>
                    <td className="px-4 py-4 text-right font-bold tabular-nums text-slate-900">
                      {formatPrice(product.price * quantity)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(product.id, product.name)}
                        aria-label={`Remove ${product.name} from cart`}
                        className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2Icon size={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Order summary sidebar */}
        <Card as="aside" className="overflow-hidden p-0 lg:sticky lg:top-36">
          {/* Gradient header */}
          <div
            className="px-5 py-4 text-white"
            style={{ background: "linear-gradient(135deg, #1c38b8, #2448e0)" }}
          >
            <h2 className="font-display text-lg font-bold">Order Summary</h2>
          </div>

          <div className="space-y-4 p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Items ({itemCount})</dt>
                <dd className="font-semibold tabular-nums text-slate-900" data-testid="cart-item-count">
                  {itemCount}
                </dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Shipping</dt>
                <dd className="font-bold text-emerald-600">Free</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-slate-200 pt-3">
                <dt className="font-bold text-slate-900 text-base">Total</dt>
                <dd
                  className="font-display text-2xl font-extrabold tabular-nums text-brand-700"
                  data-testid="cart-total"
                >
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              disabled={isEmpty || isAdmin}
              className={cn(
                "btn-shine w-full min-h-11 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100",
              )}
              style={{ background: isEmpty || isAdmin ? undefined : "linear-gradient(135deg, #2448e0, #3866f5)" }}
            >
              {!isEmpty && !isAdmin ? (
                <span className="flex items-center justify-center gap-2">
                  Proceed to checkout
                  <ArrowRightIcon size={16} />
                </span>
              ) : (
                "Proceed to checkout"
              )}
            </button>

            {isAdmin ? (
              <p className="text-center text-xs text-slate-500">Admin accounts cannot place orders.</p>
            ) : isEmpty ? (
              <p className="text-center text-xs text-slate-500">Add an item to enable checkout.</p>
            ) : (
              <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <ShieldIcon size={13} className="text-emerald-500" />
                Secure, encrypted checkout
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
