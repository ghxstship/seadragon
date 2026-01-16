// Caching and Performance Optimization System
// Implements caching, rate limiting, and performance optimizations

import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'
import { safeJsonParse } from './safe-json'

// In-memory cache (in production, use Redis)
const cache = new Map<string, { data: unknown; expires: number }>()
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export const CACHE_CONFIG = {
  defaultTTL: 300000, // 5 minutes
  maxSize: 1000,
  compression: true,
}

export const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 100,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
}

export function generateCacheKey(method: string, url: string, body?: unknown, userId?: string): string {
  const parts = [method, url]
  if (userId) parts.push(userId)
  if (body && typeof body === 'object') parts.push(JSON.stringify(body))
  return parts.join('|')
}

export class CacheManager {
  static set(key: string, data: unknown, ttl: number = CACHE_CONFIG.defaultTTL): void {
    const expires = Date.now() + ttl

    if (cache.size >= CACHE_CONFIG.maxSize) {
      const entries = Array.from(cache.entries()).sort((a, b) => a[1].expires - b[1].expires)
      const toRemove = entries.slice(0, Math.floor(CACHE_CONFIG.maxSize * 0.1))
      toRemove.forEach(([k]) => cache.delete(k))
    }

    cache.set(key, { data, expires })
  }

  static get(key: string): unknown | null {
    const entry = cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expires) {
      cache.delete(key)
      return null
    }
    return entry.data
  }

  static delete(key: string): void {
    cache.delete(key)
  }

  static clear(): void {
    cache.clear()
  }

  static getStats() {
    const now = Date.now()
    const validEntries = Array.from(cache.values()).filter(entry => entry.expires > now)
    return {
      totalEntries: cache.size,
      validEntries: validEntries.length,
      activeEntries: validEntries.length,
      hitRate: 0,
      memoryUsage: JSON.stringify(Array.from(cache.entries())).length,
    }
  }
}

export const apiCache = {
  config: { ...CACHE_CONFIG, ttl: CACHE_CONFIG.defaultTTL },
  set: CacheManager.set,
  get: CacheManager.get,
  delete: CacheManager.delete,
  clear: CacheManager.clear,
  getStats: CacheManager.getStats,
  cache,
  cleanup: () => {
    const now = Date.now()
    for (const [key, entry] of cache.entries()) {
      if (entry.expires <= now) cache.delete(key)
    }
  },
}

export class RateLimitManager {
  static check(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const now = Date.now()
    const windowStart = now - RATE_LIMIT_CONFIG.windowMs
    let record = rateLimitStore.get(identifier)

    if (!record || record.resetTime < windowStart) {
      record = { count: 0, resetTime: now + RATE_LIMIT_CONFIG.windowMs }
      rateLimitStore.set(identifier, record)
    }

    const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxRequests - record.count)

    if (record.count >= RATE_LIMIT_CONFIG.maxRequests) {
      return { allowed: false, resetTime: record.resetTime, remaining: 0 }
    }

    record.count++
    rateLimitStore.set(identifier, record)

    return { allowed: true, resetTime: record.resetTime, remaining: remaining - 1 }
  }

  static reset(identifier: string): void {
    rateLimitStore.delete(identifier)
  }

  static getStats() {
    const now = Date.now()
    const activeLimits = Array.from(rateLimitStore.entries()).filter(([, record]) => record.resetTime > now)
    return {
      activeLimits: activeLimits.length,
      totalRequests: activeLimits.reduce((sum, [, record]) => sum + record.count, 0),
    }
  }
}

export const rateLimiter = {
  config: RATE_LIMIT_CONFIG,
  check: RateLimitManager.check,
  limits: rateLimitStore,
  cleanup: () => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetTime <= now) rateLimitStore.delete(key)
    }
  },
}

// Performance monitoring (minimal shape for tests)
type PerformanceMetric = {
  endpoint: string
  method: string
  responseTime: number
  statusCode: number
  userAgent?: string
  ip?: string
  timestamp: number | Date
}

