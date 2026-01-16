
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { Glass, GlassCard, GradientText, GlowEffect } from '@/components/ui/glass'
import { EmptyState, LoadingState, ErrorState } from '@/components/ui/empty-state'
import { SmartSuggestions } from '@/components/ui/smart-suggestions'
import { ContextualHelp } from '@/components/ui/contextual-help'
import { AnimatedFeedback, AnimatedButton, Skeleton, ProgressBar } from '@/components/motion/AnimatedFeedback'
import { Celebration, useCelebration } from '@/components/emotion/Celebration'
import { Sparkline, TrendIndicator } from '@/components/charts/SmartChart'
import { MetricWidget } from '@/components/dashboard/WidgetGrid'
import { PresenceAvatars } from '@/components/collaboration/Presence'
import { useThemeContext } from '@/contexts/ThemeContext'
import { getGreeting, getProgressMessage } from '@/lib/microcopy'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'

import { 
  Sparkles, 
  Palette, 
  Zap, 
  BarChart3, 
  Users, 
  PartyPopper,
  Accessibility,
  Globe,
  Smartphone,
  Command
} from 'lucide-react'

interface User {
  id: string
  full_name: string
  avatar_url?: string
}

interface AnalyticsMetric {
  id: string
  value: number
  created_at: string
}

