
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react'
import { verifyTOTPToken } from '@/lib/mfa'

interface MFAVerificationProps {
  onVerify: (code: string) => Promise<void>
  onCancel: () => void
  userEmail: string
  error?: string
}

export function MFAVerification({ onVerify, onCancel, userEmail, error }: MFAVerificationProps) {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      return
    }

    setIsVerifying(true)

    try {
      await onVerify(code)
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsVerifying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6) {
      handleVerify()
    }
  }

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent-secondary"/>
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Enter the 6-digit code from your authenticator app for {userEmail}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-neutral-400"/>
            <p className="text-sm text-muted-foreground">
              Open your authenticator app and enter the code.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mfa-code">Verification Code</Label>
            <Input
              id="mfa-code"
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyPress={handleKeyPress}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              autoFocus/>
            <p className="text-xs text-muted-foreground text-center">
              Code expires in 30 seconds
            </p>
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
              onClick={onCancel}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isVerifying || code.length !== 6}
              className="flex-1"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin"/>
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground underline"
              onClick={() => {
                // In a real implementation, this would send a backup code or resend
                alert('Backup code functionality would be implemented here')
              }}
            >
              Use backup code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
