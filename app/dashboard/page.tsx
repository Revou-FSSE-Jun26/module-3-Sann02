import type { Metadata } from "next";
import AdminRoute from "@/components/AdminRoute";
import DashboardProducts from "@/components/DashboardProducts";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage RevoShop products.",
};

export default function DashboardPage() {
  return (
    <AdminRoute>
      <DashboardProducts />
    </AdminRoute>
  );
}
