-- Create develop phase tables
-- Migration: 20260115000002_add_develop_phase_tables.sql

-- Budget detailed breakdown table
CREATE TABLE develop_budget (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_sales DECIMAL(12,2) DEFAULT 0,
  sponsorships DECIMAL(12,2) DEFAULT 0,
  merchandise DECIMAL(12,2) DEFAULT 0,
  concessions DECIMAL(12,2) DEFAULT 0,
  other_revenue DECIMAL(12,2) DEFAULT 0,
  production_expenses DECIMAL(12,2) DEFAULT 0,
  venue_expenses DECIMAL(12,2) DEFAULT 0,
  marketing_expenses DECIMAL(12,2) DEFAULT 0,
  staff_expenses DECIMAL(12,2) DEFAULT 0,
  insurance_expenses DECIMAL(12,2) DEFAULT 0,
  permits_expenses DECIMAL(12,2) DEFAULT 0,
  technology_expenses DECIMAL(12,2) DEFAULT 0,
  contingency_expenses DECIMAL(12,2) DEFAULT 0,
  break_even_point INTEGER DEFAULT 0,
  break_even_revenue DECIMAL(12,2) DEFAULT 0,
  profit_margin DECIMAL(5,2) DEFAULT 0,
  cash_flow_projections JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Revenue projections table
CREATE TABLE develop_revenue_projections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attendance_scenarios JSONB,
  pricing_strategy JSONB,
  seasonal_adjustments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Sponsorship strategy table
CREATE TABLE develop_sponsorship (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_sponsors JSONB,
  sponsorship_packages JSONB,
  activation_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Vendor RFP process table
CREATE TABLE develop_vendor_rfp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  vendors JSONB,
  evaluation_criteria JSONB,
  selected_vendor TEXT,
  rfp_release_date DATE,
  proposals_due_date DATE,
  evaluation_complete_date DATE,
  contracts_signed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Contract negotiation table
CREATE TABLE develop_contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor TEXT NOT NULL,
  category TEXT NOT NULL,
  value DECIMAL(12,2),
  terms JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'negotiating', 'signed', 'executed')),
  key_clauses JSONB,
  negotiation_log JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Permit applications table
CREATE TABLE develop_permits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  authority TEXT NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'applied', 'approved', 'denied', 'appealed')),
  application_date DATE,
  approval_date DATE,
  cost DECIMAL(10,2) DEFAULT 0,
  requirements JSONB,
  application_start_date DATE,
  all_permits_approved_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Insurance procurement table
CREATE TABLE develop_insurance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  coverage DECIMAL(12,2),
  premium DECIMAL(10,2),
  deductible DECIMAL(10,2),
  term TEXT,
  status TEXT DEFAULT 'quoted' CHECK (status IN ('quoted', 'purchased', 'active')),
  risk_assessment JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Venue selection table
CREATE TABLE develop_venue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venues JSONB,
  selected_venue JSONB,
  site_survey_completed BOOLEAN DEFAULT false,
  site_survey_findings JSONB,
  site_survey_recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Talent booking table
CREATE TABLE develop_talent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lineup JSONB,
  booking_agency TEXT,
  total_talent_budget DECIMAL(12,2) DEFAULT 0,
  rider_requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Marketing strategy table
CREATE TABLE develop_marketing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy JSONB,
  campaign_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Ticketing strategy table
CREATE TABLE develop_ticketing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT,
  pricing_tiers JSONB,
  sales_phases JSONB,
  distribution_channels JSONB,
  platform_fee DECIMAL(5,2) DEFAULT 0,
  processing_fee DECIMAL(5,2) DEFAULT 0,
  total_fee DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Technology planning table
CREATE TABLE develop_technology (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  systems JSONB,
  integrations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE develop_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_revenue_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_sponsorship ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_vendor_rfp ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_venue ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_talent ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_marketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_ticketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_technology ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_develop_budget_user_id ON develop_budget(user_id);
CREATE INDEX idx_develop_revenue_projections_user_id ON develop_revenue_projections(user_id);
CREATE INDEX idx_develop_sponsorship_user_id ON develop_sponsorship(user_id);
CREATE INDEX idx_develop_vendor_rfp_user_id ON develop_vendor_rfp(user_id);
CREATE INDEX idx_develop_contracts_user_id ON develop_contracts(user_id);
CREATE INDEX idx_develop_permits_user_id ON develop_permits(user_id);
CREATE INDEX idx_develop_insurance_user_id ON develop_insurance(user_id);
CREATE INDEX idx_develop_venue_user_id ON develop_venue(user_id);
CREATE INDEX idx_develop_talent_user_id ON develop_talent(user_id);
CREATE INDEX idx_develop_marketing_user_id ON develop_marketing(user_id);
CREATE INDEX idx_develop_ticketing_user_id ON develop_ticketing(user_id);
CREATE INDEX idx_develop_technology_user_id ON develop_technology(user_id);

-- RLS Policies
CREATE POLICY "Users can view their own develop budget" ON develop_budget
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop budget" ON develop_budget
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop revenue projections" ON develop_revenue_projections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop revenue projections" ON develop_revenue_projections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop sponsorship" ON develop_sponsorship
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop sponsorship" ON develop_sponsorship
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop vendor rfps" ON develop_vendor_rfp
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop vendor rfps" ON develop_vendor_rfp
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop contracts" ON develop_contracts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop contracts" ON develop_contracts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop permits" ON develop_permits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop permits" ON develop_permits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop insurance" ON develop_insurance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop insurance" ON develop_insurance
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop venue" ON develop_venue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop venue" ON develop_venue
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop talent" ON develop_talent
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop talent" ON develop_talent
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop marketing" ON develop_marketing
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop marketing" ON develop_marketing
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop ticketing" ON develop_ticketing
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop ticketing" ON develop_ticketing
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own develop technology" ON develop_technology
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own develop technology" ON develop_technology
  FOR ALL USING (auth.uid() = user_id);