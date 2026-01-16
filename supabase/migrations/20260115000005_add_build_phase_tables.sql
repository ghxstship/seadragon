-- Create build phase tables
-- Migration: 20260115000005_add_build_phase_tables.sql

-- Build tasks table
CREATE TABLE build_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- electrical, structural, audio, lighting, staging, etc.
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked', 'cancelled')),
  assigned_to TEXT,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  start_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  dependencies JSONB,
  resources_required JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Build resources table
CREATE TABLE build_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_name TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- equipment, material, personnel, subcontractor
  quantity_available INTEGER DEFAULT 0,
  quantity_allocated INTEGER DEFAULT 0,
  unit_cost DECIMAL(10,2) DEFAULT 0,
  supplier TEXT,
  contact_info TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'ordered', 'delivered', 'in_use', 'returned')),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Build milestones table
CREATE TABLE build_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  planned_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'delayed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  responsible_party TEXT,
  dependencies JSONB,
  deliverables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Build issues table
CREATE TABLE build_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  reported_by TEXT,
  assigned_to TEXT,
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_date TIMESTAMP WITH TIME ZONE,
  resolution TEXT,
  impact_assessment TEXT,
  preventive_measures TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Build inspections table
CREATE TABLE build_inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inspection_name TEXT NOT NULL,
  inspection_type TEXT NOT NULL, -- electrical, structural, safety, final
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  inspector TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'passed', 'failed', 'cancelled')),
  checklist_items JSONB,
  findings JSONB,
  corrective_actions JSONB,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Build checklists table
CREATE TABLE build_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_name TEXT NOT NULL,
  category TEXT NOT NULL,
  phase TEXT NOT NULL, -- pre-build, during-build, post-build
  items JSONB,
  assigned_to TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Build subcontractors table
CREATE TABLE build_subcontractors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  specialty TEXT NOT NULL,
  license_number TEXT,
  insurance_info JSONB,
  contract_value DECIMAL(12,2),
  contract_start_date TIMESTAMP WITH TIME ZONE,
  contract_end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  performance_rating DECIMAL(3,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE build_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_subcontractors ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_build_tasks_category ON build_tasks(category);
CREATE INDEX idx_build_tasks_status ON build_tasks(status);
CREATE INDEX idx_build_tasks_due_date ON build_tasks(due_date);
CREATE INDEX idx_build_resources_resource_type ON build_resources(resource_type);
CREATE INDEX idx_build_milestones_planned_date ON build_milestones(planned_date);
CREATE INDEX idx_build_issues_status ON build_issues(status);
CREATE INDEX idx_build_inspections_scheduled_date ON build_inspections(scheduled_date);
CREATE INDEX idx_build_checklists_category ON build_checklists(category);
CREATE INDEX idx_build_subcontractors_specialty ON build_subcontractors(specialty);

-- RLS Policies
CREATE POLICY "Users can view their own build tasks" ON build_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own build tasks" ON build_tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own build resources" ON build_resources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own build resources" ON build_resources
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own build milestones" ON build_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own build milestones" ON build_milestones
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own build issues" ON build_issues
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own build issues" ON build_issues
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own build inspections" ON build_inspections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own build inspections" ON build_inspections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own build checklists" ON build_checklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own build checklists" ON build_checklists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own build subcontractors" ON build_subcontractors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own build subcontractors" ON build_subcontractors
  FOR ALL USING (auth.uid() = user_id);