export const performanceMonitor = {
  metrics: [] as PerformanceMetric[],

  record: (metric: Omit<PerformanceMetric, 'timestamp'> & { timestamp?: number | Date }) => {
    performanceMonitor.metrics.push({ ...metric, timestamp: metric.timestamp ?? Date.now() })
  },

  // Compatibility logger used in other helpers
  recordMetric: (name: string, value: number, tags?: Record<string, string>) => {
    performanceMonitor.metrics.push({
      endpoint: tags?.endpoint || name,
      method: tags?.method || 'METRIC',
      responseTime: value,
      statusCode: Number(tags?.status) || 200,
      userAgent: tags?.userAgent,
      ip: tags?.ip,
      timestamp: Date.now(),
    })
  },

  getMetrics: () => performanceMonitor.metrics,

  getStats: (timeRangeMs?: number) => {
    const now = Date.now()
    const filtered = timeRangeMs
      ? performanceMonitor.metrics.filter(m => {
          const ts = typeof m.timestamp === 'number' ? m.timestamp : m.timestamp.getTime()
          return now - ts <= timeRangeMs
        })
      : performanceMonitor.metrics

    const totalRequests = filtered.length
    const totalResponseTime = filtered.reduce((sum, m) => sum + m.responseTime, 0)
    const averageResponseTime = totalRequests ? totalResponseTime / totalRequests : 0
    const errors = filtered.filter(m => m.statusCode >= 400).length
    const errorRate = totalRequests ? errors / totalRequests : 0

    const statusCodes = filtered.reduce<Record<string, number>>((acc, m) => {
      acc[m.statusCode] = (acc[m.statusCode] || 0) + 1
      return acc
    }, {})

    const endpoints = filtered.reduce<Record<string, { count: number; avgTime: number }>>((acc, m) => {
      const entry = acc[m.endpoint] || { count: 0, avgTime: 0 }
      entry.count += 1
      entry.avgTime = ((entry.avgTime * (entry.count - 1)) + m.responseTime) / entry.count
      acc[m.endpoint] = entry
      return acc
    }, {})

    return {
      totalRequests,
      totalResponseTime,
      averageResponseTime,
      errorRate,
      statusCodes,
      endpoints,
    }
  },

  clear: () => {
    performanceMonitor.metrics = []
  },
}

export function getOptimizationStats() {
  const perfStats = performanceMonitor.getStats()
  return {
    cache: apiCache.getStats(),
    performance: perfStats,
    rateLimit: rateLimiter.config,
  }
}

export function withCaching(
  handler: Function,
  options: {
    ttl?: number
    keyGenerator?: (req: NextRequest) => string
    shouldCache?: (req: NextRequest, res: NextResponse) => boolean
  } = {}
) {
  return async (req: NextRequest) => {
    const {
      ttl = CACHE_CONFIG.defaultTTL,
      keyGenerator = (req) => generateCacheKey(req.method, req.url.toString()),
      shouldCache = (req, res) => res.status === 200,
    } = options

    const cacheKey = keyGenerator(req)
    const cached = CacheManager.get(cacheKey)
    if (cached) {
      const pathname = new URL(req.url).pathname
      performanceMonitor.recordMetric('cache.hit', 1, { endpoint: pathname })
      return NextResponse.json(cached)
    }

    const startTime = Date.now()
    const response = await handler(req)
    const duration = Date.now() - startTime

    const pathname = new URL(req.url).pathname
    performanceMonitor.recordMetric('api.response_time', duration, {
      method: req.method,
      endpoint: pathname,
      status: response.status.toString(),
    })

    if (shouldCache(req, response)) {
      try {
        const data = await response.json()
        CacheManager.set(cacheKey, data, ttl)
        return NextResponse.json(data, { status: response.status, headers: response.headers })
      } catch (error) {
        logger.warn('Failed to cache response', { error: error instanceof Error ? error.message : String(error) })
      }
    }

    return response
  }
}

