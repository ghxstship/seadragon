-- Add comprehensive venue and space management schema
-- Migration: 20260114000001_add_venue_space_management.sql

-- ============================================================================
-- VENUE MANAGEMENT TABLES
-- ============================================================================

-- Main venues table with comprehensive details
CREATE TABLE venues (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  venue_type TEXT NOT NULL, -- 'indoor', 'outdoor', 'mixed', etc.
  status TEXT DEFAULT 'active',
  address JSONB,
  coordinates JSONB,
  contact_info JSONB, -- email, phone, website
  business_hours JSONB, -- days and hours
  capacity JSONB, -- theater, banquet, reception, etc.
  area_sqft INTEGER,
  dimensions TEXT, -- "100ft x 50ft"
  ceiling_height TEXT, -- "18ft"
  parking_info JSONB,
  accessibility_features JSONB,
  technical_specs JSONB,
  images JSONB DEFAULT '[]',
  floor_plan_url TEXT,
  virtual_tour_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_venue_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT unique_venue_org_slug UNIQUE (organization_id, slug)
);

-- Spaces within venues (ballrooms, conference rooms, etc.)
CREATE TABLE spaces (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  venue_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  space_type TEXT NOT NULL, -- 'ballroom', 'conference', 'outdoor', etc.
  status TEXT DEFAULT 'active',
  capacity JSONB, -- theater, banquet, reception, etc.
  area_sqft INTEGER,
  dimensions TEXT,
  ceiling_height TEXT,
  floor_level TEXT,
  accessibility BOOLEAN DEFAULT TRUE,
  technical_specs JSONB,
  images JSONB DEFAULT '[]',
  floor_plan_url TEXT,
  virtual_tour_url TEXT,
  pricing JSONB, -- weekday, weekend, peak_season rates
  setup_breakdown_times JSONB, -- hours required
  restrictions JSONB, -- usage restrictions
  features JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  availability_notes TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_space_venue FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  CONSTRAINT unique_space_venue_slug UNIQUE (venue_id, slug)
);

