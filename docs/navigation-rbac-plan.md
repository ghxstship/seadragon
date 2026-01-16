# Navigation + RBAC/RLS Plan

## Objectives
- Align navigation (top bar, sidebar, mobile) to the requested IA while enforcing RBAC and Supabase RLS.
- Map all existing pages to the new IA as either primary pages or tabs.
- Highlight gaps, conflicts, and architectural recommendations without altering the requested nav structure.

## Current Navigation Components (reference)
- Header (top shell): `src/lib/design-system/patterns/header.tsx` — includes logo, basic nav, user menu placeholders, session usage.
- Sidebar (left shell): `src/lib/design-system/patterns/sidebar.tsx` — role-gated sections using `session.user.role` for `admin | super_admin | platform_dev` and open items for others.
- Layout wrapper: `src/lib/design-system/templates/dashboard-layout.tsx` — composes `Header` + `Sidebar` + page content.
- Breadcrumb primitive: `src/components/ui/breadcrumb.tsx` — ready to wire to dynamic route-aware breadcrumbs.

## Roles (proposed alignment)
- **guest** (unauthenticated): only public marketing/support pages.
- **member** (default authenticated): all Core + Team + Network + Account personal items.
- **manager** (team/department lead): Core + Team + Network + Account + selective Management (e.g., Forecast, Pipeline, Procurement, Reports, Insights as read/edit per policy).
- **admin**: everything in member/manager plus full Management; can manage org-level settings, billing.
- **super_admin**: admin plus platform-level controls and system-wide observability.
- **platform_dev**: internal platform engineering; full access including Platform/Console/Governance (existing in sidebar).

> Map existing `session.user.role` values to this ladder; if mismatched, add a translation layer at auth/session load.

## RLS Principles (Supabase)
- Every multi-tenant table enforces `organization_id = auth.jwt().organization_id` (or `tenant_id`) and checks role capabilities.
- Policy tiers:
  - **read**: members of org.
  - **write**: managers+ for operational data; admins+ for financial/compliance.
  - **manage**: admins/super_admin/platform_dev for governance or schema-like configs.
- Ensure policies exist for tables backing: tasks, workflows, assets, documents, projects, people, products, places, procurement, pipelines, jobs, content, compliance, reports/insights, network objects (showcase, discussions, challenges, marketplace, opportunities, connections), billing, org settings.
- Use row-level checks plus function-guarded mutations (RPC) where aggregation or cross-entity writes occur.

## Requested Navigation Structure with RBAC

### ATLVS IA (content emphasis)
- **Top Bar (Global Utilities):** Breadcrumbs; AI Command Bar (search, shortcuts, system commands); Notifications (tasks, workflows, approvals, messages); Inbox; Quick Settings (theme, language, preferences); Support; Language/Theme; User profile/switch.
- **Core:** Dashboard (KPIs, active projects/workflows, tasks, alerts, quick links); Calendar (events, deadlines, milestones, project/task filters); Tasks (assignee, status, priority, due, linked procedures); Workflows (templates, active/paused/completed, linked tasks/projects); Assets (type, location, status, lifecycle, assignments); Documents (contracts, SOPs, reports, templates, versioning, sharing, linked entities).
- **Team:** Projects (timeline, budget, linked assets/tasks/docs/workflows); Programming (event programming: schedules, run-of-show, lineups, talent, venues); People (directory, roles, contributions); Products (deliverables/inventory lifecycle); Places (venues, warehouses, logistics, scheduling); Procedures (SOPs, templates, checklists, runbooks linked to Tasks/Workflows/Projects/Programming).
- **Management:** Forecast (budget/expense/revenue projections); Pipeline (jobs/opportunities stages); Jobs (work orders: owner, deadlines, linked tasks/workflows/assets); Procurement (requests, orders, vendors, approvals, history, linked Jobs/Projects); Content (campaigns/creative, approvals, linked projects/assets); Compliance (policies, risk/safety, incidents, permits, insurance, audit); Reports (operational/financial/compliance, schedules, archives); Insights (analytics, trends from Tasks/Projects/Workflows/Assets).
- **Network:** Hub with tabs (Showcase, Discussions, Challenges, Marketplace, Opportunities, Connections) — hidden in sidebar; data: posts, assets, opportunities, connections.
- **Account:** Profile; Organization; Billing; History; Resources; System/Platform; Support.
- **Mobile:** Bottom nav (Dashboard, Calendar, Tasks, Workflows, Inbox); More drawer (Assets, Documents, Network hub, Account, Reports & Insights per role); Procedures are contextual via Tasks/Workflows/Projects/Programming.

