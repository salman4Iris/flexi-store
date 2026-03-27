import type { Product } from "@/features/products/types/product";

export const mockProducts: Product[] = [
  {
    id: "product-1",
    name: "Wireless Noise-Canceling Headphones",
    price: 8499,
    originalPrice: 9999,
    image: "/images/products/electronics-headphones.svg",
    alt: "Black wireless headphones on a neutral background",
    description:
      "Immersive over-ear headphones with active noise cancellation and all-day comfort.",
    category: "electronics",
    currency: "INR",
  },
  {
    id: "product-2",
    name: "Classic Denim Jacket",
    price: 2899,
    originalPrice: 3499,
    image: "/images/products/fashion-jacket.svg",
    alt: "Blue denim jacket hanging on a rack",
    description:
      "A timeless denim layer designed for everyday wear with a comfortable tailored fit.",
    category: "fashion",
    currency: "INR",
  },
  {
    id: "product-3",
    name: "Modern Lounge Chair",
    price: 12499,
    originalPrice: 14999,
    image: "/images/products/home-chair.svg",
    alt: "Modern lounge chair in a bright living room",
    description:
      "A stylish accent chair that adds comfort and character to your home interiors.",
    category: "home",
    currency: "INR",
  },
  {
    id: "product-4",
    name: "Hydrating Skincare Set",
    price: 1899,
    originalPrice: 2299,
    image: "/images/products/beauty-skincare.svg",
    alt: "Premium skincare products arranged neatly on a surface",
    description:
      "A complete beauty routine with cleanser, serum, and moisturizer for daily hydration.",
    category: "beauty",
    currency: "INR",
  },
  {
    id: "product-5",
    name: "Performance Yoga Mat",
    price: 1599,
    originalPrice: 1999,
    image: "/images/products/sports-yoga-mat.svg",
    alt: "Rolled yoga mat in a fitness studio",
    description:
      "High-grip support for yoga, stretching, and home workouts with durable cushioning.",
    category: "sports",
    currency: "INR",
  },
  {
    id: "product-6",
    name: "Bestselling Fiction Collection",
    price: 999,
    originalPrice: 1299,
    image: "/images/products/books-fiction-set.svg",
    alt: "Stack of hardcover books on a wooden table",
    description:
      "A curated book bundle featuring acclaimed page-turners for your weekend reading list.",
    category: "books",
    currency: "INR",
  },
];

export function getProductById(productId: string): Product | undefined {
  return mockProducts.find((product) => product.id === productId);
}
