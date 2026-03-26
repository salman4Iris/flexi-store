"use client";

import Link from 'next/link';
import { useCart } from '@/store/cart';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';

export default function CartPage() {
  const { items, remove, clear, total } = useCart();

  if (!items.length) {
    return (
      <Container>
        <Section>
          <div className="max-w-3xl mx-auto text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
          <div className="space-y-3">
            {items.map((it) => (
              <Card key={it.id}>
                <CardContent className="pt-6 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-muted-foreground">Qty: {it.qty}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{it.price * it.qty}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 mt-2"
                      onClick={() => remove(it.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center border-t pt-4">
                <div className="text-lg font-semibold">Total: ₹{total()}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => clear()}
                >
                  Clear Cart
                </Button>
                <Link href="/checkout" className="flex-1">
                  <Button className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </Container>
  );
}
