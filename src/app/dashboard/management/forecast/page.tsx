'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViewSwitcher, ViewType } from '@/lib/design-system/patterns/view-switcher'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  AlertTriangle
} from 'lucide-react'

interface Forecast {
  id: string
  name: string
  forecast_type: string
  period_start: string
  period_end: string
  scenario: string
  created_at: string
}

export default function ForecastPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [scenarioFilter, setScenarioFilter] = useState('all')

  useEffect(() => {
    const loadForecasts = async () => {
      if (!session?.user?.organizationId) return

      const { data, error } = await supabase
        .from('forecasts')
        .select('*')
        .eq('organization_id', session.user.organizationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading forecasts:', error)
      } else {
        setForecasts(data || [])
      }
      setLoading(false)
    }

    loadForecasts()
  }, [session, supabase])

  const filteredForecasts = forecasts.filter(forecast => {
    const matchesSearch = forecast.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || forecast.forecast_type === typeFilter
    const matchesScenario = scenarioFilter === 'all' || forecast.scenario === scenarioFilter

    return matchesSearch && matchesType && matchesScenario
  })

  const getForecastTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'expense': return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'resource': return <BarChart3 className="h-4 w-4 text-blue-500" />
      case 'capacity': return <PieChart className="h-4 w-4 text-purple-500" />
      default: return <LineChart className="h-4 w-4" />
    }
  }

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'worst_case': return 'destructive'
      case 'best_case': return 'default'
      case 'baseline': return 'secondary'
      default: return 'outline'
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Forecast</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Scenario</th>
            <th className="text-left p-4">Period</th>
            <th className="text-left p-4">Created</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredForecasts.map(forecast => (
            <tr key={forecast.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium">{forecast.name}</div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getForecastTypeIcon(forecast.forecast_type)}
                  <Badge variant="outline" className="capitalize">
                    {forecast.forecast_type}
                  </Badge>
                </div>
              </td>
              <td className="p-4">
                <Badge variant={getScenarioColor(forecast.scenario) as any} className="capitalize">
                  {forecast.scenario.replace('_', ' ')}
                </Badge>
              </td>
              <td className="p-4">
                <div className="text-sm">
                  <div>{new Date(forecast.period_start).toLocaleDateString()}</div>
                  <div className="text-muted-foreground">to {new Date(forecast.period_end).toLocaleDateString()}</div>
                </div>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {new Date(forecast.created_at).toLocaleDateString()}
              </td>
              <td className="p-4">
                <Button variant="ghost" size="sm">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredForecasts.map(forecast => (
        <Card key={forecast.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getForecastTypeIcon(forecast.forecast_type)}
                <CardTitle className="text-lg">{forecast.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <Badge variant="outline" className="capitalize">{forecast.forecast_type}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Scenario:</span>
                <Badge variant={getScenarioColor(forecast.scenario) as any} className="capitalize">
                  {forecast.scenario.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-sm">
                <span>Period:</span>
                <div className="text-muted-foreground mt-1">
                  {new Date(forecast.period_start).toLocaleDateString()} - {new Date(forecast.period_end).toLocaleDateString()}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Created:</span>
                <span className="text-muted-foreground">
                  {new Date(forecast.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Forecast
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const getStats = () => {
    const total = forecasts.length
    const revenue = forecasts.filter(f => f.forecast_type === 'revenue').length
    const expense = forecasts.filter(f => f.forecast_type === 'expense').length
    const resource = forecasts.filter(f => f.forecast_type === 'resource').length
    const baseline = forecasts.filter(f => f.scenario === 'baseline').length

    return { total, revenue, expense, resource, baseline }
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
          <h1 className="text-3xl font-bold">Forecast</h1>
          <p className="text-muted-foreground">
            Financial forecasts and resource demand planning
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Forecast
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'analytics']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Forecasts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{stats.revenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Expense</p>
                <p className="text-2xl font-bold">{stats.expense}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Resource</p>
                <p className="text-2xl font-bold">{stats.resource}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <LineChart className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Baseline</p>
                <p className="text-2xl font-bold">{stats.baseline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forecasts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Forecast Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
                <SelectItem value="capacity">Capacity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scenarios</SelectItem>
                <SelectItem value="baseline">Baseline</SelectItem>
                <SelectItem value="best_case">Best Case</SelectItem>
                <SelectItem value="worst_case">Worst Case</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {currentView === 'table' && renderTableView()}
          {currentView === 'board' && renderCardView()}
          {currentView === 'analytics' && (
            <div className="p-6 text-center text-muted-foreground">
              Analytics view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredForecasts.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No forecasts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== 'all' || scenarioFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first forecast to start planning'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Forecast
          </Button>
        </div>
      )}
    </div>
  )
}
