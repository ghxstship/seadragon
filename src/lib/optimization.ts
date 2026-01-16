
// Caching and Performance Optimization System
// Implements caching strategies, rate limiting, and performance optimizations

import { NextRequest, NextResponse } from 'next/server'

// Cache configuration
interface CacheConfig {
  ttl: number // Time to live in seconds
  maxSize: number // Maximum cache size
  strategy: 'lru' | 'fifo' | 'lfu'
}

interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
}

class CacheManager<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>()
  private config: CacheConfig

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 300, // 5 minutes default
      maxSize: 1000,
      strategy: 'lru',
      ...config
    }
  }

  // Get cached data
  get(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key)
      return null
    }

    // Update access metrics
    entry.accessCount++
    entry.lastAccessed = Date.now()

    return entry.data
  }

  // Set cached data
  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    }

    // Check cache size limit
    if (this.cache.size >= this.config.maxSize) {
      this.evict()
    }

    this.cache.set(key, entry)
  }

  // Delete cache entry
  delete(key: string): void {
    this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values())
    const totalSize = this.cache.size
    const expiredEntries = entries.filter(
      entry => Date.now() - entry.timestamp > entry.ttl * 1000
    ).length

    return {
      totalEntries: totalSize,
      expiredEntries,
      activeEntries: totalSize - expiredEntries,
      hitRate: entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.accessCount, 0) / entries.length : 0,
      averageAge: entries.length > 0 ?
        entries.reduce((sum, entry) => sum + (Date.now() - entry.timestamp), 0) / entries.length / 1000 : 0
    }
  }

  // Eviction strategy
  private evict(): void {
    if (this.config.strategy === 'lru') {
      // Least Recently Used
      let oldestKey = ''
      let oldestTime = Date.now()

      for (const [key, entry] of this.cache) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed
          oldestKey = key
        }
      }

      if (oldestKey) this.cache.delete(oldestKey)

    } else if (this.config.strategy === 'fifo') {
      // First In First Out
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)

    } else if (this.config.strategy === 'lfu') {
      // Least Frequently Used
      let leastUsedKey = ''
      let leastUsedCount = Infinity

      for (const [key, entry] of this.cache) {
        if (entry.accessCount < leastUsedCount) {
          leastUsedCount = entry.accessCount
          leastUsedKey = key
        }
      }

      if (leastUsedKey) this.cache.delete(leastUsedKey)
    }
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        this.cache.delete(key)
      }
    }
  }
}

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  // Check if request should be rate limited
  check(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetTime) {
      // New window
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      })
      return { allowed: true, remaining: this.config.maxRequests - 1 }
    }

    if (entry.count >= this.config.maxRequests) {
      return { allowed: false, resetTime: entry.resetTime }
    }

    entry.count++
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count
    }
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits) {
      if (now > entry.resetTime) {
        this.limits.delete(key)
      }
    }
  }
}

// Performance monitoring
interface PerformanceMetrics {
  endpoint: string
  method: string
  responseTime: number
  statusCode: number
  timestamp: Date
  userAgent?: string
  ip?: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private maxMetrics = 10000

  // Record performance metric
  record(metric: Omit<PerformanceMetrics, 'timestamp'>): void {
    const fullMetric: PerformanceMetrics = {
      ...metric,
      timestamp: new Date()
    }

    this.metrics.push(fullMetric)

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
  }

  // Get performance statistics
  getStats(timeRangeMs: number = 3600000) { // Default 1 hour
    const cutoff = Date.now() - timeRangeMs
    const recentMetrics = this.metrics.filter(m => m.timestamp.getTime() > cutoff)

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        statusCodes: {},
        endpoints: {}
      }
    }

    const totalRequests = recentMetrics.length
    const averageResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests
    const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length
    const errorRate = errorCount / totalRequests

    const statusCodes = recentMetrics.reduce((acc, m) => {
      acc[m.statusCode] = (acc[m.statusCode] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const endpoints = recentMetrics.reduce((acc, m) => {
      acc[m.endpoint] = acc[m.endpoint] || { count: 0, avgTime: 0 }
      acc[m.endpoint].count++
      acc[m.endpoint].avgTime = (acc[m.endpoint].avgTime + m.responseTime) / 2
      return acc
    }, {} as Record<string, { count: number; avgTime: number }>)

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      statusCodes,
      endpoints
    }
  }
}

