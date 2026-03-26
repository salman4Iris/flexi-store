import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: Props) {
  return (
    <main className={`max-w-7xl mx-auto px-4 py-6 ${className}`}>{children}</main>
  );
}
