import type { Product } from "@/features/products/types/product";

export type GetProductsOptions = {
  category?: string;
  search?: string;
};

export const getProducts = async (
  options: GetProductsOptions = {},
): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (options.category?.trim()) {
    params.set("category", options.category.trim());
  }

  if (options.search?.trim()) {
    params.set("search", options.search.trim());
  }

  const query = params.toString();
  const url = query ? `/api/products?${query}` : "/api/products";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return (await response.json()) as Product[];
};

export const getProduct = async (slug: string): Promise<Product | null> => {
  const response = await fetch(`/api/products/${slug}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return (await response.json()) as Product;
};