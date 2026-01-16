
/**
 * Timer Utility Hooks
 * 
 * Provides React hooks for setTimeout and setInterval with proper cleanup.
 * Replaces inline setTimeout/setInterval calls throughout the codebase.
 */

import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * useTimeout - Execute a callback after a delay
 * 
 * @param callback - Function to execute after delay
 * @param delay - Delay in milliseconds (null to disable)
 * 
 * @example
 * useTimeout(() => {
 *   setShowMessage(false)
 * }, 3000)
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout
  useEffect(() => {
    if (delay === null) return

    const id = setTimeout(() => savedCallback.current(), delay)
    return () => clearTimeout(id)
  }, [delay])
}

/**
 * useInterval - Execute a callback repeatedly at an interval
 * 
 * @param callback - Function to execute at each interval
 * @param delay - Interval in milliseconds (null to pause)
 * 
 * @example
 * useInterval(() => {
 *   setCount(c => c + 1)
 * }, isRunning ? 1000 : null)
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval
  useEffect(() => {
    if (delay === null) return

    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

/**
 * useTimeoutFn - Returns a function to start a timeout
 * 
 * @param callback - Function to execute after delay
 * @param delay - Delay in milliseconds
 * @returns [isReady, cancel, reset] - State and control functions
 * 
 * @example
 * const [isReady, cancel, reset] = useTimeoutFn(() => {
 *   doSomething()
 * }, 5000)
 */
export function useTimeoutFn(
  callback: () => void,
  delay: number
): { isReady: boolean | null; cancel: () => void; reset: () => void } {
  const [isReady, setIsReady] = useState<boolean | null>(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const savedCallback = useRef(callback)

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    setIsReady(null)
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
  }, [])

  const reset = useCallback(() => {
    setIsReady(false)
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    timeout.current = setTimeout(() => {
      setIsReady(true)
      savedCallback.current()
    }, delay)
  }, [delay])

  // Start timeout on mount
  useEffect(() => {
    reset()
    return cancel
  }, [cancel, reset])

  return { isReady, cancel, reset }
}

/**
 * useDebounce - Debounce a value
 * 
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300)
 * useEffect(() => {
 *   performSearch(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * useThrottle - Throttle a value
 * 
 * @param value - Value to throttle
 * @param interval - Throttle interval in milliseconds
 * @returns Throttled value
 * 
 * @example
 * const throttledPosition = useThrottle(mousePosition, 100)
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdated = useRef(Date.now())

  useEffect(() => {
    const now = Date.now()
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const id = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, interval - (now - lastUpdated.current))

      return () => clearTimeout(id)
    }
  }, [value, interval])

  return throttledValue
}

/**
 * useDebouncedCallback - Returns a debounced version of a callback
 * 
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced callback function
 * 
 * @example
 * const debouncedSave = useDebouncedCallback((data) => {
 *   saveToServer(data)
 * }, 500)
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
      timeout.current = setTimeout(() => {
        savedCallback.current(...args)
      }, delay)
    },
    [delay]
  )
}

/**
 * useCountdown - Countdown timer hook
 * 
 * @param initialSeconds - Starting seconds
 * @param onComplete - Callback when countdown reaches 0
 * @returns [secondsLeft, start, pause, reset]
 * 
 * @example
 * const [seconds, start, pause, reset] = useCountdown(60, () => {
 *   alert('Time is up!')
 * })
 */
export function useCountdown(
  initialSeconds: number,
  onComplete?: () => void
): [number, () => void, () => void, () => void] {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const savedOnComplete = useRef(onComplete)

  useEffect(() => {
    savedOnComplete.current = onComplete
  }, [onComplete])

  useInterval(
    () => {
      if (seconds > 0) {
        setSeconds(s => s - 1)
      } else {
        setIsRunning(false)
        savedOnComplete.current?.()
      }
    },
    isRunning ? 1000 : null
  )

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setIsRunning(false)
    setSeconds(initialSeconds)
  }, [initialSeconds])

  return [seconds, start, pause, reset]
}

