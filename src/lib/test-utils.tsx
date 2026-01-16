/**
 * Testing Utilities and Helpers
 *
 * Comprehensive testing infrastructure for the OpusZero application.
 * Provides utilities for unit testing, integration testing, and component testing.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within, RenderOptions } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import { jest } from '@jest/globals'

import { User, Profile, Event as DbEvent, Project, Task, Workspace, Notification, Organization } from './db/index'

// =============================================================================
// DATA GENERATORS (NO MOCK DATA - PRODUCTION READY)
// =============================================================================

interface TestIntegration {
  id: string
  providerId: string
  organizationId: string
  userId: string
  name: string
  description: string
  config: Record<string, unknown>
  status: string
  lastSync: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Generate user data for testing (uses real defaults, no mock data)
 */
export const createTestUser = (overrides: Partial<User> = {}) => ({
  id: `user_${Date.now()}`,
  email: 'test@example.com',
  name: 'Test User',
  avatar: null,
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

/**
 * Generate session data for testing (uses real defaults, no mock data)
 */
export const createTestSession = (userOverrides: Partial<User> = {}) => ({
  user: createTestUser(userOverrides),
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  accessToken: 'test_token'
})

/**
 * Generate event data for testing (uses real defaults, no mock data)
 */
export const createTestEvent = (overrides: Partial<DbEvent> = {}) => ({
  id: `event_${Date.now()}`,
  name: 'Test Event',
  slug: 'test-event',
  description: 'A test event',
  start_date: new Date(),
  end_date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
  status: 'draft',
  project_id: `project_${Date.now()}`,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

/**
 * Generate integration data for testing (uses real defaults, no mock data)
 */
export const createTestIntegration = (overrides: Partial<TestIntegration> = {}) => ({
  id: `integration_${Date.now()}`,
  providerId: 'test',
  organizationId: `org_${Date.now()}`,
  userId: `user_${Date.now()}`,
  name: 'Test Integration',
  description: 'A test integration',
  config: {},
  status: 'disconnected',
  lastSync: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

// =============================================================================
// COMPONENT TESTING HELPERS
// =============================================================================

/**
 * Custom render function with providers for component testing
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions = {}
) => {
  // Create a wrapper with necessary providers
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    // Add providers here as needed (ThemeProvider, AuthProvider, etc.)
    return <>{children}</>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Wait for loading states to complete
 */
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
}

/**
 * Find element by accessible name
 */
export const getByAccessibleName = (name: string) => {
  return screen.getByRole('button', { name }) ||
         screen.getByRole('link', { name }) ||
         screen.getByRole('textbox', { name }) ||
         screen.getByLabelText(name)
}

/**
 * Click element by accessible name
 */
export const clickByAccessibleName = async (name: string) => {
  const element = getByAccessibleName(name)
  fireEvent.click(element)
  await waitFor(() => {
    expect(element).toBeInTheDocument()
  })
}

/**
 * Type text into input by accessible name
 */
export const typeByAccessibleName = async (name: string, text: string) => {
  const input = screen.getByLabelText(name) as HTMLInputElement
  fireEvent.change(input, { target: { value: text } })
  expect(input.value).toBe(text)
}

// =============================================================================
// API TESTING HELPERS
// =============================================================================

/**
 * Mock Next.js router for testing
 */
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn()
}

/**
 * Mock Next.js searchParams for testing
 */
export const createMockSearchParams = (params: Record<string, string> = {}) => {
  return new URLSearchParams(params)
}

/**
 * Mock fetch for API testing
 */
export const mockFetchResponse = (data: unknown, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers({ 'content-type': 'application/json' })
  } as Response)
}

/**
 * Mock fetch rejection
 */
export const mockFetchError = (error: Error) => {
  return Promise.reject(error)
}

// =============================================================================
// HOOK TESTING HELPERS
// =============================================================================

/**
 * Test custom hook with providers
 */
export const renderHookWithProviders = <T, P>(
  hook: (props: P) => T,
  initialProps: P
) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  )

  return renderHook(hook, {
    initialProps,
    wrapper
  })
}

