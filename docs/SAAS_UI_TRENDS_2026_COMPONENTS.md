# SaaS UI Trends 2026 - Component Documentation

This document provides an overview of all components implemented from the SaaS UI Trends 2026 guide.

## Table of Contents

1. [Theme System](#theme-system)
2. [Command Palette](#command-palette)
3. [Adaptive Interfaces](#adaptive-interfaces)
4. [Motion & Animation](#motion--animation)
5. [Glassmorphism](#glassmorphism)
6. [Data Visualization](#data-visualization)
7. [Dashboard Widgets](#dashboard-widgets)
8. [Collaboration](#collaboration)
9. [Emotion-Driven UX](#emotion-driven-ux)
10. [Progressive Disclosure](#progressive-disclosure)
11. [Empty States](#empty-states)
12. [Accessibility](#accessibility)
13. [Internationalization](#internationalization)
14. [Responsive Utilities](#responsive-utilities)

---

## Theme System

### Files
- `src/lib/design-system/tokens.ts` - Design tokens
- `src/lib/design-system/themes.ts` - Theme definitions
- `src/contexts/ThemeContext.tsx` - Theme provider
- `src/components/ui/theme-switcher.tsx` - Theme switcher UI

### Usage

```tsx
import { useThemeContext } from '@/contexts/ThemeContext'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

function MyComponent() {
  const { mode, setTheme, resolvedTheme } = useThemeContext()
  
  return (
    <div>
      <p>Current theme: {mode}</p>
      <ThemeSwitcher showLabels />
    </div>
  )
}
```

### Theme Modes
- `light` - Clean, bright interface
- `dark` - Easy on the eyes in low light
- `lowLight` - Soft, atmospheric mode for late night
- `auto` - Follows system preference

---

## Command Palette

### Files
- `src/components/ui/command-palette.tsx`

### Usage

The command palette is automatically available via `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) when the app is wrapped with `Providers`.

```tsx
import { CommandPalette, useCommandPalette } from '@/components/ui/command-palette'

// Programmatic control
function MyComponent() {
  const { open, close, toggle } = useCommandPalette()
  
  return <button onClick={toggle}>Open Command Palette</button>
}
```

### Features
- NLP intent parsing for natural language commands
- Keyboard navigation
- Recent commands history
- Categorized command groups

---

## Adaptive Interfaces

### Files
- `src/services/behaviorTracking.ts` - Behavior tracking service
- `src/contexts/BehaviorContext.tsx` - Behavior provider
- `src/components/adaptive/AdaptiveLayout.tsx` - Adaptive layout component

### Usage

```tsx
import { useBehaviorContext } from '@/contexts/BehaviorContext'
import { AdaptiveLayout } from '@/components/adaptive/AdaptiveLayout'

function MyComponent() {
  const { trackFeatureUsage, suggestions } = useBehaviorContext()
  
  const handleClick = () => {
    trackFeatureUsage('feature-name')
  }
  
  return (
    <AdaptiveLayout>
      <button onClick={handleClick}>Use Feature</button>
    </AdaptiveLayout>
  )
}
```

---

## Motion & Animation

### Files
- `src/components/motion/AnimatedFeedback.tsx`

### Components

#### AnimatedFeedback
```tsx
import { AnimatedFeedback } from '@/components/motion/AnimatedFeedback'

<AnimatedFeedback
  type="success" // 'success' | 'error' | 'warning' | 'loading' | 'info'
  message="Operation completed!"
  onClose={() => {}}
/>
```

#### AnimatedButton
```tsx
import { AnimatedButton } from '@/components/motion/AnimatedFeedback'

<AnimatedButton isLoading={isLoading} onClick={handleClick}>
  Submit
</AnimatedButton>
```

#### ProgressBar
```tsx
import { ProgressBar } from '@/components/motion/AnimatedFeedback'

<ProgressBar value={65} showLabel color="primary" />
```

#### Skeleton
```tsx
import { Skeleton, SkeletonCard } from '@/components/motion/AnimatedFeedback'

<Skeleton className="h-4 w-3/4" />
<SkeletonCard />
```

#### AnimatedList
```tsx
import { AnimatedList } from '@/components/motion/AnimatedFeedback'

<AnimatedList>
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</AnimatedList>
```

---

## Glassmorphism

### Files
- `src/components/ui/glass.tsx`

### Components

```tsx
import { 
  Glass, 
  GlassCard, 
  GlassNav, 
  SoftSurface, 
  GradientText, 
  GlowEffect 
} from '@/components/ui/glass'

// Glass container
<Glass blur="md" opacity={0.1}>Content</Glass>

// Glass card
<GlassCard>Card content</GlassCard>

// Gradient text
<GradientText gradient="primary">Gradient Title</GradientText>
<GradientText gradient="success">Success Text</GradientText>
<GradientText gradient="sunset">Sunset Text</GradientText>

// Glow effect on hover
<GlowEffect color="primary">
  <Button>Glowing Button</Button>
</GlowEffect>
```

---

## Data Visualization

### Files
- `src/components/charts/SmartChart.tsx`

### Components

#### SmartChart
```tsx
import { SmartChart } from '@/components/charts/SmartChart'

const data = [
  { date: '2024-01', value: 100, label: 'Jan' },
  { date: '2024-02', value: 150, label: 'Feb' },
  // ...
]

<SmartChart
  data={data}
  title="Revenue Over Time"
  height={300}
  showInsights
/>
```

#### Sparkline
```tsx
import { Sparkline } from '@/components/charts/SmartChart'

<Sparkline data={[10, 15, 12, 18, 22, 19, 25]} width={120} height={32} />
```

#### TrendIndicator
```tsx
import { TrendIndicator } from '@/components/charts/SmartChart'

<TrendIndicator direction="up" percentage={12.5} />
<TrendIndicator direction="down" percentage={3.2} />
```

---

## Dashboard Widgets

### Files
- `src/components/dashboard/WidgetGrid.tsx`

### Components

#### WidgetGrid
```tsx
import { WidgetGrid } from '@/components/dashboard/WidgetGrid'

const widgets = [
  { id: '1', title: 'Revenue', type: 'metric', ... },
  { id: '2', title: 'Users', type: 'chart', ... },
]

<WidgetGrid
  widgets={widgets}
  onWidgetMove={(id, position) => {}}
  onWidgetRemove={(id) => {}}
  onWidgetConfigure={(id) => {}}
/>
```

#### MetricWidget
```tsx
import { MetricWidget } from '@/components/dashboard/WidgetGrid'

<MetricWidget
  title="Total Revenue"
  value="$48,352"
  trend={{ direction: 'up', percentage: 12.5 }}
  sparklineData={[10, 15, 12, 18, 22, 19, 25]}
  comparisonPeriod="last month"
/>
```

---

## Collaboration

### Files
- `src/components/collaboration/Presence.tsx`

### Components

#### PresenceAvatars
```tsx
import { PresenceAvatars } from '@/components/collaboration/Presence'

const users = [
  { id: '1', name: 'Alice', color: '#3b82f6', lastActive: new Date() },
  { id: '2', name: 'Bob', color: '#10b981', lastActive: new Date() },
]

<PresenceAvatars users={users} size="md" maxVisible={5} />
```

#### CollaborativeCursors
```tsx
import { CollaborativeCursors } from '@/components/collaboration/Presence'

<CollaborativeCursors users={users} />
```

#### TypingIndicator
```tsx
import { TypingIndicator } from '@/components/collaboration/Presence'

<TypingIndicator users={['Alice', 'Bob']} />
```

---

## Emotion-Driven UX

### Files
- `src/components/emotion/Celebration.tsx`
- `src/lib/microcopy.ts`

### Celebration

```tsx
import { Celebration, useCelebration } from '@/components/emotion/Celebration'

function MyComponent() {
  const { trigger, type, message, celebrate, reset } = useCelebration()
  
  const handleSuccess = () => {
    celebrate('confetti', 'Achievement Unlocked!')
  }
  
  return (
    <>
      <Celebration trigger={trigger} type={type} message={message} onComplete={reset} />
      <button onClick={handleSuccess}>Complete Task</button>
    </>
  )
}
```

### Microcopy

```tsx
import { 
  getGreeting, 
  getProgressMessage, 
  getEmptyStateMessage,
  getErrorMessage 
} from '@/lib/microcopy'

// Time-aware greeting
const greeting = getGreeting() // "Good morning!" / "Good afternoon!" / etc.

// Progress encouragement
const progress = getProgressMessage(75) // "Almost there! Just a bit more to go."

// Empty state messages
const empty = getEmptyStateMessage('inbox') // Random encouraging message
```

---

## Progressive Disclosure

### Files
- `src/components/ui/collapsible-section.tsx`
- `src/components/ui/stepped-wizard.tsx`
- `src/components/ui/contextual-help.tsx`

### CollapsibleSection

```tsx
import { CollapsibleSection } from '@/components/ui/collapsible-section'

<CollapsibleSection title="Advanced Settings" badge="Pro" defaultOpen={false}>
  <p>Advanced configuration options...</p>
</CollapsibleSection>
```

### SteppedWizard

```tsx
import { SteppedWizard } from '@/components/ui/stepped-wizard'

const steps = [
  { id: 'info', title: 'Basic Info', content: <BasicInfoForm /> },
  { id: 'details', title: 'Details', content: <DetailsForm /> },
  { id: 'review', title: 'Review', content: <ReviewStep /> },
]

<SteppedWizard
  steps={steps}
  onComplete={(data) => console.log('Completed:', data)}
  onCancel={() => console.log('Cancelled')}
/>
```

### ContextualHelp

```tsx
import { ContextualHelp, TruncatedContent } from '@/components/ui/contextual-help'

<ContextualHelp
  content="This feature allows you to..."
  learnMoreUrl="/docs/feature"
/>

<TruncatedContent maxLength={100}>
  Long text content that will be truncated with a "Show more" button...
</TruncatedContent>
```

---

## Empty States

### Files
- `src/components/ui/empty-state.tsx`

### Components

```tsx
import { 
  EmptyState, 
  EmptySearchState, 
  EmptyListState, 
  LoadingState, 
  ErrorState 
} from '@/components/ui/empty-state'

// Generic empty state
<EmptyState
  illustration="inbox"
  title="No messages yet"
  description="When you receive messages, they will appear here."
  action={{ label: 'Send a message', onClick: () => {} }}
/>

// Search empty state
<EmptySearchState query="search term" onClear={() => {}} />

// Loading state
<LoadingState message="Loading your data..." />

// Error state
<ErrorState
  title="Something went wrong"
  description="We couldn't load your data."
  onRetry={() => {}}
/>
```

---

## Accessibility

### Files
- `src/lib/accessibility.ts`

### Utilities

```tsx
import {
  getContrastRatio,
  meetsWCAG,
  findAccessibleColor,
  announceToScreenReader,
  trapFocus,
  prefersReducedMotion,
  prefersHighContrast,
  generateAccessibleId
} from '@/lib/accessibility'

// Check contrast ratio
const ratio = getContrastRatio('#ffffff', '#000000') // 21

// Check WCAG compliance
const passes = meetsWCAG('#ffffff', '#666666', 'AA') // true/false

// Announce to screen readers
announceToScreenReader('Form submitted successfully', 'polite')

// Check user preferences
if (prefersReducedMotion()) {
  // Disable animations
}

// Generate accessible IDs
const id = generateAccessibleId('input') // 'input-abc123'
```

---

## Internationalization

### Files
- `src/lib/i18n.ts`

### Utilities

```tsx
import {
  getDirection,
  isRTL,
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime,
  applyDirectionToDocument,
  commonTranslations
} from '@/lib/i18n'

// Check direction
const dir = getDirection('ar') // 'rtl'
const rtl = isRTL('ar') // true

// Format values
formatCurrency(1234.56, 'en-US') // '$1,234.56'
formatDate(new Date(), 'de-DE') // '13.01.2026'
formatNumber(1234567, 'ja-JP') // '1,234,567'
formatRelativeTime(-1, 'day', 'en-US') // 'yesterday'

// Apply RTL to document
applyDirectionToDocument('ar')

// Get translations
const t = commonTranslations['es']
console.log(t.save) // 'Guardar'
```

### Supported Locales
- English (en-US, en-GB)
- Spanish (es-ES)
- French (fr-FR)
- German (de-DE)
- Japanese (ja-JP)
- Chinese (zh-CN)
- Arabic (ar-SA) - RTL
- Korean (ko-KR)
- Portuguese (pt-BR)
- Hebrew (he-IL) - RTL

---

## Responsive Utilities

### Files
- `src/hooks/useResponsive.ts`

### Hooks

```tsx
import {
  useMediaQuery,
  useBreakpoint,
  useWindowSize,
  useTouch,
  useSwipe,
  useOrientation,
  useSafeArea,
  useScrollPosition,
  useScrollDirection,
  responsiveValue
} from '@/hooks/useResponsive'

// Media query
const isMobile = useMediaQuery('(max-width: 768px)')

// Current breakpoint
const breakpoint = useBreakpoint() // 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Window size
const { width, height } = useWindowSize()

// Touch detection
const { isTouch, isMouse } = useTouch()

// Swipe gestures
const { direction, distance } = useSwipe(elementRef, {
  onSwipeLeft: () => console.log('Swiped left'),
  onSwipeRight: () => console.log('Swiped right'),
})

// Orientation
const { isPortrait, isLandscape } = useOrientation()

// Safe area insets (for notched devices)
const { top, bottom, left, right } = useSafeArea()

// Scroll position and direction
const scrollY = useScrollPosition()
const scrollDir = useScrollDirection() // 'up' | 'down' | null

// Responsive values
const columns = responsiveValue({ sm: 1, md: 2, lg: 3, xl: 4 })
```

---

## Quick Start

### 1. Wrap your app with providers

The providers are already configured in `src/components/providers.tsx`:

```tsx
// Already included:
// - ThemeProvider (light/dark/low-light/auto)
// - BehaviorProvider (adaptive interfaces)
// - CommandPalette (Cmd+K)
```

### 2. Use the demo page

Visit `/demo/ui-trends` to see all components in action.

### 3. Import from design system

```tsx
import {
  // Theme
  ThemeSwitcher,
  
  // Motion
  AnimatedFeedback,
  AnimatedButton,
  Skeleton,
  ProgressBar,
  
  // Glass
  Glass,
  GlassCard,
  GradientText,
  GlowEffect,
  
  // Charts
  SmartChart,
  Sparkline,
  TrendIndicator,
  
  // Dashboard
  WidgetGrid,
  MetricWidget,
  
  // Collaboration
  PresenceAvatars,
  
  // Emotion
  Celebration,
  useCelebration,
  
  // Progressive Disclosure
  CollapsibleSection,
  SteppedWizard,
  ContextualHelp,
  
  // Empty States
  EmptyState,
  LoadingState,
  ErrorState,
} from '@/lib/design-system'
```

---

## CSS Variables

The theme system uses CSS custom properties. Key variables:

```css
/* Colors */
--color-bg-primary
--color-bg-secondary
--color-bg-tertiary
--color-text-primary
--color-text-secondary
--color-text-muted
--color-accent-primary
--color-accent-secondary
--color-border-default
--color-border-strong

/* Semantic */
--color-success
--color-warning
--color-error
--color-info

/* Shadows */
--shadow-sm
--shadow-md
--shadow-lg

/* Motion */
--duration-fast
--duration-normal
--duration-slow
--ease-default
--ease-spring
```

See `src/app/globals.css` for the complete list.
