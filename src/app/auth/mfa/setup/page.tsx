
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
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-[--color-accent-primary] mx-auto"/>
                  <h2 className="text-2xl heading-anton">Two-Factor Authentication Enabled</h2>
                  <p className="text-[--text-secondary] body-share-tech">
                    Your account is now more secure with two-factor authentication enabled.
                  </p>
                  <Button asChild className="h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition">
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
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      {/* Header */}
      <Header/>

      {/* MFA Setup */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader className="text-center space-y-3">
              <div className="inline-flex w-16 h-16 bg-[--color-accent-primary]/15 rounded-full items-center justify-center mx-auto">
                <ShieldCheck className="h-8 w-8 text-[--color-accent-primary]"/>
              </div>
              <CardTitle className="text-2xl heading-anton">Set Up Two-Factor Authentication</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 'setup' && (
                <>
                  <div className="text-center">
                    <p className="text-sm text-[--text-secondary] body-share-tech mb-4">
                      Two-factor authentication adds an extra layer of security by requiring a second form of verification when you sign in.
                    </p>
                  </div>

                  <Tabs value={method} onValueChange={(value) => setMethod(value as 'authenticator' | 'sms')}>
                    <TabsList className="grid w-full grid-cols-2 bg-[--surface-hover]">
                      <TabsTrigger value="authenticator" className="data-[state=active]:bg-[--surface-default] data-[state=active]:text-[--text-primary]">Authenticator App</TabsTrigger>
                      <TabsTrigger value="sms" className="data-[state=active]:bg-[--surface-default] data-[state=active]:text-[--text-primary]">SMS</TabsTrigger>
                    </TabsList>

                    <TabsContent value="authenticator" className="space-y-4">
                      <div className="text-center space-y-2">
                        <Smartphone className="h-8 w-8 text-[--color-accent-primary] mx-auto"/>
                        <div>
                          <h3 className="font-semibold text-[--text-primary]">Authenticator App</h3>
                          <p className="text-sm text-[--text-secondary] body-share-tech">
                            Use an authenticator app like Google Authenticator, Authy, or 1Password
                          </p>
                        </div>
                      </div>
                      <Button onClick={startAuthenticatorSetup} className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5" disabled={isLoading}>
                        {isLoading ? 'Setting up...' : 'Set Up Authenticator'}
                      </Button>
                    </TabsContent>

                    <TabsContent value="sms" className="space-y-4">
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-[--text-primary]">SMS Verification</h3>
                          <p className="text-sm text-[--text-secondary] body-share-tech">
                            Receive verification codes via SMS
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[--text-secondary] body-share-tech">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <Button onClick={startSMSSetup} className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5" disabled={isLoading}>
                        {isLoading ? 'Sending code...' : 'Send Verification Code'}
                      </Button>
                    </TabsContent>
                  </Tabs>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center space-x-2 text-sm text-[--color-error] bg-[--color-error-light] p-3 rounded">
                      <AlertCircle className="h-4 w-4 text-[--color-error]"/>
                      <span>{error}</span>
                    </div>
                  )}
                </>
              )}

              {step === 'verify' && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <CheckCircle2 className="h-10 w-10 text-accent-primary mx-auto"/>
                    <h3 className="font-semibold text-[--text-primary]">Enter Verification Code</h3>
                    <p className="text-sm text-[--text-secondary] body-share-tech">
                      Enter the code from your authenticator app or SMS
                    </p>
                  </div>
                  {method === 'authenticator' && qrCode && (
                    <div className="text-center space-y-4">
                      <h3 className="font-semibold">Scan QR Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Scan this QR code with your authenticator app
                      </p>
                      <div className="flex justify-center">
                        <Image src={qrCode} alt="QR Code" width={200} height={200}/>
                      </div>
                      <div className="bg-[--surface-hover] p-3 rounded border border-[--border-default]">
                        <p className="text-sm font-mono break-all text-[--text-primary]">{secret}</p>
                      </div>
                    </div>
                  )}

                  {method === 'sms' && (
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode" className="text-[--text-secondary] body-share-tech">Verification Code</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center space-x-2 text-sm text-[--color-error] bg-[--color-error-light] p-3 rounded">
                      <AlertCircle className="h-4 w-4 text-[--color-error]"/>
                      <span>{error}</span>
                    </div>
                  )}

                  <Button onClick={verifyCode} className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>

                  <Button variant="ghost" onClick={skipMFA} className="w-full">
                    Skip for now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-[--surface-hover] rounded-lg border border-[--border-default] space-y-3">
            <h3 className="font-medium heading-anton">Need Help?</h3>
            <p className="text-sm text-[--text-secondary] body-share-tech">
              If you encounter any issues setting up MFA, visit our support center or contact support.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" asChild className="flex-1 h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                <Link href="/support">Support Center</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                <Link href="/support/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
