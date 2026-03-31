"use client";

import React from "react";
import dynamic from "next/dynamic";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import HeroSlider from "@/features/home/components/HeroSlider";

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

const Home = (): React.ReactNode => {
  return (
    <Container>
      {/* Auto-rotating Hero Slider */}
      <Section>
        <HeroSlider />
      </Section>
      {/* Featured Collections */}
      <Section>
        <CategoriesSection />
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
          <ProductGrid />
        </div>
      </Section>

      {/* Why Shop With Us */}
      <Section>
        <FeaturesSection />
      </Section>

      {/* Newsletter Section */}
      <Section>
        <NewsletterSection />
      </Section>
    </Container>
  );
};

export default Home;
