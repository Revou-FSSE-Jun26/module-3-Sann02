"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

/** Client-side app state: auth + cart (both persisted to localStorage) and toasts. */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
      </CartProvider>
    </AuthProvider>
  );
}
