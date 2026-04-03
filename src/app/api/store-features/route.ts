import { NextResponse } from "next/server";
import { getStoreFeatures } from "@/features/home/services/storeFeatures";
import type { StoreFeature } from "@/features/home/types";

export const GET = async (
): Promise<NextResponse<StoreFeature[] | { message: string }>> => {
  try {
    const features = await getStoreFeatures();
    return NextResponse.json(features);
  } catch (error) {
    console.error("Failed to fetch store features", error);
    return NextResponse.json(
      { message: "Failed to fetch store features" },
      { status: 500 },
    );
  }
};
