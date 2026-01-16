/**
 * Global Error Boundary
 * Enterprise-grade error boundary for catching and handling runtime errors
 * Provides user-friendly error UI and comprehensive error reporting
 */

'use client'

import React, { Component, ReactNode, ErrorInfo } from 'react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ERROR_MESSAGES } from '@/lib/constants/error-messages'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  level?: 'page' | 'section' | 'component'
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props
    const { errorId } = this.state

    // Log comprehensive error information
    logger.error(`ErrorBoundary caught ${level} error`, {
      errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level,
      retryCount: this.retryCount,
      timestamp: new Date().toISOString()
    })

    // Update state with error info
    this.setState({
      errorInfo
    })

    // Call custom error handler if provided
    if (onError) {
      try {
        onError(error, errorInfo)
      } catch (handlerError) {
        logger.error('Error in custom error handler', handlerError)
      }
    }

    // Report to external monitoring (if available)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        ;(window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: false
        })
      } catch (e) {
        // Ignore gtag errors
      }
    }
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      logger.info(`Retrying after error (attempt ${this.retryCount}/${this.maxRetries})`, {
        errorId: this.state.errorId
      })

      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      })
    }
  }

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  handleReportBug = () => {
    const { error, errorId } = this.state
    const subject = encodeURIComponent(`Bug Report: ${error?.message || 'Unknown Error'}`)
    const body = encodeURIComponent(`
Error ID: ${errorId}
Message: ${error?.message}
Stack: ${error?.stack}
URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
    `.trim())

    const mailtoUrl = `mailto:support@opuszero.com?subject=${subject}&body=${body}`

    if (typeof window !== 'undefined') {
      window.open(mailtoUrl)
    }
  }

  render() {
    const { hasError, error, errorInfo, errorId } = this.state
    const { fallback, showDetails = false, children } = this.props

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                {ERROR_MESSAGES.UI.SOMETHING_WENT_WRONG}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {ERROR_MESSAGES.UI.UNEXPECTED_ERROR_DESCRIPTION}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={this.handleRetry} variant="default">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Button onClick={this.handleGoHome} variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>

                <Button onClick={this.handleReportBug} variant="outline">
                  <Bug className="w-4 h-4 mr-2" />
                  Report Bug
                </Button>
              </div>

              {errorId && (
                <div className="text-center text-sm text-gray-500">
                  Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{errorId}</code>
                </div>
              )}

              {showDetails && error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Error:</strong> {error.message}
                    </div>
                    {error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">{error.stack}</pre>
                      </div>
                    )}
                    {errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return children
  }
}

/**
 * Page-level Error Boundary
 * Specialized for Next.js pages with navigation recovery
 */
export class PageErrorBoundary extends ErrorBoundary {
  constructor(props: ErrorBoundaryProps) {
    super(props)
  }

  handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  render() {
    const { hasError } = this.state

    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                {ERROR_MESSAGES.UI.PAGE_ERROR}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {ERROR_MESSAGES.UI.PAGE_ERROR_DESCRIPTION}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={this.handleRetry} variant="default">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>

                <Button onClick={this.handleGoBack} variant="outline">
                  Go Back
                </Button>

                <Button onClick={this.handleGoHome} variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Async Error Boundary
 * Specialized for handling async operation errors
 */
export class AsyncErrorBoundary extends Component<
  { children: ReactNode; onRetry?: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; onRetry?: () => void }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Async operation error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }

  handleRetry = () => {
    const { onRetry } = this.props
    this.setState({ hasError: false, error: null })

    if (onRetry) {
      onRetry()
    }
  }

  render() {
    const { hasError, error } = this.state
    const { children } = this.props

    if (hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Operation failed</span>
            </div>
            <Button onClick={this.handleRetry} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
          {error && (
            <p className="text-red-700 text-sm mt-2">{error.message}</p>
          )}
        </div>
      )
    }

    return children
  }
}

/**
 * Hook for error handling in functional components
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    logger.error('Error handled by hook', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    })

    // Could integrate with error reporting service here
  }
}

/**
 * HOC for wrapping components with error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
