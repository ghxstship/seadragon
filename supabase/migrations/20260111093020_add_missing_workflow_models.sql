-- Add missing workflow models for comprehensive operational support
-- This migration adds models for procurement, recruitment, inspections, marketing, legal, creative content, custom workflows, tour itineraries, and enhancements to existing workflows

-- Procurement workflows
CREATE TABLE procurement_requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'critical')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'ordered', 'delivered', 'cancelled')),
    approved_by_id TEXT REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE procurement_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON procurement_requests FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_procurement_requests_organization ON procurement_requests(organization_id);
CREATE INDEX idx_procurement_requests_status ON procurement_requests(status);

CREATE TABLE suppliers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_info JSONB,
    address JSONB,
    tax_id TEXT,
    payment_terms TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON suppliers FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_suppliers_organization ON suppliers(organization_id);
CREATE INDEX idx_suppliers_active ON suppliers(is_active);

CREATE TABLE procurement_orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    procurement_request_id TEXT REFERENCES procurement_requests(id) ON DELETE SET NULL,
    supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE,
    total_amount DECIMAL(12,2),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'delivered', 'cancelled')),
    ordered_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE procurement_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON procurement_orders FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_procurement_orders_organization ON procurement_orders(organization_id);
CREATE INDEX idx_procurement_orders_status ON procurement_orders(status);

-- Team scheduling workflows
CREATE TABLE team_schedules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    shift_start TIME,
    shift_end TIME,
    role TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE team_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON team_schedules FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_team_schedules_organization ON team_schedules(organization_id);
CREATE INDEX idx_team_schedules_user_date ON team_schedules(user_id, date);

CREATE TABLE shifts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON shifts FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_shifts_organization ON shifts(organization_id);

CREATE TABLE availabilities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_start TIME,
    available_end TIME,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'preferred')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON availabilities FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_availabilities_organization ON availabilities(organization_id);
CREATE INDEX idx_availabilities_user_date ON availabilities(user_id, date);

-- Job recruitment applicant tracking workflows
CREATE TABLE job_postings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    requirements JSONB,
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    posted_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON job_postings FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_job_postings_organization ON job_postings(organization_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);

CREATE TABLE applicants (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    job_posting_id TEXT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    resume_url TEXT,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'interviewed', 'offered', 'hired', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON applicants FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_applicants_organization ON applicants(organization_id);
CREATE INDEX idx_applicants_job_posting ON applicants(job_posting_id);

CREATE TABLE interviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    applicant_id TEXT NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    interviewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON interviews FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_interviews_organization ON interviews(organization_id);
CREATE INDEX idx_interviews_applicant ON interviews(applicant_id);

CREATE TABLE offers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    applicant_id TEXT NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    salary DECIMAL(12,2),
    start_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn')),
    offered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON offers FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_offers_organization ON offers(organization_id);
CREATE INDEX idx_offers_applicant ON offers(applicant_id);

-- Asset, inventory, logistics, and warehousing workflows
CREATE TABLE warehouses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address JSONB,
    manager_id TEXT REFERENCES users(id),
    capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON warehouses FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_warehouses_organization ON warehouses(organization_id);

CREATE TABLE asset_locations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    warehouse_id TEXT REFERENCES warehouses(id) ON DELETE SET NULL,
    shelf TEXT,
    bin TEXT,
    quantity INTEGER DEFAULT 1,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE asset_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON asset_locations FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_asset_locations_organization ON asset_locations(organization_id);
CREATE INDEX idx_asset_locations_asset ON asset_locations(asset_id);

CREATE TABLE inventories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    warehouse_id TEXT REFERENCES warehouses(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 0,
    last_counted_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'damaged', 'missing', 'disposed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE inventories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON inventories FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_inventories_organization ON inventories(organization_id);
CREATE INDEX idx_inventories_asset ON inventories(asset_id);

CREATE TABLE logistics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('pickup', 'delivery', 'transfer', 'return')),
    origin TEXT,
    destination TEXT,
    asset_id TEXT REFERENCES assets(id) ON DELETE SET NULL,
    quantity INTEGER,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_transit', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON logistics FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_logistics_organization ON logistics(organization_id);
CREATE INDEX idx_logistics_status ON logistics(status);

CREATE TABLE transfers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    from_location_id TEXT REFERENCES asset_locations(id),
    to_location_id TEXT REFERENCES asset_locations(id),
    quantity INTEGER NOT NULL,
    transferred_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transferred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON transfers FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_transfers_organization ON transfers(organization_id);
CREATE INDEX idx_transfers_asset ON transfers(asset_id);

-- Punch lists, inspections, reports workflows
CREATE TABLE punch_lists (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    description TEXT,
    assigned_to_id TEXT REFERENCES users(id),
    due_date DATE,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE punch_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON punch_lists FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_punch_lists_organization ON punch_lists(organization_id);
CREATE INDEX idx_punch_lists_event ON punch_lists(event_id);

CREATE TABLE inspections (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    inspector_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('safety', 'quality', 'equipment', 'venue', 'general')),
    findings JSONB,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'failed')),
    inspected_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON inspections FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_inspections_organization ON inspections(organization_id);
