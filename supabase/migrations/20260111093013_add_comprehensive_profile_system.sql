-- Add comprehensive profile system for ATLVS + GVTEWAY super app
-- Migration: 20260111093013_add_comprehensive_profile_system

-- ============================================================================
-- MULTI-PROFILE ARCHITECTURE (Core Foundation)
-- ============================================================================

-- Base profile table (SSOT for all profile types)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL UNIQUE,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('member', 'professional', 'creator', 'brand', 'experience', 'destination')),
  handle TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  verified BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  slug TEXT NOT NULL UNIQUE,
  seo_title TEXT,
  seo_description TEXT,
  billing_tier_id TEXT,
  billing_status TEXT NOT NULL DEFAULT 'free' CHECK (billing_status IN ('free', 'trial', 'active', 'suspended')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_profiles_billing_tier FOREIGN KEY (billing_tier_id) REFERENCES billing_tiers(id)
);

-- Profile relationship system (manages, hosts, owns, employs, follows, etc.)
CREATE TABLE profile_relationships (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  source_profile_id TEXT NOT NULL,
  target_profile_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'ended')),
  permissions JSONB,
  metadata JSONB,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_profile_relationships_source FOREIGN KEY (source_profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_profile_relationships_target FOREIGN KEY (target_profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT unique_profile_relationship UNIQUE (source_profile_id, target_profile_id, relationship_type)
);

-- Billing tiers system
CREATE TABLE billing_tiers (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('member', 'professional', 'creator', 'brand', 'experience', 'destination')),
  price DECIMAL(10,2) NOT NULL, -- Price in cents
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL DEFAULT 'month' CHECK (interval IN ('month', 'year', 'lifetime')),
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- MEMBER PROFILE (Consumer/Social)
-- ============================================================================

CREATE TABLE member_profiles (
  profile_id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TIMESTAMP WITH TIME ZONE,
  gender TEXT,
  interests JSONB,
  favorite_genres JSONB,
  favorite_artists JSONB,
  events_attended INTEGER NOT NULL DEFAULT 0,
  member_since TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  loyalty_tier_id TEXT,
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  privacy_settings JSONB,
  notification_prefs JSONB,
  CONSTRAINT fk_member_profiles_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_member_profiles_loyalty_tier FOREIGN KEY (loyalty_tier_id) REFERENCES loyalty_tiers(id)
);

-- Loyalty tiers for members
CREATE TABLE loyalty_tiers (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  min_points INTEGER NOT NULL DEFAULT 0,
  benefits JSONB NOT NULL DEFAULT '[]',
  perks JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- ============================================================================
-- PROFESSIONAL PROFILE (LinkedIn-Style Career)
-- ============================================================================

CREATE TABLE professional_profiles (
  profile_id TEXT PRIMARY KEY,
  headline TEXT,
  summary TEXT,
  current_position_id TEXT,
  current_company_id TEXT,
  years_experience INTEGER,
  specializations JSONB,
  skills JSONB,
  certifications JSONB,
  union_memberships JSONB,
  equipment_owned JSONB,
  travel_radius INTEGER,
  willing_to_travel BOOLEAN NOT NULL DEFAULT false,
  day_rate_min DECIMAL(10,2),
  day_rate_max DECIMAL(10,2),
  availability JSONB,
  open_to_work BOOLEAN NOT NULL DEFAULT false,
  open_to_hire BOOLEAN NOT NULL DEFAULT false,
  background_check BOOLEAN NOT NULL DEFAULT false,
  references JSONB,
  CONSTRAINT fk_professional_profiles_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Professional experience history
CREATE TABLE professional_experience (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profile_id TEXT NOT NULL,
  position_title TEXT NOT NULL,
  company_name TEXT,
  company_profile_id TEXT,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  highlights JSONB,
  event_credits JSONB,
  is_current BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_professional_experience_profile FOREIGN KEY (profile_id) REFERENCES professional_profiles(profile_id) ON DELETE CASCADE
);

-- Professional education
CREATE TABLE professional_education (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profile_id TEXT NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_professional_education_profile FOREIGN KEY (profile_id) REFERENCES professional_profiles(profile_id) ON DELETE CASCADE
);

-- Professional portfolio
CREATE TABLE professional_portfolio (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profile_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'document', 'link')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  event_id TEXT,
  collaborators JSONB,
  tags JSONB,
  featured BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_professional_portfolio_profile FOREIGN KEY (profile_id) REFERENCES professional_profiles(profile_id) ON DELETE CASCADE
);

-- ============================================================================
-- CREATOR PROFILE (Artists/Ambassadors/Influencers)
-- ============================================================================

-- Ambassador tiers
CREATE TABLE ambassador_tiers (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  requirements JSONB,
  benefits JSONB,
  commission DECIMAL(5,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

CREATE TABLE creator_profiles (
  profile_id TEXT PRIMARY KEY,
  creator_type TEXT NOT NULL CHECK (creator_type IN ('artist', 'ambassador', 'influencer')),
  stage_name TEXT,
  real_name TEXT,
  genres JSONB,
  subgenres JSONB,
  style_tags JSONB,
  bio_short TEXT,
  bio_long TEXT,
  origin_location TEXT,
  based_location TEXT,
  active_since INTEGER,
  label TEXT,
  management_id TEXT,
  booking_contact TEXT,
  press_contact TEXT,
  booking_rate DECIMAL(10,2),
  booking_rate_max DECIMAL(10,2),
  rider_url TEXT,
  epk_url TEXT,
  accepting_bookings BOOLEAN NOT NULL DEFAULT false,
  affiliate_code TEXT UNIQUE,
  affiliate_rate DECIMAL(5,2),
  ambassador_tier_id TEXT,
  follower_count INTEGER NOT NULL DEFAULT 0,
  external_followers JSONB,
  verified_artist BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_creator_profiles_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_creator_profiles_management FOREIGN KEY (management_id) REFERENCES profiles(id),
  CONSTRAINT fk_creator_profiles_ambassador_tier FOREIGN KEY (ambassador_tier_id) REFERENCES ambassador_tiers(id)
);

-- Creator media management
CREATE TABLE creator_media (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profile_id TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video', 'audio', 'document')),
  category TEXT CHECK (category IN ('promo', 'press', 'live', 'behind_scenes')),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  dimensions TEXT,
  file_size INTEGER,
  is_downloadable BOOLEAN NOT NULL DEFAULT false,
  download_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  tags JSONB,
  credits JSONB,
  usage_rights TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_creator_media_profile FOREIGN KEY (profile_id) REFERENCES creator_profiles(profile_id) ON DELETE CASCADE
);

-- Creator music/content releases
CREATE TABLE creator_releases (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profile_id TEXT NOT NULL,
  release_type TEXT NOT NULL CHECK (release_type IN ('single', 'ep', 'album', 'mixtape')),
  title TEXT NOT NULL,
  release_date DATE NOT NULL,
  artwork_url TEXT,
  label TEXT,
  catalog_number TEXT,
  streaming_links JSONB,
  purchase_links JSONB,
  tracklist JSONB,
  credits JSONB,
  description TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_creator_releases_profile FOREIGN KEY (profile_id) REFERENCES creator_profiles(profile_id) ON DELETE CASCADE
);

-- Creator performance history
CREATE TABLE creator_events (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profile_id TEXT NOT NULL,
  event_id TEXT,
  event_name TEXT,
  venue_name TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type TEXT,
  headline BOOLEAN NOT NULL DEFAULT false,
  billing_position INTEGER,
  set_time TIMESTAMP WITH TIME ZONE,
  set_duration INTEGER,
  attendance INTEGER,
  photos JSONB,
  videos JSONB,
  verified BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_creator_events_profile FOREIGN KEY (profile_id) REFERENCES creator_events(profile_id) ON DELETE CASCADE
);

-- Creator affiliate tracking
CREATE TABLE creator_affiliate_stats (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profile_id TEXT NOT NULL,
  period DATE NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  revenue_generated DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  top_products JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_creator_affiliate_stats_profile FOREIGN KEY (profile_id) REFERENCES creator_profiles(profile_id) ON DELETE CASCADE,
  CONSTRAINT unique_creator_affiliate_period UNIQUE (profile_id, period)
);

-- ============================================================================
-- BRAND PROFILE (Organizations/Companies/Promoters)
-- ============================================================================

CREATE TABLE brand_profiles (
  profile_id TEXT PRIMARY KEY,
  brand_type TEXT NOT NULL CHECK (brand_type IN ('promoter', 'venue_group', 'agency', 'production_co', 'brand', 'media', 'other')),
  legal_name TEXT,
  dba_name TEXT,
  entity_type TEXT CHECK (entity_type IN ('LLC', 'Corp', 'Partnership', 'Sole Prop')),
  tax_id TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  description TEXT NOT NULL,
  mission TEXT,
  values JSONB,
  industry_tags JSONB,
  service_areas JSONB,
  employee_count TEXT,
  annual_revenue TEXT,
  events_per_year TEXT,
  insurance_info JSONB,
  w9_on_file BOOLEAN NOT NULL DEFAULT false,
  payment_terms TEXT,
  organization_id TEXT,
  CONSTRAINT fk_brand_profiles_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Brand team members
CREATE TABLE brand_team_members (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  brand_id TEXT NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_brand_team_members_brand FOREIGN KEY (brand_id) REFERENCES brand_profiles(profile_id) ON DELETE CASCADE
);

-- Brand portfolio/case studies
CREATE TABLE brand_portfolio (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  brand_id TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('event', 'venue', 'campaign', 'client')),
  title TEXT NOT NULL,
  client TEXT,
  date TEXT,
  location TEXT,
  description TEXT NOT NULL,
  results TEXT,
  media JSONB,
  testimonial TEXT,
  case_study_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  tags JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_brand_portfolio_brand FOREIGN KEY (brand_id) REFERENCES brand_profiles(profile_id) ON DELETE CASCADE
);

-- Brand services catalog
CREATE TABLE brand_services (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  brand_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB,
  pricing_model TEXT NOT NULL DEFAULT 'contact' CHECK (pricing_model IN ('fixed', 'hourly', 'custom', 'contact')),
  price_from DECIMAL(10,2),
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_brand_services_brand FOREIGN KEY (brand_id) REFERENCES brand_profiles(profile_id) ON DELETE CASCADE
);

-- Brand job postings
CREATE TABLE brand_job_postings (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  brand_id TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT,
  employment_type TEXT NOT NULL DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract')),
  location_type TEXT NOT NULL DEFAULT 'onsite' CHECK (location_type IN ('onsite', 'remote', 'hybrid')),
  location TEXT,
  description TEXT NOT NULL,
  requirements JSONB,
  benefits JSONB,
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  salary_type TEXT CHECK (salary_type IN ('hourly', 'salary', 'day_rate')),
  application_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  applications_count INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_brand_job_postings_brand FOREIGN KEY (brand_id) REFERENCES brand_profiles(profile_id) ON DELETE CASCADE
);

-- Brand-owned venues
CREATE TABLE brand_venues (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  brand_id TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'owner' CHECK (relationship IN ('owner', 'operator', 'partner')),
  since TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_brand_venues_brand FOREIGN KEY (brand_id) REFERENCES brand_profiles(profile_id) ON DELETE CASCADE
);

-- ============================================================================
-- EXPERIENCE PROFILE (Activities/Tours/Workshops)
-- ============================================================================

CREATE TABLE experience_profiles (
  profile_id TEXT PRIMARY KEY,
  experience_type TEXT NOT NULL CHECK (experience_type IN ('tour', 'concert_series', 'festival', 'excursion', 'activity', 'workshop')),
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  brand_id TEXT,
  category TEXT,
  subcategory TEXT,
  format TEXT NOT NULL DEFAULT 'single' CHECK (format IN ('single', 'series', 'tour', 'ongoing')),
  recurrence TEXT NOT NULL DEFAULT 'one_time' CHECK (recurrence IN ('one_time', 'weekly', 'monthly', 'annual')),
  duration_minutes INTEGER,
  min_age INTEGER,
  max_capacity INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'challenging')),
  accessibility JSONB,
  what_included JSONB,
  what_to_bring JSONB,
  cancellation_policy TEXT,
  featured_media TEXT,
  gallery JSONB,
  average_rating DECIMAL(3,2),
  review_count INTEGER NOT NULL DEFAULT 0,
  booking_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  CONSTRAINT fk_experience_profiles_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_experience_profiles_brand FOREIGN KEY (brand_id) REFERENCES profiles(id)
);

-- Experience instances
CREATE TABLE experience_instances (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  experience_id TEXT NOT NULL,
  destination_id TEXT,
  event_id TEXT,
  instance_name TEXT,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  capacity INTEGER,
  spots_remaining INTEGER,
  price_from DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  weather_dependent BOOLEAN NOT NULL DEFAULT false,
  special_notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_experience_instances_experience FOREIGN KEY (experience_id) REFERENCES experience_profiles(profile_id) ON DELETE CASCADE
);

-- Experience pricing tiers
CREATE TABLE experience_pricing (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  experience_id TEXT NOT NULL,
  tier_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  capacity INTEGER,
  features JSONB,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_experience_pricing_experience FOREIGN KEY (experience_id) REFERENCES experience_profiles(profile_id) ON DELETE CASCADE
);

-- Experience itinerary
CREATE TABLE experience_itinerary (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  experience_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  time TIMESTAMP WITH TIME ZONE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  duration_minutes INTEGER,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_experience_itinerary_experience FOREIGN KEY (experience_id) REFERENCES experience_profiles(profile_id) ON DELETE CASCADE
);

-- Experience hosts
CREATE TABLE experience_hosts (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  experience_id TEXT NOT NULL,
  creator_id TEXT,
  professional_id TEXT,
  role TEXT NOT NULL CHECK (role IN ('host', 'guide', 'instructor', 'performer')),
  bio_override TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_experience_hosts_experience FOREIGN KEY (experience_id) REFERENCES experience_profiles(profile_id) ON DELETE CASCADE
);

-- Experience reviews
CREATE TABLE experience_reviews (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  experience_id TEXT NOT NULL,
  instance_id TEXT,
  member_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  photos JSONB,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  response TEXT,
  response_date TIMESTAMP WITH TIME ZONE,
  verified_purchase BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published', 'hidden')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_experience_reviews_experience FOREIGN KEY (experience_id) REFERENCES experience_profiles(profile_id) ON DELETE CASCADE
);

-- ============================================================================
-- DESTINATION PROFILE (Venues/Locations/Properties)
-- ============================================================================

CREATE TABLE destination_profiles (
  profile_id TEXT PRIMARY KEY,
  destination_type TEXT NOT NULL CHECK (destination_type IN ('venue', 'resort', 'property', 'area')),
  venue_type TEXT CHECK (venue_type IN ('club', 'theater', 'arena', 'outdoor', 'hotel', 'restaurant', 'beach_club')),
  brand_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  address JSONB,
  coordinates JSONB,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  phone TEXT,
  email TEXT,
  capacity_standing INTEGER,
  capacity_seated INTEGER,
  capacity_mixed INTEGER,
  square_footage INTEGER,
  year_built INTEGER,
  year_renovated INTEGER,
  operating_hours JSONB,
  age_restriction TEXT CHECK (age_restriction IN ('all_ages', '18+', '21+')),
  dress_code TEXT,
  parking_info JSONB,
  transit_info JSONB,
  amenities JSONB,
  technical_specs JSONB,
  catering_options JSONB,
  rental_rates JSONB,
  accepting_inquiries BOOLEAN NOT NULL DEFAULT false,
  featured_image TEXT,
  gallery JSONB,
  floor_plans JSONB,
  virtual_tour_url TEXT,
  average_rating DECIMAL(3,2),
  review_count INTEGER NOT NULL DEFAULT 0,
  event_count INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT fk_destination_profiles_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_destination_profiles_brand FOREIGN KEY (brand_id) REFERENCES profiles(id)
);

-- Destination spaces
CREATE TABLE destination_spaces (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  destination_id TEXT NOT NULL,
  space_name TEXT NOT NULL,
  space_type TEXT NOT NULL CHECK (space_type IN ('main_room', 'side_room', 'patio', 'stage', 'lounge', 'bar', 'dining')),
  description TEXT,
  capacity_standing INTEGER,
  capacity_seated INTEGER,
  dimensions JSONB,
  amenities JSONB,
  technical_specs JSONB,
  photos JSONB,
  floor_plan TEXT,
  rental_rate DECIMAL(10,2),
  rental_minimum DECIMAL(10,2),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_destination_spaces_destination FOREIGN KEY (destination_id) REFERENCES destination_profiles(profile_id) ON DELETE CASCADE
);

-- Destination events
CREATE TABLE destination_events (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  destination_id TEXT NOT NULL,
  event_id TEXT,
  event_name TEXT,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL,
  headliner TEXT,
  attendance INTEGER,
  photos JSONB,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_destination_events_destination FOREIGN KEY (destination_id) REFERENCES destination_profiles(profile_id) ON DELETE CASCADE
);

-- Destination calendar
CREATE TABLE destination_calendar (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  destination_id TEXT NOT NULL,
  space_id TEXT,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'tentative', 'booked')),
  event_id TEXT,
  hold_name TEXT,
  hold_expires TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_destination_calendar_destination FOREIGN KEY (destination_id) REFERENCES destination_profiles(profile_id) ON DELETE CASCADE,
  CONSTRAINT unique_destination_calendar UNIQUE (destination_id, space_id, date)
);

