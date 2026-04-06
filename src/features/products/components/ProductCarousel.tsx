"use client";

import React from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import ProductCard from "./ProductCard";
import ProductGrid from "./ProductGrid";
import MobileCarousel from "@/features/home/components/MobileCarousel";
import type { Product } from "@/features/products/types/product";

interface ProductCarouselProps {
  products: Product[];
  category?: string;
  search?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  category,
  search,
}) => {
  const isDesktop = useIsDesktop();

  // On mobile, show carousel; on desktop, show grid
  if (!isDesktop) {
    return (
      <MobileCarousel
        items={products}
        renderItem={(product, isTransitioning) => (
          <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <ProductCard {...product} priority={true} />
          </div>
        )}
      />
    );
  }

  // On desktop, show grid
  return <ProductGrid products={products} category={category} search={search} />;
};

export default ProductCarousel;
