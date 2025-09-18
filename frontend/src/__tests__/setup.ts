import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock fetch globally
global.fetch = vi.fn()

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
  },
  writable: true,
})

// Setup cleanup
beforeEach(() => {
  vi.clearAllMocks()
})
