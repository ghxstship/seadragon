
// Core integration types and interfaces for the OpusZero integration ecosystem

// =============================================================================
// BASE TYPES
// =============================================================================

export type IntegrationStatus = 'active' | 'beta' | 'deprecated'
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'pending'
export type WorkflowStatus = 'active' | 'inactive' | 'draft'

// =============================================================================
// INTEGRATION PROVIDER TYPES
// =============================================================================

export interface IntegrationProvider {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  logoUrl?: string
  websiteUrl?: string
  documentationUrl?: string
  supportedWorkflows: WorkflowPhase[]
  authentication: AuthenticationMethod
  rateLimits?: RateLimitConfig
  apiVersion?: string
  status: IntegrationStatus
  createdAt: Date
  updatedAt: Date
}

// =============================================================================
// CONNECTION TYPES
// =============================================================================

export interface IntegrationConnection {
  id: string
  providerId: string
  organizationId: string
  userId: string // User who configured the integration
  name: string
  description?: string
  config: IntegrationConfig
  status: ConnectionStatus
  lastSync?: Date
  errorMessage?: string
  metadata: IntegrationMetadata
  createdAt: Date
  updatedAt: Date
}

// Strongly typed metadata for integration connections
export interface IntegrationMetadata {
  lastSuccessfulSync?: Date
  totalSyncs: number
  totalErrors: number
  webhookCount?: number
  apiCallsThisMonth?: number
  rateLimitRemaining?: number
  customFields?: Record<string, unknown>
}

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

export interface IntegrationConfig {
  apiKey?: string
  apiSecret?: string
  accessToken?: string
  refreshToken?: string
  baseUrl?: string
  webhookUrl?: string
  webhookSecret?: string
  additionalConfig: IntegrationAdditionalConfig
}

// Strongly typed additional configuration
export interface IntegrationAdditionalConfig {
  timeout?: number
  retryAttempts?: number
  enableDebugLogging?: boolean
  customHeaders?: Record<string, string>
  proxyUrl?: string
  certificatePath?: string
  accountId?: string
  workspaceId?: string
  username?: string
  projectToken?: string
  secretKey?: string
  tenantId?: string
  companyId?: string
  [key: string]: unknown // Allow for provider-specific configs
}

// =============================================================================
// WEBHOOK TYPES
// =============================================================================

export interface WebhookEvent {
  id: string
  connectionId: string
  providerId: string
  eventType: string
  payload: WebhookPayload
  headers: Record<string, string>
  processed: boolean
  processingError?: string
  createdAt: Date
  processedAt?: Date
}

// Strongly typed webhook payload
export interface WebhookPayload {
  eventId: string
  eventType: string
  timestamp: Date
  source: string
  data: Record<string, unknown>
  metadata?: {
    userId?: string
    organizationId?: string
    resourceId?: string
    action?: string
  }
}

// =============================================================================
// WORKFLOW TYPES
// =============================================================================

export interface IntegrationWorkflow {
  id: string
  name: string
  description: string
  trigger: WorkflowTrigger
  actions: WorkflowAction[]
  conditions?: WorkflowCondition[]
  status: WorkflowStatus
  createdBy: string
  organizationId: string
  metadata: WorkflowMetadata
  createdAt: Date
  updatedAt: Date
}

// Strongly typed workflow metadata
export interface WorkflowMetadata {
  version: string
  lastExecuted?: Date
  executionCount: number
  successRate: number
  averageExecutionTime?: number
  tags: string[]
  customFields?: Record<string, unknown>
}

// Strongly typed workflow trigger
export interface WorkflowTrigger {
  type: 'webhook' | 'schedule' | 'event' | 'api'
  config: WorkflowTriggerConfig
}

