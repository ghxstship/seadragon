
// TOTP-based MFA implementation for PCI DSS compliance
// Note: In production, use a proper TOTP library like 'otplib'

export function generateTOTPSecret(): string {
  // Generate a 32-character base32 secret
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

export function generateTOTPToken(secret: string): string {
  // Simplified TOTP generation (in production, use a library)
  // This is a placeholder - actual implementation requires crypto functions
  const time = Math.floor(Date.now() / 30000) // 30-second windows
  const hmac = btoa(secret + time.toString()) // Simplified HMAC
  const offset = parseInt(hmac.slice(-1), 16)
  const code = parseInt(hmac.substr(offset * 2, 8), 16) % 1000000
  return code.toString().padStart(6, '0')
}

export function verifyTOTPToken(token: string, secret: string): boolean {
  // Verify TOTP token with time window tolerance
  const currentToken = generateTOTPToken(secret)

  // Check current time window and adjacent windows (±1)
  for (let i = -1; i <= 1; i++) {
    const time = Math.floor((Date.now() + i * 30000) / 30000)
    const hmac = btoa(secret + time.toString())
    const offset = parseInt(hmac.slice(-1), 16)
    const code = parseInt(hmac.substr(offset * 2, 8), 16) % 1000000
    const expectedToken = code.toString().padStart(6, '0')

    if (expectedToken === token) {
      return true
    }
  }

  return false
}

export function generateQRCodeURL(secret: string, accountName: string, issuer: string = 'ATLVS + GVTEWAY'): string {
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: 'SHA1',
    digits: '6',
    period: '30'
  })

  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?${params.toString()}`
}