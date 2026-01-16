
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { getOAuth2Client, getGoogleAuthUrl } from "@/lib/google-calendar"
import { createClient } from "@/lib/supabase/server"



// GET /api/integrations/google/auth - Get Google OAuth URL
export async function GET(request: NextRequest) {
  try {
    const authUrl = getGoogleAuthUrl()
    return NextResponse.json({ authUrl })
  } catch (error) {
    logger.error("Google auth URL error", error)
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 })
  }
}

// GET /api/integrations/google/callback - Handle OAuth callback
export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code required" }, { status: 400 })
    }

    const oauth2Client = getOAuth2Client()

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Store tokens for the user (you'd typically store this securely)
    // For demo purposes, we'll just return success

    return NextResponse.json({
      success: true,
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date
      }
    })
  } catch (error) {
    logger.error("Google OAuth callback error", error)
    return NextResponse.json({ error: "OAuth callback failed" }, { status: 500 })
  }
}
