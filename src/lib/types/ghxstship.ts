
// ============================================================================
// G H X S T S H I P ATLVS 3.0 TypeScript Type Definitions
// Comprehensive type definitions for venues, events, artists, and related data
// ============================================================================

// ============================================================================
// BASE TYPES AND ENUMS
// ============================================================================

export type VenueTypeCode =
  | 'ISLAND_DEST'
  | 'MULTI_CITY'
  | 'HYBRID_CONCEPT'
  | 'FESTIVAL_GROUNDS'
  | 'STADIUM'
  | 'BEACH_VENUE'
  | 'PARK'
  | 'SPEEDWAY'
  | 'CONVENTION'
  | 'RESORT'
  | 'CAMPING_GROUNDS'

export type EventTypeCode =
  | 'MUSIC_FEST'
  | 'EDM_FEST'
  | 'ROCK_FEST'
  | 'COUNTRY_FEST'
  | 'HIP_HOP_FEST'
  | 'MULTI_GENRE'
  | 'DAY_CLUB'
  | 'SUPPER_CLUB'
  | 'IMMERSIVE_EXP'
  | 'CAMPING_FEST'
  | 'BEACH_FEST'

export type StageType =
  | 'MAIN_STAGE'
  | 'SECONDARY'
  | 'TERTIARY'
  | 'ACTIVATION'
  | 'VIP'
  | 'SPECIALTY'

export type BookingTier =
  | 'HEADLINER'
  | 'SUPPORT'
  | 'FEATURED'

export type TicketTierTypeCode =
  | 'GA'
  | 'GA_PLUS'
  | 'VIP'
  | 'SUPER_VIP'
  | 'PLATINUM'
  | 'DAY_PASS'
  | 'CAMPING'
  | 'CABANA'
  | 'OWNER_CLUB'

export type EventStatus =
  | 'planning'
  | 'on_sale'
  | 'sold_out'
  | 'completed'
  | 'cancelled'

export type VenueStatus =
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'closed'

// ============================================================================
// VENUE TYPES
// ============================================================================

export interface VenueType {
  id: string
  code: VenueTypeCode
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Venue {
  id: string
  code: string
  name: string
  venueTypeId: string
  organizationId?: string
  addressLine1?: string
  city: string
  state: string
  postalCode?: string
  country: string
  latitude?: number
  longitude?: number
  capacityGeneral?: number
  capacityVip?: number
  acreage?: number
  isIndoor: boolean
  isOutdoor: boolean
  hasCamping: boolean
  hasRvHookups: boolean
  parkingCapacity?: number
  website?: string
  conservationFocus?: string
  signatureExperiences?: string[] // Array of experience strings
  physicalNotes?: string
  status: VenueStatus
  createdAt: Date
  updatedAt: Date

  // Relations
  venueType: VenueType
  organization?: Organization
  stages: VenueStage[]
  events: Event[]
}

export interface VenueStage {
  id: string
  venueId: string
  code: string
  name: string
  stageType: StageType
  capacity?: number
  isIndoor: boolean
  hasRoof: boolean
  description?: string
  createdAt: Date
  updatedAt: Date

