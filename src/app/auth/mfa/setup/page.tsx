
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/lib/design-system"
import { AlertCircle, CheckCircle2, ShieldCheck, Smartphone } from "lucide-react"

export default function MFASetupPage() {
  const [method, setMethod] = useState<'authenticator' | 'sms'>('authenticator')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const router = useRouter()

  const startAuthenticatorSetup = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/mfa/setup/authenticator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setQrCode(data.qrCode)
        setSecret(data.secret)
        setStep('verify')
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to setup authenticator')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startSMSSetup = async () => {
    if (!phoneNumber) {
      setError('Phone number is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/mfa/setup/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })

      if (response.ok) {
        setStep('verify')
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to setup SMS verification')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async () => {
    if (!verificationCode) {
      setError('Verification code is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: verificationCode,
          method,
          phoneNumber: method === 'sms' ? phoneNumber : undefined,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        // Redirect after success
        setTimeout(() => {
          router.push('/home')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || 'Invalid verification code')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const skipMFA = () => {
    router.push('/home')
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
                  <CheckCircle2 className="h-12 w-12 text-semantic-success mx-auto"/>
                  <h2 className="text-2xl font-bold">Two-Factor Authentication Enabled</h2>
                  <p className="text-muted-foreground">
                    Your account is now more secure with two-factor authentication enabled.
                  </p>
                  <Button asChild>
                    <Link href="/home">Continue to Dashboard</Link>
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

      {/* MFA Setup */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <ShieldCheck className="h-12 w-12 text-accent-primary mx-auto mb-4"/>
              <CardTitle className="text-2xl">Set Up Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 'setup' && (
                <>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Two-factor authentication adds an extra layer of security by requiring a second form of verification when you sign in.
                    </p>
                  </div>

                  <Tabs value={method} onValueChange={(value) => setMethod(value as 'authenticator' | 'sms')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="authenticator">Authenticator App</TabsTrigger>
                      <TabsTrigger value="sms">SMS</TabsTrigger>
                    </TabsList>

                    <TabsContent value="authenticator" className="space-y-4">
                      <div className="text-center space-y-2">
                        <Smartphone className="h-8 w-8 text-accent-primary mx-auto"/>
                        <div>
                          <h3 className="font-semibold">Authenticator App</h3>
                          <p className="text-sm text-muted-foreground">
                            Use an authenticator app like Google Authenticator, Authy, or 1Password
                          </p>
                        </div>
                      </div>
                      <Button onClick={startAuthenticatorSetup} className="w-full" disabled={isLoading}>
                        {isLoading ? 'Setting up...' : 'Set Up Authenticator'}
                      </Button>
                    </TabsContent>

                    <TabsContent value="sms" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}/>
                        <p className="text-xs text-muted-foreground">
                          We&apos;ll send a verification code to this number
                        </p>
                      </div>
                      <Button onClick={startSMSSetup} className="w-full" disabled={isLoading}>
                        {isLoading ? 'Sending code...' : 'Send Verification Code'}
                      </Button>
                    </TabsContent>
                  </Tabs>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded">
                      <AlertCircle className="h-4 w-4"/>
                      <span>{error}</span>
                    </div>
                  )}
                </>
              )}

              {step === 'verify' && (
                <>
                  {method === 'authenticator' && qrCode && (
                    <div className="text-center space-y-4">
                      <h3 className="font-semibold">Scan QR Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Scan this QR code with your authenticator app
                      </p>
                      <div className="bg-background p-4 rounded-lg inline-block">
                        <Image src={qrCode} alt="QR Code" width={192} height={192} className="w-48 h-48"/>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground mb-2">
                          Can&apos;t scan? Enter this code manually:
                        </p>
                        <code className="text-xs bg-muted p-2 rounded block break-all">
                          {secret}
                        </code>
                      </div>
                    </div>
                  )}

                  {method === 'sms' && (
                    <div className="text-center space-y-4">
                      <Smartphone className="h-8 w-8 text-accent-primary mx-auto"/>
                      <div>
                        <h3 className="font-semibold">Check Your Phone</h3>
                        <p className="text-sm text-muted-foreground">
                          We sent a verification code to {phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}/>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded">
                      <AlertCircle className="h-4 w-4"/>
                      <span>{error}</span>
                    </div>
                  )}

                  <Button onClick={verifyCode} className="w-full" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setStep('setup')}
                    className="w-full"
                  >
                    Back to Setup
                  </Button>
                </>
              )}

              {/* Skip Option */}
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={skipMFA}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Skip for now
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  You can enable 2FA later in your account settings
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
