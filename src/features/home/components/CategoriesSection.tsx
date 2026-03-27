'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';

type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
};

const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and devices',
    image: '/images/categories/electronics.svg',
    href: '/products?category=electronics',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Trendy clothing and accessories',
    image: '/images/categories/fashion.svg',
    href: '/products?category=fashion',
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Furniture and decor items',
    image: '/images/categories/home.svg',
    href: '/products?category=home',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Skincare and cosmetics',
    image: '/images/categories/beauty.svg',
    href: '/products?category=beauty',
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Fitness and outdoor gear',
    image: '/images/categories/sports.svg',
    href: '/products?category=sports',
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Best sellers and classics',
    image: '/images/categories/books.svg',
    href: '/products?category=books',
  },
];

function CategoriesSection(): React.ReactNode {
  return (
    <section id="featured" className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <p className="text-lg text-gray-600">Browse our diverse collection of products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={category.href}>
            <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="pt-6">
                <img src={category.image} alt={category.name} loading="lazy" className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Button variant="outline" className="w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
