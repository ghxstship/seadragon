-- CONSOLIDATED MERGE MIGRATION: Add Missing Tables to Remote Database
-- Migration: 20260113000001_add_missing_tables
-- All IDs use UUID to match remote database schema
-- Remote uses platform_users as primary user table

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Compatibility view
DROP VIEW IF EXISTS users CASCADE;
CREATE VIEW users AS SELECT * FROM platform_users;

-- Enhance platform_users
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_users' AND column_name = 'password_hash') THEN
        ALTER TABLE platform_users ADD COLUMN password_hash TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_users' AND column_name = 'mfa_enabled') THEN
        ALTER TABLE platform_users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- AI INFRASTRUCTURE
CREATE TABLE IF NOT EXISTS ai_providers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL UNIQUE, provider_type TEXT NOT NULL, api_endpoint TEXT, supported_models JSONB, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_models (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), provider_id UUID REFERENCES ai_providers(id) ON DELETE CASCADE, name TEXT NOT NULL, model_id TEXT NOT NULL, model_type TEXT NOT NULL, capabilities JSONB, context_window INTEGER, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_agents (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, agent_type TEXT NOT NULL, model_id UUID REFERENCES ai_models(id), system_prompt TEXT, organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_conversations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, agent_id UUID REFERENCES ai_agents(id), title TEXT, status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_messages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE, role TEXT NOT NULL, content TEXT NOT NULL, metadata JSONB, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_knowledge_base (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, knowledge_type TEXT NOT NULL, organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_predictions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), model_type TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id UUID NOT NULL, prediction_data JSONB, accuracy FLOAT, valid_until TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_content (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), content_type TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id UUID NOT NULL, prompt TEXT NOT NULL, generated_content TEXT NOT NULL, model TEXT NOT NULL, approved BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_insights (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), insight_type TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id UUID NOT NULL, title TEXT NOT NULL, description TEXT, confidence FLOAT, organization_id UUID REFERENCES organizations(id), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_recommendations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, recommendation_type TEXT NOT NULL, entity_id UUID NOT NULL, score FLOAT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ai_user_preferences (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL UNIQUE REFERENCES platform_users(id) ON DELETE CASCADE, recommendation_frequency TEXT DEFAULT 'daily', content_generation_enabled BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());

-- PROFILE SYSTEM
CREATE TABLE IF NOT EXISTS billing_tiers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, profile_type TEXT NOT NULL, price DECIMAL(10,2) NOT NULL, currency TEXT DEFAULT 'USD', features JSONB DEFAULT '{}', status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS profiles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL UNIQUE REFERENCES platform_users(id) ON DELETE CASCADE, profile_type TEXT NOT NULL, handle TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, avatar_url TEXT, bio TEXT, visibility TEXT DEFAULT 'public', verified BOOLEAN DEFAULT FALSE, slug TEXT NOT NULL UNIQUE, billing_tier_id UUID REFERENCES billing_tiers(id), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS profile_relationships (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), source_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, target_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, relationship_type TEXT NOT NULL, status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(source_profile_id, target_profile_id, relationship_type));
CREATE TABLE IF NOT EXISTS loyalty_tiers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, min_points INTEGER DEFAULT 0, benefits JSONB DEFAULT '[]', status TEXT DEFAULT 'active');
CREATE TABLE IF NOT EXISTS member_profiles (profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE, first_name TEXT NOT NULL, last_name TEXT NOT NULL, loyalty_tier_id UUID REFERENCES loyalty_tiers(id), loyalty_points INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS professional_profiles (profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE, headline TEXT, summary TEXT, skills JSONB, open_to_work BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS ambassador_tiers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, commission DECIMAL(5,2), status TEXT DEFAULT 'active');
CREATE TABLE IF NOT EXISTS creator_profiles (profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE, creator_type TEXT NOT NULL, stage_name TEXT, genres JSONB, ambassador_tier_id UUID REFERENCES ambassador_tiers(id), affiliate_code TEXT UNIQUE);
CREATE TABLE IF NOT EXISTS brand_profiles (profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE, brand_type TEXT NOT NULL, legal_name TEXT, services JSONB);

-- WORKFLOW ENGINE
CREATE TABLE IF NOT EXISTS custom_workflows (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, workflow_type TEXT NOT NULL, trigger_type TEXT NOT NULL, organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, created_by UUID NOT NULL REFERENCES platform_users(id), is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS custom_steps (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), workflow_id UUID NOT NULL REFERENCES custom_workflows(id) ON DELETE CASCADE, name TEXT NOT NULL, step_type TEXT NOT NULL, step_order INTEGER NOT NULL, config JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS lifecycle_phases (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, entity_type TEXT NOT NULL, phase_order INTEGER NOT NULL, organization_id UUID REFERENCES organizations(id), created_at TIMESTAMPTZ DEFAULT NOW());

-- SOCIAL
CREATE TABLE IF NOT EXISTS follows (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), follower_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, following_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(follower_id, following_id));
CREATE TABLE IF NOT EXISTS likes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, entity_type TEXT NOT NULL, entity_id UUID NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(user_id, entity_type, entity_id));
CREATE TABLE IF NOT EXISTS comments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), content TEXT NOT NULL, author_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, entity_type TEXT NOT NULL, entity_id UUID NOT NULL, parent_id UUID REFERENCES comments(id), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS messages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), content TEXT NOT NULL, sender_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, receiver_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, read BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());

