-- Opus Zero RBAC/RLS Policies Migration
-- Implements comprehensive Row Level Security policies for all dashboard entities
-- Permission scopes: Platform, Organization, Project, Programming

-- ============================================================================
-- PERMISSION FUNCTIONS
-- ============================================================================

-- Function to check if user has specific permission at organization level
CREATE OR REPLACE FUNCTION has_org_permission(
  p_user_id UUID,
  p_organization_id UUID,
  p_permission TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_organizations uo
    JOIN roles r ON uo.role_id = r.id
    WHERE uo.user_id = p_user_id
      AND uo.organization_id = p_organization_id
      AND uo.is_active = true
      AND r.permissions ? p_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has project-level permission
CREATE OR REPLACE FUNCTION has_project_permission(
  p_user_id UUID,
  p_project_id UUID,
  p_permission TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM projects p
    JOIN user_organizations uo ON p.organization_id = uo.organization_id
    JOIN roles r ON uo.role_id = r.id
    WHERE p.id = p_project_id
      AND uo.user_id = p_user_id
      AND uo.is_active = true
      AND (r.permissions ? p_permission OR r.permissions ? 'project_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has programming-level permission
CREATE OR REPLACE FUNCTION has_programming_permission(
  p_user_id UUID,
  p_programming_id UUID,
  p_permission TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM programming pr
    JOIN projects p ON pr.project_id = p.id
    JOIN user_organizations uo ON p.organization_id = uo.organization_id
    JOIN roles r ON uo.role_id = r.id
    WHERE pr.id = p_programming_id
      AND uo.user_id = p_user_id
      AND uo.is_active = true
      AND (r.permissions ? p_permission OR r.permissions ? 'programming_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role in organization
CREATE OR REPLACE FUNCTION get_user_org_role(
  p_user_id UUID,
  p_organization_id UUID
) RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT r.name INTO user_role
  FROM user_organizations uo
  JOIN roles r ON uo.role_id = r.id
  WHERE uo.user_id = p_user_id
    AND uo.organization_id = p_organization_id
    AND uo.is_active = true;

  RETURN COALESCE(user_role, '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DASHBOARD CONFIGS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "dashboard_configs_policy" ON dashboard_configs;
CREATE POLICY "dashboard_configs_policy" ON dashboard_configs
  FOR ALL USING (
    -- Organization admins can manage all configs
    has_org_permission(auth.uid(), organization_id, 'org_admin') OR
    -- Users can view/modify their own configs
    (user_id = auth.uid() AND has_org_permission(auth.uid(), organization_id, 'dashboard_view')) OR
    -- Role-based configs can be viewed by users with that role
    (user_id IS NULL AND has_org_permission(auth.uid(), organization_id, 'dashboard_view'))
  );

-- ============================================================================
-- CALENDAR EVENTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "calendar_events_policy" ON calendar_events;
CREATE POLICY "calendar_events_policy" ON calendar_events
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'calendar_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'calendar_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- TASKS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "tasks_policy" ON tasks;
CREATE POLICY "tasks_policy" ON tasks
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'tasks_view') OR
    assigned_to @> ARRAY[auth.uid()] OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'tasks_edit') OR
    created_by = auth.uid() OR
    assigned_to @> ARRAY[auth.uid()]
  );

-- ============================================================================
-- WORKFLOWS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "workflows_policy" ON workflows;
CREATE POLICY "workflows_policy" ON workflows
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'workflows_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'workflows_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- ASSETS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "assets_policy" ON assets;
CREATE POLICY "assets_policy" ON assets
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'assets_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'assets_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- DOCUMENTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "documents_policy" ON documents;
CREATE POLICY "documents_policy" ON documents
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'documents_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'documents_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "projects_policy" ON projects;
CREATE POLICY "projects_policy" ON projects
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'projects_view') OR
    manager_id = auth.uid() OR
    team_members @> ARRAY[auth.uid()]
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'projects_edit') OR
    manager_id = auth.uid() OR
    created_by = auth.uid()
  );

