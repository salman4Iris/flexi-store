"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; email: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  ready: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_EVENT = "flexi-auth-change";

type SessionState = {
  user: User;
  token: string | null;
};

const EMPTY_SESSION: SessionState = { user: null, token: null };

let cachedSession: SessionState = EMPTY_SESSION;
let cachedToken: string | null = null;
let cachedRawUser: string | null = null;

const getSessionFromStorage = (token: string | null, rawUser: string | null): SessionState => {
  if (token === cachedToken && rawUser === cachedRawUser) {
    return cachedSession;
  }

  try {
    const parsedUser = rawUser ? (JSON.parse(rawUser) as Exclude<User, null>) : null;
    const nextSession: SessionState = {
      token,
      user: parsedUser,
    };

    cachedToken = token;
    cachedRawUser = rawUser;
    cachedSession = nextSession;

    return nextSession;
  } catch {
    cachedToken = null;
    cachedRawUser = null;
    cachedSession = EMPTY_SESSION;
    return EMPTY_SESSION;
  }
};

const getStoredSession = (): SessionState => {
  if (typeof window === "undefined") {
    return EMPTY_SESSION;
  }

  try {
    const token = localStorage.getItem("auth_token");
    const rawUser = localStorage.getItem("auth_user");

    return getSessionFromStorage(token, rawUser);
  } catch {
    cachedToken = null;
    cachedRawUser = null;
    cachedSession = EMPTY_SESSION;
    return EMPTY_SESSION;
  }
};

const getSessionServerSnapshot = (): SessionState => {
  return EMPTY_SESSION;
};

const subscribeSession = (callback: () => void): (() => void) => {
  window.addEventListener(AUTH_EVENT, callback);

  return (): void => {
    window.removeEventListener(AUTH_EVENT, callback);
  };
};

const dispatchSessionChange = (): void => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const AuthProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const session = useSyncExternalStore(
    subscribeSession,
    getStoredSession,
    getSessionServerSnapshot
  );
  const router = useRouter();

  const login = (t: string, u: User): void => {
    try {
      localStorage.setItem("auth_token", t);
      localStorage.setItem("auth_user", JSON.stringify(u));
    } catch {
      // Silently fail for localStorage errors
    }
    dispatchSessionChange();
  };

  const logout = (): void => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch {
      // Silently fail for localStorage errors
    }
    dispatchSessionChange();
    router.push("/");
  };

  const value: AuthContextType = {
    user: session.user,
    token: session.token,
    login,
    logout,
    ready: true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
