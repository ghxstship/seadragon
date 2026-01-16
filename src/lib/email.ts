
import { Resend } from 'resend'
import { logger } from './logger'

const RESEND_API_KEY = process.env['RESEND_API_KEY']
const RESEND_DOMAIN = process.env['RESEND_DOMAIN']
const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] || '#'

let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    logger.error('RESEND_API_KEY is required for email sending')
    return null
  }
  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY)
  }
  return resendClient
}

const EMAIL_THEME = {
  fontFamily: 'Arial, sans-serif',
  text: '#1F2937',
  heading: '#111827',
  primary: '#2563EB',
  success: '#16A34A',
  danger: '#DC2626',
  mutedBg: '#F3F4F6',
  cardBg: '#F8F9FA'
} as const

const baseContainer = (inner: string) =>
  `<div style="font-family: ${EMAIL_THEME.fontFamily}; max-width: 600px; margin: 0 auto; color: ${EMAIL_THEME.text};">${inner}</div>`

const heading = (text: string) =>
  `<h1 style="color: ${EMAIL_THEME.heading}; margin: 0 0 12px;">${text}</h1>`

const subheading = (text: string, color: string = EMAIL_THEME.heading) =>
  `<h2 style="margin: 0 0 12px; color: ${color};">${text}</h2>`

const card = (inner: string) =>
  `<div style="background-color: ${EMAIL_THEME.cardBg}; padding: 20px; border-radius: 5px; margin: 20px 0;">${inner}</div>`

const button = (href: string, label: string, variant: 'primary' | 'success' | 'danger' = 'primary') => {
  const bg =
    variant === 'success' ? EMAIL_THEME.success : variant === 'danger' ? EMAIL_THEME.danger : EMAIL_THEME.primary
  return `<a href="${href}" style="background-color: ${bg}; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">${label}</a>`
}

const mutedNote = (text: string) =>
  `<p style="margin: 12px 0; color: ${EMAIL_THEME.text};">${text}</p>`

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export const emailTemplates = {
  welcome: (userName: string, organizationName: string): EmailTemplate => ({
    subject: 'Welcome to ATLVS + GVTEWAY',
    html: baseContainer(`
      ${heading(`Welcome to ${organizationName}!`)}
      <p>Hi ${userName},</p>
      <p>Welcome to the ATLVS + GVTEWAY platform! We're excited to have you join our community.</p>
      <p>You can now:</p>
      <ul>
        <li>Discover and book amazing live entertainment experiences</li>
        <li>Manage your events and projects</li>
        <li>Connect with other entertainment professionals</li>
        <li>Access exclusive content and opportunities</li>
      </ul>
      <p>Let's create some unforgettable experiences together!</p>
      ${button(`${APP_URL}/dashboard`, 'Get Started')}
      ${mutedNote('Best regards,<br>The ATLVS + GVTEWAY Team')}
    `),
    text: `Welcome to ATLVS + GVTEWAY!

Hi ${userName},

Welcome to the ATLVS + GVTEWAY platform! We're excited to have you join our community.

You can now discover and book amazing live entertainment experiences, manage your events and projects, connect with other entertainment professionals, and access exclusive content and opportunities.

Let's create some unforgettable experiences together!

Get Started: ${APP_URL}/dashboard

Best regards,
The ATLVS + GVTEWAY Team`
  }),

  eventReminder: (userName: string, eventName: string, eventDate: string, venueName: string): EmailTemplate => ({
    subject: 'Event Reminder - ATLVS + GVTEWAY',
    html: baseContainer(`
      ${heading('Event Reminder')}
      <p>Hi ${userName},</p>
      <p>This is a friendly reminder about your upcoming event:</p>
      ${card(`
        ${subheading(eventName, EMAIL_THEME.primary)}
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Venue:</strong> ${venueName}</p>
      `)}
      <p>We can't wait to see you there!</p>
      ${button(`${APP_URL}/events`, 'View Event Details', 'success')}
      ${mutedNote('Best regards,<br>The ATLVS + GVTEWAY Team')}
    `),
    text: `Event Reminder - ATLVS + GVTEWAY

Hi ${userName},

This is a friendly reminder about your upcoming event:

${eventName}
Date: ${eventDate}
Venue: ${venueName}

We can't wait to see you there!

View Event Details: ${APP_URL}/events

Best regards,
The ATLVS + GVTEWAY Team`
  }),

  ticketConfirmation: (userName: string, eventName: string, ticketCount: number, qrCodeUrl: string): EmailTemplate => ({
    subject: 'Ticket Confirmation - ATLVS + GVTEWAY',
    html: baseContainer(`
      ${heading('Ticket Confirmation')}
      <p>Hi ${userName},</p>
      <p>Thank you for your purchase! Here are your tickets for:</p>
      ${card(`
        ${subheading(eventName, EMAIL_THEME.success)}
        <p><strong>Tickets:</strong> ${ticketCount}</p>
        <p>Your tickets have been confirmed and are ready to use.</p>
      `)}
      <p><strong>Important:</strong> Please bring a valid ID and this email to the event.</p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${qrCodeUrl}" alt="Ticket QR Code" style="max-width: 200px;"/>
      </div>
      ${button(`${APP_URL}/tickets`, 'View My Tickets')}
      ${mutedNote('Best regards,<br>The ATLVS + GVTEWAY Team')}
    `),
    text: `Ticket Confirmation - ATLVS + GVTEWAY

Hi ${userName},

Thank you for your purchase! Here are your tickets for:

${eventName}
Tickets: ${ticketCount}

Your tickets have been confirmed and are ready to use.

Important: Please bring a valid ID and this email to the event.

View My Tickets: ${APP_URL}/tickets

Best regards,
The ATLVS + GVTEWAY Team`
  }),

  workflowTransition: (userName: string, workflowName: string, fromPhase: string, fromStep: string, toPhase: string, toStep: string): EmailTemplate => ({
    subject: 'Workflow Update - ATLVS + GVTEWAY',
    html: baseContainer(`
      ${heading('Workflow Update')}
      <p>Hi ${userName},</p>
      <p>Your workflow has transitioned:</p>
      ${card(`
        <p><strong>Workflow:</strong> ${workflowName}</p>
        <p><strong>From:</strong> ${fromPhase} - ${fromStep}</p>
        <p><strong>To:</strong> ${toPhase} - ${toStep}</p>
      `)}
      ${button(`${APP_URL}/workflows`, 'View Workflow')}
      ${mutedNote('Best regards,<br>The ATLVS + GVTEWAY Team')}
    `),
    text: `Workflow Update - ATLVS + GVTEWAY

Hi ${userName},

Your workflow has transitioned:

Workflow: ${workflowName}

From: ${fromPhase} - ${fromStep}

To: ${toPhase} - ${toStep}

View Workflow: ${APP_URL}/workflows

Best regards,
The ATLVS + GVTEWAY Team`
  })
}

