import fs from "fs/promises";
import path from "path";
import type { Category } from "@/features/home/types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

export const getCategories = async (): Promise<Category[]> => {
  const raw = await fs.readFile(CATEGORIES_FILE, "utf-8");
  return JSON.parse(raw) as Category[];
};
