-- Create schedule phase tables
-- Migration: 20260115000003_add_schedule_phase_tables.sql

-- Schedule events table
CREATE TABLE schedule_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL, -- performance, setup, teardown, meeting, etc.
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  capacity INTEGER,
  description TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_resources JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Resource allocation table
CREATE TABLE schedule_resource_allocation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL, -- personnel, equipment, venue, transportation
  resource_name TEXT NOT NULL,
  allocated_to TEXT, -- event or task name
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  quantity INTEGER DEFAULT 1,
  cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'allocated' CHECK (status IN ('allocated', 'confirmed', 'in_use', 'returned', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Timeline milestones table
CREATE TABLE schedule_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_name TEXT NOT NULL,
  description TEXT,
  planned_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'delayed', 'cancelled')),
  dependencies JSONB,
  responsible TEXT,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Schedule conflicts table
CREATE TABLE schedule_conflicts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conflict_type TEXT NOT NULL, -- resource, time, location, personnel
  description TEXT NOT NULL,
  affected_events JSONB,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'escalated', 'cancelled')),
  resolution TEXT,
  resolved_date TIMESTAMP WITH TIME ZONE,
  responsible TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Communication plan table
CREATE TABLE schedule_communication_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audience TEXT NOT NULL,
  message_type TEXT NOT NULL, -- email, sms, social, press, internal
  message_content TEXT,
  schedule_date TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_method TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'sent', 'delivered', 'failed')),
  response_rate DECIMAL(5,2),
  engagement_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Contingency plans table
CREATE TABLE schedule_contingency_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario TEXT NOT NULL,
  trigger_conditions TEXT NOT NULL,
  response_plan TEXT NOT NULL,
  responsible_parties JSONB,
  resources_required JSONB,
  communication_plan JSONB,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'tested', 'outdated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Schedule templates table
CREATE TABLE schedule_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  duration_days INTEGER,
  standard_events JSONB,
  resource_requirements JSONB,
  checklist_items JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Schedule performance metrics table
CREATE TABLE schedule_performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  target_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),
  variance_percentage DECIMAL(5,2),
  measurement_period TEXT,
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'behind', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_resource_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_communication_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_contingency_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_schedule_events_start_date ON schedule_events(start_date);
CREATE INDEX idx_schedule_events_status ON schedule_events(status);
CREATE INDEX idx_schedule_resource_allocation_resource_type ON schedule_resource_allocation(resource_type);
CREATE INDEX idx_schedule_milestones_planned_date ON schedule_milestones(planned_date);
CREATE INDEX idx_schedule_conflicts_status ON schedule_conflicts(status);
CREATE INDEX idx_schedule_communication_plan_schedule_date ON schedule_communication_plan(schedule_date);
CREATE INDEX idx_schedule_performance_metrics_user_id ON schedule_performance_metrics(user_id);

-- RLS Policies
CREATE POLICY "Users can view their own schedule events" ON schedule_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedule events" ON schedule_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own resource allocations" ON schedule_resource_allocation
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own resource allocations" ON schedule_resource_allocation
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own schedule milestones" ON schedule_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedule milestones" ON schedule_milestones
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own schedule conflicts" ON schedule_conflicts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedule conflicts" ON schedule_conflicts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own communication plans" ON schedule_communication_plan
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own communication plans" ON schedule_communication_plan
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own contingency plans" ON schedule_contingency_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own contingency plans" ON schedule_contingency_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own schedule templates" ON schedule_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedule templates" ON schedule_templates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own performance metrics" ON schedule_performance_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own performance metrics" ON schedule_performance_metrics
  FOR ALL USING (auth.uid() = user_id);