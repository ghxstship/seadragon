
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { generateTOTPSecret, generateQRCodeURL } from '@/lib/mfa'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Generate TOTP secret and QR code
    const secret = generateTOTPSecret()
    const qrCodeUrl = generateQRCodeURL(secret, session.user.email || 'user')

    // Store temporary MFA setup data in session/database
    // In production, this would be stored securely with expiration
    const { error } = await supabase
      .from('users')
      .update({
        mfa_secret: secret, // Temporary, should be encrypted
        mfa_enabled: false, // Will be set to true after verification
      })
      .eq('id', session.user.id)

    if (error) {
      logger.error('Error updating MFA settings', error)
      return NextResponse.json({ message: 'Failed to setup MFA' }, { status: 500 })
    }

    // Generate QR code image URL (using a QR service)
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`

    return NextResponse.json({
      qrCode: qrCodeImageUrl,
      secret,
      message: 'MFA setup initiated'
    })

  } catch (error) {
    logger.error('MFA setup error', error)
    return NextResponse.json(
      { message: 'Failed to setup MFA' },
      { status: 500 }
    )
  }
}
