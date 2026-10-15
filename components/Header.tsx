"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

/**
 * Reacts to auth state: logged in -> "Hi, {username}" + Logout; logged out ->
 * Login / Register. The session is restored from localStorage by AuthProvider,
 * so the username survives a refresh.
 */
export default function Header() {
  const { currentUser, isLoggedIn, isReady, logout } = useAuth();
  const { clearCart } = useCart();
  const router = useRouter();

  function handleLogout() {
    logout();
    clearCart(); // the next person on this browser starts with an empty cart
    toast.success("You have been logged out.");
    router.push("/");
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          RevoShop
        </Link>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <NavBar />
          {/* Reserve the slot until the session is known to avoid a Login -> Hi flash. */}
          <div className="flex min-h-9 items-center gap-2 text-sm" data-testid="auth-status">
            {!isReady ? null : isLoggedIn && currentUser ? (
              <>
                <span className="text-gray-700">
                  Hi, <span className="font-semibold" data-testid="header-username">{currentUser.username}</span>
                </span>
                {currentUser.role === "admin" && (
                  <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
                    admin
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
