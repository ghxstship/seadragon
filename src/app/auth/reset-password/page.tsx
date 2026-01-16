
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/lib/design-system'
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError('Invalid reset link. Please request a new password reset.')
      return
    }

    // Validate token
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        setTokenValid(response.ok)
        if (!response.ok) {
          const data = await response.json()
          setError(data.message || 'Invalid or expired reset link')
        }
      } catch (error) {
        setTokenValid(false)
        setError('Failed to validate reset link')
      }
    }

    validateToken()
  }, [token])

  const validateForm = () => {
    if (!password || !confirmPassword) {
      setError('All fields are required')
      return false
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !token) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login?message=password-updated')
        }, 3000)
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to reset password')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-[--color-error] mx-auto"/>
                  <h2 className="text-2xl heading-anton">Invalid Reset Link</h2>
                  <p className="text-[--text-secondary] body-share-tech">
                    This password reset link is invalid or has expired. Please request a new password reset.
                  </p>
                  <div className="space-y-2">
                    <Button asChild className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white">
                      <Link href="/auth/forgot-password">Request New Reset Link</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full h-11 rounded-full border-[--border-default] bg-white text-[--text-primary]">
                      <Link href="/auth/login">
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Back to Sign In
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
                  <h2 className="text-2xl heading-anton">Password Updated!</h2>
                  <p className="text-[--text-secondary] body-share-tech">
                    Your password has been successfully reset. You can now sign in with your new password.
                  </p>
                  <Button asChild className="h-11 rounded-full bg-[--color-accent-primary] text-white">
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

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-accent-primary] mx-auto" />
                  <p className="text-[--text-secondary] body-share-tech">Validating reset link...</p>
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
              <CardTitle className="text-3xl leading-tight heading-anton">Reset Your Password</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[--text-secondary] body-share-tech">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required/>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4"/>
                      ) : (
                        <Eye className="h-4 w-4"/>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-[--text-muted] body-share-tech">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[--text-secondary] body-share-tech">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required/>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4"/>
                      ) : (
                        <Eye className="h-4 w-4"/>
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-sm text-[--color-error] bg-[--color-error-light] p-3 rounded">
                    <AlertCircle className="h-4 w-4"/>
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating Password...' : 'Update Password'}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-accent-primary] mx-auto" />
                  <p className="text-[--text-secondary] body-share-tech">Loading...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
