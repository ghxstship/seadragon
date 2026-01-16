
// Integration Orchestration Engine - Sequential Chains, Parallel Processing, and Conditional Triggers

import { IntegrationConnection, WorkflowTrigger, WorkflowAction, WorkflowCondition } from './types'
import { integrationManager } from './manager'

export interface OrchestrationChain {
  id: string
  name: string
  description: string
  type: 'sequential' | 'parallel' | 'conditional'
  steps: OrchestrationStep[]
  organizationId: string
  status: 'active' | 'inactive' | 'draft'
  createdAt: Date
  updatedAt: Date
}

export interface OrchestrationStep {
  id: string
  name: string
  description?: string
  connectionId: string
  action: string
  parameters: Record<string, unknown>
  conditions?: OrchestrationCondition[]
  dependsOn?: string[] // For sequential chains
  timeout?: number // In milliseconds
  retryCount?: number
  retryDelay?: number // In milliseconds
}

export interface OrchestrationCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists'
  value: unknown
  action: 'continue' | 'skip' | 'fail' | 'retry'
}

export interface OrchestrationResult {
  chainId: string
  stepId: string
  success: boolean
  result?: Record<string, unknown>
  error?: string
  duration: number
  timestamp: Date
  retryCount: number
}

export class IntegrationOrchestrator {
  private chains: Map<string, OrchestrationChain> = new Map()
  private activeExecutions: Map<string, OrchestrationExecution> = new Map()

  // Register orchestration chains
  registerChain(chain: OrchestrationChain): void {
    this.chains.set(chain.id, chain)
  }

  // Execute orchestration chain
  async executeChain(chainId: string, initialData?: unknown): Promise<OrchestrationResult[]> {
    const chain = this.chains.get(chainId)
    if (!chain || chain.status !== 'active') {
      throw new Error(`Chain ${chainId} not found or not active`)
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const execution: OrchestrationExecution = {
      id: executionId,
      chainId,
      status: 'running',
      results: [],
      startTime: new Date(),
      initialData
    }

    this.activeExecutions.set(executionId, execution)

    try {
      let results: OrchestrationResult[] = []

      switch (chain.type) {
        case 'sequential':
          results = await this.executeSequential(chain, execution)
          break
        case 'parallel':
          results = await this.executeParallel(chain, execution)
          break
        case 'conditional':
          results = await this.executeConditional(chain, execution)
          break
        default:
          throw new Error(`Unknown chain type: ${chain.type}`)
      }

      execution.status = 'completed'
      execution.endTime = new Date()
      execution.results = results

      return results
    } catch (error) {
      execution.status = 'failed'
      execution.endTime = new Date()
      execution.error = error instanceof Error ? error.message : 'Unknown error'
      throw error
    } finally {
      // Clean up old executions after some time
      setTimeout(() => {
        this.activeExecutions.delete(executionId)
      }, 300000) // 5 minutes
    }
  }

  // Execute sequential chain (steps run one after another)
  private async executeSequential(chain: OrchestrationChain, execution: OrchestrationExecution): Promise<OrchestrationResult[]> {
    const results: OrchestrationResult[] = []
    let currentData = execution.initialData

    for (const step of chain.steps) {
      const stepStart = Date.now()

      try {
        // Check if step conditions are met
        if (step.conditions && !this.evaluateConditions(step.conditions, currentData)) {
          results.push({
            chainId: chain.id,
            stepId: step.id,
            success: false,
            error: 'Step conditions not met',
            duration: Date.now() - stepStart,
            timestamp: new Date(),
            retryCount: 0
          })
          continue
        }

        // Execute step with retry logic
        let result: unknown
        let retryCount = 0
        let lastError: string | undefined

        while (retryCount <= (step.retryCount || 0)) {
          try {
            result = await this.executeStep(step, currentData)
            break
          } catch (error) {
            lastError = error instanceof Error ? error.message : 'Step execution failed'
            retryCount++

            if (retryCount <= (step.retryCount || 0)) {
              await new Promise(resolve => setTimeout(resolve, step.retryDelay || 1000))
            }
          }
        }

        if (lastError && retryCount > (step.retryCount || 0)) {
          results.push({
            chainId: chain.id,
            stepId: step.id,
            success: false,
            error: lastError,
            duration: Date.now() - stepStart,
            timestamp: new Date(),
            retryCount
          })
          break // Stop sequential execution on failure
        }

        results.push({
          chainId: chain.id,
          stepId: step.id,
          success: true,
          result,
          duration: Date.now() - stepStart,
          timestamp: new Date(),
          retryCount
        })

        // Pass result to next step
        currentData = result

      } catch (error) {
        results.push({
          chainId: chain.id,
          stepId: step.id,
          success: false,
          error: error instanceof Error ? error.message : 'Step execution failed',
          duration: Date.now() - stepStart,
          timestamp: new Date(),
          retryCount: 0
        })
        break // Stop sequential execution on unexpected error
      }
    }

    return results
  }

  // Execute parallel chain (steps run simultaneously)
  private async executeParallel(chain: OrchestrationChain, execution: OrchestrationExecution): Promise<OrchestrationResult[]> {
    const promises = chain.steps.map(async (step) => {
      const stepStart = Date.now()

      try {
        // Check conditions
        if (step.conditions && !this.evaluateConditions(step.conditions, execution.initialData)) {
          return {
            chainId: chain.id,
            stepId: step.id,
            success: false,
            error: 'Step conditions not met',
            duration: Date.now() - stepStart,
            timestamp: new Date(),
            retryCount: 0
          }
        }

        // Execute with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Step timeout')), step.timeout || 30000)
        })

        const executionPromise = this.executeStepWithRetry(step, execution.initialData)
        const result = await Promise.race([executionPromise, timeoutPromise])

        return {
          chainId: chain.id,
          stepId: step.id,
          success: true,
          result,
          duration: Date.now() - stepStart,
          timestamp: new Date(),
          retryCount: 0
        }

      } catch (error) {
        return {
          chainId: chain.id,
          stepId: step.id,
          success: false,
          error: error instanceof Error ? error.message : 'Step execution failed',
          duration: Date.now() - stepStart,
          timestamp: new Date(),
          retryCount: 0
        }
      }
    })

