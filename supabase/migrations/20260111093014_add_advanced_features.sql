-- Advanced Features Migration for ATLVS + GVTEWAY Super App
-- Migration: 20260111093014_add_advanced_features

-- ============================================================================
-- ADVANCED SEARCH SYSTEM
-- ============================================================================

-- Global search index
CREATE TABLE search_index (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  searchable_content TSVECTOR,
  organization_id TEXT,
  visibility TEXT DEFAULT 'public',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search queries and analytics
CREATE TABLE search_queries (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  clicked_entity_type TEXT,
  clicked_entity_id TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CONTENT MODERATION SYSTEM
-- ============================================================================

-- Content moderation queue
CREATE TABLE content_moderation (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  flags JSONB DEFAULT '[]',
  automated_score DECIMAL(3,2),
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  decision TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- COMPLIANCE AND AUDIT SYSTEM
-- ============================================================================

-- Comprehensive audit log
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  compliance_flags JSONB DEFAULT '[]',
  retention_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- MONITORING AND LOGGING SYSTEM
-- ============================================================================

-- Application error logs
CREATE TABLE error_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  error_id TEXT UNIQUE,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  stack_trace TEXT,
  context JSONB DEFAULT '{}',
  user_id TEXT,
  session_id TEXT,
  url TEXT,
  user_agent TEXT,
  ip_address INET,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ADVANCED NOTIFICATION SYSTEM
-- ============================================================================

-- Notification templates
CREATE TABLE notification_templates (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  channels JSONB DEFAULT '["email"]',
  is_active BOOLEAN DEFAULT true,
  organization_id TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification queue
CREATE TABLE notification_queue (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  template_id TEXT,
  channel TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_search_index_entity ON search_index(entity_type, entity_id);
CREATE INDEX idx_search_queries_user ON search_queries(user_id);
CREATE INDEX idx_content_moderation_status ON content_moderation(status);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_error_logs_level ON error_logs(level);
CREATE INDEX idx_notification_queue_user ON notification_queue(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can search public content" ON search_index
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can manage their notification queue" ON notification_queue
  FOR ALL USING (user_id = auth.uid());