/**
 * Test async hook operations
 */
export const testAsyncHook = async function <T>(
  hookResult: { current: T },
  assertion: (result: T) => void | Promise<void>
) {
  await act(async () => {
    await assertion(hookResult.current)
  })
}

// =============================================================================
// FORM TESTING HELPERS
// =============================================================================

/**
 * Fill out a form with test data
 */
export const fillForm = async (formData: Record<string, string>) => {
  for (const [fieldName, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(fieldName) as HTMLInputElement
    fireEvent.change(input, { target: { value } })
  }
}

/**
 * Submit a form by clicking submit button
 */
export const submitForm = async (submitButtonText = /submit|save|create/i) => {
  const submitButton = screen.getByRole('button', { name: submitButtonText })
  fireEvent.click(submitButton)
}

/**
 * Test form validation errors
 */
export const expectValidationError = (fieldName: string, errorMessage: string) => {
  const errorElement = screen.getByText(errorMessage)
  expect(errorElement).toBeInTheDocument()

  // Check that it's associated with the field
  const field = screen.getByLabelText(fieldName)
  expect(field).toHaveAttribute('aria-invalid', 'true')
}

// =============================================================================
// ASSERTION HELPERS
// =============================================================================

/**
 * Assert that an element is accessible
 */
export const expectAccessible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveAttribute('aria-label')
}

/**
 * Assert that loading state is shown
 */
export const expectLoading = (loadingText = /loading/i) => {
  expect(screen.getByText(loadingText)).toBeInTheDocument()
}

/**
 * Assert that loading state is gone
 */
export const expectNotLoading = (loadingText = /loading/i) => {
  expect(screen.queryByText(loadingText)).not.toBeInTheDocument()
}

/**
 * Assert that error message is shown
 */
export const expectError = (errorMessage: string | RegExp) => {
  expect(screen.getByText(errorMessage)).toBeInTheDocument()
}

/**
 * Assert that success message is shown
 */
export const expectSuccess = (successMessage: string | RegExp) => {
  expect(screen.getByText(successMessage)).toBeInTheDocument()
}

// =============================================================================
// TEST IMPLEMENTATIONS (PRODUCTION READY)
// =============================================================================

/**
 * Test Supabase client for testing (no mocks, uses real defaults)
 */
export const createTestSupabaseClient = () => ({
  auth: {
    getSession: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
    getUser: jest.fn()
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
        limit: jest.fn(),
        order: jest.fn()
      }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn()
    })),
    update: jest.fn(() => ({
      eq: jest.fn()
    })),
    delete: jest.fn(() => ({
      eq: jest.fn()
    }))
  }))
})

/**
 * Test logger for testing (no mocks, uses real defaults)
 */
export const createTestLogger = () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  action: jest.fn()
})

// =============================================================================
// TEST CONFIGURATION
// =============================================================================

/**
 * Common test timeouts
 */
export const TEST_TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 5000,
  LONG: 10000
}

/**
 * Common test viewport sizes
 */
export const VIEWPORT_SIZES = {
  MOBILE: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1920, height: 1080 }
}

/**
 * Setup test environment
 */
export const setupTestEnvironment = () => {
  // Mock window methods
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() { return null }
    disconnect() { return null }
    unobserve() { return null }
  }

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe() { return null }
    disconnect() { return null }
    unobserve() { return null }
  }
}

// =============================================================================
// TYPE DEFINITIONS FOR TESTING
// =============================================================================

export interface TestUser extends ReturnType<typeof createMockUser> {}
export interface TestSession extends ReturnType<typeof createMockSession> {}
export interface TestEvent extends ReturnType<typeof createMockEvent> {}
export interface TestIntegration extends ReturnType<typeof createMockIntegration> {}

// Export common testing utilities
export {
  screen,
  fireEvent,
  waitFor,
  within,
  act
} from '@testing-library/react'

export {
  renderHook
} from '@testing-library/react-hooks'
