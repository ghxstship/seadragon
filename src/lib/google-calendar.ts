
import { google } from 'googleapis'
import { logger } from './logger'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
]

export function getGoogleAuthUrl() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`
  )

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  })
}

export function getOAuth2Client(tokens?: unknown) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`
  )

  if (tokens) {
    oauth2Client.setCredentials(tokens)
  }

  return oauth2Client
}

export async function createCalendarEvent(tokens: unknown, eventData: {
  summary: string
  description?: string
  startDateTime: string
  endDateTime: string
  location?: string
  attendees?: string[]
}) {
  const oauth2Client = getOAuth2Client(tokens)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const event = {
    summary: eventData.summary,
    description: eventData.description,
    start: {
      dateTime: eventData.startDateTime,
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: eventData.endDateTime,
      timeZone: 'America/New_York',
    },
    location: eventData.location,
    attendees: eventData.attendees?.map(email => ({ email })),
    reminders: {
      useDefault: true,
    },
  }

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    })
    return { success: true, eventId: response.data.id, htmlLink: response.data.htmlLink }
  } catch (error) {
    logger.error('Error creating calendar event', error)
    return { success: false, error }
  }
}

export async function listCalendarEvents(tokens: unknown, timeMin?: string, timeMax?: string) {
  const oauth2Client = getOAuth2Client(tokens)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    })
    return { success: true, events: response.data.items }
  } catch (error) {
    logger.error('Error listing calendar events', error)
    return { success: false, error }
  }
}

export async function updateCalendarEvent(tokens: unknown, eventId: string, updates: unknown) {
  const oauth2Client = getOAuth2Client(tokens)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      resource: updates,
    })
    return { success: true, event: response.data }
  } catch (error) {
    logger.error('Error updating calendar event', error)
    return { success: false, error }
  }
}

export async function deleteCalendarEvent(tokens: unknown, eventId: string) {
  const oauth2Client = getOAuth2Client(tokens)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    })
    return { success: true }
  } catch (error) {
    logger.error('Error deleting calendar event', error)
    return { success: false, error }
  }
}