-- ============================================================================
-- PROGRAMMING POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "programming_policy" ON programming;
CREATE POLICY "programming_policy" ON programming
  FOR ALL USING (
    has_project_permission(auth.uid(), project_id, 'programming_view') OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_project_permission(auth.uid(), project_id, 'programming_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- PEOPLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "people_policy" ON people;
CREATE POLICY "people_policy" ON people
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'people_view') OR
    user_id = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'people_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- PRODUCTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "products_policy" ON products;
CREATE POLICY "products_policy" ON products
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'products_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'products_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- PLACES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "places_policy" ON places;
CREATE POLICY "places_policy" ON places
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'places_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'places_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- PROCEDURES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "procedures_policy" ON procedures;
CREATE POLICY "procedures_policy" ON procedures
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'procedures_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'procedures_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- FORECASTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "forecasts_policy" ON forecasts;
CREATE POLICY "forecasts_policy" ON forecasts
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'forecasts_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'forecasts_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- PIPELINE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "pipeline_policy" ON pipeline_items;
CREATE POLICY "pipeline_policy" ON pipeline_items
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'pipeline_view') OR
    assigned_to = auth.uid() OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'pipeline_edit') OR
    assigned_to = auth.uid() OR
    created_by = auth.uid()
  );

-- ============================================================================
-- WORK ORDERS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "work_orders_policy" ON work_orders;
CREATE POLICY "work_orders_policy" ON work_orders
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'work_orders_view') OR
    created_by = auth.uid() OR
    assigned_crew @> ARRAY[auth.uid()]
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'work_orders_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- CONTENT ITEMS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "content_policy" ON content_items;
CREATE POLICY "content_policy" ON content_items
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'content_view') OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'content_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- PROCUREMENT POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "procurement_policy" ON procurement_items;
CREATE POLICY "procurement_policy" ON procurement_items
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'procurement_view') OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'procurement_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- COMPLIANCE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "compliance_policy" ON compliance_items;
CREATE POLICY "compliance_policy" ON compliance_items
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'compliance_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'compliance_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- REPORTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "reports_policy" ON reports;
CREATE POLICY "reports_policy" ON reports
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'reports_view') OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'reports_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- INSIGHTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "insights_policy" ON insights;
CREATE POLICY "insights_policy" ON insights
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'insights_view')
  );

-- ============================================================================
-- NETWORK POLICIES (Marketplace, Opportunities, etc.)
-- ============================================================================

DROP POLICY IF EXISTS "marketplace_policy" ON marketplace_listings;
CREATE POLICY "marketplace_policy" ON marketplace_listings
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'network_view') OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'network_edit') OR
    created_by = auth.uid()
  );

DROP POLICY IF EXISTS "opportunities_policy" ON opportunities;
CREATE POLICY "opportunities_policy" ON opportunities
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'network_view') OR
    assigned_to = auth.uid() OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'network_edit') OR
    assigned_to = auth.uid() OR
    created_by = auth.uid()
  );

DROP POLICY IF EXISTS "discussions_policy" ON discussions;
CREATE POLICY "discussions_policy" ON discussions
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'network_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'network_edit') OR
    created_by = auth.uid()
  );

DROP POLICY IF EXISTS "connections_policy" ON connections;
CREATE POLICY "connections_policy" ON connections
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'network_view')
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'network_edit') OR
    created_by = auth.uid()
  );

DROP POLICY IF EXISTS "showcases_policy" ON showcases;
CREATE POLICY "showcases_policy" ON showcases
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'network_view') OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'network_edit') OR
    created_by = auth.uid()
  );

DROP POLICY IF EXISTS "challenges_policy" ON challenges;
CREATE POLICY "challenges_policy" ON challenges
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'network_view') OR
    created_by = auth.uid()
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'network_edit') OR
    created_by = auth.uid()
  );

-- ============================================================================
-- ACCOUNT POLICIES (Knowledge Base, System Configs, Support)
-- ============================================================================

DROP POLICY IF EXISTS "knowledge_base_policy" ON knowledge_base;
CREATE POLICY "knowledge_base_policy" ON knowledge_base
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'resources_view') OR
    is_public = true
  )
  WITH CHECK (
    has_org_permission(auth.uid(), organization_id, 'resources_edit') OR
    created_by = auth.uid()
  );

