import { NextResponse } from "next/server";
import { getHomePageData } from "@/features/home/services/home";
import type { HomePageData } from "@/features/home/types";

export const GET = async (): Promise<NextResponse<HomePageData | { message: string }>> => {
  try {
    const data = await getHomePageData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch home page data", error);
    return NextResponse.json(
      { message: "Failed to fetch home page data" },
      { status: 500 },
    );
  }
};
