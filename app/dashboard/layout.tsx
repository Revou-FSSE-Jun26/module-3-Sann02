import DashboardNav from "@/components/DashboardNav";

/** Shared shell for /dashboard, /dashboard/categories and /dashboard/orders. */
export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="space-y-6">
      <DashboardNav />
      {children}
    </div>
  );
}
