# OpusZero API Documentation

## Overview

The OpusZero API provides comprehensive endpoints for managing enterprise workflows, content, users, and organizational data. This documentation covers all available endpoints with examples and authentication requirements.

## Base URL
```
https://api.opuszero.com/v1
```

## Authentication

All API requests require authentication using Bearer tokens:

```
Authorization: Bearer <your-api-token>
```

### Obtaining API Tokens

1. **User Authentication**: Login via NextAuth.js providers
2. **API Token Generation**: Generate tokens in user settings
3. **Organization Tokens**: Admin users can generate organization-wide tokens

## Rate Limiting

- **Authenticated Requests**: 1000 requests per hour
- **Anonymous Requests**: 100 requests per hour
- **Rate Limit Headers**:
  ```
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: 1638360000
  ```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456789"
  },
  "error": null
}
```

## Error Handling

Error responses include:

```json
{
  "success": false,
  "data": null,
  "meta": { ... },
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": { ... }
  }
}
```

## Core Endpoints

### Events API

#### GET /events
Retrieve events with filtering and pagination.

**Query Parameters:**
- `projectId` (string): Filter by project
- `status` (string): Filter by status (draft, planning, active, completed)
- `startDate` (ISO 8601): Filter events starting after this date
- `endDate` (ISO 8601): Filter events ending before this date
- `limit` (number): Number of results (default: 10, max: 100)
- `offset` (number): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "evt_123456789",
      "name": "Summer Music Festival 2024",
      "slug": "summer-music-festival-2024",
      "description": "Annual music festival...",
      "status": "planning",
      "startDate": "2024-07-15T18:00:00Z",
      "endDate": "2024-07-17T23:00:00Z",
      "capacity": 50000,
      "venue": {
        "id": "ven_123",
        "name": "Central Park Amphitheater",
        "address": "New York, NY"
      },
      "project": {
        "id": "prj_456",
        "name": "Events Department",
        "workspace": {
          "id": "wrk_789",
          "name": "Entertainment Division"
        }
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### POST /events
Create a new event.

**Request Body:**
```json
{
  "name": "Summer Music Festival 2024",
  "slug": "summer-music-festival-2024",
  "description": "Annual music festival...",
  "projectId": "prj_456",
  "venueId": "ven_123",
  "startDate": "2024-07-15T18:00:00Z",
  "endDate": "2024-07-17T23:00:00Z",
  "capacity": 50000
}
```

### Procurement API

#### GET /procurement
Retrieve procurement requests.

**Query Parameters:**
- `status` (string): Filter by status (draft, pending, approved, rejected, completed)
- `category` (string): Filter by category (equipment, services, supplies, software)
- `requesterId` (string): Filter by requester
- `limit` (number): Number of results (default: 10, max: 100)
- `offset` (number): Pagination offset (default: 0)

#### POST /procurement
Create a new procurement request.

**Request Body:**
```json
{
  "title": "New Sound System Equipment",
  "description": "Professional audio equipment for main stage performances",
  "category": "equipment",
  "estimatedCost": 45000,
  "currency": "USD",
  "requesterId": "user_123",
  "priority": "high"
}
```

### Recruitment API

#### GET /recruitment/candidates
Retrieve job candidates.

**Query Parameters:**
- `status` (string): Filter by status (applied, screening, interviewed, offered, hired, rejected)
- `jobId` (string): Filter by job posting
- `experience` (string): Filter by experience level (entry, mid, senior, executive)
- `limit` (number): Number of results (default: 10, max: 100)
- `offset` (number): Pagination offset (default: 0)

#### POST /recruitment/candidates
Create a new candidate profile.

**Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex.johnson@email.com",
  "phone": "+1 (555) 123-4567",
  "currentPosition": "Software Engineer",
  "experience": 5,
  "skills": ["React", "TypeScript", "Node.js"],
  "location": "New York, NY"
}
```

### Content Management API

#### GET /content
Retrieve content items.

**Query Parameters:**
- `category` (string): Filter by category
- `status` (string): Filter by status (draft, review, published, archived)
- `type` (string): Filter by content type (document, image, video, audio)
- `authorId` (string): Filter by author
- `limit` (number): Number of results (default: 10, max: 100)
- `offset` (number): Pagination offset (default: 0)

#### POST /content
Upload new content.

