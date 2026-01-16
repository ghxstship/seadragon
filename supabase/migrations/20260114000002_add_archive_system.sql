-- Archive Phase Database Schema
-- Migration for event data archiving and long-term storage management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Archive Content Table
-- Stores information about archived content (photos, videos, documents, etc.)
CREATE TABLE archive_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('photo', 'video', 'audio', 'document', 'presentation', 'other')),
  location VARCHAR(500) NOT NULL,
  size_bytes BIGINT NOT NULL,
  format VARCHAR(50),
  archived BOOLEAN DEFAULT false,
  backup BOOLEAN DEFAULT false,
  checksum VARCHAR(128),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Databases Table
-- Tracks database archiving status
CREATE TABLE archive_databases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  database_name VARCHAR(255) NOT NULL,
  record_count INTEGER DEFAULT 0,
  size_bytes BIGINT,
  archived BOOLEAN DEFAULT false,
  retention_period VARCHAR(50),
  archive_location VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Media Table
-- Manages media file archiving
CREATE TABLE archive_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('photo', 'video', 'audio')),
  file_count INTEGER DEFAULT 0,
  total_size_bytes BIGINT,
  storage_location VARCHAR(500),
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Storage Configuration
-- Manages long-term storage systems
CREATE TABLE archive_storage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_type VARCHAR(20) NOT NULL CHECK (storage_type IN ('primary', 'backup', 'disaster_recovery')),
  provider VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  redundancy VARCHAR(50),
  access_time VARCHAR(50),
  cost_per_month DECIMAL(10,2),
  last_backup TIMESTAMP WITH TIME ZONE,
  verified BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Compliance Regulations
-- Tracks regulatory compliance requirements
CREATE TABLE archive_compliance_regulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulation_name VARCHAR(100) NOT NULL,
  applicable BOOLEAN DEFAULT false,
  retention_period VARCHAR(50),
  requirements TEXT[],
  compliance_status VARCHAR(20) DEFAULT 'unknown' CHECK (compliance_status IN ('compliant', 'review', 'non-compliant', 'unknown')),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  next_review TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Data Classification
-- Manages data classification and retention policies
CREATE TABLE archive_data_classification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  sensitivity VARCHAR(20) NOT NULL CHECK (sensitivity IN ('public', 'internal', 'confidential', 'restricted')),
  retention_period VARCHAR(50),
  disposal_method VARCHAR(100),
  access_permissions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Cleanup Records
