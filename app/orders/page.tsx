import type { Metadata } from "next";
import CustomerOrders from "@/components/CustomerOrders";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Your RevoShop orders.",
};

/** Customers see only their own orders; the all-users overview is /dashboard/orders. */
export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <CustomerOrders />
    </ProtectedRoute>
  );
}
