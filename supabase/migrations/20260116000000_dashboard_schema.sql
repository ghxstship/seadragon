-- Opus Zero Dashboard Schema Migration
-- Implements comprehensive 3NF database schema for authenticated pages
-- Enforces single source of truth and relational integrity

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Dashboard configurations (role-based widget layouts)
CREATE TABLE dashboard_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID, -- NULL for organization-wide configs
  role TEXT NOT NULL, -- role-based configs
  name TEXT NOT NULL,
  widgets JSONB NOT NULL DEFAULT '[]', -- widget configurations
  layout JSONB NOT NULL DEFAULT '{}', -- layout settings
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_dashboard_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_dashboard_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_org_role_config UNIQUE (organization_id, role, name)
);

-- Calendar events (unified scheduling)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  event_type TEXT NOT NULL, -- 'task', 'programming', 'work_order', 'asset_booking', 'people_availability'
  entity_id UUID NOT NULL, -- references the actual entity
  entity_type TEXT NOT NULL,
  location_id UUID, -- references places
  assigned_users UUID[] DEFAULT '{}', -- array of user IDs
  status TEXT DEFAULT 'scheduled',
  recurrence JSONB, -- recurrence rules
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_calendar_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_calendar_location FOREIGN KEY (location_id) REFERENCES places(id),
  CONSTRAINT fk_calendar_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tasks (atomic work units)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'completed', 'cancelled'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  assigned_to UUID[], -- array of user IDs
  project_id UUID,
  programming_id UUID,
  work_order_id UUID,
  workflow_id UUID,
  dependencies UUID[] DEFAULT '{}', -- task IDs this depends on
  due_date TIMESTAMPTZ,
  estimated_hours DECIMAL(6,2),
  actual_hours DECIMAL(6,2),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_task_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_task_programming FOREIGN KEY (programming_id) REFERENCES programming(id),
  CONSTRAINT fk_task_workorder FOREIGN KEY (work_order_id) REFERENCES work_orders(id),
  CONSTRAINT fk_task_workflow FOREIGN KEY (workflow_id) REFERENCES workflows(id),
  CONSTRAINT fk_task_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Workflows (automation logic)
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- 'manual', 'schedule', 'event', 'condition'
  trigger_config JSONB NOT NULL DEFAULT '{}',
  steps JSONB NOT NULL DEFAULT '[]', -- workflow steps configuration
  conditions JSONB DEFAULT '[]', -- execution conditions
  approvals_required JSONB DEFAULT '[]', -- approval chains
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_workflow_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_workflow_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Assets (physical + digital)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  asset_type TEXT NOT NULL, -- 'equipment', 'vehicle', 'file', 'software', 'other'
  category TEXT,
  serial_number TEXT,
  barcode TEXT,
  location_id UUID, -- current location
  status TEXT DEFAULT 'available', -- 'available', 'in_use', 'maintenance', 'retired'
  condition TEXT DEFAULT 'good', -- 'excellent', 'good', 'fair', 'poor'
  purchase_date DATE,
  purchase_cost DECIMAL(12,2),
  depreciation_method TEXT,
  useful_life_years INTEGER,
  current_value DECIMAL(12,2),
  maintenance_schedule JSONB DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  attachments UUID[] DEFAULT '{}', -- document IDs
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_asset_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_asset_location FOREIGN KEY (location_id) REFERENCES places(id),
  CONSTRAINT fk_asset_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Documents (versioned files)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL, -- 'contract', 'permit', 'plan', 'media', 'other'
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  version INTEGER DEFAULT 1,
  parent_document_id UUID, -- for versioning
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved', 'archived'
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  linked_entities JSONB DEFAULT '{}', -- {entity_type: entity_id} pairs
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_document_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_document_parent FOREIGN KEY (parent_document_id) REFERENCES documents(id),
  CONSTRAINT fk_document_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================================
-- TEAM ENTITIES
-- ============================================================================

-- Projects (top-level initiatives)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning', -- 'planning', 'active', 'on_hold', 'completed', 'cancelled'
  priority TEXT DEFAULT 'medium',
  budget DECIMAL(15,2),
  start_date DATE,
  end_date DATE,
  manager_id UUID,
  team_members UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_project_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_manager FOREIGN KEY (manager_id) REFERENCES users(id),
  CONSTRAINT fk_project_creator FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT unique_org_project_slug UNIQUE (organization_id, slug)
);