    return Promise.all(promises)
  }

  // Execute conditional chain (steps run based on conditions)
  private async executeConditional(chain: OrchestrationChain, execution: OrchestrationExecution): Promise<OrchestrationResult[]> {
    const results: OrchestrationResult[] = []
    let currentData = execution.initialData

    for (const step of chain.steps) {
      const stepStart = Date.now()

      try {
        // Evaluate step conditions against current data
        const conditionMet = step.conditions ? this.evaluateConditions(step.conditions, currentData) : true

        if (conditionMet) {
          const result = await this.executeStepWithRetry(step, currentData)

          results.push({
            chainId: chain.id,
            stepId: step.id,
            success: true,
            result,
            duration: Date.now() - stepStart,
            timestamp: new Date(),
            retryCount: 0
          })

          currentData = result
        } else {
          results.push({
            chainId: chain.id,
            stepId: step.id,
            success: false,
            error: 'Conditions not met - step skipped',
            duration: Date.now() - stepStart,
            timestamp: new Date(),
            retryCount: 0
          })
        }

      } catch (error) {
        results.push({
          chainId: chain.id,
          stepId: step.id,
          success: false,
          error: error instanceof Error ? error.message : 'Step execution failed',
          duration: Date.now() - stepStart,
          timestamp: new Date(),
          retryCount: 0
        })
      }
    }

    return results
  }

  // Execute step with retry logic
  private async executeStepWithRetry(step: OrchestrationStep, data: unknown): Promise<unknown> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= (step.retryCount || 0); attempt++) {
      try {
        return await this.executeStep(step, data)
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        if (attempt < (step.retryCount || 0)) {
          await new Promise(resolve => setTimeout(resolve, step.retryDelay || 1000))
        }
      }
    }

    throw lastError
  }

  // Execute individual step
  private async executeStep(step: OrchestrationStep, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const connection = integrationManager.getConnection(step.connectionId)
    if (!connection) {
      throw new Error(`Connection ${step.connectionId} not found`)
    }

    // Map action to method call based on provider and action type
    switch (step.action) {
      case 'sync_data':
        return integrationManager.syncConnection(step.connectionId, step.parameters)

      case 'send_notification':
        return this.sendNotification(connection, step.parameters, data)

      case 'create_issue':
        return this.createIssue(connection, step.parameters, data)

      case 'update_record':
        return this.updateRecord(connection, step.parameters, data)

      case 'run_command':
        return this.runCommand(connection, step.parameters, data)

      default:
        throw new Error(`Unsupported action: ${step.action}`)
    }
  }

  // Evaluate conditions
  private evaluateConditions(conditions: OrchestrationCondition[], data: Record<string, unknown>): boolean {
    return conditions.every(condition => {
      const fieldValue = this.getNestedValue(data, condition.field)

      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value
        case 'not_equals':
          return fieldValue !== condition.value
        case 'contains':
          return String(fieldValue).includes(String(condition.value))
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value)
        case 'less_than':
          return Number(fieldValue) < Number(condition.value)
        case 'exists':
          return fieldValue !== undefined && fieldValue !== null
        case 'not_exists':
          return fieldValue === undefined || fieldValue === null
        default:
          return false
      }
    })
  }

  // Get nested object value
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current, key) => (current as Record<string, unknown>)?.[key], obj)
  }

  // Action implementations
  private async sendNotification(connection: IntegrationConnection, params: Record<string, unknown>, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Implementation depends on provider (Slack, Teams, etc.)
    switch (connection.providerId) {
      case 'slack':
        // Send Slack message
        break
      case 'microsoft-teams':
        // Send Teams message
        break
      default:
        throw new Error(`Notification not supported for provider ${connection.providerId}`)
    }
    return {}
  }

  private async createIssue(connection: IntegrationConnection, params: Record<string, unknown>, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Implementation depends on provider (Jira, GitHub, etc.)
    switch (connection.providerId) {
      case 'jira':
        // Create Jira issue
        break
      case 'github':
        // Create GitHub issue
        break
      default:
        throw new Error(`Issue creation not supported for provider ${connection.providerId}`)
    }
    return {}
  }

  private async updateRecord(connection: IntegrationConnection, params: Record<string, unknown>, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Generic record update - implementation depends on provider
    // This could be updating database records, CRM contacts, etc.
    throw new Error(`Update record not implemented for provider ${connection.providerId}`)
  }

  private async runCommand(connection: IntegrationConnection, params: Record<string, unknown>, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Implementation depends on provider (Jenkins, GitHub Actions, etc.)
    switch (connection.providerId) {
      case 'jenkins':
        // Trigger Jenkins job
        break
      case 'github-actions':
        // Trigger GitHub Actions workflow
        break
      default:
        throw new Error(`Command execution not supported for provider ${connection.providerId}`)
    }
    return {}
  }

  // Get chain execution status
  getExecutionStatus(executionId: string): OrchestrationExecution | undefined {
    return this.activeExecutions.get(executionId)
  }

  // Get all registered chains
  getChains(): OrchestrationChain[] {
    return Array.from(this.chains.values())
  }

  // Get chains for organization
  getChainsForOrganization(organizationId: string): OrchestrationChain[] {
    return Array.from(this.chains.values())
      .filter(chain => chain.organizationId === organizationId)
  }
}

