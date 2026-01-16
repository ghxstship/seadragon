
// Workflow State Management System
// Handles persistence, transitions, and state validation for all workflows

import { createClient } from '@/lib/supabase/server'
import { logger } from './logger'
import './workflows/definitions' // Import to load definitions
import { sendEmail, emailTemplates } from '@/lib/email'

type WorkflowData = Record<string, unknown>
type WorkflowConfig = Record<string, unknown>
type WorkflowAdditionalData = Record<string, unknown>

export interface WorkflowState {
  id: string
  workflowId: string
  workflowType: 'event-lifecycle' | 'operational' | 'custom'
  currentPhase: string
  currentStep: string
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'error'
  data: WorkflowData
  metadata: {
    createdAt: Date
    updatedAt: Date
    createdBy: string
    assignedTo?: string
    priority: 'low' | 'normal' | 'high' | 'urgent'
    tags: string[]
    dueDate?: Date
  }
  transitions: WorkflowTransition[]
  validationResults: WorkflowValidation[]
  permissions: WorkflowPermission[]
}

export interface WorkflowTransition {
  id: string
  fromPhase: string
  fromStep: string
  toPhase: string
  toStep: string
  triggeredBy: string
  triggeredAt: Date
  reason?: string | undefined
  data: WorkflowAdditionalData
}

export interface WorkflowValidation {
  id: string
  stepId: string
  isValid: boolean
  errors: string[]
  warnings: string[]
  validatedAt: Date
  validatedBy: string
}

export interface WorkflowPermission {
  userId: string
  role: 'owner' | 'editor' | 'viewer' | 'approver'
  permissions: string[]
  grantedAt: Date
  grantedBy: string
}

export interface WorkflowDefinition {
  id: string
  name: string
  type: 'event-lifecycle' | 'operational' | 'custom'
  phases: WorkflowPhase[]
  transitions: WorkflowTransitionRule[]
  validations: WorkflowValidationRule[]
  permissions: WorkflowPermissionRule[]
}

export interface WorkflowPhase {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  entryConditions: WorkflowCondition[]
  exitConditions: WorkflowCondition[]
}

export interface WorkflowStep {
  id: string
  name: string
  description: string
  type: 'form' | 'approval' | 'automation' | 'manual' | 'decision'
  component?: string
  config: WorkflowConfig
  requiredFields: string[]
  validations: WorkflowValidationRule[]
}

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists'
  value: string | number | boolean | null
  type: 'and' | 'or'
}

export interface WorkflowTransitionRule {
  id: string
  fromPhase: string
  fromStep: string
  toPhase: string
  toStep: string
  conditions: WorkflowCondition[]
  automatic: boolean
  requiredApprovals: number
}

export interface WorkflowValidationRule {
  id: string
  stepId: string
  field: string
  rule: 'required' | 'email' | 'phone' | 'date' | 'number' | 'custom'
  message: string
  customValidator?: (value: unknown, data: WorkflowData) => boolean
}

export interface WorkflowPermissionRule {
  role: string
  permissions: string[]
  conditions: WorkflowCondition[]
}

class WorkflowStateManager {
  private workflowDefinitions: Map<string, WorkflowDefinition> = new Map()
  private inMemoryStore: Map<string, WorkflowState> = new Map()

  // Register workflow definitions
  registerWorkflow(definition: WorkflowDefinition): void {
    this.workflowDefinitions.set(definition.id, definition)
  }