-- Venue features (reusable feature definitions)
CREATE TABLE venue_features (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'technical', 'accessibility', 'amenity', etc.
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venue amenities (reusable amenity definitions)
CREATE TABLE venue_amenities (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'dining', 'parking', 'technical', etc.
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venue-space feature associations
CREATE TABLE space_features (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  space_id TEXT NOT NULL,
  feature_id TEXT NOT NULL,
  details TEXT, -- additional details about this feature
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_space_feature_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_space_feature_feature FOREIGN KEY (feature_id) REFERENCES venue_features(id) ON DELETE CASCADE,
  CONSTRAINT unique_space_feature UNIQUE (space_id, feature_id)
);

-- Venue-space amenity associations
CREATE TABLE space_amenities (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  space_id TEXT NOT NULL,
  amenity_id TEXT NOT NULL,
  details TEXT, -- additional details about this amenity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_space_amenity_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_space_amenity_amenity FOREIGN KEY (amenity_id) REFERENCES venue_amenities(id) ON DELETE CASCADE,
  CONSTRAINT unique_space_amenity UNIQUE (space_id, amenity_id)
);

-- Venue pricing tiers
CREATE TABLE venue_pricing (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  venue_id TEXT NOT NULL,
  space_id TEXT, -- NULL for venue-wide pricing
  name TEXT NOT NULL, -- 'Weekday', 'Weekend', 'Peak Season', etc.
  rate_type TEXT NOT NULL, -- 'hourly', 'daily', 'minimum'
  base_rate DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  minimum_hours INTEGER,
  maximum_hours INTEGER,
  conditions TEXT, -- special conditions
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_venue_pricing_venue FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  CONSTRAINT fk_venue_pricing_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
);

-- Venue availability calendar
CREATE TABLE venue_availability (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  venue_id TEXT NOT NULL,
  space_id TEXT, -- NULL for venue-wide availability
  date DATE NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  booking_status TEXT DEFAULT 'available', -- 'available', 'booked', 'maintenance', etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_venue_availability_venue FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  CONSTRAINT fk_venue_availability_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  CONSTRAINT unique_venue_date_space UNIQUE (venue_id, date, space_id)
);

-- Venue reviews and ratings
CREATE TABLE venue_reviews (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  venue_id TEXT NOT NULL,
  space_id TEXT,
  user_id TEXT NOT NULL,
  booking_id TEXT, -- reference to actual booking if applicable
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE, -- verified booking
  helpful_votes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  response TEXT, -- venue response
  response_date TIMESTAMP WITH TIME ZONE,
  response_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_venue_review_venue FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  CONSTRAINT fk_venue_review_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_venue_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Venue media gallery
CREATE TABLE venue_media (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  venue_id TEXT NOT NULL,
  space_id TEXT,
  media_id TEXT NOT NULL,
  media_type TEXT NOT NULL, -- 'image', 'video', 'floor_plan', 'virtual_tour'
  title TEXT,
  description TEXT,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_venue_media_venue FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  CONSTRAINT fk_venue_media_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_venue_media_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_venues_organization_id ON venues(organization_id);
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_venue_type ON venues(venue_type);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_featured ON venues(featured);

CREATE INDEX idx_spaces_venue_id ON spaces(venue_id);
CREATE INDEX idx_spaces_slug ON spaces(slug);
CREATE INDEX idx_spaces_space_type ON spaces(space_type);
CREATE INDEX idx_spaces_status ON spaces(status);

CREATE INDEX idx_venue_features_category ON venue_features(category);
CREATE INDEX idx_venue_features_active ON venue_features(active);

CREATE INDEX idx_venue_amenities_category ON venue_amenities(category);
CREATE INDEX idx_venue_amenities_active ON venue_amenities(active);

CREATE INDEX idx_space_features_space_id ON space_features(space_id);
CREATE INDEX idx_space_features_feature_id ON space_features(feature_id);

CREATE INDEX idx_space_amenities_space_id ON space_amenities(space_id);
CREATE INDEX idx_space_amenities_amenity_id ON space_amenities(amenity_id);

CREATE INDEX idx_venue_pricing_venue_id ON venue_pricing(venue_id);
CREATE INDEX idx_venue_pricing_space_id ON venue_pricing(space_id);
CREATE INDEX idx_venue_pricing_active ON venue_pricing(active);

CREATE INDEX idx_venue_availability_venue_id ON venue_availability(venue_id);
CREATE INDEX idx_venue_availability_space_id ON venue_availability(space_id);
CREATE INDEX idx_venue_availability_date ON venue_availability(date);

CREATE INDEX idx_venue_reviews_venue_id ON venue_reviews(venue_id);
CREATE INDEX idx_venue_reviews_space_id ON venue_reviews(space_id);
CREATE INDEX idx_venue_reviews_user_id ON venue_reviews(user_id);
CREATE INDEX idx_venue_reviews_rating ON venue_reviews(rating);
CREATE INDEX idx_venue_reviews_status ON venue_reviews(status);

CREATE INDEX idx_venue_media_venue_id ON venue_media(venue_id);
CREATE INDEX idx_venue_media_space_id ON venue_media(space_id);
CREATE INDEX idx_venue_media_media_type ON venue_media(media_type);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_media ENABLE ROW LEVEL SECURITY;

-- Venues: Users can view venues from their organizations or public venues
CREATE POLICY "Users can view venues in their orgs or public" ON venues
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    ) OR organization_id IS NULL
  );

-- Spaces: Users can view spaces for venues they can access
CREATE POLICY "Users can view spaces for accessible venues" ON spaces
  FOR SELECT USING (
    venue_id IN (
      SELECT id FROM venues WHERE organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      ) OR organization_id IS NULL
    )
  );

-- Venue features: Public read access
CREATE POLICY "Public can view venue features" ON venue_features
  FOR SELECT USING (active = TRUE);

-- Venue amenities: Public read access
CREATE POLICY "Public can view venue amenities" ON venue_amenities
  FOR SELECT USING (active = TRUE);

-- Space features: Users can view features for accessible spaces
CREATE POLICY "Users can view features for accessible spaces" ON space_features
  FOR SELECT USING (
    space_id IN (
      SELECT s.id FROM spaces s
      JOIN venues v ON s.venue_id = v.id
      WHERE v.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      ) OR v.organization_id IS NULL
    )
  );

