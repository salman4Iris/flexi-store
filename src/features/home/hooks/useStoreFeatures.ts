"use client";

import { useEffect, useState } from "react";
import type { StoreFeature } from "@/features/home/types";

type UseStoreFeaturesReturn = {
  features: StoreFeature[];
  loading: boolean;
  error: string | null;
};

export const useStoreFeatures = (): UseStoreFeaturesReturn => {
  const [features, setFeatures] = useState<StoreFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadStoreFeatures = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/store-features");
        if (!response.ok) {
          throw new Error("Failed to load store features");
        }

        const data = (await response.json()) as StoreFeature[];
        if (mounted) {
          setFeatures(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load store features");
          setFeatures([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadStoreFeatures();

    return (): void => {
      mounted = false;
    };
  }, []);

  return { features, loading, error };
};
