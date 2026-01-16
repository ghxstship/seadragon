
"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  PieChart,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Eye,
  Calendar,
  DollarSign,
  Star,
  Target,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AnalyticsData {
  // Overview metrics
  totalViews: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  customerSatisfaction: number

  // Growth metrics
  viewsGrowth: number
  bookingsGrowth: number
  revenueGrowth: number
  ratingGrowth: number

  // Time-based data
  viewsOverTime: Array<{ date: string; value: number }>
  bookingsOverTime: Array<{ date: string; value: number }>
  revenueOverTime: Array<{ date: string; value: number }>

  // Performance insights
  topPerformingContent: Array<{
    id: string
    title: string
    type: 'experience' | 'event' | 'profile'
    views: number
    bookings: number
    revenue: number
    rating: number
  }>

  // AI-powered recommendations
  recommendations: Array<{
    id: string
    type: 'action' | 'optimization' | 'opportunity'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    priority: 'urgent' | 'high' | 'medium' | 'low'
    actionable: boolean
  }>

  // User demographics
  userDemographics: {
    ageGroups: Array<{ group: string; percentage: number }>
    locations: Array<{ location: string; percentage: number }>
    interests: Array<{ interest: string; percentage: number }>
  }

  // Engagement metrics
  engagementRate: number
  averageSessionDuration: number
  bounceRate: number
  conversionRate: number

  // Predictive analytics
  predictedGrowth: number
  seasonalTrends: Array<{
    season: string
    expectedGrowth: number
    confidence: number
  }>

  // Competitor analysis
  marketPosition: {
    ranking: number
    marketShare: number
    competitors: Array<{
      name: string
      marketShare: number
      strengths: string[]
    }>
  }
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
  timeRange: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void
  userRole?: 'consumer' | 'business' | 'creator'
  className?: string
}