-- Destination reviews
CREATE TABLE destination_reviews (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  destination_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  event_id TEXT,
  rating_overall INTEGER NOT NULL CHECK (rating_overall >= 1 AND rating_overall <= 5),
  rating_sound INTEGER CHECK (rating_sound >= 1 AND rating_sound <= 5),
  rating_lighting INTEGER CHECK (rating_lighting >= 1 AND rating_lighting <= 5),
  rating_staff INTEGER CHECK (rating_staff >= 1 AND rating_staff <= 5),
  rating_atmosphere INTEGER CHECK (rating_atmosphere >= 1 AND rating_atmosphere <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  title TEXT,
  content TEXT NOT NULL,
  photos JSONB,
  pros JSONB,
  cons JSONB,
  would_return BOOLEAN NOT NULL DEFAULT true,
  verified_attendance BOOLEAN NOT NULL DEFAULT true,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  response TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published', 'hidden')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_destination_reviews_destination FOREIGN KEY (destination_id) REFERENCES destination_profiles(profile_id) ON DELETE CASCADE
);

-- ============================================================================
-- AFFILIATE SYSTEM
-- ============================================================================

CREATE TABLE affiliate_referrals (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  affiliate_code TEXT NOT NULL,
  affiliate_profile_id TEXT NOT NULL,
  referred_profile_id TEXT,
  referred_user_id TEXT,
  referral_type TEXT NOT NULL,
  entity_id TEXT,
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_affiliate_referrals_affiliate FOREIGN KEY (affiliate_profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_affiliate_referrals_referred FOREIGN KEY (referred_profile_id) REFERENCES profiles(id)
);

CREATE TABLE affiliate_payouts (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  affiliate_profile_id TEXT NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  total_commission DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid')),
  payout_method TEXT,
  payout_details JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_affiliate_payouts_affiliate FOREIGN KEY (affiliate_profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ============================================================================
-- ENHANCED EVENTS
-- ============================================================================

ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type TEXT CHECK (event_type IN ('concert', 'festival', 'corporate', 'private'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS recurrence TEXT CHECK (recurrence IN ('one_time', 'daily', 'weekly', 'monthly', 'annual'));
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_instances INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ticket_types JSONB;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pricing JSONB;
ALTER TABLE events ADD COLUMN IF NOT EXISTS technical_rider TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS hospitality_rider TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS insurance_policy TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS permits JSONB;
ALTER TABLE events ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2);
ALTER TABLE events ADD COLUMN IF NOT EXISTS revenue DECIMAL(10,2);
ALTER TABLE events ADD COLUMN IF NOT EXISTS attendance INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS weather_dependent BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS accessibility JSONB;
ALTER TABLE events ADD COLUMN IF NOT EXISTS emergency_plan TEXT;

CREATE TABLE event_instances (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  event_id TEXT NOT NULL,
  instance_name TEXT,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  capacity INTEGER,
  sold_tickets INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  venue_override TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_event_instances_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE event_assets (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  event_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  assigned_date TIMESTAMP WITH TIME ZONE,
  return_date TIMESTAMP WITH TIME ZONE,
  condition TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_event_assets_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_profile_type ON profiles(profile_type);
CREATE INDEX idx_profiles_handle ON profiles(handle);
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profile_relationships_source ON profile_relationships(source_profile_id);
CREATE INDEX idx_profile_relationships_target ON profile_relationships(target_profile_id);
CREATE INDEX idx_creator_media_profile ON creator_media(profile_id);
CREATE INDEX idx_experience_reviews_experience ON experience_reviews(experience_id);
CREATE INDEX idx_destination_reviews_destination ON destination_reviews(destination_id);
CREATE INDEX idx_affiliate_referrals_affiliate ON affiliate_referrals(affiliate_profile_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profiles" ON profiles
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Public profiles are viewable" ON profiles
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can view relationships involving their profiles" ON profile_relationships
  FOR SELECT USING (
    source_profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    target_profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );
