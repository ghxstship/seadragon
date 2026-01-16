-- Create comprehensive API ecosystem with webhooks and integrations

-- API keys and authentication
CREATE TABLE api_keys (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- User-friendly name
    description TEXT,
    key_hash TEXT NOT NULL UNIQUE, -- Hashed API key
    key_prefix TEXT NOT NULL, -- First few characters for identification
    permissions JSONB NOT NULL, -- array of permissions like ["read:events", "write:users"]
    rate_limit_requests INTEGER DEFAULT 1000, -- requests per window
    rate_limit_window_seconds INTEGER DEFAULT 3600, -- time window in seconds
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API rate limiting tracking
CREATE TABLE api_rate_limits (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    api_key_id TEXT NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL, -- API endpoint path
    method TEXT NOT NULL, -- GET, POST, PUT, DELETE
    request_count INTEGER DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(api_key_id, endpoint, method, window_start)
);

-- API request logs
CREATE TABLE api_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    api_key_id TEXT REFERENCES api_keys(id) ON DELETE SET NULL,
    organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    request_id TEXT NOT NULL UNIQUE, -- unique request identifier
    method TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    query_params JSONB,
    request_body JSONB, -- sanitized request body
    response_status INTEGER NOT NULL,
    response_body JSONB, -- sanitized response body for errors
    user_agent TEXT,
    ip_address INET,
    processing_time_ms INTEGER,
    error_message TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook endpoints
CREATE TABLE webhook_endpoints (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    secret_key_hash TEXT NOT NULL, -- For webhook signature verification
    events_subscribed JSONB NOT NULL, -- array of event types
    headers JSONB, -- custom headers to include
    is_active BOOLEAN DEFAULT true,
    retry_policy JSONB DEFAULT '{"max_attempts": 3, "backoff_multiplier": 2}', -- retry configuration
    last_successful_delivery TIMESTAMP WITH TIME ZONE,
    last_failure_at TIMESTAMP WITH TIME ZONE,
    failure_count INTEGER DEFAULT 0,
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook delivery attempts
CREATE TABLE webhook_deliveries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    webhook_endpoint_id TEXT NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_id TEXT NOT NULL, -- ID of the entity that triggered the event
    event_data JSONB NOT NULL, -- the event payload
    attempt_number INTEGER DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'retrying')),
    http_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    delivered_at TIMESTAMP WITH TIME ZONE,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API versions and schemas
CREATE TABLE api_versions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    version TEXT NOT NULL UNIQUE, -- "v1", "v2", "2024-01-01"
    description TEXT,
    openapi_spec JSONB, -- OpenAPI 3.1 specification
    graphql_schema TEXT, -- GraphQL schema SDL
    is_active BOOLEAN DEFAULT true,
    deprecated_at TIMESTAMP WITH TIME ZONE,
    sunset_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SDK releases and downloads
CREATE TABLE sdk_releases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL, -- "dragonfly-js-sdk", "dragonfly-python-sdk"
    version TEXT NOT NULL,
    platform TEXT NOT NULL, -- "javascript", "typescript", "python", "ruby", "go", "dotnet"
    download_url TEXT,
    checksum TEXT, -- SHA256 checksum
    changelog TEXT,
    is_prerelease BOOLEAN DEFAULT false,
    is_deprecated BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SDK download tracking
