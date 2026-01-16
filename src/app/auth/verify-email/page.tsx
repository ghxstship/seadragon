
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/lib/design-system'
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const verifyEmail = useCallback(
    async (verificationToken: string) => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: verificationToken }),
        })

        if (response.ok) {
          setSuccess(true)
          // Redirect to login after a delay
          setTimeout(() => {
            router.push('/auth/login?message=email-verified')
          }, 3000)
        } else {
          const data = await response.json()
          setError(data.message || 'Failed to verify email')
        }
      } catch (error) {
        setError('An error occurred. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  useEffect(() => {
    if (token) {
      // Auto-verify if token is present
      verifyEmail(token)
    }
  }, [token, verifyEmail])

  const resendVerificationEmail = async () => {
    if (!email) {
      setError('Email address is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmailSent(true)
        setTimeout(() => setEmailSent(false), 3000)
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to resend verification email')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-semantic-success mx-auto"/>
                  <h2 className="text-2xl font-bold">Email Verified!</h2>
                  <p className="text-muted-foreground">
                    Your email has been successfully verified. You can now sign in to your account.
                  </p>
                  <Button asChild>
                    <Link href="/auth/login">Continue to Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (token && !success) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto"></div>
                      <p className="text-muted-foreground">Verifying your email...</p>
                    </>
                  ) : error ? (
                    <>
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto"/>
                      <h2 className="text-2xl font-bold">Verification Failed</h2>
                      <p className="text-muted-foreground">{error}</p>
                      <div className="space-y-2">
                        <Button onClick={resendVerificationEmail} disabled={isLoading}>
                          Resend Verification Email
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/auth/login">
                            <ArrowLeft className="h-4 w-4 mr-2"/>
                            Back to Sign In
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Email Verification */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-accent-primary mx-auto mb-4"/>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We&apos;ve sent a verification link to{' '}
                <strong>{email || 'your email address'}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to verify your account and complete your registration.
                </p>

                {emailSent && (
                  <div className="flex items-center space-x-2 text-sm text-semantic-success bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <CheckCircle className="h-4 w-4"/>
                    <span>Verification email sent!</span>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={resendVerificationEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : 'Resend Verification Email'}
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Didn&apos;t receive the email? Check your spam folder.
                  </div>

                  <Link
                    href="/auth/login"
                    className="text-sm text-accent-primary hover:underline flex items-center justify-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Back to Sign In
                  </Link>
                </div>
              </div>

              {/* Help Section */}
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Make sure to check your spam/junk folder</p>
                  <p>• The verification link expires in 24 hours</p>
                  <p>• Contact support if you continue having issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