**Request Body:**
```json
{
  "title": "Q1 Marketing Campaign Assets",
  "description": "Complete asset package for Q1 marketing campaign",
  "type": "archive",
  "fileName": "q1-marketing-assets.zip",
  "fileSize": 52428800,
  "mimeType": "application/zip",
  "tags": ["marketing", "campaign", "q1"],
  "category": "Marketing Assets"
}
```

## Workflow Endpoints

### Approval Workflows

#### GET /workflows/approvals
Retrieve approval workflows.

#### POST /workflows/approvals/{workflowId}/submit
Submit an item for approval.

**Request Body:**
```json
{
  "itemId": "content_123",
  "itemType": "content",
  "submitterId": "user_456",
  "metadata": {
    "priority": "high",
    "dueDate": "2024-02-01T00:00:00Z"
  }
}
```

#### POST /workflows/approvals/{approvalId}/decide
Make an approval decision.

**Request Body:**
```json
{
  "decision": "approved", // "approved" | "rejected" | "escalated"
  "comments": "Approved for technical requirements",
  "attachments": []
}
```

## Organization Management

### Users API

#### GET /organizations/{orgId}/users
Retrieve organization users.

#### POST /organizations/{orgId}/users
Invite a new user to the organization.

**Request Body:**
```json
{
  "email": "new.user@company.com",
  "role": "editor", // "viewer" | "editor" | "admin"
  "permissions": ["read", "write", "delete"]
}
```

### Teams API

#### GET /organizations/{orgId}/teams
Retrieve organization teams.

#### POST /organizations/{orgId}/teams
Create a new team.

**Request Body:**
```json
{
  "name": "Marketing Team",
  "description": "Handles all marketing activities",
  "members": ["user_123", "user_456"],
  "permissions": ["campaign:create", "content:publish"]
}
```

## Analytics & Reporting

### GET /analytics/events
Retrieve event analytics.

**Query Parameters:**
- `eventId` (string): Specific event ID
- `startDate` (ISO 8601): Start date for analytics
- `endDate` (ISO 8601): End date for analytics
- `metrics` (string[]): Metrics to include (attendance, revenue, engagement)

### GET /analytics/content
Retrieve content performance analytics.

**Query Parameters:**
- `contentId` (string): Specific content ID
- `startDate` (ISO 8601): Start date for analytics
- `endDate` (ISO 8601): End date for analytics
- `metrics` (string[]): Metrics to include (views, downloads, shares, engagement)

## Webhook Endpoints

### POST /webhooks/events
Receive event-related webhooks.

**Supported Events:**
- `event.created`
- `event.updated`
- `event.published`
- `event.cancelled`

### POST /webhooks/procurement
Receive procurement-related webhooks.

**Supported Events:**
- `procurement.submitted`
- `procurement.approved`
- `procurement.rejected`
- `procurement.completed`

## SDK & Integration

### JavaScript SDK

```javascript
import { OpusZero } from '@opuszero/sdk'

const client = new OpusZero({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.opuszero.com/v1'
})

// Example: Create an event
const event = await client.events.create({
  name: 'Summer Music Festival 2024',
  projectId: 'prj_456',
  startDate: '2024-07-15T18:00:00Z',
  endDate: '2024-07-17T23:00:00Z'
})
```

### Integration Examples

#### Zapier Integration
Connect OpusZero with 3,000+ apps via Zapier webhooks.

#### Slack Integration
```javascript
// Post approval notifications to Slack
await client.integrations.slack.postMessage({
  channel: '#approvals',
  text: 'New procurement request requires approval',
  attachments: [{
    title: 'Sound System Equipment',
    text: 'Estimated cost: $45,000',
    actions: [
      { text: 'Approve', type: 'button', value: 'approve' },
      { text: 'Reject', type: 'button', value: 'reject' }
    ]
  }]
})
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid request parameters |
| `AUTHENTICATION_ERROR` | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND_ERROR` | Resource not found |
| `RATE_LIMIT_ERROR` | Rate limit exceeded |
| `INTERNAL_ERROR` | Internal server error |

## Support

For API support or questions:
- **Documentation**: https://docs.opuszero.com
- **Developer Portal**: https://developers.opuszero.com
- **Support Email**: api-support@opuszero.com
- **Community Forum**: https://community.opuszero.com

## Changelog

### v1.0.0 (Current)
- Initial API release
- Core CRUD operations for all resources
- Workflow management endpoints
- Webhook support
- Rate limiting and authentication

### Upcoming Features
- GraphQL API support
- Real-time subscriptions
- Advanced analytics endpoints
- Bulk operations
- API versioning
