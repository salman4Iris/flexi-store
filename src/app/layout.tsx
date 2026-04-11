import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import { NextAuthSessionProvider } from "@/providers/NextAuthSessionProvider";
import { CartProvider } from "@/store/cart";
import Navbar from "@/components/layouts/Navbar";
import FooterWrapper from "@/components/layouts/FooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexiStore - Your Online Shopping Destination",
  description:
    "Discover a wide range of products at unbeatable prices. Shop now and experience the best in online shopping with FlexiStore.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps): React.ReactElement => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <NextAuthSessionProvider>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <Navbar />
                <div className="pt-20 max-w-7xl mx-auto px-4 py-6">{children}</div>
                <FooterWrapper />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
