import { NextResponse } from "next/server";

const mock: { [key: string]: { id: string; name: string; price: number; image: string; description: string } } = {
  "product-1": {
    id: "product-1",
    name: "Premium Shoes",
    price: 2499,
    image: "https://via.placeholder.com/600",
    description: "Comfortable premium shoes.",
  },
  "product-2": {
    id: "product-2",
    name: "Luxury Watch",
    price: 5999,
    image: "https://via.placeholder.com/600",
    description: "Elegant luxury watch.",
  },
  "product-3": {
    id: "product-3",
    name: "Casual Shirt",
    price: 899,
    image: "https://via.placeholder.com/600",
    description: "Soft casual shirt.",
  },
};

export async function GET(...args: any) {
  const context = args[1] || {};
  // `context.params` may be a Promise in some Next.js runtimes — unwrap if needed
  let params = context.params || {};
  if (params && typeof params.then === "function") {
    params = await params;
  }
  const slug = params?.slug as string | undefined;
  if (!slug) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const product = mock[slug];
  if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}