CREATE TABLE sdk_downloads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sdk_release_id TEXT NOT NULL REFERENCES sdk_releases(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API feature flags and toggles
CREATE TABLE api_features (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    feature_name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    organization_whitelist JSONB, -- array of organization IDs with full access
    user_whitelist JSONB, -- array of user IDs with access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API client registrations (for OAuth-like flows)
CREATE TABLE api_clients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_description TEXT,
    client_type TEXT NOT NULL CHECK (client_type IN ('confidential', 'public')), -- OAuth client types
    redirect_uris JSONB, -- array of allowed redirect URIs
    scopes JSONB, -- array of OAuth scopes
    client_secret_hash TEXT, -- hashed client secret for confidential clients
    is_active BOOLEAN DEFAULT true,
    token_expiry_seconds INTEGER DEFAULT 3600,
    refresh_token_expiry_seconds INTEGER DEFAULT 2592000, -- 30 days
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API access tokens
CREATE TABLE api_access_tokens (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_id TEXT NOT NULL REFERENCES api_clients(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    refresh_token_hash TEXT UNIQUE,
    scopes JSONB,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage analytics
CREATE TABLE api_usage_stats (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    api_key_id TEXT REFERENCES api_keys(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    response_status INTEGER NOT NULL,
    request_count INTEGER DEFAULT 1,
    total_response_time_ms INTEGER,
    avg_response_time_ms INTEGER,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    period_type TEXT NOT NULL CHECK (period_type IN ('hourly', 'daily', 'weekly', 'monthly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, api_key_id, endpoint, method, period_start)
);

-- Enable RLS on all API ecosystem tables
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdk_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdk_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_stats ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_rate_limits_api_key_id ON api_rate_limits(api_key_id);
CREATE INDEX idx_api_rate_limits_window_end ON api_rate_limits(window_end);
CREATE INDEX idx_api_logs_api_key_id ON api_logs(api_key_id);
CREATE INDEX idx_api_logs_occurred_at ON api_logs(occurred_at);
CREATE INDEX idx_api_logs_response_status ON api_logs(response_status);
CREATE INDEX idx_webhook_endpoints_organization_id ON webhook_endpoints(organization_id);
CREATE INDEX idx_webhook_deliveries_webhook_endpoint_id ON webhook_deliveries(webhook_endpoint_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_created_at ON webhook_deliveries(created_at);
CREATE INDEX idx_sdk_releases_platform ON sdk_releases(platform);
CREATE INDEX idx_sdk_releases_created_at ON sdk_releases(created_at);
CREATE INDEX idx_sdk_downloads_sdk_release_id ON sdk_downloads(sdk_release_id);
CREATE INDEX idx_api_clients_organization_id ON api_clients(organization_id);
CREATE INDEX idx_api_access_tokens_client_id ON api_access_tokens(client_id);
CREATE INDEX idx_api_access_tokens_user_id ON api_access_tokens(user_id);
CREATE INDEX idx_api_access_tokens_expires_at ON api_access_tokens(expires_at);
CREATE INDEX idx_api_usage_stats_organization_id ON api_usage_stats(organization_id);
CREATE INDEX idx_api_usage_stats_period_start ON api_usage_stats(period_start);

-- Create RLS policies
CREATE POLICY "Users can view API keys in their organization" ON api_keys
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage API keys in their organization" ON api_keys
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ) AND created_by = auth.uid());

CREATE POLICY "Users can view their API rate limits" ON api_rate_limits
    FOR SELECT USING (api_key_id IN (
        SELECT id FROM api_keys WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view API logs for their organization" ON api_logs
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view webhook endpoints in their organization" ON webhook_endpoints
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage webhook endpoints in their organization" ON webhook_endpoints
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ) AND created_by = auth.uid());

CREATE POLICY "Users can view webhook deliveries for their webhooks" ON webhook_deliveries
    FOR SELECT USING (webhook_endpoint_id IN (
        SELECT id FROM webhook_endpoints WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

-- API versions are publicly readable
CREATE POLICY "API versions are publicly readable" ON api_versions
    FOR SELECT USING (true);

-- SDK releases are publicly readable
CREATE POLICY "SDK releases are publicly readable" ON sdk_releases
    FOR SELECT USING (true);

-- Track SDK downloads anonymously
CREATE POLICY "SDK downloads can be inserted anonymously" ON sdk_downloads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "API features are readable by authenticated users" ON api_features
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage API clients in their organization" ON api_clients
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage their API access tokens" ON api_access_tokens
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view API usage stats for their organization" ON api_usage_stats
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));