CREATE INDEX idx_inspections_event ON inspections(event_id);

CREATE TABLE incident_reports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    reported_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('accident', 'equipment_failure', 'security', 'medical', 'other')),
    description TEXT NOT NULL,
    severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'resolved', 'closed')),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON incident_reports FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_incident_reports_organization ON incident_reports(organization_id);
CREATE INDEX idx_incident_reports_event ON incident_reports(event_id);

CREATE TABLE expense_reports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'reimbursed')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by_id TEXT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE expense_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON expense_reports FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_expense_reports_organization ON expense_reports(organization_id);
CREATE INDEX idx_expense_reports_user ON expense_reports(user_id);

-- Creative content management workflows
CREATE TABLE content_libraries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'document', 'other')),
    folder_id TEXT REFERENCES content_libraries(id) ON DELETE SET NULL,
    created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tags JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE content_libraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON content_libraries FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_content_libraries_organization ON content_libraries(organization_id);
CREATE INDEX idx_content_libraries_type ON content_libraries(type);

CREATE TABLE content_versions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    content_library_id TEXT NOT NULL REFERENCES content_libraries(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    metadata JSONB,
    created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON content_versions FOR ALL USING (
    content_library_id IN (
        SELECT id FROM content_libraries WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_content_versions_library ON content_versions(content_library_id);

CREATE TABLE content_approvals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    content_version_id TEXT NOT NULL REFERENCES content_versions(id) ON DELETE CASCADE,
    approver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    comments TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE content_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON content_approvals FOR ALL USING (
    content_version_id IN (
        SELECT cv.id FROM content_versions cv
        JOIN content_libraries cl ON cv.content_library_id = cl.id
        WHERE cl.organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_content_approvals_version ON content_approvals(content_version_id);

-- Marketing campaign workflows
CREATE TABLE campaigns (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('social', 'email', 'advertising', 'event', 'partnership', 'other')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'paused', 'completed', 'cancelled')),
    created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON campaigns FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_campaigns_organization ON campaigns(organization_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

CREATE TABLE campaign_steps (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    assigned_to_id TEXT REFERENCES users(id),
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE campaign_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON campaign_steps FOR ALL USING (
    campaign_id IN (
        SELECT id FROM campaigns WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_campaign_steps_campaign ON campaign_steps(campaign_id);

CREATE TABLE campaign_assets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    campaign_step_id TEXT NOT NULL REFERENCES campaign_steps(id) ON DELETE CASCADE,
    asset_id TEXT REFERENCES assets(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document', 'link', 'other')),
    url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE campaign_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON campaign_assets FOR ALL USING (
    campaign_step_id IN (
        SELECT cs.id FROM campaign_steps cs
        JOIN campaigns c ON cs.campaign_id = c.id
        WHERE c.organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_campaign_assets_step ON campaign_assets(campaign_step_id);

CREATE TABLE campaign_performances (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    metric TEXT NOT NULL,
    value DECIMAL(10,2),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE campaign_performances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON campaign_performances FOR ALL USING (
    campaign_id IN (
        SELECT id FROM campaigns WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_campaign_performances_campaign ON campaign_performances(campaign_id);

-- Legal and compliance workflows
CREATE TABLE compliance_documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('license', 'permit', 'insurance', 'contract', 'policy', 'other')),
    file_url TEXT,
    expiry_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'renewed', 'cancelled')),
    created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE compliance_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON compliance_documents FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_compliance_documents_organization ON compliance_documents(organization_id);
CREATE INDEX idx_compliance_documents_expiry ON compliance_documents(expiry_date);

CREATE TABLE audits (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('internal', 'external', 'compliance', 'financial', 'operational')),
    auditor_id TEXT REFERENCES users(id),
    findings JSONB,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'failed')),
    audited_at TIMESTAMP WITH TIME ZONE,
    report_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON audits FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_audits_organization ON audits(organization_id);
CREATE INDEX idx_audits_status ON audits(status);

CREATE TABLE legal_cases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    lawyer_id TEXT REFERENCES users(id),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'dismissed')),
    filed_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON legal_cases FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_legal_cases_organization ON legal_cases(organization_id);
CREATE INDEX idx_legal_cases_status ON legal_cases(status);

CREATE TABLE regulatory_filings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'filed', 'approved', 'rejected')),
    filed_at TIMESTAMP WITH TIME ZONE,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE regulatory_filings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON regulatory_filings FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_regulatory_filings_organization ON regulatory_filings(organization_id);
CREATE INDEX idx_regulatory_filings_due_date ON regulatory_filings(due_date);

-- Custom workflows
CREATE TABLE custom_workflows (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    actions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE custom_workflows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON custom_workflows FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_custom_workflows_organization ON custom_workflows(organization_id);

CREATE TABLE custom_steps (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    custom_workflow_id TEXT NOT NULL REFERENCES custom_workflows(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    config JSONB,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE custom_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON custom_steps FOR ALL USING (
    custom_workflow_id IN (
        SELECT id FROM custom_workflows WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_custom_steps_workflow ON custom_steps(custom_workflow_id);

CREATE TABLE custom_triggers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    custom_workflow_id TEXT NOT NULL REFERENCES custom_workflows(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    conditions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE custom_triggers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON custom_triggers FOR ALL USING (
    custom_workflow_id IN (
        SELECT id FROM custom_workflows WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_custom_triggers_workflow ON custom_triggers(custom_workflow_id);

CREATE TABLE custom_actions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    custom_workflow_id TEXT NOT NULL REFERENCES custom_workflows(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL REFERENCES custom_steps(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE custom_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON custom_actions FOR ALL USING (
    custom_workflow_id IN (
        SELECT id FROM custom_workflows WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_custom_actions_workflow ON custom_actions(custom_workflow_id);

-- Tour itinerary scheduling workflows
CREATE TABLE itineraries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON itineraries FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_itineraries_organization ON itineraries(organization_id);
CREATE INDEX idx_itineraries_event ON itineraries(event_id);

CREATE TABLE itinerary_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    itinerary_id TEXT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('travel', 'activity', 'meeting', 'accommodation', 'meal', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    order_index INTEGER NOT NULL,
    cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON itinerary_items FOR ALL USING (
    itinerary_id IN (
        SELECT id FROM itineraries WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_itinerary_items_itinerary ON itinerary_items(itinerary_id);

CREATE TABLE travel_segments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    itinerary_id TEXT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('flight', 'train', 'bus', 'car', 'boat', 'other')),
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    transportation_id TEXT REFERENCES transportations(id) ON DELETE SET NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    cost DECIMAL(10,2),
    booking_reference TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE travel_segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON travel_segments FOR ALL USING (
    itinerary_id IN (
        SELECT id FROM itineraries WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_travel_segments_itinerary ON travel_segments(itinerary_id);

CREATE TABLE transportations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('airline', 'rail', 'bus', 'rental_car', 'taxi', 'limousine', 'other')),
    provider TEXT NOT NULL,
    capacity INTEGER,
    contact_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transportations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON transportations FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_transportations_organization ON transportations(organization_id);

-- Enhancements to existing workflows
CREATE TABLE requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('asset', 'approval', 'resource', 'change', 'other')),
    requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by_id TEXT REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON requests FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_requests_organization ON requests(organization_id);
CREATE INDEX idx_requests_status ON requests(status);

CREATE TABLE approvals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    approver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
    comments TEXT,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON approvals FOR ALL USING (
    request_id IN (
        SELECT id FROM requests WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_approvals_request ON approvals(request_id);

CREATE TABLE event_programs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    order_index INTEGER NOT NULL,
    assigned_to_id TEXT REFERENCES users(id),
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE event_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON event_programs FOR ALL USING (
    event_id IN (
        SELECT id FROM events WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_event_programs_event ON event_programs(event_id);

CREATE TABLE program_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_program_id TEXT NOT NULL REFERENCES event_programs(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('performance', 'speech', 'break', 'setup', 'other')),
    content TEXT,
    duration INTERVAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE program_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON program_items FOR ALL USING (
    event_program_id IN (
        SELECT ep.id FROM event_programs ep
        JOIN events e ON ep.event_id = e.id
        WHERE e.organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_program_items_program ON program_items(event_program_id);

CREATE TABLE venue_bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    venue_id TEXT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'cancelled')),
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE venue_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON venue_bookings FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_venue_bookings_organization ON venue_bookings(organization_id);
CREATE INDEX idx_venue_bookings_venue ON venue_bookings(venue_id);

CREATE TABLE venue_availabilities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    venue_id TEXT NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    booked_by TEXT REFERENCES organizations(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE venue_availabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON venue_availabilities FOR ALL USING (
    venue_id IN (
        SELECT id FROM places WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_venue_availabilities_venue ON venue_availabilities(venue_id);
CREATE INDEX idx_venue_availabilities_date ON venue_availabilities(date);

CREATE TABLE invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id TEXT REFERENCES organizations(id),
    amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    invoice_number TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON invoices FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_invoices_organization ON invoices(organization_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE TABLE accounting_entries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('debit', 'credit')),
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    category TEXT,
    reference_id TEXT,
    created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE accounting_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON accounting_entries FOR ALL USING (organization_id = (current_setting('app.current_organization_id')::text));
CREATE INDEX idx_accounting_entries_organization ON accounting_entries(organization_id);
CREATE INDEX idx_accounting_entries_date ON accounting_entries(date);

CREATE TABLE expense_approvals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    expense_report_id TEXT NOT NULL REFERENCES expense_reports(id) ON DELETE CASCADE,
    approver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
    comments TEXT,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE expense_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON expense_approvals FOR ALL USING (
    expense_report_id IN (
        SELECT id FROM expense_reports WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_expense_approvals_report ON expense_approvals(expense_report_id);

CREATE TABLE run_of_shows (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    created_by_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE run_of_shows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON run_of_shows FOR ALL USING (
    event_id IN (
        SELECT id FROM events WHERE organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_run_of_shows_event ON run_of_shows(event_id);

CREATE TABLE segments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    run_of_show_id TEXT NOT NULL REFERENCES run_of_shows(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTERVAL,
    notes TEXT,
    assigned_to_id TEXT REFERENCES users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON segments FOR ALL USING (
    run_of_show_id IN (
        SELECT ros.id FROM run_of_shows ros
        JOIN events e ON ros.event_id = e.id
        WHERE e.organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_segments_run_of_show ON segments(run_of_show_id);

CREATE TABLE cues (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    segment_id TEXT NOT NULL REFERENCES segments(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('light', 'sound', 'video', 'action', 'other')),
    time INTERVAL NOT NULL,
    description TEXT,
    executed_at TIMESTAMP WITH TIME ZONE,
    executed_by_id TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE cues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON cues FOR ALL USING (
    segment_id IN (
        SELECT s.id FROM segments s
        JOIN run_of_shows ros ON s.run_of_show_id = ros.id
        JOIN events e ON ros.event_id = e.id
        WHERE e.organization_id = (current_setting('app.current_organization_id')::text)
    )
);
CREATE INDEX idx_cues_segment ON cues(segment_id);
