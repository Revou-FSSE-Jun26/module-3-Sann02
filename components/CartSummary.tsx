import Link from "next/link";
import Card from "@/components/Card";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  items: CartItem[];
  currency?: string;
  onRemove?: (productId: number) => void;
  onClear?: () => void;
  /** Show a "View cart" link to /cart under the total. */
  showCartLink?: boolean;
}

/** Everything shown here is derived from `items`; nothing is stored separately. */
export default function CartSummary({
  items,
  currency = "Rp",
  onRemove,
  onClear,
  showCartLink = false,
}: CartSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Card as="aside" className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Cart</h2>
        {items.length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-rose-600 transition-colors duration-200 hover:text-rose-700"
          >
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Your cart is empty. Add a product to get started.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center justify-between gap-2 py-2 text-sm">
              <div>
                <p className="font-medium text-slate-900">{product.name}</p>
                <p className="text-slate-500">
                  {quantity} &times; {formatPrice(product.price, currency)}
                </p>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(product.id)}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Remove ${product.name} from cart`}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <dl className="space-y-1 border-t border-slate-200 pt-3 text-sm" aria-live="polite">
        <div className="flex justify-between">
          <dt className="text-slate-600">Items in cart</dt>
          <dd className="font-semibold tabular-nums">{itemCount}</dd>
        </div>
        <div className="flex justify-between text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-display text-lg font-bold tabular-nums text-slate-900">{formatPrice(total, currency)}</dd>
        </div>
      </dl>
      {showCartLink && (
        <Link
          href="/cart"
          className="flex min-h-11 items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700"
        >
          View cart
        </Link>
      )}
    </Card>
  );
}
