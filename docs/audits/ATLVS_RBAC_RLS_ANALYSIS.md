# ATLVS RBAC and RLS Implementation Analysis

## Overview
This report analyzes the current Role-Based Access Control (RBAC) and Row-Level Security (RLS) implementation in preparation for the ATLVS UI rebuild.

## Current RBAC Structure

### Roles System
Based on the navigation configuration and database schema:

#### Role Types Identified
1. **guest** - Public access (limited)
2. **member** - Basic authenticated user
3. **manager** - Operational management access
4. **admin** - Administrative access
5. **super_admin** - Full system access
6. **platform_dev** - Platform development access

#### Role Permissions Storage
```sql
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  organization_id TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  CONSTRAINT fk_role_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

#### Navigation-Level Access Control
From `/src/config/navigation.ts`:
- Each nav item has optional `roles` array
- `allowedForRole()` function checks role membership
- Hierarchical role system (higher roles inherit lower permissions)

## Current RLS Implementation

### Tenant Isolation Pattern
**Primary Pattern**: Organization-based tenant isolation
```sql
CREATE POLICY "tenant_isolation" ON [table] FOR ALL
USING (organization_id = (current_setting('app.current_organization_id')::text));
```

**Applied to major entities**:
- procurement_requests
- suppliers
- procurement_orders
- projects (assumed)
- tasks
- workflows
- assets
- events
- reports
- invoices

### User-Based Access Patterns

#### Profile Ownership
```sql
CREATE POLICY "Owners manage brand profiles" ON brand_profiles
FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
```

#### Content Ownership
```sql
CREATE POLICY "Users manage their content" ON [content_table]
FOR ALL USING (created_by = auth.uid());
```

### Public Access Policies
```sql
CREATE POLICY "Public can view brand profiles" ON brand_profiles
FOR SELECT USING (true);
```

## RLS Coverage Analysis

### Well-Covered Entities
- **Procurement**: Full tenant isolation + ownership checks
- **Financial**: Invoices, wallets with tenant isolation
- **Content**: Media, libraries with ownership
- **AI/Chat**: Conversations, messages with user ownership
- **Social**: Follows, likes, comments with user ownership

### Partially Covered Entities
- **Tasks**: Organization-based but may need role-based restrictions
- **Projects**: Referenced in policies but table definition unclear
- **Assets**: Multiple asset tables with inconsistent RLS
- **Events**: Organization-based but may need additional role restrictions

### Missing RLS Coverage
Based on IA requirements, these entities lack proper RLS:

#### CORE Section
- **Workflows**: Custom workflows need role-based execution permissions
- **Assets**: Consolidated asset table needs tenant + role isolation
- **Documents**: Content libraries need granular permission controls

#### TEAM Section
- **Projects**: Complete RLS implementation missing
- **People**: Profile access needs role-based restrictions
- **Procedures**: Lifecycle phases need organization isolation

#### MANAGEMENT Section
- **Forecast**: Missing table and RLS
- **Pipeline**: Missing table and RLS
- **Jobs**: Missing table and RLS
- **Compliance**: Missing table and RLS
- **Reports**: Needs role-based access controls

#### NETWORK Section
- **Showcase**: Missing table and RLS
- **Challenges**: Missing table and RLS
- **Opportunities**: Missing table and RLS
- **Connections**: Profile relationships need access controls

#### ACCOUNT Section
- **System/Platform**: Settings need admin-only access
- **Resources**: Missing table and RLS

## Role-Based Access Matrix (Required)

### Navigation Access
| Section | Entity | guest | member | manager | admin | super_admin | platform_dev |
|---------|--------|-------|--------|---------|-------|-------------|--------------|
| CORE | Dashboard |  |  |  |  |  |  |
| CORE | Calendar |  |  |  |  |  |  |
| CORE | Tasks |  |  |  |  |  |  |
| CORE | Workflows |  |  |  |  |  |  |
| CORE | Assets |  |  |  |  |  |  |
| CORE | Documents |  |  |  |  |  |  |
| TEAM | Projects |  |  |  |  |  |  |
| TEAM | Programming |  |  |  |  |  |  |
| TEAM | People |  |  |  |  |  |  |
| TEAM | Products |  |  |  |  |  |  |
| TEAM | Places |  |  |  |  |  |  |
| TEAM | Procedures |  |  |  |  |  |  |
| MANAGEMENT | Forecast |  |  |  |  |  |  |
| MANAGEMENT | Pipeline |  |  |  |  |  |  |
| MANAGEMENT | Jobs |  |  |  |  |  |  |
| MANAGEMENT | Procurement |  |  |  |  |  |  |
| MANAGEMENT | Content |  |  |  |  |  |  |
| MANAGEMENT | Compliance |  |  |  |  |  |  |
| MANAGEMENT | Reports |  |  |  |  |  |  |
| MANAGEMENT | Insights |  |  |  |  |  |  |
| NETWORK | Showcase |  |  |  |  |  |  |
| NETWORK | Discussions |  |  |  |  |  |  |
| NETWORK | Challenges |  |  |  |  |  |  |
| NETWORK | Marketplace |  |  |  |  |  |  |
| NETWORK | Opportunities |  |  |  |  |  |  |
| NETWORK | Connections |  |  |  |  |  |  |
| ACCOUNT | Profile |  |  |  |  |  |  |
| ACCOUNT | Organization |  |  |  |  |  |  |
| ACCOUNT | Billing |  |  |  |  |  |  |
| ACCOUNT | History |  |  |  |  |  |  |
| ACCOUNT | Resources |  |  |  |  |  |  |
| ACCOUNT | System |  |  |  |  |  |  |
| ACCOUNT | Support |  |  |  |  |  |  |

### Data Access Levels
| Access Level | Description | Implementation |
|--------------|-------------|----------------|
| **Public Read** | Anonymous users can view | `FOR SELECT USING (true)` |
| **Tenant Read** | Organization members can view org data | `organization_id = current_org_id` |
| **Owner Edit** | Content owners can modify their data | `created_by = auth.uid()` |
| **Role Edit** | Specific roles can modify data | Custom role checking functions |
| **Admin Full** | Admins have full access | Role-based policy checks |

## RLS Implementation Gaps

### Critical Gaps
1. **Missing Tables**: Projects, forecasts, pipeline, jobs, compliance, opportunities, etc.
2. **Inconsistent Asset RLS**: Multiple asset tables need unified policies
3. **Role-Based Data Access**: Current system relies heavily on tenant isolation but lacks granular role permissions
4. **Profile Access Control**: Profile relationships and private data need better protection

### Required RLS Policies

#### For New/Missing Entities
```sql
-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project_access" ON projects FOR ALL USING (
  organization_id = current_org_id AND
  role_level >= required_role_level -- Custom function needed
);

