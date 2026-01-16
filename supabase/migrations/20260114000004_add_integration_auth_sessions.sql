-- Add integration auth sessions table for storing OAuth and API key authentication sessions
-- Migration: 20260114000004_add_integration_auth_sessions

CREATE TABLE IF NOT EXISTS integration_auth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id TEXT NOT NULL REFERENCES integration_providers(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
    credentials JSONB NOT NULL, -- Encrypted credentials: access_token, refresh_token, api_key, etc.
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_auth_sessions_provider_org ON integration_auth_sessions(provider_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_integration_auth_sessions_user ON integration_auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_auth_sessions_status ON integration_auth_sessions(status);

-- RLS
ALTER TABLE integration_auth_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own organization's auth sessions
CREATE POLICY "Users can manage auth sessions in their organization" ON integration_auth_sessions
FOR ALL USING (
    organization_id IN (
        SELECT organization_id FROM user_organization_memberships
        WHERE user_id = auth.uid()
    )
);
