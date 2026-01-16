
// =============================================================================
// COMPONENTS INDEX - Enterprise Component Library
// =============================================================================
// This file provides centralized, organized exports for all UI components.
// Organized by category with consistent naming and comprehensive type exports.
// =============================================================================

// =============================================================================
// 1. FORM & DATA ENTRY COMPONENTS
// =============================================================================
export {
  default as FormBuilder,
  type FormBuilderProps,
  type FormField,
  type FormFieldEditorProps
} from './forms/form-builder'

export {
  default as MultiStepWizard,
  type MultiStepWizardProps
} from './forms/multi-step-wizard'

export {
  default as SearchFilterBar,
  type SearchFilterBarProps,
  type SearchFilter,
  type SearchFilterValue
} from './forms/search-filter-bar'

// =============================================================================
// 2. LAYOUT & STRUCTURE COMPONENTS
// =============================================================================
export {
  default as DetailLayout,
  type DetailLayoutProps,
  type DetailLayoutBreadcrumbItem,
  type DetailLayoutAction,
  type DetailLayoutTab,
  type DetailLayoutSection,
  type DetailLayoutRelatedItem
} from './layouts/detail-layout'

export {
  default as ListLayout,
  type ListLayoutProps,
  type ListLayoutFilter,
  type ListLayoutSortOption,
  type ListLayoutBulkAction
} from './layouts/list-layout'

// =============================================================================
// 3. DATA VISUALIZATION COMPONENTS
// =============================================================================
export {
  default as AnalyticsChart,
  type AnalyticsChartProps,
  type ChartDataPoint,
  type ChartSeries
} from './visualization/analytics-chart'

export {
  default as MetricsDashboard,
  type MetricsDashboardProps
} from './visualization/metrics-dashboard'

export {
  default as ComparisonMatrix,
  type ComparisonMatrixProps,
  type ComparisonItem,
  type ComparisonFeature,
  type ComparisonValue
} from './visualization/comparison-matrix'

// =============================================================================
// 4. WORKFLOW & PROCESS MANAGEMENT COMPONENTS
// =============================================================================
export {
  default as WorkflowDesigner,
  type WorkflowDesignerProps,
  type WorkflowNode,
  type WorkflowConnection,
  type WorkflowTemplate
} from './workflow/workflow-designer'

export {
  default as KanbanBoard,
  type KanbanBoardProps,
  type KanbanColumn,
  type KanbanCard
} from './workflow/kanban-board'

export {
  default as GanttChart,
  type GanttChartProps,
  type GanttTask
} from './workflow/gantt-chart'

export {
  default as ApprovalWorkflowForm,
  type ApprovalWorkflowProps,
  type ApprovalStep
} from './workflow/approval-workflow-form'

// =============================================================================
// 5. CONTENT & DOCUMENT COMPONENTS
// =============================================================================
export {
  default as DocumentViewer,
  type DocumentViewerProps,
  type DocumentMetadata
} from './content/document-viewer'

export {
  default as StatusIndicator,
  type StatusIndicatorProps,
  type StatusItem
} from './content/status-indicator'

// =============================================================================
// 6. BUSINESS LOGIC COMPONENTS
// =============================================================================
export {
  EventManager
} from './events/EventManager'

export {
  BookingFlow
} from './booking/BookingFlow'

export {
  default as IntegrationManager
} from './integrations/integration-manager'

export {
  SocialActions,
  FollowButton,
  LikeButton,
  ShareButton
} from './social/SocialActions'

// =============================================================================
// 7. DASHBOARD & TASK MANAGEMENT COMPONENTS
// =============================================================================
export {
  CommandBar
} from './command-bar'

export {
  TaskCard
} from './task-card'

export {
  TaskDetailView
} from './task-detail-view'

export {
  TaskActions
} from './task-actions'

export {
  ViewsBar
} from './views-bar'

// =============================================================================
// 8. PROVIDERS & CONTEXT COMPONENTS
// =============================================================================
export {
  OrganizationSwitcher,
  WorkspaceSwitcher
} from './organization-switcher'

export {
  ThemeProvider
} from './theme-provider'

export {
  PWAProvider
} from './pwa-provider'

// =============================================================================
// 9. UI PRIMITIVES & ATOMS (shadcn/ui components)
// =============================================================================
// Export all UI primitives from the ui/ directory for complete design system access
export * from './ui'

// =============================================================================
// WORKFLOW IMPLEMENTATIONS
// =============================================================================
// Note: Workflow implementations have been moved to src/workflows/index.ts
// for better separation of concerns between UI components and business logic.
export * from '../workflows'

// =============================================================================
// TYPE-ONLY EXPORTS (for components that export types but no default)
// =============================================================================
export type {
  // Component-specific types that don't have default exports
  // Add any additional type-only exports here as needed
} from './types'