  // Create new workflow instance
  async createWorkflow(
    workflowId: string,
    initialData: WorkflowData,
    createdBy: string,
    options: {
      priority?: 'low' | 'normal' | 'high' | 'urgent'
      tags?: string[]
      dueDate?: Date
      assignedTo?: string
    } = {}
  ): Promise<WorkflowState> {
    const definition = this.workflowDefinitions.get(workflowId)
    if (!definition) {
      throw new Error(`Workflow definition not found: ${workflowId}`)
    }

    const initialPhase = definition.phases[0]
    if (!initialPhase) {
      throw new Error(`No phases defined for workflow: ${workflowId}`)
    }
    const initialStep = initialPhase.steps[0]
    if (!initialStep) {
      throw new Error(`No steps defined for initial phase in workflow: ${workflowId}`)
    }

    const metadata = {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
      priority: options.priority || 'normal' as const,
      tags: options.tags || [],
      ...(options.assignedTo ? { assignedTo: options.assignedTo } : {}),
      ...(options.dueDate ? { dueDate: options.dueDate } : {})
    }

    const workflowState: WorkflowState = {
      id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      workflowType: definition.type,
      currentPhase: initialPhase.id,
      currentStep: initialStep.id,
      status: 'draft',
      data: initialData,
      metadata,
      transitions: [],
      validationResults: [],
      permissions: [
        {
          userId: createdBy,
          role: 'owner',
          permissions: ['read', 'write', 'delete', 'assign', 'approve'],
          grantedAt: new Date(),
          grantedBy: createdBy
        }
      ]
    }

    // Validate initial state
    const validationResult = await this.validateWorkflowState(workflowState, createdBy)
    workflowState.validationResults.push(validationResult)

    // Persist to database
    await this.persistWorkflowState(workflowState)

    return workflowState
  }

  // Update workflow state
  async updateWorkflow(
    workflowId: string,
    updates: Partial<WorkflowState>,
    updatedBy: string
  ): Promise<WorkflowState> {
    const currentState = await this.loadWorkflowState(workflowId)
    if (!currentState) {
      throw new Error(`Workflow not found: ${workflowId}`)
    }

    // Check permissions
    if (!this.hasPermission(currentState, updatedBy, 'write')) {
      throw new Error('Insufficient permissions to update workflow')
    }

    const updatedState: WorkflowState = {
      ...currentState,
      ...updates,
      metadata: updates.metadata
        ? { ...currentState.metadata, ...updates.metadata, updatedAt: new Date() }
        : { ...currentState.metadata, updatedAt: new Date() }
    }

    // Validate new state
    const validationResult = await this.validateWorkflowState(updatedState, updatedBy)
    updatedState.validationResults.push(validationResult)

    // Check for automatic transitions
    const transition = await this.checkAutomaticTransitions(updatedState)
    if (transition) {
      updatedState.currentPhase = transition.toPhase
      updatedState.currentStep = transition.toStep
      updatedState.transitions.push({
        id: `trans_${Date.now()}`,
        fromPhase: transition.fromPhase,
        fromStep: transition.fromStep,
        toPhase: transition.toPhase,
        toStep: transition.toStep,
        triggeredBy: 'system',
        triggeredAt: new Date(),
        reason: 'Automatic transition based on conditions',
        data: updatedState.data
      })
    }

    // Persist changes
    await this.persistWorkflowState(updatedState)

    return updatedState
  }

  // Transition workflow to next phase/step
  async transitionWorkflow(
    workflowId: string,
    toPhase: string,
    toStep: string,
    triggeredBy: string,
    reason?: string
  ): Promise<WorkflowState> {
    const currentState = await this.loadWorkflowState(workflowId)
    if (!currentState) {
      throw new Error(`Workflow not found: ${workflowId}`)
    }

    // Check permissions
    if (!this.hasPermission(currentState, triggeredBy, 'write')) {
      throw new Error('Insufficient permissions to transition workflow')
    }

    const definition = this.workflowDefinitions.get(currentState.workflowId)
    if (!definition) {
      throw new Error(`Workflow definition not found: ${currentState.workflowId}`)
    }

    // Validate transition
    const canTransition = this.canTransition(
      currentState.currentPhase,
      currentState.currentStep,
      toPhase,
      toStep,
      definition,
      currentState.data
    )

    if (!canTransition) {
      throw new Error('Invalid transition: conditions not met')
    }

    const transition: WorkflowTransition = {
      id: `trans_${Date.now()}`,
      fromPhase: currentState.currentPhase,
      fromStep: currentState.currentStep,
      toPhase,
      toStep,
      triggeredBy,
      triggeredAt: new Date(),
      reason,
      data: currentState.data
    }

    const updatedState: WorkflowState = {
      ...currentState,
      currentPhase: toPhase,
      currentStep: toStep,
      metadata: {
        ...currentState.metadata,
        updatedAt: new Date()
      },
      transitions: [...currentState.transitions, transition]
    }

    // Execute transition hooks
    await this.executeTransitionHooks(updatedState, transition)

    // Persist changes
    await this.persistWorkflowState(updatedState)

    return updatedState
  }

