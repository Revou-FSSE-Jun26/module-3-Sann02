import type { OrderStatus, StockStatus } from "@/lib/types";

/** Join class names, dropping falsy values (a tiny clsx). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** 850000 -> "Rp 850.000" */
export function formatPrice(value: number, currency = "Rp"): string {
  return `${currency} ${value.toLocaleString("id-ID")}`;
}

/** Fixed time zone so server and client always format the same way. */
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
}

/** At or below this quantity a product counts as low stock. */
export const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

const STOCK_LABELS: Record<StockStatus, string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "out-of-stock": "Out of stock",
};

const STOCK_BADGE_CLASSES: Record<StockStatus, string> = {
  "in-stock": "bg-green-100 text-green-800",
  "low-stock": "bg-amber-100 text-amber-800",
  "out-of-stock": "bg-red-100 text-red-800",
};

export function getStockLabel(status: StockStatus): string {
  return STOCK_LABELS[status];
}

export function getStockBadgeClasses(status: StockStatus): string {
  return cn(
    "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
    STOCK_BADGE_CLASSES[status],
  );
}

export function getButtonClasses(inStock: boolean): string {
  return cn(
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
    inStock
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "cursor-not-allowed bg-gray-200 text-gray-500",
  );
}

const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function isKnownOrderStatus(status: string): status is OrderStatus {
  return status in ORDER_STATUS_CLASSES;
}

export function getOrderStatusClasses(status: string): string {
  return cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
    isKnownOrderStatus(status)
      ? ORDER_STATUS_CLASSES[status]
      : "bg-gray-100 text-gray-700",
  );
}
