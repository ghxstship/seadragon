-- Opus Zero White-Labeling Enhancement Migration
-- Adds feature toggles and terminology overrides to support full white-labeling

-- Add feature toggles to branding_settings
ALTER TABLE branding_settings
ADD COLUMN IF NOT EXISTS feature_toggles JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS terminology_overrides JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_css TEXT,
ADD COLUMN IF NOT EXISTS custom_js TEXT;

-- Create organization feature configurations table
CREATE TABLE organization_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  feature_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_org_features_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT unique_org_feature UNIQUE (organization_id, feature_name)
);

-- Create terminology overrides table for per-organization customization
CREATE TABLE terminology_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  key TEXT NOT NULL, -- e.g., 'task', 'project', 'workflow'
  singular TEXT NOT NULL,
  plural TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_terminology_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT unique_org_key UNIQUE (organization_id, key)
);

-- Enable RLS
ALTER TABLE organization_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminology_overrides ENABLE ROW LEVEL SECURITY;

-- Policies for organization features
DROP POLICY IF EXISTS "org_features_policy" ON organization_features;
CREATE POLICY "org_features_policy" ON organization_features
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Policies for terminology overrides
DROP POLICY IF EXISTS "terminology_policy" ON terminology_overrides;
CREATE POLICY "terminology_policy" ON terminology_overrides
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Insert default feature toggles for each organization
INSERT INTO organization_features (organization_id, feature_name, is_enabled, config)
SELECT
  o.id,
  feature_name,
  true as is_enabled,
  '{}'::jsonb as config
FROM organizations o
CROSS JOIN (
  VALUES
    ('dashboard'),
    ('calendar'),
    ('tasks'),
    ('workflows'),
    ('assets'),
    ('documents'),
    ('projects'),
    ('programming'),
    ('people'),
    ('products'),
    ('places'),
    ('procedures'),
    ('forecast'),
    ('pipeline'),
    ('work_orders'),
    ('content'),
    ('procurement'),
    ('compliance'),
    ('reports'),
    ('insights'),
    ('network'),
    ('ai_assistant'),
    ('mobile_app'),
    ('api_access'),
    ('white_labeling'),
    ('multi_org'),
    ('advanced_reporting'),
    ('custom_integrations')
) AS features(feature_name)
ON CONFLICT (organization_id, feature_name) DO NOTHING;

-- Insert default terminology for each organization
INSERT INTO terminology_overrides (organization_id, key, singular, plural, description)
SELECT
  o.id,
  key,
  singular,
  plural,
  description
FROM organizations o
CROSS JOIN (
  VALUES
    ('task', 'Task', 'Tasks', 'Work unit or activity'),
    ('project', 'Project', 'Projects', 'Top-level initiative'),
    ('workflow', 'Workflow', 'Workflows', 'Automated process'),
    ('asset', 'Asset', 'Assets', 'Equipment or resource'),
    ('document', 'Document', 'Documents', 'File or record'),
    ('work_order', 'Work Order', 'Work Orders', 'Operational execution'),
    ('programming', 'Programming', 'Programming', 'Event planning and scheduling'),
    ('people', 'Person', 'People', 'Staff and crew'),
    ('place', 'Venue', 'Venues', 'Location or site'),
    ('procedure', 'Procedure', 'Procedures', 'Standard operating procedure'),
    ('forecast', 'Forecast', 'Forecasts', 'Financial projection'),
    ('pipeline', 'Lead', 'Pipeline', 'Sales opportunity'),
    ('content', 'Content', 'Content', 'Creative deliverables'),
    ('procurement', 'Purchase', 'Procurement', 'Vendor and purchasing'),
    ('compliance', 'Compliance', 'Compliance', 'Regulatory requirements'),
    ('report', 'Report', 'Reports', 'Data analysis'),
    ('insight', 'Insight', 'Insights', 'AI-generated analysis')
) AS terms(key, singular, plural, description)
ON CONFLICT (organization_id, key) DO NOTHING;

-- Create indexes
CREATE INDEX idx_org_features_org_name ON organization_features(organization_id, feature_name);
CREATE INDEX idx_terminology_org_key ON terminology_overrides(organization_id, key);

-- Add triggers for updated_at
CREATE TRIGGER update_org_features_updated_at BEFORE UPDATE ON organization_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_terminology_updated_at BEFORE UPDATE ON terminology_overrides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
