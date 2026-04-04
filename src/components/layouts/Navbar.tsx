"use client";

import { useState, useMemo, useCallback, type FormEvent } from "react";
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
  User,
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import SearchBar from "@/components/layouts/SearchBar";
import { useIsDesktop } from "@/hooks/useIsDesktop";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Account", href: "/account" },
];

const Navbar = (): React.ReactElement => {
  const { toggle, theme } = useTheme();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const isDesktop = useIsDesktop();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.qty || 0), 0),
    [items]
  );

  const handleLogout = useCallback((): void => {
    logout();
    setIsMenuOpen(false);
  }, [logout]);

  const toggleMenu = useCallback((): void => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback((): void => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-(--color-bg)/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-4">
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
              className="text-2xl font-extrabold text-(--color-text) hover:opacity-90 transition-opacity"
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
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors no-underline whitespace-nowrap"
                >
                  {item.label === "Account" && <User className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Search */}
          {isDesktop && <SearchBar onSearchSubmit={closeMenu} />}

          {/* User & Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop User Menu */}
            {isDesktop && (
              <div>
                {user ? (
                  <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                    <span className="text-sm font-medium text-(--color-text)">
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
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-(--color-primary) rounded-full">
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
          >
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBar onSearchSubmit={closeMenu} />
            </div>

            {/* Mobile Menu Items */}
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 py-2 px-2 rounded-md text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
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
                  <div className="py-2 px-2 text-sm font-medium text-(--color-text)">
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
      </div>
    </header>
  );
};

export default Navbar;
