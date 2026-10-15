import type { Metadata } from "next";
import AdminOrders from "@/components/AdminOrders";
import AdminRoute from "@/components/AdminRoute";

export const metadata: Metadata = {
  title: "All Orders",
  description: "Read-only overview of every RevoShop order.",
};

export default function DashboardOrdersPage() {
  return (
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  );
}
