"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/store/cart';

type Product = { id: string; name: string; price: number; image: string; description?: string };

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/products/${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (mounted && !data?.message) setProduct(data);
        else if (mounted) setProduct(null);
      })
      .catch(() => setProduct(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [params.slug]);

  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (adding || !product) return;
    setAdding(true);
    try {
      add({ id: product.id, name: product.name, price: product.price });
    } finally {
      setTimeout(() => setAdding(false), 300);
    }
  };

  if (loading) return (
    <Container>
      <Section>
        <p className="text-center text-muted-foreground">Loading...</p>
      </Section>
    </Container>
  );
  if (!product) return notFound();

  return (
    <Container>
      <Section>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src={product.image} alt={product.name} className="w-full rounded-lg" />
            </div>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <p className="text-2xl font-semibold text-primary">₹{product.price}</p>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex-1"
                  >
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save for Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </Container>
  );
}
