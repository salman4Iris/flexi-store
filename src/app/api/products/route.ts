import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/features/products/services/mockProducts";
import type { Product } from "@/features/products/types/product";

export async function GET(request: NextRequest): Promise<NextResponse<Product[]>> {
  const category = request.nextUrl.searchParams.get("category");

  const filteredProducts = category
    ? mockProducts.filter((product) => product.category === category)
    : mockProducts;

  return NextResponse.json(filteredProducts);
}