-- Opportunities
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opportunity_access" ON opportunities FOR ALL USING (
  organization_id = current_org_id AND
  (visibility = 'public' OR created_by = auth.uid() OR role_level >= 'manager')
);
```

#### Enhanced Role Checking
Need custom PostgreSQL functions for role-based access:
```sql
CREATE FUNCTION get_user_role_level(user_id UUID, org_id UUID) RETURNS TEXT;
CREATE FUNCTION check_entity_permission(entity_type TEXT, entity_id UUID, permission TEXT) RETURNS BOOLEAN;
```

## Recommendations

### Phase 1: Foundation
1. **Implement Missing Entity Tables** with proper RLS from creation
2. **Create Role Hierarchy Functions** for consistent permission checking
3. **Standardize Tenant Isolation** across all organization-scoped tables

### Phase 2: Enhancement
1. **Add Role-Based Policies** for granular access control
2. **Implement Data Ownership** checks for user-generated content
3. **Create Audit Logging** for sensitive operations

### Phase 3: Advanced
1. **Attribute-Based Access Control** for complex permission scenarios
2. **Dynamic Permissions** based on organizational structure
3. **Compliance Reporting** for access patterns

## Impact on UI Rebuild

### Navigation Filtering
- Sidebar sections must respect role permissions
- Menu items hidden/shown based on user roles
- Action buttons enabled/disabled based on permissions

### Data Filtering
- API endpoints must implement RLS-consistent filtering
- UI components must handle permission-denied scenarios
- Error states for unauthorized access attempts

### White-Label Considerations
- Organization-level permissions must not conflict with tenant isolation
- Custom role definitions per organization
- Feature toggles must respect role permissions

## Next Steps
1. Complete missing entity table creation with RLS
2. Implement role hierarchy functions
3. Update existing policies for consistency
4. Add comprehensive testing for access control scenarios
5. Document permission matrix for UI development
