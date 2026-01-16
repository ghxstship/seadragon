/**
 * UI Constants - Centralized strings for consistent UI text
 * Enables easier maintenance, internationalization, and consistency
 */

export const UI_STRINGS = {
  // Common Actions
  SAVE: 'Save',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
  CREATE: 'Create',
  SUBMIT: 'Submit',
  CLOSE: 'Close',
  BACK: 'Back',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  CONTINUE: 'Continue',
  DONE: 'Done',

  // Status Messages
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  PROCESSING: 'Processing...',

  // Confirmation
  CONFIRM: 'Confirm',
  YES: 'Yes',
  NO: 'No',
  OK: 'OK',

  // Cookie Consent
  COOKIE_PREFERENCES: 'Cookie Preferences',
  COOKIE_DESCRIPTION: 'We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can choose which categories to allow. Essential cookies are always enabled.',
  LEARN_MORE: 'Learn more',
  COOKIE_SETTINGS: 'Cookie Settings',
  ESSENTIAL_COOKIES: 'Essential Cookies',
  ESSENTIAL_COOKIES_DESC: 'Required for the website to function properly. Cannot be disabled.',
  ANALYTICS_COOKIES: 'Analytics Cookies',
  ANALYTICS_COOKIES_DESC: 'Help us understand how visitors interact with our website.',
  MARKETING_COOKIES: 'Marketing Cookies',
  MARKETING_COOKIES_DESC: 'Used to deliver personalized advertisements.',
  FUNCTIONAL_COOKIES: 'Functional Cookies',
  FUNCTIONAL_COOKIES_DESC: 'Enable enhanced functionality and personalization.',
  SAVE_PREFERENCES: 'Save Preferences',
  REJECT_ALL: 'Reject All',
  CUSTOMIZE: 'Customize',
  ACCEPT_ALL: 'Accept All',

  // Error Messages
  ERROR_GENERIC: 'An error occurred. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection.',
  ERROR_PERMISSION: 'You do not have permission to perform this action.',
  ERROR_NOT_FOUND: 'The requested item was not found.',
  ERROR_VALIDATION: 'Please correct the errors and try again.',

  // Success Messages
  SUCCESS_SAVED: 'Changes saved successfully.',
  SUCCESS_DELETED: 'Item deleted successfully.',
  SUCCESS_CREATED: 'Item created successfully.',

  // Navigation
  HOME: 'Home',
  DASHBOARD: 'Dashboard',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  LOGOUT: 'Logout',

  // Placeholders
  SEARCH_PLACEHOLDER: 'Search...',
  EMAIL_PLACEHOLDER: 'Enter your email',
  NAME_PLACEHOLDER: 'Enter your name',
  MESSAGE_PLACEHOLDER: 'Enter your message',

  // Accessibility
  LOADING_ANNOUNCEMENT: 'Loading content',
  ERROR_ANNOUNCEMENT: 'An error occurred',
  SUCCESS_ANNOUNCEMENT: 'Action completed successfully',
} as const

export type UIStringKey = keyof typeof UI_STRINGS
