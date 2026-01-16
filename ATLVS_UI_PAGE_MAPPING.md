# ATLVS Authenticated UI Page Mapping Table

## Overview
This document maps existing authenticated pages to the new Information Architecture (IA) structure.

## Mapping Table

### CORE Section
| Old Page | New Page | Mapping Type | Status | Notes |
|----------|----------|-------------|--------|-------|
| `/dashboard/overview` | `/dashboard` (Dashboard) | Primary | Exists | Already matches IA |
| `/dashboard/calendar` | `/dashboard/calendar` | Primary | Exists | Already matches IA |
| `/dashboard/tasks` | `/dashboard/tasks` | Primary | Exists | Already matches IA |
| `/dashboard/workflows` | `/dashboard/workflows` | Primary | Exists | Already matches IA |
| `/dashboard/manage/assets` | `/dashboard/assets` | Primary | Exists | Already matches IA |
| `/dashboard/documents` | `/dashboard/documents` | Primary | Exists | Already matches IA |

### TEAM Section
| Old Page | New Page | Mapping Type | Status | Notes |
|----------|----------|-------------|--------|-------|
| `/dashboard/legend/projects` | `/dashboard/projects` | Primary | Exists | Already matches IA |
| `/dashboard/manage/events` | `/dashboard/programming` | Primary | Exists | Rename: Programming = Event Programming |
| `/dashboard/legend/people` | `/dashboard/people` | Primary | Exists | Already matches IA |
| `/dashboard/legend/products` | `/dashboard/products` | Primary | Exists | Already matches IA |
| `/dashboard/legend/places` | `/dashboard/places` | Primary | Exists | Already matches IA |
| `/dashboard/legend/procedures` | `/dashboard/procedures` | Primary | Exists | Already matches IA |

### MANAGEMENT Section
| Old Page | New Page | Mapping Type | Status | Notes |
|----------|----------|-------------|--------|-------|
| `/dashboard/manage/forecast` | `/dashboard/forecast` | Primary | Exists | Already matches IA |
| `/dashboard/manage/pipeline` | `/dashboard/pipeline` | Primary | Exists | Already matches IA |
| `/dashboard/manage/jobs` | `/dashboard/jobs` | Primary | Exists | Already matches IA |
| `/dashboard/manage/procurement` | `/dashboard/procurement` | Primary | Exists | Already matches IA |
| `/dashboard/manage/content` | `/dashboard/content` | Primary | Exists | Already matches IA |
| `/dashboard/manage/compliance` | `/dashboard/compliance` | Primary | Exists | Already matches IA |
| `/dashboard/manage/reports` | `/dashboard/reports` | Primary | Exists | Already matches IA |
| `/dashboard/manage/insights` | `/dashboard/insights` | Primary | Exists | Already matches IA |

### NETWORK Section (Single Page with Tabs)
| Old Page | New Page | Mapping Type | Status | Notes |
|----------|----------|-------------|--------|-------|
| N/A | `/dashboard/network` (Showcase tab) | Primary | Missing | Needs creation |
| N/A | `/dashboard/network` (Discussions tab) | Primary | Missing | Needs creation |
| N/A | `/dashboard/network` (Challenges tab) | Primary | Missing | Needs creation |
| N/A | `/dashboard/network` (Marketplace tab) | Primary | Missing | Needs creation |
| `/dashboard/manage/opportunities` | `/dashboard/network` (Opportunities tab) | Primary | Needs Move | Move from manage/ to network/ |
| N/A | `/dashboard/network` (Connections tab) | Primary | Missing | Needs creation |

### ACCOUNT Section
| Old Page | New Page | Mapping Type | Status | Notes |
|----------|----------|-------------|--------|-------|
| `/dashboard/settings` | `/dashboard/account/profile` | Primary | Exists | Already matches IA |
| `/dashboard/governance/tenants` | `/dashboard/account/organization` | Primary | Exists | Already matches IA |
| `/dashboard/manage/finance` | `/dashboard/account/billing` | Primary | Exists | Already matches IA |
| `/dashboard/activity` | `/dashboard/account/history` | Primary | Exists | Already matches IA |
| `/dashboard/platform` | `/dashboard/account/resources` | Primary | Exists | Already matches IA |
| `/dashboard/governance/settings` | `/dashboard/account/system` | Primary | Exists | Already matches IA |
| `/dashboard/governance/support` | `/dashboard/account/support` | Primary | Exists | Already matches IA |

## Additional Pages Found (Need Mapping)
| Current Page | Proposed Mapping | Status | Notes |
|--------------|------------------|--------|-------|
| `/dashboard/ai-concierge` | Top Bar (AI Command Bar) | Exists | Already in topBarNav config |
| `/dashboard/messages` | Top Bar (Inbox) | Exists | Already in topBarNav config |
| `/dashboard/messages/notifications` | Top Bar (Notifications) | Exists | Already in topBarNav config |
| `/dashboard/analytics` | `/dashboard/reports` (secondary) | Exists | Consolidate with reports |
| `/dashboard/today` | `/dashboard` (secondary) | Exists | Consolidate with dashboard |
| `/dashboard/widgets` | `/dashboard` (secondary) | Exists | Consolidate with dashboard |
| `/dashboard/actions` | `/dashboard/tasks` (secondary) | Exists | Consolidate with tasks |
| `/dashboard/credentials` | `/dashboard/account/profile` (secondary) | Exists | Move to profile settings |
| `/dashboard/directory` | `/dashboard/people` (secondary) | Exists | Consolidate with people |

## Summary
- **Total Existing Pages:** ~25 authenticated pages
- **IA-Aligned Pages:** ~23 pages match IA structure
- **Missing Pages:** 5 network tabs need creation
- **Pages Needing Moves:** 1 (opportunities)
- **Pages for Consolidation:** 6 secondary mappings
- **Orphaned Pages:** 0

## Next Steps
1. Create missing network page with tabbed interface
2. Move opportunities from manage/ to network/
3. Consolidate secondary pages into primary IA pages
4. Update navigation configuration for any path changes
5. Rebuild UI components to match new IA layout patterns
