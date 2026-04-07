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
  Zap,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
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

type CategoryItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Account", href: "/account" },
];

const PRODUCTS: CategoryItem[] = [
  { label: "All Products", href: "/products", icon: <ShoppingCart className="w-4 h-4" />, description: "Browse our entire collection" },
  { label: "New Arrivals", href: "/products?sort=newest", icon: <Sparkles className="w-4 h-4" />, description: "Latest products in stock" },
  { label: "Best Sellers", href: "/products?sort=popular", icon: <Zap className="w-4 h-4" />, description: "Most loved by customers" },
  { label: "On Sale", href: "/products?filter=sale", icon: <BookOpen className="w-4 h-4" />, description: "Discounted items" },
];

const CATEGORIES: CategoryItem[] = [
  { label: "Electronics", href: "/products?category=electronics", icon: <Zap className="w-4 h-4" /> },
  { label: "Fashion", href: "/products?category=fashion", icon: <Shirt className="w-4 h-4" /> },
  { label: "Home & Living", href: "/products?category=home", icon: <Home className="w-4 h-4" /> },
  { label: "Beauty", href: "/products?category=beauty", icon: <Sparkles className="w-4 h-4" /> },
  { label: "Sports", href: "/products?category=sports", icon: <Dumbbell className="w-4 h-4" /> },
  { label: "Books", href: "/products?category=books", icon: <BookOpen className="w-4 h-4" /> },
];

const Navbar = (): React.ReactElement => {
  const { toggle, theme } = useTheme();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const isDesktop = useIsDesktop();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [isProductsOpen, setIsProductsOpen] = useState<boolean>(false);

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
    setIsCategoriesOpen(false);
    setIsProductsOpen(false);
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
              className="flex items-center gap-8"
              role="navigation"
              aria-label="Main navigation"
            >
              {/* Categories Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors whitespace-nowrap"
                  aria-label="Product categories"
                  aria-expanded={isCategoriesOpen}
                >
                  <span>Categories</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isCategoriesOpen && (
                  <div
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                    className="absolute left-0 mt-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="py-2 space-y-1">
                      {CATEGORIES.map((category) => (
                        <Link
                          key={category.href}
                          href={category.href}
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                        >
                          <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">
                            {category.icon}
                          </span>
                          <span>{category.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Products Dropdown */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors whitespace-nowrap"
                  aria-label="Shop products"
                  aria-expanded={isProductsOpen}
                >
                  <span>Products</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProductsOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Products Dropdown Menu */}
                {isProductsOpen && (
                  <div
                    onMouseEnter={() => setIsProductsOpen(true)}
                    onMouseLeave={() => setIsProductsOpen(false)}
                    className="absolute left-0 mt-0 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="py-2 space-y-1">
                      {PRODUCTS.map((product) => (
                        <Link
                          key={product.href}
                          href={product.href}
                          onClick={closeMenu}
                          className="flex items-start gap-3 px-4 py-3 text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                        >
                          <span className="text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5">
                            {product.icon}
                          </span>
                          <div className="flex-grow">
                            <div className="font-medium">{product.label}</div>
                            {product.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Menu Items */}
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
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-800">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-(--color-primary) bg-opacity-10">
                        <User className="w-4 h-4 text-(--color-primary)" />
                      </div>
                      <span className="text-sm font-medium text-(--color-text) truncate hidden sm:inline">
                        {user.email.split("@")[0]}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </>
                ) : (
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="hidden sm:inline">Login</span>
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
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-0 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-6rem)] overflow-y-auto pb-6"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Mobile Search */}
            <div className="px-2 py-3 border-b border-gray-100 dark:border-gray-700">
              <SearchBar onSearchSubmit={closeMenu} />
            </div>

            {/* Quick Categories Section */}
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Shop by Category
              </p>
              <div className="space-y-1">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="flex items-center gap-3 py-2.5 px-4 text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors rounded-md"
                    onClick={closeMenu}
                  >
                    <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">
                      {category.icon}
                    </span>
                    <span className="flex-grow">{category.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

            {/* Products Section */}
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Shop Products
              </p>
              <div className="space-y-1">
                {PRODUCTS.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="flex items-start gap-3 py-2.5 px-4 text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors rounded-md"
                    onClick={closeMenu}
                  >
                    <span className="text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5">
                      {product.icon}
                    </span>
                    <div className="flex-grow">
                      <div className="font-medium">{product.label}</div>
                      {product.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

            {/* Main Menu Items */}
            <div className="py-2 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-md text-sm font-medium text-(--color-text) hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  {item.label === "Account" && <User className="w-4 h-4" />}
                  <span className="flex-grow">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

            {/* User & More Actions */}
            <div className="py-2 space-y-1">
              {user ? (
                <>
                  <div className="py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Logged in as
                    </p>
                    <p className="text-sm font-medium text-(--color-text) truncate">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start flex items-center gap-3 h-10 px-4 rounded-md"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <Link href="/auth/login" onClick={closeMenu} className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start flex items-center gap-3 h-10 px-4 rounded-md"
                  >
                    <LogIn className="w-4 h-4 flex-shrink-0" />
                    <span>Login / Sign Up</span>
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
                className="w-full justify-start flex items-center gap-3 h-10 px-4 rounded-md"
              >
                {theme === "luxury" ? (
                  <Moon className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="flex-grow">{theme === "luxury" ? "Light" : "Dark"} Theme</span>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
