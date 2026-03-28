"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  Moon,
  Sun,
  LogOut,
  LogIn,
  Search,
  User,
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import Container from "@/components/layout/Container";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Account", href: "/account" },
];

export default function Navbar(): React.ReactElement {
  const { toggle, theme } = useTheme();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const handleResize = (): void => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    setIsHydrated(true);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cartItemCount = items.reduce((sum, item) => sum + (item.qty || 0), 0);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const encoded = encodeURIComponent(trimmedQuery);
      router.push(`/products?search=${encoded}`);
    }
  };

  const handleLogout = (): void => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-4" suppressHydrationWarning>
            {!isDesktop && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            )}
            <Link
              href="/"
              className="text-2xl font-extrabold text-[var(--color-text)] hover:opacity-90 transition-opacity"
            >
              Flexi-Store
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isDesktop && (
            <nav
              className="flex items-center gap-12"
              role="navigation"
              aria-label="Main navigation"
              suppressHydrationWarning
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-[var(--color-text)] hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors no-underline whitespace-nowrap"
                >
                  {item.label === "Account" && <User className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Search */}
          {isDesktop && (
            <form onSubmit={handleSearch} className="flex-1 max-w-xs" suppressHydrationWarning>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* User & Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop User Menu */}
            {isDesktop && (
              <div suppressHydrationWarning>
                {user ? (
                  <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {user.email}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Cart Icon */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Shopping cart"
                className="relative text-black dark:text-white"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-[var(--color-primary)] rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              {theme === "luxury" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {!isDesktop && isMenuOpen && (
          <nav
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3"
            role="navigation"
            aria-label="Mobile navigation"
            suppressHydrationWarning
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Mobile Menu Items */}
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 py-2 px-2 rounded-md text-sm font-medium text-[var(--color-text)] hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                onClick={closeMenu}
              >
                {item.label === "Account" && <User className="w-4 h-4" />}
                {item.label}
              </Link>
            ))}

            {/* Mobile User Menu */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
              {user ? (
                <>
                  <div className="py-2 px-2 text-sm font-medium text-[var(--color-text)]">
                    {user.email}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth/login" onClick={closeMenu} className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toggle();
                  closeMenu();
                }}
                className="w-full justify-start flex items-center gap-2"
              >
                {theme === "luxury" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                Toggle Theme
              </Button>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
