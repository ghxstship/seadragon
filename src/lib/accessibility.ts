
/**
 * SaaS UI Trends 2026 - Accessibility Utilities
 * WCAG 2.2 compliant accessibility helpers
 */

/**
 * Calculate relative luminance of a color
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG requirements
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Find an accessible color variation
 */
export function findAccessibleColor(
  baseColor: string,
  backgroundColor: string,
  minContrast: number = 4.5
): string {
  let color = baseColor;
  const bgLuminance = getRelativeLuminance(backgroundColor);
  const shouldLighten = bgLuminance > 0.5;
  
  for (let i = 0; i < 20; i++) {
    const ratio = getContrastRatio(color, backgroundColor);
    if (ratio >= minContrast) {
      return color;
    }
    
    color = shouldLighten ? darkenColor(color, 5) : lightenColor(color, 5);
  }
  
  return color;
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Lighten a color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = percent / 100;
  return rgbToHex(
    rgb.r + (255 - rgb.r) * factor,
    rgb.g + (255 - rgb.g) * factor,
    rgb.b + (255 - rgb.b) * factor
  );
}

/**
 * Darken a color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - percent / 100;
  return rgbToHex(
    rgb.r * factor,
    rgb.g * factor,
    rgb.b * factor
  );
}

/**
 * Generate a unique ID for accessibility attributes
 */
let idCounter = 0;
export function generateAccessibleId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return;

  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;

  document.body.appendChild(announcer);

  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Trap focus within an element (for modals, dialogs)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get appropriate animation duration based on user preferences
 */
export function getAnimationDuration(baseDuration: number): number {
  return prefersReducedMotion() ? 0 : baseDuration;
}

/**
 * Skip link component helper
 */
export interface SkipLink {
  id: string;
  label: string;
  targetId: string;
}

export const defaultSkipLinks: SkipLink[] = [
  { id: 'skip-to-main', label: 'Skip to main content', targetId: 'main-content' },
  { id: 'skip-to-nav', label: 'Skip to navigation', targetId: 'main-navigation' },
];

/**
 * Keyboard navigation helpers
 */
export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
export const SELECTION_KEYS = ['Enter', ' '];

export function isArrowKey(key: string): boolean {
  return ARROW_KEYS.includes(key);
}

export function isSelectionKey(key: string): boolean {
  return SELECTION_KEYS.includes(key);
}

/**
 * Calculate next index for keyboard navigation
 */
export function getNextIndex(
  currentIndex: number,
  totalItems: number,
  direction: 'next' | 'prev',
  loop: boolean = true
): number {
  if (direction === 'next') {
    const next = currentIndex + 1;
    return loop ? next % totalItems : Math.min(next, totalItems - 1);
  } else {
    const prev = currentIndex - 1;
    return loop ? (prev + totalItems) % totalItems : Math.max(prev, 0);
  }
}

const accessibilityUtils = {
  getRelativeLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  findAccessibleColor,
  hexToRgb,
  rgbToHex,
  lightenColor,
  darkenColor,
  generateAccessibleId,
  announceToScreenReader,
  trapFocus,
  prefersReducedMotion,
  prefersHighContrast,
  getAnimationDuration,
  isArrowKey,
  isSelectionKey,
  getNextIndex,
};

export default accessibilityUtils;
