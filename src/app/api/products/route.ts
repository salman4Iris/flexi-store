import { NextRequest, NextResponse } from "next/server";
import { getProductCatalog } from "@/features/products/services/mockProducts";
import type { Product } from "@/features/products/types/product";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<Product[] | { message: string }>> => {
  try {
    const category = request.nextUrl.searchParams.get("category")?.trim().toLowerCase();
    const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase();
    const products = await getProductCatalog();

    let filteredProducts = products;

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category,
      );
    }

    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search),
      );
    }

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("Failed to fetch products", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
};
