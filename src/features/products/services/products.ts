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

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const toSlug = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getProduct = async (slug: string): Promise<Product | null> => {
  const normalizedSlug = toSlug(safeDecode(slug));
  const byId = getProductById(safeDecode(slug));

  if (byId) {
    return byId;
  }

  const product = mockProducts.find((item) => {
    const normalizedId = toSlug(item.id);
    const normalizedName = toSlug(item.name);
    return normalizedId === normalizedSlug || normalizedName === normalizedSlug;
  });

  return product ?? null;
};