### Top Bar
- **Breadcrumbs** — dynamic from pathname; visible to all authenticated; hide on public marketing pages.
- **AI Command Bar** — all authenticated; actions filtered by role (e.g., management actions require manager+).
- **Notifications** — authenticated; scoped to org; mark-as-read/write per member.
- **Inbox** — authenticated; aligns to `/dashboard/messages` (or equivalent).
- **Settings** — personal settings for member+; org settings for admin+.
- **Support** — all users; links to `/support` or modal.
- **Language** — all users; persists per user/org preference.
- **Theme** — all users; client-side toggle.
- **User** — profile menu; includes switch org/profile (existing `auth/switch-*`).

### Sidebar (Desktop)
- **Organization Switcher** — authenticated; shows orgs the user can access (RLS enforced by org membership).
- **Core (member+)**
  - Dashboard
  - Calendar
  - Tasks
  - Workflows
  - Assets
  - Documents
- **Team (member+)**
  - Projects
  - Programs
  - People
  - Products
  - Places
  - Procedures
- **Management (manager+/role-gated module)**
  - Forecast
  - Pipeline
  - Jobs
  - Procurement
  - Content
  - Compliance
  - Reports
  - Insights
- **Network (Hub Module) (member+)**
  - Showcase
  - Discussions
  - Challenges
  - Marketplace
  - Opportunities
  - Connections
- **Account (member+)**
  - Profile
  - Organization
  - Billing
  - History
  - Resources
  - Platform
  - Support

### Mobile Bottom Nav (authenticated)
- Dashboard | Calendar | Tasks | Workflows | Inbox | More (drawer exposing remaining items respecting RBAC).

## Existing Pages Mapped to New IA
(Primary = main page; Tab = sub-section within page. If multiple matches, prefer the more specific dashboard route.)

### Core
- Dashboard → `/dashboard/overview` (Primary) — consolidate generic `/dashboard` entry.
- Calendar → `/dashboard/calendar` (Primary) with tabs: `/my`, `/team`, `/project`, `/availability`, `/event`.
- Tasks → `/dashboard/tasks` (Primary) with tabs: `/my`, `/kanban`, `/list`.
- Workflows → `/dashboard/workflows` (Primary) — existing workflow pages under `src/app/workflows` should surface as tabs.
- Assets → currently `/dashboard/manage/assets` (Primary); add Core alias or redirect.
- Documents → `/dashboard/directory` family or dedicated documents page (gap: create `/dashboard/documents`).

### Team
- Projects → `/dashboard/legend/projects` (Primary).
- Programs → map to Events/Run of Show: use `/dashboard/events` (Primary) with tabs for schedules/lineups (e.g., `/dashboard/events/schedules`, `/dashboard/events/lineups`). Add `/dashboard/legend/programs` alias if needed for cross-links.
- People → `/dashboard/legend/people` (Primary); also `/dashboard/directory/people` as tab/view.
- Products → `/dashboard/legend/products` (Primary).
- Places → `/dashboard/legend/places` (Primary).
- Procedures → SOPs, templates, playbooks: create `/dashboard/legend/procedures` with tabs for SOP library, templates, checklists, and runbooks.

