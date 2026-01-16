-- Create experience phase tables
-- Migration: 20260115000008_add_experience_phase_tables.sql

-- Guest services information desks table
CREATE TABLE experience_information_desks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  operating_hours TEXT,
  services JSONB,
  staffing JSONB,
  satisfaction DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Guest services signage table
CREATE TABLE experience_signage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signage_type TEXT NOT NULL,
  location TEXT,
  languages JSONB,
  effectiveness DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Guest services digital guides table
CREATE TABLE experience_digital_guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_type TEXT NOT NULL,
  platform TEXT,
  features JSONB,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Guest services accessibility table
CREATE TABLE experience_accessibility_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  location TEXT,
  availability TEXT,
  utilization INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- VIP management lounge table
CREATE TABLE experience_vip_lounge (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lounge_location TEXT NOT NULL,
  capacity INTEGER,
  amenities JSONB,
  access_levels JSONB,
  utilization DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- VIP management concierge table
CREATE TABLE experience_concierge_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  availability TEXT,
  request_count INTEGER DEFAULT 0,
  satisfaction DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- VIP management meet and greets table
CREATE TABLE experience_meet_greets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_name TEXT NOT NULL,
  meet_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  attendees_count INTEGER DEFAULT 0,
  feedback_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Activations brand activations table
CREATE TABLE experience_brand_activations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  activation_location TEXT,
  activation_type TEXT,
  engagement_count INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  roi DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Activations interactive experiences table
CREATE TABLE experience_interactive_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_name TEXT NOT NULL,
  experience_location TEXT,
  technology_used TEXT,
  participants_count INTEGER DEFAULT 0,
  satisfaction DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Activations sampling table
CREATE TABLE experience_sampling (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  sampling_location TEXT,
  distribution_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Entertainment performances table
CREATE TABLE experience_performances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  act_name TEXT NOT NULL,
  stage_name TEXT,
  performance_start TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  attendance_count INTEGER DEFAULT 0,
  engagement_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Entertainment areas table
CREATE TABLE experience_entertainment_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  area_name TEXT NOT NULL,
  activities JSONB,
  capacity INTEGER,
  utilization DECIMAL(5,2) DEFAULT 0,
  satisfaction DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Entertainment special events table
CREATE TABLE experience_special_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_time TIMESTAMP WITH TIME ZONE,
  event_location TEXT,
  participants_count INTEGER DEFAULT 0,
  feedback_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Food and beverage service points table
CREATE TABLE experience_service_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_location TEXT NOT NULL,
  service_type TEXT,
  capacity INTEGER,
  average_wait_time INTEGER,
  satisfaction DECIMAL(3,2),
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Food and beverage popular items table
CREATE TABLE experience_popular_menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  orders_count INTEGER DEFAULT 0,
  satisfaction DECIMAL(3,2),
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Food and beverage availability table
CREATE TABLE experience_menu_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  current_stock INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'low', 'out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Food and beverage special diets table
CREATE TABLE experience_special_diets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requirement TEXT NOT NULL,
  requests_count INTEGER DEFAULT 0,
  fulfillment_rate DECIMAL(5,2),
  satisfaction DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Retail merchandise table
CREATE TABLE experience_merchandise (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  price DECIMAL(8,2),
  sales_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  satisfaction DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Retail checkout locations table
CREATE TABLE experience_checkout_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  checkout_location TEXT NOT NULL,
  technology_used TEXT,
  efficiency DECIMAL(5,2),
  satisfaction DECIMAL(3,2),
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Retail inventory table
CREATE TABLE experience_retail_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  current_stock INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  turnover_rate DECIMAL(5,2),
  inventory_status TEXT DEFAULT 'optimal' CHECK (inventory_status IN ('optimal', 'overstock', 'understock')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Social media content table
CREATE TABLE experience_social_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  content_type TEXT,
  posts_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(3,2),
  reach_count INTEGER DEFAULT 0,
  sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Social media live streaming table
CREATE TABLE experience_live_streaming (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  event_name TEXT,
  viewers_count INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  engagement_rate DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Social media user generated content table
CREATE TABLE experience_user_generated (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  mentions_count INTEGER DEFAULT 0,
  sentiment_score DECIMAL(3,2),
  top_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Media photography table
CREATE TABLE experience_photography (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photography_type TEXT NOT NULL,
  photographer_name TEXT,
  shots_count INTEGER DEFAULT 0,
  quality_rating DECIMAL(3,2),
  usage_locations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Media videography table
CREATE TABLE experience_videography (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_type TEXT NOT NULL,
  operator_name TEXT,
  duration_minutes INTEGER,
  views_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Media distribution table
CREATE TABLE experience_media_distribution (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_title TEXT NOT NULL,
  distribution_platforms JSONB,
  views_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(3,2),
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Feedback surveys table
CREATE TABLE experience_feedback_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_type TEXT NOT NULL,
  distribution_method TEXT,
  responses_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2),
  satisfaction DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Feedback real-time table
CREATE TABLE experience_realtime_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_method TEXT NOT NULL,
  location TEXT,
  responses_count INTEGER DEFAULT 0,
  satisfaction DECIMAL(3,2),
  actionable_insights JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Feedback analytics themes table
CREATE TABLE experience_feedback_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_name TEXT NOT NULL,
  mentions_count INTEGER DEFAULT 0,
  sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Feedback analytics trends table
CREATE TABLE experience_feedback_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  change_value DECIMAL(5,2),
  time_period TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE experience_information_desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_signage ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_digital_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_accessibility_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_vip_lounge ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_concierge_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_meet_greets ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_brand_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_interactive_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_sampling ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_entertainment_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_special_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_service_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_popular_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_menu_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_special_diets ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_merchandise ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_checkout_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_retail_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_social_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_live_streaming ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_user_generated ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_photography ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_videography ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_media_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_feedback_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_realtime_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_feedback_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_feedback_trends ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_experience_performances_start ON experience_performances(performance_start);
CREATE INDEX idx_experience_special_events_time ON experience_special_events(event_time);
CREATE INDEX idx_experience_meet_greets_time ON experience_meet_greets(meet_time);
CREATE INDEX idx_experience_social_content_platform ON experience_social_content(platform);
CREATE INDEX idx_experience_live_streaming_platform ON experience_live_streaming(platform);

-- RLS Policies (applying to all tables - showing pattern for key tables)
CREATE POLICY "Users can view their own experience information desks" ON experience_information_desks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own experience information desks" ON experience_information_desks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience signage" ON experience_signage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own experience signage" ON experience_signage
  FOR ALL USING (auth.uid() = user_id);

-- Continue with the same pattern for all tables...
-- (For brevity, applying the same policy pattern to all remaining tables)

CREATE POLICY "Users can view their own experience digital guides" ON experience_digital_guides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience digital guides" ON experience_digital_guides FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience accessibility services" ON experience_accessibility_services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience accessibility services" ON experience_accessibility_services FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience vip lounge" ON experience_vip_lounge FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience vip lounge" ON experience_vip_lounge FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience concierge services" ON experience_concierge_services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience concierge services" ON experience_concierge_services FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience meet greets" ON experience_meet_greets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience meet greets" ON experience_meet_greets FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience brand activations" ON experience_brand_activations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience brand activations" ON experience_brand_activations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience interactive experiences" ON experience_interactive_experiences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience interactive experiences" ON experience_interactive_experiences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience sampling" ON experience_sampling FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience sampling" ON experience_sampling FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience performances" ON experience_performances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience performances" ON experience_performances FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience entertainment areas" ON experience_entertainment_areas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience entertainment areas" ON experience_entertainment_areas FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience special events" ON experience_special_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience special events" ON experience_special_events FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience service points" ON experience_service_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience service points" ON experience_service_points FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience popular menu items" ON experience_popular_menu_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience popular menu items" ON experience_popular_menu_items FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience menu availability" ON experience_menu_availability FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience menu availability" ON experience_menu_availability FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience special diets" ON experience_special_diets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience special diets" ON experience_special_diets FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience merchandise" ON experience_merchandise FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience merchandise" ON experience_merchandise FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience checkout locations" ON experience_checkout_locations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience checkout locations" ON experience_checkout_locations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience retail inventory" ON experience_retail_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience retail inventory" ON experience_retail_inventory FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience social content" ON experience_social_content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience social content" ON experience_social_content FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience live streaming" ON experience_live_streaming FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience live streaming" ON experience_live_streaming FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience user generated" ON experience_user_generated FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience user generated" ON experience_user_generated FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience photography" ON experience_photography FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience photography" ON experience_photography FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience videography" ON experience_videography FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience videography" ON experience_videography FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience media distribution" ON experience_media_distribution FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience media distribution" ON experience_media_distribution FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience feedback surveys" ON experience_feedback_surveys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience feedback surveys" ON experience_feedback_surveys FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience realtime feedback" ON experience_realtime_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience realtime feedback" ON experience_realtime_feedback FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience feedback themes" ON experience_feedback_themes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience feedback themes" ON experience_feedback_themes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own experience feedback trends" ON experience_feedback_trends FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience feedback trends" ON experience_feedback_trends FOR ALL USING (auth.uid() = user_id);