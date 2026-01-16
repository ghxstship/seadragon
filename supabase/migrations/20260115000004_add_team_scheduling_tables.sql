-- Create team scheduling tables
-- Migration: 20260115000004_add_team_scheduling_tables.sql

-- Team members table
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  email TEXT,
  phone TEXT,
  skills JSONB,
  certifications JSONB,
  availability JSONB, -- weekly availability schedule
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  hire_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Shifts table
CREATE TABLE team_shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours DECIMAL(4,2),
  required_roles JSONB,
  location TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Shift assignments table
CREATE TABLE team_shift_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_id UUID REFERENCES team_shifts(id) ON DELETE CASCADE,
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  assignment_date DATE NOT NULL,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed', 'no_show', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(shift_id, assignment_date)
);

-- Team availability table
CREATE TABLE team_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,
  reason TEXT, -- vacation, sick, training, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(member_id, date)
);

-- Scheduling conflicts table
CREATE TABLE team_scheduling_conflicts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL, -- double_booking, unavailable, skill_mismatch
  description TEXT NOT NULL,
  date DATE,
  shift_id UUID REFERENCES team_shifts(id),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'ignored')),
  resolution TEXT,
  resolved_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Team communication table
CREATE TABLE team_communication (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- announcement, shift_change, emergency
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  recipients JSONB,
  send_date TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT false,
  delivery_status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Team performance metrics table
CREATE TABLE team_performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- attendance, punctuality, performance
  value DECIMAL(5,2),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Team schedules table (weekly/monthly views)
CREATE TABLE team_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  schedule_data JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_scheduling_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_communication ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_schedules ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_team_members_role ON team_members(role);
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_shifts_start_time ON team_shifts(start_time);
CREATE INDEX idx_team_shift_assignments_date ON team_shift_assignments(assignment_date);
CREATE INDEX idx_team_shift_assignments_member_id ON team_shift_assignments(member_id);
CREATE INDEX idx_team_availability_date ON team_availability(date);
CREATE INDEX idx_team_availability_member_id ON team_availability(member_id);
CREATE INDEX idx_team_scheduling_conflicts_status ON team_scheduling_conflicts(status);
CREATE INDEX idx_team_performance_metrics_date ON team_performance_metrics(date);
CREATE INDEX idx_team_schedules_start_date ON team_schedules(start_date);

-- RLS Policies
CREATE POLICY "Users can view their own team members" ON team_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own team members" ON team_members
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own team shifts" ON team_shifts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own team shifts" ON team_shifts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own shift assignments" ON team_shift_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own shift assignments" ON team_shift_assignments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own team availability" ON team_availability
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own team availability" ON team_availability
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own scheduling conflicts" ON team_scheduling_conflicts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own scheduling conflicts" ON team_scheduling_conflicts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own team communication" ON team_communication
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own team communication" ON team_communication
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own performance metrics" ON team_performance_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own performance metrics" ON team_performance_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own team schedules" ON team_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own team schedules" ON team_schedules
  FOR ALL USING (auth.uid() = user_id);