"use client";

import React, { useEffect, useState } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import ProductCard from "./ProductCard";
import MobileCarousel from "@/features/home/components/MobileCarousel";
import type { Product } from "@/features/products/types/product";

interface RecommendedProductsProps {
  currentProductId: string;
  category?: string;
  limit?: number;
  title?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  currentProductId,
  category,
  limit = 4,
  title = "You Might Also Like",
}) => {
  const isDesktop = useIsDesktop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all products and filter by category
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const allProducts = (await response.json()) as Product[];

        // Filter out current product and get related ones
        let related = allProducts.filter(
          (p) =>
            p.id !== currentProductId &&
            (!category || p.category === category)
        );

        // If not enough products in category, add random products
        if (related.length < limit) {
          const remaining = allProducts.filter(
            (p) =>
              p.id !== currentProductId &&
              !related.some((r) => r.id === p.id)
          );
          related = [...related, ...remaining];
        }

        // Shuffle and limit
        related = related
          .sort(() => Math.random() - 0.5)
          .slice(0, limit);

        setProducts(related);
      } catch (err) {
        console.error("Error fetching recommended products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchRelatedProducts();
  }, [currentProductId, category, limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-(--color-bg) rounded-lg h-64"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {/* Mobile Carousel */}
      {!isDesktop && (
        <MobileCarousel
          items={products}
          renderItem={(product) => <ProductCard {...product} priority={false} />}
        />
      )}

      {/* Desktop Grid */}
      {isDesktop && (
        <section aria-label={title}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                {...product}
                priority={index < 4}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default RecommendedProducts;
