
/**
 * Database Service Layer
 * Centralized Supabase database access for the application
 * Replaces all mock data with real database queries
 */

import { supabase } from '../supabase'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface User {
  id: string
  auth_user_id: string
  organization_id: string
  email: string
  full_name: string
  avatar_url: string | null
  phone: string | null
  timezone: string | null
  locale: string | null
  settings: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  slug: string
  name: string
  legal_name: string | null
  description: string | null
  logo_url: string | null
  website: string | null
  email: string | null
  phone: string | null
  timezone: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  profile_type: string
  handle: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  visibility: string
  verified: boolean
  slug: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  slug: string
  project_id: string | null
  start_date: string | null
  end_date: string | null
  status: string
  created_at: string
}

export interface Project {
  id: string
  organization_id: string
  code: string
  name: string
  description: string | null
  phase: string
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  assigned_to: string | null
  created_by: string
  organization_id: string
  project_id: string | null
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  organization_id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  is_default: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  organization_id: string
  user_id: string
  type: string
  title: string
  body: string | null
  data: Record<string, unknown> | null
  action_url: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface Venue {
  id: string
  organization_id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  venue_type: string
  status: string
  address: VenueAddress
  coordinates: GeoCoordinates
  contact_info: ContactInfo
  business_hours: BusinessHours
  capacity: VenueCapacity
  area_sqft: number | null
  dimensions: string | null
  ceiling_height: string | null
  parking_info: ParkingInfo
  accessibility_features: AccessibilityFeatures
  technical_specs: TechnicalSpecs
  images: ImageAsset[]
  floor_plan_url: string | null
  virtual_tour_url: string | null
  featured: boolean
  rating: number | null
  review_count: number
  metadata: VenueMetadata
  created_at: string
  updated_at: string
}

export interface Space {
  id: string
  venue_id: string
  name: string
  slug: string
  description: string | null
  space_type: string
  status: string
  capacity: SpaceCapacity
  area_sqft: number | null
  dimensions: string | null
  ceiling_height: string | null
  floor_level: string | null
  accessibility: boolean
  technical_specs: TechnicalSpecs
  images: ImageAsset[]
  floor_plan_url: string | null
  virtual_tour_url: string | null
  pricing: PricingInfo
  setup_breakdown_times: SetupTimes
  restrictions: Restrictions
  features: Feature[]
  amenities: Amenity[]
  availability_notes: string | null
  featured: boolean
  sort_order: number
  metadata: SpaceMetadata
  created_at: string
  updated_at: string
}

export interface VenueFeature {
  id: string
  name: string
  description: string | null
  category: string | null
  icon: string | null
  sort_order: number
  active: boolean
  created_at: string
}

export interface VenueAmenity {
  id: string
  name: string
  description: string | null
  category: string | null
  icon: string | null
  sort_order: number
  active: boolean
  created_at: string
}

export interface VenueReview {
  id: string
  venue_id: string
  space_id: string | null
  user_id: string
  booking_id: string | null
  rating: number
  title: string | null
  content: string
  verified: boolean
  helpful_votes: number
  status: string
  response: string | null
  response_date: string | null
  response_by: string | null
  created_at: string
  updated_at: string
}

export interface Person {
  id: string
  organization_id: string
  first_name: string
  last_name: string
  display_name: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  title: string | null
  status: string
  created_at: string
  updated_at: string
}

// ============================================================================
// TYPE DEFINITIONS FOR VENUE AND SPACE DATA
// ============================================================================

export interface GeoCoordinates {
  latitude: number
  longitude: number
}

export interface VenueAddress {
  street: string
  city: string
  state: string
  zip_code: string
  country: string
}

export interface ContactInfo {
  phone?: string
  email?: string
  website?: string
}

export interface BusinessHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export interface VenueCapacity {
  min_guests?: number
  max_guests?: number
  standing_capacity?: number
  seated_capacity?: number
}

export interface ParkingInfo {
  available: boolean
  type?: string
  spaces?: number
  cost?: string
}

export interface AccessibilityFeatures {
  wheelchair_accessible: boolean
  elevator: boolean
  ramps: boolean
  accessible_restrooms: boolean
  hearing_assistance: boolean
  visual_assistance: boolean
}

export interface TechnicalSpecs {
  wifi_available: boolean
  internet_speed?: string
  sound_system: boolean
  lighting_system: boolean
  stage_available: boolean
  projector_available: boolean
}

export interface ImageAsset {
  id: string
  url: string
  alt_text?: string
  caption?: string
  sort_order: number
}

export interface VenueMetadata {
  established_year?: number
  awards?: string[]
  certifications?: string[]
  custom_fields?: Record<string, unknown>
}

export interface SpaceCapacity {
  min_guests?: number
  max_guests?: number
  standing_capacity?: number
  seated_capacity?: number
  theater_capacity?: number
  classroom_capacity?: number
}

export interface PricingInfo {
  hourly_rate?: number
  daily_rate?: number
  weekend_rate?: number
  setup_fee?: number
  cleanup_fee?: number
  minimum_hours?: number
}

export interface SetupTimes {
  setup_time_minutes: number
  breakdown_time_minutes: number
  buffer_time_minutes: number
}

export interface Restrictions {
  alcohol_allowed: boolean
  smoking_allowed: boolean
  outside_catering_allowed: boolean
  amplified_music_allowed: boolean
  age_restrictions?: string
}

export interface Feature {
  id: string
  name: string
  description?: string
  category: string
  icon?: string
  details?: Record<string, unknown>
}

export interface Amenity {
  id: string
  name: string
  description?: string
  category: string
  icon?: string
  details?: Record<string, unknown>
}

export interface SpaceMetadata {
  floor_level?: string
  ceiling_height_feet?: number
  load_in_instructions?: string
  custom_fields?: Record<string, unknown>
}

// ============================================================================
// DATABASE SERVICE CLASS
// ============================================================================

class DatabaseService {
  // --------------------------------------------------------------------------
  // USERS
  // --------------------------------------------------------------------------
  