  // Relations
  venue: Venue
  lineup: EventLineup[]
}

// Frontend-friendly venue interface
export interface VenueMock {
  id: string
  code: string
  name: string
  type: string
  location: {
    city: string
    state: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  capacity: {
    general?: number
    vip?: number
  }
  features: string[]
  image?: string
  description?: string
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface EventType {
  id: string
  code: EventTypeCode
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  code: string
  name: string
  eventTypeId: string
  venueId?: string
  organizationId?: string
  regionId?: string
  editionNumber?: number
  editionYear?: number
  startDate: Date
  endDate: Date
  doorsTime?: string
  endTime?: string
  ageRestriction?: number
  isCampingEvent: boolean
  expectedAttendance?: number
  actualAttendance?: number
  website?: string
  hashtag?: string
  status: EventStatus
  producerOrgId?: string
  headliners?: string[] // Array of headliner names for quick access
  keyFeatures?: string[] // Array of feature strings
  createdAt: Date
  updatedAt: Date

  // Relations
  eventType: EventType
  venue?: Venue
  region?: Region
  organization?: Organization
  genres: EventGenre[]
  ticketTiers: EventTicketTier[]
  lineup: EventLineup[]
}

export interface EventGenre {
  id: string
  eventId: string
  genreId: string
  isPrimary: boolean

  // Relations
  event: Event
  genre: Genre
}

export interface EventTicketTier {
  id: string
  eventId: string
  tierTypeId: string
  name: string
  priceUsd: number
  quantityAvailable?: number
  saleStartDate?: Date
  saleEndDate?: Date
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  // Relations
  event: Event
  tierType: TicketTierType
}

export interface EventLineup {
  id: string
  eventId: string
  artistId: string
  stageId?: string
  performanceDate: Date
  setStartTime?: string
  setEndTime?: string
  setType?: string // DJ, LIVE, PERFORMANCE
  billingOrder?: number // 1 = headliner, higher numbers = lower billing
  isHeadliner: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date

  // Relations
  event: Event
  artist: Artist
  stage?: VenueStage
}

// Frontend-friendly event interface (no mock data)
export interface EventFrontend {
  id: string
  name: string
  code: string
  type: string
  venue: VenueFrontend
  dates: {
    start: Date
    end: Date
  }
  genres: string[]
  headliners: string[]
  expectedAttendance: number
  ticketTiers: TicketTierFrontend[]
  status: EventStatus
  features: string[]
  image?: string
  website?: string
  hashtag?: string
}

// Frontend-friendly ticket tier interface (no mock data)
export interface TicketTierFrontend {
  id: string
  name: string
  price: number
  currency: string
  type: string
  available: number
  description?: string
}

// ============================================================================
// ARTIST TYPES
// ============================================================================

export interface Artist {
  id: string
  code: string
  name: string
  primaryGenreId?: string
  bookingTier?: BookingTier
  agency?: string
  hometownCity?: string
  hometownState?: string
  hometownCountry: string
  website?: string
  instagramHandle?: string
  spotifyId?: string
  bookingRate?: number
  bookingRateMax?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  // Relations
  primaryGenre?: Genre
  lineup: EventLineup[]
}

// Frontend-friendly artist interface
export interface ArtistMock {
  id: string
  name: string
  genre: string
  bookingTier: BookingTier
  image?: string
  bio?: string
  socialLinks?: {
    instagram?: string
    spotify?: string
    website?: string
  }
}

// ============================================================================
// GENRE AND REGION TYPES
// ============================================================================

export interface Genre {
  id: string
  code: string
  name: string
  parentGenreId?: string
  description?: string
  createdAt: Date
  updatedAt: Date

  // Relations
  parentGenre?: Genre
  subGenres: Genre[]
  eventGenres: EventGenre[]
  artists: Artist[]
}

export interface Region {
  id: string
  code: string
  name: string
  state?: string
  country: string
  createdAt: Date
  updatedAt: Date

  // Relations
  venues: Venue[]
  events: Event[]
}

// ============================================================================
// TICKET TIER TYPES
// ============================================================================

export interface TicketTierType {
  id: string
  code: TicketTierTypeCode
  name: string
  description?: string
  typicalPriceMultiplier: number
  createdAt: Date
  updatedAt: Date

  // Relations
  eventTicketTiers: EventTicketTier[]
}

// ============================================================================
// ORGANIZATION TYPES
// ============================================================================

export interface Organization {
  id: string
  code: string
  name: string
  legalName?: string
  orgType: string // OPERATOR, PRODUCER, NONPROFIT, OWNER
  website?: string
  foundedYear?: number
  headquartersCity?: string
  headquartersState?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  // Relations
  venues: Venue[]
  events: Event[]
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, any>
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  meta?: Record<string, any>
}

export interface EventsApiResponse extends ApiResponse<EventMock[]> {
  total: number
  meta: {
    type?: string
    venueId?: string
    search?: string
    limit: number
  }
}

export interface VenuesApiResponse extends ApiResponse<VenueMock[]> {
  total: number
  meta: {
    type?: string
    region?: string
    search?: string
    limit: number
  }
}

export interface ArtistsApiResponse extends ApiResponse<ArtistMock[]> {
  total: number
  meta: {
    genre?: string
    tier?: BookingTier
    search?: string
    limit: number
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type EventWithVenue = Event & {
  venue: Venue
}

export type EventWithDetails = Event & {
  venue: Venue
  genres: (EventGenre & { genre: Genre })[]
  ticketTiers: (EventTicketTier & { tierType: TicketTierType })[]
  lineup: (EventLineup & { artist: Artist; stage?: VenueStage })[]
}

export type VenueWithEvents = Venue & {
  events: Event[]
}

export type ArtistWithEvents = Artist & {
  lineup: (EventLineup & { event: Event; stage?: VenueStage })[]
}

// ============================================================================
// FORM AND INPUT TYPES
// ============================================================================

export interface CreateEventInput {
  name: string
  code: string
  eventTypeId: string
  venueId?: string
  startDate: Date
  endDate: Date
  description?: string
  expectedAttendance?: number
  ageRestriction?: number
  website?: string
  hashtag?: string
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string
  status?: EventStatus
}

export interface CreateVenueInput {
  name: string
  code: string
  venueTypeId: string
  addressLine1?: string
  city: string
  state: string
  postalCode?: string
  capacityGeneral?: number
  capacityVip?: number
  website?: string
  description?: string
}

export interface CreateArtistInput {
  name: string
  code: string
  primaryGenreId?: string
  bookingTier?: BookingTier
  agency?: string
  hometownCity?: string
  hometownState?: string
  website?: string
  instagramHandle?: string
  spotifyId?: string
}

// ============================================================================
// FILTER AND SEARCH TYPES
// ============================================================================

export interface EventFilters {
  type?: EventTypeCode[]
  venueId?: string[]
  regionId?: string[]
  status?: EventStatus[]
  startDateFrom?: Date
  startDateTo?: Date
  genres?: string[]
  ageRestriction?: number
  hasCamping?: boolean
}

export interface VenueFilters {
  type?: VenueTypeCode[]
  regionId?: string[]
  capacityMin?: number
  capacityMax?: number
  hasCamping?: boolean
  features?: string[]
}

export interface ArtistFilters {
  genreId?: string[]
  bookingTier?: BookingTier[]
  agency?: string[]
  isActive?: boolean
  bookingRateMin?: number
  bookingRateMax?: number
}

export interface SearchOptions {
  query: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// ANALYTICS AND REPORTING TYPES
// ============================================================================

export interface EventAnalytics {
  eventId: string
  totalTicketsSold: number
  totalRevenue: number
  averageTicketPrice: number
  attendanceRate: number // actual / expected
  topSellingTicketTiers: Array<{
    tierId: string
    tierName: string
    ticketsSold: number
    revenue: number
  }>
  dailySales: Array<{
    date: Date
    ticketsSold: number
    revenue: number
  }>
}

export interface VenueAnalytics {
  venueId: string
  totalEvents: number
  totalAttendance: number
  averageEventSize: number
  utilizationRate: number // percentage of time venue is in use
  topGenres: Array<{
    genreId: string
    genreName: string
    eventCount: number
  }>
  revenueByEventType: Array<{
    eventTypeId: string
    eventTypeName: string
    totalRevenue: number
    eventCount: number
  }>
}

export interface ArtistAnalytics {
  artistId: string
  totalPerformances: number
  totalEvents: number
  averageBookingRate: number
  performanceHistory: Array<{
    eventId: string
    eventName: string
    performanceDate: Date
    billingOrder: number
    isHeadliner: boolean
  }>
  genreDistribution: Array<{
    genreId: string
    genreName: string
    performanceCount: number
  }>
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================
// Individual exports are sufficient, default export removed due to type/value mixing issues
