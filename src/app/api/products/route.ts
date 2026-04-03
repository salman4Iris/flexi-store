import { NextRequest, NextResponse } from "next/server";
import { getProductCatalog } from "@/features/products/services/mockProducts";
import type { Product } from "@/features/products/types/product";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<Product[] | { message: string }>> => {
  try {
    const category = request.nextUrl.searchParams.get("category")?.trim().toLowerCase();
    const products = await getProductCatalog();

    if (!category) {
      return NextResponse.json(products);
    }

    const filteredProducts = products.filter(
      (product) => product.category.toLowerCase() === category,
    );

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("Failed to fetch products", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
};
