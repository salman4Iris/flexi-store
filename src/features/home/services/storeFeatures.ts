import fs from "fs/promises";
import path from "path";
import type { StoreFeature } from "@/features/home/types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const STORE_FEATURES_FILE = path.join(DATA_DIR, "store-features.json");

export const getStoreFeatures = async (): Promise<StoreFeature[]> => {
  const raw = await fs.readFile(STORE_FEATURES_FILE, "utf-8");
  return JSON.parse(raw) as StoreFeature[];
};
