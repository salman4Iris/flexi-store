"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useHeroSlides } from "@/features/home/hooks/useHeroSlides";

const SLIDE_DURATION = 5000; // 5 seconds per slide
const TRANSITION_DURATION = 500; // 500ms transition

const HeroSlider = (): React.ReactNode => {
  const { slides, loading, error } = useHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    return (): void => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Handle slide change with transition
  const handleSlideChange = useCallback(
    (slideIndex: number) => {
      if (slides.length === 0) {
        return;
      }

      setCurrentSlide((prev) => {
        if (isTransitioning || prev === slideIndex) return prev;
        setIsTransitioning(true);
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        transitionTimeoutRef.current = setTimeout(
          () => setIsTransitioning(false),
          TRANSITION_DURATION,
        );
        return slideIndex;
      });
    },
    [isTransitioning, slides.length],
  );

  if (loading) {
    return <div className="min-h-125 rounded-lg animate-pulse bg-(--color-bg)" aria-busy="true" />;
  }

  if (error || slides.length === 0) {
    return (
      <div className="min-h-125 rounded-lg flex items-center justify-center text-(--color-text) opacity-75">
        {error ?? "No hero content available."}
      </div>
    );
  }

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
        <h1 className="text-5xl md:text-6xl font-bold text-(--color-text) mb-6">
          {slide.title}
        </h1>
        <p className="text-lg md:text-xl text-(--color-text) mb-8">
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
              className="px-8 py-3 text-lg font-semibold border border-(--color-text) text-(--color-text) hover:bg-(--color-text) hover:text-(--color-bg) transition-colors"
            >
              Browse All
            </Button>
          </Link>
        </div>
      </div>

      {/* Slide indicators/dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((slideItem, index) => (
          <button
            key={slideItem.id}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-(--color-text) w-8 h-3"
                : "bg-(--color-text) bg-opacity-30 w-3 h-3 hover:bg-opacity-50"
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
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 text-(--color-text) p-3 rounded-full transition-colors disabled:opacity-50"
        aria-label="Previous slide"
        disabled={isTransitioning}
      >
        ←
      </button>
      <button
        onClick={() => handleSlideChange((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 text-(--color-text) p-3 rounded-full transition-colors disabled:opacity-50"
        aria-label="Next slide"
        disabled={isTransitioning}
      >
        →
      </button>
    </div>
  );
}

export default HeroSlider;
