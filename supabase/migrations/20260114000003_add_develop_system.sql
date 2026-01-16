-- Develop Phase Database Schema
-- Migration for event development and planning data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Develop Budget Table
-- Stores detailed budget information for event development
CREATE TABLE develop_budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  revenue_ticket_sales DECIMAL(12,2) DEFAULT 0,
  revenue_sponsorships DECIMAL(12,2) DEFAULT 0,
  revenue_merchandise DECIMAL(12,2) DEFAULT 0,
  revenue_concessions DECIMAL(12,2) DEFAULT 0,
  revenue_other DECIMAL(12,2) DEFAULT 0,
  expense_production DECIMAL(12,2) DEFAULT 0,
  expense_venue DECIMAL(12,2) DEFAULT 0,
  expense_marketing DECIMAL(12,2) DEFAULT 0,
  expense_staff DECIMAL(12,2) DEFAULT 0,
  expense_insurance DECIMAL(12,2) DEFAULT 0,
  expense_permits DECIMAL(12,2) DEFAULT 0,
  expense_technology DECIMAL(12,2) DEFAULT 0,
  expense_contingency DECIMAL(12,2) DEFAULT 0,
  break_even_point INTEGER,
  break_even_revenue DECIMAL(12,2),
  profit_margin DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Cash Flow Projections
-- Monthly cash flow projections
CREATE TABLE develop_cash_flow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  month VARCHAR(20) NOT NULL,
  revenue DECIMAL(12,2) DEFAULT 0,
  expenses DECIMAL(12,2) DEFAULT 0,
  net_cash_flow DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Revenue Scenarios
-- Different attendance and revenue scenarios
CREATE TABLE develop_revenue_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  scenario_name VARCHAR(100) NOT NULL,
  attendance_estimate INTEGER,
  avg_ticket_price DECIMAL(8,2),
  total_revenue DECIMAL(12,2),
  probability DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Pricing Strategy
-- Ticket pricing configuration
CREATE TABLE develop_pricing_strategy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  early_bird_discount DECIMAL(8,2),
  regular_price DECIMAL(8,2),
  vip_price DECIMAL(8,2),
  group_discounts BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Seasonal Adjustments
-- Seasonal pricing adjustments
CREATE TABLE develop_seasonal_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  period VARCHAR(50) NOT NULL,
  multiplier DECIMAL(3,2) DEFAULT 1.0,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Sponsorship Packages
-- Available sponsorship levels and benefits
CREATE TABLE develop_sponsorship_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  level_name VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2),
  availability INTEGER,
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Target Sponsors
-- Potential sponsors and their status
CREATE TABLE develop_target_sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  sponsor_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  target_amount DECIMAL(10,2),
  contact_status VARCHAR(20) DEFAULT 'prospect' CHECK (contact_status IN ('prospect', 'contacted', 'negotiating', 'committed')),
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Vendor RFPs
-- Requests for proposals from vendors
CREATE TABLE develop_vendor_rfps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  evaluation_criteria TEXT[],
  selected_vendor VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop RFP Vendors
-- Vendors responding to RFPs
CREATE TABLE develop_rfp_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfp_id UUID REFERENCES develop_vendor_rfps(id) ON DELETE CASCADE,
  vendor_name VARCHAR(255) NOT NULL,
  proposal TEXT,
  pricing DECIMAL(10,2),
  rating DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Contracts
-- Vendor contract information
CREATE TABLE develop_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  vendor_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  value DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'negotiating', 'signed', 'cancelled')),
  terms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Contract Clauses
-- Key contract clauses and negotiation status
CREATE TABLE develop_contract_clauses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES develop_contracts(id) ON DELETE CASCADE,
  clause TEXT NOT NULL,
  negotiated BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Permits
-- Required permits and their status
CREATE TABLE develop_permits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  permit_type VARCHAR(100) NOT NULL,
  authority VARCHAR(255),
  cost DECIMAL(8,2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'approved', 'denied')),
  requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Insurance Policies
