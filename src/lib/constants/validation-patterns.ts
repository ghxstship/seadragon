/**
 * Validation Patterns Constants
 *
 * Centralized regular expressions and validation patterns to eliminate
 * inline regex and ensure consistent validation across the application.
 */

export const VALIDATION_PATTERNS = {
  // Email validation
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone number (basic international format)
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,

  // URL validation
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

  // Alphanumeric with spaces and hyphens
  ALPHANUMERIC: /^[a-zA-Z0-9\s\-]+$/,

  // Slug format (lowercase, hyphens, no spaces)
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  // UUID v4
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  // Credit card number (basic validation)
  CREDIT_CARD: /^\d{13,19}$/,

  // ZIP/Postal code (US format)
  ZIP_CODE: /^\d{5}(-\d{4})?$/,

  // Password strength (at least 8 chars, mixed case, number, special char)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // File extensions
  IMAGE_EXTENSIONS: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
  DOCUMENT_EXTENSIONS: /\.(pdf|doc|docx|txt|rtf)$/i,
  SPREADSHEET_EXTENSIONS: /\.(xls|xlsx|csv)$/i,

  // Date formats
  ISO_DATE: /^\d{4}-\d{2}-\d{2}$/,
  ISO_DATETIME: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,

  // Hex color
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

  // Currency amounts
  CURRENCY: /^\$?[\d,]+(\.\d{2})?$/,

  // Percentage (0-100)
  PERCENTAGE: /^(100(\.0{1,2})?|(\d{1,2})(\.\d{1,2})?)$/
} as const

export type ValidationPattern = typeof VALIDATION_PATTERNS
