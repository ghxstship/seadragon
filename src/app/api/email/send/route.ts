
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import { sendEmail, emailTemplates } from "@/lib/email"
import { safeJsonParse } from "@/lib/safe-json"



// POST /api/email/send - Send email
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { to, template, templateData } = body

    if (!to || !template) {
      return NextResponse.json({ error: "Recipient email and template are required" }, { status: 400 })
    }

    let emailTemplate

    // Generate template based on type
    switch (template) {
      case 'welcome':
        emailTemplate = emailTemplates.welcome(
          templateData.userName,
          templateData.organizationName
        )
        break
      case 'eventReminder':
        emailTemplate = emailTemplates.eventReminder(
          templateData.userName,
          templateData.eventName,
          templateData.eventDate,
          templateData.venueName
        )
        break
      case 'ticketConfirmation':
        emailTemplate = emailTemplates.ticketConfirmation(
          templateData.userName,
          templateData.eventName,
          templateData.ticketCount,
          templateData.qrCodeUrl
        )
        break
      default:
        return NextResponse.json({ error: "Invalid template type" }, { status: 400 })
    }

    const result = await sendEmail(to, emailTemplate)

    if (result.success) {
      // Log email activity
      const supabase = await createClient()
      await supabase
        .from('activities')
        .insert({
          user_id: session.user.id,
          action: "email_sent",
          entity: "email",
          entity_id: result.data?.id || 'unknown',
          details: {
            template,
            recipient: to,
            templateData
          }
        })

      return NextResponse.json({
        success: true,
        messageId: result.data?.id
      })
    } else {
      return NextResponse.json({
        error: "Failed to send email",
        details: result.error
      }, { status: 500 })
    }
  } catch (error) {
    logger.error("Email API error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/email/bulk - Send bulk emails
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { recipients, template, templateData } = body

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !template) {
      return NextResponse.json({ error: "Recipients array and template are required" }, { status: 400 })
    }

    // Check user permissions for bulk email
    const supabase = await createClient()
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('is_active, roles(permissions)')
      .eq('user_id', session.user.id)
      .eq('organization_id', session.user.organizationId)
      .eq('is_active', true)
      .single()

    const roleData = userOrg?.roles as { permissions: string[] | string } | null
    const permissions = Array.isArray(roleData?.permissions)
      ? roleData.permissions
      : safeJsonParse((roleData?.permissions as string) || '[]') || []

    if (!userOrg || !permissions.includes("manage_communications")) {
      return NextResponse.json({ error: "Insufficient permissions for bulk email" }, { status: 403 })
    }

    let emailTemplate

    // Generate template based on type
    switch (template) {
      case 'eventAnnouncement':
        emailTemplate = {
          subject: `New Event: ${templateData.eventName}`,
          html: `<h1>New Event: ${templateData.eventName}</h1><p>${templateData.description}</p>`,
          text: `New Event: ${templateData.eventName}\n${templateData.description}`
        }
        break
      case 'newsletter':
        emailTemplate = {
          subject: templateData.subject,
          html: templateData.htmlContent,
          text: templateData.textContent
        }
        break
      default:
        return NextResponse.json({ error: "Invalid template type for bulk email" }, { status: 400 })
    }

    // Send emails (in a real implementation, you'd use batch sending)
    const results = []
    for (const recipient of recipients.slice(0, 100)) { // Limit to 100 for safety
      const result = await sendEmail(recipient, emailTemplate)
      results.push({
        email: recipient,
        success: result.success,
        messageId: result.data?.id
      })

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Log bulk email activity
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: "bulk_email_sent",
        entity: "email",
        entity_id: `bulk_${Date.now()}`,
        details: {
          template,
          recipientCount: recipients.length,
          successCount: results.filter(r => r.success).length,
          templateData
        }
      })

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    })
  } catch (error) {
    logger.error("Bulk email API error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
