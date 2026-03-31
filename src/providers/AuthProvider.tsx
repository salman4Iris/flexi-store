"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
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

type SessionState = {
  user: User;
  token: string | null;
};

const getStoredSession = (): SessionState => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  try {
    const token = localStorage.getItem("auth_token");
    const rawUser = localStorage.getItem("auth_user");

    return {
      token,
      user: rawUser ? (JSON.parse(rawUser) as Exclude<User, null>) : null,
    };
  } catch {
    return { user: null, token: null };
  }
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const AuthProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [session, setSession] = useState<SessionState | null>(null);
  const router = useRouter();

  const storedSession = useMemo<SessionState>(() => getStoredSession(), []);
  const currentSession = session ?? storedSession;

  const login = (t: string, u: User): void => {
    setSession({ token: t, user: u });
    try {
      localStorage.setItem("auth_token", t);
      localStorage.setItem("auth_user", JSON.stringify(u));
    } catch {
      // Silently fail for localStorage errors
    }
  };

  const logout = (): void => {
    setSession({ token: null, user: null });
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch {
      // Silently fail for localStorage errors
    }
    router.push("/");
  };

  const value: AuthContextType = {
    user: currentSession.user,
    token: currentSession.token,
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
