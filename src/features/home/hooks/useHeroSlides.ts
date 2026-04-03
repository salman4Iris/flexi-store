"use client";

import { useEffect, useState } from "react";
import type { Slide } from "@/features/home/types";

type UseHeroSlidesReturn = {
  slides: Slide[];
  loading: boolean;
  error: string | null;
};

export const useHeroSlides = (): UseHeroSlidesReturn => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSlides = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/hero-slides");
        if (!response.ok) {
          throw new Error("Failed to load hero slides");
        }

        const data = (await response.json()) as Slide[];
        if (mounted) {
          setSlides(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load hero slides");
          setSlides([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadSlides();

    return (): void => {
      mounted = false;
    };
  }, []);

  return { slides, loading, error };
};
