This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required environment variables:

   - **Database**: Set up a Supabase project and add the connection URL and keys
   - **Supabase**: Get your project URL and anon key from Supabase dashboard
   - **Stripe**: Create a Stripe account and get your publishable and secret keys
   - **Resend**: Sign up for Resend and get your API key
   - **Sentry**: Create a Sentry project and get your DSN and auth token
   - **NextAuth**: Generate a secure secret for authentication
   - **OpenAI**: Get your API key from OpenAI
   - **Google Calendar**: Set up Google Cloud project for calendar integration

### Installation

```bash
npm install
```

### Database Setup

1. Install Prisma CLI if not already installed:
   ```bash
   npm install -g prisma
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Run database migrations:
   ```bash
   npx prisma db push
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing

Run end-to-end tests with Playwright:

```bash
npm run test:e2e
```

Run tests with UI mode:

```bash
npm run test:e2e:ui
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Services Integration

This project integrates with the following services:

- **Supabase**: Database and authentication
- **Stripe**: Payment processing
- **Resend**: Email sending
- **Sentry**: Error tracking and monitoring
- **Playwright**: End-to-end testing
- **Vercel**: Deployment platform

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## G H X S T S H I P ATLVS 3.0 Integration

This project includes comprehensive integration with the G H X S T S H I P ATLVS 3.0 data model, providing support for ALL types of productions and events across the entertainment industry.

### Overview

The ATLVS 3.0 integration supports 61 different production types including:

- **Music Productions**: Festivals, concerts, symphonies, operas, ballets, jazz clubs
- **Performing Arts**: Theater plays, musicals, comedy shows, magic, circus, cabaret
- **Immersive Experiences**: VR/AR experiences, escape rooms, interactive art installations
- **Conferences & Professional**: Conferences, trade shows, workshops, panel discussions
- **Corporate Events**: Corporate meetings, product launches, awards ceremonies, networking
- **Ceremonies**: Weddings, graduations, funerals, anniversaries, religious services
- **Attractions**: Theme parks, museums, art galleries, sporting events
- **Tours**: Concert tours, theater tours, exhibition tours, roadshows
- **Specialty Events**: Fashion shows, beauty pageants, film festivals, cultural celebrations

### Data Structure

#### Core Models
- **Events**: All production types with comprehensive metadata
- **Venues**: Physical locations with capacity, features, and location data
- **Artists**: Performers with booking tiers, social links, and genres
- **Genres**: Hierarchical genre taxonomy (41 genres with parent-child relationships)
- **Regions**: Geographic locations (20 regions across Florida and major markets)

#### API Endpoints

All G H X S T S H I P data is accessible via REST APIs:

```typescript
// Events API
GET /api/v1/ghxstship/events - List events with filtering
GET /api/v1/ghxstship/events/[id] - Get specific event
POST /api/v1/ghxstship/events - Create new event

// Venues API
GET /api/v1/ghxstship/venues - List venues with filtering
GET /api/v1/ghxstship/venues/[id] - Get specific venue

// Artists API
GET /api/v1/ghxstship/artists - List artists with filtering
GET /api/v1/ghxstship/artists/[id] - Get specific artist
```

#### Query Parameters

```typescript
// Events filtering
GET /api/v1/ghxstship/events?type=upcoming&limit=10
GET /api/v1/ghxstship/events?venueId=ven_001
GET /api/v1/ghxstship/events?search=festival

// Venues filtering
GET /api/v1/ghxstship/venues?type=arena&region=FL
GET /api/v1/ghxstship/venues?search=miami

// Artists filtering
GET /api/v1/ghxstship/artists?genre=electronic&tier=headliner
GET /api/v1/ghxstship/artists?search=tiesto
```

### Frontend Integration

#### React Hooks

```typescript
import { useMockEvents, useMockVenues, useMockArtists } from '@/lib/mock-data'

// Use in components
function EventList() {
  const { events, upcomingEvents, featuredEvents, loading, error } = useMockEvents()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <p>{event.venue.name} - {event.venue.location.city}</p>
          <span>{event.status}</span>
        </div>
      ))}
    </div>
  )
}
```

#### TypeScript Types

```typescript
import type {
  EventMock,
  VenueMock,
  ArtistMock,
  EventStatus,
  BookingTier
} from '@/lib/types/ghxstship'

