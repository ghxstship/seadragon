
/**
 * SaaS UI Trends 2026 - Theme System
 * Light, Dark, and Low-Light theme configurations with CSS variable generation
 */

import { themes as themeTokens, colors, glassmorphism } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'lowLight' | 'auto';
export type ResolvedTheme = 'light' | 'dark' | 'lowLight';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgElevated: string;
  surfaceDefault: string;
  surfaceHover: string;
  surfaceActive: string;
  surfaceOverlay: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  borderDefault: string;
  borderStrong: string;
  borderFocus: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  shadows: ThemeShadows;
}

export const themes: Record<ResolvedTheme, Theme> = themeTokens as Record<ResolvedTheme, Theme>;

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSS(theme: Theme): string {
  const lines: string[] = [];

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`--${cssKey}: ${value};`);
  });

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    lines.push(`--shadow-${key}: ${value};`);
  });

  return lines.join('\n  ');
}

/**
 * Generate complete CSS for all themes
 */
export function generateAllThemesCSS(): string {
  return `
/* Light Theme (Default) */
:root,
[data-theme="light"] {
  color-scheme: light;
  ${generateThemeCSS(themes.light)}
  
  /* Glassmorphism */
  --glass-bg: ${glassmorphism.light.background};
  --glass-blur: ${glassmorphism.light.backdropFilter};
  --glass-border: ${glassmorphism.light.border};
  --glass-shadow: ${glassmorphism.light.boxShadow};
  
  /* Semantic Colors */
  --color-success: ${colors.semantic.success[500]};
  --color-success-light: ${colors.semantic.success[100]};
  --color-warning: ${colors.semantic.warning[500]};
  --color-warning-light: ${colors.semantic.warning[100]};
  --color-error: ${colors.semantic.error[500]};
  --color-error-light: ${colors.semantic.error[100]};
  --color-info: ${colors.semantic.info[500]};
  --color-info-light: ${colors.semantic.info[100]};
}

/* Dark Theme */
[data-theme="dark"] {
  color-scheme: dark;
  ${generateThemeCSS(themes.dark)}
  
  /* Glassmorphism */
  --glass-bg: ${glassmorphism.dark.background};
  --glass-blur: ${glassmorphism.dark.backdropFilter};
  --glass-border: ${glassmorphism.dark.border};
  --glass-shadow: ${glassmorphism.dark.boxShadow};
  
  /* Semantic Colors (adjusted for dark) */
  --color-success: ${colors.semantic.success[400]};
  --color-success-light: ${colors.semantic.success[900]};
  --color-warning: ${colors.semantic.warning[400]};
  --color-warning-light: ${colors.semantic.warning[900]};
  --color-error: ${colors.semantic.error[400]};
  --color-error-light: ${colors.semantic.error[900]};
  --color-info: ${colors.semantic.info[400]};
  --color-info-light: ${colors.semantic.info[900]};
}

/* Low-Light Theme */
[data-theme="lowLight"] {
  color-scheme: dark;
  ${generateThemeCSS(themes.lowLight)}
  
  /* Glassmorphism (softer) */
  --glass-bg: rgba(35, 41, 56, 0.8);
  --glass-blur: blur(20px);
  --glass-border: 1px solid rgba(255, 255, 255, 0.05);
  --glass-shadow: 0 0 24px rgba(99, 102, 241, 0.15);
  
  /* Semantic Colors (muted for low-light) */
  --color-success: ${colors.semantic.success[400]};
  --color-success-light: rgba(16, 185, 129, 0.15);
  --color-warning: ${colors.semantic.warning[400]};
  --color-warning-light: rgba(245, 158, 11, 0.15);
  --color-error: ${colors.semantic.error[400]};
  --color-error-light: rgba(239, 68, 68, 0.15);
  --color-info: ${colors.semantic.info[400]};
  --color-info-light: rgba(6, 182, 212, 0.15);
}

/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;
    ${generateThemeCSS(themes.dark)}
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --text-secondary: #1a1a1a;
    --border-default: #000000;
  }
  
  [data-theme="dark"],
  [data-theme="lowLight"] {
    --text-primary: #ffffff;
    --text-secondary: #f0f0f0;
    --border-default: #ffffff;
  }
  
  button,
  input,
  select,
  textarea {
    border-width: 2px !important;
  }
}

/* Theme transition */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Smooth theme transitions for components */
.theme-transition {
  transition: 
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    color 0.3s ease;
}
`;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const bgColor = themes[theme].colors.bgPrimary;
  
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', bgColor);
  } else {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = bgColor;
    document.head.appendChild(meta);
  }
}

/**
 * Get system preferred theme
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve theme mode to actual theme
 */
export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'auto') {
    return getSystemTheme();
  }
  return mode;
}

export default themes;
