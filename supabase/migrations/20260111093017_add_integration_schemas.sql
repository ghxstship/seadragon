-- Create integration schemas for third-party services

-- Integration providers catalog
CREATE TABLE integration_providers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL, -- "Stripe", "QuickBooks", "Slack", etc.
    provider_type TEXT NOT NULL, -- "payment", "accounting", "communication", "storage", "calendar", "ticketing", "crm", "hr"
    description TEXT,
    website_url TEXT,
    api_docs_url TEXT,
    supported_features JSONB, -- array of features like ["payments", "refunds", "subscriptions"]
    configuration_schema JSONB, -- JSON schema for required configuration
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization integrations (connections to third-party services)
CREATE TABLE integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider_id TEXT NOT NULL REFERENCES integration_providers(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- User-friendly name for this connection
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_sandbox BOOLEAN DEFAULT false, -- For testing environments
    configuration JSONB, -- Encrypted sensitive data like API keys, secrets
    settings JSONB, -- Non-sensitive settings like webhook URLs, sync intervals
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'never' CHECK (sync_status IN ('never', 'success', 'failed', 'in_progress')),
    last_sync_error TEXT,
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, provider_id)
);

-- Integration webhooks/events
CREATE TABLE integration_webhooks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    webhook_url TEXT NOT NULL,
    secret_key_hash TEXT, -- Hashed secret for webhook verification
    events_subscribed JSONB, -- array of event types to listen for
    is_active BOOLEAN DEFAULT true,
    last_received_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration sync logs
CREATE TABLE integration_sync_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    sync_type TEXT NOT NULL, -- "full", "incremental", "webhook"
    status TEXT NOT NULL CHECK (status IN ('started', 'success', 'failed', 'partial')),
    records_processed INTEGER DEFAULT 0,
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration field mappings (for data transformation)
CREATE TABLE integration_field_mappings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    local_entity TEXT NOT NULL, -- "user", "event", "payment", "invoice"
    local_field TEXT NOT NULL, -- field name in our system
    external_field TEXT NOT NULL, -- field name in external system
    field_type TEXT NOT NULL, -- "string", "number", "date", "boolean", "json"
    is_required BOOLEAN DEFAULT false,
    transformation_rule JSONB, -- optional transformation logic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounting integration specific tables
CREATE TABLE accounting_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    chart_of_accounts_synced BOOLEAN DEFAULT false,
    last_chart_sync_at TIMESTAMP WITH TIME ZONE,
    default_income_account_id TEXT,
    default_expense_account_id TEXT,
    default_asset_account_id TEXT,
    default_liability_account_id TEXT,
    tax_codes_synced BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment integration specific tables
CREATE TABLE payment_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    supported_currencies JSONB,
    supported_payment_methods JSONB,
    webhook_endpoint_secret TEXT, -- Encrypted
    default_currency TEXT DEFAULT 'USD',
    processing_fees_covered BOOLEAN DEFAULT false,
    auto_sync_transactions BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communication integration specific tables
CREATE TABLE communication_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    bot_user_id TEXT, -- For Slack, Teams bots
    webhook_url TEXT, -- Encrypted for Discord
    default_channels JSONB, -- Default channels to post notifications
    notification_templates JSONB, -- Templates for different notification types
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar integration specific tables
CREATE TABLE calendar_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    calendar_id TEXT, -- External calendar ID
    sync_direction TEXT DEFAULT 'bidirectional' CHECK (sync_direction IN ('import_only', 'export_only', 'bidirectional')),
    default_visibility TEXT DEFAULT 'private' CHECK (default_visibility IN ('public', 'private', 'confidential')),
    auto_create_events BOOLEAN DEFAULT true,
    event_categories_mapping JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM integration specific tables
CREATE TABLE crm_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    contact_sync_enabled BOOLEAN DEFAULT true,
    lead_sync_enabled BOOLEAN DEFAULT true,
    opportunity_sync_enabled BOOLEAN DEFAULT true,
    default_pipeline_id TEXT,
    custom_fields_mapping JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all integration tables
ALTER TABLE integration_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_field_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_integrations ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_integrations_organization_id ON integrations(organization_id);
CREATE INDEX idx_integrations_provider_id ON integrations(provider_id);
CREATE INDEX idx_integration_webhooks_integration_id ON integration_webhooks(integration_id);
CREATE INDEX idx_integration_sync_logs_integration_id ON integration_sync_logs(integration_id);
CREATE INDEX idx_integration_sync_logs_started_at ON integration_sync_logs(started_at);
CREATE INDEX idx_integration_field_mappings_integration_id ON integration_field_mappings(integration_id);
CREATE INDEX idx_accounting_integrations_integration_id ON accounting_integrations(integration_id);
CREATE INDEX idx_payment_integrations_integration_id ON payment_integrations(integration_id);
CREATE INDEX idx_communication_integrations_integration_id ON communication_integrations(integration_id);
CREATE INDEX idx_calendar_integrations_integration_id ON calendar_integrations(integration_id);
CREATE INDEX idx_crm_integrations_integration_id ON crm_integrations(integration_id);

-- Create RLS policies
CREATE POLICY "Integration providers are publicly readable" ON integration_providers
    FOR SELECT USING (true);

CREATE POLICY "Users can view integrations in their organization" ON integrations
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage integrations in their organization" ON integrations
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view webhooks for integrations in their organization" ON integration_webhooks
    FOR SELECT USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage webhooks for integrations in their organization" ON integration_webhooks
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view sync logs for integrations in their organization" ON integration_sync_logs
    FOR SELECT USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view field mappings for integrations in their organization" ON integration_field_mappings
    FOR SELECT USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage field mappings for integrations in their organization" ON integration_field_mappings
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

-- Specialized integration policies (inherit base integration access)
CREATE POLICY "Users can manage accounting integrations in their organization" ON accounting_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage payment integrations in their organization" ON payment_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage communication integrations in their organization" ON communication_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage calendar integrations in their organization" ON calendar_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage CRM integrations in their organization" ON crm_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));
