
'use client'


import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/lib/design-system"
import { Shield, Smartphone, Key, AlertTriangle, CheckCircle, RefreshCw, Clock, ArrowLeft } from "lucide-react"

export default function MFAVerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // MFA method - in real app this would come from session/state
  const [mfaMethod, setMfaMethod] = useState<'authenticator' | 'sms'>('authenticator')
  const [methodDetails, setMethodDetails] = useState({
    authenticator: { app: 'Google Authenticator', device: 'iPhone' },
    sms: { number: '+1 (555) 123-4567' }
  })

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }

    // Countdown timer for code expiry
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digits

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits entered
    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (code?: string) => {
    const verificationCode = code || otp.join('')
    if (verificationCode.length !== 6) {
      setError('Please enter a complete 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock verification - in real app this would validate against server
      const validCodes = ['123456', '654321', '111111'] // Mock valid codes
      if (validCodes.includes(verificationCode)) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError('Invalid verification code. Please try again.')
        // Reset OTP inputs
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setCanResend(false)
    setTimeLeft(30)
    setError('')

    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app, this would trigger a new code generation
      alert('New verification code sent!')
    } catch (error) {
      setError('Failed to resend code. Please try again.')
      setCanResend(true)
    }
  }

  const handleUseBackupCodes = () => {
    router.push('/auth/mfa/recovery')
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
                  <h2 className="text-2xl font-bold">Verification Successful</h2>
                  <p className="text-muted-foreground">
                    Your account has been verified. Redirecting to dashboard...
                  </p>
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
            <span className="text-foreground font-medium">Verify Code</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Shield className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Enter Security Code</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Enter the 6-digit code from your {mfaMethod === 'authenticator' ? 'authenticator app' : 'SMS'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Verification Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2"/>
                    Verification Code
                  </CardTitle>
                  <CardDescription>
                    Enter the code sent to your {mfaMethod === 'authenticator' ? 'authenticator app' : 'phone'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Method Info */}
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent-primary/10 rounded-full">
                        {mfaMethod === 'authenticator' ? (
                          <Smartphone className="h-5 w-5 text-accent-primary"/>
                        ) : (
                          <Key className="h-5 w-5 text-accent-primary"/>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {mfaMethod === 'authenticator'
                            ? `${methodDetails.authenticator.app} on ${methodDetails.authenticator.device}`
                            : `SMS to ${methodDetails.sms.number}`
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mfaMethod === 'authenticator'
                            ? 'Check your authenticator app for the code'
                            : 'Check your messages for the SMS code'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* OTP Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Enter 6-digit code</label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => { inputRefs.current[index] = el }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-bold"
                          disabled={isVerifying}/>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center mt-3">
                      Code expires in <span className="font-semibold">{timeLeft}</span> seconds
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertTriangle className="h-4 w-4"/>
                      <AlertTitle>Verification Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleVerify()}
                      disabled={isVerifying || otp.some(digit => digit === '')}
                      className="w-full"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Code'}
                    </Button>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleResendCode}
                        disabled={!canResend}
                        className="flex-1"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${canResend ? '' : 'animate-spin'}`}/>
                        {canResend ? 'Resend Code' : `Resend in ${timeLeft}s`}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleUseBackupCodes}
                        className="flex-1"
                      >
                        Use Backup Codes
                      </Button>
                    </div>

                    <Button variant="ghost" asChild className="w-full">
                      <Link href="/auth/login">
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Back to Sign In
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2"/>
                    Security Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Codes expire after 30 seconds</p>
                    <p>• Each code can only be used once</p>
                    <p>• Keep your device time synchronized</p>
                    <p>• Store backup codes securely</p>
                    <p>• Never share codes with others</p>
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card>
                <CardHeader>
                  <CardTitle>Having Trouble?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Check your device time is correct</p>
                    <p>• Ensure your authenticator app is updated</p>
                    <p>• Try refreshing your authenticator app</p>
                    <p>• Make sure you&apos;re using the correct account</p>
                    <p>• Contact support if issues persist</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link href="/support/contact">
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Code Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Code Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span className="font-medium">6 digits</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valid for:</span>
                      <span className="font-medium">30 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium">Numeric only</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage:</span>
                      <span className="font-medium">One-time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Smartphone className="h-4 w-4 mr-2"/>
                      Use Different Authenticator
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Key className="h-4 w-4 mr-2"/>
                      Use Backup Codes
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2"/>
                      Request New Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Help */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Need help with two-factor authentication?{' '}
              <Link href="/support/2fa" className="text-accent-primary hover:underline">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
