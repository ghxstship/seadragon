
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, QrCode, CheckCircle, AlertTriangle } from 'lucide-react'
import { generateTOTPSecret, generateQRCodeURL, verifyTOTPToken } from '@/lib/mfa'

interface MFASetupProps {
  onComplete: (secret: string) => void
  onCancel: () => void
  userEmail: string
}

export function MFASetup({ onComplete, onCancel, userEmail }: MFASetupProps) {
  const [secret, setSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'setup' | 'verify'>('setup')

  useEffect(() => {
    // Generate TOTP secret and QR code URL
    const newSecret = generateTOTPSecret()
    setSecret(newSecret)
    setQrCodeUrl(generateQRCodeURL(newSecret, userEmail))
  }, [userEmail])

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const isValid = verifyTOTPToken(verificationCode, secret)

      if (isValid) {
        onComplete(secret)
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent-secondary"/>
            <CardTitle>Enable Multi-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account with TOTP authentication.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'setup' && (
            <>
              <div className="text-center">
                <QrCode className="h-16 w-16 mx-auto mb-4 text-neutral-400"/>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                    alt="TOTP QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"/>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Can&apos;t scan? Enter this code manually: <code className="bg-neutral-100 px-1 py-0.5 rounded text-xs">{secret}</code>
                </p>
              </div>

              <Button onClick={() => setStep('verify')} className="w-full">
                I&apos;ve scanned the QR code
              </Button>
            </>
          )}

          {step === 'verify' && (
            <>
              <div className="text-center">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-semantic-success"/>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the 6-digit code from your authenticator app to complete setup.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mfa-code">Verification Code</Label>
                <Input
                  id="mfa-code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"/>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4"/>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('setup')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {isVerifying ? 'Verifying...' : 'Enable MFA'}
                </Button>
              </div>
            </>
          )}

          <Button
            variant="ghost"
            onClick={onCancel}
            className="w-full"
          >
            Skip for now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
