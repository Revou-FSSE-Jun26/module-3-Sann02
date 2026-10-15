import type { Metadata } from "next";
import AdminRoute from "@/components/AdminRoute";
import DashboardCategories from "@/components/DashboardCategories";

export const metadata: Metadata = {
  title: "Manage Categories",
  description: "Create, edit and delete RevoShop categories.",
};

export default function DashboardCategoriesPage() {
  return (
    <AdminRoute>
      <DashboardCategories />
    </AdminRoute>
  );
}
