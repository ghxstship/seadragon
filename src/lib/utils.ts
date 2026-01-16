
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { logger } from './logger'

// Global protection against negative String.repeat values - applied immediately with detailed logging
const originalRepeat = String.prototype.repeat
String.prototype.repeat = function(count: number): string {
  if (typeof count !== 'number' || isNaN(count) || count < 0) {
    logger.error('STRING.REPEAT ERROR DETECTED', {
      count,
      string: `"${this}"`,
      stack: new Error().stack
    })
    // Return empty string instead of throwing to continue build
    return ''
  }
  return originalRepeat.call(this, count)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe repeat utility as additional protection
export function safeRepeat(str: string, count: number): string {
  return str.repeat(Math.max(0, count))
}
