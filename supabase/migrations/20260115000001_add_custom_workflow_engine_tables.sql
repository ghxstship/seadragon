-- Create custom workflow engine tables
-- Migration: 20260115000001_add_custom_workflow_engine_tables.sql

-- Workflow templates table
CREATE TABLE workflow_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  steps INTEGER DEFAULT 0,
  usage INTEGER DEFAULT 0,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'deprecated')),
  template_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow components table
CREATE TABLE workflow_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  inputs JSONB,
  outputs JSONB,
  version TEXT,
  compatibility JSONB,
  component_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow validation rules table
CREATE TABLE workflow_validation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule TEXT NOT NULL,
  type TEXT CHECK (type IN ('required', 'conditional', 'business')),
  message TEXT,
  severity TEXT DEFAULT 'error' CHECK (severity IN ('error', 'warning', 'info')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow instances table
CREATE TABLE workflow_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id TEXT NOT NULL, -- Reference to template or external workflow
  name TEXT NOT NULL,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'paused', 'cancelled')),
  started TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed TIMESTAMP WITH TIME ZONE,
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  assigned_to TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  instance_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow automation triggers table
CREATE TABLE workflow_automation_triggers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  condition TEXT NOT NULL,
  action TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  trigger_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow integrations table
CREATE TABLE workflow_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system TEXT NOT NULL,
  api TEXT,
  authentication TEXT,
  endpoints JSONB,
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'error', 'disabled')),
  integration_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow notifications table
CREATE TABLE workflow_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL,
  recipients JSONB,
  method TEXT,
  template TEXT,
  enabled BOOLEAN DEFAULT true,
  notification_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow performance metrics table
CREATE TABLE workflow_performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  average_completion DECIMAL(5,2),
  success_rate DECIMAL(5,2),
  user_adoption DECIMAL(5,2),
  automation_rate DECIMAL(5,2),
  bottleneck_steps JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow optimizations table
CREATE TABLE workflow_optimizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  improvement TEXT NOT NULL,
  impact TEXT,
  implementation TEXT,
  status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'in_progress', 'completed')),
  optimization_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow reports table
CREATE TABLE workflow_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report TEXT NOT NULL,
  frequency TEXT,
  recipients JSONB,
  format TEXT,
  last_generated TIMESTAMP WITH TIME ZONE,
  report_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow architecture infrastructure table
CREATE TABLE workflow_infrastructure (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hosting TEXT,
  scalability TEXT,
  backup TEXT,
  security TEXT,
  monitoring TEXT,
  infrastructure_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow APIs table
CREATE TABLE workflow_apis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  method TEXT,
  purpose TEXT,
  authentication TEXT,
  rate_limit TEXT,
  version TEXT,
  api_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow user roles table
CREATE TABLE workflow_user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  permissions JSONB,
  workflows JSONB,
  users INTEGER DEFAULT 0,
  description TEXT,
  role_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow user access table
CREATE TABLE workflow_user_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  role TEXT NOT NULL,
  workflows JSONB,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  access_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow training modules table
CREATE TABLE workflow_training_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module TEXT NOT NULL,
  required_for JSONB,
  completion_rate DECIMAL(5,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'current' CHECK (status IN ('current', 'outdated')),
  training_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow updates table
CREATE TABLE workflow_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  release_date DATE,
  changes JSONB,
  compatibility JSONB,
  status TEXT DEFAULT 'released' CHECK (status IN ('released', 'testing', 'planned')),
  update_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow support tickets table
CREATE TABLE workflow_support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  issue TEXT NOT NULL,
  priority TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved TIMESTAMP WITH TIME ZONE,
  ticket_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow documentation table
CREATE TABLE workflow_documentation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  doc_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Workflow monitoring alerts table
CREATE TABLE workflow_monitoring_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  condition TEXT NOT NULL,
  severity TEXT,
  last_triggered TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  alert_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_validation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_automation_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_infrastructure ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_user_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_monitoring_alerts ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_workflow_templates_user_id ON workflow_templates(user_id);
CREATE INDEX idx_workflow_components_user_id ON workflow_components(user_id);
CREATE INDEX idx_workflow_instances_user_id ON workflow_instances(user_id);
CREATE INDEX idx_workflow_instances_status ON workflow_instances(status);
CREATE INDEX idx_workflow_performance_metrics_user_id ON workflow_performance_metrics(user_id);
CREATE INDEX idx_workflow_user_access_user_id ON workflow_user_access(user_id);

-- RLS Policies
CREATE POLICY "Users can view their own workflow templates" ON workflow_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow templates" ON workflow_templates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow components" ON workflow_components
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow components" ON workflow_components
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow instances" ON workflow_instances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow instances" ON workflow_instances
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow automation triggers" ON workflow_automation_triggers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow automation triggers" ON workflow_automation_triggers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow integrations" ON workflow_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow integrations" ON workflow_integrations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow notifications" ON workflow_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow notifications" ON workflow_notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow performance metrics" ON workflow_performance_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow performance metrics" ON workflow_performance_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow optimizations" ON workflow_optimizations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow optimizations" ON workflow_optimizations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow reports" ON workflow_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow reports" ON workflow_reports
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow infrastructure" ON workflow_infrastructure
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow infrastructure" ON workflow_infrastructure
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow APIs" ON workflow_apis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow APIs" ON workflow_apis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow user roles" ON workflow_user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow user roles" ON workflow_user_roles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow user access" ON workflow_user_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow user access" ON workflow_user_access
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow training modules" ON workflow_training_modules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow training modules" ON workflow_training_modules
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow updates" ON workflow_updates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow updates" ON workflow_updates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow support tickets" ON workflow_support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow support tickets" ON workflow_support_tickets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow documentation" ON workflow_documentation
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow documentation" ON workflow_documentation
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workflow monitoring alerts" ON workflow_monitoring_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflow monitoring alerts" ON workflow_monitoring_alerts
  FOR ALL USING (auth.uid() = user_id);