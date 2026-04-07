"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/store/cart';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

type ShippingForm = {
	fullName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	pincode: string;
};

type CardForm = {
	cardNumber: string;
	expiry: string;
	cvv: string;
};

type CheckoutFormErrors = Partial<ShippingForm & CardForm>;

type PaymentMethod = 'cod' | 'card';

const STATES = [
	'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
	'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

const normalizeCardNumber = (value: string): string => {
	return value.replace(/\D/g, '');
};

const formatCardNumber = (value: string): string => {
	const digits = normalizeCardNumber(value).slice(0, 16);
	const parts = digits.match(/.{1,4}/g);
	return parts ? parts.join(' ') : '';
};

const formatExpiry = (value: string): string => {
	const digits = value.replace(/\D/g, '').slice(0, 4);
	if (digits.length <= 2) return digits;
	return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const isLuhnValid = (cardNumber: string): boolean => {
	const digits = normalizeCardNumber(cardNumber);
	let total = 0;
	let shouldDouble = false;

	for (let i = digits.length - 1; i >= 0; i -= 1) {
		const parsed = Number(digits[i]);
		if (Number.isNaN(parsed)) return false;

		let digit = parsed;
		if (shouldDouble) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}

		total += digit;
		shouldDouble = !shouldDouble;
	}

	return total % 10 === 0;
};

const isExpiryValid = (expiry: string): boolean => {
	if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false;
	const [monthPart, yearPart] = expiry.split('/');
	const month = Number(monthPart);
	const year = 2000 + Number(yearPart);
	const now = new Date();
	const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);

	return expiryDate >= now;
};

const FieldError = ({ msg }: { msg?: string }): React.ReactElement | null => {
	if (!msg) return null;
	return <p className="text-xs text-destructive mt-1">{msg}</p>;
};

const FormField = ({
	label,
	id,
	error,
	children,
}: {
	label: string;
	id: string;
	error?: string;
	children: React.ReactNode;
}): React.ReactElement => {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={id} className="text-sm font-medium">
				{label}
			</label>
			{children}
			<FieldError msg={error} />
		</div>
	);
};