-- Tracks data cleanup operations
CREATE TABLE archive_cleanup (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cleanup_type VARCHAR(20) NOT NULL CHECK (cleanup_type IN ('temporary', 'duplicates', 'obsolete')),
  item_count INTEGER DEFAULT 0,
  size_cleaned_bytes BIGINT DEFAULT 0,
  cleanup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Organization Structure
-- Defines archive organization and naming conventions
CREATE TABLE archive_organization (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL,
  subcategories TEXT[],
  naming_convention VARCHAR(200),
  access_permissions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Metadata
-- Stores metadata for archived files
CREATE TABLE archive_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_path VARCHAR(500) NOT NULL,
  tags TEXT[],
  description TEXT,
  created_date TIMESTAMP WITH TIME ZONE,
  modified_date TIMESTAMP WITH TIME ZONE,
  file_size_bytes BIGINT,
  checksum VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Access Permissions
-- Manages access control for archived data
CREATE TABLE archive_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name VARCHAR(100) NOT NULL,
  user_ids UUID[] DEFAULT '{}',
  access_permissions TEXT[],
  restrictions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Audit Logs
-- Tracks access and operations on archived data
CREATE TABLE archive_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES platform_users(id),
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB DEFAULT '{}'
);

-- Archive Encryption Settings
-- Manages encryption configuration
CREATE TABLE archive_encryption (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  encryption_method VARCHAR(100) NOT NULL,
  key_management VARCHAR(100),
  rotation_period VARCHAR(50),
  compliance_status VARCHAR(20) DEFAULT 'unknown' CHECK (compliance_status IN ('compliant', 'non-compliant', 'unknown')),
  last_rotation TIMESTAMP WITH TIME ZONE,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archive Verification Results
-- Stores results of archive integrity and completeness checks
CREATE TABLE archive_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verification_type VARCHAR(30) NOT NULL CHECK (verification_type IN ('completeness', 'integrity', 'accessibility')),
  component VARCHAR(100) NOT NULL,
  test_method VARCHAR(100),
  result VARCHAR(20) NOT NULL CHECK (result IN ('passed', 'failed', 'warning')),
  details TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_check TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_archive_content_event_id ON archive_content(event_id);
CREATE INDEX idx_archive_content_type ON archive_content(content_type);
CREATE INDEX idx_archive_databases_event_id ON archive_databases(event_id);
CREATE INDEX idx_archive_media_event_id ON archive_media(event_id);
CREATE INDEX idx_archive_audit_logs_timestamp ON archive_audit_logs(timestamp);
CREATE INDEX idx_archive_audit_logs_user_id ON archive_audit_logs(user_id);
CREATE INDEX idx_archive_verification_type ON archive_verification(verification_type);

-- Row Level Security Policies
ALTER TABLE archive_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_compliance_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_data_classification ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_cleanup ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_encryption ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_verification ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (adjust based on your role system)
CREATE POLICY "Users can view archive content" ON archive_content
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage archive content" ON archive_content
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Similar policies for other tables (implement based on your security requirements)

-- Insert default data for testing
INSERT INTO archive_compliance_regulations (regulation_name, applicable, retention_period, requirements, compliance_status) VALUES
('GDPR', true, '7 years', ARRAY['Data minimization', 'Purpose limitation', 'Storage limitation'], 'compliant'),
('CCPA', true, '2 years', ARRAY['Right to know', 'Right to delete', 'Right to opt-out'], 'compliant'),
('SOX', true, '7 years', ARRAY['Financial record retention', 'Audit trail'], 'compliant'),
('HIPAA', false, '6 years', ARRAY['Protected health information'], 'non-compliant');

INSERT INTO archive_data_classification (category, sensitivity, retention_period, disposal_method, access_permissions) VALUES
('Financial Records', 'confidential', '7 years', 'Secure deletion', ARRAY['Finance Team', 'Executive']),
('Event Photos', 'internal', '3 years', 'Standard deletion', ARRAY['Marketing Team', 'Creative']),
('Legal Documents', 'restricted', '10 years', 'Secure shredding', ARRAY['Legal Team', 'Executive']),
('Operational Data', 'internal', '5 years', 'Standard deletion', ARRAY['Operations Team']);

INSERT INTO archive_storage (storage_type, provider, location, redundancy, access_time, cost_per_month, verified) VALUES
('primary', 'AWS S3', 'us-east-1', 'Multi-AZ', '< 1 second', 250.00, true),
('backup', 'Azure Blob Storage', 'us-central', 'Geo-redundant', '< 5 seconds', 150.00, true),
('disaster_recovery', 'Google Cloud Storage', 'us-west1', 'Multi-region', '< 10 seconds', 100.00, false);

INSERT INTO archive_encryption (encryption_method, key_management, rotation_period, compliance_status) VALUES
('AES-256', 'AWS KMS with automatic rotation', '90 days', 'compliant');

INSERT INTO archive_organization (category, subcategories, naming_convention, access_permissions) VALUES
('Financial Records', ARRAY['Invoices', 'Reconciliations', 'Tax Documents'], 'FIN-{Year}-{Month}-{Type}', ARRAY['Finance Team', 'Executive']),
('Event Assets', ARRAY['Photos', 'Videos', 'Audio'], 'EVT-{Year}-{Event}-{Type}', ARRAY['Marketing Team', 'Creative']),
('Legal Documents', ARRAY['Contracts', 'Permits', 'Insurance'], 'LGL-{Year}-{Type}-{ID}', ARRAY['Legal Team', 'Executive']),
('Operational Data', ARRAY['Logs', 'Reports', 'Analytics'], 'OPS-{Year}-{Event}-{Type}', ARRAY['Operations Team', 'IT']);
