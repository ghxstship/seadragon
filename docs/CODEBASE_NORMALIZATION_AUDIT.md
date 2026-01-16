# Codebase Normalization Audit Report

**Repository:** opuszero
**Audit Date:** January 14, 2026
**Auditor:** Cascade (normalization prompt)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| **Critical** | 7 |
| **High** | 13 |
| **Medium** | 21 |
| **Low** | 18 |
| **Total Violations** | **59** |

The codebase demonstrates good foundational architecture with an established design token system (`src/lib/design-tokens.ts`), but has significant normalization gaps requiring remediation. Key areas of concern include `any` type proliferation, inline localStorage access, scattered fetch calls, and hardcoded color values outside the design system. Phase 1 remediations have reduced critical/high items (see below).

---

## Remediation Updates (Jan 14, 2026)
- External service URLs centralized and env-driven (`src/lib/constants/external-services.ts`); consumers updated (`api-endpoints.ts`, `integration-providers.ts`); prod fallbacks removed.
- Pricing normalization added (`src/lib/constants/pricing.ts`, `src/lib/cart/pricing.ts`); cart/checkout now use shared mapper/totals (magic tax/shipping removed).
- Cart and checkout no longer perform inline pricing calculations; business logic partially extracted to shared utilities.
- PaymentCheckout now accepts customer/billing/delivery/specialInstructions and forwards to create-intent API; checkout passes these props.
- Finance accounting refund payload fixed to use URLSearchParams safely.
- Remaining follow-ups:
  - Continue `any` eradication and API client centralization (not addressed here).
  - Broaden storage/domain hooks and error handling per roadmap.

---

## Violations by Category

### CATEGORY 1: MAGIC VALUES & HARDCODED DATA

#### Violation 1.1: Hardcoded Hex Colors (213 instances)
- **Files:** 41 files across `src/`
- **Priority:** High
- **Key Offenders:**
  - `src/lib/design-tokens.ts` (33 matches) - *Acceptable: This IS the token source*
  - `src/lib/email.ts` (13 matches)
  - `src/app/dashboard/analytics/page.tsx` (11 matches)
  - `src/components/visualization/analytics-chart.tsx` (11 matches)
  - Multiple workflow files (3-6 matches each)

**Current Code Example:**
```tsx
// src/app/dashboard/analytics/page.tsx
fill: '#3b82f6'
stroke: '#ef4444'
```

**Required Remediation:**
```tsx
import { colors } from '@/lib/design-tokens'
fill: colors.primary[500]
stroke: colors.semantic.error
```

#### Violation 1.3: Arbitrary Tailwind Values with px (33 instances)
- **Files:** 18 files
- **Priority:** Medium
- **Pattern:** `z-[50]`, `z-[100]`, etc.

**Current Code:**
```tsx
// src/components/ui/separator.tsx
className="z-[50]"
```

**Required Remediation:**
```tsx
// Use design token z-index scale
import { zIndex } from '@/lib/design-tokens'
// Or extend Tailwind config with semantic z-index values
```

#### Violation 1.6: Hardcoded Dates (Multiple instances)
- **File:** `src/app/dashboard/page.tsx`
- **Lines:** 59-133
- **Priority:** Low

**Current Code:**
```tsx
date: '2026-01-20',
date: '2026-01-22',
```

**Justification:** Mock data for development - acceptable if clearly marked as mock data.

---

### CATEGORY 2: CODE DUPLICATION & DRY VIOLATIONS

#### Violation 2.3: Scattered Fetch Calls (143 instances)
- **Files:** 33 files across integration providers
- **Priority:** Critical
- **Key Offenders:**
  - `src/lib/integrations/providers/finance-accounting.ts` (18 fetch calls)
  - `src/lib/integrations/providers/time-tracking.ts` (15 fetch calls)
  - `src/lib/integrations/providers/hr-management.ts` (14 fetch calls)
  - `src/lib/integrations/providers/communication.ts` (13 fetch calls)

**Current Code:**
```typescript
// src/lib/integrations/providers/finance-accounting.ts:92
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${this.secretKey}`,
    'Stripe-Version': '2023-10-16'
  }
})
```

**Required Remediation:**
```typescript
// Create centralized API client
import { apiClient } from '@/lib/api-client'

