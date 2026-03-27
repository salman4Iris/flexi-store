import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/features/products/services/mockProducts";
import type { Product } from "@/features/products/types/product";

type ProductRouteContext = {
  params: Promise<{ slug: string }> | { slug: string };
};

function isPromise<T>(value: Promise<T> | T): value is Promise<T> {
  return typeof (value as Promise<T>).then === "function";
}

export async function GET(
  _request: NextRequest,
  context: ProductRouteContext,
): Promise<NextResponse<Product | { message: string }>> {
  const params = isPromise(context.params)
    ? await context.params
    : context.params;
  const product = getProductById(params.slug);

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
