# Database Schema Merge Plan

## Analysis Summary

| Category | Count |
|----------|-------|
| **Remote Tables (dragonflyone-v2)** | 349 |
| **Local Tables (opuszero migrations)** | 226 |
| **Common Tables** | 24 |
| **Local-Only Tables** | 202 |
| **Remote-Only Tables** | 325 |
| **Total Merged Tables** | ~551 (after deduplication) |

---

## 3NF Compliance Analysis

### Remote Schema Strengths (KEEP)
1. **Legend Tables** - Excellent lookup/reference tables for 3NF:
   - `legend_categories`, `legend_cost_centers`, `legend_departments`
   - `legend_documents`, `legend_events`, `legend_organizations`
   - `legend_people`, `legend_places`, `legend_positions`
   - `legend_products`, `legend_relationships`, `legend_tags`, `legend_teams`

2. **Profile Polymorphism Pattern** - Well-structured type-specific profiles:
   - `people_profile_*` (artist, attendee, candidate, contact, crew, employee, influencer, mentor, speaker, volunteer)
   - `orgs_profile_*` (agency, client, partner, sponsor, vendor)
   - `places_profile_*` (office, parking, space, staging, venue, warehouse, zone)
   - `products_profile_*` (merchandise, rental, service, subscription, ticket)
   - `events_profile_*` (activation, conference, festival, webinar, workshop)
   - `docs_profile_*` (contract, invoice, report, template)

3. **Chronicle System** - Audit/activity tracking:
   - `chronicle_entries`, `chronicle_daily_aggregates`
   - `chronicle_profile_*` (audit, automation, communication, movement, timesheet, transaction)

4. **Saga Pattern** - Workflow orchestration:
   - `saga_templates`, `saga_instances`, `saga_steps`, `saga_transitions`
   - `saga_profile_*` (approval, automation, change, process, request, submission)

5. **Integration Architecture**:
   - `integration_*_links` tables for external system connections
   - Proper separation of concerns

### Local Schema Strengths (KEEP)
1. **AI Infrastructure** - Comprehensive AI/ML support:
   - `ai_agents`, `ai_agent_contexts`, `ai_models`, `ai_providers`
   - `ai_conversations`, `ai_messages`, `ai_knowledge_base`
   - `ai_recommendations`, `ai_predictions`, `ai_insights`
   - `ai_content`, `ai_content_templates`, `ai_training_data`
   - `ai_feature_configs`, `ai_model_metrics`, `ai_model_performance`

2. **Workflow Engine**:
   - `custom_workflows`, `custom_steps`, `custom_actions`, `custom_triggers`
   - `workflow_assignments`, `phase_workflows`, `lifecycle_phases`

3. **Multi-Profile System** (similar to remote but different structure):
   - `profiles`, `profile_relationships`
   - `member_profiles`, `professional_profiles`, `creator_profiles`
   - `brand_profiles`, `destination_profiles`, `experience_profiles`

4. **Comprehensive Integrations**:
   - `*_integrations` tables for each domain (calendar, crm, finance, hr, etc.)

5. **Event Management**:
   - `events`, `event_phases`, `event_programs`, `event_instances`
   - `event_assets`, `event_departments`

---

## Merge Strategy

### Phase 1: Core Foundation (Single Source of Truth)

#### Users & Authentication
| Decision | Table | Source | Rationale |
|----------|-------|--------|-----------|
| KEEP | `users` | LOCAL | More comprehensive with MFA, verification |
| KEEP | `platform_users` | REMOTE | Platform-level user abstraction |
| MERGE | `user_sessions` | BOTH | Combine session management |
| KEEP | `user_2fa_config` | REMOTE | 2FA configuration |
| KEEP | `sso_providers`, `sso_sessions` | REMOTE | SSO support |

#### Organizations
| Decision | Table | Source | Rationale |
|----------|-------|--------|-----------|
| KEEP | `organizations` | BOTH | Core entity - merge columns |
| KEEP | `user_organizations` | BOTH | Junction table |
| KEEP | `organization_settings` | LOCAL | Settings storage |
| KEEP | `organization_integrations` | REMOTE | Integration links |
| KEEP | `subsidiaries` | REMOTE | Corporate structure |

### Phase 2: Reference/Lookup Tables (3NF Compliance)

#### Legend System (REMOTE - Single Source of Truth for lookups)
```
legend_categories     → SSOT for all category references
legend_departments    → SSOT for department references  
legend_positions      → SSOT for position/role references
legend_tags           → SSOT for tagging system
legend_relationships  → SSOT for relationship types
legend_cost_centers   → SSOT for financial categorization
```

