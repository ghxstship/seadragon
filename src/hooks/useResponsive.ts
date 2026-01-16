
/**
 * SaaS UI Trends 2026 - Mobile-First Responsive Utilities
 * Hooks and utilities for responsive design
 */

import { useState, useEffect, useCallback } from 'react';

export const breakpoints = {
  xs: 320,   // Small phones
  sm: 640,   // Large phones
  md: 768,   // Tablets
  lg: 1024,  // Small laptops
  xl: 1280,  // Desktops
  '2xl': 1536, // Large desktops
};

export type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to check if a media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Hook to get current breakpoint information
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
  const isLargeDesktop = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);

  const current: Breakpoint = isMobile
    ? 'xs'
    : isTablet
    ? 'md'
    : isLargeDesktop
    ? 'xl'
    : 'lg';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    current,
    isAtLeast: (bp: Breakpoint) => {
      const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      return order.indexOf(current) >= order.indexOf(bp);
    },
    isAtMost: (bp: Breakpoint) => {
      const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      return order.indexOf(current) <= order.indexOf(bp);
    },
  };
}

/**
 * Hook to get window dimensions
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * Hook for touch detection
 */
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };

    checkTouch();
  }, []);

  return isTouch;
}

/**
 * Hook for swipe gestures
 */
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        onSwipeRight?.();
      } else if (deltaX < -threshold) {
        onSwipeLeft?.();
      }
    } else {
      if (deltaY > threshold) {
        onSwipeDown?.();
      } else if (deltaY < -threshold) {
        onSwipeUp?.();
      }
    }

    setTouchStart(null);
  }, [touchStart, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Hook for orientation detection
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOrientation = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
}

/**
 * Hook for safe area insets (iOS notch, etc.)
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const computeStyle = getComputedStyle(document.documentElement);
    
    setSafeArea({
      top: parseInt(computeStyle.getPropertyValue('--sat') || '0', 10),
      right: parseInt(computeStyle.getPropertyValue('--sar') || '0', 10),
      bottom: parseInt(computeStyle.getPropertyValue('--sab') || '0', 10),
      left: parseInt(computeStyle.getPropertyValue('--sal') || '0', 10),
    });
  }, []);

  return safeArea;
}

/**
 * Hook for scroll position
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

/**
 * Hook for scroll direction
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return scrollDirection;
}

/**
 * Responsive value helper
 */
export function responsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint
): T | undefined {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = order.indexOf(currentBreakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const bp = order[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
}

const responsiveUtils = {
  breakpoints,
  useMediaQuery,
  useBreakpoint,
  useWindowSize,
  useTouch,
  useSwipe,
  useOrientation,
  useSafeArea,
  useScrollPosition,
  useScrollDirection,
  responsiveValue,
};

export default responsiveUtils;
