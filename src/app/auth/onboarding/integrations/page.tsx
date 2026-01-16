
'use client'

import { useState, useEffect } from "react"
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Header } from "@/lib/design-system"
import { CheckCircle, AlertTriangle, ExternalLink, Shield, Users, Calendar, CreditCard, Clock, RefreshCw, Link as LinkIcon, Unlink, Zap } from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface Integration {
  id: string
  name: string
  category: 'project_management' | 'version_control' | 'ci_cd' | 'documentation' | 'time_tracking' | 'file_storage' | 'hr' | 'payroll' | 'pos' | 'ticketing' | 'inventory' | 'analytics' | 'design' | 'testing' | 'monitoring' | 'security' | 'learning' | 'marketing' | 'legal' | 'finance' | 'communication' | 'calendar' | 'payment' | 'crm'
  description: string
  icon: string
  benefits: string[]
  connected: boolean
  lastSync?: Date | undefined
  status: 'connected' | 'disconnected' | 'pending' | 'error'
  required?: boolean
}

export default function OnboardingIntegrationsPage() {
  const router = useRouter()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const supabase = createClient()

  // Fetch integrations from Supabase
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const { data, error } = await supabase
          .from('integrations')
          .select('*')
          .order('category', { ascending: true })
          .order('name', { ascending: true })

        if (error) {
          logger.error('Failed to fetch integrations', error)
          return
        }

        if (data) {
          const mappedIntegrations: Integration[] = data.map(item => ({
            id: String(item.id),
            name: String(item.name || ''),
            category: (item.category as Integration['category']) || 'project_management',
            description: String(item.description || ''),
            icon: String(item.icon || ''),
            benefits: Array.isArray(item.benefits) ? item.benefits : [],
            connected: Boolean(item.connected),
            lastSync: item.last_sync ? new Date(item.last_sync) : undefined,
            status: (item.status as Integration['status']) || 'disconnected',
            required: Boolean(item.required)
          }))

          setIntegrations(mappedIntegrations)
          setProgress(calculateProgress(mappedIntegrations))
        } else {
          // If no integrations in database, show empty state with helpful UI
          setIntegrations([])
          setProgress(0)
        }
      } catch (err) {
        logger.error('Error fetching integrations', err)
        setIntegrations([])
        setProgress(0)
      }
    }

    fetchIntegrations()
  }, [supabase])

  const calculateProgress = (integrations: Integration[]) => {
    const total = integrations.length
    const connected = integrations.filter(i => i.connected).length
    return (connected / total) * 100
  }

  const handleConnect = async (integrationId: string) => {
    setConnectingId(integrationId)

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock connection success
      setIntegrations((prev: Integration[]) => prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, connected: true, status: 'connected', lastSync: new Date() }
          : integration
      ))

      setProgress((prev: number) => prev + (100 / integrations.length))
    } catch (error) {
      logger.error('Connection failed', error)
      setIntegrations((prev: Integration[]) => prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, status: 'error' }
          : integration
      ))
    } finally {
      setConnectingId(null)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    setIntegrations((prev: Integration[]) => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, connected: false, status: 'disconnected', lastSync: undefined }
        : integration
    ))
    setProgress((prev: number) => prev - (100 / integrations.length))
  }

  const handleContinue = () => {
    router.push('/auth/onboarding/preferences')
  }

  const handleSkip = () => {
    router.push('/auth/onboarding/preferences')
  }

  const cardClass = "border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur"

  const getStatusBadge = (status: string, connected: boolean) => {
    if (connected) {
      return <Badge variant="secondary" className="bg-semantic-success/10 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1"/>
        Connected
      </Badge>
    }

    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-semantic-warning/10 text-yellow-800">
          <Clock className="h-3 w-3 mr-1"/>
          Pending
        </Badge>
      case 'error':
        return <Badge variant="secondary" className="bg-semantic-error/10 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1"/>
          Error
        </Badge>
      default:
        return <Badge variant="outline">Not Connected</Badge>
    }
  }

  const categories = {
    project_management: integrations.filter((i: Integration) => i.category === 'project_management'),
    version_control: integrations.filter((i: Integration) => i.category === 'version_control'),
    ci_cd: integrations.filter((i: Integration) => i.category === 'ci_cd'),
    documentation: integrations.filter((i: Integration) => i.category === 'documentation'),
    time_tracking: integrations.filter((i: Integration) => i.category === 'time_tracking'),
    file_storage: integrations.filter((i: Integration) => i.category === 'file_storage'),
    hr: integrations.filter((i: Integration) => i.category === 'hr'),
    payroll: integrations.filter((i: Integration) => i.category === 'payroll'),
    pos: integrations.filter((i: Integration) => i.category === 'pos'),
    ticketing: integrations.filter((i: Integration) => i.category === 'ticketing'),
    inventory: integrations.filter((i: Integration) => i.category === 'inventory'),
    analytics: integrations.filter((i: Integration) => i.category === 'analytics'),
    design: integrations.filter((i: Integration) => i.category === 'design'),
    testing: integrations.filter((i: Integration) => i.category === 'testing'),
    monitoring: integrations.filter((i: Integration) => i.category === 'monitoring'),
    security: integrations.filter((i: Integration) => i.category === 'security'),
    learning: integrations.filter((i: Integration) => i.category === 'learning'),
    marketing: integrations.filter((i: Integration) => i.category === 'marketing'),
    legal: integrations.filter((i: Integration) => i.category === 'legal'),
    finance: integrations.filter((i: Integration) => i.category === 'finance'),
    communication: integrations.filter((i: Integration) => i.category === 'communication'),
    calendar: integrations.filter((i: Integration) => i.category === 'calendar'),
    payment: integrations.filter((i: Integration) => i.category === 'payment'),
    crm: integrations.filter((i: Integration) => i.category === 'crm')
  }

  const connectedCount = integrations.filter((i: Integration) => i.connected).length
  const requiredConnected = integrations.filter((i: Integration) => i.required && i.connected).length
  const totalRequired = integrations.filter((i: Integration) => i.required).length

  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-[--surface-default]/70 backdrop-blur border-b border-[--border-default] px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-[--text-secondary]">
            <Link href="/" className="hover:text-[--text-primary]">Home</Link>
            <span>/</span>
            <span className="text-[--text-primary] font-medium">Onboarding - Integrations</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[--color-accent-primary]/15 rounded-full mb-6">
              <LinkIcon className="h-10 w-10 text-[--color-accent-primary]"/>
            </div>
            <h1 className="text-4xl heading-anton mb-4">Connect Your Accounts</h1>
            <p className="text-xl text-[--text-secondary] body-share-tech max-w-2xl mx-auto">
              Enhance your experience by connecting with your favorite services and platforms
            </p>
          </div>

          {/* Progress Overview */}
          <Card className={`mb-8 ${cardClass}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[--text-primary]">Integration Progress</h3>
                <span className="text-sm text-[--text-secondary]">
                  {connectedCount} of {integrations.length} connected
                </span>
              </div>
              <Progress value={progress} className="w-full mb-4"/>
              <div className="flex justify-between text-sm text-[--text-secondary]">
                <span>Required: {requiredConnected}/{totalRequired} connected</span>
                <span>Optional: {connectedCount - requiredConnected} connected</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Integration Categories */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Management */}
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="flex items-center heading-anton">
                    <CheckCircle className="h-5 w-5 mr-2 text-semantic-success"/>
                    Project Management
                  </CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    Tools for planning, tracking, and managing projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categories.project_management.map((integration: Integration) => (
                      <div key={integration.id} className="border border-[--border-default] rounded-lg p-4 bg-[--surface-default]">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <h4 className="font-medium text-[--text-primary]">{integration.name}</h4>
                              <p className="text-sm text-[--text-secondary] body-share-tech">{integration.description}</p>
                            </div>
                          </div>
                          {getStatusBadge(integration.status, integration.connected)}
                        </div>

                        <div className="mb-3">
                          <ul className="text-xs text-[--text-secondary] body-share-tech space-y-1">
                            {integration.benefits.slice(0, 2).map((benefit: string, index: number) => (
                              <li key={index}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          size="sm"
                          variant={integration.connected ? "outline" : "default"}
                          onClick={() => integration.connected
                            ? handleDisconnect(integration.id)
                            : handleConnect(integration.id)
                          }
                          disabled={connectingId === integration.id}
                          className="w-full rounded-full h-10"
                        >
                          {connectingId === integration.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin"/>
                              Connecting...
                            </>
                          ) : integration.connected ? (
                            <>
                              <Unlink className="h-4 w-4 mr-2"/>
                              Disconnect
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2"/>
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Version Control & CI/CD */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Version Control */}
                <Card className={cardClass}>
                  <CardHeader>
                    <CardTitle className="flex items-center heading-anton">
                      <Clock className="h-5 w-5 mr-2 text-accent-secondary"/>
                      Version Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categories.version_control.map((integration: Integration) => (
                      <div key={integration.id} className="border border-[--border-default] rounded-lg p-4 mb-4 bg-[--surface-default]">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <h4 className="font-medium text-[--text-primary]">{integration.name}</h4>
                              <p className="text-sm text-[--text-secondary] body-share-tech">{integration.description}</p>
                            </div>
                          </div>
                          {getStatusBadge(integration.status, integration.connected)}
                        </div>

                        <div className="mb-3">
                          <ul className="text-xs text-[--text-secondary] body-share-tech space-y-1">
                            {integration.benefits.slice(0, 2).map((benefit: string, index: number) => (
                              <li key={index}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          size="sm"
                          variant={integration.connected ? "outline" : "default"}
                          onClick={() => integration.connected
                            ? handleDisconnect(integration.id)
                            : handleConnect(integration.id)
                          }
                          disabled={connectingId === integration.id}
                          className="w-full"
                        >
                          {connectingId === integration.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin"/>
                              Connecting...
                            </>
                          ) : integration.connected ? (
                            <>
                              <Unlink className="h-4 w-4 mr-2"/>
                              Disconnect
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2"/>
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* CI/CD */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-semantic-warning"/>
                      CI/CD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categories.ci_cd.map((integration: Integration) => (
                      <div key={integration.id} className="border rounded-lg p-4 mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <h4 className="font-medium">{integration.name}</h4>
                              <p className="text-sm text-muted-foreground">{integration.description}</p>
                            </div>
                          </div>
                          {getStatusBadge(integration.status, integration.connected)}
                        </div>

                        <div className="mb-3">
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {integration.benefits.slice(0, 2).map((benefit: string, index: number) => (
                              <li key={index}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          size="sm"
                          variant={integration.connected ? "outline" : "default"}
                          onClick={() => integration.connected
                            ? handleDisconnect(integration.id)
                            : handleConnect(integration.id)
                          }
                          disabled={connectingId === integration.id}
                          className="w-full"
                        >
                          {connectingId === integration.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin"/>
                              Connecting...
                            </>
                          ) : integration.connected ? (
                            <>
                              <Unlink className="h-4 w-4 mr-2"/>
                              Disconnect
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2"/>
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Business Applications */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* HR & Payroll */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-accent-primary"/>
                      HR & Payroll
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.hr.slice(0, 2).map((integration: Integration) => (
                        <div key={integration.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{integration.icon}</span>
                              <span className="text-sm font-medium">{integration.name}</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => integration.connected ? handleDisconnect(integration.id) : handleConnect(integration.id)}>
                              {integration.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Finance & Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-semantic-success"/>
                      Finance & Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.finance.slice(0, 2).map((integration: Integration) => (
                        <div key={integration.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{integration.icon}</span>
                              <span className="text-sm font-medium">{integration.name}</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => integration.connected ? handleDisconnect(integration.id) : handleConnect(integration.id)}>
                              {integration.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Analytics & Monitoring */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-semantic-error"/>
                      Analytics & Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.analytics.slice(0, 2).map((integration: Integration) => (
                        <div key={integration.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{integration.icon}</span>
                              <span className="text-sm font-medium">{integration.name}</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => integration.connected ? handleDisconnect(integration.id) : handleConnect(integration.id)}>
                              {integration.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Connect?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Zap className="h-5 w-5 text-semantic-warning mt-0.5"/>
                      <div>
                        <h4 className="font-medium text-sm">Enhanced Experience</h4>
                        <p className="text-xs text-muted-foreground">
                          Get personalized recommendations based on your connected services
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-accent-primary mt-0.5"/>
                      <div>
                        <h4 className="font-medium text-sm">Easy Sharing</h4>
                        <p className="text-xs text-muted-foreground">
                          Automatically share experiences with friends and family
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-semantic-success mt-0.5"/>
                      <div>
                        <h4 className="font-medium text-sm">Stay Organized</h4>
                        <p className="text-xs text-muted-foreground">
                          Sync trips and events across all your calendars
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-accent-primary mt-0.5"/>
                      <div>
                        <h4 className="font-medium text-sm">Secure & Private</h4>
                        <p className="text-xs text-muted-foreground">
                          Your data is encrypted and you control what gets shared
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4"/>
                <AlertTitle>Security & Privacy</AlertTitle>
                <AlertDescription>
                  We use industry-standard OAuth protocols to securely connect your accounts.
                  You can disconnect any service at any time, and we never store your login credentials.
                </AlertDescription>
              </Alert>

              {/* Progress Reminder */}
              <Card>
                <CardHeader>
                  <CardTitle>Setup Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Integrations:</span>
                      <span>{connectedCount}/{integrations.length}</span>
                    </div>
                    <Progress value={progress} className="w-full"/>
                    <p className="text-xs text-muted-foreground">
                      Connecting services enhances your experience but is completely optional.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="space-y-3">
                <Button onClick={handleContinue} className="w-full">
                  Continue Setup
                </Button>
                <Button variant="outline" onClick={handleSkip} className="w-full">
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