### Management (role-gated)
- Forecast → **gap** (no route yet); finance-focused (budget, expenses, revenue, projections). Create `/dashboard/manage/forecast`.
- Pipeline → **gap**; closest is `manage/opportunities`; propose `/dashboard/manage/pipeline`.
- Jobs → **gap**; represents work orders and related data (not employment). Create `/dashboard/manage/jobs` with tabs for work orders, assignments, timelines, and billing linkage.
- Procurement → `/dashboard/manage/procurement` (Primary).
- Content → **gap**; consider `/dashboard/manage/content`.
- Compliance → **gap**; create `/dashboard/manage/compliance` for event/project-level compliance (risk, safety, licensing, permitting, insurance, local/national/international regulation). Leverage `/dashboard/governance` for platform-wide scopes.
- Reports → `/dashboard/manage/reports` (Primary).
- Insights → `/dashboard/manage/insights` (Primary).

### Network (Hub)
- Showcase → **gap**; new `/dashboard/network/showcase`.
- Discussions → **gap**; possibly reuse `/dashboard/messages/channels` as tab until dedicated route.
- Challenges → **gap**; new `/dashboard/network/challenges`.
- Marketplace → **gap**; new `/dashboard/network/marketplace`.
- Opportunities → `/dashboard/manage/opportunities` exists; for Network view, add `/dashboard/network/opportunities` (read-focused) while keeping manage under Management.
- Connections → `/dashboard/directory/contacts` or `/dashboard/directory/organizations` as tabs; create `/dashboard/network/connections` for hub context.

### Account
- Profile → `/auth/switch-profile`, `/auth/onboarding/profile` flows; create unified `/dashboard/account/profile` view.
- Organization → `/auth/onboarding/organization` pages; add `/dashboard/account/organization` for settings (admin+ writes, member read).
- Billing → **gap**; add `/dashboard/account/billing` (admin+ writes, member read-only invoices).
- History → `/auth/sessions` and `/auth/sessions/revoke`; add `/dashboard/account/history` summarizing audit/activity.
- Resources → existing marketing/support (`/support`, `/about`, `/docs` if present) linked via account/resources tab.
- Platform → existing `/dashboard/governance`, `/dashboard/platform/console`, `/dashboard/platform/governance` (platform_dev/super_admin only) — surfaced under Account > Platform for those roles.
- Support → `/support` (Primary) and `/dashboard/governance/support` for platform users.

### Other existing dashboard areas
- AI Concierge → `/dashboard/ai-concierge` family — surface via Top Bar AI Command Bar and optional quick link in Core/More.
- Activity/Audit → `/dashboard/activity` variants — expose as tab under Account > History or Core > Dashboard (audit widget).
- Governance → `/dashboard/governance/*` — keep for platform_dev; surfaced under Account > Platform and Management > Compliance (read-only bridge).
- Analytics → `/dashboard/analytics` — fold into Management > Insights/Reports.
- Events → `/dashboard/events` — map under Management > Content or Core > Calendar (tab) depending ownership.
- Directory → `/dashboard/directory/*` — map to Team > People/Organizations and Network > Connections.

