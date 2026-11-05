"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@/lib/types";

/** localStorage keys. Only the public profile and the JWT are stored, never the password. */
export const USER_STORAGE_KEY = "user";
export const TOKEN_STORAGE_KEY = "token";

export interface AuthContextValue {
  currentUser: User | null;
  /** JWT from POST /auth/login; sent as a Bearer token on order requests. */
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  /**
   * False until localStorage has been read after mount. Route guards wait for
   * this so a refresh on /cart doesn't bounce a logged-in user to /login.
   */
  isReady: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/** Keep only the public fields, whatever extra keys the API sent. */
function toPublicUser(user: User): User {
  return { id: user.id, username: user.username, email: user.email, role: user.role };
}

/** Decode a JWT's `exp` claim and return true if it is in the past (or unreadable). */
function isJwtExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const { exp } = JSON.parse(atob(payload)) as { exp?: number };
    return typeof exp === "number" && exp * 1000 <= Date.now();
  } catch {
    return true; // unparseable token -> treat as invalid
  }
}

function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<User>;
    if (typeof parsed.id === "number" && typeof parsed.username === "string") {
      return toPublicUser(parsed as User);
    }
  } catch {
    // Corrupt value: fall through and clear it.
  }
  localStorage.removeItem(USER_STORAGE_KEY);
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Restore the session after a refresh. localStorage only exists in the
  // browser, so it is read here (after mount), never during render.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from localStorage after hydration */
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    // An expired token must not count as a logged-in session: drop it so the
    // user is sent to /login instead of hitting a dead-end "Token has expired".
    if (storedToken && !isJwtExpired(storedToken)) {
      setCurrentUser(readStoredUser());
      setToken(storedToken);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    setIsReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const login = useCallback((user: User, newToken: string) => {
    const publicUser = toPublicUser(user);
    setCurrentUser(publicUser); // live copy -> Header re-renders now
    setToken(newToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(publicUser)); // durable copy
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      token,
      isLoggedIn: currentUser !== null,
      isAdmin: currentUser?.role === "admin",
      isReady,
      login,
      logout,
    }),
    [currentUser, token, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
