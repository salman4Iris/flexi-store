"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/features/products/types/product";

export type ProductGridProps = {
  category?: string;
};

const ProductGrid = ({ category }: ProductGridProps): React.ReactNode => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      const endpoint = category
        ? `/api/products?category=${encodeURIComponent(category)}`
        : "/api/products";

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = (await response.json()) as Product[];
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
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-(--color-bg) rounded-xl p-4">
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
          <ProductCard key={product.id} {...product} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
