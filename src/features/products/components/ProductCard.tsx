"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";

export type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  alt?: string;
  originalPrice?: number;
  discount?: number; // optional explicit discount percent
  currency?: string; // ISO currency, default INR
  onAdd?: (id: string) => void;
  priority?: boolean; // High fetch priority for above-fold images
};

function formatPrice(value: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(value);
  } catch {
    return `${value}`;
  }
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  alt,
  originalPrice,
  discount,
  currency = "INR",
  onAdd,
  priority = false,
}: ProductCardProps): React.ReactElement => {
  const { add } = useCart();
  const [adding, setAdding] = useState<boolean>(false);

  const computedDiscount = (): number => {
    if (typeof discount === "number") {
      return discount;
    }
    return originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  };

  const handleAdd = async (): Promise<void> => {
    if (adding) return;
    setAdding(true);
    try {
      add({ id, name, price });
      onAdd?.(id);
    } finally {
      setTimeout(() => {
        setAdding(false);
      }, 300);
    }
  };

  const discount_value = computedDiscount();

  return (
    <article className="group bg-[var(--color-bg)] rounded-xl overflow-hidden shadow transition duration-300 hover:shadow-lg flex flex-col h-full">
      <Link href={`/products/${id}`} className="block">
        <figure className="relative overflow-hidden bg-[var(--color-bg)] border border-opacity-10 aspect-square">
          {discount_value > 0 && (
            <span className="absolute top-2 left-2 z-10 text-xs font-semibold text-white px-2 py-1 rounded bg-primary">
              -{discount_value}%
            </span>
          )}

          <img
            src={image}
            alt={alt ?? name}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "low"}
            decoding="async"
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
        </figure>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-semibold mb-2 leading-snug text-[var(--color-text)]">
          <Link href={`/products/${id}`} className="hover:underline">{name}</Link>
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold text-primary">{formatPrice(price, currency)}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-[var(--color-text)] opacity-75 line-through">{formatPrice(originalPrice, currency)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <Button
          onClick={handleAdd}
          disabled={adding}
          aria-label={`Add ${name} to cart`}
          className="w-full gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span className="text-sm">{adding ? "Added" : "Add to cart"}</span>
        </Button>
      </div>
    </article>
  );
}

export default ProductCard;