import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/features/products/services/products";
import type { Product } from "@/features/products/types/product";

type ProductRouteContext = {
  params: Promise<{ slug: string }>;
};

export const GET = async (
  _request: NextRequest,
  context: ProductRouteContext,
): Promise<NextResponse<Product | { message: string }>> => {
  const { slug } = await context.params;
  const product = await getProduct(slug);

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
};
