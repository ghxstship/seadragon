
/**
 * Safe JSON Parsing Utilities
 * 
 * Provides type-safe JSON parsing with optional validation.
 * Replaces raw JSON.parse calls throughout the codebase.
 */

interface ParseResult<T> {
  success: boolean
  data: T | null
  error: string | null
}

// Type guard function signature
type TypeGuard<T> = (value: unknown) => value is T

// Validator function signature (returns error message or null if valid)
type Validator<T> = (value: unknown) => { valid: true; data: T } | { valid: false; error: string }

/**
 * Safely parse JSON without validation
 * Returns null if parsing fails
 */
export function safeJsonParse<T = unknown>(json: string | null | undefined): T | null {
  if (!json) return null

  try {
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

/**
 * Safely parse JSON with type guard validation
 * Returns null if parsing or validation fails
 */
export function safeJsonParseWithGuard<T>(
  json: string | null | undefined,
  guard: TypeGuard<T>
): T | null {
  if (!json) return null

  try {
    const parsed = JSON.parse(json)
    return guard(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * Safely parse JSON with validator function
 * Returns detailed result with error message
 */
export function safeJsonParseWithValidator<T>(
  json: string | null | undefined,
  validator: Validator<T>
): ParseResult<T> {
  if (!json) {
    return { success: false, data: null, error: 'Input is null or undefined' }
  }

  try {
    const parsed = JSON.parse(json)
    const result = validator(parsed)

    if (result.valid) {
      return { success: true, data: result.data, error: null }
    }

    return { success: false, data: null, error: result.error }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown parse error'
    return { success: false, data: null, error: message }
  }
}

/**
 * Safely stringify to JSON
 * Returns null if stringification fails
 */
export function safeJsonStringify(value: unknown, pretty = false): string | null {
  try {
    return pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value)
  } catch {
    return null
  }
}

/**
 * Parse JSON with a default value fallback
 */
export function parseJsonWithDefault<T>(
  json: string | null | undefined,
  defaultValue: T
): T {
  const result = safeJsonParse<T>(json)
  return result ?? defaultValue
}

/**
 * Parse JSON with type guard and default value
 */
export function parseJsonWithGuardAndDefault<T>(
  json: string | null | undefined,
  guard: TypeGuard<T>,
  defaultValue: T
): T {
  const result = safeJsonParseWithGuard(json, guard)
  return result ?? defaultValue
}

// Common type guards for reuse
export const TypeGuards = {
  isWizardState: (value: unknown): value is WizardState => {
    if (!value || typeof value !== 'object') return false
    const v = value as Record<string, unknown>
    return (
      typeof v.currentStep === 'number' &&
      typeof v.data === 'object' &&
      Array.isArray(v.completedSteps)
    )
  },

  isUserPreferences: (value: unknown): value is UserPreferences => {
    if (!value || typeof value !== 'object') return false
    const v = value as Record<string, unknown>
    if (v.theme !== undefined && !['light', 'dark', 'system'].includes(v.theme as string)) return false
    if (v.language !== undefined && typeof v.language !== 'string') return false
    if (v.notifications !== undefined && typeof v.notifications !== 'boolean') return false
    return true
  },

  isCartItem: (value: unknown): value is CartItem => {
    if (!value || typeof value !== 'object') return false
    const v = value as Record<string, unknown>
    return (
      typeof v.id === 'string' &&
      typeof v.name === 'string' &&
      typeof v.price === 'number' &&
      typeof v.quantity === 'number'
    )
  },

  isCart: (value: unknown): value is Cart => {
    if (!value || typeof value !== 'object') return false
    const v = value as Record<string, unknown>
    return Array.isArray(v.items) && v.items.every(TypeGuards.isCartItem)
  },

  isCookieConsent: (value: unknown): value is CookieConsent => {
    if (!value || typeof value !== 'object') return false
    const v = value as Record<string, unknown>
    return typeof v.necessary === 'boolean'
  },
}

// Type definitions for common schemas
export interface WizardState {
  currentStep: number
  data: Record<string, unknown>
  completedSteps: number[]
  stepValidation?: Record<number, boolean>
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  language?: string
  notifications?: boolean
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  type?: string
}

export interface Cart {
  items: CartItem[]
  total?: number
  updatedAt?: string
}

export interface CookieConsent {
  necessary: boolean
  analytics?: boolean
  marketing?: boolean
  preferences?: boolean
  timestamp?: string
}

export interface TenantContext {
  tenantId: string
  tenantName?: string
  settings?: Record<string, unknown>
}

// Type exports
export type { ParseResult, TypeGuard, Validator }
