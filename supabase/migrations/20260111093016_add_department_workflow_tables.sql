-- Create department-specific workflow tables for production phases and organizational structure

-- Departments table
CREATE TABLE departments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL, -- EXEC, FIN, CREATIVE, MARKETING, etc.
    description TEXT,
    tier TEXT NOT NULL CHECK (tier IN ('TIER_1', 'TIER_2', 'TIER_3')),
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    manager_user_id TEXT REFERENCES users(id),
    budget_allocated DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department positions/roles
CREATE TABLE department_positions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    code TEXT NOT NULL, -- STAGE_MANAGER, LIGHTING_DIRECTOR, etc.
    description TEXT,
    level TEXT CHECK (level IN ('EXECUTIVE', 'MANAGEMENT', 'SUPERVISOR', 'TECHNICAL', 'SUPPORT', 'ENTRY')),
    required_skills JSONB,
    typical_salary_range JSONB, -- {min: 50000, max: 80000, currency: 'USD'}
    certifications_required JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lifecycle phases
CREATE TABLE lifecycle_phases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL, -- CONCEPT, DEVELOP, ADVANCE, etc.
    description TEXT,
    typical_duration_days INTEGER,
    phase_order INTEGER NOT NULL,
    access_tiers JSONB, -- ["TIER_1", "TIER_2", "TIER_3"]
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase workflows/tasks
CREATE TABLE phase_workflows (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    phase_id TEXT NOT NULL REFERENCES lifecycle_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    estimated_duration_hours INTEGER,
    required_position_id TEXT REFERENCES department_positions(id),
    dependencies JSONB, -- array of workflow IDs this depends on
    deliverables JSONB, -- expected outputs
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    is_mandatory BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event department assignments
CREATE TABLE event_departments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    budget_allocated DECIMAL(12,2) DEFAULT 0,
    head_user_id TEXT REFERENCES users(id),
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, department_id)
);

-- Event phase tracking
CREATE TABLE event_phases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    phase_id TEXT NOT NULL REFERENCES lifecycle_phases(id) ON DELETE CASCADE,
    planned_start_date DATE,
    actual_start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'overdue', 'cancelled')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    assigned_departments JSONB, -- departments responsible for this phase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, phase_id)
);

-- Workflow task assignments
CREATE TABLE workflow_assignments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_phase_id TEXT NOT NULL REFERENCES event_phases(id) ON DELETE CASCADE,
    workflow_id TEXT NOT NULL REFERENCES phase_workflows(id) ON DELETE CASCADE,
    assigned_user_id TEXT REFERENCES users(id),
    assigned_department_id TEXT REFERENCES departments(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    due_date DATE,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_phase_id, workflow_id)
);

-- Enable RLS on all new tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecycle_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_assignments ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_departments_organization_id ON departments(organization_id);
CREATE INDEX idx_departments_parent_id ON departments(parent_department_id);
CREATE INDEX idx_department_positions_department_id ON department_positions(department_id);
CREATE INDEX idx_lifecycle_phases_organization_id ON lifecycle_phases(organization_id);
CREATE INDEX idx_phase_workflows_phase_id ON phase_workflows(phase_id);
CREATE INDEX idx_phase_workflows_department_id ON phase_workflows(department_id);
CREATE INDEX idx_event_departments_event_id ON event_departments(event_id);
CREATE INDEX idx_event_departments_department_id ON event_departments(department_id);
CREATE INDEX idx_event_phases_event_id ON event_phases(event_id);
CREATE INDEX idx_event_phases_phase_id ON event_phases(phase_id);
CREATE INDEX idx_workflow_assignments_event_phase_id ON workflow_assignments(event_phase_id);
CREATE INDEX idx_workflow_assignments_assigned_user_id ON workflow_assignments(assigned_user_id);

-- Create RLS policies
CREATE POLICY "Users can view departments in their organization" ON departments
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage departments in their organization" ON departments
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view department positions in their organization" ON department_positions
    FOR SELECT USING (department_id IN (
        SELECT id FROM departments WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage department positions in their organization" ON department_positions
    FOR ALL USING (department_id IN (
        SELECT id FROM departments WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view lifecycle phases in their organization" ON lifecycle_phases
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage lifecycle phases in their organization" ON lifecycle_phases
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view phase workflows in their organization" ON phase_workflows
    FOR SELECT USING (
        department_id IS NULL OR
        department_id IN (
            SELECT id FROM departments WHERE organization_id IN (
                SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage phase workflows in their organization" ON phase_workflows
    FOR ALL USING (
        department_id IS NULL OR
        department_id IN (
            SELECT id FROM departments WHERE organization_id IN (
                SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can view event departments for events they can access" ON event_departments
    FOR SELECT USING (event_id IN (
        SELECT id FROM events WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage event departments for events they can access" ON event_departments
    FOR ALL USING (event_id IN (
        SELECT id FROM events WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view event phases for events they can access" ON event_phases
    FOR SELECT USING (event_id IN (
        SELECT id FROM events WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage event phases for events they can access" ON event_phases
    FOR ALL USING (event_id IN (
        SELECT id FROM events WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view workflow assignments for accessible events" ON workflow_assignments
    FOR SELECT USING (event_phase_id IN (
        SELECT id FROM event_phases WHERE event_id IN (
            SELECT id FROM events WHERE organization_id IN (
                SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage workflow assignments for accessible events" ON workflow_assignments
    FOR ALL USING (event_phase_id IN (
        SELECT id FROM event_phases WHERE event_id IN (
            SELECT id FROM events WHERE organization_id IN (
                SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
            )
        )
    ));