// Strongly typed trigger configurations
export type WorkflowTriggerConfig =
  | { type: 'webhook'; webhookUrl: string; secret?: string }
  | { type: 'schedule'; cronExpression: string; timezone?: string }
  | { type: 'event'; eventType: string; filters?: Record<string, unknown> }
  | { type: 'api'; endpoint: string; method: string; headers?: Record<string, string> }

// Strongly typed workflow action
export interface WorkflowAction {
  type: string
  providerId?: string
  config: WorkflowActionConfig
  order: number
}

// Strongly typed action configurations
export interface WorkflowActionConfig {
  parameters?: Record<string, unknown>
  conditions?: WorkflowCondition[]
  retryPolicy?: {
    maxAttempts: number
    backoffMs: number
  }
  timeoutMs?: number
  [key: string]: unknown
}

// Strongly typed workflow condition
export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists'
  value: WorkflowConditionValue
}

// Strongly typed condition values
export type WorkflowConditionValue = string | number | boolean | null | Record<string, unknown>

// =============================================================================
// ENUMERATION TYPES
// =============================================================================

export type IntegrationCategory =
  | 'project_management'
  | 'version_control'
  | 'ci_cd'
  | 'documentation'
  | 'time_tracking'
  | 'file_storage'
  | 'hr_management'
  | 'payroll'
  | 'pos'
  | 'ticketing_support'
  | 'inventory_management'
  | 'analytics_reporting'
  | 'design_creative'
  | 'testing_qa'
  | 'monitoring_observability'
  | 'security_access'
  | 'learning_development'
  | 'marketing_campaign'
  | 'legal_compliance'
  | 'finance_accounting'

export type AuthenticationMethod =
  | 'api_key'
  | 'oauth2'
  | 'basic_auth'
  | 'bearer_token'
  | 'webhook_secret'

export type WorkflowPhase =
  | 'concept'
  | 'develop'
  | 'advance'
  | 'schedule'
  | 'build'
  | 'train'
  | 'operate'
  | 'experience'
  | 'strike'
  | 'reconcile'
  | 'archive'

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

export interface RateLimitConfig {
  requestsPerMinute?: number
  requestsPerHour?: number
  requestsPerDay?: number
  burstLimit?: number
}

// =============================================================================
// RESULT TYPES
// =============================================================================

export interface IntegrationSyncResult {
  success: boolean
  recordsProcessed: number
  errors: string[]
  metadata: SyncResultMetadata
  syncStarted: Date
  syncCompleted: Date
}

// Strongly typed sync result metadata
export interface SyncResultMetadata {
  totalRecords?: number
  createdCount?: number
  updatedCount?: number
  deletedCount?: number
  skippedCount?: number
  durationMs?: number
  providerVersion?: string
  warnings?: string[]
  [key: string]: unknown
}

// =============================================================================
// HANDLER TYPES
// =============================================================================

export interface IntegrationWebhookHandler {
  providerId: string
  eventTypes: string[]
  handleWebhook: (event: WebhookEvent) => Promise<void>
}

export interface IntegrationAPIClient {
  providerId: string
  authenticate: (config: IntegrationConfig) => Promise<void>
  testConnection: () => Promise<boolean>
  syncData: (params?: SyncDataParams) => Promise<IntegrationSyncResult>
  getWebhooks?: () => Promise<WebhookInfo[]>
  createWebhook?: (config: WebhookConfig) => Promise<WebhookInfo>
  deleteWebhook?: (webhookId: string) => Promise<void>
}

// Strongly typed parameters for sync operations (allow provider-specific keys)
export type SyncDataParams = {
  since?: Date
  limit?: number
  entityTypes?: string[]
  filters?: Record<string, unknown>
} & Record<string, unknown>

// Strongly typed webhook information
export interface WebhookInfo {
  id: string
  url: string
  events: string[]
  active: boolean
  createdAt: Date
  updatedAt: Date
}

// Strongly typed webhook configuration
export interface WebhookConfig {
  url: string
  events: string[]
  secret?: string
  active?: boolean
}
