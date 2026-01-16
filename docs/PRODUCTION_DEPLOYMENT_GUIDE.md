# OpusZero Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the OpusZero enterprise workflow platform to production environments.

## Prerequisites

### System Requirements
- Node.js 18.x or 20.x
- PostgreSQL 15+ (for Prisma)
- Redis (optional, for caching)
- Docker (recommended for containerized deployment)

### Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/opuszero_prod"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"

# OAuth Providers (configure as needed)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Storage
AWS_S3_BUCKET="your-s3-bucket"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
VERCEL_ANALYTICS_ID="your-vercel-analytics-id"

# API Keys (as needed)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link project
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   # Add other required environment variables
   ```

3. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod

   # Or set up automatic deployments
   vercel --prod --yes
   ```

### Option 2: Docker Deployment

1. **Build Docker Image**
   ```bash
   # Build the image
   docker build -t opuszero:latest .

   # Or use the provided Dockerfile
   docker build -f Dockerfile.prod -t opuszero:prod .
   ```

2. **Run with Docker Compose**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     app:
       image: opuszero:prod
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
       depends_on:
         - postgres
         - redis

     postgres:
       image: postgres:15
       environment:
         - POSTGRES_DB=opuszero_prod
         - POSTGRES_USER=${DB_USER}
         - POSTGRES_PASSWORD=${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data

     redis:
       image: redis:7-alpine
       volumes:
         - redis_data:/data

   volumes:
     postgres_data:
     redis_data:
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option 3: Traditional Server Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm run start
   ```

3. **Use Process Manager (PM2)**
   ```bash
   # Install PM2
   npm install -g pm2

   # Create ecosystem file
   pm2 init

   # Start with PM2
   pm2 start npm --name "opuszero" -- run start
   ```

## Database Setup

### Prisma Migration

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed Database (if needed)**
   ```bash
   npx prisma db seed
   ```

### Database Backup Strategy

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql

# Schedule daily backups with cron
0 2 * * * /path/to/backup-script.sh
```

## Monitoring & Observability

### Error Tracking (Sentry)

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   ```typescript
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs"

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
     environment: process.env.NODE_ENV,
   })
   ```

### Performance Monitoring

1. **Vercel Analytics**
   ```typescript
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react'

   export default function RootLayout({ children }) {
     return (
       <html lang="en">
         <body>{children}</body>
         <Analytics />
       </html>
     )
   }
   ```

2. **Custom Performance Monitoring**
   ```typescript
   // lib/monitoring.ts
   export const trackPerformance = (metric: string, value: number) => {
     // Send to monitoring service
     console.log(`${metric}: ${value}`)
   }
   ```

## Security Checklist

### Pre-Deployment
- [ ] Environment variables configured securely
- [ ] Database credentials rotated
- [ ] SSL/TLS certificates valid
- [ ] CORS policy configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Authentication properly configured

### Post-Deployment
- [ ] Security headers verified
- [ ] HTTPS enforcement active
- [ ] Sensitive data encrypted
- [ ] API endpoints secured
- [ ] File uploads validated
- [ ] CSRF protection enabled

## Performance Optimization

### Build Optimizations
```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

### Runtime Optimizations
- Enable gzip compression
- Configure CDN for static assets
- Implement caching strategies
- Database query optimization
- Image optimization with Next.js

## Rollback Strategy

### Quick Rollback Commands
```bash
# Vercel rollback
vercel rollback

# Docker rollback
docker tag opuszero:v1 opuszero:latest
docker-compose restart

# Git rollback
git reset --hard HEAD~1
git push --force
```

## Health Checks

### Application Health Check
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    })
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    )
  }
}
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server status
   - Validate connection pooling settings

3. **Authentication Problems**
   - Verify NEXTAUTH_URL configuration
   - Check OAuth provider settings
   - Validate JWT secrets

4. **Performance Issues**
   - Enable caching layers
   - Optimize database queries
   - Configure CDN properly

## Support & Maintenance

### Monitoring Dashboards
- Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- Configure error alerting (e.g., Sentry, LogRocket)
- Implement performance tracking (e.g., Lighthouse CI)

### Backup & Recovery
- Database backups scheduled daily
- Configuration backups maintained
- Disaster recovery plan documented

### Update Strategy
- Regular dependency updates
- Security patch deployment schedule
- Feature flag system for gradual rollouts

---

For additional support or questions, please refer to the development team or check the project documentation.