export function AnalyticsDashboard({
  data,
  timeRange,
  onTimeRangeChange,
  userRole = 'business',
  className
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number, showSign = true) => {
    const sign = showSign && value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-semantic-error/10 text-red-800 border-red-200'
      case 'high': return 'bg-semantic-warning/10 text-orange-800 border-orange-200'
      case 'medium': return 'bg-semantic-warning/10 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-accent-primary/10 text-blue-800 border-blue-200'
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            {userRole === 'business'
              ? 'Track your performance and discover opportunities for growth'
              : userRole === 'creator'
              ? 'Understand your audience and optimize your content'
              : 'Explore your activity and discover new experiences'
            }
          </p>
        </div>

        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value={data.totalViews.toLocaleString()}
          change={data.viewsGrowth}
          icon={<Eye className="h-5 w-5"/>}
          trend={data.viewsGrowth >= 0 ? 'up' : 'down'}/>

        <MetricCard
          title="Bookings"
          value={data.totalBookings.toString()}
          change={data.bookingsGrowth}
          icon={<Calendar className="h-5 w-5"/>}
          trend={data.bookingsGrowth >= 0 ? 'up' : 'down'}/>

        <MetricCard
          title="Revenue"
          value={formatCurrency(data.totalRevenue)}
          change={data.revenueGrowth}
          icon={<DollarSign className="h-5 w-5"/>}
          trend={data.revenueGrowth >= 0 ? 'up' : 'down'}/>

        <MetricCard
          title="Avg Rating"
          value={data.averageRating.toFixed(1)}
          change={data.ratingGrowth}
          icon={<Star className="h-5 w-5"/>}
          trend={data.ratingGrowth >= 0 ? 'up' : 'down'}
          showStars/>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2"/>
                  Engagement Metrics
                </CardTitle>
                <CardDescription>How users interact with your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Engagement Rate</span>
                  <span className="font-medium">{formatPercentage(data.engagementRate)}</span>
                </div>
                <Progress value={data.engagementRate} className="h-2"/>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Session Duration</span>
                  <span className="font-medium">
                    {Math.floor(data.averageSessionDuration / 60)}m {data.averageSessionDuration % 60}s
                  </span>
                </div>
                <Progress value={(data.averageSessionDuration / 300) * 100} className="h-2"/>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="font-medium">{formatPercentage(data.conversionRate)}</span>
                </div>
                <Progress value={data.conversionRate} className="h-2"/>
              </CardContent>
            </Card>

            {/* Customer Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2"/>
                  Customer Satisfaction
                </CardTitle>
                <CardDescription>How happy your customers are</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl font-bold text-accent-primary mb-2">
                  {data.customerSatisfaction}
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-6 w-6',
                        i < Math.floor(data.customerSatisfaction)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300'
                      )}/>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {data.totalBookings} bookings and reviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your most successful experiences and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPerformingContent.slice(0, 5).map((content, index) => (
                  <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent-primary/10 rounded flex items-center justify-center">
                        <span className="text-sm font-bold text-accent-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium truncate max-w-48">{content.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{content.type}</Badge>
                          <span>{content.views} views</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(content.revenue)}</div>
                      <div className="flex items-center text-sm">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400"/>
                        {content.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2"/>
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>Where your revenue comes from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Direct Bookings</span>
                    <span className="font-medium">{formatCurrency(data.totalRevenue * 0.7)}</span>
                  </div>
                  <Progress value={70} className="h-2"/>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Referral Commissions</span>
                    <span className="font-medium">{formatCurrency(data.totalRevenue * 0.2)}</span>
                  </div>
                  <Progress value={20} className="h-2"/>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Fees</span>
                    <span className="font-medium">{formatCurrency(data.totalRevenue * 0.1)}</span>
                  </div>
                  <Progress value={10} className="h-2"/>
                </div>
              </CardContent>
            </Card>

            {/* Growth Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2"/>
                  Growth Trends
                </CardTitle>
                <CardDescription>Your performance over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-semantic-success mb-1">
                      {formatPercentage(data.predictedGrowth)}
                    </div>
                    <div className="text-xs text-semantic-success">Predicted Growth</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-accent-secondary mb-1">
                      #{data.marketPosition.ranking}
                    </div>
                    <div className="text-xs text-accent-tertiary">Market Position</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Seasonal Trends</h4>
                  {data.seasonalTrends.map((trend, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{trend.season}</span>
                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          'font-medium',
                          trend.expectedGrowth > 0 ? 'text-semantic-success' : 'text-semantic-error'
                        )}>
                          {formatPercentage(trend.expectedGrowth)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(trend.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Age Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Age Groups</CardTitle>
                <CardDescription>Your audience breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.userDemographics.ageGroups.map((group, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{group.group}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={group.percentage} className="w-16 h-2"/>
                      <span className="text-sm font-medium w-12">{group.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Location Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Locations</CardTitle>
                <CardDescription>Where your audience is from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.userDemographics.locations.slice(0, 5).map((location, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-24">{location.location}</span>
                    <span className="text-sm font-medium">{location.percentage}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interest Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Interests</CardTitle>
                <CardDescription>What your audience cares about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.userDemographics.interests.slice(0, 5).map((interest, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-24">{interest.interest}</span>
                    <span className="text-sm font-medium">{interest.percentage}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {data.recommendations.map((recommendation) => (
              <Card key={recommendation.id} className={cn(
                'border-l-4',
                recommendation.priority === 'urgent' ? 'border-l-red-500' :
                recommendation.priority === 'high' ? 'border-l-orange-500' :
                recommendation.priority === 'medium' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              )}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      'p-2 rounded-full',
                      recommendation.type === 'action' ? 'bg-accent-primary/10' :
                      recommendation.type === 'optimization' ? 'bg-semantic-success/10' :
                      'bg-accent-primary/10'
                    )}>
                      {recommendation.type === 'action' ? <Zap className="h-5 w-5 text-accent-secondary"/> :
                       recommendation.type === 'optimization' ? <TrendingUp className="h-5 w-5 text-semantic-success"/> :
                       <Lightbulb className="h-5 w-5 text-accent-primary"/>}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{recommendation.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={cn('text-xs', getPriorityColor(recommendation.priority))}>
                            {recommendation.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {recommendation.impact} impact
                          </Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{recommendation.description}</p>

                      {recommendation.actionable && (
                        <Button size="sm" variant="outline">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Market Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2"/>
                  Market Position
                </CardTitle>
                <CardDescription>How you compare to competitors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-primary mb-2">
                    #{data.marketPosition.ranking}
                  </div>
                  <p className="text-muted-foreground">Market Ranking</p>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{formatPercentage(data.marketPosition.marketShare)}%</div>
                    <p className="text-sm text-muted-foreground">Market Share</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Key Competitors</h4>
                  {data.marketPosition.competitors.slice(0, 3).map((competitor, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{competitor.name}</span>
                      <span className="font-medium">{formatPercentage(competitor.marketShare)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Predictive Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2"/>
                  Predictive Insights
                </CardTitle>
                <CardDescription>AI-powered forecasts for your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Next Month Forecast</span>
                    <Badge variant="secondary" className="bg-semantic-success/10 text-green-800">
                      <ArrowUp className="h-3 w-3 mr-1"/>
                      {formatPercentage(data.predictedGrowth)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on current trends and seasonal patterns
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Recommended Actions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-semantic-success"/>
                      <span>Increase weekend availability by 20%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-semantic-success"/>
                      <span>Launch email marketing campaign</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-semantic-warning"/>
                      <span>Monitor competitor pricing changes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  trend: 'up' | 'down'
  showStars?: boolean
}

function MetricCard({ title, value, change, icon, trend, showStars }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {showStars && (
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(parseFloat(value)) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'
                    )}/>
                ))}
              </div>
            )}
            <div className={cn(
              'flex items-center text-sm mt-1',
              change >= 0 ? 'text-semantic-success' : 'text-semantic-error'
            )}>
              {trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1"/> : <ArrowDown className="h-3 w-3 mr-1"/>}
              {Math.abs(change)}% vs last period
            </div>
          </div>
          <div className="p-2 bg-accent-primary/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
