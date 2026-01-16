/**
 * Jest Setup File
 * Global test configuration and setup for all test suites
 */

import '@testing-library/jest-dom'

// Add TextEncoder/TextDecoder for modern APIs
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock until-async for MSW
jest.mock('until-async', () => ({
  until: jest.fn()
}))

// Mock MSW
jest.mock('msw', () => ({
  rest: {
    get: jest.fn(() => ({})),
    post: jest.fn(() => ({})),
  },
  setupWorker: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
}))

// Mock Response for MSW
if (typeof global.Response === 'undefined') {
  global.Response = function Response(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText || ''
    this.headers = options.headers || {}
    this.json = () => Promise.resolve(typeof body === 'string' ? JSON.parse(body) : body)
    this.text = () => Promise.resolve(body)
  }
}

// Mock BroadcastChannel for MSW
global.BroadcastChannel = global.BroadcastChannel || class BroadcastChannel {
  constructor(name) {
    this.name = name
  }
  postMessage() {}
  close() {}
  onmessage = null
  onmessageerror = null
}

// Mock Streams for MSW
global.WritableStream = global.WritableStream || class WritableStream {
  constructor() {}
  getWriter() { return { write: () => {}, close: () => {}, abort: () => {} } }
}
global.ReadableStream = global.ReadableStream || class ReadableStream {
  constructor() {}
  getReader() { return { read: () => Promise.resolve({ done: true }), cancel: () => {} } }
}
global.TransformStream = global.TransformStream || class TransformStream {
  constructor() {
    this.writable = new global.WritableStream()
    this.readable = new global.ReadableStream()
  }
}

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/test'
process.env.NODE_ENV = 'test'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock Next.js headers
jest.mock('next/headers', () => ({
  headers: () => new Map(),
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = class MockIntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  get root() { return null; }
  get rootMargin() { return ''; }
  get thresholds() { return []; }
  takeRecords() { return []; }
}

// Mock window.requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16))
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id))

// Mock console methods to reduce noise during tests
const originalConsole = global.console
global.console = {
  ...originalConsole,
  // Keep error and warn for debugging
  error: jest.fn(),
  warn: jest.fn(),
  // Suppress info and log during tests
  info: jest.fn(),
  log: jest.fn(),
  debug: jest.fn(),
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})

// Add custom matchers
expect.extend({
  toBeValidDate(received) {
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
})

// Global test utilities
global.testUtils = {
  waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  createMockEvent: (type, data = {}) => ({
    type,
    data,
    timestamp: new Date(),
    ...data,
  }),
  createMockUser: (overrides = {}) => ({
    id: `user_${Date.now()}`,
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }),
  createMockSession: (userOverrides = {}) => ({
    user: global.testUtils.createMockUser(userOverrides),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    accessToken: 'test_token'
  }),
  createMockIntegration: (overrides = {}) => ({
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
  }),
}
