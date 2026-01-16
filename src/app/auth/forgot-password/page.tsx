
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/lib/design-system'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [organizationSlug, setOrganizationSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          organizationSlug,
        }),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to send reset email')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-[--color-success] mx-auto"/>
                  <h2 className="text-3xl heading-anton">Check Your Email</h2>
                  <p className="text-[--text-secondary] body-share-tech">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to reset your password.
                  </p>
                  <div className="space-y-2 text-sm text-[--text-secondary]">
                    <p>
                      Didn&apos;t receive the email? Check your spam folder or{' '}
                      <Button
                        onClick={() => setSuccess(false)}
                        variant="ghost"
                        className="px-1 text-[--color-accent-primary] hover:underline"
                      >
                        try again
                      </Button>
                    </p>
                  </div>
                  <Button asChild className="h-11 rounded-full bg-[--color-accent-primary] text-black">
                    <Link href="/auth/login">
                      <ArrowLeft className="h-4 w-4 mr-2"/>
                      Back to Sign In
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header/>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl leading-tight heading-anton">Forgot Your Password?</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Enter your email address and we&apos;ll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-[--text-secondary] body-share-tech">Organization</Label>
                  <Input
                    id="organization"
                    type="text"
                    placeholder="your-organization"
                    value={organizationSlug}
                    onChange={(e) => setOrganizationSlug(e.target.value)}
                    required/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[--text-secondary] body-share-tech">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-sm text-[--color-error] bg-[--color-error-light] p-3 rounded">
                    <AlertCircle className="h-4 w-4"/>
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[--color-accent-primary] text-black shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="text-center space-y-2 pt-4 border-t border-[--border-default]">
                <Link
                  href="/auth/login"
                  className="text-sm text-[--color-accent-primary] hover:underline flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2"/>
                  Back to Sign In
                </Link>
                <div className="text-sm text-[--text-secondary]">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="text-[--color-accent-primary] hover:underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
