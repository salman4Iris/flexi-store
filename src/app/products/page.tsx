"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/features/products/components/ProductGrid";

function formatCategoryLabel(category: string): string {
  return category
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function ProductsPageContent(): React.ReactNode {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const heading = category ? `${formatCategoryLabel(category)} Products` : "All Products";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{heading}</h1>
        <p className="text-sm text-muted-foreground">
          {category
            ? `Browse image-rich picks from our ${formatCategoryLabel(category)} collection.`
            : "Browse our complete collection of featured products."}
        </p>
      </div>
      <ProductGrid category={category} />
    </div>
  );
}

export default function ProductsPage(): React.ReactNode {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="mb-6">
            <div className="h-8 bg-[var(--color-text)] bg-opacity-10 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-[var(--color-text)] bg-opacity-10 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-[var(--color-text)] bg-opacity-10 rounded-lg h-64 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
