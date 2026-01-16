
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LogOut, Shield, Clock, Smartphone, AlertTriangle, CheckCircle, ArrowLeft, Monitor } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Sign Out | ATLVS + GVTEWAY',
  description: 'Sign out of your ATLVS + GVTEWAY account securely.',
}

interface LogoutPageProps {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function LogoutPage({ searchParams }: LogoutPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const session = await auth()

  // If no session, redirect to login
  if (!session) {
    redirect('/auth/login')
  }

  // Handle auto-logout if requested
  if (resolvedSearchParams?.auto === 'true') {
    try {
      await signOut({ redirect: false })
      redirect('/auth/login?message=logged_out')
    } catch (error) {
      logger.error('Auto logout failed', error)
    }
  }

  const handleSignOut = async () => {
    'use server'

    try {
      await signOut({
        redirectTo: '/auth/login?message=signed_out_successfully',
        redirect: true
      })
    } catch (error) {
      logger.error('Sign out error', error)
      // In a real app, you might want to handle this error
      redirect('/auth/login?error=sign_out_failed')
    }
  }

  const user = session.user
  const currentDevice = {
    name: 'Current Device',
    type: 'Desktop',
    location: 'Miami, FL',
    lastActive: new Date().toLocaleString(),
    isCurrent: true
  }

  // Mock active sessions - in real app this would come from database
  const activeSessions = [
    currentDevice,
    {
      name: 'iPhone 15 Pro',
      type: 'Mobile',
      location: 'Miami, FL',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(), // 2 hours ago
      isCurrent: false
    },
    {
      name: 'MacBook Pro',
      type: 'Laptop',
      location: 'New York, NY',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(), // 1 day ago
      isCurrent: false
    }
  ]

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
        <div className="max-w-2xl mx-auto">
          {/* Sign Out Confirmation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LogOut className="h-6 w-6 mr-3 text-semantic-error"/>
                Sign Out Confirmation
              </CardTitle>
              <CardDescription>
                You&apos;re about to sign out of your ATLVS + GVTEWAY account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-semantic-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="h-8 w-8 text-semantic-error"/>
                </div>
                <h2 className="text-xl font-semibold mb-2">Are you sure you want to sign out?</h2>
                <p className="text-muted-foreground">
                  You will be signed out of your account on this device. Any unsaved work may be lost.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Role: {user?.role || 'Member'}</span>
                  <span>•</span>
                  <span>Last login: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <form action={handleSignOut} className="flex-1">
                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2"/>
                    Sign Out
                  </Button>
                </form>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/dashboard">
                    Cancel
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Alert className="mb-6">
            <Shield className="h-4 w-4"/>
            <AlertTitle>Security Reminder</AlertTitle>
            <AlertDescription>
              For your security, we recommend signing out when using shared or public devices.
              You can sign back in anytime with your email and password.
            </AlertDescription>
          </Alert>

          {/* Active Sessions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2"/>
                Active Sessions
              </CardTitle>
              <CardDescription>
                Devices where you&apos;re currently signed in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        session.isCurrent ? 'bg-accent-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {session.type === 'Desktop' && ''}
                        {session.type === 'Mobile' && ''}
                        {session.type === 'Laptop' && ''}
                      </div>
                      <div>
                        <p className="font-medium">{session.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.location} • {session.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {session.isCurrent && (
                        <Badge variant="default" className="mb-1">Current</Badge>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {session.lastActive}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4"/>

              <div className="text-center">
                <Button variant="outline" size="sm">
                  Manage All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out Options */}
          <Card>
            <CardHeader>
              <CardTitle>Sign Out Options</CardTitle>
              <CardDescription>
                Choose how you want to sign out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5"/>
                  <div className="flex-1">
                    <h4 className="font-medium">Sign out of this device only</h4>
                    <p className="text-sm text-muted-foreground">
                      You&apos;ll remain signed in on your other devices. This is the default option.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg opacity-60">
                  <div className="h-5 w-5 border-2 border-muted-foreground rounded mt-0.5"/>
                  <div className="flex-1">
                    <h4 className="font-medium">Sign out of all devices</h4>
                    <p className="text-sm text-muted-foreground">
                      You&apos;ll be signed out of all devices where you&apos;re currently logged in.
                      This provides maximum security but may be inconvenient.
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6"/>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4"/>
                  <span>You&apos;ll be redirected to the login page after signing out</span>
                </div>

                <div className="flex space-x-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/support/account-security">
                      Account Security Help
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/support/contact">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
