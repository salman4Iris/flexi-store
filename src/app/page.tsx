import React from "react";
import dynamic from "next/dynamic";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import HeroSlider from "@/features/home/components/HeroSlider";
import type { HomePageData } from "@/features/home/types";

const CategoriesSection = dynamic(
  () => import("@/features/home/components/CategoriesSection"),
);

const FeaturesSection = dynamic(
  () => import("@/features/home/components/FeaturesSection"),
);

const NewsletterSection = dynamic(
  () => import("@/features/home/components/NewsletterSection"),
);

const ProductGrid = dynamic(
  () => import("@/features/products/components/ProductGrid"),
);

const Home = async (): Promise<React.ReactNode> => {
  let homeData: HomePageData | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(`http://localhost:3000/api/home`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch home page data");
    }

    homeData = (await response.json()) as HomePageData;
  } catch (err) {
    console.error("Error fetching home page data:", err);
    error = "Failed to load home page data";
  }

  if (error || !homeData) {
    return (
      <Container>
        <Section>
          <div className="text-center py-12">
            <p className="text-red-500">
              {error || "Unable to load page content"}
            </p>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      {/* Auto-rotating Hero Slider */}
      <Section>
        <HeroSlider slides={homeData.heroSlides} />
      </Section>
      {/* Featured Collections */}
      <Section>
        <CategoriesSection categories={homeData.categories} />
      </Section>

      {/* Featured Products */}
      <Section>
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-(--color-text) mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-(--color-text) opacity-75">
              Check out our handpicked selection of trending and bestselling
              items
            </p>
          </div>
          <ProductGrid products={homeData.products} />
        </div>
      </Section>

      {/* Why Shop With Us */}
      <Section>
        <FeaturesSection features={homeData.storeFeatures} />
      </Section>

      {/* Newsletter Section */}
      <Section>
        <NewsletterSection />
      </Section>
    </Container>
  );
};

export default Home;
