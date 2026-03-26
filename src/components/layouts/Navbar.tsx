"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import Container from "@/components/layout/Container";
import { useCart } from "@/store/cart";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Account", href: "/account" },
];

export default function Navbar() {
  const { toggle, theme } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { items } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cartCount = items.reduce((s, i) => s + (i.qty || 0), 0);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(q.trim());
    if (encoded) router.push(`/products?search=${encoded}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {!isDesktop && (
              <button
                aria-label="Open menu"
                aria-controls="primary-navigation"
                aria-expanded={open}
                onClick={() => setOpen((s) => !s)}
                className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <Link href="/" className="text-2xl font-extrabold text-[var(--color-primary)] hover:opacity-90 transition-opacity">
              Flexi-Store
            </Link>
          </div>

          <nav
            id="primary-navigation"
            className={isDesktop ? "flex items-center gap-6" : "hidden lg:flex lg:items-center lg:gap-6"}
            role="navigation"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((it) => (
              <Link key={it.href} href={it.href} className="text-sm text-[var(--color-text)] px-3 py-2 rounded hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors">
                {it.label}
              </Link>
            ))}

            {/* Desktop search */}
            {isDesktop && (
              <form onSubmit={onSearch} className="ml-4">
                <label htmlFor="nav-search" className="sr-only">Search products</label>
                <input
                  id="nav-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-64 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[var(--color-text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </form>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{user.email}</span>
                <button onClick={logout} className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50 transition">Logout</button>
              </div>
            ) : (
              <Link href="/auth/login" className="text-sm px-3 py-2 rounded hover:bg-gray-50 font-medium">Login</Link>
            )}

            <div className="flex items-center gap-3">
              <Link href="/cart" className="relative inline-flex items-center p-2 rounded hover:bg-gray-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-[var(--color-primary)] rounded-full shadow">{cartCount}</span>
                )}
              </Link>

              <button onClick={toggle} aria-label="Toggle theme" title="Toggle theme" className="ml-2 p-2 rounded-md border text-sm hover:bg-gray-50 transition flex items-center">
                {theme === "luxury" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--color-text)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M17.293 13.293A8 8 0 016.707 2.707 8 8 0 1017.293 13.293z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--color-text)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M10 3.22l.61 1.86a1 1 0 00.95.69h1.96l-1.58 1.15a1 1 0 00-.36 1.24l.61 1.86-1.58-1.15a1 1 0 00-1.24.36L10 13.78l-.61-1.86a1 1 0 00-1.24-.36L6.57 12.77l.61-1.86a1 1 0 00-.36-1.24L4.64 8.52h1.96a1 1 0 00.95-.69L8.16 5.97 9.74 7.12a1 1 0 001.24-.36L10 3.22z" />
                  </svg>
                )}
                <span className="sr-only">Toggle theme</span>
              </button>
            </div>
          </nav>

          <div className="lg:hidden">
            <Link href="/cart" className="text-sm">Cart</Link>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {!isDesktop && (
        <div className={`lg:hidden bg-[var(--color-bg)] border-t ${open ? "block" : "hidden"}`}>
          <div className="px-4 py-3 space-y-2">
            {NAV_ITEMS.map((it) => (
              <Link key={it.href} href={it.href} className="block py-2 px-2 rounded-md hover:bg-gray-100" onClick={() => setOpen(false)}>
                {it.label}
              </Link>
            ))}

            <div className="pt-2 border-t">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{user.email}</span>
                  <button onClick={() => { logout(); setOpen(false); }} className="px-3 py-1 rounded border text-sm">Logout</button>
                </div>
              ) : (
                <Link href="/auth/login" className="block py-2" onClick={() => setOpen(false)}>Login</Link>
              )}
              <button onClick={() => { toggle(); setOpen(false); }} aria-label="Toggle theme" className="mt-2 px-3 py-2 rounded bg-[var(--color-primary)] text-white w-full">Toggle Theme</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
