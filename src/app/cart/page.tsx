"use client";

import Link from 'next/link';
import { useCart } from '@/store/cart';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';

const CartPage = (): React.ReactElement => {
  const { items, remove, updateQty, clear, total } = useCart();

  if (!items.length) {
    return (
      <Container>
        <Section>
          <div className="w-full max-w-3xl mx-auto text-center py-12 sm:py-20 px-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Your cart is empty</h2>
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
        <div className="w-full max-w-3xl mx-auto px-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Cart</h1>
          <div className="space-y-3">
            {items.map((it) => (
              <Card key={it.id}>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base truncate">{it.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">₹{it.price} each</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => updateQty(it.id, it.qty - 1)}
                      >
                        −
                      </Button>
                      <span className="w-8 text-center font-semibold text-sm">{it.qty}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => updateQty(it.id, it.qty + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm sm:text-base">₹{it.price * it.qty}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 mt-1 h-auto px-2 py-1 text-xs"
                        onClick={() => remove(it.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-4 sm:mt-6">
            <CardContent className="pt-4 sm:pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-4 gap-2">
                <div className="text-base sm:text-lg font-semibold">Total:</div>
                <div className="text-lg sm:text-xl font-bold">₹{total()}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => clear()}
                  className="w-full sm:w-auto"
                >
                  Clear Cart
                </Button>
                <Link href="/checkout" className="w-full sm:flex-1">
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
};

export default CartPage;