-- COMMERCE
CREATE TABLE IF NOT EXISTS carts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, items JSONB DEFAULT '[]', total_amount DECIMAL(10,2) DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, price DECIMAL(10,2) NOT NULL, organization_id UUID REFERENCES organizations(id), status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS wallets (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL UNIQUE REFERENCES platform_users(id) ON DELETE CASCADE, balance DECIMAL(10,2) DEFAULT 0, currency TEXT DEFAULT 'USD', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS invoices (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), invoice_number TEXT NOT NULL UNIQUE, organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, items JSONB NOT NULL, total DECIMAL(10,2) NOT NULL, status TEXT DEFAULT 'draft', created_by UUID NOT NULL REFERENCES platform_users(id), created_at TIMESTAMPTZ DEFAULT NOW());

-- CONTENT
CREATE TABLE IF NOT EXISTS media (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), filename TEXT NOT NULL, url TEXT NOT NULL, type TEXT NOT NULL, mime_type TEXT NOT NULL, size BIGINT NOT NULL, uploaded_by UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS content_libraries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, library_type TEXT NOT NULL, created_by UUID NOT NULL REFERENCES platform_users(id), created_at TIMESTAMPTZ DEFAULT NOW());

-- ANALYTICS
CREATE TABLE IF NOT EXISTS kpis (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, category TEXT NOT NULL, metric_type TEXT NOT NULL, organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS dashboards (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, layout JSONB, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS reports (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, report_type TEXT NOT NULL, organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, generated_by UUID NOT NULL REFERENCES platform_users(id), created_at TIMESTAMPTZ DEFAULT NOW());

-- OPERATIONAL
CREATE TABLE IF NOT EXISTS categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, type TEXT NOT NULL, parent_id UUID REFERENCES categories(id), organization_id UUID REFERENCES organizations(id), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS destinations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, type TEXT NOT NULL, organization_id UUID REFERENCES organizations(id), status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS experiences (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, type TEXT NOT NULL, price DECIMAL(10,2), organization_id UUID REFERENCES organizations(id), destination_id UUID REFERENCES destinations(id), status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS reservations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE, user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, date TIMESTAMPTZ NOT NULL, guests INTEGER DEFAULT 1, total_amount DECIMAL(10,2) NOT NULL, status TEXT DEFAULT 'confirmed', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS itineraries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, name TEXT NOT NULL, start_date TIMESTAMPTZ NOT NULL, end_date TIMESTAMPTZ NOT NULL, status TEXT DEFAULT 'planning', created_at TIMESTAMPTZ DEFAULT NOW());

-- EVENTS
CREATE TABLE IF NOT EXISTS events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, slug TEXT NOT NULL, project_id UUID REFERENCES projects(id) ON DELETE CASCADE, start_date TIMESTAMPTZ NOT NULL, end_date TIMESTAMPTZ NOT NULL, status TEXT DEFAULT 'planning', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS productions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE, name TEXT NOT NULL, type TEXT NOT NULL, status TEXT DEFAULT 'planning', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS schedules (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE, name TEXT NOT NULL, start_time TIMESTAMPTZ NOT NULL, end_time TIMESTAMPTZ NOT NULL, type TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());

-- MISC
CREATE TABLE IF NOT EXISTS activities (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, action TEXT NOT NULL, entity TEXT NOT NULL, entity_id UUID NOT NULL, details JSONB, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS sessions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, token TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS roles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, permissions JSONB DEFAULT '[]');
CREATE TABLE IF NOT EXISTS tasks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, status TEXT DEFAULT 'todo', priority TEXT DEFAULT 'medium', assigned_to UUID REFERENCES platform_users(id), created_by UUID NOT NULL REFERENCES platform_users(id), organization_id UUID NOT NULL REFERENCES organizations(id), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS actions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, type TEXT DEFAULT 'approval', status TEXT DEFAULT 'pending', assigned_to UUID REFERENCES platform_users(id), created_by UUID NOT NULL REFERENCES platform_users(id), organization_id UUID NOT NULL REFERENCES organizations(id), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS fitness_programs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, type TEXT NOT NULL, duration INTEGER NOT NULL, user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS exercises (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, category TEXT NOT NULL, muscle_groups JSONB DEFAULT '[]', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS workouts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), program_id UUID REFERENCES fitness_programs(id), name TEXT NOT NULL, date TIMESTAMPTZ NOT NULL, duration INTEGER NOT NULL, user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT NOW());

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_events_project ON events(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(organization_id);

-- RLS
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can manage own AI conversations" ON ai_conversations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (user_id = auth.uid() OR visibility = 'public');
CREATE POLICY "Users can manage own follows" ON follows FOR ALL USING (follower_id = auth.uid());
CREATE POLICY "Users can manage own likes" ON likes FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own cart" ON carts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (user_id = auth.uid());
