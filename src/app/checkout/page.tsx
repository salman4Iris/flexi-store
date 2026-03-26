
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/store/cart';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
	const { items, total, clear } = useCart();
	const { token, user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handlePlaceOrder = async () => {
		setError('');
		if (!token || !user) {
			setError('You must be logged in to place an order');
			return;
		}
		setLoading(true);
		try {
			const res = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ items, total: total() }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Order failed');
			clear();
			router.push('/order');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container>
			<Section>
				<div className="max-w-3xl mx-auto">
					<h1 className="text-2xl font-bold mb-6">Checkout</h1>
					{items.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-lg text-muted-foreground mb-4">Your cart is empty.</p>
							<Link href="/products">
								<Button>Continue Shopping</Button>
							</Link>
						</div>
					) : (
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex justify-between">
									<span className="font-medium">Items:</span>
									<span>{items.length}</span>
								</div>
								<div className="border-t pt-4 flex justify-between">
									<span className="font-semibold">Total:</span>
									<span className="font-semibold text-lg">₹{total()}</span>
								</div>
								{error && <p className="text-red-500 text-sm">{error}</p>}
								<Button
									onClick={handlePlaceOrder}
									disabled={loading}
									className="w-full"
								>
									{loading ? 'Placing order...' : 'Place Order'}
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</Section>
		</Container>
	);
}