const response = await apiClient.stripe.get('/payment_intents', {
  params: { limit, created }
})
```

#### Violation 2.6: Duplicate Type Patterns
- **Pattern:** Similar interface definitions across workflow files
- **Priority:** Medium
- **Files:** 20+ workflow files in `src/workflows/`

---

### CATEGORY 3: INLINE IMPLEMENTATIONS

#### Violation 3.2: Inline localStorage Access (13 instances)
- **Files:** 6 files
- **Priority:** High
- **Key Offenders:**
  - `src/components/forms/multi-step-wizard.tsx` (3 instances)
  - `src/app/book/cart/page.tsx` (2 instances)
  - `src/app/book/checkout/page.tsx` (2 instances)
  - `src/components/ui/cookie-consent.tsx` (2 instances)

**Current Code:**
```tsx
// src/components/forms/multi-step-wizard.tsx:84
const saved = localStorage.getItem(`wizard-${persistenceKey}`)
localStorage.setItem(`wizard-${persistenceKey}`, JSON.stringify(stateToSave))
```

**Required Remediation:**
```typescript
// src/lib/storage.ts
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }
}

// Usage:
import { storage } from '@/lib/storage'
const saved = storage.get<WizardState>(`wizard-${persistenceKey}`)
```

#### Violation 3.9: Inline setTimeout/setInterval (69 instances)
- **Files:** 50 files
- **Priority:** Medium
- **Key Offenders:**
  - `src/app/auth/mfa/verify/page.tsx` (4 instances)
  - `src/lib/integrations/orchestration.ts` (4 instances)

**Required Remediation:**
```typescript
// Create timer utility hook
// src/hooks/useTimer.ts
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  
  useEffect(() => {
    if (delay === null) return
    const id = setTimeout(() => savedCallback.current(), delay)
    return () => clearTimeout(id)
  }, [delay])
}
```

#### Violation 3.10: Inline DOM Manipulation (133 instances)
- **Files:** 46 files
- **Priority:** High
- **Key Offenders:**
  - `src/components/content/document-viewer.tsx` (26 instances)
  - `src/app/home/travel/page.tsx` (9 instances)

**Current Code:**
```tsx
document.getElementById('viewer')
document.querySelector('.container')
```

**Required Remediation:** Use React refs or proper abstractions.

---

### CATEGORY 4: TYPE SAFETY & SCHEMA VALIDATION

#### Violation 4.1: Explicit `any` Type Usage (1,551 instances)
- **Files:** 155 files
- **Priority:** Critical
- **Key Offenders (non-test files):**
  - `src/lib/integrations/providers/finance-accounting.ts` (15 instances)
  - `src/lib/integrations/webhook-processor.ts` (15 instances)
  - `src/lib/integrations/orchestration.ts` (13 instances)

**Current Code:**
```typescript
// src/lib/integrations/providers/finance-accounting.ts:83
async getPayments(params?: any): Promise<any[]> {
```

**Required Remediation:**
```typescript
interface PaymentQueryParams {
  limit?: number
  created?: number
  startingAfter?: string
}

interface StripePayment {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  // ... other fields
}

async getPayments(params?: PaymentQueryParams): Promise<StripePayment[]> {
```

#### Violation 4.2: Type Assertions with `as any` (87 instances)
- **Files:** 34 files
- **Priority:** High
- **Key Offenders:**
  - `src/lib/__tests__/rate-limiting.test.ts` (23 instances)
  - `src/app/x/[handle]/group/page.tsx` (7 instances)

#### Violation 4.10: Raw JSON.parse Without Validation (28 instances)
- **Files:** 22 files
- **Priority:** High

**Current Code:**
```typescript
const parsed = JSON.parse(saved)
```

**Required Remediation:**
```typescript
import { z } from 'zod'

const WizardStateSchema = z.object({
  currentStep: z.number(),
  data: z.record(z.unknown()),
  completedSteps: z.array(z.number())
})

function safeJsonParse<T>(json: string, schema: z.ZodSchema<T>): T | null {
  try {
    return schema.parse(JSON.parse(json))
  } catch {
    return null
  }
}

const saved = safeJsonParse(localStorage.getItem(key), WizardStateSchema)
```

---

### CATEGORY 5: ERROR HANDLING & LOGGING

#### Violation 5.2: Console Statements in Production Code (486 instances)
- **Files:** 194 files
- **Priority:** Critical
- **Key Offenders:**
  - `src/app/experiences/page.tsx` (21 instances)
  - `src/app/dashboard/page.tsx` (20 instances)
  - `src/app/events/page.tsx` (20 instances)
  - `src/lib/integrations/webhook-processor.ts` (14 instances)

**Current Code:**
```tsx
// src/app/dashboard/page.tsx:295-303
onSearch={(query) => console.log('Search dashboard:', query)}
onCreate={(type) => console.log('Create:', type)}
onNavigate={(path) => console.log('Navigate to:', path)}
```

**Required Remediation:**
```typescript
// src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  debug: (message: string, context?: Record<string, unknown>) => void
  info: (message: string, context?: Record<string, unknown>) => void
  warn: (message: string, context?: Record<string, unknown>) => void
  error: (message: string, error?: Error, context?: Record<string, unknown>) => void
}

export const logger: Logger = {
  debug: (message, context) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, context)
    }
  },
  info: (message, context) => {
    // Send to logging service in production
    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, context)
    }
  },
  warn: (message, context) => {
    console.warn(`[WARN] ${message}`, context)
    // Report to error tracking service
  },
  error: (message, error, context) => {
    console.error(`[ERROR] ${message}`, error, context)
    // Report to Sentry/error tracking
  }
}
```

---

### CATEGORY 6: STATE MANAGEMENT

#### Violation 6.5: Window Global Access (96 instances)
- **Files:** 27 files
- **Priority:** Medium
- **Key Offenders:**
  - `src/components/pwa-provider.tsx` (9 instances)
  - `src/app/offline/page.tsx` (7 instances)
  - `src/components/ui/cookie-consent.tsx` (6 instances)

**Required Remediation:** Abstract window access behind utilities with SSR safety checks.

---

### CATEGORY 7: API & DATA LAYER

#### Violation 7.1: Scattered API Calls
- **Pattern:** Direct fetch calls in components and pages
- **Priority:** High
- **Example:** `src/app/experiences/page.tsx:58`

**Current Code:**
```tsx
const response = await fetch('/api/experiences')
```

**Required Remediation:**
```typescript
// src/lib/api/experiences.ts
export const experiencesApi = {
  list: async (params?: ExperienceQueryParams) => {
    return apiClient.get<ExperienceListResponse>('/api/experiences', { params })
  },
  get: async (id: string) => {
    return apiClient.get<Experience>(`/api/experiences/${id}`)
  }
}

