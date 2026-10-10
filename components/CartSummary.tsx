import Card from "@/components/Card";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  items: CartItem[];
  currency?: string;
  onRemove?: (productId: number) => void;
  onClear?: () => void;
}

/** Everything shown here is derived from `items`; nothing is stored separately. */
export default function CartSummary({ items, currency = "Rp", onRemove, onClear }: CartSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Card as="aside" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cart</h2>
        {items.length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty. Add a product to get started.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center justify-between gap-2 py-2 text-sm">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-gray-500">
                  {quantity} &times; {formatPrice(product.price, currency)}
                </p>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(product.id)}
                  className="text-xs font-medium text-gray-500 hover:text-red-600"
                  aria-label={`Remove ${product.name} from cart`}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <dl className="space-y-1 border-t border-gray-200 pt-3 text-sm" aria-live="polite">
        <div className="flex justify-between">
          <dt className="text-gray-600">Items in cart</dt>
          <dd className="font-semibold tabular-nums">{itemCount}</dd>
        </div>
        <div className="flex justify-between text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-bold text-blue-700 tabular-nums">{formatPrice(total, currency)}</dd>
        </div>
      </dl>
    </Card>
  );
}
