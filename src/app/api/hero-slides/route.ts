import { NextResponse } from "next/server";
import { getHeroSlides } from "@/features/home/services/heroSlides";
import type { Slide } from "@/features/home/types";

export const GET = async (
): Promise<NextResponse<Slide[] | { message: string }>> => {
  try {
    const slides = await getHeroSlides();
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Failed to fetch hero slides", error);
    return NextResponse.json(
      { message: "Failed to fetch hero slides" },
      { status: 500 },
    );
  }
};