export async function sendEmail(to: string, template: EmailTemplate) {
  try {
    const resend = getResendClient()
    if (!resend) {
      return { success: false, error: new Error('Email client not configured') }
    }

    const { data, error } = await resend.emails.send({
      from: `ATLVS + GVTEWAY <noreply@${RESEND_DOMAIN}>`,
      to: [to],
      subject: template.subject,
      html: template.html,
      text: template.text ?? ''
    })

    if (error) {
      logger.error('Email sending error', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    logger.error('Email service error', err)
    return { success: false, error: err }
  }
}

// Magic link email for passwordless authentication
export async function sendMagicLinkEmail(email: string, url: string) {
  const template: EmailTemplate = {
    subject: 'Your magic link for ATLVS + GVTEWAY',
    html: baseContainer(`
      ${heading('Your Magic Link')}
      <p>Hi there,</p>
      <p>You requested a magic link to sign in to ATLVS + GVTEWAY. Click the button below to sign in:</p>
      <div style="text-align: center; margin: 30px 0;">
        ${button(url, 'Sign In')}
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: ${EMAIL_THEME.mutedBg}; padding: 10px; border-radius: 3px;">${url}</p>
      <p><strong>This link will expire in 24 hours.</strong></p>
      <p>If you didn't request this link, please ignore this email.</p>
      ${mutedNote('Best regards,<br>The ATLVS + GVTEWAY Team')}
    `),
    text: `Your Magic Link

Hi there,

You requested a magic link to sign in to ATLVS + GVTEWAY.

Click this link to sign in: ${url}

This link will expire in 24 hours.

If you didn't request this link, please ignore this email.

Best regards,
The ATLVS + GVTEWAY Team`
  }

  return await sendEmail(email, template)
}

// Email verification email
export async function sendVerificationEmail(email: string, verificationUrl: string) {
  const template: EmailTemplate = {
    subject: 'Verify your email for ATLVS + GVTEWAY',
    html: baseContainer(`
      ${heading('Verify Your Email')}
      <p>Welcome to ATLVS + GVTEWAY!</p>
      <p>Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        ${button(verificationUrl, 'Verify Email', 'success')}
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: ${EMAIL_THEME.mutedBg}; padding: 10px; border-radius: 3px;">${verificationUrl}</p>
      <p><strong>This link will expire in 24 hours.</strong></p>
      <p>Once verified, you'll have full access to all ATLVS + GVTEWAY features.</p>
      ${mutedNote('Best regards,<br>The ATLVS + GVTEWAY Team')}
    `),
    text: `Verify Your Email

Welcome to ATLVS + GVTEWAY!

Please verify your email address by clicking this link: ${verificationUrl}

This link will expire in 24 hours.

Once verified, you'll have full access to all ATLVS + GVTEWAY features.

Best regards,
The ATLVS + GVTEWAY Team`
  }

  return await sendEmail(email, template)
}

// Password reset email
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const template: EmailTemplate = {
    subject: 'Reset your password for ATLVS + GVTEWAY',
    html: baseContainer(`
      ${heading('Reset Your Password')}
      <p>Hi there,</p>
      <p>You requested to reset your password for ATLVS + GVTEWAY. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        ${button(resetUrl, 'Reset Password', 'danger')}
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: ${EMAIL_THEME.mutedBg}; padding: 10px; border-radius: 3px;">${resetUrl}</p>
      <p><strong>This link will expire in 1 hour.</strong></p>
      <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
      ${mutedNote('Best regards,<br>The ATLVS + GVTEWAY Team')}
    `),
    text: `Reset Your Password

Hi there,

You requested to reset your password for ATLVS + GVTEWAY.

Click this link to create a new password: ${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The ATLVS + GVTEWAY Team`
  }

  return await sendEmail(email, template)
}
