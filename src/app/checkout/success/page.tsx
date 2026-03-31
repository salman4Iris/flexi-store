"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Package, MapPin, AlertCircle } from "lucide-react";

type OrderItem = { id: string; name: string; price: number; qty: number };
type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
};

function CheckoutSuccessContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!orderId);
  const orderError = orderId ? null : "No order ID provided";

  useEffect(() => {
    if (!orderId) {
      return;
    }

    let isMounted = true;
    let orderData: Order | null = null;

    // Try to get order data from sessionStorage first (passed from checkout)
    const sessionOrder = sessionStorage.getItem("lastOrder");
    if (sessionOrder) {
      try {
        const parsedOrder = JSON.parse(sessionOrder);
        if (parsedOrder.id === orderId) {
          orderData = parsedOrder;
          sessionStorage.removeItem("lastOrder");
        }
      } catch (e) {
        // Continue to fetch from API if session data is invalid
        console.error("Failed to parse session order:", e);
      }
    }

    // If no session data, use mock data for demo purposes
    if (!orderData) {
      orderData = {
        id: orderId,
        items: [
          { id: "1", name: "Wireless Headphones", price: 2999, qty: 1 },
          { id: "2", name: "USB-C Cable", price: 499, qty: 2 },
        ],
        total: 3997,
        createdAt: new Date().toISOString(),
        shippingAddress: {
          fullName: "Rahul Sharma",
          address: "Flat 4B, Green Park Apartments, MG Road",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
      };
    }

    if (isMounted) {
      // React 18 automatically batches these updates
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrder(orderData);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <Container>
        <Section>
          <div className="max-w-2xl mx-auto text-center py-16">
            <p className="text-lg font-medium">Loading your order summary...</p>
          </div>
        </Section>
      </Container>
    );
  }

  if (orderError || !order) {
    return (
      <Container>
        <Section>
          <div className="max-w-2xl mx-auto py-16">
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-semibold text-[var(--color-text)] mb-2">
                      {orderError || "Order not found"}
                    </h2>
                    <p className="text-sm text-[var(--color-text)] opacity-75 mb-4">
                      We couldn&apos;t find your order. Please try again or contact support.
                    </p>
                    <Link href="/products">
                      <Button>Continue Shopping</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </Container>
    );
  }

  const estimatedDelivery = new Date(
    new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000
  );
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = 0;
  const totalAmount = subtotal + shippingCost;

  return (
    <Container>
      <Section>
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[var(--color-text)]">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-[var(--color-text)] opacity-75">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Order Number */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--color-text)] opacity-75 mb-2">
                  Order Number
                </p>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  #{order.id}
                </p>
              </CardContent>
            </Card>

            {/* Order Date */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--color-text)] opacity-75 mb-2">
                  Order Date
                </p>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>

            {/* Estimated Delivery */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--color-text)] opacity-75 mb-2">
                  Est. Delivery
                </p>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {estimatedDelivery.toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-border">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between py-4 text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-[var(--color-text)]">
                            {item.name}
                          </p>
                          <p className="text-[var(--color-text)] opacity-75 text-xs mt-1">
                            Qty: {item.qty} × ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <span className="font-semibold text-[var(--color-text)]">
                          ₹{(item.price * item.qty).toLocaleString("en-IN")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-[var(--color-text)]">
                      <p className="font-semibold">
                        {order.shippingAddress.fullName}
                      </p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-[var(--color-text)] opacity-75">
                      <span>Subtotal ({order.items.length} items)</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[var(--color-text)] opacity-75">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-[var(--color-text)] opacity-75">
                      <span>Tax</span>
                      <span>₹0</span>
                    </div>
                  </div>

                  <div className="border-t border-[var(--color-text)] border-opacity-10 pt-3">
                    <div className="flex justify-between font-bold text-lg text-[var(--color-text)]">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
                    <p className="text-xs font-medium text-green-800 dark:text-green-200">
                      ✓ Payment confirmed
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Your order is being prepared for shipment
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/order" className="block">
                  <Button className="w-full" variant="default">
                    View All Orders
                  </Button>
                </Link>
                <Link href="/products" className="block">
                  <Button className="w-full" variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Info Box */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-xs text-[var(--color-text)] opacity-75">
                    <p>
                      <span className="block font-semibold mb-1">
                        What&apos;s Next?
                      </span>
                      You will receive an email confirmation shortly with tracking
                      information. You can also view your order status in your account.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}

export default function CheckoutSuccessPage(): React.ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
