"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";

type Order = { id: string; total: number; createdAt: string; items: any[] };

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setOrders(data || []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [token]);

  return (
    <Container>
      <Section>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You have no orders yet.</p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <Card key={o.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg">Order #{o.id}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(o.createdAt).toLocaleString("en-IN", { timeZone: "UTC" })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">₹{o.total}</div>
                        <div className="text-sm text-muted-foreground mt-1">{o.items?.length || 0} items</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
}