// Global instances
export const apiCache = new CacheManager({ ttl: 300, maxSize: 5000, strategy: 'lru' })
export const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // 100 requests per window
})
export const performanceMonitor = new PerformanceMonitor()

// Middleware functions
export function withCaching(handler: Function, cacheKey?: string, ttl?: number) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const key = cacheKey || generateCacheKey(request) // Assuming first arg is request

    // Try to get from cache
    const cached = apiCache.get(key)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Execute handler
    const result = await handler(request, ...args)

    // Cache the result if successful
    if (result.status < 400) {
      const data = await result.json()
      apiCache.set(key, data, ttl)
      return NextResponse.json(data)
    }

    return result
  }
}

const getClientIp = (req: NextRequest) =>
  req.headers.get('x-forwarded-for') ||
  req.headers.get('x-real-ip') ||
  'unknown'

export function withRateLimit(handler: Function, identifier?: string) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const ip = getClientIp(request)
    const key = identifier || ip

    const rateLimitResult = rateLimiter.check(key)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0'
          }
        }
      )
    }

    // Add rate limit headers
    const response = await handler(request, ...args)
    if (response instanceof NextResponse) {
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining?.toString() || '0')
    }

    return response
  }
}

export function withPerformanceMonitoring(handler: Function) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const startTime = Date.now()

    try {
      const result = await handler(request, ...args)
      const responseTime = Date.now() - startTime

      // Record performance metric
      performanceMonitor.record({
        endpoint: request.nextUrl.pathname,
        method: request.method,
        responseTime,
        statusCode: result.status || 200,
        userAgent: request.headers.get('user-agent') || undefined,
        ip: getClientIp(request)
      })

      return result
    } catch (error) {
      const responseTime = Date.now() - startTime

      // Record error metric
      performanceMonitor.record({
        endpoint: request.nextUrl.pathname,
        method: request.method,
        responseTime,
        statusCode: 500
      })

      throw error
    }
  }
}

// Combined middleware for API routes
export function withOptimizations(handler: Function, options: {
  cache?: { key?: string; ttl?: number }
  rateLimit?: boolean
  monitoring?: boolean
} = {}) {
  let wrappedHandler = handler

  if (options.monitoring !== false) {
    wrappedHandler = withPerformanceMonitoring(wrappedHandler)
  }

  if (options.rateLimit !== false) {
    wrappedHandler = withRateLimit(wrappedHandler)
  }

  if (options.cache) {
    wrappedHandler = withCaching(wrappedHandler, options.cache.key, options.cache.ttl)
  }

  return wrappedHandler
}

// Utility functions
function generateCacheKey(request: NextRequest): string {
  const url = request.nextUrl
  const params = Array.from(url.searchParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${request.method}:${url.pathname}${params ? `?${params}` : ''}`
}

// Cleanup functions
export function startCleanupIntervals(): void {
  // Cleanup expired cache entries every 5 minutes
  setInterval(() => {
    apiCache.cleanup()
  }, 5 * 60 * 1000)

  // Cleanup expired rate limit entries every 15 minutes
  setInterval(() => {
    rateLimiter.cleanup()
  }, 15 * 60 * 1000)
}

// Get optimization statistics
export function getOptimizationStats() {
  return {
    cache: apiCache.getStats(),
    performance: performanceMonitor.getStats(),
    rateLimit: {
      activeLimits: 0 // Would need to expose from RateLimiter
    }
  }
}
