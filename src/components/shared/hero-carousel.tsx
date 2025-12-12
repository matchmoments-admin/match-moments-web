'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { ICONS } from '@/lib/sport-icons';
import { iconClass, ICON_TRANSITIONS } from '@/lib/icon-styles';

export interface HeroSlide {
  id: string;
  title: string;
  category: string;
  categoryBadgeColor?: string;
  imageUrl: string;
  href: string;
  metadata?: string;
  hasPlayButton?: boolean;
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function HeroCarousel({
  slides,
  autoPlay = false,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <div className="relative h-[400px] w-full overflow-hidden bg-black md:h-[600px]">
      {/* Image */}
      <Image
        src={slide.imageUrl}
        alt={slide.title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      {/* Play Button (if applicable) */}
      {slide.hasPlayButton && (
        <Link href={slide.href}>
          <button className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 transition-all hover:scale-110 hover:bg-white md:h-16 md:w-16">
            <ICONS.play className={iconClass('nav', 'ml-1 text-black md:h-8 md:w-8', ICON_TRANSITIONS.default)} />
          </button>
        </Link>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 md:p-8 md:pb-12">
        <div className="mx-auto max-w-[1920px]">
          {/* Category Badge */}
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-white md:text-sm ${
              slide.categoryBadgeColor || 'bg-blue-500'
            }`}
          >
            {slide.category}
          </span>

          {/* Title */}
          <Link href={slide.href}>
            <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white transition-opacity hover:opacity-90 md:mt-4 md:text-[56px] md:leading-[56px] md:tracking-[-1.41634px]">
              {slide.title}
            </h2>
          </Link>

          {/* Metadata */}
          {slide.metadata && (
            <p className="mt-2 text-sm font-normal text-white/90 md:text-base">
              {slide.metadata}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-gray-100 md:left-6 md:h-10 md:w-10"
            aria-label="Previous slide"
          >
            <IoChevronBackOutline className={iconClass('nav', 'md:h-6 md:w-6', ICON_TRANSITIONS.default)} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-gray-100 md:right-6 md:h-10 md:w-10"
            aria-label="Next slide"
          >
            <IoChevronForwardOutline className={iconClass('nav', 'md:h-6 md:w-6', ICON_TRANSITIONS.default)} />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

