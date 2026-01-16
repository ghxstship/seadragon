/**
 * Input Validation Utilities
 *
 * Provides comprehensive validation for user inputs across the application.
 * Supports client-side and server-side validation.
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

// Email validation regex (RFC 5322 compliant)
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Phone validation regex (supports international formats)
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/

// Credit card validation (basic Luhn algorithm)
const CARD_NUMBER_REGEX = /^\d{13,19}$/

// Expiry date validation (MM/YY)
const EXPIRY_DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/

// CVV validation
const CVV_REGEX = /^\d{3,4}$/

// Name validation (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s\-']+$/

/**
 * Validate a single input field
 */
export function validateInput(value: string, rules: ValidationRules): ValidationResult {
  const errors: string[] = []

  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    errors.push('This field is required')
    return { isValid: false, errors }
  }

  // Skip other validations if empty and not required
  if (!value || value.trim() === '') {
    return { isValid: true, errors: [] }
  }

  const trimmedValue = value.trim()

  // Length validations
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`)
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`)
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    errors.push('Invalid format')
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(trimmedValue)
    if (customError) {
      errors.push(customError)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate multiple fields at once
 */
export function validateForm(fields: Record<string, { value: string; rules: ValidationRules }>): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {}

  for (const [fieldName, fieldData] of Object.entries(fields)) {
    results[fieldName] = validateInput(fieldData.value, fieldData.rules)
  }

  return results
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  return validateInput(email, {
    required: true,
    pattern: EMAIL_REGEX,
    custom: (value) => {
      if (value.length > 254) return 'Email address is too long'
      return null
    }
  })
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  return validateInput(phone, {
    required: true,
    minLength: 10,
    maxLength: 15,
    pattern: PHONE_REGEX,
    custom: (value) => {
      // Remove formatting for validation
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length < 10) return 'Phone number must have at least 10 digits'
      if (digitsOnly.length > 15) return 'Phone number is too long'
      return null
    }
  })
}

/**
 * Validate name (first/last)
 */
export function validateName(name: string): ValidationResult {
  return validateInput(name, {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: NAME_REGEX,
    custom: (value) => {
      if (/\s{2,}/.test(value)) return 'Multiple consecutive spaces are not allowed'
      return null
    }
  })
}

/**
 * Validate credit card number (basic validation)
 */
export function validateCardNumber(cardNumber: string): ValidationResult {
  return validateInput(cardNumber.replace(/\s/g, ''), {
    required: true,
    pattern: CARD_NUMBER_REGEX,
    custom: (value) => {
      // Basic Luhn algorithm check
      if (!luhnCheck(value)) return 'Invalid card number'
      return null
    }
  })
}

/**
 * Validate expiry date (MM/YY)
 */
export function validateExpiryDate(expiryDate: string): ValidationResult {
  return validateInput(expiryDate, {
    required: true,
    pattern: EXPIRY_DATE_REGEX,
    custom: (value) => {
      const [monthString, yearString] = value.split('/')
      if (!monthString || !yearString) {
        return 'Invalid expiry date'
      }
      const month = Number(monthString)
      const year = Number(yearString)
      if (Number.isNaN(month) || Number.isNaN(year) || month < 1 || month > 12) {
        return 'Invalid expiry date'
      }
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return 'Card has expired'
      }

      return null
    }
  })
}

/**
 * Validate CVV
 */
export function validateCVV(cvv: string): ValidationResult {
  return validateInput(cvv, {
    required: true,
    pattern: CVV_REGEX
  })
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  return validateInput(password, {
    required: true,
    minLength: 8,
    custom: (value) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Must contain at least one lowercase letter'
      if (!/(?=.*[A-Z])/.test(value)) return 'Must contain at least one uppercase letter'
      if (!/(?=.*\d)/.test(value)) return 'Must contain at least one number'
      if (!/(?=.*[!@#$%^&*])/.test(value)) return 'Must contain at least one special character'
      return null
    }
  })
}

/**
 * Validate URL
 */
export function validateUrl(url: string): ValidationResult {
  try {
    new URL(url)
    return { isValid: true, errors: [] }
  } catch {
    return { isValid: false, errors: ['Invalid URL format'] }
  }
}

/**
 * Luhn algorithm for credit card validation
 */
function luhnCheck(cardNumber: string): boolean {
  let sum = 0
  let shouldDouble = false

  // Loop through digits from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10)

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

/**
 * Sanitize input (remove potentially dangerous characters)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>\"'&]/g, '') // Remove HTML characters
    .trim()
}

/**
 * Get validation error message for field
 */
export function getValidationError(result: ValidationResult): string | null {
  return result.errors.length > 0 ? result.errors[0] ?? null : null
}

/**
 * Check if form is valid
 */
export function isFormValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every(result => result.isValid)
}
