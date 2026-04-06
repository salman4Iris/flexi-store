'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import MobileCarousel from "./MobileCarousel";
import type { Category } from "@/features/home/types";

interface CategoriesSectionProps {
  categories: Category[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  const isDesktop = useIsDesktop();

  const CategoryCard = ({ category }: { category: Category }) => (
    <Link href={category.href}>
      <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer text-(--color-text)">
        <CardContent className="pt-6">
          <Image
            src={category.image}
            alt={category.name}
            width={800}
            height={600}
            fetchPriority="high"
            className="w-full h-48 object-cover rounded-md mb-4"
            priority
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

      {categories.length === 0 && (
        <p className="text-center text-(--color-text) opacity-75">
          No categories available
        </p>
      )}

      {categories.length > 0 && !isDesktop && (
        <MobileCarousel
          items={categories}
          renderItem={(category) => <CategoryCard category={category} />}
        />
      )}

      {categories.length > 0 && isDesktop && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
