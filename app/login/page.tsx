import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your RevoShop account.",
};

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <LoginForm />
    </PublicOnlyRoute>
  );
}
