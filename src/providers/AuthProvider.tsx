"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const AuthProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const t = localStorage.getItem("auth_token");
      const u = localStorage.getItem("auth_user");
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch {
      // Silently fail for localStorage errors
    }
    setIsHydrated(true);
  }, []);

  const login = (t: string, u: User): void => {
    setToken(t);
    setUser(u);
    try {
      localStorage.setItem("auth_token", t);
      localStorage.setItem("auth_user", JSON.stringify(u));
    } catch {
      // Silently fail for localStorage errors
    }
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch {
      // Silently fail for localStorage errors
    }
    router.push("/");
  };

  const value: AuthContextType = { user, token, login, logout, ready: isHydrated };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