-- Programming (event programming and planning)
CREATE TABLE programming (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  event_date DATE,
  event_time TIME,
  duration INTERVAL,
  venue_id UUID,
  lineup JSONB DEFAULT '[]', -- artist/performer schedule
  run_of_show JSONB DEFAULT '[]', -- detailed schedule
  technical_requirements JSONB DEFAULT '{}',
  staffing_requirements JSONB DEFAULT '{}',
  budget_breakdown JSONB DEFAULT '{}',
  status TEXT DEFAULT 'planning',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_programming_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_programming_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_programming_venue FOREIGN KEY (venue_id) REFERENCES places(id),
  CONSTRAINT fk_programming_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- People (crew, staff, vendors, talent)
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID, -- if internal user
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL, -- 'crew', 'staff', 'vendor', 'talent', 'contractor'
  department TEXT,
  certifications TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  availability_schedule JSONB DEFAULT '{}',
  rate_hourly DECIMAL(8,2),
  rate_daily DECIMAL(8,2),
  emergency_contact JSONB DEFAULT '{}',
  insurance_info JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'terminated'
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_person_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_person_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_person_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Products (sellable/rentable items)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  description TEXT,
  product_type TEXT NOT NULL, -- 'physical', 'digital', 'service', 'rental'
  category TEXT,
  price DECIMAL(10,2),
  cost DECIMAL(10,2),
  inventory_count INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  supplier_info JSONB DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_product_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_creator FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT unique_org_sku UNIQUE (organization_id, sku)
);

-- Places (venues, sites, locations)
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  address JSONB NOT NULL,
  place_type TEXT NOT NULL, -- 'venue', 'office', 'warehouse', 'event_space'
  capacity INTEGER,
  amenities TEXT[] DEFAULT '{}',
  accessibility_features TEXT[] DEFAULT '{}',
  parking_info TEXT,
  technical_specs JSONB DEFAULT '{}',
  rental_rates JSONB DEFAULT '{}',
  availability_calendar JSONB DEFAULT '{}',
  permits_required TEXT[] DEFAULT '{}',
  insurance_requirements TEXT,
  contact_info JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_place_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_place_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Procedures (SOPs and playbooks)
CREATE TABLE procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  procedure_type TEXT NOT NULL, -- 'sop', 'emergency', 'playbook', 'standard'
  category TEXT,
  version TEXT DEFAULT '1.0',
  content JSONB NOT NULL, -- structured procedure content
  tags TEXT[] DEFAULT '{}',
  required_roles TEXT[] DEFAULT '{}', -- roles that must know this
  review_cycle_months INTEGER DEFAULT 12,
  last_reviewed DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_procedure_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_procedure_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================================
-- MANAGEMENT ENTITIES
-- ============================================================================

-- Forecast (financial forecasts)
CREATE TABLE forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  forecast_type TEXT NOT NULL, -- 'revenue', 'expense', 'resource', 'capacity'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  scenario TEXT DEFAULT 'baseline', -- 'worst_case', 'best_case', 'baseline'
  data JSONB NOT NULL, -- forecast data points
  assumptions JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_forecast_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_forecast_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Pipeline (leads, bids, deals)
CREATE TABLE pipeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL, -- 'lead', 'bid', 'proposal', 'deal'
  stage TEXT NOT NULL, -- 'prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  value DECIMAL(15,2),
  probability DECIMAL(5,2), -- 0-100
  expected_close_date DATE,
  contact_info JSONB DEFAULT '{}',
  requirements JSONB DEFAULT '{}',
  competitors TEXT[] DEFAULT '{}',
  next_steps TEXT,
  assigned_to UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_pipeline_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_pipeline_assigned FOREIGN KEY (assigned_to) REFERENCES users(id),
  CONSTRAINT fk_pipeline_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Work Orders (executable operational work)
CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  work_order_type TEXT NOT NULL, -- 'setup', 'maintenance', 'event_support', 'logistics'
  project_id UUID,
  programming_id UUID,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'planned', -- 'planned', 'scheduled', 'in_progress', 'completed', 'cancelled'
  start_date DATE,
  end_date DATE,
  estimated_duration INTERVAL,
  actual_duration INTERVAL,
  location_id UUID,
  assigned_crew UUID[] DEFAULT '{}',
  assigned_assets UUID[] DEFAULT '{}',
  tasks UUID[] DEFAULT '{}',
  cost_estimate DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  materials_required JSONB DEFAULT '{}',
  safety_requirements TEXT,
  permits_required UUID[] DEFAULT '{}', -- compliance IDs
  call_time TIMETZ,
  wrap_time TIMETZ,
  pay_rates JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_workorder_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_workorder_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_workorder_programming FOREIGN KEY (programming_id) REFERENCES programming(id),
  CONSTRAINT fk_workorder_location FOREIGN KEY (location_id) REFERENCES places(id),
  CONSTRAINT fk_workorder_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Content (operational creative content)
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'media', 'deliverable', 'collateral', 'documentation'
  project_id UUID,
  programming_id UUID,
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_content_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_content_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_content_programming FOREIGN KEY (programming_id) REFERENCES programming(id),
  CONSTRAINT fk_content_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Procurement (vendors, purchasing, POs)
CREATE TABLE procurement_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'purchase_order', 'contract', 'vendor', 'requisition'
  vendor_id UUID,
  status TEXT DEFAULT 'draft', -- 'draft', 'approved', 'ordered', 'received', 'cancelled'
  total_value DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  items JSONB DEFAULT '[]', -- line items
  delivery_date DATE,
  terms TEXT,
  approvals_required UUID[] DEFAULT '{}',
  approvals_received UUID[] DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_procurement_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_procurement_vendor FOREIGN KEY (vendor_id) REFERENCES people(id),
  CONSTRAINT fk_procurement_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Compliance (permits, insurance, certifications)
CREATE TABLE compliance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  compliance_type TEXT NOT NULL, -- 'permit', 'insurance', 'certification', 'license'
  entity_id UUID, -- place, work_order, asset, etc.
  entity_type TEXT,
  issuer TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'pending', 'revoked'
  requirements JSONB DEFAULT '{}',
  documents UUID[] DEFAULT '{}', -- document IDs
  renewal_reminders JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_compliance_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_compliance_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Reports (cross-module reporting)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'financial', 'operational', 'compliance', 'performance'
  config JSONB NOT NULL, -- report configuration
  schedule JSONB, -- automated schedule
  last_run TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_report_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_report_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insights (advanced analytics)
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  insight_type TEXT NOT NULL, -- 'trend', 'anomaly', 'prediction', 'recommendation'
  data JSONB NOT NULL,
  confidence DECIMAL(5,2), -- 0-100
  impact TEXT, -- 'high', 'medium', 'low'
  recommendations TEXT[],
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_by UUID, -- NULL for automated insights
  CONSTRAINT fk_insight_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_insight_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================================
-- NETWORK & ACCOUNT ENTITIES
-- ============================================================================

-- Network marketplace
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL, -- 'service', 'venue', 'equipment', 'talent'
  category TEXT,
  pricing JSONB DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  requirements TEXT,
  contact_info JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_marketplace_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_marketplace_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Network opportunities
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  opportunity_type TEXT NOT NULL, -- 'collaboration', 'partnership', 'referral', 'investment'
  stage TEXT DEFAULT 'identified', -- 'identified', 'contacted', 'negotiating', 'agreed', 'completed'
  value DECIMAL(15,2),
  contacts JSONB DEFAULT '{}',
  requirements TEXT,
  timeline TEXT,
  assigned_to UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_opportunity_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_opportunity_assigned FOREIGN KEY (assigned_to) REFERENCES users(id),
  CONSTRAINT fk_opportunity_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Network discussions
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  discussion_type TEXT NOT NULL, -- 'question', 'collaboration', 'feedback', 'announcement'
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  replies_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_discussion_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_discussion_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Network connections
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  connected_organization_id UUID NOT NULL,
  connection_type TEXT NOT NULL, -- 'partner', 'supplier', 'client', 'competitor'
  status TEXT DEFAULT 'active', -- 'active', 'pending', 'inactive'
  relationship_details JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_connection_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_connection_connected_org FOREIGN KEY (connected_organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_connection_creator FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT unique_org_connection UNIQUE (organization_id, connected_organization_id)
);

