# OpusZero Monitoring & Observability Setup

## Overview

Comprehensive monitoring setup for the OpusZero enterprise workflow platform, including error tracking, performance monitoring, and alerting.

## Error Tracking (Sentry)

### Installation & Configuration

1. **Install Sentry SDKs**:
   ```bash
   npm install @sentry/nextjs @sentry/profiling-node
   ```

2. **Configure Sentry Client** (`sentry.client.config.js`):
   ```javascript
   import * as Sentry from "@sentry/nextjs"

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 1.0,
     environment: process.env.NODE_ENV,
     replaysOnErrorSampleRate: 1.0,
     replaysSessionSampleRate: 0.1,
     integrations: [
       new Sentry.Replay({
         maskAllText: true,
         blockAllMedia: true,
       }),
       new Sentry.BrowserTracing(),
     ],
   })
   ```

3. **Configure Sentry Server** (`sentry.server.config.js`):
   ```javascript
   import * as Sentry from "@sentry/nextjs"

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
     environment: process.env.NODE_ENV,
     integrations: [
       new Sentry.BrowserTracing(),
       new Sentry.Prisma({ client: prisma }),
     ],
   })
   ```

4. **Configure Sentry Edge Runtime** (`sentry.edge.config.js`):
   ```javascript
   import * as Sentry from "@sentry/nextjs"

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
     environment: process.env.NODE_ENV,
   })
   ```

### Custom Error Boundaries

```tsx
// components/ErrorBoundary.tsx
'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              We're working to fix this issue.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

## Performance Monitoring

### Vercel Analytics (Recommended for Vercel Deployments)

1. **Install Vercel Analytics**:
   ```bash
   npm install @vercel/analytics
   ```

2. **Configure Analytics**:
   ```tsx
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react'

   export default function RootLayout({ children }) {
     return (
       <html lang="en">
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

### Custom Performance Monitoring

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

export const trackPerformance = (
  metric: string,
  value: number,
  tags?: Record<string, string>
) => {
  // Send to monitoring service
  Sentry.metrics.gauge(metric, value, {
    tags: {
      environment: process.env.NODE_ENV,
      ...tags
    }
  })

  // Log for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance: ${metric} = ${value}`, tags)
  }
}

export const trackApiCall = (
  endpoint: string,
  method: string,
  duration: number,
  statusCode: number
) => {
  trackPerformance('api_call_duration', duration, {
    endpoint,
    method,
    status_code: statusCode.toString(),
    status_range: statusCode >= 400 ? 'error' : 'success'
  })
}

export const trackDatabaseQuery = (
  table: string,
  operation: string,
  duration: number,
  rowCount?: number
) => {
  trackPerformance('db_query_duration', duration, {
    table,
    operation,
    row_count: rowCount?.toString()
  })
}

export const trackUserAction = (
  action: string,
  userId?: string,
  metadata?: Record<string, any>
) => {
  Sentry.captureMessage(`User Action: ${action}`, {
    level: 'info',
    user: { id: userId },
    extra: metadata
  })
}
```

### API Route Monitoring

```typescript
// lib/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { trackApiCall } from '@/lib/monitoring'

export function withMonitoring(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const startTime = Date.now()
    const { pathname } = new URL(request.url)
    const method = request.method

    try {
      const response = await handler(request, context)
      const duration = Date.now() - startTime
      const statusCode = response.status || 200

      trackApiCall(pathname, method, duration, statusCode)

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      trackApiCall(pathname, method, duration, 500)

      throw error
    }
  }
}

// Usage in API routes:
// export const GET = withMonitoring(async (request) => { ... })
```

## Database Monitoring

### Prisma Query Logging

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { trackDatabaseQuery } from '@/lib/monitoring'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
})

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Listen to query events
prisma.$on('query', (e) => {
  trackDatabaseQuery(
    e.query.split(' ')[2] || 'unknown', // Extract table name
    e.query.split(' ')[0], // Extract operation
    e.duration,
    e.result?.rowCount
  )
})
```

## Uptime Monitoring

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { trackPerformance } from '@/lib/monitoring'

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    // Check external services (optional)
    // await checkExternalServices()

    const responseTime = Date.now() - startTime

    trackPerformance('health_check_response_time', responseTime)

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
      database: 'connected'
    })
  } catch (error) {
    const responseTime = Date.now() - startTime

    trackPerformance('health_check_error', 1, {
      error: error.message
    })

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: error.message
    }, { status: 500 })
  }
}
```

## Alerting & Notifications

### Slack Integration

```typescript
// lib/slack.ts
import { WebClient } from '@slack/web-api'

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

