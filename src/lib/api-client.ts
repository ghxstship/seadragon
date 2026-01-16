
/**
 * Centralized API Client
 * 
 * Provides a typed, consistent interface for all API calls.
 * Replaces scattered fetch calls throughout the codebase.
 */

import { logger } from './logger'
import { URLS } from './constants/config'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
  timeout?: number
  retries?: number
  retryDelay?: number
}

interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
  ok: boolean
}

interface ApiClientConfig {
  baseUrl: string
  defaultHeaders?: Record<string, string>
  timeout?: number
  retries?: number
  retryDelay?: number
  onRequest?: (url: string, config: RequestInit) => void
  onResponse?: <T>(response: ApiResponse<T>) => void
  onError?: (error: Error) => void
}

const DEFAULT_TIMEOUT = 30000 // 30 seconds
const DEFAULT_RETRIES = 0
const DEFAULT_RETRY_DELAY = 1000 // 1 second

/**
 * Build URL with query parameters
 */
function buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(path, baseUrl)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  
  return url.toString()
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create an API client instance
 */
export function createApiClient(config: ApiClientConfig) {
  const {
    baseUrl,
    defaultHeaders = {},
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    onRequest,
    onResponse,
    onError,
  } = config

  async function request<T>(
    method: HttpMethod,
    path: string,
    requestConfig: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      headers = {},
      params,
      body,
      timeout: requestTimeout = timeout,
      retries: requestRetries = retries,
      retryDelay: requestRetryDelay = retryDelay,
    } = requestConfig

    const url = buildUrl(baseUrl, path, params)
    
    const fetchConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...headers,
      },
    }

    if (body && method !== 'GET') {
      fetchConfig.body = JSON.stringify(body)
    }

    // Log the request
    logger.api(method, path, { params })
    onRequest?.(url, fetchConfig)

    let lastError: Error | null = null
    let attempts = 0

    while (attempts <= requestRetries) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout)
        
        fetchConfig.signal = controller.signal

        const response = await fetch(url, fetchConfig)
        clearTimeout(timeoutId)

        let data: T | null = null
        const contentType = response.headers.get('content-type')
        
        if (contentType?.includes('application/json')) {
          try {
            data = await response.json()
          } catch {
            // Response body is not valid JSON
          }
        }

        const result: ApiResponse<T> = {
          data,
          error: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          ok: response.ok,
        }

        onResponse?.(result)

        if (!response.ok) {
          logger.warn(`API request failed: ${method} ${path}`, {
            status: response.status,
            statusText: response.statusText,
          })
        }

        return result
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        attempts++

        if (attempts <= requestRetries) {
          logger.warn(`API request failed, retrying (${attempts}/${requestRetries})`, {
            path,
            error: lastError.message,
          })
          await sleep(requestRetryDelay * attempts) // Exponential backoff
        }
      }
    }

    // All retries exhausted
    const errorMessage = lastError?.message || 'Unknown error'
    logger.error(`API request failed after ${attempts} attempts`, lastError, { path })
    onError?.(lastError || new Error(errorMessage))

    return {
      data: null,
      error: errorMessage,
      status: 0,
      ok: false,
    }
  }

  return {
    get: <T>(path: string, config?: RequestConfig) => request<T>('GET', path, config),
    post: <T>(path: string, body?: unknown, config?: RequestConfig) => 
      request<T>('POST', path, { ...config, body }),
    put: <T>(path: string, body?: unknown, config?: RequestConfig) => 
      request<T>('PUT', path, { ...config, body }),
    patch: <T>(path: string, body?: unknown, config?: RequestConfig) => 
      request<T>('PATCH', path, { ...config, body }),
    delete: <T>(path: string, config?: RequestConfig) => request<T>('DELETE', path, config),
    
    // Raw request method for custom needs
    request,
  }
}

// Default API client for internal API calls
export const apiClient = createApiClient({
  baseUrl: typeof window !== 'undefined' ? window.location.origin : URLS.DEVELOPMENT,
  defaultHeaders: {
    'Accept': 'application/json',
  },
})

// Stripe API client factory
export function createStripeClient(secretKey: string) {
  return createApiClient({
    baseUrl: 'https://api.stripe.com/v1',
    defaultHeaders: {
      'Authorization': `Bearer ${secretKey}`,
      'Stripe-Version': '2023-10-16',
    },
    retries: 2,
  })
}

// Generic external API client factory
export function createExternalClient(baseUrl: string, apiKey?: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  }
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  return createApiClient({
    baseUrl,
    defaultHeaders: headers,
  })
}

// Type exports
export type { HttpMethod, RequestConfig, ApiResponse, ApiClientConfig }
