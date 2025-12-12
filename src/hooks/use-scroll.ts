'use client';

import { useEffect, useState } from 'react';

export interface UseScrollOptions {
  threshold?: number;
  throttle?: number;
}

/**
 * Hook to detect scroll position and direction
 * Used for sticky header and scroll-based animations
 */
export function useScroll(options: UseScrollOptions = {}) {
  const { threshold = 0, throttle = 100 } = options;
  
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollState = () => {
      const scrollY = window.pageYOffset;

      setScrollY(scrollY);
      setIsScrolled(scrollY > threshold);

      if (scrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (scrollY < lastScrollY) {
        setScrollDirection('up');
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { scrollY, scrollDirection, isScrolled };
}

/**
 * Hook to detect if element is in viewport
 * Useful for lazy loading and animations
 */
export function useInView(ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasBeenInView(true);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return { isInView, hasBeenInView };
}

