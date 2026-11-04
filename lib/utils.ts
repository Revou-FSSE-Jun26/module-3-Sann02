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
  "in-stock": "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  "low-stock": "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-600/20",
  "out-of-stock": "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20",
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
    "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold",
    "transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
    inStock
      ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800"
      : "cursor-not-allowed bg-slate-100 text-slate-500",
  );
}

/** Shared button looks so pages don't re-invent them. */
export const buttonStyles = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 active:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-50",
  accent:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition-colors duration-200 hover:bg-accent-400",
} as const;

const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-600/20",
  paid: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/20",
  shipped: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
};

function isKnownOrderStatus(status: string): status is OrderStatus {
  return status in ORDER_STATUS_CLASSES;
}

export function getOrderStatusClasses(status: string): string {
  return cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
    isKnownOrderStatus(status)
      ? ORDER_STATUS_CLASSES[status]
      : "bg-slate-100 text-slate-700",
  );
}