// Usage with React Query
const { data, isLoading } = useQuery({
  queryKey: ['experiences'],
  queryFn: () => experiencesApi.list()
})
```

---

### CATEGORY 8: COMPONENT ARCHITECTURE

#### Violation 8.2: Inline Styles (56 instances)
- **Files:** 31 files
- **Priority:** Medium
- **Key Offenders:**
  - `src/app/dashboard/settings/page.tsx` (7 instances)
  - `src/components/workflow/gantt-chart.tsx` (4 instances)

**Current Code:**
```tsx
style={{ width: `${progress}%` }}
style={{ transform: `translateX(${offset}px)` }}
```

**Note:** Some inline styles are acceptable for dynamic values that cannot be expressed in Tailwind.

---

### CATEGORY 9: STYLING & THEMING

#### Violation 9.1: Design Token System Exists But Underutilized
- **File:** `src/lib/design-tokens.ts` (255 lines)
- **Priority:** Medium
- **Issue:** Comprehensive design tokens exist but are not consistently imported/used across components

**Positive Finding:** The codebase HAS a proper design token system with:
- Color palette (primary, neutral, semantic)
- Typography scale
- Spacing scale (8px base grid)
- Shadows
- Border radius
- Animations
- Breakpoints
- Z-index scale

**Required Action:** Enforce usage via ESLint rules and code review guidelines.

---

### CATEGORY 11: SECURITY & COMPLIANCE

#### Violation 11.2: dangerouslySetInnerHTML Usage (2 instances)
- **Files:**
  - `src/app/news/[slug]/page.tsx`
  - `src/components/views/docs-view.tsx`
- **Priority:** High

**Required Remediation:** Implement DOMPurify sanitization:
```typescript
import DOMPurify from 'dompurify'

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

#### Violation 11.4: Localhost References in Code (249 instances)
- **Files:** 11 files (mostly test files)
- **Priority:** Low (test files acceptable)

---

## Remediation Roadmap