  async getUsers(options?: { limit?: number; offset?: number; organizationId?: string }) {
    let query = supabase
      .from('platform_users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (options?.organizationId) {
      query = query.eq('organization_id', options.organizationId)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as User[]
  }

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('platform_users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as User
  }

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('platform_users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as User | null
  }

  async createUser(user: Partial<User>) {
    const { data, error } = await supabase
      .from('platform_users')
      .insert(user)
      .select()
      .single()
    
    if (error) throw error
    return data as User
  }

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('platform_users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as User
  }

  // --------------------------------------------------------------------------
  // ORGANIZATIONS
  // --------------------------------------------------------------------------

  async getOrganizations(options?: { limit?: number }) {
    let query = supabase
      .from('organizations')
      .select('*')
      .order('name')
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Organization[]
  }

  async getOrganizationById(id: string) {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Organization
  }

  async getOrganizationBySlug(slug: string) {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as Organization | null
  }

  // --------------------------------------------------------------------------
  // PROFILES
  // --------------------------------------------------------------------------

  async getProfiles(options?: { limit?: number; type?: string }) {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (options?.type) {
      query = query.eq('profile_type', options.type)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Profile[]
  }

  async getProfileById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Profile
  }

  async getProfileByHandle(handle: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as Profile | null
  }

  async getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as Profile | null
  }

  // --------------------------------------------------------------------------
  // EVENTS
  // --------------------------------------------------------------------------

  async getEvents(options?: { limit?: number; status?: string; projectId?: string }) {
    let query = supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })
    
