"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";

type OrderItem = { id: string; name: string; price: number; qty: number };
type Order = {
  id: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

const OrderStatusBadge = (): React.ReactElement => {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
      Delivered
    </span>
  );
};

const OrderCard = ({ order }: { order: Order }): React.ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const itemCount = order.items?.length ?? 0;
  const shippingCost = 0;
  const subtotal = order.items?.reduce((s, i) => s + i.price * i.qty, 0) ?? order.total;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">
              Order #{order.id}
            </CardTitle>
            <OrderStatusBadge />
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("en-IN", {
              timeZone: "UTC",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary row */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-base">₹{order.total.toLocaleString("en-IN")}</span>
            <Button
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Hide Details" : "View Details"}
            </Button>
          </div>
        </div>

        {/* Expanded item list */}
        {expanded && (
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Items Ordered
            </h3>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Qty: {item.qty} × ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="ml-4 font-medium shrink-0">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>

            {/* Price breakdown */}
            <div className="border-t pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t pt-2 mt-1">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OrderListSkeleton = (): React.ReactElement => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((n) => (
        <Card key={n}>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
              <div className="h-3 bg-muted rounded w-48" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const OrdersPage = (): React.ReactElement => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(token));

  useEffect(() => {
    let mounted = true;
    if (!token) return () => { mounted = false; };
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data: unknown) => {
        if (mounted) setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <Container>
      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              {!loading && orders.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {orders.length} {orders.length === 1 ? "order" : "orders"} placed
                </p>
              )}
            </div>
            <Link href="/products">
              <Button variant="outline" className="text-black! dark:text-white!">Continue Shopping</Button>
            </Link>
          </div>

          {loading ? (
            <OrderListSkeleton />
          ) : !token ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                Please log in to view your orders.
              </p>
              <Link href="/auth/login">
                <Button className="text-white!">Log In</Button>
              </Link>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-medium mb-2">No orders yet</p>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t placed any orders. Start shopping to see your orders here.
              </p>
              <Link href="/products">
                <Button className="text-white!">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
};

export default OrdersPage;
