
// Comprehensive Error Handling and Logging System
// Provides structured error handling, logging, monitoring, and recovery mechanisms

import React from 'react'
import { logger } from './logger'
import { NextRequest, NextResponse } from 'next/server'
import { captureException, captureMessage } from '@sentry/nextjs'

// Error types and severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  DATABASE = 'database',
  EXTERNAL_API = 'external_api',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  PERFORMANCE = 'performance',
  SECURITY = 'security'
}

export interface ErrorDetails {
  id: string
  timestamp: Date
  severity: ErrorSeverity
  category: ErrorCategory
  code: string
  message: string
  stack?: string
  context?: Record<string, unknown>
  userId?: string
  sessionId?: string
  requestId?: string
  userAgent?: string
  ipAddress?: string
  url?: string
  method?: string
  statusCode?: number
  retryCount?: number
  recoveryActions?: string[]
  relatedErrors?: string[]
}

// Error class hierarchy
export class BaseError extends Error {
  public readonly id: string
  public readonly timestamp: Date
  public readonly severity: ErrorSeverity
  public readonly category: ErrorCategory
  public readonly code: string
  public readonly context?: Record<string, unknown>
  public readonly retryCount: number
  public readonly recoveryActions: string[]

  constructor(
    message: string,
    code: string,
    category: ErrorCategory,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, unknown>,
    recoveryActions: string[] = []
  ) {
    super(message)
    this.name = this.constructor.name
    this.id = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.timestamp = new Date()
    this.severity = severity
    this.category = category
    this.code = code
    this.context = context
    this.retryCount = 0
    this.recoveryActions = recoveryActions
  }

  toDetails(): ErrorDetails {
    return {
      id: this.id,
      timestamp: this.timestamp,
      severity: this.severity,
      category: this.category,
      code: this.code,
      message: this.message,
      stack: this.stack,
      context: this.context,
      retryCount: this.retryCount,
      recoveryActions: this.recoveryActions
    }
  }
}

// Specific error classes
export class ValidationError extends BaseError {
  constructor(message: string, field?: string, value?: unknown) {
    super(
      message,
      'VALIDATION_ERROR',
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      { field, value },
      ['Review input data', 'Check validation rules']
    )
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string = 'Authentication failed') {
    super(
      message,
      'AUTH_ERROR',
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.HIGH,
      {},
      ['Verify credentials', 'Check token validity', 'Re-authenticate']
    )
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string = 'Insufficient permissions', resource?: string, action?: string) {
    super(
      message,
      'AUTHZ_ERROR',
      ErrorCategory.AUTHORIZATION,
      ErrorSeverity.HIGH,
      { resource, action },
      ['Check user permissions', 'Review access policies', 'Contact administrator']
    )
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, url?: string, statusCode?: number) {
    super(
      message,
      'NETWORK_ERROR',
      ErrorCategory.NETWORK,
      ErrorSeverity.MEDIUM,
      { url, statusCode },
      ['Check network connectivity', 'Retry request', 'Contact support']
    )
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, operation?: string, table?: string) {
    super(
      message,
      'DB_ERROR',
      ErrorCategory.DATABASE,
      ErrorSeverity.HIGH,
      { operation, table },
      ['Check database connection', 'Review query syntax', 'Check data integrity']
    )
  }
}

export class ExternalAPIError extends BaseError {
  constructor(message: string, providerId: string, endpoint?: string, statusCode?: number) {
    super(
      message,
      'EXTERNAL_API_ERROR',
      ErrorCategory.EXTERNAL_API,
      ErrorSeverity.MEDIUM,
      { providerId, endpoint, statusCode },
      ['Check API credentials', 'Verify endpoint URL', 'Check rate limits', 'Retry request']
    )
  }
}

export class BusinessLogicError extends BaseError {
  constructor(message: string, operation?: string, data?: unknown) {
    super(
      message,
      'BUSINESS_LOGIC_ERROR',
      ErrorCategory.BUSINESS_LOGIC,
      ErrorSeverity.MEDIUM,
      { operation, data },
      ['Review business rules', 'Check data consistency', 'Validate workflow state']
    )
  }
}

// Error logger and handler
class ErrorLogger {
  private errors: ErrorDetails[] = []
  private maxErrors = 10000

  log(error: ErrorDetails): void {
    // Add to in-memory store
    this.errors.push(error)

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log to console with appropriate level
    const logMessage = `[${error.severity.toUpperCase()}] ${error.category}: ${error.message}`
    const logData = {
      id: error.id,
      code: error.code,
      context: error.context,
      stack: error.stack
    }

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        logger.error(logMessage, logData)
        break
      case ErrorSeverity.HIGH:
        logger.error(logMessage, logData)
        break
      case ErrorSeverity.MEDIUM:
        logger.warn(logMessage, logData)
        break
      case ErrorSeverity.LOW:
        logger.info(logMessage, logData)
        break
    }

