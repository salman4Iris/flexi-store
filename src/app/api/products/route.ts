import { NextResponse } from 'next/server';

const mock = [
  { id: 'product-1', name: 'Premium Shoes', price: 2499, image: 'https://via.placeholder.com/300' },
  { id: 'product-2', name: 'Luxury Watch', price: 5999, image: 'https://via.placeholder.com/300' },
  { id: 'product-3', name: 'Casual Shirt', price: 899, image: 'https://via.placeholder.com/300' },
];

export async function GET() {
  return NextResponse.json(mock);
}
