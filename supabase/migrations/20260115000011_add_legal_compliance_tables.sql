-- Create legal compliance tables
-- Migration: 20260115000011_add_legal_compliance_tables.sql

-- Contracts active table
CREATE TABLE legal_contracts_active (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id TEXT NOT NULL,
  title TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  party TEXT NOT NULL,
  contract_value DECIMAL(15,2),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  contract_status TEXT DEFAULT 'active' CHECK (contract_status IN ('active', 'expiring', 'breached', 'terminated')),
  key_terms JSONB,
  renewal_reminder TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Contracts templates table
CREATE TABLE legal_contracts_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  description TEXT,
  last_updated TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  legal_review BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Contracts negotiations table
CREATE TABLE legal_contracts_negotiations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id TEXT NOT NULL,
  negotiation_status TEXT DEFAULT 'draft' CHECK (negotiation_status IN ('draft', 'review', 'negotiation', 'approved', 'signed')),
  current_party TEXT,
  next_deadline TIMESTAMP WITH TIME ZONE,
  issues JSONB,
  assigned_attorney TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Regulations applicable table
CREATE TABLE legal_regulations_applicable (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  regulation TEXT NOT NULL,
  category TEXT,
  jurisdiction TEXT,
  last_review TIMESTAMP WITH TIME ZONE,
  next_review TIMESTAMP WITH TIME ZONE,
  compliance_status TEXT DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'conditional', 'non-compliant')),
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  responsible_party TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Regulations filings table
CREATE TABLE legal_regulations_filings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filing_type TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  submitted_date TIMESTAMP WITH TIME ZONE,
  filing_status TEXT DEFAULT 'pending' CHECK (filing_status IN ('pending', 'submitted', 'approved', 'rejected')),
  filing_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Regulations licenses table
CREATE TABLE legal_regulations_licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_type TEXT NOT NULL,
  issuer TEXT,
  issue_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  license_status TEXT DEFAULT 'active' CHECK (license_status IN ('active', 'expired', 'pending_renewal')),
  renewal_fee DECIMAL(10,2),
  requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Risk assessments table