  // Validate workflow state
  async validateWorkflowState(
    workflowState: WorkflowState,
    validatedBy: string
  ): Promise<WorkflowValidation> {
    const definition = this.workflowDefinitions.get(workflowState.workflowId)
    if (!definition) {
      return {
        id: `val_${Date.now()}`,
        stepId: workflowState.currentStep,
        isValid: false,
        errors: ['Workflow definition not found'],
        warnings: [],
        validatedAt: new Date(),
        validatedBy
      }
    }

    const currentPhase = definition.phases.find(p => p.id === workflowState.currentPhase)
    const currentStep = currentPhase?.steps.find(s => s.id === workflowState.currentStep)

    if (!currentStep) {
      return {
        id: `val_${Date.now()}`,
        stepId: workflowState.currentStep,
        isValid: false,
        errors: ['Current step not found in workflow definition'],
        warnings: [],
        validatedAt: new Date(),
        validatedBy
      }
    }

    const errors: string[] = []
    const warnings: string[] = []

    // Validate required fields
    for (const field of currentStep.requiredFields) {
      if (!workflowState.data[field]) {
        errors.push(`Required field '${field}' is missing`)
      }
    }

    // Run validation rules
    for (const validation of currentStep.validations) {
      const value = workflowState.data[validation.field]

      switch (validation.rule) {
        case 'required':
          if (!value) {
            errors.push(validation.message)
          }
          break
        case 'email': {
          const emailValue = typeof value === 'string' ? value : ''
          if (emailValue && !/\S+@\S+\.\S+/.test(emailValue)) {
            errors.push(validation.message)
          }
          break
        }
        case 'custom':
          if (validation.customValidator && !validation.customValidator(value, workflowState.data)) {
            errors.push(validation.message)
          }
          break
      }
    }

    return {
      id: `val_${Date.now()}`,
      stepId: workflowState.currentStep,
      isValid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
      validatedBy
    }
  }

  // Check for automatic transitions
  private async checkAutomaticTransitions(workflowState: WorkflowState): Promise<WorkflowTransitionRule | null> {
    const definition = this.workflowDefinitions.get(workflowState.workflowId)
    if (!definition) return null

    for (const transition of definition.transitions) {
      if (
        transition.fromPhase === workflowState.currentPhase &&
        transition.fromStep === workflowState.currentStep &&
        transition.automatic
      ) {
        const conditionsMet = this.evaluateConditions(transition.conditions, workflowState.data)
        if (conditionsMet) {
          return transition
        }
      }
    }

    return null
  }

  // Validate transition conditions
  private canTransition(
    fromPhase: string,
    fromStep: string,
    toPhase: string,
    toStep: string,
    definition: WorkflowDefinition,
    data: WorkflowData
  ): boolean {
    const transition = definition.transitions.find(t =>
      t.fromPhase === fromPhase &&
      t.fromStep === fromStep &&
      t.toPhase === toPhase &&
      t.toStep === toStep
    )

    if (!transition) return false

    return this.evaluateConditions(transition.conditions, data)
  }

  // Evaluate conditions
  private evaluateConditions(conditions: WorkflowCondition[], data: Record<string, unknown>): boolean {
    if (conditions.length === 0) return true

    return conditions.every(condition => {
      const value = data[condition.field]
      const expectedValue = condition.value

      switch (condition.operator) {
        case 'equals':
          return value === expectedValue
        case 'not_equals':
          return value !== expectedValue
        case 'contains':
          return Array.isArray(value) ? value.includes(expectedValue) : String(value).includes(String(expectedValue))
        case 'greater_than':
          return Number(value) > Number(expectedValue)
        case 'less_than':
          return Number(value) < Number(expectedValue)
        case 'exists':
          return value !== undefined && value !== null
        case 'not_exists':
          return value === undefined || value === null
        default:
          return false
      }
    })
  }

