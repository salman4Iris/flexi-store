'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/features/home/hooks/useCategories";

const CategoriesSection = (): React.ReactElement => {
  const { categories, loading, error } = useCategories();

  return (
    <section
      id="featured"
      className="py-12 bg-(--color-bg) rounded-lg border border-(--color-text) border-opacity-10"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-(--color-text) mb-4">
          Shop by Category
        </h2>
        <p className="text-lg text-(--color-text) opacity-75">
          Browse our diverse collection of products
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={`category-skeleton-${index}`} className="h-80 rounded-lg bg-(--color-bg) animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-(--color-text) opacity-75">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const isPriority = index < 3;
          return (
            <Link key={category.id} href={category.href}>
              <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer text-(--color-text)">
                <CardContent className="pt-6">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={800}
                    height={600}
                    fetchPriority={isPriority ? "high" : "low"}
                    className="w-full h-48 object-cover rounded-md mb-4"
                    priority={isPriority}
                  />
                  <h3 className="text-xl font-bold text-(--color-text) mb-2 group-hover:opacity-80 transition-opacity">
                    {category.name}
                  </h3>
                  <p className="text-(--color-text) mb-4">
                    {category.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full text-(--color-text)"
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
