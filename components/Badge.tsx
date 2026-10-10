import type { StockStatus } from "@/lib/types";
import { getStockBadgeClasses, getStockLabel } from "@/lib/utils";

interface BadgeProps {
  variant: StockStatus;
}

/** Stock badge; the union-typed variant picks both the colour and the label. */
export default function Badge({ variant }: BadgeProps) {
  return <span className={getStockBadgeClasses(variant)}>{getStockLabel(variant)}</span>;
}
