/**
 * Error Messages Constants
 *
 * Centralized error messages to eliminate hardcoded strings and ensure
 * consistent error messaging across the application.
 */

export const ERROR_MESSAGES = {
  // Authentication
  AUTH: {
    UNAUTHORIZED: 'Authentication required',
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action'
  },

  // Validation
  VALIDATION: {
    REQUIRED_FIELD: (field: string) => `${field} is required`,
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    PASSWORDS_DONT_MATCH: 'Passwords do not match'
  },

  // API Errors
  API: {
    NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
    SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
    NOT_FOUND: 'The requested resource was not found',
    RATE_LIMITED: 'Too many requests. Please try again in a moment.'
  },

  // File Operations
  FILES: {
    UPLOAD_FAILED: 'File upload failed. Please try again.',
    INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
    FILE_TOO_LARGE: 'File is too large. Please select a smaller file.'
  },

  // Integrations
  INTEGRATIONS: {
    CONNECTION_FAILED: 'Failed to connect to external service. Please check your credentials.',
    SYNC_FAILED: 'Data synchronization failed. Please try again.',
    CONFIGURATION_ERROR: 'Integration configuration is incomplete.'
  },

  // Generic
  GENERIC: {
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
    FEATURE_UNAVAILABLE: 'This feature is currently unavailable.',
    MAINTENANCE_MODE: 'System is currently under maintenance. Please try again later.'
  },

  // UI Error Messages
  UI: {
    SOMETHING_WENT_WRONG: 'Something went wrong',
    PAGE_ERROR: 'Page Error',
    UNEXPECTED_ERROR_DESCRIPTION: 'We encountered an unexpected error. Our team has been notified and is working to fix it.',
    PAGE_ERROR_DESCRIPTION: 'This page encountered an error. You can try refreshing or going back.'
  }
} as const

export type ErrorMessage = typeof ERROR_MESSAGES
