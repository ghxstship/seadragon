-- Create archive phase tables
-- Migration: 20260115000009_add_archive_phase_tables.sql

-- Data archiving content table
CREATE TABLE archive_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  location TEXT,
  size_bytes BIGINT,
  format TEXT,
  archived BOOLEAN DEFAULT false,
  backup BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data archiving databases table
CREATE TABLE archive_databases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  database_name TEXT NOT NULL,
  record_count INTEGER DEFAULT 0,
  size_bytes BIGINT,
  archived BOOLEAN DEFAULT false,
  retention_period TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data archiving media table
CREATE TABLE archive_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_type TEXT NOT NULL,
  file_count INTEGER DEFAULT 0,
  total_size_bytes BIGINT,
  storage_location TEXT,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Long-term storage table
CREATE TABLE archive_storage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_type TEXT NOT NULL CHECK (storage_type IN ('primary', 'backup', 'disaster_recovery')),
  provider TEXT NOT NULL,
  location TEXT,
  redundancy TEXT,
  access_time TEXT,
  cost_per_month DECIMAL(10,2) DEFAULT 0,
  frequency TEXT,
  last_backup TIMESTAMP WITH TIME ZONE,
  verified BOOLEAN DEFAULT false,
  plan TEXT,
  tested_at TIMESTAMP WITH TIME ZONE,
  rto TEXT,
  rpo TEXT,
  dr_status TEXT DEFAULT 'current' CHECK (dr_status IN ('current', 'outdated', 'testing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance regulations table
CREATE TABLE archive_compliance_regulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  regulation TEXT NOT NULL,
  applicable BOOLEAN DEFAULT false,
  retention_period TEXT,
  requirements JSONB,
  compliance_status TEXT DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'review', 'non-compliant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance data classification table
CREATE TABLE archive_data_classification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  sensitivity TEXT DEFAULT 'internal' CHECK (sensitivity IN ('public', 'internal', 'confidential', 'restricted')),
  retention TEXT,
  disposal_method TEXT,
  access_levels JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance audits table
CREATE TABLE archive_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_type TEXT NOT NULL,
  last_audit TIMESTAMP WITH TIME ZONE,
  next_audit TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('passed', 'issues', 'pending')),
  findings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data cleanup temporary files table
CREATE TABLE archive_cleanup_temporary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  file_count INTEGER DEFAULT 0,
  size_bytes BIGINT,
  age_criteria TEXT,
  deleted BOOLEAN DEFAULT false,
  cleanup_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data cleanup duplicates table
CREATE TABLE archive_cleanup_duplicates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  duplicate_count INTEGER DEFAULT 0,
  size_bytes BIGINT,
  resolution TEXT DEFAULT 'pending' CHECK (resolution IN ('merged', 'deleted', 'pending')),
  cleanup_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data cleanup obsolete data table
CREATE TABLE archive_cleanup_obsolete (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  record_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE,
  retention_met BOOLEAN DEFAULT false,
  scheduled_deletion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data cleanup verification table
CREATE TABLE archive_cleanup_verification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  checksums_enabled BOOLEAN DEFAULT false,
  integrity_status TEXT DEFAULT 'pending' CHECK (integrity_status IN ('verified', 'issues', 'pending')),
  last_check TIMESTAMP WITH TIME ZONE,
  issues_found JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Archive organization structure table
CREATE TABLE archive_organization_structure (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  subcategories JSONB,
  naming_convention TEXT,
  access_levels JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Archive organization indexing table
CREATE TABLE archive_organization_indexing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  index_type TEXT NOT NULL,
  fields_indexed JSONB,
  searchable BOOLEAN DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Archive organization metadata table
CREATE TABLE archive_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  tags JSONB,
  description TEXT,
  created_date TIMESTAMP WITH TIME ZONE,
  modified_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Access management permissions table
CREATE TABLE archive_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name TEXT NOT NULL,
  users_list JSONB,
  access_permissions JSONB,
  access_restrictions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Access management audit logs table
CREATE TABLE archive_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  action_performed TEXT NOT NULL,
  resource_accessed TEXT,
  action_timestamp TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Access management encryption table
CREATE TABLE archive_encryption (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  encryption_method TEXT NOT NULL,
  key_management TEXT,
  rotation_policy TEXT,
  compliance_status TEXT DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'review', 'non-compliant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Final verification completeness table
CREATE TABLE archive_verification_completeness (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  required_items JSONB,
  present_items JSONB,
  missing_items JSONB,
  verification_status TEXT DEFAULT 'incomplete' CHECK (verification_status IN ('complete', 'incomplete', 'verified')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Final verification integrity table
CREATE TABLE archive_verification_integrity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  component TEXT NOT NULL,
  test_performed TEXT,
  test_result TEXT DEFAULT 'passed' CHECK (test_result IN ('passed', 'failed', 'warning')),
  test_details TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Final verification accessibility table
CREATE TABLE archive_verification_accessibility (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  archive_location TEXT NOT NULL,
  test_performed TEXT,
  test_result TEXT DEFAULT 'accessible' CHECK (test_result IN ('accessible', 'issues', 'inaccessible')),
  resolution_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE archive_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_compliance_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_data_classification ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_cleanup_temporary ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_cleanup_duplicates ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_cleanup_obsolete ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_cleanup_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_organization_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_organization_indexing ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_encryption ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_verification_completeness ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_verification_integrity ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_verification_accessibility ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_archive_content_type ON archive_content(content_type);
CREATE INDEX idx_archive_databases_name ON archive_databases(database_name);
CREATE INDEX idx_archive_media_type ON archive_media(media_type);
CREATE INDEX idx_archive_storage_type ON archive_storage(storage_type);
CREATE INDEX idx_archive_compliance_regulation ON archive_compliance_regulations(regulation);
CREATE INDEX idx_archive_cleanup_obsolete_category ON archive_cleanup_obsolete(category);
CREATE INDEX idx_archive_metadata_modified ON archive_metadata(modified_date);
CREATE INDEX idx_archive_audit_logs_timestamp ON archive_audit_logs(action_timestamp);
CREATE INDEX idx_archive_verification_completeness_category ON archive_verification_completeness(category);

-- RLS Policies (applying to all tables - showing pattern for key tables)
CREATE POLICY "Users can view their own archive content" ON archive_content
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive content" ON archive_content
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive databases" ON archive_databases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive databases" ON archive_databases
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive media" ON archive_media
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive media" ON archive_media
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive storage" ON archive_storage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive storage" ON archive_storage
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive compliance regulations" ON archive_compliance_regulations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive compliance regulations" ON archive_compliance_regulations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive data classification" ON archive_data_classification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive data classification" ON archive_data_classification
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive audits" ON archive_audits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive audits" ON archive_audits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive cleanup temporary" ON archive_cleanup_temporary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive cleanup temporary" ON archive_cleanup_temporary
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive cleanup duplicates" ON archive_cleanup_duplicates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive cleanup duplicates" ON archive_cleanup_duplicates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive cleanup obsolete" ON archive_cleanup_obsolete
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive cleanup obsolete" ON archive_cleanup_obsolete
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive cleanup verification" ON archive_cleanup_verification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive cleanup verification" ON archive_cleanup_verification
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive organization structure" ON archive_organization_structure
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive organization structure" ON archive_organization_structure
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive organization indexing" ON archive_organization_indexing
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive organization indexing" ON archive_organization_indexing
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive metadata" ON archive_metadata
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive metadata" ON archive_metadata
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive permissions" ON archive_permissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive permissions" ON archive_permissions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive audit logs" ON archive_audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive audit logs" ON archive_audit_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive encryption" ON archive_encryption
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive encryption" ON archive_encryption
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive verification completeness" ON archive_verification_completeness
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive verification completeness" ON archive_verification_completeness
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive verification integrity" ON archive_verification_integrity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive verification integrity" ON archive_verification_integrity
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own archive verification accessibility" ON archive_verification_accessibility
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own archive verification accessibility" ON archive_verification_accessibility
  FOR ALL USING (auth.uid() = user_id);