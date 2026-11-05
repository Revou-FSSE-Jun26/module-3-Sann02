import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomerRoute from "@/components/CustomerRoute";
import OrderDetail from "@/components/OrderDetail";

function parseId(raw: string): number | null {
  return /^\d+$/.test(raw) && Number(raw) > 0 ? Number(raw) : null;
}

export async function generateMetadata({ params }: PageProps<"/orders/[id]">): Promise<Metadata> {
  const { id } = await params;
  // No fetch here: order data is private, so the title only uses the id.
  return { title: `Order #${id}` };
}

export default async function OrderDetailPage({ params }: PageProps<"/orders/[id]">) {
  const id = parseId((await params).id);
  if (!id) notFound();
  return (
    <CustomerRoute>
      <OrderDetail orderId={id} />
    </CustomerRoute>
  );
}
