/**
 * API Utilities - Standardized patterns for API routes
 *
 * Provides consistent authentication, error handling, logging, and response patterns
 * across all API routes to ensure enterprise-grade reliability and maintainability.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import { ERROR_MESSAGES } from "./constants/error-messages"

// =============================================================================
// AUTHENTICATION UTILITIES
// =============================================================================

/**
 * Standardized authentication check for API routes
 * Returns session or throws standardized error response
 */
export async function requireAuth(request?: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      logger.warn('Unauthorized API access attempt', {
        url: request?.url,
        method: request?.method,
        userAgent: request?.headers.get('user-agent')
      })

      return NextResponse.json(
        { error: "Unauthorized", message: ERROR_MESSAGES.AUTH.UNAUTHORIZED },
        { status: 401 }
      )
    }

    return { session }
  } catch (error) {
    logger.error('Authentication error', error)
    return NextResponse.json(
      { error: "Authentication failed", message: ERROR_MESSAGES.API.SERVER_ERROR },
      { status: 500 }
    )
  }
}

/**
 * Check if user has required permissions
 * Returns true if authorized, or throws standardized error response
 */
export function requirePermission(session: Session, requiredPermissions: string[], resource?: string) {
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", message: ERROR_MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS },
      { status: 401 }
    )
  }

  const rawPermissions = (session as any).user?.permissions
  const userPermissions: string[] = Array.isArray(rawPermissions) ? rawPermissions : []

  const missing = requiredPermissions.filter((perm) => !userPermissions.includes(perm))

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: ERROR_MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS,
        details: { resource, missing }
      },
      { status: 403 }
    )
  }

  return { authorized: true, session }
}

// =============================================================================
// DATABASE UTILITIES
// =============================================================================

/**
 * Get authenticated Supabase client for API routes
 */
export async function getSupabaseClient() {
  return await createClient()
}

// =============================================================================
// RESPONSE UTILITIES
// =============================================================================

/**
 * Standardized success response
 */
export function apiSuccess<T = unknown>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}

/**
 * Standardized error response
 */
export function apiError(
  message: string,
  status = 500,
  code?: string,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: code || `HTTP_${status}`,
        details,
        timestamp: new Date().toISOString()
      }
    },
    { status }
  )
}

/**
 * Standardized validation error response
 */
export function apiValidationError(errors: Record<string, string[]>) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD("field"),
        code: "VALIDATION_ERROR",
        details: { fields: errors },
        timestamp: new Date().toISOString()
      }
    },
    { status: 400 }
  )
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate required fields in request body
 */
export function validateRequired(data: Record<string, unknown>, requiredFields: string[]): { isValid: boolean; errors: ValidationErrors } {
  const errors: Record<string, string[]> = {}

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = [`${field} is required`]
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate field types
 */
export function validateTypes(data: Record<string, unknown>, typeRules: Record<string, 'string' | 'number' | 'boolean' | 'object'>): { isValid: boolean; errors: ValidationErrors } {
  const errors: Record<string, string[]> = {}

  for (const [field, expectedType] of Object.entries(typeRules)) {
    if (data[field] !== undefined && typeof data[field] !== expectedType) {
      errors[field] = [`${field} must be of type ${expectedType}`]
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// =============================================================================
// LOGGING UTILITIES
// =============================================================================

/**
 * Standardized API action logging
 */
export function logApiAction(
  action: string,
  session: Session,
  entityType?: string,
  entityId?: string,
  metadata?: LogMetadata
) {
  logger.action(action, {
    userId: session?.user?.id,
    entityType,
    entityId,
    metadata,
    timestamp: new Date().toISOString()
  })
}

/**
 * Standardized API error logging
 */
export function logApiError(
  error: unknown,
  operation: string,
  session?: Session,
  metadata?: LogMetadata
) {
  logger.error(`API ${operation} error`, {
    error: error instanceof Error ? error.message : String(error),
    userId: session?.user?.id,
    metadata,
    stack: error instanceof Error ? error.stack : undefined
  })
}

// =============================================================================
// REQUEST UTILITIES
// =============================================================================

/**
 * Parse JSON request body with error handling
 */
export async function parseJsonBody(request: NextRequest): Promise<{ success: boolean; data?: unknown; error?: NextResponse }> {
  try {
    const data = await request.json()
    return { success: true, data }
  } catch (error) {
    logApiError(error, 'parse_json_body')
    return {
      success: false,
      error: apiError("Invalid JSON in request body", 400, "INVALID_JSON")
    }
  }
}

/**
 * Extract and validate query parameters
 */
export function getQueryParams(request: NextRequest, required: string[] = [], optional: string[] = []): { success: boolean; params?: Record<string, string>; error?: NextResponse } {
  const { searchParams } = new URL(request.url)
  const params: Record<string, string> = {}

  // Check required parameters
  for (const param of required) {
    const value = searchParams.get(param)
    if (!value) {
      return {
        success: false,
        error: apiError(`Missing required query parameter: ${param}`, 400, "MISSING_PARAMETER")
      }
    }
    params[param] = value
  }

  // Get optional parameters
  for (const param of optional) {
    const value = searchParams.get(param)
    if (value) {
      params[param] = value
    }
  }

  return { success: true, params }
}

// =============================================================================
// ACTIVITY LOGGING UTILITIES
// =============================================================================

/**
 * Log user activity to database
 */
export async function logActivity(
  session: Session,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: LogMetadata
) {
  try {
    const supabase = await getSupabaseClient()

    await supabase
      .from('activity_logs')
      .insert({
        user_id: session.user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          userAgent: metadata?.['userAgent'],
          ipAddress: metadata?.['ipAddress']
        }
      })
  } catch (error) {
    logApiError(error, 'activity_logging', session, { action, entityType, entityId })
    // Don't throw - activity logging failures shouldn't break the API
  }
}

// =============================================================================
// RATE LIMITING UTILITIES (Placeholder)
// =============================================================================

/**
 * Check rate limit (placeholder implementation)
 */
export async function checkRateLimit(
  _identifier: string,
  _limit: number = 100,
  _windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<{ allowed: boolean; resetTime?: number }> {
  // Placeholder for rate limiting implementation
  // In production, you'd implement Redis-based rate limiting
  return { allowed: true }
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Session {
  user: {
    id: string
    email: string
    name?: string
    image?: string
    permissions?: string[]
    role?: string
  }
  expires: string
}

export interface UserPermissions {
  roles: string[]
  permissions: string[]
}

export interface ValidationErrors {
  [field: string]: string[]
}

export interface LogMetadata {
  [key: string]: unknown
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: unknown
    timestamp: string
  }
  timestamp?: string
}

export interface ApiError {
  message: string
  code: string
  details?: unknown
  timestamp: string
}
