import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm your RevoShop order.",
};

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutForm />
    </ProtectedRoute>
  );
}
