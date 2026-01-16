-- Create missing analytics and reporting tables
CREATE TABLE kpis (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- event, financial, operational, marketing
    metric_type TEXT NOT NULL, -- count, percentage, currency, time
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    unit TEXT,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE kpi_values (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    kpi_id TEXT NOT NULL REFERENCES kpis(id) ON DELETE CASCADE,
    value DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    period TEXT, -- daily, weekly, monthly
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE dashboards (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    layout JSONB,
    filters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE dashboard_kpis (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    dashboard_id TEXT NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    kpi_id TEXT NOT NULL REFERENCES kpis(id) ON DELETE CASCADE,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 4,
    height INTEGER DEFAULT 3,
    chart_type TEXT DEFAULT 'line', -- line, bar, pie, gauge
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE dashboard_charts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    dashboard_id TEXT NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    chart_type TEXT NOT NULL,
    data_source JSONB,
    configuration JSONB,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 6,
    height INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE automated_insights (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    insight_type TEXT NOT NULL, -- trend, anomaly, correlation, prediction
    severity TEXT DEFAULT 'info', -- info, warning, critical
    data JSONB,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    related_entity_type TEXT, -- event, project, user
    related_entity_id TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE insight_alerts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_id TEXT NOT NULL REFERENCES automated_insights(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE report_templates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL, -- financial, operational, marketing, custom
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    configuration JSONB,
    is_public BOOLEAN DEFAULT false,
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    template_id TEXT REFERENCES report_templates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    report_type TEXT NOT NULL,
    parameters JSONB,
    data JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by TEXT NOT NULL REFERENCES users(id),
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE data_exports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    export_type TEXT NOT NULL, -- csv, json, pdf, excel
    entity_type TEXT NOT NULL, -- users, events, transactions, etc
    filters JSONB,
    file_url TEXT,
    file_size INTEGER,
    record_count INTEGER,
    requested_by TEXT NOT NULL REFERENCES users(id),
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE performance_metrics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,2),
    unit TEXT,
    category TEXT NOT NULL,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_analytics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- page_view, action, purchase, etc
    event_data JSONB,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversion_funnels (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    steps JSONB, -- array of step definitions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    funnel_id TEXT REFERENCES conversion_funnels(id) ON DELETE SET NULL,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    session_id TEXT,
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create missing advanced AI tables
CREATE TABLE ai_predictions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    model_type TEXT NOT NULL, -- attendance, revenue, engagement, risk
    entity_type TEXT NOT NULL, -- event, experience, destination, profile
    entity_id TEXT NOT NULL,
    prediction_data JSONB, -- Model predictions and confidence intervals
    accuracy FLOAT, -- Historical accuracy of this prediction type
    factors JSONB, -- Key factors influencing the prediction
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_content (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    content_type TEXT NOT NULL, -- description, marketing_copy, event_summary, review_response
    entity_type TEXT NOT NULL, -- event, experience, destination, profile
    entity_id TEXT NOT NULL,
    prompt TEXT NOT NULL, -- Original prompt used
    generated_content TEXT NOT NULL,
    model TEXT NOT NULL, -- AI model used (GPT-4, Claude, etc.)
    tokens_used INTEGER,
    approved BOOLEAN DEFAULT false,
    approved_by TEXT REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_matches (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    match_type TEXT NOT NULL, -- creator_venue, event_attendee, partnership, collaboration
    source_entity_type TEXT NOT NULL,
    source_entity_id TEXT NOT NULL,
    target_entity_type TEXT NOT NULL,
    target_entity_id TEXT NOT NULL,
    match_score FLOAT NOT NULL, -- 0-1 compatibility score
    criteria JSONB, -- Matching criteria and weights
    insights JSONB, -- AI-generated insights about the match
    status TEXT DEFAULT 'suggested', -- suggested, contacted, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_insights (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    insight_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    insight_data JSONB,
    confidence_score FLOAT,
    generated_by TEXT NOT NULL, -- AI model identifier
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_model_metrics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    model_name TEXT NOT NULL,
    model_version TEXT,
    metric_type TEXT NOT NULL, -- accuracy, precision, recall, f1_score
    metric_value FLOAT NOT NULL,
    dataset_size INTEGER,
    test_period_start TIMESTAMP WITH TIME ZONE,
    test_period_end TIMESTAMP WITH TIME ZONE,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_recommendations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL, -- event, experience, creator, destination
    entity_id TEXT NOT NULL,
    score FLOAT NOT NULL,
    reasons JSONB,
    context JSONB, -- User's context when recommendation was made
    is_viewed BOOLEAN DEFAULT false,
    is_clicked BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_user_preferences (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preference_type TEXT NOT NULL,
    preference_data JSONB,
    confidence_score FLOAT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_user_preferences ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_kpis_organization_id ON kpis(organization_id);
CREATE INDEX idx_kpis_event_id ON kpis(event_id);
CREATE INDEX idx_kpi_values_kpi_id ON kpi_values(kpi_id);
CREATE INDEX idx_kpi_values_recorded_at ON kpi_values(recorded_at);
CREATE INDEX idx_dashboards_organization_id ON dashboards(organization_id);
CREATE INDEX idx_dashboards_user_id ON dashboards(user_id);
CREATE INDEX idx_dashboard_kpis_dashboard_id ON dashboard_kpis(dashboard_id);
CREATE INDEX idx_dashboard_charts_dashboard_id ON dashboard_charts(dashboard_id);
CREATE INDEX idx_automated_insights_organization_id ON automated_insights(organization_id);
CREATE INDEX idx_automated_insights_related_entity ON automated_insights(related_entity_type, related_entity_id);
CREATE INDEX idx_insight_alerts_user_id ON insight_alerts(user_id);
CREATE INDEX idx_insight_alerts_insight_id ON insight_alerts(insight_id);
CREATE INDEX idx_report_templates_organization_id ON report_templates(organization_id);
CREATE INDEX idx_reports_organization_id ON reports(organization_id);
CREATE INDEX idx_reports_template_id ON reports(template_id);
CREATE INDEX idx_data_exports_organization_id ON data_exports(organization_id);
CREATE INDEX idx_data_exports_requested_by ON data_exports(requested_by);
CREATE INDEX idx_performance_metrics_organization_id ON performance_metrics(organization_id);
CREATE INDEX idx_performance_metrics_recorded_at ON performance_metrics(recorded_at);
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX idx_user_analytics_occurred_at ON user_analytics(occurred_at);
CREATE INDEX idx_conversion_funnels_organization_id ON conversion_funnels(organization_id);
CREATE INDEX idx_conversions_funnel_id ON conversions(funnel_id);
CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_ai_predictions_entity ON ai_predictions(entity_type, entity_id);
CREATE INDEX idx_ai_predictions_valid_until ON ai_predictions(valid_until);
CREATE INDEX idx_ai_content_entity ON ai_content(entity_type, entity_id);
CREATE INDEX idx_ai_content_approved ON ai_content(approved);
CREATE INDEX idx_ai_matches_source ON ai_matches(source_entity_type, source_entity_id);
CREATE INDEX idx_ai_matches_target ON ai_matches(target_entity_type, target_entity_id);
CREATE INDEX idx_ai_matches_status ON ai_matches(status);
CREATE INDEX idx_ai_insights_entity ON ai_insights(entity_type, entity_id);
CREATE INDEX idx_ai_model_metrics_model_name ON ai_model_metrics(model_name);
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_entity ON ai_recommendations(recommendation_type, entity_id);
CREATE INDEX idx_ai_user_preferences_user_id ON ai_user_preferences(user_id);

-- Create RLS policies (basic policies - refine based on role permissions)
CREATE POLICY "Users can view KPIs in their organization" ON kpis
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create KPIs in their organization" ON kpis
    FOR INSERT WITH CHECK (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update KPIs in their organization" ON kpis
    FOR UPDATE USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view KPI values for KPIs in their organization" ON kpi_values
    FOR SELECT USING (kpi_id IN (
        SELECT id FROM kpis WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can create KPI values for KPIs in their organization" ON kpi_values
    FOR INSERT WITH CHECK (kpi_id IN (
        SELECT id FROM kpis WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view their own dashboards" ON dashboards
    FOR SELECT USING (user_id = auth.uid() OR (is_public = true AND organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    )));

CREATE POLICY "Users can create their own dashboards" ON dashboards
    FOR INSERT WITH CHECK (user_id = auth.uid() AND organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own dashboards" ON dashboards
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view dashboard KPIs for accessible dashboards" ON dashboard_kpis
    FOR SELECT USING (dashboard_id IN (
        SELECT id FROM dashboards WHERE user_id = auth.uid() OR (is_public = true AND organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        ))
    ));

CREATE POLICY "Users can manage dashboard KPIs for their dashboards" ON dashboard_kpis
    FOR ALL USING (dashboard_id IN (
        SELECT id FROM dashboards WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view insights in their organization" ON automated_insights
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own insight alerts" ON insight_alerts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own insight alerts" ON insight_alerts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view report templates in their organization" ON report_templates
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ) OR is_public = true);

CREATE POLICY "Users can create report templates in their organization" ON report_templates
    FOR INSERT WITH CHECK (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ) AND created_by = auth.uid());

CREATE POLICY "Users can view reports in their organization" ON reports
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create reports in their organization" ON reports
    FOR INSERT WITH CHECK (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ) AND generated_by = auth.uid());

CREATE POLICY "Users can view their own data exports" ON data_exports
    FOR SELECT USING (requested_by = auth.uid() OR organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create data exports in their organization" ON data_exports
    FOR INSERT WITH CHECK (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ) AND requested_by = auth.uid());

CREATE POLICY "Users can view performance metrics in their organization" ON performance_metrics
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own analytics" ON user_analytics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view conversion funnels in their organization" ON conversion_funnels
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create conversion funnels in their organization" ON conversion_funnels
    FOR INSERT WITH CHECK (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view conversions for funnels in their organization" ON conversions
    FOR SELECT USING (funnel_id IN (
        SELECT id FROM conversion_funnels WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ) OR funnel_id IS NULL);

-- AI tables policies
CREATE POLICY "Users can view AI predictions for entities in their organization" ON ai_predictions
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view AI content for entities they can access" ON ai_content
    FOR SELECT USING (
        approved = true OR approved_by = auth.uid() OR
        entity_type = 'profile' AND entity_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create AI content for entities they can access" ON ai_content
    FOR INSERT WITH CHECK (
        entity_type = 'profile' AND entity_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view AI matches for entities they can access" ON ai_matches
    FOR SELECT USING (
        (source_entity_type = 'profile' AND source_entity_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())) OR
        (target_entity_type = 'profile' AND target_entity_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY "Users can view AI insights for entities in their organization" ON ai_insights
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view AI model metrics in their organization" ON ai_model_metrics
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own AI recommendations" ON ai_recommendations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own AI recommendations" ON ai_recommendations
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view their own AI preferences" ON ai_user_preferences
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own AI preferences" ON ai_user_preferences
    FOR ALL USING (user_id = auth.uid());
