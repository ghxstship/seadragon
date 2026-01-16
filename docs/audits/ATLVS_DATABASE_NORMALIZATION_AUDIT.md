# ATLVS Database Normalization Audit Report

## Overview
This report analyzes the current Supabase database schema for 3NF compliance and identifies normalization opportunities in preparation for the ATLVS UI rebuild.

## Current Schema Analysis

### Core Entities Identified

#### CORE Section
- **tasks**: id, title, description, status, priority, due_date, assigned_to, created_by, project_id, workspace_id, organization_id, parent_id
- **workflows**: custom_workflows (id, name, workflow_type, trigger_type, organization_id, created_by), custom_steps (id, workflow_id, name, step_type, step_order, config)
- **assets**: Multiple asset table variations found across migrations (asset_inventory, assets, media)
- **documents**: content_libraries (id, name, organization_id, library_type), media (id, filename, url, type, mime_type, size, uploaded_by)
- **events**: events (id, name, slug, project_id, start_date, end_date, status), productions (id, event_id, name, type, status), schedules (id, event_id, name, start_time, end_time, type)

#### TEAM Section
- **projects**: Referenced in foreign keys but table definition not found in analyzed migrations
- **people**: profiles (id, user_id, profile_type, handle, display_name, avatar_url, bio), member_profiles, professional_profiles, creator_profiles, brand_profiles
- **products**: products (id, name, slug, price, organization_id, status)
- **places**: destinations (id, name, slug, type, organization_id, status)
- **procedures**: lifecycle_phases (id, name, entity_type, phase_order, organization_id)

#### MANAGEMENT Section
- **forecasts**: Not found in analyzed migrations
- **pipeline**: Not found in analyzed migrations
- **jobs**: Not found in analyzed migrations
- **procurement**: Referenced in migration filenames but not found in analyzed content
- **content**: content_libraries, media
- **compliance**: Not found in analyzed migrations
- **reports**: reports (id, name, report_type, organization_id, generated_by)
- **insights**: ai_insights (id, insight_type, entity_type, entity_id, title, description, confidence, organization_id)

#### NETWORK Section
- **showcase**: Not found in analyzed migrations
- **discussions**: comments (id, content, author_id, entity_type, entity_id, parent_id)
- **challenges**: Not found in analyzed migrations
- **marketplace**: products table
- **opportunities**: Not found in analyzed migrations
- **connections**: follows (id, follower_id, following_id), profile_relationships (id, source_profile_id, target_profile_id, relationship_type, status)

#### ACCOUNT Section
- **profile**: profiles table
- **organization**: organizations (id, name, slug, domain)
- **billing**: invoices (id, invoice_number, organization_id, items, total, status), wallets (id, user_id, balance, currency)
- **history**: activities (id, user_id, action, entity, entity_id, details)
- **resources**: Not found in analyzed migrations
- **system**: Not found in analyzed migrations
- **support**: Not found in analyzed migrations

### 3NF Compliance Assessment