export function withRateLimit(
  handler: Function,
  options: Partial<typeof RATE_LIMIT_CONFIG> = {}
) {
  const config = { ...RATE_LIMIT_CONFIG, ...options }

  return async (req: NextRequest) => {
    const clientId = req.headers.get('x-forwarded-for') ||
                    req.headers.get('x-real-ip') ||
                    'anonymous'

    const rateLimit = RateLimitManager.check(clientId)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimit.resetTime },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.resetTime?.toString() || '60',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime?.toString() || '',
          },
        }
      )
    }

    const response = await handler(req)
    if (response.headers) {
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining?.toString() || '0')
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime?.toString() || '')
    }

    return response
  }
}

export class QueryOptimizer {
  static async optimizeQuery(query: unknown, context: string): Promise<unknown> {
    const startTime = Date.now()
    const optimizedQuery = { ...query }
    const result = await this.executeOptimizedQuery(optimizedQuery)
    const duration = Date.now() - startTime
    performanceMonitor.recordMetric('db.query_time', duration, { context })
    return result
  }

  private static async executeOptimizedQuery(query: unknown): Promise<unknown> {
    return {}
  }
}

// Resource pooling for expensive operations
export class ResourcePool<T> {
  private pool: T[] = []
  private waitingQueue: Array<(resource: T) => void> = []
  private maxSize: number
  private createResource: () => Promise<T>
  private destroyResource?: (resource: T) => Promise<void>

  constructor(
    maxSize: number,
    createResource: () => Promise<T>,
    destroyResource?: (resource: T) => Promise<void>
  ) {
    this.maxSize = maxSize
    this.createResource = createResource
    this.destroyResource = destroyResource
  }

  async acquire(): Promise<T> {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }

    if (this.pool.length < this.maxSize) {
      const resource = await this.createResource()
      return resource
    }

    return new Promise((resolve) => {
      this.waitingQueue.push(resolve)
    })
  }

  async release(resource: T): Promise<void> {
    if (this.waitingQueue.length > 0) {
      const waitingResolver = this.waitingQueue.shift()!
      waitingResolver(resource)
    } else if (this.pool.length < this.maxSize) {
      this.pool.push(resource)
    } else if (this.destroyResource) {
      await this.destroyResource(resource)
    }
  }

  getStats() {
    return {
      available: this.pool.length,
      waiting: this.waitingQueue.length,
      maxSize: this.maxSize,
    }
  }
}

// Compression utilities
export class CompressionManager {
  static async compress(data: unknown): Promise<string> {
    if (!CACHE_CONFIG.compression) return JSON.stringify(data)
    return JSON.stringify(data)
  }

  static async decompress(compressedData: string): Promise<unknown> {
    if (!CACHE_CONFIG.compression) return safeJsonParse(compressedData) || {}
    return safeJsonParse(compressedData) || {}
  }
}

function getAggregatedMetrics(name: string) {
  const entries = performanceMonitor.metrics.filter(m => m.endpoint === name || name === 'all')
  if (entries.length === 0) return null
  const values = entries.map(e => e.responseTime)
  const sum = values.reduce((a, b) => a + b, 0)
  const avg = sum / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const p95 = calculatePercentile(values, 95)
  const p99 = calculatePercentile(values, 99)
  return { count: entries.length, sum, avg, min, max, p95, p99 }
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = (percentile / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower)
}

// Health check endpoint data
export function getSystemHealth() {
  return {
    cache: CacheManager.getStats(),
    rateLimit: RateLimitManager.getStats(),
    performance: {
      apiResponseTime: getAggregatedMetrics('api.response_time'),
      dbQueryTime: getAggregatedMetrics('db.query_time'),
      cacheHitRate: getAggregatedMetrics('cache.hit'),
    },
    timestamp: new Date().toISOString(),
  }
}
