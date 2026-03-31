"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/features/products/services/products";
import type { Product } from "@/features/products/types/product";

export type ProductGridProps = {
  category?: string;
};

const PRODUCT_GRID_SKELETON_KEYS: string[] = [
  'product-skeleton-1',
  'product-skeleton-2',
  'product-skeleton-3',
  'product-skeleton-4',
  'product-skeleton-5',
  'product-skeleton-6',
  'product-skeleton-7',
  'product-skeleton-8',
];

const ProductGrid = ({ category }: ProductGridProps): React.ReactNode => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProducts({ category });
        if (mounted) {
          setProducts(data ?? []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Error loading products");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return (): void => {
      mounted = false;
    };
  }, [category]);

  if (error)
    return (
      <div role="alert" className="text-red-600">
        {error}
      </div>
    );

  if (loading)
    return (
      <div aria-busy="true" aria-live="polite" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {PRODUCT_GRID_SKELETON_KEYS.map((key) => (
          <div key={key} className="animate-pulse bg-(--color-bg) rounded-xl p-4">
            <div className="h-44 bg-(--color-text) bg-opacity-10 rounded-md mb-3" />
            <div className="h-4 bg-(--color-text) bg-opacity-10 rounded w-3/4 mb-2" />
            <div className="h-4 bg-(--color-text) bg-opacity-10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );

  return (
    <section aria-label="Products">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} {...product} priority={index < 5} />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