## Page Mapping Table (legacy → new page/tab)
| Legacy route/pattern | New IA placement | Notes |
| --- | --- | --- |
| `/dashboard` | Core → Dashboard (primary) | Consolidate to `/dashboard/overview`. |
| `/dashboard/overview` | Core → Dashboard | KPIs/alerts. |
| `/dashboard/calendar/*` | Core → Calendar tabs | `my`, `team`, `project`, `availability`, `event`. |
| `/dashboard/tasks/*` | Core → Tasks tabs | `my`, `kanban`, `list`; link Procedures. |
| `/dashboard/workflows/*` and `/workflows/*` | Core → Workflows (tabs) | Surface workflow detail as tabs. |
| `/dashboard/manage/assets` | Core → Assets (primary) | Alias/redirect from manage. |
| `/dashboard/directory/*` | Core → Documents (contracts/SOPs) and Team/Network | People/contacts to Team/Network; docs to Core. |
| `/dashboard/events` | Team → Programming | Tabs for schedules/lineups/run-of-show. |
| `/dashboard/legend/projects` | Team → Projects | Primary. |
| `/dashboard/legend/plans` | Team → Procedures | Map into SOPs/Templates. |
| `/dashboard/legend/people` | Team → People | Primary. |
| `/dashboard/legend/products` | Team → Products | Primary. |
| `/dashboard/legend/places` | Team → Places | Primary. |
| `/dashboard/legend/brand` | Team → Products/Content | Brand assets -> Products/Content. |
| `/dashboard/manage/procurement` | Management → Procurement | Primary. |
| `/dashboard/manage/opportunities` | Management → Pipeline (or Opportunities tab) | Keep manage scope; add Network read-only surfacing. |
| `/dashboard/manage/reports` | Management → Reports | Primary. |
| `/dashboard/manage/insights` | Management → Insights | Primary. |
| `/dashboard/manage/finance` | Management → Forecast/Reports | Align to financial forecasting. |
| `/dashboard/manage/events` | Team → Programming | Event ops. |
| `/dashboard/manage/assets` | Core → Assets | Alias/redirect. |
| `/dashboard/manage/` (other) | Management module | Re-route per item (pipeline, content, compliance, jobs). |
| `/dashboard/analytics` | Management → Insights/Reports | Roll into analytics. |
| `/dashboard/ai-concierge/*` | Top Bar → AI Command Bar | Actions/search; keep page for deep features. |
| `/dashboard/messages/*` | Top Bar → Inbox; Network → Discussions (tab) | Channels/threads can map to Discussions. |
| `/dashboard/activity/*` | Account → History | Audit/logs. |
| `/dashboard/governance/*` | Account → System/Platform; Management → Compliance bridge | Platform_dev/super_admin only. |
| `/dashboard/platform/*` | Account → System/Platform | platform_dev only. |
| `/support/*` | Top Bar Support & Account → Support | Helpdesk. |
| Marketing `/about`, `/news`, `/events`, `/partners`, etc. | Account → Resources (public) | Non-auth marketing. |
| Auth flows `/auth/*` | Account → Profile/Organization/Billing/History | Surface via Account pages; keep auth pages for entry. |

## Data Entity Map (3NF, SSoT)
- **Organization**(id, name, settings, locale, timezone) ←1–* **Team**(id, org_id, name, type) ←1–* **Membership**(id, team_id, user_id, role).
- **User**(id, profile fields, preferences) linked via Membership; roles resolved per org.
- **Project**(id, org_id, team_id, name, budget_id, place_id, status, timeline) — links: *Workflows*, *Tasks*, *Assets*, *Documents*, *Programming*, *Procurement*, *Jobs*, *Content*.
- **Programming** (Event Programming): **Program**(id, project_id, name, venue_id, start/end), **ProgramSlot**(id, program_id, stage, start/end, lineup_ref), **Lineup**(id, slot_id, talent_id, notes).
- **WorkflowTemplate**(id, org_id, name, steps) → **WorkflowInstance**(id, project_id?, program_id?, status) → links to **Task**.
- **Task**(id, workflow_instance_id?, project_id?, program_id?, assignee_id, status, priority, due, procedure_id?) with **TaskLink** for cross-refs to Assets/Documents.
- **Procedure**(id, org_id, type, version_id, linked_entity_type/id) with **ProcedureVersion** to maintain history; link to Tasks/Workflows/Projects/Programming.
- **Asset**(id, org_id, type, status, location_id, custodian_id, lifecycle_state) with **AssetEvent**(check-in/out, maintenance).
- **Document**(id, org_id, type, owner_id, status, project_id?, asset_id?, workflow_id?) with **DocumentVersion**.
- **Job**(id, org_id, project_id?, program_id?, owner_id, status, due, linked_assets, linked_tasks) — work orders.
- **Procurement**: **Request**(id, org_id, requester_id, job_id?, project_id?, status), **Order**(id, request_id, vendor_id, amount, status), **Vendor**(id, org_id,…).
- **PipelineOpportunity**(id, org_id, stage, value, owner_id, project_id?) linking to Jobs/Procurement.
- **Forecast**(id, org_id, period, budget, expenses, revenue, projections) with **ForecastLine** per category.
- **ContentItem**(id, org_id, type, status, project_id?, asset_id?, approval_state).
- **ComplianceItem**(id, org_id, type, risk_level, status, project_id?, program_id?, job_id?, permits/insurance refs) with **Incident/Audit** tables.
- **Report**(id, org_id, type, schedule, generated_at, blob_ref) with **ReportRun** history.
- **Insight** sourced from materialized views over Tasks/Projects/Workflows/Assets.
- **Network**: **Post**, **DiscussionThread/Message**, **Challenge**, **MarketplaceListing**, **Opportunity** (public-facing), **Connection** (org/user/org-to-org) — all org-scoped; RLS per membership and visibility.
- **Notification**(id, org_id, user_id, type, entity_ref, read_at); **Message** for Inbox.
- **Billing**: **Subscription**, **Invoice**, **PaymentMethod** keyed by org.
- **Place**(id, org_id, type, location data) used by Programming/Assets/Projects.

