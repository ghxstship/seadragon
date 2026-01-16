
'use client'


import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/lib/design-system"
import { Shield, Key, AlertTriangle, CheckCircle, ArrowLeft, Eye, EyeOff, RefreshCw, Mail, Phone, Lock, Info } from "lucide-react"

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
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-semantic-success mx-auto"/>
                  <h2 className="text-2xl font-bold">Recovery Successful</h2>
                  <p className="text-muted-foreground">
                    Your account has been recovered. You can now sign in normally.
                  </p>
                  <Button asChild>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/auth/login" className="hover:text-foreground">Sign In</Link>
            <span>/</span>
            <span className="text-foreground font-medium">MFA Recovery</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-semantic-error/10 rounded-full mb-6">
              <Key className="h-10 w-10 text-semantic-error"/>
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Account Recovery</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Use a backup recovery code to regain access to your account
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recovery Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2"/>
                    Enter Recovery Code
                  </CardTitle>
                  <CardDescription>
                    Enter one of your backup recovery codes to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="recovery-code">Recovery Code</Label>
                      <div className="relative">
                        <Input
                          id="recovery-code"
                          type={showRecoveryCode ? "text" : "password"}
                          value={recoveryCode}
                          onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                          placeholder="Enter 8-character code"
                          maxLength={8}
                          className="font-mono text-center text-lg tracking-wider"
                          required/>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowRecoveryCode(!showRecoveryCode)}
                        >
                          {showRecoveryCode ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recovery codes are 8 characters long and case-insensitive.
                        Each code can only be used once.
                      </p>
                    </div>

                    {/* Attempts Warning */}
                    {attemptsLeft < 5 && (
                      <Alert variant="destructive">
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
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Recovery Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="flex space-x-3">
                      <Button type="submit" className="flex-1" disabled={isSubmitting || attemptsLeft === 0}>
                        {isSubmitting ? 'Verifying...' : 'Use Recovery Code'}
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/auth/login">
                          <ArrowLeft className="h-4 w-4 mr-2"/>
                          Back to Sign In
                        </Link>
                      </Button>
                    </div>
                  </form>

                  {/* Alternative Recovery Options */}
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="font-medium mb-4">Alternative Recovery Methods</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2"/>
                        Send Recovery Email
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2"/>
                        SMS Recovery Code
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={generateNewCodes}>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2"/>
                    Security Notice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
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
              <Card>
                <CardHeader>
                  <CardTitle>Recovery Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-mono">ABCDEFGH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span>8 characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Case:</span>
                      <span>Insensitive</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage:</span>
                      <span>One-time use</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Don't Have Codes */}
              <Card>
                <CardHeader>
                  <CardTitle>Don&apos;t Have Recovery Codes?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Check your email for previously generated codes</p>
                    <p>• Recovery codes are created when you enable 2FA</p>
                    <p>• Generate new codes from account settings</p>
                    <p>• Contact support if you can&apos;t access your account</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link href="/support/contact">
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2"/>
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
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
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground mb-6">
              If you&apos;re having trouble accessing your account, our support team is here to help.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/support/account-recovery">
                  Account Recovery Guide
                </Link>
              </Button>
              <Button variant="outline" asChild>
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
