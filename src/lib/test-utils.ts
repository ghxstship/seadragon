/**
 * Test Utilities
 * Comprehensive testing helpers and utilities for unit, integration, and component testing
 */

import { rest } from 'msw'
import { setupWorker } from 'msw'

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

/**
 * Creates a test user object with default values
 */
export function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user_123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }
}

/**
 * Creates a test session object
 */
export function createTestSession(overrides: Partial<Session> = {}): Session {
  return {
    user: createTestUser(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    ...overrides,
  }
}

/**
 * Creates a test brand object
 */
export function createTestBrand(overrides: Partial<Brand> = {}): Brand {
  return {
    id: 'brand_123',
    handle: 'testbrand',
    name: 'Test Brand',
    description: 'A test brand description',
    verified: true,
    stats: {
      followers: 1000,
      events: 5,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }
}

/**
 * Creates a test event object
 */
export function createTestEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: 'event_123',
    name: 'Test Event',
    slug: 'test-event',
    description: 'A test event description',
    start_date: new Date('2024-02-01T10:00:00Z'),
    end_date: new Date('2024-02-01T18:00:00Z'),
    location: 'Test Location',
    status: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }
}

/**
 * Creates a test booking object
 */
export function createTestBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: 'booking_123',
    experienceId: 'exp_123',
    userId: 'user_123',
    date: '2024-02-01',
    time: '10:00',
    guests: 2,
    status: 'confirmed',
    totalAmount: 150,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    ...overrides,
  }
}

// =============================================================================
// MOCK API RESPONSES
// =============================================================================

/**
 * Mock API handlers for testing
 */
export const mockApiHandlers = [
  // Auth endpoints
  rest.get('/api/auth/session', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      user: createTestUser(),
    }))
  }),

  // Brand endpoints
  rest.get('/api/v1/brands/:handle', (req, res, ctx) => {
    const { handle } = req.params
    return res(ctx.json({
      success: true,
      brand: createTestBrand({ handle: handle as string }),
    }))
  }),

  // Event endpoints
  rest.get('/api/events', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      events: [createTestEvent()],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    }))
  }),

  rest.post('/api/events', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      event: createTestEvent(),
    }))
  }),

  // Booking endpoints
  rest.post('/api/bookings', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      booking: createTestBooking(),
    }))
  }),
]

// =============================================================================
// MOCK SERVER SETUP
// =============================================================================

/**
 * Setup MSW worker for API mocking
 */
export const server = setupWorker(...mockApiHandlers)

// =============================================================================
// TEST UTILITIES
// =============================================================================

/**
 * Mock router for Next.js navigation testing
 */
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
}

/**
 * Creates a mock event handler
 */
export function createMockEventHandler() {
  return jest.fn()
}

/**
 * Waits for a specified amount of time (useful for async tests)
 */
export function waitForTimeout(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Renders a component with all necessary providers
 */
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  // This would normally wrap with theme, auth, etc. providers
  // For now, just return the rendered component
  const { render } = require('@testing-library/react')
  return render(ui, options)
}

// =============================================================================
// ASSERTION HELPERS
// =============================================================================

/**
 * Custom Jest matchers for testing
 */
expect.extend({
  toBeValidDate(received: unknown) {
    const pass = received instanceof Date && !isNaN(received.getTime())
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      }
    }
  },

  toBeValidUUID(received: unknown) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const pass = typeof received === 'string' && uuidRegex.test(received)
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      }
    }
  },
})

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

interface Session {
  user: User
  expires: string
}

interface Brand {
  id: string
  handle: string
  name: string
  description?: string
  verified: boolean
  stats?: {
    followers: number
    events: number
  }
  createdAt: Date
  updatedAt: Date
}

interface Event {
  id: string
  name: string
  slug: string
  description?: string
  start_date: Date
  end_date: Date
  location?: string
  status: 'draft' | 'published' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

interface Booking {
  id: string
  experienceId: string
  userId: string
  date: string
  time: string
  guests: number
  status: string
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDate(): R
      toBeValidUUID(): R
    }
  }
}
