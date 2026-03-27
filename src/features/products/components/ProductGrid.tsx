"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/features/products/types/product";

export type ProductGridProps = {
  category?: string;
};

export default function ProductGrid({ category }: ProductGridProps): React.ReactNode {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const endpoint = category
      ? `/api/products?category=${encodeURIComponent(category)}`
      : "/api/products";

    fetch(endpoint)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        if (mounted) setProducts(data || []);
      })
      .catch((e) => {
        if (mounted) setError(String(e) || "Error loading products");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
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
          <div key={i} className="animate-pulse bg-white rounded-xl p-4">
            <div className="h-44 bg-gray-200 rounded-md mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );

  return (
    <section aria-label="Products">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