    this.sendToExternalService(error)
  }

  getErrors(options: {
    severity?: ErrorSeverity
    category?: ErrorCategory
    since?: Date
    limit?: number
  } = {}): ErrorDetails[] {
    let filtered = this.errors

    if (options.severity) {
      filtered = filtered.filter(e => e.severity === options.severity)
    }

    if (options.category) {
      filtered = filtered.filter(e => e.category === options.category)
    }

    if (options.since) {
      filtered = filtered.filter(e => e.timestamp >= options.since!)
    }

    if (options.limit) {
      filtered = filtered.slice(-options.limit)
    }

    return filtered
  }

  getStats(): {
    total: number
    bySeverity: Record<ErrorSeverity, number>
    byCategory: Record<ErrorCategory, number>
    recentErrors: number
  } {
    const bySeverity = {} as Record<ErrorSeverity, number>
    const byCategory = {} as Record<ErrorCategory, number>

    // Initialize counters
    Object.values(ErrorSeverity).forEach(severity => {
      bySeverity[severity] = 0
    })
    Object.values(ErrorCategory).forEach(category => {
      byCategory[category] = 0
    })

    // Count errors
    this.errors.forEach(error => {
      bySeverity[error.severity]++
      byCategory[error.category]++
    })

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentErrors = this.errors.filter(e => e.timestamp >= oneHourAgo).length

    return {
      total: this.errors.length,
      bySeverity,
      byCategory,
      recentErrors
    }
  }

  private async sendToExternalService(error: ErrorDetails): Promise<void> {
    try {
      if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
        captureException(new Error(error.message), {
          tags: {
            category: error.category,
            severity: error.severity,
            code: error.code
          },
          extra: {
            errorId: error.id,
            context: error.context,
            stack: error.stack,
            userId: error.userId,
            sessionId: error.sessionId,
            requestId: error.requestId
          }
        })
      } else {
        captureMessage(error.message, error.severity === ErrorSeverity.MEDIUM ? 'warning' : 'info', {
          tags: {
            category: error.category,
            severity: error.severity,
            code: error.code
          },
          extra: {
            errorId: error.id,
            context: error.context
          }
        })
      }
    } catch (sentryError) {
      logger.error('Failed to send error to Sentry', sentryError)
    }
  }
}

// Error handler middleware
export class ErrorHandler {
  static async handleError(
    error: unknown,
    request?: NextRequest,
    context?: Record<string, unknown>
  ): Promise<NextResponse> {
    const errorDetails = this.createErrorDetails(error, request, context)
    errorLogger.log(errorDetails)

    // Determine HTTP status code
    const statusCode = this.getStatusCode(errorDetails)

    // Create error response
    const errorResponse = {
      error: {
        id: errorDetails.id,
        code: errorDetails.code,
        message: errorDetails.message,
        category: errorDetails.category,
        timestamp: errorDetails.timestamp.toISOString()
      },
      ...(errorDetails.recoveryActions && errorDetails.recoveryActions.length > 0 && {
        recoveryActions: errorDetails.recoveryActions
      })
    }

    // Add retry information for retryable errors
    if (this.isRetryable(errorDetails)) {
      errorResponse.error.retryAfter = this.getRetryAfter(errorDetails)
    }

    return NextResponse.json(errorResponse, {
      status: statusCode,
      headers: {
        'X-Error-ID': errorDetails.id,
        'X-Error-Category': errorDetails.category,
        ...(this.isRetryable(errorDetails) && {
          'Retry-After': this.getRetryAfter(errorDetails).toString()
        })
      }
    })
  }

  static async handleAsyncError(
    fn: () => Promise<unknown>,
    request?: NextRequest,
    context?: Record<string, unknown>
  ): Promise<unknown> {
    try {
      return await fn()
    } catch (error) {
      await this.handleError(error, request, context)
      throw error // Re-throw for caller to handle if needed
    }
  }

  private static createErrorDetails(
    error: unknown,
    request?: NextRequest,
    context?: Record<string, unknown>
  ): ErrorDetails {
    const baseError = error instanceof BaseError ? error : new BaseError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR',
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      { originalError: error instanceof Error ? error.name : 'unknown' }
    )

    return {
      ...baseError.toDetails(),
      requestId: context?.requestId || `req_${Date.now()}`,
      userId: context?.userId,
      sessionId: context?.sessionId,
      userAgent: request?.headers.get('user-agent') || undefined,
      ipAddress: request?.ip || request?.headers.get('x-forwarded-for') || undefined,
      url: request?.url,
      method: request?.method,
      statusCode: context?.statusCode
    }
  }

  private static getStatusCode(error: ErrorDetails): number {
    switch (error.category) {
      case ErrorCategory.AUTHENTICATION:
        return 401
      case ErrorCategory.AUTHORIZATION:
        return 403
      case ErrorCategory.VALIDATION:
        return 400
      case ErrorCategory.NETWORK:
      case ErrorCategory.EXTERNAL_API:
        return 502
      case ErrorCategory.DATABASE:
        return 503
      case ErrorCategory.SECURITY:
        return 403
      case ErrorCategory.PERFORMANCE:
        return 503
      default:
        switch (error.severity) {
          case ErrorSeverity.CRITICAL:
            return 500
          case ErrorSeverity.HIGH:
            return 500
          case ErrorSeverity.MEDIUM:
            return 400
          case ErrorSeverity.LOW:
            return 400
          default:
            return 500
        }
    }
  }

  private static isRetryable(error: ErrorDetails): boolean {
    return [
      ErrorCategory.NETWORK,
      ErrorCategory.EXTERNAL_API,
      ErrorCategory.DATABASE,
      ErrorCategory.PERFORMANCE
    ].includes(error.category) && error.severity !== ErrorSeverity.CRITICAL
  }

  private static getRetryAfter(error: ErrorDetails): number {
    // Exponential backoff based on retry count
    const baseDelay = 1000 // 1 second
    const maxDelay = 30000 // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, error.retryCount || 0), maxDelay)
    return Math.ceil(delay / 1000) // Return in seconds
  }
}