### Phase 1: Critical (Immediate - This Week)

1. **Create Centralized Logger Service**
   - Replace 486 console.log instances
   - Integrate with error tracking (Sentry)
   - Estimated effort: 4 hours

2. **Type Safety Remediation**
   - Address top 50 `any` type usages in production code
   - Create typed interfaces for API responses
   - Estimated effort: 8 hours

3. **Sanitize dangerouslySetInnerHTML**
   - Add DOMPurify to 2 instances
   - Estimated effort: 30 minutes

4. **Create Storage Abstraction**
   - Replace 13 localStorage instances
   - Add SSR safety
   - Estimated effort: 2 hours

### Phase 2: High Priority (This Sprint)

1. **Centralized API Client**
   - Create typed API client wrapper
   - Migrate integration providers (143 fetch calls)
   - Estimated effort: 16 hours

2. **JSON Parse Validation**
   - Add Zod schemas for 28 JSON.parse instances
   - Create safeJsonParse utility
   - Estimated effort: 4 hours

3. **Design Token Enforcement**
   - Replace hardcoded colors outside design-tokens.ts
   - Add ESLint rule for color enforcement
   - Estimated effort: 6 hours

### Phase 3: Medium Priority (Next Sprint)

1. **Timer Utilities**
   - Create useTimeout/useInterval hooks
   - Migrate 69 setTimeout/setInterval instances
   - Estimated effort: 4 hours

2. **DOM Abstraction**
   - Replace 133 document.* calls with React refs
   - Estimated effort: 8 hours

3. **Z-Index Normalization**
   - Extend design tokens with semantic z-index
   - Update 33 arbitrary z-index values
   - Estimated effort: 2 hours

### Phase 4: Low Priority (Backlog)

1. **Inline Style Audit**
   - Review 56 inline style instances
   - Convert applicable ones to Tailwind
   - Estimated effort: 4 hours

2. **Window Global Abstraction**
   - Create SSR-safe window utilities
   - Migrate 96 window.* accesses
   - Estimated effort: 6 hours

---

## Prevention Recommendations

### 1. ESLint Rules to Add

```javascript
// .eslintrc.js additions
module.exports = {
  rules: {
    // No console in production
    'no-console': ['error', { allow: ['warn', 'error'] }],
    
    // No any type
    '@typescript-eslint/no-explicit-any': 'error',
    
    // No non-null assertions
    '@typescript-eslint/no-non-null-assertion': 'error',
    
    // Require proper error handling
    '@typescript-eslint/no-floating-promises': 'error',
    
    // Enforce exhaustive deps
    'react-hooks/exhaustive-deps': 'error',
    
    // Custom rule for hardcoded colors (requires eslint-plugin-regexp)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
        message: 'Use design tokens instead of hardcoded colors'
      }
    ],
  }
}
```

### 2. Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 3. CI/CD Checks

- Add TypeScript strict mode enforcement
- Add ESLint CI check with zero tolerance for errors
- Add bundle size monitoring
- Add type coverage reporting

### 4. Code Review Guidelines

- Require design token usage for all colors/spacing
- Require typed interfaces for all API responses
- Require error handling for all async operations
- Require logger usage instead of console.log

---

## Files Requiring Immediate Attention

| File | Critical Issues | Action |
|------|-----------------|--------|
| `src/app/dashboard/page.tsx` | 20 console.log | Replace with logger |
| `src/app/experiences/page.tsx` | 21 console.log | Replace with logger |
| `src/lib/integrations/providers/finance-accounting.ts` | 18 fetch, 15 any | Create typed API client |
| `src/components/forms/multi-step-wizard.tsx` | 3 localStorage | Use storage abstraction |
| `src/components/content/document-viewer.tsx` | 26 document.* | Use React refs |

---

## Positive Findings

1. **Design Token System** - Well-structured foundation in `src/lib/design-tokens.ts`
2. **Component Library** - Consistent use of shadcn/ui components
3. **TypeScript Usage** - Project uses TypeScript throughout
4. **No eval() Usage** - No dangerous eval patterns found
5. **No Empty Catch Blocks** - Error handling exists (though could be improved)
6. **No Hardcoded Secrets** - No API keys found in source code

---

*This audit represents enterprise-grade code normalization standards. Remediation should be prioritized by phase to ensure maintainability, scalability, and team velocity.*
