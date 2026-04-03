import fs from "fs/promises";
import path from "path";
import type { Product } from "@/features/products/types/product";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

const readProducts = async (): Promise<Product[]> => {
  try {
    const raw = await fs.readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
};

export const getProductCatalog = async (): Promise<Product[]> => {
  return readProducts();
};

export const getProductById = async (
  productId: string,
): Promise<Product | undefined> => {
  const products = await readProducts();
  return products.find((product) => product.id === productId);
};
