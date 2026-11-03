"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BagIcon, LogoutIcon, TruckIcon } from "@/components/Icons";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

/**
 * Sticky store header. Reacts to auth state: logged in -> "Hi, {username}" +
 * Logout; logged out -> Login / Register. The session is restored from
 * localStorage by AuthProvider, so the username survives a refresh.
 */
export default function Header() {
  const { currentUser, isLoggedIn, isReady, logout } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();

  function handleLogout() {
    logout();
    clearCart(); // the next person on this browser starts with an empty cart
    toast.success("You have been logged out.");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Promo strip */}
      <div className="bg-brand-950 text-brand-50">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
          <TruckIcon width={16} height={16} />
          Free shipping on every order across Indonesia
        </p>
      </div>

      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="RevoShop home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm transition-colors duration-200 group-hover:bg-brand-700">
              <BagIcon />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              Revo<span className="text-brand-600">Shop</span>
            </span>
          </Link>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <NavBar />
            {/* Reserve the slot until the session is known to avoid a Login -> Hi flash. */}
            <div
              className="flex min-h-10 items-center gap-2 text-sm lg:border-l lg:border-slate-200 lg:pl-4"
              data-testid="auth-status"
            >
              {!isReady ? null : isLoggedIn && currentUser ? (
                <>
                  <span className="flex items-center gap-2 text-slate-700">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold uppercase text-brand-700"
                    >
                      {currentUser.username.charAt(0)}
                    </span>
                    <span>
                      Hi,{" "}
                      <span className="font-semibold text-slate-900" data-testid="header-username">
                        {currentUser.username}
                      </span>
                    </span>
                  </span>
                  {currentUser.role === "admin" && (
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                      admin
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-50"
                  >
                    <LogoutIcon width={16} height={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex min-h-10 items-center rounded-xl px-3 py-1.5 font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex min-h-10 items-center rounded-xl bg-brand-600 px-4 py-1.5 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700"
                  >
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
