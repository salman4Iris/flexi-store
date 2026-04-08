'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export const NextAuthSessionProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};
