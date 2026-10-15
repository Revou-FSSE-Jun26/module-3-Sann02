import type { Metadata } from "next";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a RevoShop customer account.",
};

export default function RegisterPage() {
  return (
    <PublicOnlyRoute>
      <RegisterForm />
    </PublicOnlyRoute>
  );
}