-- Insurance coverage information
CREATE TABLE develop_insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  policy_type VARCHAR(100) NOT NULL,
  provider VARCHAR(255),
  coverage DECIMAL(12,2),
  premium DECIMAL(8,2),
  deductible DECIMAL(8,2),
  term VARCHAR(50),
  status VARCHAR(20) DEFAULT 'quoted' CHECK (status IN ('quoted', 'purchased', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Risk Assessment
-- Risk assessment data
CREATE TABLE develop_risk_assessment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  risk_description TEXT NOT NULL,
  likelihood VARCHAR(20) CHECK (likelihood IN ('low', 'medium', 'high')),
  impact VARCHAR(20) CHECK (impact IN ('low', 'medium', 'high')),
  mitigation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Venues
-- Available venue options
CREATE TABLE develop_venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  venue_name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  capacity INTEGER,
  cost DECIMAL(10,2),
  availability TEXT[],
  amenities TEXT[],
  restrictions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Selected Venue
-- The chosen venue for the event
CREATE TABLE develop_selected_venue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES develop_venues(id),
  booking_date DATE,
  contract_value DECIMAL(12,2),
  key_terms TEXT[],
  site_survey_completed BOOLEAN DEFAULT false,
  survey_findings TEXT[],
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Talent Lineup
-- Booked performers and artists
CREATE TABLE develop_talent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  act_name VARCHAR(255) NOT NULL,
  act_type VARCHAR(20) CHECK (act_type IN ('headliner', 'support', 'local')),
  fee DECIMAL(10,2),
  booking_status VARCHAR(20) DEFAULT 'prospect' CHECK (booking_status IN ('prospect', 'confirmed', 'booked', 'cancelled')),
  contract_terms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Develop Talent Riders
-- Artist requirements and riders
CREATE TABLE develop_talent_riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_id UUID REFERENCES develop_talent(id) ON DELETE CASCADE,
  requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_develop_budget_event_id ON develop_budget(event_id);
CREATE INDEX idx_develop_contracts_event_id ON develop_contracts(event_id);
CREATE INDEX idx_develop_permits_event_id ON develop_permits(event_id);
CREATE INDEX idx_develop_talent_event_id ON develop_talent(event_id);
CREATE INDEX idx_develop_venues_event_id ON develop_venues(event_id);

-- Row Level Security Policies
ALTER TABLE develop_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_cash_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_revenue_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_pricing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_seasonal_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_sponsorship_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_target_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_vendor_rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_rfp_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_contract_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_risk_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_selected_venue ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_talent ENABLE ROW LEVEL SECURITY;
ALTER TABLE develop_talent_riders ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (adjust based on your role system)
CREATE POLICY "Users can view develop data for their events" ON develop_budget
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Event organizers can manage develop data" ON develop_budget
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = develop_budget.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Similar policies for other tables (implement based on your security requirements)

-- Insert sample data for testing
INSERT INTO develop_budget (event_id, revenue_ticket_sales, revenue_sponsorships, revenue_merchandise, revenue_concessions, revenue_other,
                           expense_production, expense_venue, expense_marketing, expense_staff, expense_insurance,
                           expense_permits, expense_technology, expense_contingency, break_even_point, break_even_revenue, profit_margin)
VALUES ((SELECT id FROM events LIMIT 1), 250000, 75000, 45000, 35000, 12000,
        85000, 55000, 35000, 28000, 8000, 5000, 15000, 15000, 10000, 275000, 11.0);

INSERT INTO develop_revenue_scenarios (event_id, scenario_name, attendance_estimate, avg_ticket_price, total_revenue, probability)
VALUES
  ((SELECT id FROM events LIMIT 1), 'Conservative', 10000, 85, 850000, 0.3),
  ((SELECT id FROM events LIMIT 1), 'Moderate', 12000, 95, 1140000, 0.5),
  ((SELECT id FROM events LIMIT 1), 'Optimistic', 15000, 110, 1650000, 0.2);

INSERT INTO develop_sponsorship_packages (event_id, level_name, amount, availability, benefits)
VALUES
  ((SELECT id FROM events LIMIT 1), 'Platinum', 50000, 2, ARRAY['Stage naming', 'VIP tickets', 'Logo on merchandise', 'Social media features']),
  ((SELECT id FROM events LIMIT 1), 'Gold', 25000, 4, ARRAY['Logo on website', 'Social media mention', 'Event program listing']),
  ((SELECT id FROM events LIMIT 1), 'Silver', 10000, 8, ARRAY['Event program listing', 'Website recognition']);

INSERT INTO develop_venues (event_id, venue_name, location, capacity, cost, availability, amenities, restrictions)
VALUES
  ((SELECT id FROM events LIMIT 1), 'Central Park Amphitheater', 'Downtown', 15000, 25000, ARRAY['June', 'July'], ARRAY['Stage', 'Sound system', 'Parking'], ARRAY['Noise curfew', 'Weather dependent']),
  ((SELECT id FROM events LIMIT 1), 'Convention Center', 'Business District', 12000, 35000, ARRAY['Year-round'], ARRAY['Indoor', 'Climate controlled', 'Catering kitchen'], ARRAY['Capacity limits', 'Union labor']);

INSERT INTO develop_talent (event_id, act_name, act_type, fee, booking_status, contract_terms)
VALUES
  ((SELECT id FROM events LIMIT 1), 'Headliner Band', 'headliner', 75000, 'booked', ARRAY['Sound requirements', 'Backstage access', 'Merchandise rights']),
  ((SELECT id FROM events LIMIT 1), 'Opening Act', 'support', 15000, 'confirmed', ARRAY['Sound check time', 'Travel expenses']),
  ((SELECT id FROM events LIMIT 1), 'Local DJ', 'local', 3000, 'confirmed', ARRAY['Equipment provided', 'Set time confirmed']);
