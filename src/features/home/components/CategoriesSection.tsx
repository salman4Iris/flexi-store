'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";

type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
};

const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Latest gadgets and devices",
    image: "/images/categories/electronics.svg",
    href: "/products?category=electronics",
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Trendy clothing and accessories",
    image: "/images/categories/fashion.svg",
    href: "/products?category=fashion",
  },
  {
    id: "home",
    name: "Home & Living",
    description: "Furniture and decor items",
    image: "/images/categories/home.svg",
    href: "/products?category=home",
  },
  {
    id: "beauty",
    name: "Beauty",
    description: "Skincare and cosmetics",
    image: "/images/categories/beauty.svg",
    href: "/products?category=beauty",
  },
  {
    id: "sports",
    name: "Sports",
    description: "Fitness and outdoor gear",
    image: "/images/categories/sports.svg",
    href: "/products?category=sports",
  },
  {
    id: "books",
    name: "Books",
    description: "Best sellers and classics",
    image: "/images/categories/books.svg",
    href: "/products?category=books",
  },
];

const CategoriesSection = (): React.ReactElement => {
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
    </section>
  );
};

export default CategoriesSection;
