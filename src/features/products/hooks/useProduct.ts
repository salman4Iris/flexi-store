'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/features/products/types/product';

export type UseProductReturn = {
  product: Product | null;
  loading: boolean;
  error: string | null;
};

export const useProduct = (slug: string): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted: boolean = true;

    const fetchProduct = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) {
          if (mounted) setError('Product not found');
          if (mounted) setProduct(null);
          return;
        }
        const data = (await response.json()) as Product;
        if (mounted) setProduct(data);
      } catch {
        if (mounted) setError('Failed to load product');
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchProduct();

    return (): void => {
      mounted = false;
    };
  }, [slug]);

  return { product, loading, error };
};
