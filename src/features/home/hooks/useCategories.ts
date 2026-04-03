"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/features/home/types";

type UseCategoriesReturn = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = (await response.json()) as Category[];
        if (mounted) {
          setCategories(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load categories");
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadCategories();

    return (): void => {
      mounted = false;
    };
  }, []);

  return { categories, loading, error };
};
