"use client";

import { useState, useCallback, type FormEvent, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { useSearchSuggestions } from "@/features/products/hooks/useSearchSuggestions";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";

export type SearchBarProps = {
  onSearchSubmit?: () => void;
};

const SearchBar = ({ onSearchSubmit }: SearchBarProps): ReactElement => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);
  
  const { suggestions, loading, error } = useSearchSuggestions(debouncedSearchQuery, 5);

  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        const encoded = encodeURIComponent(trimmedQuery);
        router.push(`/products?search=${encoded}`);
        setSearchQuery("");
        setShowSuggestions(false);
        onSearchSubmit?.();
      }
    },
    [searchQuery, router, onSearchSubmit],
  );

  const handleSuggestionClick = useCallback(
    (productName: string, productId: string): void => {
      router.push(`/products/${productId}`);
      setSearchQuery("");
      setShowSuggestions(false);
      onSearchSubmit?.();
    },
    [router, onSearchSubmit],
  );

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-xs relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay blur to allow suggestion click
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          aria-label="Search products"
          aria-expanded={showSuggestions && searchQuery.length > 0}
          aria-autocomplete="list"
          className="pr-10"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Submit search"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchQuery.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-(--color-bg) border border-(--color-primary)/20 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {loading && (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                Loading suggestions...
              </div>
            )}

            {error && (
              <div className="px-4 py-3 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            {!loading && !error && suggestions.length > 0 && (
              <ul className="py-2" role="listbox">
                {suggestions.map((product) => (
                  <li key={product.id} role="option">
                    <button
                      type="button"
                      onClick={() =>
                        handleSuggestionClick(product.name, product.id)
                      }
                      className="w-full px-4 py-2 text-sm text-left text-(--color-text) hover:bg-(--color-bg)/80 transition-colors flex items-center gap-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {product.category}
                        </div>
                      </div>
                      <div className="text-xs font-semibold">
                        ₹{product.price}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!loading && !error && suggestions.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No products found
              </div>
            )}

            {/* View All Results Link */}
            {!loading && !error && suggestions.length > 0 && (
              <div className="border-t border-(--color-primary)/20 px-4 py-2 bg-(--color-bg)/50">
                <button
                  type="button"
                  onClick={() => {
                    const encoded = encodeURIComponent(searchQuery);
                    router.push(`/products?search=${encoded}`);
                    setSearchQuery("");
                    setShowSuggestions(false);
                    onSearchSubmit?.();
                  }}
                  className="w-full text-sm text-(--color-primary) hover:opacity-80 transition-opacity font-medium"
                >
                  View all results for &quot;{searchQuery}&quot;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
