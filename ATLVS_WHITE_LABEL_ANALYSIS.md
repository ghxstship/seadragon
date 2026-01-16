# ATLVS White-Label Functionality Analysis

## Overview
This report documents the current white-label functionality in preparation for the ATLVS UI rebuild, ensuring tenant isolation, theming, and customization capabilities are preserved.

## Current White-Label Architecture

### Database Schema for White-Label Support

#### Organizations Table
```sql
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Branding Settings Table
```sql
CREATE TABLE branding_settings (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo JSONB,           -- Logo configuration (URL, alt text, variants)
  colors JSONB,         -- Custom color palette overrides
  typography JSONB,     -- Font family, size, weight customizations
  border_radius TEXT DEFAULT '8px',
  mode TEXT DEFAULT 'system',  -- light/dark/system preference
  CONSTRAINT fk_branding_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

#### Integration Settings Table
```sql
CREATE TABLE integration_settings (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL UNIQUE,
  stripe JSONB,
  quickbooks JSONB,
  xero JSONB,
  slack JSONB,
  teams JSONB,
  discord JSONB,
  google JSONB,
  outlook JSONB,
  eventbrite JSONB,
  ticketmaster JSONB,
  zapier JSONB,
  CONSTRAINT fk_integration_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

#### Permission Settings Table
```sql
CREATE TABLE permission_settings (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL UNIQUE,
  -- JSONB field for custom permission configurations
  CONSTRAINT fk_permission_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

### Theme System Architecture

#### Design Tokens Structure
Located in `/src/lib/design-system/tokens.ts`:
```typescript
export const themes = {
  light: {
    colors: {
      // Base color palette
      primary: { 50: '#f0f9ff', 500: '#3b82f6', 900: '#1e3a8a' },
      secondary: { 50: '#f8fafc', 500: '#64748b', 900: '#0f172a' },
      // ... more color tokens
    },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: { sm: '0.875rem', base: '1rem', lg: '1.125rem' },
      // ... more typography tokens
    },
    spacing: { 1: '0.25rem', 2: '0.5rem', 4: '1rem', /* ... */ },
    borderRadius: { sm: '0.125rem', md: '0.375rem', lg: '0.5rem' },
    shadows: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', /* ... */ }
  },
  // dark and lowLight variants
}
```

#### Theme Context Provider
Located in `/src/contexts/ThemeContext.tsx`:
- Manages theme state (light/dark/lowLight/auto)
- Provides theme switching functionality
- Integrates with organization branding settings
- Supports CSS custom property generation

#### Theme Switching Components
- `ThemeSwitcher` component for user theme selection
- `ThemeProvider` for React context management
- CSS custom property injection for dynamic theming

### Feature Toggle System

#### Organization-Level Feature Flags
```sql
-- Integration settings table stores feature toggles
-- Each integration can be enabled/disabled per organization
ALTER TABLE integration_settings ADD COLUMN features JSONB DEFAULT '{}';
```

#### Feature Toggle Implementation
```typescript
// Example feature toggle usage
const isStripeEnabled = organization.integrations?.stripe?.enabled;
const isQuickBooksEnabled = organization.integrations?.quickbooks?.enabled;
```

### Tenant Isolation Mechanisms

#### Row-Level Security (RLS)
**Tenant Isolation Policy Pattern**:
```sql
CREATE POLICY "tenant_isolation" ON [table] FOR ALL
USING (organization_id = (current_setting('app.current_organization_id')::text));
```

**Applied to all organization-scoped tables**:
- Tasks, Projects, Events
- Assets, Documents, Content
- Reports, Analytics, Dashboards
- Financial records (invoices, wallets)
- Procurement, Compliance records

#### API-Level Tenant Context
**Middleware for organization context**:
```typescript
// /src/lib/middleware.ts
export function withOrgContext(handler: Function, options: { requireAuth: boolean }) {
  return async (request: NextRequest) => {
    const organizationId = extractOrgFromRequest(request);
    // Set organization context for RLS policies
    setCurrentOrgContext(organizationId);
    return handler(request);
  };
}
```

#### User-Organization Relationships
```sql
CREATE TABLE user_organizations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT fk_user_org_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_user_org_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_user_org_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT unique_user_org UNIQUE (user_id, organization_id)
);
```

### Branding Implementation

#### Logo Management
- **Database Storage**: JSONB field stores logo variants (square, wide, favicon)
- **File Storage**: Supabase Storage buckets per organization
- **Fallback Handling**: Default logos when organization logo not set

#### Color Customization
- **Override Mechanism**: Organization colors override default theme tokens
- **CSS Variable Injection**: Dynamic CSS custom properties
- **Validation**: Color contrast and accessibility checks

#### Typography Customization
- **Font Loading**: Google Fonts integration for custom fonts
- **Fallback Fonts**: System font stacks for reliability
- **Size/Weight Overrides**: Per-organization typography settings

### White-Label Validation Checklist

#### Theme & Branding
- [ ] Organization-specific color palette loads correctly
- [ ] Custom logos display in header and loading states
- [ ] Typography settings apply to all text elements
- [ ] Theme mode (light/dark) respects organization defaults
- [ ] CSS custom properties update dynamically

#### Feature Visibility
- [ ] Integration toggles hide/show relevant UI components
- [ ] Feature flags disable functionality appropriately
- [ ] Navigation items respect organization permissions
- [ ] API endpoints return organization-specific data only

#### Tenant Isolation
- [ ] RLS policies prevent cross-organization data access
- [ ] API requests include organization context
- [ ] File storage isolates organization assets
- [ ] User sessions scoped to current organization

#### Content Customization
- [ ] Organization name displays in UI elements
- [ ] Custom terminology overrides apply
- [ ] Brand-safe content filtering active
- [ ] Localized content respects organization settings

### White-Label Preservation Requirements

#### UI Component Requirements
1. **No Hard-coded Labels**: All text must use i18n or configuration
2. **Dynamic Theming**: Components must use CSS custom properties
3. **Conditional Rendering**: Features must check organization settings
4. **Asset Loading**: Images/logos must load from organization storage

#### API Requirements
1. **Organization Context**: All requests must include org_id
2. **Filtered Responses**: Data must be scoped to organization
3. **Permission Checks**: Actions must validate user org membership
4. **Audit Logging**: Organization-scoped activity tracking

#### Database Requirements
1. **RLS Policies**: All tables must have tenant isolation
2. **Foreign Keys**: Relationships must maintain org boundaries
3. **Indexes**: Organization_id columns must be indexed
4. **Constraints**: Prevent cross-organization references

### Current Implementation Gaps

#### Theme System
- **Dynamic Logo Loading**: Needs improvement for different screen sizes
- **Color Validation**: Limited contrast checking
- **Theme Persistence**: Organization theme preferences need better storage

#### Feature Toggles
- **Granular Controls**: Current toggles are all-or-nothing
- **Role-Based Features**: Features need role-specific visibility
- **Dependency Management**: Feature interactions not well-defined

#### Content Management
- **Terminology Overrides**: Limited support for custom labels
- **Content Templates**: Organization-specific templates missing
- **Asset Organization**: Better file organization needed

### Recommendations for UI Rebuild

#### Theme Integration
1. **Centralized Theme Provider**: Single source for all theme values
2. **Organization Theme Loading**: Load org branding on app initialization
3. **CSS Variable Management**: Centralized custom property updates
4. **Theme Validation**: Client-side validation for custom themes

#### Component Architecture
1. **Branding-Aware Components**: All components must accept branding props
2. **Conditional Feature Rendering**: Use feature flags for component visibility
3. **Organization Context**: Components must access current org settings
4. **Responsive Branding**: Logos and assets must work across devices

#### Navigation & Layout
1. **Dynamic Navigation**: Sidebar must respect organization feature flags
2. **Branded Header**: Header must display organization logo and colors
3. **Mobile Adaptation**: White-label elements must work on mobile
4. **Accessibility**: Custom themes must maintain accessibility standards

#### Data Management
1. **Organization-Scoped Queries**: All data fetching must include org context
2. **Branding API Integration**: UI must load and apply branding settings
3. **Feature Flag Checks**: Components must check feature availability
4. **Error Handling**: Graceful handling of missing organization settings

### Migration Strategy
1. **Preserve Existing Branding**: Migrate current org settings to new structure
2. **Update Component Props**: Add branding props to all customizable components
3. **Implement Feature Gates**: Add feature flag checks throughout UI
4. **Test Organization Isolation**: Validate tenant boundaries in new UI
5. **Performance Optimization**: Lazy load organization-specific assets

### Success Criteria
- [ ] All UI elements respect organization branding
- [ ] Feature toggles correctly show/hide functionality
- [ ] Data isolation prevents cross-organization access
- [ ] Theme switching works seamlessly
- [ ] Mobile experience maintains white-label integrity
- [ ] Performance not impacted by branding complexity
