import { useState, useEffect, useCallback } from "react";
import { getProducts } from "@/features/products/services/products";
import type { Product } from "@/features/products/types/product";

export type UseSearchSuggestionsReturn = {
  suggestions: Product[];
  loading: boolean;
  error: string | null;
};

export const useSearchSuggestions = (
  searchQuery: string,
  limit: number = 5,
): UseSearchSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (): Promise<void> => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await getProducts({ search: searchQuery });
      setSuggestions(results.slice(0, limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch suggestions");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchSuggestions();
    }, 300); // Debounce API calls

    return (): void => {
      clearTimeout(timer);
    };
  }, [fetchSuggestions]);

  return { suggestions, loading, error };
};