interface OrchestrationExecution {
  id: string
  chainId: string
  status: 'running' | 'completed' | 'failed'
  results: OrchestrationResult[]
  startTime: Date
  endTime?: Date
  initialData?: Record<string, unknown>
  error?: string
}

// Global orchestrator instance
export const integrationOrchestrator = new IntegrationOrchestrator()

// Pre-configured orchestration chains from workflow inventory
export const PreConfiguredChains = {
  // Sequential: Procurement → Inventory → Finance
  procurementToFinance: {
    id: 'procurement-to-finance',
    name: 'Procurement to Finance Chain',
    description: 'Purchase request triggers inventory updates and financial reconciliation',
    type: 'sequential' as const,
    steps: [
      {
        id: 'procurement_request',
        name: 'Process Purchase Request',
        connectionId: 'procurement-system',
        action: 'create_issue',
        parameters: { type: 'purchase_request' }
      },
      {
        id: 'inventory_update',
        name: 'Update Inventory',
        connectionId: 'inventory-system',
        action: 'update_record',
        parameters: { table: 'inventory', operation: 'decrement' },
        dependsOn: ['procurement_request']
      },
      {
        id: 'financial_reconciliation',
        name: 'Financial Reconciliation',
        connectionId: 'accounting-system',
        action: 'update_record',
        parameters: { table: 'ledger', operation: 'debit' },
        dependsOn: ['inventory_update']
      }
    ]
  },

  // Parallel: Multi-channel Communication
  multiChannelNotification: {
    id: 'multi-channel-notification',
    name: 'Multi-Channel Notification',
    description: 'Send notifications across multiple communication channels simultaneously',
    type: 'parallel' as const,
    steps: [
      {
        id: 'slack_notification',
        name: 'Send Slack Notification',
        connectionId: 'slack-connection',
        action: 'send_notification',
        parameters: { channel: '#general', priority: 'normal' }
      },
      {
        id: 'teams_notification',
        name: 'Send Teams Notification',
        connectionId: 'teams-connection',
        action: 'send_notification',
        parameters: { channel: 'General', priority: 'normal' }
      },
      {
        id: 'email_notification',
        name: 'Send Email Notification',
        connectionId: 'email-service',
        action: 'send_notification',
        parameters: { template: 'system-alert' }
      }
    ]
  },

  // Conditional: Event-based Automation
  eventBasedAutomation: {
    id: 'event-based-automation',
    name: 'Event-Based Automation',
    description: 'Trigger workflows based on system events and conditions',
    type: 'conditional' as const,
    steps: [
      {
        id: 'check_inventory_low',
        name: 'Check Low Inventory',
        connectionId: 'inventory-system',
        action: 'sync_data',
        parameters: { checkLowStock: true },
      conditions: [
        {
          field: 'inventory.lowStockItems',
          operator: 'exists' as const,
          value: true,
          action: 'continue' as const
        }
      ]
      },
      {
        id: 'create_reorder_request',
        name: 'Create Reorder Request',
        connectionId: 'procurement-system',
        action: 'create_issue',
        parameters: { type: 'reorder', priority: 'high' },
        conditions: [
          {
            field: 'check_inventory_low.success',
            operator: 'equals' as const,
            value: true,
            action: 'continue' as const
          }
        ]
      },
      {
        id: 'notify_stakeholders',
        name: 'Notify Stakeholders',
        connectionId: 'communication-system',
        action: 'send_notification',
        parameters: { urgent: true, recipients: 'procurement-team' },
        conditions: [
          {
            field: 'create_reorder_request.success',
            operator: 'equals' as const,
            value: true,
            action: 'continue' as const
          }
        ]
      }
    ]
  }
}

// Register pre-configured chains
Object.values(PreConfiguredChains).forEach(chain => {
  integrationOrchestrator.registerChain({
    ...chain,
    organizationId: 'system', // System-level chains
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  })
})
