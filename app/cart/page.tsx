import type { Metadata } from "next";
import CartTable from "@/components/CartTable";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your RevoShop cart.",
};

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartTable />
    </ProtectedRoute>
  );
}