#### 3NF Requirements Reminder
1. **1NF**: All attributes are atomic, no repeating groups
2. **2NF**: No partial dependencies (non-key attributes depend on the whole primary key)
3. **3NF**: No transitive dependencies (non-key attributes don't depend on other non-key attributes)

#### Current Issues Found

##### 1. Multiple Asset Table Definitions
**Issue**: Asset-related data is scattered across multiple tables with inconsistent schemas:
- `asset_inventory` tables in multiple migrations
- `assets` table variations
- `media` table for file assets

**3NF Violation**: Redundant storage of asset metadata, inconsistent relationships.

**Recommendation**: Consolidate into single `assets` table with asset_type discriminator.

##### 2. Profile Inheritance Issues
**Issue**: Profile data uses inheritance pattern with separate tables:
- `profiles` (base)
- `member_profiles`, `professional_profiles`, `creator_profiles`, `brand_profiles` (subtypes)

**3NF Violation**: Profile attributes scattered across multiple tables, making queries complex.

**Recommendation**: Flatten profile structure or use single table with profile_type discriminator.

##### 3. Workflow Complexity
**Issue**: Workflow engine has complex relationships:
- `custom_workflows` → `custom_steps`
- `custom_workflow_design_templates` → `custom_workflow_design_components`
- `custom_workflow_execution_instances`

**Assessment**: Generally 3NF compliant but overly complex. Consider simplifying.

##### 4. Event-Production-Schedule Hierarchy
**Issue**: Three-level hierarchy may violate normalization if attributes depend on multiple levels.

**Assessment**: Appears 3NF compliant with proper foreign key relationships.

##### 5. Missing Entity Tables
**Critical Gap**: Several IA entities have no corresponding database tables:
- projects (referenced but not defined)
- forecasts
- pipeline
- jobs
- procurement
- compliance
- showcase
- challenges
- opportunities
- resources
- system/platform settings
- support tickets

**Impact**: These missing entities will prevent proper UI reattachment.

##### 6. JSONB Overuse
**Issue**: Extensive use of JSONB columns:
- branding_settings.colors, .typography
- integration_settings.* (all fields are JSONB)
- permission_settings (empty table with JSONB planned)
- ai_* tables with JSONB configs
- profile relationships and features

**3NF Assessment**: JSONB fields can hide normalization issues by storing complex data structures.

**Recommendation**: Extract JSONB data into proper normalized tables where appropriate.

### Normalization Opportunities

#### High Priority
1. **Create Missing Entity Tables**: Projects, forecasts, pipeline, jobs, procurement, compliance, opportunities, etc.
2. **Consolidate Asset Tables**: Single assets table with type discrimination
3. **Normalize Profile Structure**: Single profiles table or cleaner inheritance
4. **Extract JSONB Structures**: Convert complex JSONB fields to related tables

#### Medium Priority
1. **Workflow Simplification**: Reduce complexity in custom workflow engine
2. **Category Hierarchy**: Ensure categories table supports proper tree structure
3. **Integration Settings**: Normalize integration configurations

#### Low Priority
1. **Audit Remaining JSONB Usage**: Identify other areas for normalization
2. **Index Optimization**: Ensure proper indexing for new normalized structure

### Single Source of Truth Analysis

#### Current Issues
- **Duplicate State**: Asset metadata duplicated across multiple tables
- **Inconsistent Relationships**: Projects referenced but not defined
- **Shadow Tables**: Multiple variations of similar entities

#### Recommendations
1. **Entity Ownership**: Clearly define one table per entity type
2. **Relationship Cleanup**: Remove redundant foreign keys and relationships
3. **Data Migration Plan**: Migrate existing data to normalized structure

### Database Schema Recommendations

#### Required Schema Changes
```sql
-- Create missing core entities
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  status TEXT DEFAULT 'planning',
  created_by UUID NOT NULL REFERENCES platform_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consolidate assets
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL, -- 'media', 'equipment', 'document', etc.
  organization_id UUID NOT NULL REFERENCES organizations(id),
  metadata JSONB, -- Keep for flexibility but minimize usage
  created_by UUID NOT NULL REFERENCES platform_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Normalize profiles
ALTER TABLE profiles ADD COLUMN profile_data JSONB;
-- Or create separate tables for each profile type with proper relationships
```

### Migration Plan
1. **Phase 1**: Create missing entity tables
2. **Phase 2**: Consolidate duplicate tables (assets, profiles)
3. **Phase 3**: Extract critical JSONB structures
4. **Phase 4**: Update foreign key relationships
5. **Phase 5**: Data migration and validation

### Impact on UI Rebuild
- **Missing Tables**: UI components for missing entities cannot be fully implemented
- **Normalization Required**: Backend reattachment will require schema updates
- **RLS Implementation**: Row-Level Security policies need to be designed for new normalized structure

### Next Steps
1. Complete full schema analysis (remaining migration files)
2. Create detailed migration scripts for normalization
3. Update API schemas to match normalized structure
4. Implement RLS policies for all entities
5. Validate data integrity after migrations
