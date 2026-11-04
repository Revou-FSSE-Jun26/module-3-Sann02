"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BagIcon, BellIcon, LogoutIcon } from "@/components/Icons";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const PROMO_MESSAGES = [
  "Free shipping on every order across Indonesia",
  "Flash sale: up to 50% off electronics, today only",
  "Secure checkout. Your data stays protected.",
  "New arrivals every week. See what's fresh.",
];

/**
 * Sticky premium store header.
 * Features: animated promo ribbon, glassmorphism nav bar, glow logo,
 * gradient user avatar, animated cart badge.
 */
export default function Header() {
  const { currentUser, isLoggedIn, isReady, logout } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [promoIdx, setPromoIdx] = useState(0);
  const [promoVisible, setPromoVisible] = useState(true);
  const [promoPaused, setPromoPaused] = useState(false);

  /* Deepen the header shadow after 10 px of scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Rotate promo messages every 4 s; pause while hovered or focused (WCAG 2.2.2). */
  useEffect(() => {
    if (promoPaused) return;
    const id = setInterval(() => {
      setPromoVisible(false);
      setTimeout(() => {
        setPromoIdx((i) => (i + 1) % PROMO_MESSAGES.length);
        setPromoVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(id);
  }, [promoPaused]);

  function handleLogout() {
    logout();
    clearCart();
    toast.success("You have been logged out.");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40">
      {/* ── Promo strip ── */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPromoPaused(true)}
        onMouseLeave={() => setPromoPaused(false)}
        onFocus={() => setPromoPaused(true)}
        onBlur={() => setPromoPaused(false)}
        style={{
          background: "linear-gradient(90deg, #0f1a47 0%, #1c38b8 40%, #2448e0 60%, #0f1a47 100%)",
        }}
      >
        {/* Animated shimmer layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.15) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />
        <p
          className={cn(
            "relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-xs font-semibold text-white transition-opacity duration-300 sm:text-sm",
            promoVisible ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          {PROMO_MESSAGES[promoIdx]}
        </p>
      </div>

      {/* ── Main nav bar ── */}
      <div
        className={cn(
          "border-b border-white/10 bg-white/90 backdrop-blur-xl transition-shadow duration-300",
          scrolled && "shadow-[0_4px_24px_-4px_rgb(15_23_42/0.12)]",
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          {/* Logo */}
          <Link href="/" className="group inline-flex items-center gap-3" aria-label="RevoShop home">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_-4px_rgb(56_102_245/0.6)]"
              style={{ background: "linear-gradient(135deg, #2448e0 0%, #3866f5 60%, #5c8dfc 100%)" }}
            >
              <BagIcon size={20} className="text-white" />
              {/* Pulse ring */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl opacity-0 ring-2 ring-brand-400 transition-opacity duration-300 group-hover:animate-[pulse-ring_1.5s_ease-out_infinite] group-hover:opacity-100"
              />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              Revo<span className="text-brand-600">Shop</span>
            </span>
          </Link>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <NavBar />

            {/* Auth section */}
            <div
              className="flex min-h-10 items-center gap-2 text-sm lg:border-l lg:border-slate-200 lg:pl-4"
              data-testid="auth-status"
            >
              {!isReady ? null : isLoggedIn && currentUser ? (
                <>
                  <div className="flex items-center gap-2.5">
                    {/* Gradient avatar */}
                    <span className="relative">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold uppercase text-white shadow-md"
                        style={{ background: "linear-gradient(135deg, #2448e0, #5c8dfc)" }}
                      >
                        {currentUser.username.charAt(0)}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white"
                      />
                    </span>
                    <span className="hidden sm:block">
                      <span className="block text-xs text-slate-500 leading-none">Welcome back</span>
                      <span className="block font-semibold text-slate-900 leading-snug" data-testid="header-username">
                        {currentUser.username}
                      </span>
                    </span>
                  </div>

                  {currentUser.role === "admin" && (
                    <span className="rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                      Admin
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Logout"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <LogoutIcon size={15} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex min-h-9 items-center rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-shine inline-flex min-h-9 items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-[0_0_16px_-2px_rgb(56_102_245/0.5)] hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #2448e0, #3866f5)" }}
                  >
                    <BellIcon size={14} />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
