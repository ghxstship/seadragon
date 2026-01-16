-- Create advanced AI feature infrastructure

-- AI model configurations and providers
CREATE TABLE ai_providers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL, -- "OpenAI", "Anthropic", "Google", "HuggingFace"
    provider_type TEXT NOT NULL, -- "api", "self_hosted", "hybrid"
    api_base_url TEXT,
    api_key_encrypted TEXT, -- Encrypted API key
    models_supported JSONB, -- array of supported model names
    rate_limits JSONB, -- rate limiting configuration
    cost_per_token DECIMAL(10,6),
    is_active BOOLEAN DEFAULT true,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI models and configurations
CREATE TABLE ai_models (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    provider_id TEXT NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL, -- "gpt-4", "claude-3", "gemini-pro"
    model_version TEXT,
    model_type TEXT NOT NULL, -- "chat", "completion", "embedding", "image", "audio"
    context_window INTEGER,
    max_tokens INTEGER,
    capabilities JSONB, -- supported features like "function_calling", "vision", etc.
    parameters JSONB, -- default parameters like temperature, top_p, etc.
    cost_per_input_token DECIMAL(10,6),
    cost_per_output_token DECIMAL(10,6),
    is_active BOOLEAN DEFAULT true,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI agents (conversational assistants)
CREATE TABLE ai_agents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    model_id TEXT NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
    system_prompt TEXT NOT NULL,
    capabilities JSONB, -- array of capabilities like "task_creation", "event_planning", "vendor_matching"
    personality JSONB, -- personality traits and tone settings
    knowledge_base_id TEXT REFERENCES ai_knowledge_base(id),
    tools_enabled JSONB, -- enabled tools/functions
    is_active BOOLEAN DEFAULT true,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI agent conversations context
CREATE TABLE ai_agent_contexts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    agent_id TEXT NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    context_type TEXT NOT NULL, -- "event_planning", "vendor_search", "budget_analysis"
    context_data JSONB, -- relevant context like event_id, project_id, etc.
    session_data JSONB, -- conversation history and state
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI background jobs/tasks
CREATE TABLE ai_jobs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    job_type TEXT NOT NULL, -- "prediction", "content_generation", "matching", "analysis"
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    priority INTEGER DEFAULT 1, -- 1=low, 5=high
    parameters JSONB, -- job-specific parameters
    result_data JSONB, -- job results when completed
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    requested_by TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI training data management
CREATE TABLE ai_training_data (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    data_type TEXT NOT NULL, -- "conversations", "events", "vendors", "feedback"
    source_entity_type TEXT, -- "event", "user", "project", etc.
    source_entity_id TEXT,
    training_content JSONB, -- the actual training data
    labels JSONB, -- classification labels for supervised learning
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5),
    is_used BOOLEAN DEFAULT false,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI performance monitoring
CREATE TABLE ai_model_performance (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    model_id TEXT NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL, -- "accuracy", "latency", "cost", "success_rate"
    metric_value DECIMAL(10,4),
    sample_size INTEGER,
    time_period_start TIMESTAMP WITH TIME ZONE,
    time_period_end TIMESTAMP WITH TIME ZONE,
    context JSONB, -- additional context like task type, parameters used
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI feature configurations
CREATE TABLE ai_feature_configs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    feature_name TEXT NOT NULL, -- "predictive_analytics", "content_generation", "smart_matching"
    config_key TEXT NOT NULL,
    config_value JSONB,
    is_enabled BOOLEAN DEFAULT true,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(feature_name, config_key, organization_id)
);

-- AI recommendation engine rules
CREATE TABLE ai_recommendation_rules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL, -- "similarity", "popularity", "collaborative", "content_based"
    target_entity TEXT NOT NULL, -- "event", "experience", "creator", "destination"
    conditions JSONB, -- conditions for when to apply this rule
    weight DECIMAL(3,2) DEFAULT 1.0, -- importance weight
    is_active BOOLEAN DEFAULT true,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI content templates
CREATE TABLE ai_content_templates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    template_name TEXT NOT NULL,
    template_type TEXT NOT NULL, -- "marketing_copy", "event_description", "email", "social_post"
    template_content TEXT NOT NULL,
    variables JSONB, -- available variables for template
    model_id TEXT REFERENCES ai_models(id),
    quality_score DECIMAL(3,2), -- average quality rating
    usage_count INTEGER DEFAULT 0,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all AI infrastructure tables
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feature_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_templates ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_ai_providers_organization_id ON ai_providers(organization_id);
CREATE INDEX idx_ai_models_provider_id ON ai_models(provider_id);
CREATE INDEX idx_ai_models_organization_id ON ai_models(organization_id);
CREATE INDEX idx_ai_agents_organization_id ON ai_agents(organization_id);
CREATE INDEX idx_ai_agents_model_id ON ai_agents(model_id);
CREATE INDEX idx_ai_agent_contexts_agent_id ON ai_agent_contexts(agent_id);
CREATE INDEX idx_ai_agent_contexts_user_id ON ai_agent_contexts(user_id);
CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
CREATE INDEX idx_ai_jobs_organization_id ON ai_jobs(organization_id);
CREATE INDEX idx_ai_jobs_created_at ON ai_jobs(created_at);
CREATE INDEX idx_ai_training_data_organization_id ON ai_training_data(organization_id);
CREATE INDEX idx_ai_training_data_data_type ON ai_training_data(data_type);
CREATE INDEX idx_ai_model_performance_model_id ON ai_model_performance(model_id);
CREATE INDEX idx_ai_model_performance_recorded_at ON ai_model_performance(recorded_at);
CREATE INDEX idx_ai_feature_configs_organization_id ON ai_feature_configs(organization_id);
CREATE INDEX idx_ai_recommendation_rules_organization_id ON ai_recommendation_rules(organization_id);
CREATE INDEX idx_ai_content_templates_organization_id ON ai_content_templates(organization_id);

-- Create RLS policies
CREATE POLICY "Users can view AI providers in their organization" ON ai_providers
    FOR SELECT USING (organization_id IS NULL OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage AI providers in their organization" ON ai_providers
    FOR ALL USING (organization_id IS NULL OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view AI models in their organization" ON ai_models
    FOR SELECT USING (organization_id IS NULL OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage AI models in their organization" ON ai_models
    FOR ALL USING (organization_id IS NULL OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view AI agents in their organization" ON ai_agents
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage AI agents in their organization" ON ai_agents
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage their own AI agent contexts" ON ai_agent_contexts
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view AI jobs in their organization" ON ai_jobs
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create AI jobs in their organization" ON ai_jobs
    FOR INSERT WITH CHECK (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ) AND requested_by = auth.uid());

CREATE POLICY "Users can view AI training data in their organization" ON ai_training_data
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage AI training data in their organization" ON ai_training_data
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view AI performance metrics in their organization" ON ai_model_performance
    FOR SELECT USING (organization_id IS NULL OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage AI feature configs in their organization" ON ai_feature_configs
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage AI recommendation rules in their organization" ON ai_recommendation_rules
    FOR ALL USING (organization_id IS NULL OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view AI content templates in their organization" ON ai_content_templates
    FOR SELECT USING (organization_id IS NULL OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage AI content templates in their organization" ON ai_content_templates
    FOR ALL USING (organization_id IS NULL OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ) AND created_by = auth.uid());
