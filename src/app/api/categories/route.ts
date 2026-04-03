import { NextResponse } from "next/server";
import { getCategories } from "@/features/home/services/categories";
import type { Category } from "@/features/home/types";

export const GET = async (
): Promise<NextResponse<Category[] | { message: string }>> => {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 },
    );
  }
};
