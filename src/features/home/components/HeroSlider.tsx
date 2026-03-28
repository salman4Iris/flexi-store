"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  category: string;
  categoryLabel: string;
  icon: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: "electronics",
    title: "Latest Tech Gadgets",
    subtitle:
      "Discover cutting-edge electronics and smart devices for modern living",
    gradient: "from-blue-50 to-indigo-50",
    category: "electronics",
    categoryLabel: "Electronics",
    icon: "📱",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
  },
  {
    id: "fashion",
    title: "Trendy Fashion Collections",
    subtitle: "Explore exclusive clothing and accessories from top brands",
    gradient: "from-purple-50 to-pink-50",
    category: "fashion",
    categoryLabel: "Fashion",
    icon: "👗",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  },
  {
    id: "home",
    title: "Home & Living Essentials",
    subtitle: "Transform your space with our curated furniture and decor",
    gradient: "from-green-50 to-emerald-50",
    category: "home",
    categoryLabel: "Home & Living",
    icon: "🏠",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide
const TRANSITION_DURATION = 500; // 500ms transition

export function HeroSlider(): React.ReactNode {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  // Handle slide change with transition
  const handleSlideChange = useCallback(
    (slideIndex: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(slideIndex);
      setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
    },
    [isTransitioning],
  );

  const slide = slides[currentSlide];

  return (
    <div className="relative min-h-125 flex items-center justify-center overflow-hidden rounded-lg">
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out bg-linear-to-r ${slide.gradient}`}
        key={slide.id}
      />

      {/* Decorative blobs */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      {/* Product Image */}
      <div className="absolute right-0 top-0 w-1/2 h-full hidden md:block overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={slide.image}
            alt={slide.categoryLabel}
            fill
            sizes="(max-width: 767px) 0px, 50vw"
            className={`object-cover transition-opacity duration-500 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            priority
          />
          {/* Image fade overlay */}
          <div className="absolute inset-0 bg-linear-to-l from-transparent to-white opacity-60 z-10"></div>
        </div>
      </div>

      {/* Slide content with fade animation */}
      <div
        className={`relative z-10 max-w-2xl mx-auto text-center px-4 transition-opacity duration-500 ease-in-out md:text-left md:ml-0 md:max-w-xl ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text)] mb-6">
          {slide.title}
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-text)] mb-8">
          {slide.subtitle}
        </p>

        {/* CTA Buttons that filter by category */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/products?category=${slide.category}`}>
            <Button className="px-8 py-3 text-lg font-semibold">
              Shop {slide.categoryLabel}
            </Button>
          </Link>
          <Link href="/products">
            <Button
              variant="outline"
              className="px-8 py-3 text-lg font-semibold border border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors"
            >
              Browse All
            </Button>
          </Link>
        </div>
      </div>

      {/* Slide indicators/dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-[var(--color-text)] w-8 h-3"
                : "bg-[var(--color-text)] bg-opacity-30 w-3 h-3 hover:bg-opacity-50"
            }`}
            disabled={isTransitioning}
          />
        ))}
      </div>

      {/* Navigation arrows (optional) */}
      <button
        onClick={() =>
          handleSlideChange((currentSlide - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 text-[var(--color-text)] p-3 rounded-full transition-colors disabled:opacity-50"
        aria-label="Previous slide"
        disabled={isTransitioning}
      >
        ←
      </button>
      <button
        onClick={() => handleSlideChange((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 text-[var(--color-text)] p-3 rounded-full transition-colors disabled:opacity-50"
        aria-label="Next slide"
        disabled={isTransitioning}
      >
        →
      </button>
    </div>
  );
}

export default HeroSlider;