CREATE TABLE legal_risk_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  likelihood TEXT DEFAULT 'medium' CHECK (likelihood IN ('low', 'medium', 'high', 'critical')),
  impact TEXT DEFAULT 'medium' CHECK (impact IN ('low', 'medium', 'high', 'critical')),
  risk_score INTEGER,
  mitigation JSONB,
  risk_owner TEXT,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  assessment_status TEXT DEFAULT 'active' CHECK (assessment_status IN ('active', 'mitigated', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Risk incidents table
CREATE TABLE legal_risk_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id TEXT NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE,
  incident_type TEXT,
  description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  affected_parties JSONB,
  resolution TEXT,
  preventive_actions JSONB,
  incident_status TEXT DEFAULT 'reported' CHECK (incident_status IN ('reported', 'investigating', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Risk insurance table
CREATE TABLE legal_risk_insurance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  insurance_type TEXT NOT NULL,
  provider TEXT,
  policy_number TEXT,
  coverage DECIMAL(15,2),
  premium DECIMAL(10,2),
  expiry_date TIMESTAMP WITH TIME ZONE,
  insurance_status TEXT DEFAULT 'active' CHECK (insurance_status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Risk insurance claims table
CREATE TABLE legal_risk_insurance_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  insurance_id UUID REFERENCES legal_risk_insurance(id) ON DELETE CASCADE,
  claim_date TIMESTAMP WITH TIME ZONE,
  claim_amount DECIMAL(15,2),
  claim_status TEXT DEFAULT 'filed' CHECK (claim_status IN ('filed', 'approved', 'denied')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal reviews pending table
CREATE TABLE legal_reviews_pending (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item TEXT NOT NULL,
  review_type TEXT,
  request_date TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  requested_by TEXT,
  assigned_attorney TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  review_status TEXT DEFAULT 'requested' CHECK (review_status IN ('requested', 'in_review', 'approved', 'rejected', 'revised')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Legal reviews completed table
CREATE TABLE legal_reviews_completed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item TEXT NOT NULL,
  review_type TEXT,
  review_date TIMESTAMP WITH TIME ZONE,
  attorney TEXT,
  outcome TEXT CHECK (outcome IN ('approved', 'approved_with_conditions', 'rejected', 'requires_revision')),
  conditions JSONB,
  time_spent DECIMAL(6,2),
  cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Legal reviews templates table
CREATE TABLE legal_reviews_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  sections JSONB,
  estimated_time DECIMAL(6,2),
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance monitoring audits table
CREATE TABLE legal_compliance_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id TEXT NOT NULL,
  audit_type TEXT NOT NULL,
  scope TEXT,
  auditor TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  overall_rating TEXT DEFAULT 'good' CHECK (overall_rating IN ('excellent', 'good', 'satisfactory', 'needs_improvement', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance monitoring audit findings table
CREATE TABLE legal_compliance_audit_findings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID REFERENCES legal_compliance_audits(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  issue TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  recommendation TEXT,
  finding_status TEXT DEFAULT 'open' CHECK (finding_status IN ('open', 'addressed', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance monitoring metrics table
CREATE TABLE legal_compliance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  compliance_rate DECIMAL(5,2),
  audit_score DECIMAL(5,2),
  incident_rate DECIMAL(5,2),
  response_time DECIMAL(5,2),
  training_completion DECIMAL(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance monitoring training table
CREATE TABLE legal_compliance_training (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program TEXT NOT NULL,
  required_for JSONB,
  completion_rate DECIMAL(5,2),
  last_offered TIMESTAMP WITH TIME ZONE,
  next_scheduled TIMESTAMP WITH TIME ZONE,
  training_status TEXT DEFAULT 'current' CHECK (training_status IN ('current', 'outdated', 'mandatory')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Intellectual property trademarks table
CREATE TABLE legal_ip_trademarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trademark TEXT NOT NULL,
  registration_number TEXT,
  trademark_class TEXT,
  filing_date TIMESTAMP WITH TIME ZONE,
  registration_date TIMESTAMP WITH TIME ZONE,
  trademark_status TEXT DEFAULT 'pending' CHECK (trademark_status IN ('pending', 'registered', 'expired', 'cancelled')),
  jurisdiction TEXT,
  renewal_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Intellectual property copyrights table
CREATE TABLE legal_ip_copyrights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work TEXT NOT NULL,
  registration_number TEXT,
  author TEXT,
  creation_date TIMESTAMP WITH TIME ZONE,
  publication_date TIMESTAMP WITH TIME ZONE,
  copyright_status TEXT DEFAULT 'unregistered' CHECK (copyright_status IN ('unregistered', 'pending', 'registered')),
  jurisdiction TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Intellectual property domains table
CREATE TABLE legal_ip_domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  registrar TEXT,
  registration_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT false,
  domain_status TEXT DEFAULT 'active' CHECK (domain_status IN ('active', 'expired', 'pending_transfer')),
  cost DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data privacy GDPR processing table
CREATE TABLE legal_privacy_gdpr_processing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purpose TEXT NOT NULL,
  data_categories JSONB,
  legal_basis TEXT,
  retention_period TEXT,
  safeguards JSONB,
  processing_status TEXT DEFAULT 'compliant' CHECK (processing_status IN ('compliant', 'review_required', 'non-compliant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data privacy GDPR subject rights table
CREATE TABLE legal_privacy_gdpr_rights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  right_name TEXT NOT NULL,
  process TEXT,
  average_response_time DECIMAL(6,2),
  requests_handled INTEGER DEFAULT 0,
  right_status TEXT DEFAULT 'operational' CHECK (right_status IN ('operational', 'needs_improvement')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data privacy GDPR breach response table
CREATE TABLE legal_privacy_gdpr_breach (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_plan TEXT,
  last_tested TIMESTAMP WITH TIME ZONE,
  response_team JSONB,
  notification_time TEXT,
  breach_status TEXT DEFAULT 'current' CHECK (breach_status IN ('current', 'outdated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Data privacy CCPA table
CREATE TABLE legal_privacy_ccpa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  compliance_status TEXT DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'partial', 'non-compliant')),
  opt_out_requests INTEGER DEFAULT 0,
  data_mappings BOOLEAN DEFAULT false,
  last_audit TIMESTAMP WITH TIME ZONE,
  next_audit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Litigation active cases table
CREATE TABLE legal_litigation_active (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id TEXT NOT NULL,
  case_type TEXT,
  plaintiff TEXT,
  description TEXT,
  filing_date TIMESTAMP WITH TIME ZONE,
  case_status TEXT DEFAULT 'pre-litigation' CHECK (case_status IN ('pre-litigation', 'active', 'settled', 'dismissed', 'appeal')),
  assigned_attorney TEXT,
  estimated_cost DECIMAL(15,2),
  probability TEXT DEFAULT 'medium' CHECK (probability IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Litigation settlements table
CREATE TABLE legal_litigation_settlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id TEXT NOT NULL,
  settlement_date TIMESTAMP WITH TIME ZONE,
  settlement_amount DECIMAL(15,2),
  terms TEXT,
  attorney TEXT,
  settlement_status TEXT DEFAULT 'proposed' CHECK (settlement_status IN ('proposed', 'approved', 'executed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Litigation preventive measures table
CREATE TABLE legal_litigation_preventive (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  measure TEXT NOT NULL,
  implementation TEXT,
  effectiveness TEXT,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  measure_status TEXT DEFAULT 'active' CHECK (measure_status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE legal_contracts_active ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_contracts_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_contracts_negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_regulations_applicable ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_regulations_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_regulations_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_risk_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_risk_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_risk_insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_reviews_pending ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_reviews_completed ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_reviews_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_compliance_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_compliance_audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_compliance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_compliance_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_ip_trademarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_ip_copyrights ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_ip_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_privacy_gdpr_processing ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_privacy_gdpr_rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_privacy_gdpr_breach ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_privacy_ccpa ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_litigation_active ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_litigation_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_litigation_preventive ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_legal_contracts_active_status ON legal_contracts_active(contract_status);
CREATE INDEX idx_legal_contracts_active_end_date ON legal_contracts_active(end_date);
CREATE INDEX idx_legal_regulations_applicable_status ON legal_regulations_applicable(compliance_status);
CREATE INDEX idx_legal_regulations_filings_status ON legal_regulations_filings(filing_status);
CREATE INDEX idx_legal_regulations_licenses_status ON legal_regulations_licenses(license_status);
CREATE INDEX idx_legal_risk_assessments_status ON legal_risk_assessments(assessment_status);
CREATE INDEX idx_legal_reviews_pending_status ON legal_reviews_pending(review_status);
CREATE INDEX idx_legal_compliance_audits_rating ON legal_compliance_audits(overall_rating);
CREATE INDEX idx_legal_ip_trademarks_status ON legal_ip_trademarks(trademark_status);
CREATE INDEX idx_legal_litigation_active_status ON legal_litigation_active(case_status);

-- RLS Policies (applying to all tables - showing pattern for key tables)
CREATE POLICY "Users can view their own legal contracts active" ON legal_contracts_active
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal contracts active" ON legal_contracts_active
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal contracts templates" ON legal_contracts_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal contracts templates" ON legal_contracts_templates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal contracts negotiations" ON legal_contracts_negotiations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal contracts negotiations" ON legal_contracts_negotiations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal regulations applicable" ON legal_regulations_applicable
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal regulations applicable" ON legal_regulations_applicable
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal regulations filings" ON legal_regulations_filings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal regulations filings" ON legal_regulations_filings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal regulations licenses" ON legal_regulations_licenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal regulations licenses" ON legal_regulations_licenses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal risk assessments" ON legal_risk_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal risk assessments" ON legal_risk_assessments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal risk incidents" ON legal_risk_incidents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal risk incidents" ON legal_risk_incidents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal risk insurance" ON legal_risk_insurance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal risk insurance" ON legal_risk_insurance
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal reviews pending" ON legal_reviews_pending
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal reviews pending" ON legal_reviews_pending
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal reviews completed" ON legal_reviews_completed
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal reviews completed" ON legal_reviews_completed
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal compliance audits" ON legal_compliance_audits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal compliance audits" ON legal_compliance_audits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal IP trademarks" ON legal_ip_trademarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal IP trademarks" ON legal_ip_trademarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal privacy GDPR processing" ON legal_privacy_gdpr_processing
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal privacy GDPR processing" ON legal_privacy_gdpr_processing
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own legal litigation active" ON legal_litigation_active
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legal litigation active" ON legal_litigation_active
  FOR ALL USING (auth.uid() = user_id);