'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/store/cart';
import type { Product } from '@/features/products/types/product';

export type ProductDetailsProps = {
  product: Product;
};

function formatPrice(value: number, currency: string = 'INR'): string {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(value);
  } catch {
    return `${value}`;
  }
}

export function ProductDetails({ product }: ProductDetailsProps): React.ReactNode {
  const { add } = useCart();
  const [adding, setAdding] = useState<boolean>(false);
  const [savedForLater, setSavedForLater] = useState<boolean>(false);

  const handleAddToCart = async (): Promise<void> => {
    if (adding) return;
    setAdding(true);
    try {
      add({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    } finally {
      setTimeout(() => setAdding(false), 300);
    }
  };

  const handleSaveForLater = (): void => {
    setSavedForLater(!savedForLater);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Image Section */}
      <div className="flex flex-col gap-4">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center aspect-square">
          <img
            src={product.image}
            alt={product.alt || product.name}
            className="w-full h-full object-contain p-8"
          />
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {discount}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Product Info Section */}
      <Card className="h-fit">
        <CardHeader>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">{product.category}</div>
            <CardTitle className="text-3xl">{product.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-sm text-green-600 font-medium">
                Save {formatPrice(product.originalPrice - product.price, product.currency)}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="space-y-2 py-4 border-y border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Product ID:</span>
                <p className="font-medium">{product.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium capitalize">{product.category}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 py-6 text-base"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              onClick={handleSaveForLater}
              variant={savedForLater ? 'default' : 'outline'}
              className="flex-1"
              aria-label={savedForLater ? 'Saved' : 'Save for later'}
            >
              {savedForLater ? '❤' : '🤍'}
            </Button>
          </div>

          {/* Shipping Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-blue-900">Free Shipping</h3>
            <p className="text-sm text-blue-800">
              Free delivery on orders over ₹500. Delivery within 3-5 business days.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <div>✓</div>
              <div className="font-medium text-gray-700">Authentic</div>
            </div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <div>✓</div>
              <div className="font-medium text-gray-700">Secure</div>
            </div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <div>✓</div>
              <div className="font-medium text-gray-700">Warranty</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