-- Space amenities: Users can view amenities for accessible spaces
CREATE POLICY "Users can view amenities for accessible spaces" ON space_amenities
  FOR SELECT USING (
    space_id IN (
      SELECT s.id FROM spaces s
      JOIN venues v ON s.venue_id = v.id
      WHERE v.organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      ) OR v.organization_id IS NULL
    )
  );

-- Venue pricing: Users can view pricing for accessible venues
CREATE POLICY "Users can view pricing for accessible venues" ON venue_pricing
  FOR SELECT USING (
    venue_id IN (
      SELECT id FROM venues WHERE organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      ) OR organization_id IS NULL
    )
  );

-- Venue availability: Public read access for available dates
CREATE POLICY "Public can view venue availability" ON venue_availability
  FOR SELECT USING (TRUE);

-- Venue reviews: Public read access for published reviews
CREATE POLICY "Public can view published venue reviews" ON venue_reviews
  FOR SELECT USING (status = 'published');

-- Users can create reviews for venues they've booked
CREATE POLICY "Users can create reviews for booked venues" ON venue_reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Venue media: Users can view media for accessible venues
CREATE POLICY "Users can view media for accessible venues" ON venue_media
  FOR SELECT USING (
    venue_id IN (
      SELECT id FROM venues WHERE organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      ) OR organization_id IS NULL
    )
  );

-- ============================================================================
-- SEED DATA FOR FEATURES AND AMENITIES
-- ============================================================================

-- Insert common venue features
INSERT INTO venue_features (name, description, category, icon, sort_order) VALUES
  ('Floor-to-ceiling ocean view windows', 'Panoramic ocean views through large windows', 'location', 'waves', 1),
  ('Crystal chandelier lighting', 'Elegant crystal chandeliers with adjustable lighting', 'lighting', 'lightbulb', 2),
  ('Professional hardwood dance floor', 'Polished hardwood flooring perfect for dancing', 'flooring', 'grid', 3),
  ('State-of-the-art sound system', 'Professional audio equipment throughout the space', 'audio', 'volume-2', 4),
  ('Adjustable LED lighting', 'Fully customizable LED lighting system', 'lighting', 'zap', 5),
  ('Bridal suite with ocean views', 'Private suite for bridal party preparation', 'facilities', 'crown', 6),
  ('Adjacent catering preparation kitchen', 'Dedicated kitchen for catering setup', 'facilities', 'chef-hat', 7),
  ('Multiple entrance/exit points', 'Convenient access points for guests', 'accessibility', 'door-open', 8),
  ('Integrated climate control', 'Advanced HVAC system for comfort', 'climate', 'thermometer', 9),
  ('ADA compliant design', 'Fully accessible for all guests', 'accessibility', 'wheelchair', 10);

-- Insert common venue amenities
INSERT INTO venue_amenities (name, description, category, icon, sort_order) VALUES
  ('Wireless high-speed internet', 'Gigabit WiFi throughout the venue', 'technology', 'wifi', 1),
  ('Professional AV equipment rental', 'Full range of audio-visual equipment available', 'technology', 'monitor', 2),
  ('Stage and podium options', 'Customizable staging solutions', 'staging', 'stage', 3),
  ('Dance floor lighting system', 'Specialized lighting for dance floors', 'lighting', 'disc', 4),
  ('Coat check and storage', 'Secure storage for personal items', 'services', 'package', 5),
  ('Valet parking coordination', 'Professional parking services', 'parking', 'car', 6),
  ('Security and access control', '24/7 security monitoring', 'security', 'shield', 7),
  ('Emergency lighting and exits', 'Comprehensive emergency systems', 'safety', 'alert-triangle', 8),
  ('Restroom facilities adjacent', 'Clean, well-maintained restrooms nearby', 'facilities', 'toilet', 9),
  ('Catering service access', 'Direct access for catering services', 'dining', 'utensils-crossed', 10);
