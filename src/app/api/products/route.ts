import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/features/products/services/products";
import type { Product } from "@/features/products/types/product";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<Product[]>> => {
  const category = request.nextUrl.searchParams.get("category");

  const filteredProducts = await getProducts({
    category: category ?? undefined,
  });

  return NextResponse.json(filteredProducts);
};
