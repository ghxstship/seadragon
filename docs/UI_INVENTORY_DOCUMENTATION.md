# UI Inventory Documentation

This document provides a comprehensive inventory of all UI components, layouts, templates, and shells in the Opus Zero platform, organized from foundations through full page layouts.

## 1. Foundations

### Design Tokens

The platform uses a comprehensive design token system defined in `src/lib/design-tokens.ts` and applied via CSS custom properties in `src/app/globals.css`.

#### Color Palette
- **Primary Colors**: 50-950 shades (blue spectrum)
- **Neutral Colors**: 50-950 shades (gray spectrum)
- **Semantic Colors**: success (#10b981), warning (#f59e0b), error (#ef4444), info (#06b6d4)
- **White-label Support**: CSS custom properties for brand customization
  - `--color-accent-primary`
  - `--color-accent-secondary`
  - `--color-accent-tertiary`
  - `--color-semantic-success/warning/error/info`

#### Typography
- **Font Families**:
  - Display: Anton (Google Fonts)
  - Heading: Anton
  - Body: System fonts (Apple, Blink, etc.)
  - Mono: SF Mono, Monaco, Cascadia, Roboto Mono
- **Font Sizes**: xs to 9xl (12px to 128px)
- **Font Weights**: thin (100) to black (900)
- **Line Heights**: none to loose (1 to 2)
- **Letter Spacing**: tighter to widest (-0.05em to 0.1em)

#### Spacing
- 8px base grid system: 0 to 80 (0px to 320px)
- CSS variables: `--spacing-xs` to `--spacing-6xl`

#### Shadows
- none, sm, base, md, lg, xl, 2xl, inner, accent, accent-lg

#### Border Radius
- none, sm (2px), base (4px), md (6px), lg (8px), xl (12px), 2xl (16px), 3xl (24px), full (9999px), brand

#### Animations & Transitions
- Durations: 75ms to 1000ms
- Easings: linear, in, out, in-out
- Keyframes: spin, pulse, bounce

#### Breakpoints
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

#### Z-Index
- 0 to 50, auto

#### Opacity
- 0 to 100 (0% to 100%)

## 2. UI Primitives (Atoms)

Located in `src/components/ui/`, these are the base building blocks.

### Form Controls
- **Button**: Variants (default, destructive, outline, secondary, ghost, link), sizes (sm, default, lg, icon)
  - Nested: Icon support, loading states
- **Input**: Single-line text input
- **Textarea**: Multi-line text input
- **Checkbox**: Boolean selection
- **RadioGroup**: Single selection from options
- **Select**: Dropdown selection
  - Nested: SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel
- **Switch**: Toggle control
- **Label**: Form label component
- **Form**: Form context and validation
  - Nested: FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage

### Layout & Display
- **Card**: Content container
  - Nested: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Accordion**: Collapsible content sections
  - Nested: AccordionItem, AccordionTrigger, AccordionContent
- **Tabs**: Tabbed interface
  - Nested: TabsList, TabsTrigger, TabsContent
- **Separator**: Visual divider
- **ScrollArea**: Custom scrollbar area
- **Table**: Data table
  - Nested: TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter

### Navigation & Feedback
- **Breadcrumb**: Navigation path
  - Nested: BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage
- **DropdownMenu**: Contextual menu
  - Nested: DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuCheckboxItem, DropdownMenuRadioGroup
- **Popover**: Floating content
  - Nested: PopoverTrigger, PopoverContent
- **Dialog**: Modal dialog
  - Nested: DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
- **Modal**: Alternative modal implementation
- **Alert**: Status messages
  - Nested: AlertTitle, AlertDescription
- **Progress**: Progress indicator
- **Badge**: Status/label badges
- **Avatar**: User/profile image
  - Nested: AvatarImage, AvatarFallback

### Interactive
- **Calendar**: Date picker
- **Tooltip**: Hover information
  - Nested: TooltipTrigger, TooltipContent, TooltipProvider
- **Navigation**: Navigation component (minimal implementation)

### Special
- **CookieConsent**: Cookie consent banner
- **Command**: Command palette (empty implementation)

## 3. Composite Components (Molecules & Organisms)

Higher-level components built from primitives.

### Form Components
Located in `src/components/forms/`

#### FormBuilder
Dynamic form creation interface.
- **Nested Elements**:
  - FormFieldEditor (for each field)
    - Card (field container)
      - CardHeader
        - Icon + CardTitle + Badge (field type)
        - Buttons (delete, settings, preview)
      - CardContent
        - Label input
        - Type selector (Select)
        - Placeholder input
        - Required checkbox
        - Type-specific options (options for select, validation rules)
    - Field preview section
  - Action buttons (Add Field, Save, Preview)

#### MultiStepWizard
Multi-step form wizard.
- **Nested Elements**: (Complex, multi-step flow)
  - Step indicators
  - Current step content
  - Navigation buttons (Previous, Next, Submit)
  - Progress bar

#### SearchFilterBar
Advanced search and filtering.
- **Nested Elements**:
  - Search input
  - Filter dropdowns
  - Sort controls
  - Active filter tags
  - Clear filters button

### Layout Components
Located in `src/components/layouts/`

#### DetailLayout
Detailed view layout for entities.
- **Nested Elements**:
  - Breadcrumb navigation
  - Header section
    - Title and actions
    - Metadata/status
  - Tabs (overview, details, related)
  - Content area
  - Related items sidebar

#### ListLayout
List view layout with filtering and pagination.
- **Nested Elements**:
  - Header with title and actions
  - SearchFilterBar
  - Bulk actions toolbar
  - Data table/list
  - Pagination controls
  - Loading states

### Visualization Components
Located in `src/components/visualization/`

#### AnalyticsChart
Data visualization charts.
- **Nested Elements**:
  - Chart container
  - Chart controls (type selector, filters)
  - Chart canvas (using charting library)

#### MetricsDashboard
Metrics display dashboard.
- **Nested Elements**:
  - Grid of metric cards
  - Charts section
  - Time period selector

#### ComparisonMatrix
Feature comparison table.
- **Nested Elements**:
  - Table header with items
  - Feature rows with comparison values
  - Legend/key

### Workflow Components
Located in `src/components/workflow/`

#### WorkflowDesigner
Visual workflow creation.
- **Nested Elements**:
  - Canvas area
  - Node palette
  - Property panel
  - Toolbar (save, undo, etc.)

#### KanbanBoard
Kanban project management.
- **Nested Elements**:
  - Column containers
  - Cards within columns
  - Drag handles

#### GanttChart
Project timeline visualization.
- **Nested Elements**:
  - Timeline header
  - Task bars
  - Dependencies

#### ApprovalWorkflowForm
Approval process form.
- **Nested Elements**:
  - Workflow steps
  - Current step form
  - Approval/rejection buttons

### Content Components
Located in `src/components/content/`

#### DocumentViewer
Document display and interaction.
- **Nested Elements**:
  - Document header (title, metadata)
  - Viewer canvas
  - Controls (zoom, download, etc.)

#### StatusIndicator
Status display component.
- **Nested Elements**:
  - Icon + text
  - Color-coded status

### Specialized Components

#### OrganizationSwitcher
Multi-organization selection.
- **Nested Elements**:
  - Current org display
  - Dropdown with org list
  - Workspace switcher

#### ThemeProvider
Theme management context.

#### PWAProvider
Progressive Web App functionality.

#### Dashboard Shell Components

#### CommandBar
Application command interface.
- **Nested Elements**:
  - Search input
  - Quick actions
  - User menu
  - Notifications

#### TaskCard
Task item display.
- **Nested Elements**:
  - Header (title, priority, status)
  - Content (description, assignee, due date)
  - Actions (edit, delete, complete)

#### TaskDetailView
Detailed task view.
- **Nested Elements**:
  - Header section
  - Tabs (overview, comments, attachments, history)
  - Action buttons

#### TaskActions
Task action buttons.
- **Nested Elements**:
  - Primary actions (edit, assign, etc.)
  - Secondary actions dropdown

#### ViewsBar
View switching and filtering.
- **Nested Elements**:
  - View toggles (list, grid, calendar)
  - Filter controls
  - Sort options

## 4. Layouts, Templates, and Shells

### App-Level Layouts

#### RootLayout (`src/app/layout.tsx`)
Application shell wrapper.
- **Structure**:
  ```
  <html>
    <head> (meta tags, icons, PWA config)
    <body>
      <Providers>
        {children}
        <CookieConsent />
      </Providers>
    </body>
  </html>
  ```
- **Nested Elements**:
  - HTML document structure
  - Providers context (Session, Theme, PWA)
  - Cookie consent banner

#### Providers (`src/components/providers.tsx`)
Context providers stack.
- **Structure**:
  ```
  <SessionProvider>
    <ThemeProvider>
      <PWAProvider>
        {children}
        <CookieConsent />
      </PWAProvider>
    </ThemeProvider>
  </SessionProvider>
  ```

### Page Templates

#### Dashboard Layout (`src/components/dashboard-layout.tsx`)
Main dashboard container.
- **Structure**:
  - Header (navigation, user menu)
  - Sidebar (menu items)
  - Main content area
  - Footer

#### Detail Layout Template
Used for entity detail pages.
- **Layout Drawing**:
  ```
  +---------------------------------+
  | Breadcrumb Navigation          |
  +---------------------------------+
  | Header: Title | Actions        |
  | Metadata | Status             |
  +---------------------------------+
  | Tabs: Overview | Details | ... |
  +---------------------------------+
  | Content Area                   |
  |                                 |
  | +-----------------------------+ |
  | | Related Items Sidebar      | |
  | +-----------------------------+ |
  +---------------------------------+
  ```

#### List Layout Template
Used for list/index pages.
- **Layout Drawing**:
  ```
  +---------------------------------+
  | Header: Title | Bulk Actions  |
  +---------------------------------+
  | Search & Filter Bar            |
  +---------------------------------+
  | Data Table/List                |
  |                                 |
  | Item 1                         |
  | Item 2                         |
  | ...                            |
  +---------------------------------+
  | Pagination Controls            |
  +---------------------------------+
  ```

#### Workflow Templates
Various workflow-specific layouts for different phases (concept, develop, etc.).

### Shell Components

#### Concept Phase Workflow Shell
Workflow shell for concept phase.
- **Structure**:
  - Phase indicator
  - Step-by-step wizard
  - Progress tracking
  - Action buttons

#### Dashboard Shell
Main application dashboard.
- **Layout Drawing**:
  ```
  +---------------------------------+
  | Command Bar (Search, Actions)  |
  +---------------------------------+
  | Views Bar (List/Grid/Calendar) |
  +---------------------------------+
  | Main Content Area              |
  | +-----------------------------+ |
  | | Task Cards / List          | |
  | |                             | |
  | | Task Detail View (overlay) | |
  | +-----------------------------+ |
  +---------------------------------+
  ```

## 5. Component Relationships & Hierarchy

### Atomic Design Hierarchy
1. **Atoms**: UI primitives (Button, Input, Card)
2. **Molecules**: Simple composites (FormBuilder, SearchFilterBar)
3. **Organisms**: Complex composites (DetailLayout, KanbanBoard)
4. **Templates**: Page-level layouts (Dashboard, Detail pages)
5. **Pages**: Actual page implementations

### Data Flow Patterns
- Context providers (Theme, Session, PWA)
- Form state management
- Component composition
- Event-driven interactions

### Responsive Design
All components support responsive breakpoints (sm, md, lg, xl, 2xl) using Tailwind CSS classes.

### Accessibility
Components include ARIA attributes, keyboard navigation, and screen reader support where applicable.

## 6. Implementation Notes

- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks and context
- **Icons**: Lucide React icon library
- **Forms**: React Hook Form integration
- **Charts**: Integration with charting libraries (not specified)
- **Animations**: CSS transitions and keyframes
- **Theming**: CSS custom properties for white-label support
- **PWA**: Service worker and offline capabilities

This inventory covers all major UI elements from the foundation layer through complete page shells, providing a comprehensive reference for development and maintenance.
