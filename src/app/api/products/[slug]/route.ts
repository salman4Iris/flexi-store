import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/features/products/services/mockProducts";
import type { Product } from "@/features/products/types/product";

type ProductRouteContext = {
  params: Promise<{ slug: string }>;
};

export const GET = async (
  _request: NextRequest,
  context: ProductRouteContext,
): Promise<NextResponse<Product | { message: string }>> => {
  try {
    const { slug } = await context.params;
    const product = await getProductById(slug);

    if (!product) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
};
