"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import { ArrowRightIcon, CartIcon, ShieldIcon } from "@/components/Icons";
import QuantityCounter from "@/components/QuantityCounter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { getProductImage } from "@/lib/productImages";
import { buttonStyles, cn, formatPrice } from "@/lib/utils";

/** /cart: one row per item with quantity, subtotal and a remove button; checkout is disabled when empty. */
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
    return <p role="status" className="text-sm text-slate-500">Loading your cart…</p>;
  }

  return (
    <section aria-labelledby="cart-heading" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 id="cart-heading" className="text-3xl font-bold text-slate-900">
            Your cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEmpty ? "Nothing here yet." : `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout.`}
          </p>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-semibold text-rose-600 transition-colors duration-200 hover:text-rose-700"
          >
            Clear cart
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        {isEmpty ? (
          <Card className="flex flex-col items-center gap-3 py-14 text-center" data-testid="cart-empty">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <CartIcon width={28} height={28} />
            </span>
            <p className="font-display text-xl font-semibold text-slate-900">Your cart is empty</p>
            <p className="max-w-sm text-sm text-slate-500">Browse the catalog and add something you like.</p>
            <Link href="/products" className={cn(buttonStyles.primary, "mt-2")}>
              Browse products
            </Link>
          </Card>
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Product</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Price</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Quantity</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Subtotal</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(({ product, quantity }) => (
                  <tr key={product.id} data-testid="cart-row">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={getProductImage(product)}
                          alt=""
                          width={56}
                          height={56}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                        />
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
                    <td className="px-4 py-4 text-right font-semibold tabular-nums text-slate-900">
                      {formatPrice(product.price * quantity)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(product.id, product.name)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors duration-200 hover:bg-rose-50"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        <Card as="aside" className="space-y-4 p-5 lg:sticky lg:top-36">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Items</dt>
              <dd className="font-semibold tabular-nums text-slate-900" data-testid="cart-item-count">
                {itemCount}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Shipping</dt>
              <dd className="font-semibold text-emerald-700">Free</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-slate-200 pt-3">
              <dt className="font-semibold text-slate-900">Total</dt>
              <dd className="font-display text-2xl font-bold tabular-nums text-slate-900" data-testid="cart-total">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            disabled={isEmpty || isAdmin}
            className={cn(buttonStyles.primary, "w-full")}
          >
            Proceed to checkout
            {!isEmpty && !isAdmin && <ArrowRightIcon width={18} height={18} />}
          </button>
          {isAdmin ? (
            <p className="text-center text-xs text-slate-500">Admin accounts cannot place orders.</p>
          ) : isEmpty ? (
            <p className="text-center text-xs text-slate-500">Add an item to enable checkout.</p>
          ) : (
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldIcon width={14} height={14} /> Secure checkout
            </p>
          )}
        </Card>
      </div>
    </section>
  );
}