// Full type safety across the application
interface EventCardProps {
  event: EventMock
  onSelect?: (event: EventMock) => void
}
```

### Database Schema

The system uses a clean, normalized database schema with proper 3NF relationships:

- **Venue Types** (15 types): Island destinations, arenas, theaters, etc.
- **Event Types** (61 types): Comprehensive coverage of all production types
- **Genres** (41 genres): Hierarchical structure with parent-child relationships
- **Regions** (20 regions): Geographic coverage for events and venues
- **Ticket Tiers** (9 types): GA, VIP, Platinum, etc. with pricing multipliers

### Development Features

#### Mock Data System
- **Realistic Test Data**: Pre-populated with sample events, venues, and artists
- **Search & Filtering**: Full-text search across all entities
- **React Hooks**: Easy integration with Next.js components
- **Type Safety**: Complete TypeScript definitions

#### Example Usage

```typescript
// Get upcoming events
const upcomingEvents = getMockUpcomingEvents()

// Search for electronic music events
const electronicEvents = searchMockEvents('electronic')

// Get all venues in Florida
const floridaVenues = getMockVenues().filter(v => v.location.state === 'FL')

// Find headliner artists
const headliners = getMockArtistsByGenre('Electronic').filter(a => a.bookingTier === 'HEADLINER')
```

### Seed Data

The project includes comprehensive seed data with:

- **25 Sample Events**: Covering music festivals, theater, conferences, corporate events, etc.
- **Sample Venues**: Test venues with realistic capacity and features
- **Artist Data**: Test artists with booking tiers and social links
- **Geographic Coverage**: Events across Florida and major markets

### Architecture Benefits

1. **Single Source of Truth**: All production data normalized in clean relational structure
2. **Extensible**: Easy to add new production types, venues, or regions
3. **Type Safe**: Full TypeScript coverage prevents runtime errors
4. **API First**: RESTful APIs enable integration with any frontend
5. **Mock Ready**: Comprehensive mock data for development and testing

### Integration Examples

#### Event Listing Component
```tsx
'use client'

import { useMockEvents } from '@/lib/mock-data'

export function EventListing() {
  const { events, loading } = useMockEvents()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <div key={event.id} className="border rounded-lg p-4">
          <h3 className="font-bold text-lg">{event.name}</h3>
          <p className="text-gray-600">{event.type}</p>
          <p className="text-sm">{event.venue.name}</p>
          <div className="mt-2">
            {event.headliners.map(artist => (
              <span key={artist} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1">
                {artist}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

#### Venue Management
```tsx
'use client'

import { useMockVenues } from '@/lib/mock-data'

export function VenueManagement() {
  const { venues } = useMockVenues()

  return (
    <div className="space-y-4">
      {venues.map(venue => (
        <div key={venue.id} className="flex justify-between items-center border-b pb-2">
          <div>
            <h4 className="font-semibold">{venue.name}</h4>
            <p className="text-sm text-gray-600">
              {venue.location.city}, {venue.location.state} • Capacity: {venue.capacity.general}
            </p>
            <div className="flex gap-1 mt-1">
              {venue.features.map(feature => (
                <span key={feature} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          <span className="text-sm font-medium">{venue.type}</span>
        </div>
      ))}
    </div>
  )
}
```

### File Structure

```
src/
├── app/api/v1/ghxstship/
│   ├── events/
│   │   ├── route.ts          # Events CRUD API
│   │   └── [id]/route.ts     # Individual event API
│   ├── venues/
│   │   ├── route.ts          # Venues API
│   │   └── [id]/route.ts     # Individual venue API
│   └── artists/
│       ├── route.ts          # Artists API
│       └── [id]/route.ts     # Individual artist API
├── components/events/
│   └── EventManager.tsx      # Event management UI
├── lib/
│   ├── mock-data.ts          # Mock data utilities and hooks
│   └── types/ghxstship.ts    # TypeScript type definitions
└── prisma/
    ├── atlvs-seed-data.ts    # Comprehensive seed data
    └── ghxstship-schema.prisma # G H X S T S H I P database schema
```

This integration provides a solid foundation for building comprehensive event management and production tracking systems across all entertainment industry segments.
