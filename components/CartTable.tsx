"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import QuantityCounter from "@/components/QuantityCounter";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

/** /cart: one row per item with quantity, subtotal and a remove button; checkout is disabled when empty. */
export default function CartTable() {
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
    return <p role="status" className="text-sm text-gray-500">Loading your cart…</p>;
  }

  return (
    <section aria-labelledby="cart-heading" className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 id="cart-heading" className="text-2xl font-bold">
          Your cart
        </h1>
        {!isEmpty && (
          <button type="button" onClick={handleClear} className="text-sm font-medium text-red-600 hover:underline">
            Clear cart
          </button>
        )}
      </div>

      {isEmpty ? (
        <Card className="space-y-3 py-10 text-center" data-testid="cart-empty">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <p className="text-sm text-gray-500">Browse the catalog and add something you like.</p>
          <Link href="/products" className="inline-block font-semibold text-blue-600 hover:underline">
            Browse products
          </Link>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th scope="col" className="p-3 font-semibold">Product</th>
                <th scope="col" className="p-3 font-semibold">Price</th>
                <th scope="col" className="p-3 font-semibold">Quantity</th>
                <th scope="col" className="p-3 text-right font-semibold">Subtotal</th>
                <th scope="col" className="p-3 text-right font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ product, quantity }) => (
                <tr key={product.id} className="border-t border-gray-100" data-testid="cart-row">
                  <td className="p-3 font-medium">
                    <Link href={`/products/${product.id}`} className="hover:text-blue-600 hover:underline">
                      {product.name}
                    </Link>
                  </td>
                  <td className="p-3 tabular-nums">{formatPrice(product.price)}</td>
                  <td className="p-3">
                    <QuantityCounter
                      value={quantity}
                      max={product.stock_quantity}
                      onChange={(next) => updateQuantity(product.id, next)}
                      label={product.name}
                    />
                  </td>
                  <td className="p-3 text-right font-semibold tabular-nums">
                    {formatPrice(product.price * quantity)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id, product.name)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
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

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-gray-500">Items</dt>
            <dd className="text-lg font-semibold tabular-nums" data-testid="cart-item-count">{itemCount}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Total</dt>
            <dd className="text-lg font-bold text-blue-700 tabular-nums" data-testid="cart-total">
              {formatPrice(total)}
            </dd>
          </div>
        </dl>
        <div className="flex flex-col items-stretch gap-1 sm:items-end">
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            disabled={isEmpty}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
          >
            Proceed to checkout
          </button>
          {isEmpty && <p className="text-xs text-gray-500">Add an item to enable checkout.</p>}
        </div>
      </Card>
    </section>
  );
}
