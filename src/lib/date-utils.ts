
/**
 * Date Formatting Utilities
 * 
 * Provides consistent date formatting across the application.
 * Replaces inline toLocaleDateString() calls with centralized, configurable formatting.
 */

export type DateFormatStyle = 'short' | 'medium' | 'long' | 'full' | 'relative'

interface DateFormatOptions {
  locale?: string
  style?: DateFormatStyle
  includeTime?: boolean
  timeStyle?: 'short' | 'medium' | 'long'
}

const DEFAULT_LOCALE = 'en-US'

/**
 * Format a date with consistent styling
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  options: DateFormatOptions = {}
): string {
  if (!date) return ''

  const {
    locale = DEFAULT_LOCALE,
    style = 'medium',
    includeTime = false,
    timeStyle = 'short',
  } = options

  const dateObj = date instanceof Date ? date : new Date(date)

  if (isNaN(dateObj.getTime())) {
    return ''
  }

  // Relative formatting
  if (style === 'relative') {
    return formatRelative(dateObj)
  }

  const dateStyleMap: Record<DateFormatStyle, Intl.DateTimeFormatOptions['dateStyle']> = {
    short: 'short',
    medium: 'medium',
    long: 'long',
    full: 'full',
    relative: 'medium',
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: dateStyleMap[style],
  }

  if (includeTime) {
    formatOptions.timeStyle = timeStyle
  }

  try {
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj)
  } catch {
    // Fallback for unsupported locales
    return dateObj.toLocaleDateString()
  }
}

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelative(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diffMs = dateObj.getTime() - now.getTime()
  const diffSecs = Math.round(diffMs / 1000)
  const diffMins = Math.round(diffSecs / 60)
  const diffHours = Math.round(diffMins / 60)
  const diffDays = Math.round(diffHours / 24)
  const diffWeeks = Math.round(diffDays / 7)
  const diffMonths = Math.round(diffDays / 30)
  const diffYears = Math.round(diffDays / 365)

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffSecs) < 60) {
    return rtf.format(diffSecs, 'second')
  } else if (Math.abs(diffMins) < 60) {
    return rtf.format(diffMins, 'minute')
  } else if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour')
  } else if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, 'day')
  } else if (Math.abs(diffWeeks) < 4) {
    return rtf.format(diffWeeks, 'week')
  } else if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, 'month')
  } else {
    return rtf.format(diffYears, 'year')
  }
}

/**
 * Format a time only
 */
export function formatTime(
  date: Date | string | number,
  options: { locale?: string; style?: 'short' | 'medium' | 'long' } = {}
): string {
  const { locale = DEFAULT_LOCALE, style = 'short' } = options
  const dateObj = date instanceof Date ? date : new Date(date)

  if (isNaN(dateObj.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(locale, { timeStyle: style }).format(dateObj)
}

/**
 * Format a date range
 */
export function formatDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const { locale = DEFAULT_LOCALE, style = 'medium' } = options

  const start = startDate instanceof Date ? startDate : new Date(startDate)
  const end = endDate instanceof Date ? endDate : new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return ''
  }

  // Same day
  if (start.toDateString() === end.toDateString()) {
    return `${formatDate(start, { locale, style })} ${formatTime(start)} - ${formatTime(end)}`
  }

  return `${formatDate(start, { locale, style })} - ${formatDate(end, { locale, style })}`
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string | number): boolean {
  const dateObj = date instanceof Date ? date : new Date(date)
  const today = new Date()
  return dateObj.toDateString() === today.toDateString()
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string | number): boolean {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.getTime() < Date.now()
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string | number): boolean {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.getTime() > Date.now()
}

/**
 * Get days until a date (negative if in the past)
 */
export function daysUntil(date: Date | string | number): number {
  const dateObj = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diffMs = dateObj.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Format a due date with urgency indication
 */
export function formatDueDate(date: Date | string | number): {
  text: string
  urgency: 'overdue' | 'urgent' | 'soon' | 'normal'
} {
  const days = daysUntil(date)

  if (days < 0) {
    return {
      text: `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`,
      urgency: 'overdue',
    }
  } else if (days === 0) {
    return { text: 'Due today', urgency: 'urgent' }
  } else if (days === 1) {
    return { text: 'Due tomorrow', urgency: 'urgent' }
  } else if (days <= 3) {
    return { text: `Due in ${days} days`, urgency: 'soon' }
  } else if (days <= 7) {
    return { text: `Due in ${days} days`, urgency: 'normal' }
  } else {
    return { text: formatDate(date, { style: 'medium' }), urgency: 'normal' }
  }
}

/**
 * Parse a date string safely
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null

  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Format ISO date string
 */
export function toISODateString(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toISOString().split('T')[0]
}

/**
 * Format for datetime-local input
 */
export function toDateTimeLocalString(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toISOString().slice(0, 16)
}
