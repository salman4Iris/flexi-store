"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const SLIDE_DURATION = 4000; // 4 seconds per slide
const TRANSITION_DURATION = 300; // 300ms transition

interface ImageCarouselProps {
  images: string[];
  alt: string;
  discount?: number;
}

const ImageCarousel = React.forwardRef<HTMLDivElement, ImageCarouselProps>(
  ({ images, alt, discount }, ref) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-rotate images only if more than one image
    useEffect(() => {
      if (images.length <= 1) {
        return;
      }

      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, SLIDE_DURATION);

      return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
      return (): void => {
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
      };
    }, []);

    // Handle image change with transition
    const handleImageChange = useCallback(
      (index: number) => {
        if (images.length === 0) {
          return;
        }

        setCurrentImageIndex((prev) => {
          if (isTransitioning || prev === index) return prev;
          setIsTransitioning(true);
          if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
          }
          transitionTimeoutRef.current = setTimeout(
            () => setIsTransitioning(false),
            TRANSITION_DURATION
          );
          return index;
        });
      },
      [isTransitioning, images.length]
    );

    if (images.length === 0) {
      return (
        <div className="relative bg-(--color-bg) border border-(--color-text) border-opacity-10 rounded-lg overflow-hidden flex items-center justify-center aspect-square">
          <div className="text-(--color-text) opacity-75">No image available</div>
        </div>
      );
    }

    const currentImage = images[currentImageIndex];

    return (
      <div
        ref={ref}
        className="relative bg-(--color-bg) border border-(--color-text) border-opacity-10 rounded-lg overflow-hidden flex items-center justify-center aspect-square"
      >
        {/* Image with transition */}
        <div
          className={`relative w-full h-full transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={currentImage}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-contain p-8"
            priority={currentImageIndex === 0}
          />
        </div>

        {/* Discount badge */}
        {discount && discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {discount}% OFF
          </div>
        )}

        {/* Only show controls if more than 1 image */}
        {images.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={() =>
                handleImageChange(
                  (currentImageIndex - 1 + images.length) % images.length
                )
              }
              aria-label="Previous image"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-(--color-bg) hover:bg-(--color-text) hover:text-(--color-bg) text-(--color-text) rounded-full p-2 transition-colors opacity-75 hover:opacity-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              onClick={() =>
                handleImageChange((currentImageIndex + 1) % images.length)
              }
              aria-label="Next image"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-(--color-bg) hover:bg-(--color-text) hover:text-(--color-bg) text-(--color-text) rounded-full p-2 transition-colors opacity-75 hover:opacity-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image indicators/dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentImageIndex
                      ? "bg-(--color-text) w-2 h-2"
                      : "bg-(--color-text) opacity-40 w-1.5 h-1.5 hover:opacity-60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
);

ImageCarousel.displayName = "ImageCarousel";

export default ImageCarousel;
