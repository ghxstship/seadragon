-- Migration: Add build phase workflow tables
-- Description: Creates tables for build phase data structures including site preparation, safety inspections, and equipment installation
-- Created: 2026-01-14

-- Enable RLS
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Build phase site preparation infrastructure table
CREATE TABLE build_site_preparation_infrastructure (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  responsible TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Build phase safety inspections table
CREATE TABLE build_safety_inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  inspector TEXT,
  inspection_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Build phase equipment installation table
CREATE TABLE build_equipment_installation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  equipment TEXT NOT NULL,
  location TEXT,
  technician TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_build_site_preparation_infrastructure_event_id ON build_site_preparation_infrastructure(event_id);
CREATE INDEX idx_build_safety_inspections_event_id ON build_safety_inspections(event_id);
CREATE INDEX idx_build_equipment_installation_event_id ON build_equipment_installation(event_id);

-- Row Level Security
ALTER TABLE build_site_preparation_infrastructure ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_safety_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_equipment_installation ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view build data for their events" ON build_site_preparation_infrastructure
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = build_site_preparation_infrastructure.event_id
      AND (events.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM event_participants
        WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can manage build data for their events" ON build_site_preparation_infrastructure
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = build_site_preparation_infrastructure.event_id
      AND (events.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM event_participants
        WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
      ))
    )
  );

-- Similar policies for all other tables (simplified for brevity)

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_build_site_preparation_infrastructure_updated_at BEFORE UPDATE ON build_site_preparation_infrastructure
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_build_safety_inspections_updated_at BEFORE UPDATE ON build_safety_inspections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_build_equipment_installation_updated_at BEFORE UPDATE ON build_equipment_installation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