export default function UITrendsDemo() {
  const { mode } = useThemeContext()
  const [showFeedback, setShowFeedback] = useState<'success' | 'error' | 'warning' | null>(null)
  const [progress, setProgress] = useState(65)
  const [isLoading, setIsLoading] = useState(false)
  const { trigger, type, message, celebrate, reset } = useCelebration()
  const [users, setUsers] = useState<User[]>([])
  const [analyticsData, setAnalyticsData] = useState<number[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const supabase = createClient()
        
        // Fetch recent users for presence demo
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, avatar_url')
          .limit(5)

        if (usersError) {
          logger.error('Error fetching users:', usersError)
        } else {
          setUsers(usersData || [])
        }

        // Fetch analytics data for sparkline demo
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('analytics_metrics')
          .select('value')
          .order('created_at', { ascending: false })
          .limit(10)

        if (analyticsError) {
          logger.error('Error fetching analytics:', analyticsError)
          // Fallback to some demo data if no analytics available
          setAnalyticsData([10, 15, 12, 18, 22, 19, 25, 28, 24, 30])
        } else {
          setAnalyticsData(analyticsData?.map(item => item.value) || [10, 15, 12, 18, 22, 19, 25, 28, 24, 30])
        }
      } catch (error) {
        logger.error('Error fetching demo data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchDemoData()
  }, [])

  const handleCelebrate = () => {
    celebrate('confetti', 'Achievement Unlocked!')
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Celebration overlay */}
      <Celebration trigger={trigger} type={type} message={message} onComplete={reset} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4">SaaS UI Trends 2026</Badge>
          <h1 className="text-4xl font-bold mb-4">
            <GradientText gradient="primary">Component Showcase</GradientText>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {getGreeting()} Explore the latest UI trends implemented in this design system.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <SmartSuggestions position="inline" maxSuggestions={3} />
        </div>

        <Tabs defaultValue="theme" className="space-y-8">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger value="motion" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Motion</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="collab" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Collab</span>
            </TabsTrigger>
            <TabsTrigger value="ux" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">UX</span>
            </TabsTrigger>
          </TabsList>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Theme Switcher */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme System
                  </CardTitle>
                  <CardDescription>
                    Light, Dark, Low-Light, and Auto modes with smooth transitions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Current: {mode}</span>
                    <ThemeSwitcher showLabels />
                  </div>
                  <p className="text-sm text-text-muted">
                    Try switching themes to see CSS variables update in real-time.
                  </p>
                </CardContent>
              </Card>

              {/* Glassmorphism */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Glassmorphism
                  </CardTitle>
                  <CardDescription>
                    Modern glass effects with blur and transparency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4">
                    <GlassCard className="absolute inset-4">
                      <p className="text-white text-sm font-medium">Glass Card</p>
                      <p className="text-white/70 text-xs mt-1">With backdrop blur</p>
                    </GlassCard>
                  </div>
                </CardContent>
              </Card>

              {/* Gradient Text */}
              <Card>
                <CardHeader>
                  <CardTitle>Gradient Text</CardTitle>
                  <CardDescription>Eye-catching text gradients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-2xl font-bold">
                    <GradientText gradient="primary">Primary Gradient</GradientText>
                  </p>
                  <p className="text-2xl font-bold">
                    <GradientText gradient="success">Success Gradient</GradientText>
                  </p>
                  <p className="text-2xl font-bold">
                    <GradientText gradient="sunset">Sunset Gradient</GradientText>
                  </p>
                </CardContent>
              </Card>

              {/* Glow Effects */}
              <Card>
                <CardHeader>
                  <CardTitle>Glow Effects</CardTitle>
                  <CardDescription>Hover to see the glow</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <GlowEffect color="primary">
                    <Button>Primary Glow</Button>
                  </GlowEffect>
                  <GlowEffect color="success">
                    <Button variant="outline">Success Glow</Button>
                  </GlowEffect>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Motion Tab */}
          <TabsContent value="motion" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Animated Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Animated Feedback
                  </CardTitle>
                  <CardDescription>
                    Micro-interactions for user feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setShowFeedback('success')}>
                      Success
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowFeedback('error')}>
                      Error
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowFeedback('warning')}>
                      Warning
                    </Button>
                  </div>
                  {showFeedback && (
                    <AnimatedFeedback
                      type={showFeedback}
                      message={`This is a ${showFeedback} message!`}
                      show={!!showFeedback}
                      onComplete={() => setShowFeedback(null)}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Animated Button */}
              <Card>
                <CardHeader>
                  <CardTitle>Animated Buttons</CardTitle>
                  <CardDescription>Buttons with loading states and ripple effects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatedButton
                    isLoading={isLoading}
                    onClick={() => {
                      setIsLoading(true)
                      setTimeout(() => setIsLoading(false), 2000)
                    }}
                  >
                    Click to Load
                  </AnimatedButton>
                </CardContent>
              </Card>

              {/* Progress Bar */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Indicators</CardTitle>
                  <CardDescription>Animated progress with microcopy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProgressBar value={progress} showLabel />
                  <p className="text-sm text-text-muted">{getProgressMessage(progress)}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      -10%
                    </Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      +10%
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Skeleton Loading */}
              <Card>
                <CardHeader>
                  <CardTitle>Skeleton Loading</CardTitle>
                  <CardDescription>Placeholder content while loading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Metric Widgets */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricWidget
                    title=""
                    value="$48,352"
                    trend={{ direction: 'up', percentage: 12.5 }}
                    sparklineData={analyticsData.length > 0 ? analyticsData : [10, 15, 12, 18, 22, 19, 25, 28, 24, 30]}
                    comparisonPeriod="last month"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricWidget
                    title=""
                    value={2847}
                    trend={{ direction: 'up', percentage: 8.2 }}
                    sparklineData={[5, 8, 12, 10, 15, 18, 22, 20, 25, 28]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricWidget
                    title=""
                    value="3.2%"
                    trend={{ direction: 'down', percentage: 2.1 }}
                    sparklineData={[20, 18, 22, 19, 17, 15, 16, 14, 12, 10]}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sparklines & Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Sparklines & Trend Indicators</CardTitle>
                <CardDescription>Compact data visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-muted">Sales:</span>
                    <Sparkline data={analyticsData.length > 0 ? analyticsData : [10, 15, 12, 18, 22, 19, 25, 28, 24, 30]} width={120} height={32} />
                    <TrendIndicator direction="up" percentage={15.3} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-muted">Churn:</span>
                    <Sparkline data={[20, 18, 15, 12, 10, 8, 6, 5, 4, 3]} width={120} height={32} color="var(--color-error)" />
                    <TrendIndicator direction="down" percentage={8.7} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collab" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Presence Avatars */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Real-time Presence
                  </CardTitle>
                  <CardDescription>
                    Show who is currently viewing or editing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-muted">Viewing now:</span>
                    <PresenceAvatars users={users.map(user => ({ id: user.id, name: user.full_name, color: '#3b82f6', lastActive: new Date() }))} size="md" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-muted">Small:</span>
                    <PresenceAvatars users={users.map(user => ({ id: user.id, name: user.full_name, color: '#10b981', lastActive: new Date() }))} size="sm" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-muted">Large:</span>
                    <PresenceAvatars users={users.map(user => ({ id: user.id, name: user.full_name, color: '#f59e0b', lastActive: new Date() }))} size="lg" />
                  </div>
                </CardContent>
              </Card>

              {/* Command Palette Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Command className="w-5 h-5" />
                    Command Palette
                  </CardTitle>
                  <CardDescription>
                    Quick navigation with keyboard shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-text-secondary">
                    Press <kbd className="px-2 py-1 bg-bg-tertiary rounded text-xs font-mono">⌘K</kbd> or{' '}
                    <kbd className="px-2 py-1 bg-bg-tertiary rounded text-xs font-mono">Ctrl+K</kbd> to open the command palette.
                  </p>
                  <p className="text-sm text-text-muted">
                    Features NLP intent parsing for natural language commands.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* UX Tab */}
          <TabsContent value="ux" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Celebrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PartyPopper className="w-5 h-5" />
                    Celebrations
                  </CardTitle>
                  <CardDescription>
                    Delight users with celebratory animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleCelebrate}>
                     Trigger Celebration
                  </Button>
                </CardContent>
              </Card>

              {/* Contextual Help */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="w-5 h-5" />
                    Contextual Help
                  </CardTitle>
                  <CardDescription>
                    Tooltips and help text for better UX
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span>Hover for help:</span>
                    <ContextualHelp
                      content="This tooltip provides additional context to help users understand features."
                      learnMoreUrl="#"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Progressive Disclosure */}
              <Card>
                <CardHeader>
                  <CardTitle>Progressive Disclosure</CardTitle>
                  <CardDescription>Collapsible sections for complex content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CollapsibleSection title="Basic Settings" defaultOpen>
                    <p className="text-sm text-text-secondary">
                      These are the most commonly used settings that most users need.
                    </p>
                  </CollapsibleSection>
                  <CollapsibleSection title="Advanced Settings" badge="Pro">
                    <p className="text-sm text-text-secondary">
                      Advanced configuration options for power users.
                    </p>
                  </CollapsibleSection>
                </CardContent>
              </Card>

              {/* Empty States */}
              <Card>
                <CardHeader>
                  <CardTitle>Empty & Loading States</CardTitle>
                  <CardDescription>Friendly states with microcopy</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    illustration="inbox"
                    title="No messages yet"
                    description="When you receive messages, they will appear here."
                    size="sm"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-text-muted">
          <p>SaaS UI Trends 2026 • Built with Next.js, React, and Tailwind CSS</p>
          <p className="mt-1">
            <Globe className="w-4 h-4 inline mr-1" />
            i18n ready with RTL support •{' '}
            <Smartphone className="w-4 h-4 inline mx-1" />
            Mobile-first responsive design
          </p>
        </div>
      </div>
    </div>
  )
}