## Access Control Matrix (RBAC + RLS + mobile visibility)
| Module | guest | member | manager | admin | super_admin | platform_dev | Mobile primary | Mobile more |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Top Bar utilities | View limited |  |  |  |  |  | Breadcrumbs/Inbox | Settings/Support |
| Core: Dashboard/Calendar/Tasks/Workflows |  |  |  |  |  |  | Dashboard/Calendar/Tasks/Workflows | — |
| Core: Assets/Documents |  |  |  |  |  |  | — |  |
| Team (Projects, Programming, People, Products, Places, Procedures) |  |  |  |  |  |  | — |  |
| Management (Forecast, Pipeline, Jobs, Procurement, Content, Compliance, Reports, Insights) |  | Read if invited |  (scoped) |  |  |  | Reports/Insights (manager+) | Others |
| Network Hub tabs |  |  |  |  |  |  | — |  |
| Account (Profile, Org, Billing, History, Resources, System/Platform, Support) |  | Profile/Resources | Profile/Resources; History read |  (Org/Billing) |  |  | Profile | Org/Billing/Platform |
| Governance/Platform |  |  |  |  (limited) |  |  | — | Platform |

RLS: all multi-tenant tables scoped by `organization_id`; membership required. Role claims gate write/manage. Network visibility filtered by org membership and explicit visibility flags.

## Gaps & Conflicts
- Multiple management items currently live under `/dashboard/manage/*` while new IA splits Core/Team/Management/Network. No redirects/backward-compatibility allowed—hard cutover required; update links to new routes.
- Procedures, Forecast, Pipeline, Jobs, Content, Compliance, Network module routes do not exist; must be created. Programs now mapped to Events stack; update all legacy "programs" links without redirects.
- Assets/Documents currently only under Management; Core requires new entry/alias.
- Overlap between Opportunities (Management) and Network (member-facing). Use dual-surface: read-only in Network, full CRUD in Management.
- Platform/Governance currently separate; ensure role checks prevent exposure in standard nav.

## Optimization & Enrichment Recommendations
- Centralize nav config (one source for Top/Sidebar/Mobile) with role + feature flags, breadcrumbs labels, mobile visibility; generate breadcrumbs/More drawer from config.
- AI Command Bar: enable entity-aware commands (create task/workflow, attach SOP, schedule program slot) with role-aware action set.
- Automation: link Procedures to Task creation templates; auto-suggest SOPs based on task type/workflow stage.
- Predictive insights: feed Forecast/Insights from Tasks/Projects/Workflows/Assets utilization; surface risk alerts in Dashboard.
- Data quality: enforce foreign keys for all linkages (Projects ↔ Tasks/Workflows/Assets/Docs/Programming; Jobs ↔ Procurement/Assets/Tasks; Content ↔ Projects/Assets).
- Versioning: Documents/Procedures/Workflows should maintain versions; Reports maintain run history.
- Mobile: ensure high-frequency flows (tasks, calendar, inbox) optimized; More drawer generated from nav config with RBAC.
- No redirects/backward compatibility: perform hard cutover, update all references/links to new IA, and remove legacy paths.

## Architectural Recommendations
- Centralize nav config (Top, Sidebar, Mobile) as a single TypeScript source of truth with:
  - label, icon, href, feature flag, required roles, required org features, mobile visibility, breadcrumbs meta.
  - references to page component or slug for lazy loading and analytics tagging.
