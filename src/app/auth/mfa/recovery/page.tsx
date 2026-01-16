
'use client'


import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Header } from "@/lib/design-system"
import { Shield, Key, AlertTriangle, CheckCircle, ArrowLeft, Eye, EyeOff, RefreshCw, Mail, Phone, Info } from "lucide-react"

export default function MFARecoveryPage() {
  const router = useRouter()
  const [recoveryCode, setRecoveryCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(5)
  const [showRecoveryCode, setShowRecoveryCode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!recoveryCode.trim()) {
      setError('Please enter a recovery code')
      setIsSubmitting(false)
      return
    }

    if (recoveryCode.length !== 8) {
      setError('Recovery code must be 8 characters long')
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock validation - in real app this would validate against stored recovery codes
      const validCodes = ['ABC12345', 'DEF67890', 'GHI54321'] // Mock valid codes
      if (validCodes.includes(recoveryCode.toUpperCase())) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setAttemptsLeft(prev => prev - 1)
        if (attemptsLeft <= 1) {
          setError('Too many failed attempts. Account temporarily locked. Contact support.')
        } else {
          setError(`Invalid recovery code. ${attemptsLeft - 1} attempts remaining.`)
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateNewCodes = async () => {
    // In a real app, this would require authentication first
    alert('New recovery codes will be generated after you verify your identity.')
    router.push('/auth/mfa/setup')
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
                  <CheckCircle className="h-12 w-12 text-[--color-accent-primary] mx-auto"/>
                  <h2 className="text-2xl heading-anton">Recovery Successful</h2>
                  <p className="text-[--text-secondary] body-share-tech">
                    Your account has been recovered. You can now sign in normally.
                  </p>
                  <Button asChild className="h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition">
                    <Link href="/dashboard">Continue to Dashboard</Link>
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
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-[--surface-default]/70 backdrop-blur border-b border-[--border-default] px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-[--text-secondary]">
            <Link href="/" className="hover:text-[--text-primary]">Home</Link>
            <span>/</span>
            <Link href="/auth/login" className="hover:text-[--text-primary]">Sign In</Link>
            <span>/</span>
            <span className="text-[--text-primary] font-medium">MFA Recovery</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[--color-error]/12 rounded-full mb-6">
              <Key className="h-10 w-10 text-[--color-error]"/>
            </div>
            <h1 className="text-4xl heading-anton mb-4">Account Recovery</h1>
            <p className="text-xl text-[--text-secondary] body-share-tech max-w-lg mx-auto">
              Use a backup recovery code to regain access to your account
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recovery Form */}
            <div className="lg:col-span-2">
              <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center heading-anton">
                    <Key className="h-5 w-5 mr-2"/>
                    Enter Recovery Code
                  </CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    Enter one of your backup recovery codes to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="recovery-code" className="text-[--text-secondary] body-share-tech">Recovery Code</Label>
                      <div className="relative">
                        <Input
                          id="recovery-code"
                          type={showRecoveryCode ? "text" : "password"}
                          value={recoveryCode}
                          onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                          placeholder="Enter 8-character code"
                          maxLength={8}
                          className="font-mono text-center text-lg tracking-wider h-11"
                          required/>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-[--text-secondary]"
                          onClick={() => setShowRecoveryCode(!showRecoveryCode)}
                        >
                          {showRecoveryCode ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </Button>
                      </div>
                      <p className="text-sm text-[--text-secondary] body-share-tech mt-2">
                        Recovery codes are 8 characters long and case-insensitive.
                        Each code can only be used once.
                      </p>
                    </div>

                    {/* Attempts Warning */}
                    {attemptsLeft < 5 && (
                      <Alert variant="destructive" className="border-[--color-error] bg-[--color-error-light]">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Multiple Failed Attempts</AlertTitle>
                        <AlertDescription>
                          {attemptsLeft === 1
                            ? "This is your last attempt. One more failure will temporarily lock your account."
                            : `${attemptsLeft} attempts remaining before account lockout.`
                          }
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                      <Alert variant="destructive" className="border-[--color-error] bg-[--color-error-light]">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Recovery Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="flex space-x-3">
                      <Button type="submit" className="flex-1 h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition" disabled={isSubmitting || attemptsLeft === 0}>
                        {isSubmitting ? 'Verifying...' : 'Use Recovery Code'}
                      </Button>
                      <Button variant="outline" asChild className="h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                        <Link href="/auth/login">
                          <ArrowLeft className="h-4 w-4 mr-2"/>
                          Back to Sign In
                        </Link>
                      </Button>
                    </div>
                  </form>

                  {/* Alternative Recovery Options */}
                  <div className="mt-8 pt-6 border-t border-[--border-default]">
                    <h3 className="font-medium heading-anton mb-4">Alternative Recovery Methods</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                        <Mail className="h-4 w-4 mr-2"/>
                        Send Recovery Email
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                        <Phone className="h-4 w-4 mr-2"/>
                        SMS Recovery Code
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]" onClick={generateNewCodes}>
                        <RefreshCw className="h-4 w-4 mr-2"/>
                        Generate New Recovery Codes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Notice */}
              <Card className="border border-[--border-default] bg-[--surface-default]/85 shadow-[0_8px_22px_rgba(0,0,0,0.07)]">
                <CardHeader>
                  <CardTitle className="flex items-center heading-anton">
                    <Shield className="h-5 w-5 mr-2"/>
                    Security Notice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-[--text-secondary] body-share-tech space-y-2">
                    <p>
                      Recovery codes are your last resort for accessing your account.
                      Keep them in a safe place, separate from your password.
                    </p>
                    <p>
                      Each code can only be used once. Once used, it&apos;s permanently invalidated.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recovery Code Info */}
              <Card className="border border-[--border-default] bg-[--surface-default]/85 shadow-[0_8px_22px_rgba(0,0,0,0.07)]">
                <CardHeader>
                  <CardTitle className="heading-anton">Recovery Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-[--text-secondary] body-share-tech">
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-mono text-[--text-primary]">ABCDEFGH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span className="text-[--text-primary]">8 characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Case:</span>
                      <span className="text-[--text-primary]">Insensitive</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage:</span>
                      <span className="text-[--text-primary]">One-time use</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Don't Have Codes */}
              <Card className="border border-[--border-default] bg-[--surface-default]/85 shadow-[0_8px_22px_rgba(0,0,0,0.07)]">
                <CardHeader>
                  <CardTitle className="heading-anton">Don&apos;t Have Recovery Codes?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-[--text-secondary] body-share-tech space-y-2">
                    <p>• Check your email for previously generated codes</p>
                    <p>• Recovery codes are created when you enable 2FA</p>
                    <p>• Generate new codes from account settings</p>
                    <p>• Contact support if you can&apos;t access your account</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 h-10 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]" asChild>
                    <Link href="/support/contact">
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card className="border border-[--border-default] bg-[--surface-default]/85 shadow-[0_8px_22px_rgba(0,0,0,0.07)]">
                <CardHeader>
                  <CardTitle className="flex items-center heading-anton">
                    <Info className="h-5 w-5 mr-2"/>
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-[--text-secondary] body-share-tech space-y-2">
                    <p>• Store recovery codes in a password manager</p>
                    <p>• Keep them separate from your login credentials</p>
                    <p>• Generate new codes periodically</p>
                    <p>• Never share codes with others</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center space-y-3">
            <h2 className="text-xl heading-anton">Need More Help?</h2>
            <p className="text-[--text-secondary] body-share-tech">
              If you&apos;re having trouble accessing your account, our support team is here to help.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild className="h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                <Link href="/support/account-recovery">
                  Account Recovery Guide
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                <Link href="/support/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
