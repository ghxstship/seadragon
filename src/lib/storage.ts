
/**
 * Storage Abstraction Layer
 * 
 * Provides SSR-safe localStorage/sessionStorage access with type safety.
 * Replaces direct localStorage calls throughout the codebase.
 */

import { logger } from './logger'
import { safeJsonParse } from './safe-json'

type StorageType = 'local' | 'session'

interface StorageOptions {
  type?: StorageType
  prefix?: string
  ttl?: number // Time to live in milliseconds
}

interface StoredItem<T> {
  value: T
  timestamp: number
  ttl?: number
}

const DEFAULT_PREFIX = 'opuszero'

function isClient(): boolean {
  return typeof window !== 'undefined'
}

function getStorage(type: StorageType): Storage | null {
  if (!isClient()) return null
  return type === 'local' ? localStorage : sessionStorage
}

function buildKey(key: string, prefix?: string): string {
  const p = prefix ?? DEFAULT_PREFIX
  return `${p}:${key}`
}

function isExpired<T>(item: StoredItem<T>): boolean {
  if (!item.ttl) return false
  return Date.now() - item.timestamp > item.ttl
}

/**
 * Get an item from storage with type safety
 */
export function storageGet<T>(key: string, options: StorageOptions = {}): T | null {
  const storage = getStorage(options.type ?? 'local')
  if (!storage) return null

  try {
    const fullKey = buildKey(key, options.prefix)
    const raw = storage.getItem(fullKey)
    if (!raw) return null

    const item: StoredItem<T> = safeJsonParse(raw)
    if (!item) {
      logger.warn('Invalid stored item format', { key: fullKey })
      return null
    }
    
    // Check expiration
    if (isExpired(item)) {
      storage.removeItem(fullKey)
      return null
    }

    return item.value
  } catch {
    return null
  }
}

/**
 * Set an item in storage with type safety
 */
export function storageSet<T>(key: string, value: T, options: StorageOptions = {}): boolean {
  const storage = getStorage(options.type ?? 'local')
  if (!storage) return false

  try {
    const fullKey = buildKey(key, options.prefix)
    const item: StoredItem<T> = {
      value,
      timestamp: Date.now(),
      ttl: options.ttl,
    }
    storage.setItem(fullKey, JSON.stringify(item))
    return true
  } catch {
    return false
  }
}

/**
 * Remove an item from storage
 */
export function storageRemove(key: string, options: StorageOptions = {}): boolean {
  const storage = getStorage(options.type ?? 'local')
  if (!storage) return false

  try {
    const fullKey = buildKey(key, options.prefix)
    storage.removeItem(fullKey)
    return true
  } catch {
    return false
  }
}

/**
 * Clear all items with the given prefix
 */
export function storageClear(options: StorageOptions = {}): boolean {
  const storage = getStorage(options.type ?? 'local')
  if (!storage) return false

  try {
    const prefix = buildKey('', options.prefix)
    const keysToRemove: string[] = []

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => storage.removeItem(key))
    return true
  } catch {
    return false
  }
}

/**
 * Check if an item exists in storage
 */
export function storageHas(key: string, options: StorageOptions = {}): boolean {
  return storageGet(key, options) !== null
}

/**
 * Get all keys with the given prefix
 */
export function storageKeys(options: StorageOptions = {}): string[] {
  const storage = getStorage(options.type ?? 'local')
  if (!storage) return []

  try {
    const prefix = buildKey('', options.prefix)
    const keys: string[] = []

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key?.startsWith(prefix)) {
        // Remove prefix from key
        keys.push(key.slice(prefix.length))
      }
    }

    return keys
  } catch {
    return []
  }
}

/**
 * Storage namespace for organized access
 */
export const storage = {
  get: storageGet,
  set: storageSet,
  remove: storageRemove,
  clear: storageClear,
  has: storageHas,
  keys: storageKeys,

  // Convenience methods for local storage
  local: {
    get: <T>(key: string, prefix?: string) => storageGet<T>(key, { type: 'local', prefix }),
    set: <T>(key: string, value: T, ttl?: number, prefix?: string) => 
      storageSet(key, value, { type: 'local', ttl, prefix }),
    remove: (key: string, prefix?: string) => storageRemove(key, { type: 'local', prefix }),
    clear: (prefix?: string) => storageClear({ type: 'local', prefix }),
    has: (key: string, prefix?: string) => storageHas(key, { type: 'local', prefix }),
    keys: (prefix?: string) => storageKeys({ type: 'local', prefix }),
  },

  // Convenience methods for session storage
  session: {
    get: <T>(key: string, prefix?: string) => storageGet<T>(key, { type: 'session', prefix }),
    set: <T>(key: string, value: T, ttl?: number, prefix?: string) => 
      storageSet(key, value, { type: 'session', ttl, prefix }),
    remove: (key: string, prefix?: string) => storageRemove(key, { type: 'session', prefix }),
    clear: (prefix?: string) => storageClear({ type: 'session', prefix }),
    has: (key: string, prefix?: string) => storageHas(key, { type: 'session', prefix }),
    keys: (prefix?: string) => storageKeys({ type: 'session', prefix }),
  },
}

// Type exports
export type { StorageType, StorageOptions, StoredItem }
