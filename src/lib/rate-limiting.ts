
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { withOrgContext } from '@/lib/middleware'
import { logger } from '@/lib/logger'

// Redis client interface
interface RedisClient {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, options?: { EX?: number; PX?: number }) => Promise<string | null>
  del: (key: string) => Promise<number>
  incr: (key: string) => Promise<number>
  expire: (key: string, seconds: number) => Promise<number>
  pttl: (key: string) => Promise<number>
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configuration
const RATE_LIMITS = {
  authenticated: { requests: 1000, windowMs: 60 * 1000 }, // 1000 requests per minute
  unauthenticated: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  strict: { requests: 10, windowMs: 60 * 1000 } // 10 requests per minute for sensitive operations
}

// RateLimitConfig interface
export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipFailedRequests?: boolean
  skipSuccessfulRequests?: boolean
}

// RateLimitError class
export class RateLimitError extends Error {
  constructor(message: string, public retryAfter: number) {
    super(message)
    this.name = 'RateLimitError'
  }
}

// Clean up expired rate limit entries
function cleanupRateLimits() {
  const now = Date.now()
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Check rate limit for a given identifier
function checkRateLimit(identifier: string, limit: typeof RATE_LIMITS.authenticated): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  cleanupRateLimits()

  const now = Date.now()
  const key = `${identifier}:${Math.floor(now / limit.windowMs)}`
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // First request in this window or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs
    })
    return { allowed: true, remaining: limit.requests - 1, resetTime: now + limit.windowMs }
  }

  if (entry.count >= limit.requests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return { allowed: true, remaining: limit.requests - entry.count, resetTime: entry.resetTime }
}

// RateLimiter class
export class RateLimiter {
  private redisClient: RedisClient | null = null

  constructor(config?: RateLimitConfig) {
    // In test environment, use mock Redis
    if (process.env.NODE_ENV === 'test') {
      const { createClient } = require('redis')
      this.redisClient = createClient()
    } else {
      // In production, initialize real Redis client
      const { createClient } = require('redis')
      this.redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      })
    }
    this.redisClient.connect().catch(() => {
      // Gracefully handle connection errors in tests
    })
  }

  async check(identifier: string, config: RateLimitConfig): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
  }> {
    try {
      const now = Date.now()
      const key = `ratelimit:${identifier}`
      const count = await this.redisClient.incr(key)

      if (count === 1) {
        await this.redisClient.expire(key, Math.ceil(config.windowMs / 1000))
      }

      const remaining = Math.max(0, config.maxRequests - count)
      const allowed = count <= config.maxRequests

      return {
        allowed,
        remaining,
        resetTime: now + config.windowMs
      }
    } catch (error) {
      // Fallback to in-memory store if Redis fails
      return checkRateLimit(identifier, {
        requests: config.maxRequests,
        windowMs: config.windowMs
      })
    }
  }

  async reset(identifier: string): Promise<void> {
    const key = `ratelimit:${identifier}`
    await this.redisClient.del(key)
  }
}

// Get rate limit config
export function getRateLimitConfig(type: keyof typeof RATE_LIMITS = 'authenticated'): RateLimitConfig {
  const limit = RATE_LIMITS[type]
  return {
    windowMs: limit.windowMs,
    maxRequests: limit.requests
  }
}

// Create rate limit middleware
export function createRateLimitMiddleware(config?: RateLimitConfig) {
  const limiter = new RateLimiter(config)

  return async (request: NextRequest, next: () => Promise<NextResponse>): Promise<NextResponse> => {
    try {
      const session = await auth()
      const rateLimitConfig = config || getRateLimitConfig(session?.user ? 'authenticated' : 'unauthenticated')

      // Use user ID for authenticated requests, IP for unauthenticated
      const identifier = session?.user?.id || getClientIP(request)

      const rateLimit = await limiter.check(identifier, rateLimitConfig)

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
              'X-RateLimit-Remaining': rateLimit.remaining.toString(),
              'X-RateLimit-Reset': rateLimit.resetTime.toString(),
              'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
            }
          }
        )
      }

      // Add rate limit headers to successful response
      const response = await next()

      if (response instanceof NextResponse) {
        response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString())
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
        response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
      }

      return response
    } catch (error) {
      // If rate limiting fails, allow the request to proceed
      logger.error('Rate limiting error', error)
      return next()
    }
  }
}

// Helper function to wrap handler with rate limiting
function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: { limit: keyof typeof RATE_LIMITS }
): (request: NextRequest) => Promise<NextResponse> {
  const config = getRateLimitConfig(options.limit)
  return (request) => createRateLimitMiddleware(config)(request, () => handler(request))
}

// Get client IP from request
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (clientIP) {
    return clientIP
  }

  // Fallback to a default identifier
  return 'unknown'
}

// Combined middleware with organization context and rate limiting
export function withFullProtection(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: {
    requireAuth?: boolean
    rateLimit?: keyof typeof RATE_LIMITS
  } = { requireAuth: true, rateLimit: 'authenticated' }
) {
  return withRateLimit(withOrgContext(handler, options), { limit: options.rateLimit })
}