- Breadcrumbs: derive from nav config + dynamic route segments; avoid hardcoded strings in pages.
- RBAC guard: shared utility (client + server) that checks session role and org features before rendering nav items and pages.
- RLS alignment: ensure Supabase policies mirror nav RBAC; avoid client-only gating.
- Mobile “More” drawer auto-generates from the same config, respecting role gates.
- Route aliases/redirects are not permitted for the refactor; update all entry points to new route groups and remove legacy paths.
- **Route groups:** Introduce Next.js route groups for each module to enforce folder-level separation, middleware, and layout shells:
  - `(member)` for member-scoped shared shell.
  - `(core)` for Dashboard/Calendar/Tasks/Workflows/Assets/Documents.
  - `(team)` for Projects/Programming/People/Products/Places/Procedures.
  - `(management)` for Forecast/Pipeline/Jobs/Procurement/Content/Compliance/Reports/Insights.
  - `(network)` for Network hub and its tabs.
  - `(account)` for Profile/Organization/Billing/History/Resources/System-Platform/Support.
  Each group can mount its own layout (breadcrumbs seed, section nav, guards), share data loaders, and apply per-group middleware (role checks, feature flags).
- **Naming conventions (frontend/backend/db):** Use normalized, IA-aligned names across code and schema (e.g., `core_dashboard`, `team_programming`, `management_forecast`, `network_discussions`, `account_billing`). Component/file/route names must match IA labels; database tables and columns must mirror entity names in the Data Entity Map. No legacy or aliased naming allowed.

## Member Coverage & Orphan Check
- Member route group `(member)`: includes Top Bar utilities, Core (Dashboard, Calendar, Tasks, Workflows, Assets, Documents), Team, Network, and Account pages available to authenticated members.
- All legacy dashboard patterns listed in the Page Mapping Table are mapped to a new page/tab. No redirects; all links must be updated to new routes.
- Auth/marketing remain outside app shell; Account pages surface profile/org/billing/history/resources/system-platform/support for members.

## New Pages/Tabs to Create for Full IA Coverage (no redirects)
- Core: `/dashboard/documents` (documents repo), Workflow detail tabs surfacing existing `src/app/workflows/*`.
- Team: `/dashboard/legend/procedures` (SOPs/templates/checklists/runbooks); Programming tabs for schedules/lineups/run-of-show under `/dashboard/events`.
- Management: `/dashboard/manage/forecast`, `/dashboard/manage/pipeline`, `/dashboard/manage/jobs`, `/dashboard/manage/content`, `/dashboard/manage/compliance`, ensure `/dashboard/manage/reports`, `/dashboard/manage/insights` exist; align `/dashboard/manage/finance` into Forecast.
- Network: `/dashboard/network/showcase`, `/dashboard/network/discussions`, `/dashboard/network/challenges`, `/dashboard/network/marketplace`, `/dashboard/network/opportunities` (read-focused), `/dashboard/network/connections`.
- Account: `/dashboard/account/profile`, `/dashboard/account/organization`, `/dashboard/account/billing`, `/dashboard/account/history`, `/dashboard/account/resources`, `/dashboard/account/system` (platform), `/dashboard/account/support`.
- Mobile: More drawer generated from nav config; ensure mobile layouts for Assets/Documents/Network/Account/Reports+Insights.

## Implementation Steps (zero-tolerance, step-by-step)
1) **Create unified nav config**
   - Build a single TypeScript config for Top, Sidebar, Mobile, Member/Team/Management/Network/Account groups.
   - Include: label, href, icon, required roles, feature flags, mobile visibility, breadcrumbs labels, module grouping, and tab metadata.
   - Completion: All nav items rendered from config; no hardcoded lists remain.

2) **Wire shells to config**
   - Header: use config for Top Bar items, AI Command Bar actions, notifications/inbox entry, user menu.
   - Sidebar: render Core/Team/Management/Network/Account from config with role gating.
   - Mobile: bottom nav + More drawer generated from the same config.
   - Completion: All shells read from config; role gating enforced; no hardcoded paths.

