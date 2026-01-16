
/**
 * SaaS UI Trends 2026 - Extended Design Tokens
 * Comprehensive token system for adaptive, accessible, and modern interfaces
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Neutral/Gray Scale
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic Colors
  semantic: {
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    info: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
  },
  // Extended semantic colors for charts and UI
  extended: {
    violet: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    lime: {
      50: '#f7fefa',
      100: '#ecfdf5',
      200: '#d1fae5',
      300: '#a7f3d0',
      400: '#6ee7b7',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314',
    },
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
    chart: {
      default: '#4b9cff',
      fallback: '#64748b',
    },
  },
  gradients: {
    primary: 'linear-gradient(120deg, #e53935 0%, #ffc107 45%, #1e88e5 100%)',
    success: 'linear-gradient(120deg, #16a34a 0%, #22d3ee 100%)',
    warm: 'linear-gradient(120deg, #f97316 0%, #ec4899 55%, #8b5cf6 100%)',
    cool: 'linear-gradient(120deg, #22d3ee 0%, #2563eb 55%, #1e88e5 100%)',
    sunset: 'linear-gradient(120deg, #f43f5e 0%, #f59e0b 50%, #fde047 100%)',
    ocean: 'linear-gradient(120deg, #0ea5e9 0%, #1e3a8a 100%)',
    atmosphere: 'radial-gradient(ellipse at top, rgba(30, 136, 229, 0.16) 0%, transparent 50%)',
    glow: 'radial-gradient(circle at center, rgba(255, 193, 7, 0.2) 0%, transparent 70%)',
  },
};

// ============================================================================
// THEME CONFIGURATIONS
// ============================================================================

export const themes = {
  light: {
    name: 'light',
    colors: {
      // Backgrounds
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      bgTertiary: '#f1f5f9',
      bgElevated: '#ffffff',
      
      // Surfaces
      surfaceDefault: '#ffffff',
      surfaceHover: '#f8fafc',
      surfaceActive: '#f1f5f9',
      surfaceOverlay: 'rgba(0, 0, 0, 0.5)',
      
      // Text
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      textInverse: '#ffffff',
      
      // Borders
      borderDefault: '#e2e8f0',
      borderStrong: '#cbd5e1',
      borderFocus: '#3b82f6',
      
      // Interactive
      accentPrimary: '#3b82f6',
      accentSecondary: '#2563eb',
      accentTertiary: '#1d4ed8',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    },
  },

  dark: {
    name: 'dark',
    colors: {
      // Backgrounds
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      bgElevated: '#1e293b',
      
      // Surfaces
      surfaceDefault: '#1e293b',
      surfaceHover: '#334155',
      surfaceActive: '#475569',
      surfaceOverlay: 'rgba(0, 0, 0, 0.7)',
      
      // Text
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textInverse: '#0f172a',
      
      // Borders
      borderDefault: '#334155',
      borderStrong: '#475569',
      borderFocus: '#60a5fa',
      
      // Interactive
      accentPrimary: '#60a5fa',
      accentSecondary: '#3b82f6',
      accentTertiary: '#2563eb',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
    },
  },

  lowLight: {
    name: 'lowLight',
    colors: {
      // Softer, atmospheric backgrounds
      bgPrimary: '#1a1f2e',
      bgSecondary: '#232938',
      bgTertiary: '#2d3444',
      bgElevated: '#2d3444',
      
      // Muted surfaces
      surfaceDefault: '#232938',
      surfaceHover: '#2d3444',
      surfaceActive: '#3d4454',
      surfaceOverlay: 'rgba(0, 0, 0, 0.6)',
      
      // Reduced contrast text
      textPrimary: '#e2e8f0',
      textSecondary: '#a8b3c4',
      textMuted: '#7a8599',
      textInverse: '#1a1f2e',
      
      // Subtle borders
      borderDefault: '#3d4454',
      borderStrong: '#4d5464',
      borderFocus: '#818cf8',
      
      // Interactive (softer accents)
      accentPrimary: '#818cf8',
      accentSecondary: '#6366f1',
      accentTertiary: '#4f46e5',
    },
    shadows: {
      // Soft glows instead of hard shadows
      sm: '0 0 8px rgba(99, 102, 241, 0.1)',
      md: '0 0 16px rgba(99, 102, 241, 0.15)',
      lg: '0 0 24px rgba(99, 102, 241, 0.2)',
      xl: '0 0 32px rgba(99, 102, 241, 0.25)',
    },
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, monospace",
  },

  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ============================================================================
// SPACING (4px base unit)
// ============================================================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px (touch target)
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  40: '10rem',      // 160px
  48: '12rem',      // 192px
  56: '14rem',      // 224px
  64: '16rem',      // 256px
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// ============================================================================
// MOTION & ANIMATION
// ============================================================================

export const motion = {
  // Timing functions
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    linear: 'linear',
  },

  // Duration guidelines (200-500ms sweet spot)
  duration: {
    instant: '75ms',
    fast: '150ms',
    normal: '200ms',
    moderate: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  // Keyframe animations
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    slideInUp: {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideInDown: {
      from: { transform: 'translateY(-10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideInLeft: {
      from: { transform: 'translateX(-10px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    slideInRight: {
      from: { transform: 'translateX(10px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    scaleOut: {
      from: { transform: 'scale(1)', opacity: 1 },
      to: { transform: 'scale(0.95)', opacity: 0 },
    },
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '25%': { transform: 'translateX(-5px)' },
      '75%': { transform: 'translateX(5px)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    shimmer: {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' },
    },
  },
};

// ============================================================================
// BREAKPOINTS (Mobile-first)
// ============================================================================

export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
};

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  overlay: 90,
  max: 9999,
};

// ============================================================================
// GLASSMORPHISM PRESETS
// ============================================================================

export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    background: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  subtle: {
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
};

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export const accessibility = {
  focusRing: '0 0 0 3px rgba(59, 130, 246, 0.5)',
  focusRingOffset: '2px',
  minTouchTarget: '44px',
  minContrastRatio: 4.5,
  reducedMotionDuration: '0.01ms',
};

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const tokens = {
  colors,
  themes,
  typography,
  spacing,
  borderRadius,
  motion,
  breakpoints,
  zIndex,
  glassmorphism,
  accessibility,
};

export default tokens;
