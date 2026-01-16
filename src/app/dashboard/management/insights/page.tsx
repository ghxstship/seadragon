'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewSwitcher, ViewType } from '@/lib/design-system/patterns/view-switcher'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  BarChart3,
  Clock,
  Star,
  RefreshCw
} from 'lucide-react'

interface Insight {
  id: string
  title: string
  insight_type: string
  confidence: number
  impact: string
  recommendations: string[]
  generated_at: string
  expires_at?: string
}

export default function InsightsPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('board')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const loadInsights = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('generated_at', { ascending: false })

      if (error) {
        console.error('Error loading insights:', error)
      } else {
        setInsights(data || [])
      }
      setLoading(false)
    }

    loadInsights()
  }, [session, supabase])

  const generateInsights = async () => {
    setRefreshing(true)
    // Simulate AI insight generation
    setTimeout(() => {
      const newInsights: Insight[] = [
        {
          id: `insight-${Date.now()}`,
          title: 'Project Budget Optimization Opportunity',
          insight_type: 'recommendation',
          confidence: 85,
          impact: 'high',
          recommendations: [
            'Consider reallocating 15% of Project Alpha budget to Project Beta',
            'Review vendor contracts for potential cost savings',
            'Implement automated approval workflows to reduce processing time'
          ],
          generated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: `insight-${Date.now() + 1}`,
          title: 'Resource Utilization Trend',
          insight_type: 'trend',
          confidence: 92,
          impact: 'medium',
          recommendations: [
            'Staffing levels are 23% below optimal for current project load',
            'Consider hiring 2 additional crew members for Q2',
            'Training programs showing 34% improvement in efficiency'
          ],
          generated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: `insight-${Date.now() + 2}`,
          title: 'Compliance Risk Detected',
          insight_type: 'alert',
          confidence: 78,
          impact: 'high',
          recommendations: [
            '3 permits expiring within 30 days',
            'Schedule renewal process immediately',
            'Implement automated compliance monitoring'
          ],
          generated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      setInsights(prev => [...newInsights, ...prev])
      setRefreshing(false)
    }, 2000)
  }

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-5 w-5 text-blue-500" />
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'recommendation': return <Lightbulb className="h-5 w-5 text-yellow-500" />
      case 'prediction': return <Target className="h-5 w-5 text-purple-500" />
      default: return <Sparkles className="h-5 w-5 text-gray-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map(insight => (
        <Card key={insight.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getInsightTypeIcon(insight.insight_type)}
                <div>
                  <CardTitle className="text-lg leading-tight">{insight.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize text-xs">
                      {insight.insight_type}
                    </Badge>
                    <Badge variant={getImpactColor(insight.impact) as any} className="text-xs capitalize">
                      {insight.impact} impact
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span>Confidence:</span>
                <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                  {insight.confidence}%
                </span>
              </div>

              {insight.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {insight.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-xs mt-1">•</span>
                        <span className="leading-tight">{rec}</span>
                      </li>
                    ))}
                    {insight.recommendations.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{insight.recommendations.length - 3} more recommendations
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Generated {new Date(insight.generated_at).toLocaleDateString()}</span>
                {insight.expires_at && (
                  <span>Expires {new Date(insight.expires_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderAnalyticsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Insight Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Insight Types Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['trend', 'recommendation', 'alert', 'prediction'].map(type => {
              const count = insights.filter(i => i.insight_type === type).length
              const percentage = insights.length > 0 ? (count / insights.length) * 100 : 0

              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getInsightTypeIcon(type)}
                    <span className="capitalize text-sm">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Impact Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Impact Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['high', 'medium', 'low'].map(impact => {
              const count = insights.filter(i => i.impact === impact).length
              const percentage = insights.length > 0 ? (count / insights.length) * 100 : 0

              return (
                <div key={impact} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      impact === 'high' ? 'bg-red-500' :
                      impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="capitalize text-sm">{impact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Insights Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.slice(0, 5).map(insight => (
              <div key={insight.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {getInsightTypeIcon(insight.insight_type)}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getImpactColor(insight.impact) as any} className="text-xs">
                      {insight.impact}
                    </Badge>
                    <span className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}% confidence
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(insight.generated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const getStats = () => {
    const total = insights.length
    const highImpact = insights.filter(i => i.impact === 'high').length
    const averageConfidence = insights.length > 0
      ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)
      : 0
    const recent = insights.filter(i => {
      const days = Math.floor((Date.now() - new Date(i.generated_at).getTime()) / (1000 * 60 * 60 * 24))
      return days <= 7
    }).length

    return { total, highImpact, averageConfidence, recent }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Insights</h1>
          <p className="text-muted-foreground">
            AI-generated analytics, trends, and recommendations for your organization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={generateInsights} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Generating...' : 'Generate Insights'}
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['board', 'analytics']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Insights</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">High Impact</p>
                <p className="text-2xl font-bold">{stats.highImpact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">{stats.averageConfidence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Recent (7 days)</p>
                <p className="text-2xl font-bold">{stats.recent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {currentView === 'board' && renderCardView()}
          {currentView === 'analytics' && renderAnalyticsView()}
        </CardContent>
      </Card>

      {insights.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No insights yet</h3>
          <p className="text-muted-foreground mb-4">
            Generate your first AI-powered insights to discover trends and opportunities
          </p>
          <Button onClick={generateInsights} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Generating Insights...' : 'Generate Insights'}
          </Button>
        </div>
      )}
    </div>
  )
}
