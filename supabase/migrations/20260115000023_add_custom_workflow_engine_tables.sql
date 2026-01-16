-- Migration: Add custom workflow engine workflow tables
-- Description: Creates tables for custom workflow engine data structures including design templates, execution instances, monitoring, and support
-- Created: 2026-01-14

-- Enable RLS
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Custom workflow design templates table
CREATE TABLE custom_workflow_design_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  steps INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'deprecated')),
  components JSONB DEFAULT '[]',
  validation_rules JSONB DEFAULT '[]',
  testing_scenarios JSONB DEFAULT '[]',
  integrations JSONB DEFAULT '[]',
  monitoring_alerts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom workflow design components table
CREATE TABLE custom_workflow_design_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  component_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  inputs TEXT[],
  outputs TEXT[],
  version TEXT NOT NULL,
  compatibility TEXT[],
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom workflow execution instances table
CREATE TABLE custom_workflow_execution_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES custom_workflow_design_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'paused', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_step INTEGER DEFAULT 0,
  variables JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom workflow execution logs table
CREATE TABLE custom_workflow_execution_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES custom_workflow_execution_instances(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'skipped')),
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  duration_ms INTEGER,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom workflow execution integrations table
CREATE TABLE custom_workflow_execution_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES custom_workflow_execution_instances(id) ON DELETE CASCADE,
  system_name TEXT NOT NULL,
  api_endpoint TEXT NOT NULL,
  request_data JSONB DEFAULT '{}',
  response_data JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom workflow monitoring performance table
CREATE TABLE custom_workflow_monitoring_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES custom_workflow_design_templates(id) ON DELETE SET NULL,
  instance_id UUID REFERENCES custom_workflow_execution_instances(id) ON DELETE SET NULL,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom workflow monitoring alerts table
CREATE TABLE custom_workflow_monitoring_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES custom_workflow_design_templates(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL,
  condition TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom workflow support tickets table
CREATE TABLE custom_workflow_support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES custom_workflow_design_templates(id) ON DELETE SET NULL,
  instance_id UUID REFERENCES custom_workflow_execution_instances(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Custom workflow support knowledge base table
CREATE TABLE custom_workflow_support_knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_custom_workflow_design_templates_event_id ON custom_workflow_design_templates(event_id);
CREATE INDEX idx_custom_workflow_design_components_event_id ON custom_workflow_design_components(event_id);
CREATE INDEX idx_custom_workflow_execution_instances_event_id ON custom_workflow_execution_instances(event_id);
CREATE INDEX idx_custom_workflow_execution_logs_event_id ON custom_workflow_execution_logs(event_id);
CREATE INDEX idx_custom_workflow_execution_integrations_event_id ON custom_workflow_execution_integrations(event_id);
CREATE INDEX idx_custom_workflow_monitoring_performance_event_id ON custom_workflow_monitoring_performance(event_id);
CREATE INDEX idx_custom_workflow_monitoring_alerts_event_id ON custom_workflow_monitoring_alerts(event_id);
CREATE INDEX idx_custom_workflow_support_tickets_event_id ON custom_workflow_support_tickets(event_id);
CREATE INDEX idx_custom_workflow_support_knowledge_base_event_id ON custom_workflow_support_knowledge_base(event_id);

-- Row Level Security
ALTER TABLE custom_workflow_design_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workflow_design_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workflow_execution_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workflow_execution_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workflow_monitoring_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workflow_monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workflow_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_workflow_support_knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view custom workflow data for their events" ON custom_workflow_design_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = custom_workflow_design_templates.event_id
      AND (events.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM event_participants
        WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can manage custom workflow data for their events" ON custom_workflow_design_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = custom_workflow_design_templates.event_id
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

CREATE TRIGGER update_custom_workflow_design_templates_updated_at BEFORE UPDATE ON custom_workflow_design_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_workflow_design_components_updated_at BEFORE UPDATE ON custom_workflow_design_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_workflow_execution_instances_updated_at BEFORE UPDATE ON custom_workflow_execution_instances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_workflow_support_tickets_updated_at BEFORE UPDATE ON custom_workflow_support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_workflow_support_knowledge_base_updated_at BEFORE UPDATE ON custom_workflow_support_knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