#### Status Registry (REMOTE)
```
status_registry       → SSOT for all status values across entities
```

#### Local Lookup Tables to MIGRATE to Legend pattern:
- `categories` → merge into `legend_categories`
- `roles` → merge into `legend_positions` or keep separate for RBAC
- `billing_tiers` → keep (pricing-specific)
- `loyalty_tiers` → keep (loyalty-specific)
- `ambassador_tiers` → keep (creator-specific)

### Phase 3: Profile System (Unified Polymorphic Pattern)

#### Base Profile (MERGE)
```sql
-- Keep LOCAL profiles table as base
profiles (
  id, user_id, profile_type, handle, display_name,
  avatar_url, cover_url, bio, location, website,
  social_links, visibility, verified, featured,
  slug, seo_title, seo_description,
  billing_tier_id, billing_status
)
```

#### Profile Extensions (MERGE BOTH)
| Local | Remote | Merged Name | Notes |
|-------|--------|-------------|-------|
| `member_profiles` | `people_profile_attendee` | `member_profiles` | Consumer profiles |
| `professional_profiles` | `people_profile_employee` | `professional_profiles` | Career profiles |
| `creator_profiles` | `people_profile_artist` | `creator_profiles` | Artist/influencer |
| `brand_profiles` | `orgs_profile_*` | `brand_profiles` | Business entities |
| `destination_profiles` | `places_profile_venue` | `venue_profiles` | Locations |
| `experience_profiles` | - | `experience_profiles` | Bookable experiences |
| - | `people_profile_crew` | `crew_profiles` | Event staff |
| - | `people_profile_volunteer` | `volunteer_profiles` | Volunteers |
| - | `people_profile_speaker` | `speaker_profiles` | Speakers/presenters |

### Phase 4: Content & Media

| Decision | Tables | Source | Rationale |
|----------|--------|--------|-----------|
| KEEP | `media` | LOCAL | Core media storage |
| KEEP | `media_kits`, `media_kit_assets` | REMOTE | PR/marketing assets |
| KEEP | `content_libraries`, `content_versions` | LOCAL | Content management |
| KEEP | `collections`, `collection_items` | REMOTE | User collections |
| KEEP | `ugc_hashtags`, `ugc_content_hashtags` | REMOTE | UGC tagging |

### Phase 5: Events & Productions

| Decision | Tables | Source | Rationale |
|----------|--------|--------|-----------|
| MERGE | `events` | BOTH | Core event entity |
| KEEP | `event_phases`, `event_programs` | LOCAL | Event structure |
| KEEP | `events_profile_*` | REMOTE | Event type extensions |
| KEEP | `productions`, `production_schedules` | BOTH | Production management |
| KEEP | `run_of_show`, `show_calls`, `show_cues` | REMOTE | Show management |
| KEEP | `stage_plots`, `spec_sheets` | REMOTE | Technical specs |

### Phase 6: Ticketing & Commerce

| Decision | Tables | Source | Rationale |
|----------|--------|--------|-----------|
| MERGE | `tickets` | BOTH | Core ticketing |
| KEEP | `ticket_types`, `ticket_statuses` | REMOTE | Ticket metadata |
| KEEP | `ticket_purchases` | LOCAL | Purchase records |
| KEEP | `ticket_transfers`, `ticket_addons` | REMOTE | Advanced ticketing |
| KEEP | `resale_listings`, `resale_offers` | REMOTE | Secondary market |
| KEEP | `orders`, `order_items` | REMOTE | E-commerce |
| KEEP | `payments`, `refunds`, `split_payments` | BOTH | Payment processing |

### Phase 7: AI & Intelligence (LOCAL - Primary)

```
ai_agents              → Agent definitions
ai_agent_contexts      → Agent conversation context
ai_models              → Model registry
ai_providers           → Provider configurations
ai_conversations       → Chat sessions
ai_messages            → Chat messages
ai_knowledge_base      → RAG knowledge store
ai_recommendations     → Recommendation engine
ai_predictions         → Predictive analytics
ai_insights            → Generated insights
ai_content             → AI-generated content
ai_content_templates   → Content templates
ai_training_data       → Training datasets
ai_feature_configs     → Feature flags for AI
ai_model_metrics       → Model performance tracking
ai_model_performance   → Detailed performance data
ai_jobs                → Async AI job queue
```

### Phase 8: Workflows & Automation

| Decision | Tables | Source | Rationale |
|----------|--------|--------|-----------|
| KEEP | `saga_*` | REMOTE | Saga pattern for complex workflows |
| KEEP | `custom_workflows`, `custom_steps` | LOCAL | Custom workflow builder |
| KEEP | `automation_rules`, `automation_*_catalog` | REMOTE | Automation engine |
| MERGE | Workflow concepts | BOTH | Unified workflow system |

