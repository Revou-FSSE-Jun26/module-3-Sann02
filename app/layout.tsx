import type { Metadata } from "next";
import { Nunito_Sans, Rubik } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";

// Self-hosted at build time by next/font (no runtime request to Google).
const heading = Rubik({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = Nunito_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

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
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 font-sans text-slate-900">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
