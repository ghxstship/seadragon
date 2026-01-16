
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
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-[--color-success] mx-auto"/>
                  <h2 className="text-3xl heading-anton">Email Verified!</h2>
                  <p className="text-[--text-secondary] body-share-tech">
                    Your email has been successfully verified. You can now sign in to your account.
                  </p>
                  <Button asChild className="h-11 rounded-full bg-[--color-accent-primary] text-black">
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
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-accent-primary] mx-auto" />
                      <p className="text-[--text-secondary] body-share-tech">Verifying your email...</p>
                    </>
                  ) : error ? (
                    <>
                      <AlertCircle className="h-12 w-12 text-[--color-error] mx-auto"/>
                      <h2 className="text-2xl heading-anton">Verification Failed</h2>
                      <p className="text-[--text-secondary] body-share-tech">{error}</p>
                      <div className="space-y-2">
                        <Button onClick={resendVerificationEmail} disabled={isLoading} className="h-11 rounded-full bg-[--color-accent-primary] text-black">
                          Resend Verification Email
                        </Button>
                        <Button variant="outline" asChild className="h-11 rounded-full border-[--border-default] bg-white text-[--text-primary]">
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
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header/>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-[--color-accent-primary] mx-auto mb-4"/>
              <CardTitle className="text-3xl leading-tight heading-anton">Check Your Email</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                We&apos;ve sent a verification link to{' '}
                <strong>{email || 'your email address'}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="text-center space-y-4">
                <p className="text-sm text-[--text-secondary] body-share-tech">
                  Click the link in the email to verify your account and complete your registration.
                </p>

                {emailSent && (
                  <div className="flex items-center space-x-2 text-sm text-[--color-success] bg-[--color-success-light] p-3 rounded">
                    <CheckCircle className="h-4 w-4"/>
                    <span>Verification email sent!</span>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={resendVerificationEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-11 rounded-full border-[--border-default] bg-white text-[--text-primary]"
                  >
                    {isLoading ? 'Sending...' : 'Resend Verification Email'}
                  </Button>

                  <div className="text-sm text-[--text-secondary]">
                    Didn&apos;t receive the email? Check your spam folder.
                  </div>

                  <Link
                    href="/auth/login"
                    className="text-sm text-[--color-accent-primary] hover:underline flex items-center justify-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Back to Sign In
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-[--border-default] space-y-2">
                <h3 className="font-medium heading-anton">Need Help?</h3>
                <div className="text-sm text-[--text-secondary] body-share-tech space-y-1">
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