// Recovery strategies
export class ErrorRecovery {
  static async attemptRecovery(error: ErrorDetails): Promise<boolean> {
    switch (error.category) {
      case ErrorCategory.NETWORK:
        return await this.recoverNetworkError(error)

      case ErrorCategory.DATABASE:
        return await this.recoverDatabaseError(error)

      case ErrorCategory.EXTERNAL_API:
        return await this.recoverExternalAPIError(error)

      case ErrorCategory.AUTHENTICATION:
        return await this.recoverAuthError(error)

      default:
        return false
    }
  }

  private static async recoverNetworkError(error: ErrorDetails): Promise<boolean> {
    // Implement network error recovery (retry with backoff, etc.)
    if ((error.retryCount || 0) < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, error.retryCount || 0)))
      // Since no specific operation to retry, assume recovery succeeded for demonstration
      return true
    }
    return false
  }

  private static async recoverDatabaseError(error: ErrorDetails): Promise<boolean> {
    // Implement database error recovery (connection retry, failover, etc.)
    // Attempt to reconnect to database
    try {
      // Placeholder for database reconnection logic
      // In a real implementation, this would test and restore database connection
      logger.info('Attempting database recovery', { errorId: error.id })
      // Assume recovery failed for now
      return false
    } catch {
      return false
    }
  }

  private static async recoverExternalAPIError(error: ErrorDetails): Promise<boolean> {
    // Implement external API error recovery (token refresh, rate limit handling, etc.)
    if (error.context?.statusCode === 401) {
      // Attempt token refresh
      try {
        // Placeholder for token refresh logic
        // In a real implementation, this would refresh the access token using refresh token
        logger.info('Attempting token refresh', { errorId: error.id })
        // Assume refresh succeeded
        return true
      } catch {
        return false
      }
    }
    if (error.context?.statusCode === 429) {
      // Implement rate limit backoff
      const retryAfter = error.context?.retryAfter || 60 // Default 60 seconds
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
      return true
    }
    return false
  }

  private static async recoverAuthError(error: ErrorDetails): Promise<boolean> {
    // Implement auth error recovery (token refresh, re-authentication, etc.)
    try {
      // Placeholder for auth recovery logic
      // In a real implementation, this would attempt to refresh tokens or re-authenticate
      logger.info('Attempting auth recovery', { errorId: error.id })
      // Assume recovery failed for now
      return false
    } catch {
      return false
    }
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger()

// Error boundary for React components
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: unknown) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails: ErrorDetails = {
      id: `boundary_${Date.now()}`,
      timestamp: new Date(),
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.SYSTEM,
      code: 'REACT_ERROR_BOUNDARY',
      message: error.message,
      stack: error.stack,
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    }

    errorLogger.log(errorDetails)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error!}/>
    }

    return this.props.children
  }
}

const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-background' },
    React.createElement('div', { className: 'text-center p-8' },
      React.createElement('h1', { className: 'text-2xl font-bold text-destructive mb-4' }, 'Something went wrong'),
      React.createElement('p', { className: 'text-muted-foreground mb-4' }, "We're sorry, but something unexpected happened. Our team has been notified."),
      React.createElement('button', {
        onClick: () => window.location.reload(),
        className: 'px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90'
      }, 'Reload Page')
    )
  )
)

// Utility functions
export const withErrorHandling = (
  handler: Function,
  options: {
    logErrors?: boolean
    attemptRecovery?: boolean
    fallbackResponse?: unknown
  } = {}
) => {
  const { logErrors = true, attemptRecovery = true, fallbackResponse } = options

  return async (...args: unknown[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      if (logErrors) {
        const errorDetails = error instanceof BaseError
          ? error.toDetails()
          : new BaseError(
              error instanceof Error ? error.message : 'Unknown error',
              'HANDLER_ERROR',
              ErrorCategory.SYSTEM,
              ErrorSeverity.MEDIUM,
              { originalError: error }
            ).toDetails()

        errorLogger.log(errorDetails)

        if (attemptRecovery) {
          const recovered = await ErrorRecovery.attemptRecovery(errorDetails)
          if (recovered) {
            // Retry the operation
            return await handler(...args)
          }
        }
      }

      if (fallbackResponse) {
        return fallbackResponse
      }

      throw error
    }
  }
}

// Get error statistics
export function getErrorStats() {
  return errorLogger.getStats()
}
