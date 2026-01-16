
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LogOut, Shield, Clock, CheckCircle, ArrowLeft, Monitor } from "lucide-react"
import Link from "next/link"
import { Header } from '@/lib/design-system'

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
  if (resolvedSearchParams?.['auto'] === 'true') {
    try {
      await signOut()
      redirect('/auth/login?message=logged_out')
    } catch (error) {
      logger.error('Auto logout failed', error)
    }
  }

  const handleSignOut = async () => {
    'use server'

    try {
      await signOut()
      redirect('/auth/login?message=signed_out_successfully')
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
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header/>

      <nav className="bg-[--surface-default]/70 backdrop-blur border-b border-[--border-default] px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-[--text-secondary]">
            <Link href="/dashboard" className="hover:text-[--text-primary]">
              <ArrowLeft className="h-4 w-4 mr-2 inline"/>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Sign Out Confirmation */}
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center heading-anton">
                <LogOut className="h-6 w-6 mr-3 text-[--color-accent-primary]"/>
                Sign Out Confirmation
              </CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                You&apos;re about to sign out of your ATLVS + GVTEWAY account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[--color-accent-primary]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="h-8 w-8 text-[--color-accent-primary]"/>
                </div>
                <h2 className="text-2xl heading-anton mb-2">Are you sure you want to sign out?</h2>
                <p className="text-[--text-secondary] body-share-tech">
                  You will be signed out of your account on this device. Any unsaved work may be lost.
                </p>
              </div>

              <div className="bg-[--surface-hover] p-4 rounded-lg mb-6 border border-[--border-default]">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-[--color-accent-primary] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium heading-anton text-sm">{user?.name}</p>
                    <p className="text-sm text-[--text-secondary] body-share-tech">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-[--text-secondary] body-share-tech">
                  <span>Role: {user?.role || 'Member'}</span>
                  <span>•</span>
                  <span>Last login: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <form action={handleSignOut} className="flex-1">
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5"
                  >
                    <LogOut className="h-4 w-4 mr-2"/>
                    Sign Out
                  </Button>
                </form>
                <Button variant="outline" asChild className="flex-1 h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                  <Link href="/dashboard">
                    Cancel
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Alert className="mb-6 border-[--border-default] bg-[--surface-default]/80">
            <Shield className="h-4 w-4"/>
            <AlertTitle className="heading-anton">Security Reminder</AlertTitle>
            <AlertDescription className="text-[--text-secondary] body-share-tech">
              For your security, we recommend signing out when using shared or public devices.
              You can sign back in anytime with your email and password.
            </AlertDescription>
          </Alert>

          {/* Active Sessions */}
          <Card className="border border-[--border-default] bg-[--surface-default]/80 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center heading-anton">
                <Monitor className="h-5 w-5 mr-2"/>
                Active Sessions
              </CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Devices where you&apos;re currently signed in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-[--border-default] rounded-lg bg-[--surface-default]">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        session.isCurrent ? 'bg-[--color-accent-primary] text-white' : 'bg-[--surface-hover] text-[--text-secondary]'
                      }`}>
                        {session.isCurrent ? '•' : ''}
                      </div>
                      <div>
                        <p className="font-medium text-[--text-primary]">{session.name}</p>
                        <p className="text-sm text-[--text-secondary] body-share-tech">{session.type}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-[--text-secondary] body-share-tech">
                      <p>{session.location}</p>
                      <p>Last active: {session.lastActive}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <Button variant="outline" size="sm" className="rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
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

              <div className="text-center space-y-4 pt-4 border-t border-[--border-default] mt-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-[--text-secondary] body-share-tech">
                  <Clock className="h-4 w-4"/>
                  <span>You&apos;ll be redirected to the login page after signing out</span>
                </div>

                <div className="flex space-x-3 justify-center">
                  <Button variant="ghost" size="sm" asChild className="text-[--text-primary]">
                    <Link href="/support/account-security">
                      Account Security Help
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="text-[--text-primary]">
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
