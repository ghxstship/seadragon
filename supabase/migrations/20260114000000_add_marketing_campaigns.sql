-- Add marketing campaigns system
-- Migration: 20260114000000_add_marketing_campaigns.sql

-- Main marketing campaigns table
CREATE TABLE marketing_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused', 'cancelled')),
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  campaign_data JSONB, -- Store structured campaign data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Marketing audience segments
CREATE TABLE marketing_audience_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  size INTEGER,
  demographics JSONB,
  interests JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing content pieces
CREATE TABLE marketing_content_pieces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video', 'text', 'social', 'email', 'web')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published', 'archived')),
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing channel performance
CREATE TABLE marketing_channel_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  channel TEXT NOT NULL, -- facebook, instagram, etc.
  impressions INTEGER,
  reach INTEGER,
  engagement INTEGER,
  clicks INTEGER,
  conversions INTEGER,
  cost DECIMAL(10,2),
  roi DECIMAL(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing budget tracking
CREATE TABLE marketing_budget_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  allocated DECIMAL(10,2),
  spent DECIMAL(10,2),
  remaining DECIMAL(10,2),
  roi DECIMAL(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_marketing_campaigns_user_id ON marketing_campaigns(user_id);
CREATE INDEX idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX idx_marketing_audience_segments_campaign_id ON marketing_audience_segments(campaign_id);
CREATE INDEX idx_marketing_content_pieces_campaign_id ON marketing_content_pieces(campaign_id);
CREATE INDEX idx_marketing_channel_performance_campaign_id ON marketing_channel_performance(campaign_id);
CREATE INDEX idx_marketing_budget_tracking_campaign_id ON marketing_budget_tracking(campaign_id);

-- RLS Policies
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_audience_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_channel_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_budget_tracking ENABLE ROW LEVEL SECURITY;

-- Policies for marketing_campaigns
CREATE POLICY "Users can view their own marketing campaigns" ON marketing_campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own marketing campaigns" ON marketing_campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketing campaigns" ON marketing_campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marketing campaigns" ON marketing_campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can view audience segments for their campaigns" ON marketing_audience_segments
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM marketing_campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage audience segments for their campaigns" ON marketing_audience_segments
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM marketing_campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view content pieces for their campaigns" ON marketing_content_pieces
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM marketing_campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage content pieces for their campaigns" ON marketing_content_pieces
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM marketing_campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view channel performance for their campaigns" ON marketing_channel_performance
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM marketing_campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage channel performance for their campaigns" ON marketing_channel_performance
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM marketing_campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view budget tracking for their campaigns" ON marketing_budget_tracking
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM marketing_campaigns WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage budget tracking for their campaigns" ON marketing_budget_tracking
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM marketing_campaigns WHERE user_id = auth.uid()
    )
  );
