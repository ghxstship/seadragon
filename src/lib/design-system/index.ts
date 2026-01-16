
/**
 * ATLVS + GVTEWAY Design System
 *
 * Component-First Architecture with White-Label Support
 *
 * Hierarchy:
 * - Design Tokens (Foundation)
 * - Primitives (Atoms)
 * - Components (Molecules)
 * - Patterns (Organisms)
 * - Templates (Pages)
 */

// Design Tokens (Foundation)
// export * from '../design-tokens'

// Primitives (Atoms) - Basic building blocks
export { Button } from '@/components/ui/button'
export { Input } from '@/components/ui/input'
export { Label } from '@/components/ui/label'
export { Textarea } from '@/components/ui/textarea'
export { Checkbox } from '@/components/ui/checkbox'
export { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
export { Badge } from '@/components/ui/badge'
export { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
export { Progress } from '@/components/ui/progress'

// Components (Molecules) - Composed primitives
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form'
export { Modal } from '@/components/ui/modal'
export { Navigation, NavigationItem } from '@/components/ui/navigation'
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
export { Calendar } from '@/components/ui/calendar'

// Patterns (Organisms) - Complex UI patterns
export { Calendar as CalendarPattern } from '@/components/calendar'
export { Chat } from '@/components/chat'
export { Header } from './patterns/header'
export { Sidebar } from './patterns/sidebar'

// Advanced Patterns
export { PWAProvider } from '@/components/pwa-provider'
export { ThemeProvider, useTheme } from '@/components/theme-provider'

// SaaS UI Trends 2026 Components
export { CommandPalette, useCommandPalette } from '@/components/ui/command-palette'
export { ThemeSwitcher, ThemeDropdown } from '@/components/ui/theme-switcher'
export { CollapsibleSection } from '@/components/ui/collapsible-section'
export { SteppedWizard } from '@/components/ui/stepped-wizard'
export { ContextualHelp, TruncatedContent } from '@/components/ui/contextual-help'
export { Glass, GlassCard, GlassNav, SoftSurface, GradientText, AtmosphericBackground, GlowEffect } from '@/components/ui/glass'
export { EmptyState, EmptySearchState, EmptyListState, LoadingState, ErrorState } from '@/components/ui/empty-state'
export { SmartSuggestions, InlineSuggestion } from '@/components/ui/smart-suggestions'

// Motion & Animation
export { AnimatedFeedback, AnimatedButton, AnimatedNumber, Skeleton, SkeletonCard, AnimatedList, ProgressBar } from '@/components/motion/AnimatedFeedback'

// Charts & Visualization
export { SmartChart, Sparkline, TrendIndicator } from '@/components/charts/SmartChart'

// Dashboard
export { WidgetGrid, MetricWidget } from '@/components/dashboard/WidgetGrid'

// Collaboration
export { PresenceAvatars, CollaborativeCursors, TypingIndicator, usePresence, stringToColor } from '@/components/collaboration/Presence'

// Emotion-Driven UX
export { Celebration, useCelebration } from '@/components/emotion/Celebration'

// Adaptive Layout
export { AdaptiveLayout, DynamicSidebar } from '@/components/adaptive/AdaptiveLayout'

// Utilities
export { cn } from '@/lib/utils'

// Design Tokens
export { tokens, colors, typography, spacing, borderRadius, motion, breakpoints, zIndex, glassmorphism, accessibility } from './tokens'
export { themes, generateThemeCSS, generateAllThemesCSS, applyTheme, getSystemTheme, resolveTheme } from './themes'
export type { ThemeMode, ResolvedTheme, ThemeColors, ThemeShadows, Theme } from './themes'
