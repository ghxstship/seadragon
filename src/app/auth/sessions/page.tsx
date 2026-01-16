
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { Monitor, Smartphone, Tablet, MapPin, Clock, Shield, AlertTriangle, CheckCircle, X, Trash2, Settings, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SessionInfo {
  id: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  deviceName: string
  browser: string
  location: string
  ipAddress: string
  lastActive: Date
  isCurrent: boolean
  isTrusted: boolean
}

interface SessionApiResponse {
  id: string | number
  deviceType?: string
  deviceName?: string
  browser?: string
  location?: string
  ipAddress?: string
  lastActive?: string
  last_active?: string
  isCurrent?: boolean
  isTrusted?: boolean
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadSessions = async () => {
      try {
        // Fetch session data from API
        const res = await fetch('/api/auth/sessions')
        if (res.ok) {
          const data = await res.json()
          if (!cancelled && Array.isArray(data.sessions)) {
            setSessions(data.sessions.map((s: SessionApiResponse) => ({
              ...s,
              deviceType: (s.deviceType as 'desktop' | 'mobile' | 'tablet') || 'desktop',
              lastActive: new Date(s.lastActive || s.last_active || Date.now())
            })))
          }
        }
        // Fallback to current session only
        if (!cancelled && sessions.length === 0) {
          setSessions([{
            id: 'current-session',
            deviceType: 'desktop',
            deviceName: 'Current Device',
            browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser',
            location: 'Unknown',
            ipAddress: '',
            lastActive: new Date(),
            isCurrent: true,
            isTrusted: true
          }])
        }
        if (!cancelled) setIsLoading(false)
      } catch (error) {
        logger.error('Error loading sessions:', error)
        if (!cancelled) {
          setSessions([{
            id: 'current-session',
            deviceType: 'desktop',
            deviceName: 'Current Device',
            browser: 'Browser',
            location: 'Unknown',
            ipAddress: '',
            lastActive: new Date(),
            isCurrent: true,
            isTrusted: true
          }])
          setIsLoading(false)
        }
      }
    }

    loadSessions()

    return () => { cancelled = true }
  }, [sessions.length])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading sessions...</div>
      </div>
    )
  }

  const currentSession = sessions.find(s => s.isCurrent)
  const otherSessions = sessions.filter(s => !s.isCurrent)
  const suspiciousSessions = otherSessions.filter(s => !s.isTrusted)

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-5 w-5"/>
      case 'tablet':
        return <Tablet className="h-5 w-5"/>
      case 'desktop':
      default:
        return <Monitor className="h-5 w-5"/>
    }
  }

  const getDeviceColor = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return 'text-accent-secondary'
      case 'tablet':
        return 'text-semantic-success'
      case 'desktop':
      default:
        return 'text-accent-primary'
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Active now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-display font-bold">ATLVS + COMPVSS Dashboard</h1>
            </div>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1 inline"/>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent-primary/20 rounded-full">
                <Shield className="h-6 w-6 text-accent-primary"/>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">Active Sessions</h1>
                <p className="text-muted-foreground">
                  Manage your account sessions across devices and locations
                </p>
              </div>
            </div>

            {/* Session Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent-primary">{sessions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-semantic-success">1</div>
                  <div className="text-sm text-muted-foreground">Current Session</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent-secondary">{otherSessions.length}</div>
                  <div className="text-sm text-muted-foreground">Other Sessions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${suspiciousSessions.length > 0 ? 'text-semantic-warning' : 'text-semantic-success'}`}>
                    {suspiciousSessions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Untrusted</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Alert */}
          {suspiciousSessions.length > 0 && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4"/>
              <AlertTitle>Untrusted Sessions Detected</AlertTitle>
              <AlertDescription>
                We detected {suspiciousSessions.length} session{suspiciousSessions.length > 1 ? 's' : ''} from unrecognized locations or devices.
                Review and revoke any suspicious activity immediately.
              </AlertDescription>
            </Alert>
          )}

          {/* Current Session */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-semantic-success"/>
                Current Session
              </CardTitle>
              <CardDescription>
                Your active session on this device
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentSession && (
                <div className="flex items-center justify-between p-4 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-accent-primary/10 rounded-full ${getDeviceColor(currentSession.deviceType)}`}>
                      {getDeviceIcon(currentSession.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">{currentSession.deviceName}</p>
                        <Badge variant="default">Current</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>{currentSession.browser}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1"/>
                          {currentSession.location}
                        </div>
                        <span>•</span>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1"/>
                          {formatLastActive(currentSession.lastActive)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        IP: {currentSession.ipAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-semantic-success/10 text-green-800">
                      <Shield className="h-3 w-3 mr-1"/>
                      Trusted
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other Sessions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Other Active Sessions</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2"/>
                      Revoke All
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Revoke All Sessions</DialogTitle>
                      <DialogDescription>
                        This will sign you out of all devices except the current one. You will need to sign in again on other devices.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex space-x-3 pt-4">
                      <Button variant="destructive" className="flex-1">
                        Revoke All Sessions
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                Sessions on other devices and browsers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {otherSessions.map((session) => (
                  <div key={session.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                    !session.isTrusted ? 'border-orange-200 bg-orange-50' : 'border-border'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getDeviceColor(session.deviceType)} ${
                        !session.isTrusted ? 'bg-semantic-warning/10' : 'bg-muted'
                      }`}>
                        {getDeviceIcon(session.deviceType)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold">{session.deviceName}</p>
                          {!session.isTrusted && (
                            <Badge variant="destructive" className="text-xs">
                              Untrusted
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{session.browser}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1"/>
                            {session.location}
                          </div>
                          <span>•</span>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1"/>
                            {formatLastActive(session.lastActive)}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          IP: {session.ipAddress}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4 mr-1"/>
                            Revoke
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Revoke Session</DialogTitle>
                            <DialogDescription>
                              This will sign out the session on {session.deviceName} in {session.location}.
                              The user will need to sign in again on that device.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex space-x-3 pt-4">
                            <Button variant="destructive" className="flex-1">
                              Revoke Session
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {!session.isTrusted && (
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4 mr-1"/>
                          Trust
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2"/>
                Session Security Settings
              </CardTitle>
              <CardDescription>
                Configure automatic session management and security features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Auto-logout inactive sessions</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically sign out sessions after 30 days of inactivity
                    </p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <Separator/>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Notify on new sign-ins</p>
                    <p className="text-sm text-muted-foreground">
                      Get email alerts when your account is accessed from new devices or locations
                    </p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <Separator/>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Require verification for new devices</p>
                    <p className="text-sm text-muted-foreground">
                      Send verification codes when signing in from unrecognized devices
                    </p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <Separator/>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Session timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically sign out after period of inactivity
                    </p>
                  </div>
                  <Select className="ml-3 px-3 py-1 border rounded text-sm">
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                    <SelectItem value="8h">8 hours</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Tips */}
          <Alert>
            <Shield className="h-4 w-4"/>
            <AlertTitle>Security Best Practices</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Regularly review and revoke unrecognized sessions</li>
                <li>Sign out of shared or public devices immediately after use</li>
                <li>Use strong, unique passwords for your accounts</li>
                <li>Enable two-factor authentication for enhanced security</li>
                <li>Monitor your account activity regularly</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
