import fs from "fs/promises";
import path from "path";
import type { Slide } from "@/features/home/types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const HERO_SLIDES_FILE = path.join(DATA_DIR, "hero-slides.json");

export const getHeroSlides = async (): Promise<Slide[]> => {
  const raw = await fs.readFile(HERO_SLIDES_FILE, "utf-8");
  return JSON.parse(raw) as Slide[];
};