-- Showcases
CREATE TABLE showcases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  showcase_type TEXT NOT NULL, -- 'project', 'event', 'capability', 'achievement'
  media_urls TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_showcase_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_showcase_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL, -- 'innovation', 'collaboration', 'competition'
  requirements TEXT,
  prize_info JSONB DEFAULT '{}',
  deadline DATE,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
  participants UUID[] DEFAULT '{}',
  winner UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_challenge_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_challenge_winner FOREIGN KEY (winner) REFERENCES users(id),
  CONSTRAINT fk_challenge_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ============================================================================
-- ACCOUNT ENTITIES (Profile, Organization, Billing, etc. already exist in base schema)
-- ============================================================================

-- History/Audit logs (already exists as activities)

-- Resources/Knowledge base
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  attachments UUID[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_kb_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_kb_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- System configuration (role definitions, permissions)
CREATE TABLE system_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  config_type TEXT NOT NULL, -- 'roles', 'permissions', 'features', 'integrations'
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  is_system_default BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_sysconfig_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_sysconfig_creator FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT unique_org_config UNIQUE (organization_id, config_type, config_key)
);

-- Support tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'waiting', 'resolved', 'closed'
  category TEXT,
  assigned_to UUID,
  resolution TEXT,
  attachments UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_ticket_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ticket_assigned FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Core entity indexes
CREATE INDEX idx_dashboard_configs_org_role ON dashboard_configs(organization_id, role);
CREATE INDEX idx_calendar_events_org_start ON calendar_events(organization_id, start_time);
CREATE INDEX idx_tasks_org_status ON tasks(organization_id, status);
CREATE INDEX idx_tasks_assigned ON tasks USING GIN(assigned_to);
CREATE INDEX idx_assets_org_type ON assets(organization_id, asset_type);
CREATE INDEX idx_documents_org_type ON documents(organization_id, document_type);

-- Team entity indexes
CREATE INDEX idx_projects_org_status ON projects(organization_id, status);
CREATE INDEX idx_programming_project_date ON programming(project_id, event_date);
CREATE INDEX idx_people_org_role ON people(organization_id, role);
CREATE INDEX idx_products_org_category ON products(organization_id, category);
CREATE INDEX idx_places_org_type ON places(organization_id, place_type);

-- Management entity indexes
CREATE INDEX idx_work_orders_org_status ON work_orders(organization_id, status);
CREATE INDEX idx_procurement_org_status ON procurement_items(organization_id, status);
CREATE INDEX idx_compliance_org_type ON compliance_items(organization_id, compliance_type);

-- Network entity indexes
CREATE INDEX idx_marketplace_org_type ON marketplace_listings(organization_id, listing_type);
CREATE INDEX idx_opportunities_org_stage ON opportunities(organization_id, stage);

-- Account entity indexes
CREATE INDEX idx_kb_org_category ON knowledge_base(organization_id, category);
CREATE INDEX idx_tickets_org_status ON support_tickets(organization_id, status);

-- ============================================================================
-- RLS POLICIES (Row Level Security)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE programming ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Create policies (detailed RBAC policies will be implemented in separate migration)
-- Basic organization-level access policy template
CREATE POLICY "org_access_policy" ON dashboard_configs
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Apply similar policies to all tables (implementation details in RBAC migration)

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_dashboard_configs_updated_at BEFORE UPDATE ON dashboard_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programming_updated_at BEFORE UPDATE ON programming FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON places FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forecasts_updated_at BEFORE UPDATE ON forecasts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pipeline_items_updated_at BEFORE UPDATE ON pipeline_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procurement_items_updated_at BEFORE UPDATE ON procurement_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_items_updated_at BEFORE UPDATE ON compliance_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_listings_updated_at BEFORE UPDATE ON marketplace_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_showcases_updated_at BEFORE UPDATE ON showcases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_configs_updated_at BEFORE UPDATE ON system_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