DROP POLICY IF EXISTS "system_configs_policy" ON system_configs;
CREATE POLICY "system_configs_policy" ON system_configs
  FOR ALL USING (
    has_org_permission(auth.uid(), organization_id, 'system_admin')
  );

DROP POLICY IF EXISTS "support_tickets_policy" ON support_tickets;
CREATE POLICY "support_tickets_policy" ON support_tickets
  FOR ALL USING (
    user_id = auth.uid() OR
    has_org_permission(auth.uid(), organization_id, 'support_view') OR
    assigned_to = auth.uid()
  )
  WITH CHECK (
    user_id = auth.uid() OR
    has_org_permission(auth.uid(), organization_id, 'support_edit')
  );

-- ============================================================================
-- DEFAULT PERMISSIONS SETUP
-- ============================================================================

-- Insert default roles with permissions if they don't exist
INSERT INTO roles (name, description, organization_id, permissions) VALUES
('platform_admin', 'Full platform access', (SELECT id FROM organizations LIMIT 1), '[
  "platform_admin", "org_admin", "project_admin", "programming_admin",
  "dashboard_view", "dashboard_edit", "calendar_view", "calendar_edit",
  "tasks_view", "tasks_edit", "workflows_view", "workflows_edit",
  "assets_view", "assets_edit", "documents_view", "documents_edit",
  "projects_view", "projects_edit", "programming_view", "programming_edit",
  "people_view", "people_edit", "products_view", "products_edit",
  "places_view", "places_edit", "procedures_view", "procedures_edit",
  "forecasts_view", "forecasts_edit", "pipeline_view", "pipeline_edit",
  "work_orders_view", "work_orders_edit", "content_view", "content_edit",
  "procurement_view", "procurement_edit", "compliance_view", "compliance_edit",
  "reports_view", "reports_edit", "insights_view",
  "network_view", "network_edit", "resources_view", "resources_edit",
  "system_admin", "support_view", "support_edit"
]'::jsonb)
ON CONFLICT (name, organization_id) DO NOTHING;

INSERT INTO roles (name, description, organization_id, permissions) VALUES
('org_admin', 'Organization administrator', (SELECT id FROM organizations LIMIT 1), '[
  "org_admin", "dashboard_view", "dashboard_edit", "calendar_view", "calendar_edit",
  "tasks_view", "tasks_edit", "workflows_view", "workflows_edit",
  "assets_view", "assets_edit", "documents_view", "documents_edit",
  "projects_view", "projects_edit", "programming_view", "programming_edit",
  "people_view", "people_edit", "products_view", "products_edit",
  "places_view", "places_edit", "procedures_view", "procedures_edit",
  "forecasts_view", "forecasts_edit", "pipeline_view", "pipeline_edit",
  "work_orders_view", "work_orders_edit", "content_view", "content_edit",
  "procurement_view", "procurement_edit", "compliance_view", "compliance_edit",
  "reports_view", "reports_edit", "insights_view",
  "network_view", "network_edit", "resources_view", "resources_edit",
  "support_view", "support_edit"
]'::jsonb)
ON CONFLICT (name, organization_id) DO NOTHING;

INSERT INTO roles (name, description, organization_id, permissions) VALUES
('project_manager', 'Project manager', (SELECT id FROM organizations LIMIT 1), '[
  "project_admin", "dashboard_view", "calendar_view", "calendar_edit",
  "tasks_view", "tasks_edit", "workflows_view", "workflows_edit",
  "assets_view", "documents_view", "documents_edit",
  "projects_view", "projects_edit", "programming_view", "programming_edit",
  "people_view", "work_orders_view", "work_orders_edit",
  "content_view", "content_edit", "reports_view"
]'::jsonb)
ON CONFLICT (name, organization_id) DO NOTHING;

INSERT INTO roles (name, description, organization_id, permissions) VALUES
('crew_member', 'Crew member', (SELECT id FROM organizations LIMIT 1), '[
  "dashboard_view", "calendar_view", "tasks_view", "assets_view",
  "documents_view", "projects_view", "programming_view", "people_view",
  "work_orders_view", "content_view", "resources_view"
]'::jsonb)
ON CONFLICT (name, organization_id) DO NOTHING;
