import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RevoShop",
    // Child pages set only their own part, e.g. "Products" -> "Products | RevoShop".
    template: "%s | RevoShop",
  },
  description: "RevoShop: browse products, categories and orders from the RevoShop API.",
};

/**
 * Root layout: Header and Footer wrap every route. Providers (AuthProvider +
 * CartProvider + Toaster) sit above them so useAuth()/useCart() work anywhere.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-gray-50 font-sans text-gray-900">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
