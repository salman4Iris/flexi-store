import { getProductById, mockProducts } from "@/features/products/services/mockProducts";
import type { Product } from "@/features/products/types/product";

export type GetProductsOptions = {
  category?: string;
};

export const getProducts = async (
  options: GetProductsOptions = {},
): Promise<Product[]> => {
  const normalizedCategory = options.category?.trim().toLowerCase();

  if (!normalizedCategory) {
    return [...mockProducts];
  }

  return mockProducts.filter(
    (product) => product.category.toLowerCase() === normalizedCategory,
  );
};

export const getProduct = async (slug: string): Promise<Product | null> => {
  return getProductById(slug) ?? null;
};