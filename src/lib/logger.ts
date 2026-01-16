
/**
 * Centralized Logging Service
 * 
 * Replaces direct console.log usage with structured logging.
 * Integrates with error tracking services in production.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: Error
}

interface LoggerConfig {
  minLevel: LogLevel
  enableConsole: boolean
  enableRemote: boolean
  serviceName: string
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enableConsole: process.env.NODE_ENV !== 'production',
  enableRemote: process.env.NODE_ENV === 'production',
  serviceName: 'opuszero',
}

class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel]
  }

  private formatEntry(entry: LogEntry): string {
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : ''
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`
  }

  private createEntry(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote) return

    // Integration point for remote logging services
    // Examples: Sentry, LogRocket, DataDog, etc.
    try {
      // Sentry integration example (uncomment when Sentry is configured)
      // if (entry.level === 'error' && entry.error) {
      //   Sentry.captureException(entry.error, {
      //     extra: entry.context,
      //   })
      // } else if (entry.level === 'error' || entry.level === 'warn') {
      //   Sentry.captureMessage(entry.message, {
      //     level: entry.level,
      //     extra: entry.context,
      //   })
      // }
    } catch {
      // Silently fail remote logging to prevent cascading errors
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry = this.createEntry(level, message, context, error)

    if (this.config.enableConsole) {
      const formatted = this.formatEntry(entry)
      switch (level) {
        case 'debug':
          // console.debug(formatted)
          break
        case 'info':
          // console.info(formatted)
          break
        case 'warn':
          console.warn(formatted)
          break
        case 'error':
          console.error(formatted, error)
          break
      }
    }

    this.sendToRemote(entry)
  }

  /**
   * Debug level logging - only shown in development
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  /**
   * Info level logging - general application events
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  /**
   * Warning level logging - potential issues that don't break functionality
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  /**
   * Error level logging - errors that need attention
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const err = error instanceof Error ? error : undefined
    const ctx = error instanceof Error ? context : (error as LogContext)
    this.log('error', message, ctx, err)
  }

  /**
   * Create a child logger with additional context
   */
  child(defaultContext: LogContext): ChildLogger {
    return new ChildLogger(this, defaultContext)
  }

  /**
   * Log a user action (for analytics/debugging)
   */
  action(action: string, context?: LogContext): void {
    this.debug(`[ACTION] ${action}`, context)
  }

  /**
   * Log an API call
   */
  api(method: string, endpoint: string, context?: LogContext): void {
    this.debug(`[API] ${method} ${endpoint}`, context)
  }

  /**
   * Log navigation events
   */
  navigate(path: string, context?: LogContext): void {
    this.debug(`[NAVIGATE] ${path}`, context)
  }

  /**
   * Log search queries
   */
  search(query: string, context?: LogContext): void {
    this.debug(`[SEARCH] ${query}`, context)
  }
}

class ChildLogger {
  private parent: Logger
  private defaultContext: LogContext

  constructor(parent: Logger, defaultContext: LogContext) {
    this.parent = parent
    this.defaultContext = defaultContext
  }

  private mergeContext(context?: LogContext): LogContext {
    return { ...this.defaultContext, ...context }
  }

  debug(message: string, context?: LogContext): void {
    this.parent.debug(message, this.mergeContext(context))
  }

  info(message: string, context?: LogContext): void {
    this.parent.info(message, this.mergeContext(context))
  }

  warn(message: string, context?: LogContext): void {
    this.parent.warn(message, this.mergeContext(context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.parent.error(message, error, this.mergeContext(context))
  }
}

// Singleton instance for application-wide use
export const logger = new Logger()

// Named exports for specific use cases
export { Logger, ChildLogger }
export type { LogLevel, LogContext, LogEntry, LoggerConfig }