const CheckoutPage = (): React.ReactElement => {
	const { items, total, clear } = useCart();
	const { token, user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
	const router = useRouter();

	const [form, setForm] = useState<ShippingForm>({
		fullName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		state: '',
		pincode: '',
	});
	const [cardForm, setCardForm] = useState<CardForm>({
		cardNumber: '',
		expiry: '',
		cvv: '',
	});
	const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	): void => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setFormErrors((prev) => ({ ...prev, [name]: '' }));
	};

	const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;

		if (name === 'cardNumber') {
			setCardForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }));
		} else if (name === 'expiry') {
			setCardForm((prev) => ({ ...prev, expiry: formatExpiry(value) }));
		} else {
			setCardForm((prev) => ({ ...prev, cvv: value.replace(/\D/g, '').slice(0, 4) }));
		}

		setFormErrors((prev) => ({ ...prev, [name]: '' }));
	};

	const handlePaymentMethodChange = (method: PaymentMethod): void => {
		setPaymentMethod(method);

		if (method === 'cod') {
			setFormErrors((prev) => ({
				...prev,
				cardNumber: '',
				expiry: '',
				cvv: '',
			}));
		}
	};

	const validate = (): boolean => {
		const errs: CheckoutFormErrors = {};
		if (!form.fullName.trim()) errs.fullName = 'Full name is required';
		if (!form.email.trim()) errs.email = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
			errs.email = 'Enter a valid email address';
		if (!form.phone.trim()) errs.phone = 'Phone number is required';
		else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
			errs.phone = 'Enter a valid 10-digit phone number';
		if (!form.address.trim()) errs.address = 'Address is required';
		if (!form.city.trim()) errs.city = 'City is required';
		if (!form.state) errs.state = 'Please select a state';
		if (!form.pincode.trim()) errs.pincode = 'Pincode is required';
		else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode';

		if (paymentMethod === 'card') {
			const cardNumberDigits = normalizeCardNumber(cardForm.cardNumber);
			if (!cardNumberDigits) {
				errs.cardNumber = 'Card number is required';
			} else if (cardNumberDigits.length !== 16) {
				errs.cardNumber = 'Card number must be 16 digits';
			} else if (!isLuhnValid(cardNumberDigits)) {
				errs.cardNumber = 'Enter a valid card number';
			}

			if (!cardForm.expiry.trim()) {
				errs.expiry = 'Expiry date is required';
			} else if (!isExpiryValid(cardForm.expiry)) {
				errs.expiry = 'Enter a valid expiry date (MM/YY)';
			}
		}

		setFormErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const isFormValid = (): boolean => {
		// Check shipping fields
		if (!form.fullName.trim()) return false;
		if (!form.email.trim()) return false;
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return false;
		if (!form.phone.trim()) return false;
		if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) return false;
		if (!form.address.trim()) return false;
		if (!form.city.trim()) return false;
		if (!form.state) return false;
		if (!form.pincode.trim()) return false;
		if (!/^\d{6}$/.test(form.pincode)) return false;

		// Check payment-specific fields
		if (paymentMethod === 'card') {
			const cardNumberDigits = normalizeCardNumber(cardForm.cardNumber);
			if (!cardNumberDigits || cardNumberDigits.length !== 16 || !isLuhnValid(cardNumberDigits)) return false;
			if (!cardForm.expiry.trim() || !isExpiryValid(cardForm.expiry)) return false;
		}

		return true;
	};

	const handlePlaceOrder = async (): Promise<void> => {
		setError('');
		if (!token || !user) {
			setError('You must be logged in to place an order');
			return;
		}
		if (!validate()) return;
		setLoading(true);
		try {
			const res = await fetch('/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ items, total: total() }),
			});
			const data = (await res.json()) as
				| { order: { id: string } }
				| { message?: string };
			if (!res.ok) {
				const message = 'message' in data ? (data.message ?? 'Order failed') : 'Order failed';
				throw new Error(message);
			}
			if (!('order' in data)) {
				throw new Error('Order failed');
			}
			
			// Enhance order with shipping address for display on success page
			const enhancedOrder = {
				...data.order,
				shippingAddress: {
					fullName: form.fullName,
					address: form.address,
					city: form.city,
					state: form.state,
					pincode: form.pincode,
				},
			};
			
			// Store order in sessionStorage for the success page
			if (typeof window !== 'undefined') {
				sessionStorage.setItem('lastOrder', JSON.stringify(enhancedOrder));
			}
			
			clear();
			// Redirect to order summary/success page
			router.push(`/checkout/success?orderId=${data.order.id}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const subtotal = useMemo(() => total(), [total]);
	const shippingCost = 0;
	const orderTotal = subtotal + shippingCost;

	if (items.length === 0) {
		return (
			<Container>
				<Section>
					<div className="max-w-3xl mx-auto text-center py-16">
						<p className="text-lg font-medium mb-2">Your cart is empty</p>
						<p className="text-muted-foreground mb-6">
							Add some items to your cart before checking out.
						</p>
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
				<div className="max-w-6xl mx-auto">
					<h1 className="text-2xl font-bold mb-8">Checkout</h1>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
						{/* ── Left column: Shipping + Payment ── */}
						<div className="lg:col-span-2 space-y-6">

							{/* Shipping Address */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Delivery Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField label="Full Name" id="fullName" error={formErrors.fullName}>
											<Input
												id="fullName"
												name="fullName"
												placeholder="Rahul Sharma"
												value={form.fullName}
												onChange={handleChange}
											/>
										</FormField>
										<FormField label="Email Address" id="email" error={formErrors.email}>
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="rahul@example.com"
												value={form.email}
												onChange={handleChange}
											/>
										</FormField>
									</div>

									<FormField label="Phone Number" id="phone" error={formErrors.phone}>
										<Input
											id="phone"
											name="phone"
											type="tel"
											placeholder="9876543210"
											value={form.phone}
											onChange={handleChange}
										/>
									</FormField>

									<FormField label="Street Address" id="address" error={formErrors.address}>
										<Input
											id="address"
											name="address"
											placeholder="Flat 4B, Green Park Apartments, MG Road"
											value={form.address}
											onChange={handleChange}
										/>
									</FormField>

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<FormField label="City" id="city" error={formErrors.city}>
											<Input
												id="city"
												name="city"
												placeholder="Mumbai"
												value={form.city}
												onChange={handleChange}
											/>
										</FormField>

										<FormField label="State" id="state" error={formErrors.state}>
											<select
												id="state"
												name="state"
												value={form.state}
												onChange={handleChange}
												className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
											>
												<option value="">Select state</option>
												{STATES.map((s) => (
													<option key={s} value={s}>
														{s}
													</option>
												))}
											</select>
										</FormField>

										<FormField label="Pincode" id="pincode" error={formErrors.pincode}>
											<Input
												id="pincode"
												name="pincode"
												placeholder="400001"
												maxLength={6}
												value={form.pincode}
												onChange={handleChange}
											/>
										</FormField>
									</div>
								</CardContent>
							</Card>

							{/* Payment Method */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Payment Method</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{/* Cash on Delivery */}
									<label
										className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
											paymentMethod === 'cod'
												? 'border-primary bg-primary/5'
												: 'border-border hover:bg-muted/50'
										}`}
									>
										<input
											type="radio"
											name="payment"
											value="cod"
											checked={paymentMethod === 'cod'}
											onChange={() => handlePaymentMethodChange('cod')}
											className="accent-primary"
										/>
										<div>
											<p className="font-medium text-sm">Cash on Delivery</p>
											<p className="text-xs text-muted-foreground">
												Pay when your order arrives
											</p>
										</div>
									</label>

									{/* Debit / Credit Card (mock) */}
									<label
										className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
											paymentMethod === 'card'
												? 'border-primary bg-primary/5'
												: 'border-border hover:bg-muted/50'
										}`}
									>
										<input
											type="radio"
											name="payment"
											value="card"
											checked={paymentMethod === 'card'}
											onChange={() => handlePaymentMethodChange('card')}
											className="accent-primary"
										/>
										<div>
											<p className="font-medium text-sm">Credit / Debit Card</p>
											<p className="text-xs text-muted-foreground">
												Visa, Mastercard, RuPay accepted
											</p>
										</div>
									</label>

									{paymentMethod === 'card' && (
										<div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
											<FormField label="Card Number" id="cardNumber" error={formErrors.cardNumber}>
												<Input
													id="cardNumber"
													name="cardNumber"
													placeholder="1234 5678 9012 3456"
													maxLength={19}
													value={cardForm.cardNumber}
													onChange={handleCardChange}
												/>
											</FormField>
											<div className="grid grid-cols-2 gap-3">
												<FormField label="Expiry" id="expiry" error={formErrors.expiry}>
													<Input
														id="expiry"
														name="expiry"
														placeholder="MM/YY"
														maxLength={5}
														value={cardForm.expiry}
														onChange={handleCardChange}
													/>
												</FormField>
												<FormField label="CVV" id="cvv">
													<Input
														id="cvv"
														name="cvv"
														placeholder="•••"
														maxLength={4}
														type="password"
														value={cardForm.cvv}
														onChange={handleCardChange}
													/>
												</FormField>
											</div>
											<p className="text-xs text-muted-foreground">
												This is a demo — no real payment is processed.
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* ── Right column: Order Summary ── */}
						<div className="space-y-4">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-lg">Order Summary</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Item list */}
									<ul className="divide-y divide-border">
										{items.map((item) => (
											<li
												key={item.id}
												className="flex items-start justify-between py-3 text-sm gap-2"
											>
												<div className="flex-1 min-w-0">
													<p className="font-medium leading-tight truncate">{item.name}</p>
													<p className="text-muted-foreground text-xs mt-0.5">
														Qty: {item.qty}
													</p>
												</div>
												<span className="shrink-0 font-medium">
													₹{(item.price * item.qty).toLocaleString('en-IN')}
												</span>
											</li>
										))}
									</ul>

									{/* Price breakdown */}
									<div className="space-y-2 text-sm border-t pt-3">
										<div className="flex justify-between text-muted-foreground">
											<span>
												Subtotal ({items.length}{' '}
												{items.length === 1 ? 'item' : 'items'})
											</span>
											<span>₹{subtotal.toLocaleString('en-IN')}</span>
										</div>
										<div className="flex justify-between text-muted-foreground">
											<span>Shipping</span>
											<span className="text-green-600 font-medium">Free</span>
										</div>
										<div className="flex justify-between font-semibold text-base border-t pt-2 mt-1">
											<span>Total</span>
											<span>₹{orderTotal.toLocaleString('en-IN')}</span>
										</div>
									</div>

									{/* Error */}
									{error && (
										<p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
											{error}
										</p>
									)}

									{/* CTA */}
									<Button
										onClick={handlePlaceOrder}
										disabled={loading || !isFormValid()}
										className="w-full"
									>
										{loading ? 'Placing Order…' : 'Place Order'}
									</Button>

									<p className="text-xs text-center text-muted-foreground">
										By placing your order you agree to our{' '}
										<span className="underline cursor-pointer">Terms &amp; Conditions</span>.
									</p>
								</CardContent>
							</Card>

							<Link href="/cart" className="block">
								<Button type="button" variant="outline" className="w-full">
									← Back to Cart
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</Section>
		</Container>
	);
};

export default CheckoutPage;