  // Execute transition hooks
  private async executeTransitionHooks(workflowState: WorkflowState, transition: WorkflowTransition): Promise<void> {
    logger.info('Workflow transitioned', {
      workflowId: workflowState.id,
      from: `${transition.fromPhase}:${transition.fromStep}`,
      to: `${transition.toPhase}:${transition.toStep}`,
      triggeredBy: transition.triggeredBy
    })

    // Send notifications to relevant users
    try {
      // Log transition for auditing
      await this.logTransition(workflowState, transition)

      // Send notification to assigned user if different from creator
      if (workflowState.metadata.assignedTo && workflowState.metadata.assignedTo !== workflowState.metadata.createdBy) {
        await this.sendNotification(workflowState, transition, workflowState.metadata.assignedTo)
      }

      // Send notification to workflow creator
      await this.sendNotification(workflowState, transition, workflowState.metadata.createdBy)
    } catch (error) {
      logger.error('Failed to execute transition hooks', error)
    }
  }

  private async logTransition(workflowState: WorkflowState, transition: WorkflowTransition): Promise<void> {
    // Log to database or external system
    // For now, just use logger
    logger.action('workflow_transition', {
      workflowId: workflowState.id,
      workflowType: workflowState.workflowType,
      fromPhase: transition.fromPhase,
      fromStep: transition.fromStep,
      toPhase: transition.toPhase,
      toStep: transition.toStep,
      triggeredBy: transition.triggeredBy,
      timestamp: transition.triggeredAt
    })
  }

  private async sendNotification(workflowState: WorkflowState, transition: WorkflowTransition, userId: string): Promise<void> {
    try {
      // Get user email
      const supabase = await createClient()
      const { data, error } = await supabase.auth.admin.getUserById(userId)

      if (error || !data?.user?.email) {
        logger.error('Failed to get user email', error)
        return
      }

      const userName =
    (typeof data.user.user_metadata?.['name'] === 'string' && data.user.user_metadata['name']) ||
    (typeof data.user.user_metadata?.['full_name'] === 'string' && data.user.user_metadata['full_name']) ||
    'User'

      const definition = this.workflowDefinitions.get(workflowState.workflowId)
      const workflowName = definition?.name || workflowState.workflowId

      const template = emailTemplates.workflowTransition(
        userName,
        workflowName,
        transition.fromPhase,
        transition.fromStep,
        transition.toPhase,
        transition.toStep
      )

      await sendEmail(data.user.email, template)
    } catch (error) {
      logger.error('Failed to send notification', error)
    }
  }

  // Permission checking
  private hasPermission(workflowState: WorkflowState, userId: string, permission: string): boolean {
    const userPermission = workflowState.permissions.find(p => p.userId === userId)
    if (!userPermission) {
      return false
    }
    return userPermission.permissions.includes(permission)
  }
  private async persistWorkflowState(workflowState: WorkflowState): Promise<void> {
    const dbClient = await createClient()
    const { error } = await dbClient.from('workflow_states').upsert({
      id: workflowState.id,
      workflow_id: workflowState.workflowId,
      workflow_type: workflowState.workflowType,
      current_phase: workflowState.currentPhase,
      current_step: workflowState.currentStep,
      status: workflowState.status,
      data: workflowState.data,
      metadata: workflowState.metadata,
      transitions: workflowState.transitions,
      validation_results: workflowState.validationResults,
      permissions: workflowState.permissions,
      created_at: workflowState.metadata.createdAt,
      updated_at: workflowState.metadata.updatedAt
    })

    if (error) {
      throw error
    }

    // Also keep in-memory for testing
    this.inMemoryStore.set(workflowState.id, workflowState)

    logger.debug('Persisting workflow state', { workflowId: workflowState.id })
  }

  private async loadWorkflowState(workflowId: string): Promise<WorkflowState | null> {
    // First check in-memory
    const state = this.inMemoryStore.get(workflowId)
    if (state) {
      return state
    }

    // Load from database
    const dbClient = await createClient()
    const { data, error } = await dbClient.from('workflow_states').select('*').eq('id', workflowId).single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      throw error
    }

    if (!data) return null

    // Convert back to WorkflowState
    const workflowState: WorkflowState = {
      id: data.id,
      workflowId: data.workflow_id,
      workflowType: data.workflow_type,
      currentPhase: data.current_phase,
      currentStep: data.current_step,
      status: data.status,
      data: data.data,
      metadata: data.metadata,
      transitions: data.transitions,
      validationResults: data.validation_results,
      permissions: data.permissions
    }