3) **Introduce route groups**
   - Create `(member)`, `(core)`, `(team)`, `(management)`, `(network)`, `(account)` groups with dedicated layouts (breadcrumbs seed, section nav, guards).
   - Completion: All pages live under the correct route group; legacy locations removed.

4) **Add missing pages/tabs (hard cutover, no redirects)**
   - Core: `/dashboard/documents`, workflow detail tabs.
   - Team: `/dashboard/legend/procedures`; programming tabs under `/dashboard/events` (schedules/lineups/run-of-show).
   - Management: `/dashboard/manage/forecast`, `/dashboard/manage/pipeline`, `/dashboard/manage/jobs`, `/dashboard/manage/content`, `/dashboard/manage/compliance`; ensure `/dashboard/manage/reports`, `/dashboard/manage/insights` live under management; fold `/dashboard/manage/finance` into Forecast.
   - Network: `/dashboard/network/showcase`, `/dashboard/network/discussions`, `/dashboard/network/challenges`, `/dashboard/network/marketplace`, `/dashboard/network/opportunities`, `/dashboard/network/connections`.
   - Account: `/dashboard/account/profile`, `/dashboard/account/organization`, `/dashboard/account/billing`, `/dashboard/account/history`, `/dashboard/account/resources`, `/dashboard/account/system`, `/dashboard/account/support`.
   - Completion: All listed routes exist; no legacy/redirect stubs; links updated to new paths only.

5) **Page mapping enforcement**
   - Update every legacy link to the new mapping table destinations.
   - Delete/retire legacy page files that conflict with new IA (no redirects allowed).
   - Completion: Repository contains only new IA routes; sitemap matches mapping table.

5a) **Naming normalization (frontend/backend/db)**
    - Rename components/routes/files to IA-aligned names; enforce same names in API handlers/services and DB tables/columns per Data Entity Map.
    - Update migrations to rename tables/columns to normalized IA names; remove aliases.
    - Completion: No legacy names remain in code or schema; lint/search for old names returns zero results.

6) **Breadcrumb provider**
   - Implement provider deriving crumbs from nav config + route params.
   - Completion: All pages show correct crumbs without page-local hardcoding.

7) **Org switcher**
   - Implement org selector using RLS-backed membership; place in Top Bar/Sidebar as designed.
   - Completion: Switching org updates context and RLS-scoped data everywhere.

8) **RBAC guard + RLS alignment**
   - Create shared guard util used in layouts/pages; enforce required roles/features per nav config.
   - Ensure Supabase RLS policies exist for every entity listed in Data Entity Map; seed data/tests cover access matrices per role.
   - Completion: RBAC guard present on all protected pages; RLS tests pass for member/manager/admin/super_admin/platform_dev.

9) **Data integrity (3NF, SSoT)**
   - Ensure schema/tables follow Data Entity Map with FKs between Projects/Tasks/Workflows/Assets/Documents/Programming/Jobs/Procurement/etc.
   - Completion: Migrations applied; referential integrity enforced; no duplicate/overlapping tables.

10) **Network hub tabs**
    - Implement tabs inside Network page (not separate sidebar items) per config.
    - Completion: All six tabs live under `/dashboard/network/*` and are reachable via config-driven tabs.

11) **Mobile parity**
    - Verify bottom nav (Dashboard/Calendar/Tasks/Workflows/Inbox) and More drawer expose allowed items per role.
    - Completion: Mobile flows load all required pages; More drawer generated from config.

12) **Validation & QA (zero-tolerance)**
    - Run lint, type-check, tests; add integration smoke tests for each module route.
    - Manual check: every nav item opens correct page; breadcrumbs correct; role gating enforced; no 404s; no redirects.
    - Completion: All checks green; manual checklist signed off; no legacy paths remain.

13) **Docs/update**
    - Update developer docs to reference new IA, route groups, nav config, RBAC/RLS policies, and mapping table.
    - Completion: Docs updated; onboarding instructions point to new IA only.
