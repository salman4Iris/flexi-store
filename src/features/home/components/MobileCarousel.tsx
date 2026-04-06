"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const SLIDE_DURATION = 5000; // 5 seconds per slide
const TRANSITION_DURATION = 500; // 500ms transition

interface MobileCarouselProps<T> {
  items: T[];
  renderItem: (item: T, isTransitioning: boolean) => React.ReactNode;
  itemsPerSlide?: number;
}

const MobileCarousel = React.forwardRef<
  HTMLDivElement,
  MobileCarouselProps<any>
>(({ items, renderItem, itemsPerSlide = 1 }, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate slides
  useEffect(() => {
    if (items.length <= itemsPerSlide) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + itemsPerSlide) % items.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [items.length, itemsPerSlide]);

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
      if (items.length === 0) {
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
          TRANSITION_DURATION
        );
        return slideIndex;
      });
    },
    [isTransitioning, items.length]
  );

  if (items.length === 0) {
    return (
      <div className="min-h-80 rounded-lg flex items-center justify-center text-(--color-text) opacity-75">
        No items available.
      </div>
    );
  }

  const totalSlides = Math.ceil(items.length / itemsPerSlide);
  const currentItems = items.slice(
    currentSlide,
    currentSlide + itemsPerSlide
  );

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-lg"
    >
      {/* Carousel content */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {itemsPerSlide === 1 ? (
          <div>{renderItem(currentItems[0], isTransitioning)}</div>
        ) : (
          <div className="grid gap-4">
            {currentItems.map((item, idx) => (
              <div key={idx}>{renderItem(item, isTransitioning)}</div>
            ))}
          </div>
        )}
      </div>

      {/* Previous button */}
      <button
        onClick={() => {
          const newIndex = (currentSlide - itemsPerSlide + items.length) % items.length;
          handleSlideChange(newIndex);
        }}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-(--color-bg) hover:bg-(--color-text) hover:text-(--color-bg) text-(--color-text) rounded-full p-2 transition-colors opacity-75 hover:opacity-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={() => {
          const newIndex = (currentSlide + itemsPerSlide) % items.length;
          handleSlideChange(newIndex);
        }}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-(--color-bg) hover:bg-(--color-text) hover:text-(--color-bg) text-(--color-text) rounded-full p-2 transition-colors opacity-75 hover:opacity-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide indicators/dots */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index * itemsPerSlide)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === Math.floor(currentSlide / itemsPerSlide)
                  ? "bg-(--color-text) w-3 h-3"
                  : "bg-(--color-text) opacity-40 w-2 h-2 hover:opacity-60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

MobileCarousel.displayName = "MobileCarousel";

export default MobileCarousel;