    // Cache in memory
    this.inMemoryStore.set(workflowId, workflowState)

    logger.debug('Loading workflow state', { workflowId })

    return workflowState
  }

  // Delete workflow
  async deleteWorkflow(workflowId: string, deletedBy: string): Promise<void> {
    const currentState = await this.loadWorkflowState(workflowId)
    if (!currentState) {
      throw new Error(`Workflow not found: ${workflowId}`)
    }

    // Check permissions
    if (!this.hasPermission(currentState, deletedBy, 'delete')) {
      throw new Error('Insufficient permissions to delete workflow')
    }

    // Delete from database
    const dbClient = await createClient()
    const { error } = await dbClient.from('workflow_states').delete().eq('id', workflowId)

    if (error) {
      throw error
    }

    // Remove from in-memory store
    this.inMemoryStore.delete(workflowId)

    logger.action('delete_workflow', { workflowId, deletedBy })
  }

  // Get workflow state by ID
  async getWorkflowState(workflowId: string): Promise<WorkflowState | null> {
    return await this.loadWorkflowState(workflowId)
  }

  // Get workflow statistics
  async getWorkflowStats(): Promise<{
    totalWorkflows: number
    activeWorkflows: number
    completedWorkflows: number
    errorWorkflows: number
    averageCompletionTime: number
  }> {
    const dbClient = await createClient()
    const { data, error } = await dbClient.from('workflow_states').select('status, created_at, updated_at')

    if (error) {
      throw error
    }

    const totalWorkflows = data.length
    const activeWorkflows = data.filter(w => w.status === 'active').length
    const completedWorkflows = data.filter(w => w.status === 'completed').length
    const errorWorkflows = data.filter(w => w.status === 'error').length

    // Average completion time
    const completed = data.filter(w => w.status === 'completed')
    if (completed.length === 0) {
      return {
        totalWorkflows,
        activeWorkflows,
        completedWorkflows,
        errorWorkflows,
        averageCompletionTime: 0
      }
    }

    const totalTime = completed.reduce((sum, w) => {
      const created = new Date(w.created_at).getTime()
      const updated = new Date(w.updated_at).getTime()
      return sum + (updated - created)
    }, 0)

    const averageCompletionTime = totalTime / completed.length / (1000 * 60 * 60 * 24) // in days

    return {
      totalWorkflows,
      activeWorkflows,
      completedWorkflows,
      errorWorkflows,
      averageCompletionTime
    }
  }

}

// Global workflow state manager instance
export const workflowStateManager = new WorkflowStateManager();

export const createOperationalWorkflow = async (
  operationType: string,
  initialData: WorkflowData,
  createdBy: string
): Promise<WorkflowState> => {
  const workflowId = `operational-${operationType.toLowerCase().replace(/\s+/g, '-')}`

  return await workflowStateManager.createWorkflow(
    workflowId,
    initialData,
    createdBy,
    { priority: 'normal', tags: ['operational', operationType] }
  )
}

export const createEventLifecycleWorkflow = async (
  eventType: string,
  initialData: WorkflowData,
  createdBy: string
): Promise<WorkflowState> => {
  const workflowId = `event-lifecycle-${eventType.toLowerCase().replace(/\s+/g, '-')}`

  return await workflowStateManager.createWorkflow(
    workflowId,
    initialData,
    createdBy,
    { priority: 'high', tags: ['event-lifecycle', eventType] }
  )
}

export const getWorkflowStatus = async (_workflowId: string): Promise<string> => {
  return 'active'
}

export const assignWorkflow = async (
  workflowId: string,
  userId: string,
  assignedBy: string
): Promise<void> => {
  const existing = await workflowStateManager.getWorkflowState(workflowId)
  const baseMetadata =
    existing?.metadata ?? {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: assignedBy,
      priority: 'normal' as const,
      tags: [] as string[]
    }

  await workflowStateManager.updateWorkflow(
    workflowId,
    {
      metadata: {
        ...baseMetadata,
        assignedTo: userId,
        updatedAt: new Date()
      }
    },
    assignedBy
  )
}