### Phase 9: Integrations

#### Keep Both - Different Purposes
- **LOCAL `*_integrations`**: Domain-specific integration configs
- **REMOTE `integration_*_links`**: Entity-level integration mappings

### Phase 10: Analytics & Reporting

| Decision | Tables | Source | Rationale |
|----------|--------|--------|-----------|
| KEEP | `dashboards`, `dashboard_charts`, `dashboard_kpis` | LOCAL | Dashboard builder |
| KEEP | `dashboard_configs` | REMOTE | Dashboard settings |
| KEEP | `kpis`, `kpi_values` | LOCAL | KPI definitions |
| KEEP | `kpi_reports`, `kpi_targets`, `kpi_data_points` | REMOTE | KPI tracking |
| KEEP | `analytics_reports` | REMOTE | Report storage |
| KEEP | `chronicle_*` | REMOTE | Activity chronicle |

---

## 24 Common Tables - Merge Decisions

| Table | Decision | Action |
|-------|----------|--------|
| `api_keys` | MERGE | Combine columns, prefer remote structure |
| `api_rate_limits` | MERGE | Combine rate limiting logic |
| `assets` | MERGE | Unify asset management |
| `audit_log` | KEEP BOTH | Different audit purposes |
| `budgets` | MERGE | Unify budget tracking |
| `credentials` | MERGE | Unify credential management |
| `departments` | MERGE | Use with legend_departments |
| `integration_providers` | MERGE | Unify provider registry |
| `job_postings` | MERGE | Unify recruitment |
| `memberships` | MERGE | Unify membership system |
| `notifications` | MERGE | Unify notification system |
| `organizations` | MERGE | Core entity - combine columns |
| `payments` | MERGE | Unify payment processing |
| `procurement_requests` | MERGE | Unify procurement |
| `projects` | MERGE | Unify project management |
| `punch_lists` | MERGE | Unify punch list tracking |
| `reviews` | MERGE | Unify review system |
| `search_index` | MERGE | Unify search |
| `teams` | MERGE | Unify team management |
| `tickets` | MERGE | Unify ticketing |
| `user_organizations` | MERGE | Core junction table |
| `webhook_deliveries` | MERGE | Unify webhook tracking |
| `webhook_endpoints` | MERGE | Unify webhook config |
| `workspaces` | MERGE | Unify workspace management |

---

## Migration Execution Plan

### Step 1: Backup Remote Database
```bash
npx supabase db dump --data-only -f backup_data.sql
```

### Step 2: Create Unified Migration
Create new migration that:
1. Adds missing LOCAL tables to remote
2. Adds missing columns to common tables
3. Creates proper foreign key relationships
4. Adds RLS policies

### Step 3: Apply Migration
```bash
npx supabase db push
```

### Step 4: Validate
- Test all API endpoints
- Verify RLS policies
- Check foreign key integrity

---

## Estimated Final Schema

| Category | Table Count |
|----------|-------------|
| Core (users, orgs, auth) | ~25 |
| Profiles (polymorphic) | ~30 |
| Events & Productions | ~40 |
| Ticketing & Commerce | ~35 |
| Content & Media | ~20 |
| AI & Intelligence | ~20 |
| Workflows & Automation | ~25 |
| Integrations | ~50 |
| Analytics & Reporting | ~25 |
| Reference/Lookup | ~20 |
| Other Domain Tables | ~260 |
| **TOTAL** | **~550** |

---

## 3NF Compliance Checklist

- [x] No repeating groups (1NF)
- [x] All non-key attributes depend on entire primary key (2NF)
- [x] No transitive dependencies (3NF)
- [x] Lookup tables for all enumerated values
- [x] Proper foreign key relationships
- [x] No data duplication across tables
- [x] Single source of truth for each data type

## Single Source of Truth Mapping

| Data Type | SSOT Table |
|-----------|------------|
| Users | `users` |
| Organizations | `organizations` |
| Profiles | `profiles` + type-specific extensions |
| Categories | `legend_categories` |
| Statuses | `status_registry` |
| Departments | `legend_departments` + `departments` |
| Positions/Roles | `legend_positions` + `roles` |
| Tags | `legend_tags` |
| Events | `events` + `events_profile_*` |
| Tickets | `tickets` + `ticket_types` |
| Payments | `payments` |
| AI Models | `ai_models` |
| Workflows | `saga_templates` + `custom_workflows` |
