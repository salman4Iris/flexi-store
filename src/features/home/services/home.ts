import { getHeroSlides } from "./heroSlides";
import { getCategories } from "./categories";
import { getStoreFeatures } from "./storeFeatures";
import { getProductCatalog } from "@/features/products/services/mockProducts";
import type { HomePageData } from "@/features/home/types";

export const getHomePageData = async (): Promise<HomePageData> => {
  try {
    const [heroSlides, categories, storeFeatures, products] = await Promise.all([
      getHeroSlides(),
      getCategories(),
      getStoreFeatures(),
      getProductCatalog(),
    ]);

    return {
      heroSlides,
      categories,
      storeFeatures,
      products,
    };
  } catch (error) {
    console.error("Failed to fetch home page data", error);
    throw new Error("Failed to fetch home page data");
  }
};