    if (options?.status) {
      query = query.eq('status', options.status)
    }
    if (options?.projectId) {
      query = query.eq('project_id', options.projectId)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Event[]
  }

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Event
  }

  async getEventBySlug(slug: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as Event | null
  }

  async getUpcomingEvents(limit = 10) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit)
    
    if (error) throw error
    return data as Event[]
  }

  // --------------------------------------------------------------------------
  // PROJECTS
  // --------------------------------------------------------------------------

  async getProjects(options?: { limit?: number; organizationId?: string; phase?: string }) {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (options?.organizationId) {
      query = query.eq('organization_id', options.organizationId)
    }
    if (options?.phase) {
      query = query.eq('phase', options.phase)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Project[]
  }

  async getProjectById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Project
  }

  // --------------------------------------------------------------------------
  // TASKS
  // --------------------------------------------------------------------------

  async getTasks(options?: { 
    limit?: number
    organizationId?: string
    projectId?: string
    assignedTo?: string
    status?: string 
  }) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (options?.organizationId) {
      query = query.eq('organization_id', options.organizationId)
    }
    if (options?.projectId) {
      query = query.eq('project_id', options.projectId)
    }
    if (options?.assignedTo) {
      query = query.eq('assigned_to', options.assignedTo)
    }
    if (options?.status) {
      query = query.eq('status', options.status)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Task[]
  }

  async getTaskById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Task
  }

  async createTask(task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()
    
    if (error) throw error
    return data as Task
  }

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Task
  }

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }

  // --------------------------------------------------------------------------
  // WORKSPACES
  // --------------------------------------------------------------------------

  async getWorkspaces(options?: { organizationId?: string; limit?: number }) {
    let query = supabase
      .from('workspaces')
      .select('*')
      .eq('is_archived', false)
      .order('name')
    
    if (options?.organizationId) {
      query = query.eq('organization_id', options.organizationId)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Workspace[]
  }

  async getWorkspaceById(id: string) {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Workspace
  }

  // --------------------------------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------------------------------

  async getNotifications(options?: { userId?: string; unreadOnly?: boolean; limit?: number }) {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (options?.userId) {
      query = query.eq('user_id', options.userId)
    }
    if (options?.unreadOnly) {
      query = query.eq('is_read', false)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Notification[]
  }

  async markNotificationRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Notification
  }

  async markAllNotificationsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false)
    
    if (error) throw error
    return true
  }

  // --------------------------------------------------------------------------
  // VENUES
  // --------------------------------------------------------------------------

  async getVenues(options?: {
    limit?: number
    organizationId?: string
    venueType?: string
    featured?: boolean
    status?: string
  }) {
    let query = supabase
      .from('venues')
      .select('*')
      .order('featured', { ascending: false })
      .order('name')

    if (options?.organizationId) {
      query = query.eq('organization_id', options.organizationId)
    }
    if (options?.venueType) {
      query = query.eq('venue_type', options.venueType)
    }
    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured)
    }
    if (options?.status) {
      query = query.eq('status', options.status)
    } else {
      query = query.eq('status', 'active')
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Venue[]
  }

  async getVenueById(id: string) {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Venue
  }

  async getVenueBySlug(slug: string, organizationId?: string) {
    let query = supabase
      .from('venues')
      .select('*')
      .eq('slug', slug)

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    const { data, error } = await query.single()
    if (error && error.code !== 'PGRST116') throw error
    return data as Venue | null
  }

  async getVenueSpaces(venueId: string, options?: { status?: string }) {
    let query = supabase
      .from('spaces')
      .select(`
        *,
        space_features(feature_id, details, venue_features(name, description, category, icon)),
        space_amenities(amenity_id, details, venue_amenities(name, description, category, icon))
      `)
      .eq('venue_id', venueId)
      .order('sort_order')
      .order('name')

    if (options?.status) {
      query = query.eq('status', options.status)
    } else {
      query = query.eq('status', 'active')
    }

    const { data, error } = await query
    if (error) throw error
    return data as (Space & {
      space_features: Array<{
        feature_id: string
        details: Record<string, unknown>
        venue_features: {
          name: string
          description: string | null
          category: string | null
          icon: string | null
        }
      }>
      space_amenities: Array<{
        amenity_id: string
        details: Record<string, unknown>
        venue_amenities: {
          name: string
          description: string | null
          category: string | null
          icon: string | null
        }
      }>
    })[]
  }

  async getSpaceById(id: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select(`
        *,
        venues(*),
        space_features(feature_id, details, venue_features(name, description, category, icon)),
        space_amenities(amenity_id, details, venue_amenities(name, description, category, icon))
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Space & {
      venues: Venue
      space_features: Array<{
        feature_id: string
        details: Record<string, unknown>
        venue_features: {
          name: string
          description: string | null
          category: string | null
          icon: string | null
        }
      }>
      space_amenities: Array<{
        amenity_id: string
        details: Record<string, unknown>
        venue_amenities: {
          name: string
          description: string | null
          category: string | null
          icon: string | null
        }
      }>
    }
  }

  async getSpaceBySlug(venueId: string, slug: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select(`
        *,
        venues(*),
        space_features(feature_id, details, venue_features(name, description, category, icon)),
        space_amenities(amenity_id, details, venue_amenities(name, description, category, icon))
      `)
      .eq('venue_id', venueId)
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as (Space & {
      venues: Venue
      space_features: Array<{
        feature_id: string
        details: Record<string, unknown>
        venue_features: {
          name: string
          description: string | null
          category: string | null
          icon: string | null
        }
      }>
      space_amenities: Array<{
        amenity_id: string
        details: Record<string, unknown>
        venue_amenities: {
          name: string
          description: string | null
          category: string | null
          icon: string | null
        }
      }>
    }) | null
  }

  async getVenueReviews(venueId: string, options?: { limit?: number; status?: string }) {
    let query = supabase
      .from('venue_reviews')
      .select(`
        *,
        users(first_name, last_name, avatar_url)
      `)
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })

    if (options?.status) {
      query = query.eq('status', options.status)
    } else {
      query = query.eq('status', 'published')
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data as (VenueReview & {
      users: { first_name: string; last_name: string; avatar_url: string | null }
    })[]
  }

  // --------------------------------------------------------------------------
  // PEOPLE (legend_people)
  // --------------------------------------------------------------------------

  async getPeople(options?: { organizationId?: string; limit?: number }) {
    let query = supabase
      .from('legend_people')
      .select('*')
      .order('display_name')
    
    if (options?.organizationId) {
      query = query.eq('organization_id', options.organizationId)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Person[]
  }

  async getPersonById(id: string) {
    const { data, error } = await supabase
      .from('legend_people')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Person
  }

  // --------------------------------------------------------------------------
  // GENERIC QUERY HELPERS
  // --------------------------------------------------------------------------

  async query<T>(table: string, options?: {
    select?: string
    filters?: Record<string, unknown>
    order?: { column: string; ascending?: boolean }
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from(table)
      .select(options?.select || '*')
    
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    if (options?.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending ?? true })
    }
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as T[]
  }

  async getById<T>(table: string, id: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as T
  }

  async insert<T>(table: string, record: Partial<T>) {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select()
      .single()
    
    if (error) throw error
    return data as T
  }

  async update<T>(table: string, id: string, updates: Partial<T>) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as T
  }

  async delete(table: string, id: string) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Export for direct Supabase access when needed
export { supabase }
