"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

type RequireAuthProps = {
  children: React.ReactNode;
};

const RequireAuth = ({ children }: RequireAuthProps): React.ReactElement | null => {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      void router.push("/auth/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
