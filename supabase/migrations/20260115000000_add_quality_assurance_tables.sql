-- Create quality assurance tables
-- Migration: 20260115000000_add_quality_assurance_tables.sql

-- Quality standards table
CREATE TABLE quality_standards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  standard TEXT NOT NULL,
  description TEXT,
  criteria JSONB,
  frequency TEXT,
  responsible TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Quality checklists table
CREATE TABLE quality_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  process TEXT NOT NULL,
  items JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Quality testing protocols table
CREATE TABLE quality_testing_protocols (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_type TEXT NOT NULL,
  purpose TEXT,
  procedure TEXT,
  acceptance_criteria TEXT,
  equipment JSONB,
  frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance requirements table
CREATE TABLE compliance_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  regulation TEXT NOT NULL,
  requirement TEXT NOT NULL,
  description TEXT,
  applicable_to JSONB,
  compliance_method TEXT,
  frequency TEXT,
  status TEXT DEFAULT 'compliant' CHECK (status IN ('compliant', 'non-compliant', 'under_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance audits table
CREATE TABLE compliance_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_type TEXT NOT NULL,
  scope TEXT,
  auditor TEXT,
  scheduled_date DATE,
  completion_date DATE,
  findings JSONB,
  overall_status TEXT CHECK (overall_status IN ('passed', 'conditional', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Compliance certifications table
CREATE TABLE compliance_certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certification TEXT NOT NULL,
  issuing_body TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  scope TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending_renewal')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Performance metrics table
CREATE TABLE performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  metric TEXT NOT NULL,
  target DECIMAL(10,2),
  unit TEXT,
  tolerance DECIMAL(5,2),
  measurement_frequency TEXT,
  responsible TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Performance benchmarks table
CREATE TABLE performance_benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  standard TEXT NOT NULL,
  value DECIMAL(10,2),
  unit TEXT,
  source TEXT,
  last_updated DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Audit procedures table
CREATE TABLE audit_procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_type TEXT NOT NULL,
  purpose TEXT,
  scope TEXT,
  methodology TEXT,
  frequency TEXT,
  team JSONB,
  deliverables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Audit findings table
CREATE TABLE audit_findings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID REFERENCES compliance_audits(id) ON DELETE CASCADE,
  finding TEXT NOT NULL,
  category TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  root_cause TEXT,
  recommendation TEXT,
  responsible TEXT,
  due_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Corrective actions table
CREATE TABLE corrective_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue TEXT NOT NULL,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  responsible TEXT,
  due_date DATE,
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'planned', 'in_progress', 'implemented', 'verified', 'closed')),
  effectiveness TEXT DEFAULT 'not_measured' CHECK (effectiveness IN ('not_measured', 'effective', 'partially_effective', 'ineffective')),
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Quality reporting table
CREATE TABLE quality_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  frequency TEXT,
  audience JSONB,
  contents JSONB,
  last_generated TIMESTAMP WITH TIME ZONE,
  next_due TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'current' CHECK (status IN ('current', 'overdue', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE quality_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_testing_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_reports ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_quality_standards_user_id ON quality_standards(user_id);
CREATE INDEX idx_quality_checklists_user_id ON quality_checklists(user_id);
CREATE INDEX idx_quality_testing_protocols_user_id ON quality_testing_protocols(user_id);
CREATE INDEX idx_compliance_requirements_user_id ON compliance_requirements(user_id);
CREATE INDEX idx_compliance_audits_user_id ON compliance_audits(user_id);
CREATE INDEX idx_compliance_certifications_user_id ON compliance_certifications(user_id);
CREATE INDEX idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX idx_performance_benchmarks_user_id ON performance_benchmarks(user_id);
CREATE INDEX idx_audit_procedures_user_id ON audit_procedures(user_id);
CREATE INDEX idx_audit_findings_audit_id ON audit_findings(audit_id);
CREATE INDEX idx_corrective_actions_user_id ON corrective_actions(user_id);
CREATE INDEX idx_quality_reports_user_id ON quality_reports(user_id);

-- RLS Policies
CREATE POLICY "Users can view their own quality standards" ON quality_standards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own quality standards" ON quality_standards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own quality checklists" ON quality_checklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own quality checklists" ON quality_checklists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own quality testing protocols" ON quality_testing_protocols
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own quality testing protocols" ON quality_testing_protocols
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own compliance requirements" ON compliance_requirements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own compliance requirements" ON compliance_requirements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own compliance audits" ON compliance_audits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own compliance audits" ON compliance_audits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own compliance certifications" ON compliance_certifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own compliance certifications" ON compliance_certifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own performance metrics" ON performance_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own performance metrics" ON performance_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own performance benchmarks" ON performance_benchmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own performance benchmarks" ON performance_benchmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own audit procedures" ON audit_procedures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own audit procedures" ON audit_procedures
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view audit findings for their audits" ON audit_findings
  FOR SELECT USING (audit_id IN (
    SELECT id FROM compliance_audits WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage audit findings for their audits" ON audit_findings
  FOR ALL USING (audit_id IN (
    SELECT id FROM compliance_audits WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own corrective actions" ON corrective_actions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own corrective actions" ON corrective_actions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own quality reports" ON quality_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own quality reports" ON quality_reports
  FOR ALL USING (auth.uid() = user_id);