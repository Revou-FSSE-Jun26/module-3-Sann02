import type { Metadata } from "next";
import CustomerOrders from "@/components/CustomerOrders";
import CustomerRoute from "@/components/CustomerRoute";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Your RevoShop orders.",
};

/** Customers see only their own orders; the all-users overview is /dashboard/orders. */
export default function OrdersPage() {
  return (
    <CustomerRoute>
      <CustomerOrders />
    </CustomerRoute>
  );
}
