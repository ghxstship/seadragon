
import { NextRequest, NextResponse } from "next/server"
import { createCalendarEvent, listCalendarEvents, updateCalendarEvent, deleteCalendarEvent } from "@/lib/google-calendar"
import { safeJsonParse } from "@/lib/safe-json"
import {
  requireAuth,
  getSupabaseClient,
  apiSuccess,
  apiError,
  validateRequired,
  parseJsonBody,
  getQueryParams,
  logActivity,
  logApiError
} from "@/lib/api-utils"

// Session interface for authentication
interface Session {
  user: {
    id: string
    email: string
    name?: string
  }
  expires: string
}

// Request body interfaces
interface CreateCalendarEventRequest {
  tokens: Record<string, unknown>
  summary: string
  description?: string
  startDateTime: string
  endDateTime: string
  location?: string
  attendees?: string[]
}

interface UpdateCalendarEventRequest {
  eventId: string
  tokens: Record<string, unknown>
  updates: Record<string, unknown>
}

// Query parameter interfaces
interface ListCalendarEventsQuery {
  tokens: string
  timeMin?: string
  timeMax?: string
}

interface DeleteCalendarEventQuery {
  eventId: string
  tokens: string
}

// POST /api/calendar/events - Create calendar event
export async function POST(request: NextRequest) {
  try {
    // Standardized authentication
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult
    const { session } = authResult as { session: Session }

    // Parse and validate request body
    const bodyResult = await parseJsonBody(request)
    if (!bodyResult.success) return bodyResult.error!
    const body = bodyResult.data as CreateCalendarEventRequest
    const { tokens, summary, description, startDateTime, endDateTime, location, attendees } = body

    // Validate required fields
    const validation = validateRequired(bodyResult.data, ['tokens', 'summary', 'startDateTime', 'endDateTime'])
    if (!validation.isValid) {
      return apiError("Validation failed", 400, "VALIDATION_ERROR", validation.errors)
    }

    const result = await createCalendarEvent(tokens, {
      summary,
      description,
      startDateTime,
      endDateTime,
      location,
      attendees
    })

    if (result.success) {
      // Standardized activity logging
      await logActivity(session, "calendar_event_created", "calendar_event", result.eventId, {
        summary,
        startDateTime,
        endDateTime,
        googleEventId: result.eventId,
        htmlLink: result.htmlLink
      })

      return apiSuccess({
        eventId: result.eventId,
        htmlLink: result.htmlLink
      })
    } else {
      return apiError("Failed to create calendar event", 500, "CALENDAR_CREATE_FAILED")
    }
  } catch (error) {
    logApiError(error, "calendar_event_creation")
    return apiError("Internal server error", 500)
  }
}

// GET /api/calendar/events - List calendar events
export async function GET(request: NextRequest) {
  try {
    // Standardized authentication
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult
    const { session } = authResult as { session: Session }

    // Standardized query parameter extraction
    const paramsResult = getQueryParams(request, ['tokens'], ['timeMin', 'timeMax'])
    if (!paramsResult.success) return paramsResult.error!
    const params = paramsResult.params as ListCalendarEventsQuery
    const { tokens, timeMin, timeMax } = params

    const tokensObj = safeJsonParse(decodeURIComponent(tokens))
    if (!tokensObj) {
      return apiError("Invalid token format", 400, "INVALID_TOKEN_FORMAT")
    }

    const result = await listCalendarEvents(tokensObj, timeMin, timeMax)

    if (result.success) {
      return apiSuccess({ events: result.events })
    } else {
      return apiError("Failed to fetch calendar events", 500, "CALENDAR_FETCH_FAILED")
    }
  } catch (error) {
    logApiError(error, "calendar_event_listing")
    return apiError("Internal server error", 500)
  }
}

// PUT /api/calendar/events - Update calendar event
export async function PUT(request: NextRequest) {
  try {
    // Standardized authentication
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult
    const { session } = authResult as { session: Session }

    // Parse and validate request body
    const bodyResult = await parseJsonBody(request)
    if (!bodyResult.success) return bodyResult.error!
    const body = bodyResult.data as UpdateCalendarEventRequest
    const { eventId, tokens, updates } = body

    // Validate required fields
    const validation = validateRequired(bodyResult.data, ['eventId', 'tokens', 'updates'])
    if (!validation.isValid) {
      return apiError("Validation failed", 400, "VALIDATION_ERROR", validation.errors)
    }

    const result = await updateCalendarEvent(tokens, eventId, updates)

    if (result.success) {
      // Standardized activity logging
      await logActivity(session, "calendar_event_updated", "calendar_event", eventId, {
        updates,
        googleEventId: eventId
      })

      return apiSuccess({ event: result.event })
    } else {
      return apiError("Failed to update calendar event", 500, "CALENDAR_UPDATE_FAILED")
    }
  } catch (error) {
    logApiError(error, "calendar_event_update")
    return apiError("Internal server error", 500)
  }
}

// DELETE /api/calendar/events - Delete calendar event
export async function DELETE(request: NextRequest) {
  try {
    // Standardized authentication
    const authResult = await requireAuth(request)
    if (authResult instanceof NextResponse) return authResult
    const { session } = authResult as { session: Session }

    // Standardized query parameter extraction
    const paramsResult = getQueryParams(request, ['eventId', 'tokens'])
    if (!paramsResult.success) return paramsResult.error!
    const params = paramsResult.params as DeleteCalendarEventQuery
    const { eventId, tokens } = params

    const tokensObj = safeJsonParse(decodeURIComponent(tokens))
    if (!tokensObj) {
      return apiError("Invalid token format", 400, "INVALID_TOKEN_FORMAT")
    }

    const result = await deleteCalendarEvent(tokensObj, eventId)

    if (result.success) {
      // Standardized activity logging
      await logActivity(session, "calendar_event_deleted", "calendar_event", eventId, {
        googleEventId: eventId
      })

      return apiSuccess({ success: true })
    } else {
      return apiError("Failed to delete calendar event", 500, "CALENDAR_DELETE_FAILED")
    }
  } catch (error) {
    logApiError(error, "calendar_event_deletion")
    return apiError("Internal server error", 500)
  }
}