export const sendSlackAlert = async (
  channel: string,
  message: string,
  attachments?: any[]
) => {
  try {
    await slack.chat.postMessage({
      channel,
      text: message,
      attachments
    })
  } catch (error) {
    console.error('Failed to send Slack alert:', error)
  }
}

export const sendErrorAlert = async (error: Error, context?: any) => {
  const message = ` Error Alert: ${error.message}`
  const attachments = [{
    color: 'danger',
    fields: [
      {
        title: 'Error',
        value: error.stack?.substring(0, 1000) || error.message,
        short: false
      },
      {
        title: 'Context',
        value: JSON.stringify(context, null, 2),
        short: false
      }
    ]
  }]

  await sendSlackAlert('#alerts', message, attachments)
}
```

### Email Notifications

```typescript
// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendErrorNotification = async (
  subject: string,
  error: Error,
  context?: any
) => {
  const html = `
    <h1>Error Alert</h1>
    <h2>${subject}</h2>
    <pre>${error.stack}</pre>
    <h3>Context</h3>
    <pre>${JSON.stringify(context, null, 2)}</pre>
  `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.ALERT_EMAIL,
    subject,
    html
  })
}
```

## Log Aggregation

### Winston Logger Configuration

```typescript
// lib/logger.ts
import winston from 'winston'
import * as Sentry from '@sentry/nextjs'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      format
    )
  }),
  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  new winston.transports.File({ filename: 'logs/combined.log' }),
]

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
})

// Custom error handler that sends to Sentry
export const logError = (error: Error, context?: any) => {
  logger.error('Application Error', { error: error.message, stack: error.stack, context })
  Sentry.captureException(error, { extra: context })
}

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta)
}

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta)
}
```

## Dashboard & Visualization

### Custom Monitoring Dashboard

```tsx
// app/admin/monitoring/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnalyticsChart } from '@/components/visualization/analytics-chart'

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('/api/admin/metrics')
      const data = await response.json()
      setMetrics(data)
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (!metrics) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <p className="text-2xl font-bold text-green-600">Healthy</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">245ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold text-red-600">0.12%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              type="line"
              data={[
                { label: '00:00', value: 120 },
                { label: '04:00', value: 95 },
                { label: '08:00', value: 180 },
                { label: '12:00', value: 250 },
                { label: '16:00', value: 210 },
                { label: '20:00', value: 160 }
              ]}
              title="API Response Times"
              showLegend={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              type="pie"
              data={[
                { label: '4xx Errors', value: 45, color: '#f59e0b' },
                { label: '5xx Errors', value: 12, color: '#ef4444' },
                { label: 'Timeouts', value: 8, color: '#8b5cf6' }
              ]}
              title="Error Types"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.recentErrors?.map((error, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-medium">{error.message}</p>
                  <p className="text-sm text-muted-foreground">{error.timestamp}</p>
                </div>
                <Badge variant="destructive">{error.level}</Badge>
              </div>
            )) || <p className="text-muted-foreground">No recent errors</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Alert Configuration

### Sentry Alert Rules
1. **Error Rate Alerts**: Trigger when error rate exceeds 5% for 5 minutes
2. **Performance Alerts**: Trigger when P95 response time exceeds 2 seconds
3. **Uptime Alerts**: Trigger when application is down for 2+ minutes

### Custom Alert Rules
```typescript
// lib/alerts.ts
export const checkAlertConditions = async () => {
  // Check error rates
  const errorRate = await getErrorRateLastHour()
  if (errorRate > 0.05) {
    await sendErrorAlert(new Error(`High error rate: ${errorRate * 100}%`))
  }

  // Check response times
  const p95ResponseTime = await getP95ResponseTime()
  if (p95ResponseTime > 2000) {
    await sendErrorAlert(new Error(`Slow response time: ${p95ResponseTime}ms`))
  }

  // Check database connections
  const dbConnections = await getActiveDBConnections()
  if (dbConnections > 80) { // 80% of max connections
    await sendErrorAlert(new Error(`High DB connections: ${dbConnections}`))
  }
}
```

## Maintenance & Updates

### Regular Monitoring Tasks
1. **Daily**: Review error logs and performance metrics
2. **Weekly**: Update dependencies and security patches
3. **Monthly**: Review monitoring dashboards and alert thresholds
4. **Quarterly**: Conduct performance audits and optimization

### Backup Monitoring
- Monitor backup success/failure
- Verify backup integrity
- Test restore procedures quarterly

This monitoring setup provides comprehensive observability for the OpusZero platform, enabling proactive issue detection and rapid response to production incidents.
