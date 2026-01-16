
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting configuration
const RATE_LIMITS = {
  // API endpoints
  '/api/': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100 // 100 requests per minute
  },
  '/api/auth/': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5 // 5 auth attempts per 15 minutes
  },
  '/api/webhooks/deliver': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50 // 50 webhook deliveries per minute
  },
  '/api/ai/': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30 // 30 AI requests per minute
  }
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(request: NextRequest, endpoint: string): NextResponse | null {
  // Find matching rate limit rule
  const rule = Object.entries(RATE_LIMITS).find(([path]) =>
    endpoint.startsWith(path)
  )

  if (!rule) {
    return null // No rate limit for this endpoint
  }

  const [path, config] = rule
  const clientId = getClientIdentifier(request)

  if (!clientId) {
    return NextResponse.json(
      { error: 'Unable to identify client' },
      { status: 400 }
    )
  }

  const key = `${clientId}:${path}`
  const now = Date.now()

  // Get current rate limit data
  let rateLimitData = rateLimitStore.get(key)

  // Clean up expired entries
  if (rateLimitData && rateLimitData.resetTime < now) {
    rateLimitStore.delete(key)
    rateLimitData = undefined
  }

  // Initialize or update rate limit data
  if (!rateLimitData) {
    rateLimitData = {
      count: 1,
      resetTime: now + config.windowMs
    }
    rateLimitStore.set(key, rateLimitData)
  } else {
    rateLimitData.count++
  }

  // Check if rate limit exceeded
  if (rateLimitData.count > config.maxRequests) {
    const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000)

    return new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: `Too many requests. Try again after ${new Date(rateLimitData.resetTime).toISOString()}`,
        retryAfter
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitData.resetTime.toString(),
          'Retry-After': retryAfter.toString()
        }
      }
    )
  }

  // Add rate limit headers to successful requests
  const remaining = Math.max(0, config.maxRequests - rateLimitData.count)

  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': rateLimitData.resetTime.toString()
    }
  })
}

function getClientIdentifier(request: NextRequest): string | null {
  // Try to get identifier from various sources

  // 1. API Key (for external integrations)
  const apiKey = request.headers.get('x-api-key')
  if (apiKey) {
    return `api-key:${apiKey.substring(0, 8)}`
  }

  // 2. Authorization token (for authenticated users)
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    return `bearer:${token.substring(0, 8)}`
  }

  // 3. User session (if available)
  // This would need to be checked after authentication middleware

  // 4. IP address (fallback)
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'
  return `ip:${ip}`
}

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000) // Clean up every minute
