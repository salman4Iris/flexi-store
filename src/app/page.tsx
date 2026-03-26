"use client";

import React from "react";
import dynamic from "next/dynamic";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import HeroSlider from "@/features/home/components/HeroSlider";
import CategoriesSection from "@/features/home/components/CategoriesSection";
import FeaturesSection from "@/features/home/components/FeaturesSection";
import NewsletterSection from "@/features/home/components/NewsletterSection";

const ProductGrid = dynamic(
  () => import("@/features/products/components/ProductGrid"),
);

function Home(): React.ReactNode {
  return (
    <Container>
      {/* Auto-rotating Hero Slider */}
      <Section>
        <HeroSlider />
      </Section>
      <div className="bg-red-500 px-2 py-3">Test tailwind csss</div>
      {/* Featured Collections */}
      <Section>
        <CategoriesSection />
      </Section>

      {/* Featured Products */}
      <Section>
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
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
}

export default Home;
