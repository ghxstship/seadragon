
// Workflow Validation System
// Comprehensive validation for workflow states, transitions, and data integrity

import { WorkflowState, WorkflowDefinition, WorkflowValidation, WorkflowValidationRule } from './workflow-state-manager'
import { logger } from './logger'

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  score: number // 0-100 validation score
}

export interface ValidationError {
  id: string
  type: 'data' | 'logic' | 'permission' | 'transition' | 'dependency'
  severity: 'critical' | 'high' | 'medium' | 'low'
  field?: string
  step?: string
  phase?: string
  message: string
  suggestion?: string
}

export interface ValidationWarning {
  id: string
  type: 'performance' | 'best-practice' | 'optimization' | 'compliance'
  field?: string
  message: string
  suggestion?: string
}

export interface ValidationContext {
  isTransition?: boolean
  userId?: string
  permissions?: string[]
  additionalData?: Record<string, unknown>
}

export interface DataSchema {
  [field: string]: {
    required?: boolean
    type?: string
    minLength?: number
    maxLength?: number
    pattern?: string
    enum?: string[]
  }
}

class WorkflowValidator {
  private validationRules: Map<string, ValidationRule> = new Map()

  // Register validation rules
  registerRule(rule: ValidationRule): void {
    this.validationRules.set(rule.id, rule)
  }

  // Validate workflow state
  async validateWorkflow(
    workflowState: WorkflowState,
    context?: ValidationContext
  ): Promise<ValidationResult> {
    const applicableRules = Array.from(this.validationRules.values()).filter(rule =>
      this.isRuleApplicable(rule, workflowState)
    )

    const allErrors: ValidationError[] = []
    const allWarnings: ValidationWarning[] = []
    let totalScore = 100
    const ruleWeights = applicableRules.length

    for (const rule of applicableRules) {
      try {
        const result = await rule.validator(workflowState, context)

        allErrors.push(...result.errors)
        allWarnings.push(...result.warnings)

        // Adjust score based on rule priority and failures
        if (!result.isValid) {
          const penalty = this.getPenaltyForPriority(rule.priority)
          totalScore = Math.max(0, totalScore - penalty)
        }
      } catch (error) {
        logger.error(`Validation rule ${rule.id} failed`, error)
        allErrors.push({
          id: `rule-error-${rule.id}`,
          type: 'logic',
          severity: 'high',
          message: `Validation rule ${rule.name} encountered an error`,
          suggestion: 'Check validation rule implementation'
        })
        totalScore = Math.max(0, totalScore - 10)
      }
    }

    return {
      isValid: allErrors.filter(e => e.severity === 'critical').length === 0,
      errors: allErrors,
      warnings: allWarnings,
      score: Math.round(totalScore)
    }
  }

  // Validate workflow transition
  async validateTransition(
    fromState: WorkflowState,
    toPhase: string,
    toStep: string,
    context?: ValidationContext
  ): Promise<ValidationResult> {
    const mockToState: WorkflowState = {
      ...fromState,
      currentPhase: toPhase,
      currentStep: toStep
    }

    return await this.validateWorkflow(mockToState, { ...context, isTransition: true })
  }

  // Validate workflow data
  async validateData(
    workflowState: WorkflowState,
    data: Record<string, unknown>,
    schema?: DataSchema
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Basic data validation
    if (!data || typeof data !== 'object') {
      errors.push({
        id: 'data-invalid-structure',
        type: 'data',
        severity: 'critical',
        message: 'Workflow data must be a valid object',
        suggestion: 'Ensure workflow data is properly structured'
      })
      return { isValid: false, errors, warnings, score: 0 }
    }

    // Schema validation (if provided)
    if (schema) {
      const schemaErrors = this.validateAgainstSchema(data, schema)
      errors.push(...schemaErrors)
    }

    // Required field validation
    const requiredFields = this.getRequiredFields(workflowState)
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0 && data[field] !== false) {
        errors.push({
          id: `required-field-${field}`,
          type: 'data',
          severity: 'high',
          field,
          message: `Required field '${field}' is missing`,
          suggestion: `Provide a value for the ${field} field`
        })
      }
    }

    // Data type validation
    const typeErrors = this.validateDataTypes(data, workflowState)
    errors.push(...typeErrors)

    // Business rule validation
    const businessErrors = await this.validateBusinessRules(workflowState, data)
    errors.push(...businessErrors)

    // Data quality warnings
    const qualityWarnings = this.validateDataQuality(data)
    warnings.push(...qualityWarnings)

    const score = this.calculateDataValidationScore(errors, warnings, requiredFields.length)

    return {
      isValid: errors.filter(e => e.severity === 'critical').length === 0,
      errors,
      warnings,
      score
    }
  }

  // Get validation summary
  getValidationSummary(results: ValidationResult[]): {
    totalScore: number
    criticalErrors: number
    highErrors: number
    warnings: number
    recommendations: string[]
  } {
    const totalErrors = results.flatMap(r => r.errors)
    const totalWarnings = results.flatMap(r => r.warnings)
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length

    const criticalErrors = totalErrors.filter(e => e.severity === 'critical').length
    const highErrors = totalErrors.filter(e => e.severity === 'high').length
    const warnings = totalWarnings.length

    const recommendations = this.generateRecommendations(totalErrors, totalWarnings)

    return {
      totalScore: Math.round(averageScore),
      criticalErrors,
      highErrors,
      warnings,
      recommendations
    }
  }

  private isRuleApplicable(rule: ValidationRule, workflowState: WorkflowState): boolean {
    const { appliesTo } = rule

    if (appliesTo.workflowTypes && !appliesTo.workflowTypes.includes(workflowState.workflowType)) {
      return false
    }

    if (appliesTo.phases && !appliesTo.phases.includes(workflowState.currentPhase)) {
      return false
    }

    if (appliesTo.steps && !appliesTo.steps.includes(workflowState.currentStep)) {
      return false
    }

    return true
  }

  private getPenaltyForPriority(priority: string): number {
    switch (priority) {
      case 'critical': return 25
      case 'high': return 15
      case 'medium': return 8
      case 'low': return 3
      default: return 5
    }
  }

  private getRequiredFields(workflowState: WorkflowState): string[] {
    // This would be determined by the workflow definition
    // For now, return some example required fields based on workflow type
    switch (workflowState.workflowType) {
      case 'event-lifecycle':
        return ['eventType', 'title', 'startDate', 'budget']
      case 'operational':
        return ['requester', 'category', 'priority']
      default:
        return []
    }
  }

  private validateAgainstSchema(data: Record<string, unknown>, schema: DataSchema): ValidationError[] {
    const errors: ValidationError[] = []

    // Basic schema validation - in a real implementation, use a proper schema validator
    for (const [field, rules] of Object.entries(schema) as [string, { required?: boolean; type?: string }][] ) {
      const value = data[field]

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({
          id: `schema-required-${field}`,
          type: 'data',
          severity: 'high',
          field,
          message: `Field '${field}' is required`,
          suggestion: 'Provide a value for this required field'
        })
      }

      // Type validation
      if (value !== undefined && rules.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value
        if (actualType !== rules.type) {
          errors.push({
            id: `schema-type-${field}`,
            type: 'data',
            severity: 'medium',
            field,
            message: `Field '${field}' should be of type ${rules.type}, got ${actualType}`,
            suggestion: `Convert the value to the correct type`
          })
        }
      }
    }

    return errors
  }

  private validateDataTypes(data: Record<string, unknown>, workflowState: WorkflowState): ValidationError[] {
    const errors: ValidationError[] = []

    for (const [field, value] of Object.entries(data)) {
      // Email validation
      if (field.toLowerCase().includes('email') && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (typeof value === 'string' && !emailRegex.test(value)) {
          errors.push({
            id: `email-invalid-${field}`,
            type: 'data',
            severity: 'medium',
            field,
            message: `Field '${field}' contains an invalid email address`,
            suggestion: 'Enter a valid email address'
          })
        }
      }

      // Date validation
      if (field.toLowerCase().includes('date') && value) {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          errors.push({
            id: `date-invalid-${field}`,
            type: 'data',
            severity: 'medium',
            field,
            message: `Field '${field}' contains an invalid date`,
            suggestion: 'Enter a valid date'
          })
        }
      }

      // Number validation
      if (field.toLowerCase().includes('amount') || field.toLowerCase().includes('cost') ||
          field.toLowerCase().includes('budget')) {
        if (value !== undefined && (isNaN(Number(value)) || Number(value) < 0)) {
          errors.push({
            id: `number-invalid-${field}`,
            type: 'data',
            severity: 'medium',
            field,
            message: `Field '${field}' must be a valid positive number`,
            suggestion: 'Enter a valid number'
          })
        }
      }
    }

    return errors
  }

  private async validateBusinessRules(
    workflowState: WorkflowState,
    data: Record<string, unknown>
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = []

    // Event-specific business rules
    if (workflowState.workflowType === 'event-lifecycle') {
      // Budget validation
      const budget = data.budget || data.totalBudget
      const estimatedCost = data.estimatedCost || 0

      if (budget && estimatedCost && budget < estimatedCost) {
        errors.push({
          id: 'budget-insufficient',
          type: 'logic',
          severity: 'high',
          field: 'budget',
          message: 'Budget is insufficient to cover estimated costs',
          suggestion: 'Increase budget or reduce estimated costs'
        })
      }

      // Date validation
      const startDate = data.startDate ? new Date(data.startDate) : null
      const endDate = data.endDate ? new Date(data.endDate) : null

      if (startDate && endDate && startDate >= endDate) {
        errors.push({
          id: 'date-invalid-range',
          type: 'logic',
          severity: 'high',
          field: 'endDate',
          message: 'End date must be after start date',
          suggestion: 'Adjust the end date to be after the start date'
        })
      }
    }

    // Operational workflow rules
    if (workflowState.workflowType === 'operational') {
      // Approval chain validation
      const approvals = data.approvals || []
      const requiredApprovals = data.requiredApprovals || 1

      if (approvals.length < requiredApprovals) {
        errors.push({
          id: 'approvals-insufficient',
          type: 'logic',
          severity: 'medium',
          message: `Requires ${requiredApprovals} approvals, only ${approvals.length} provided`,
          suggestion: 'Add more approvers to the approval chain'
        })
      }
    }

    return errors
  }

  private validateDataQuality(data: Record<string, unknown>): ValidationWarning[] {
    const warnings: ValidationWarning[] = []

    // Check for empty strings that should be meaningful
    for (const [field, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.trim().length < 3 && value.trim() !== '') {
        warnings.push({
          id: `quality-short-${field}`,
          type: 'best-practice',
          field,
          message: `Field '${field}' value is very short`,
          suggestion: 'Provide more detailed information'
        })
      }
    }

    // Check for default/placeholder values
    for (const [field, value] of Object.entries(data)) {
      if (value === 'placeholder' || value === 'default' || value === 'example') {
        warnings.push({
          id: `quality-placeholder-${field}`,
          type: 'best-practice',
          field,
          message: `Field '${field}' contains placeholder text`,
          suggestion: 'Replace with actual data'
        })
      }
    }

    return warnings
  }

  private calculateDataValidationScore(
    errors: ValidationError[],
    warnings: ValidationWarning[],
    requiredFieldsCount: number
  ): number {
    let score = 100

    // Deduct for errors based on severity
    for (const error of errors) {
      switch (error.severity) {
        case 'critical': score -= 20; break
        case 'high': score -= 10; break
        case 'medium': score -= 5; break
        case 'low': score -= 2; break
      }
    }

    // Deduct for warnings
    score -= warnings.length * 1

    // Bonus for having all required fields
    const missingRequired = errors.filter(e => e.message.includes('Required field')).length
    const requiredFieldsBonus = Math.max(0, requiredFieldsCount - missingRequired) * 2
    score += requiredFieldsBonus

    return Math.max(0, Math.min(100, score))
  }

  private generateRecommendations(errors: ValidationError[], warnings: ValidationWarning[]): string[] {
    const recommendations: string[] = []

    // Generate recommendations based on error patterns
    const criticalErrors = errors.filter(e => e.severity === 'critical')
    if (criticalErrors.length > 0) {
      recommendations.push('Address all critical validation errors before proceeding')
    }

    const dataErrors = errors.filter(e => e.type === 'data')
    if (dataErrors.length > 3) {
      recommendations.push('Review data entry processes to reduce validation errors')
    }

    const businessErrors = errors.filter(e => e.type === 'logic')
    if (businessErrors.length > 0) {
      recommendations.push('Review business rules and workflow logic')
    }

    if (warnings.length > 5) {
      recommendations.push('Consider addressing validation warnings for better data quality')
    }

    // Add specific recommendations
    if (errors.some(e => e.message.includes('email'))) {
      recommendations.push('Verify all email addresses are correctly formatted')
    }

    if (errors.some(e => e.message.includes('budget'))) {
      recommendations.push('Ensure budget allocations meet project requirements')
    }

    if (errors.some(e => e.message.includes('date'))) {
      recommendations.push('Verify all dates are valid and logically consistent')
    }

    return recommendations
  }
}

// Singleton instance
export const workflowValidator = new WorkflowValidator()

// Register default validation rules
workflowValidator.registerRule({
  id: 'data-completeness',
  name: 'Data Completeness Check',
  description: 'Ensures all required fields are present and valid',
  category: 'data',
  priority: 'high',
  validator: async (workflowState) => {
    return await workflowValidator.validateData(workflowState, workflowState.data)
  },
  appliesTo: {
    workflowTypes: ['event-lifecycle', 'operational', 'custom']
  }
})

workflowValidator.registerRule({
  id: 'business-logic',
  name: 'Business Logic Validation',
  description: 'Validates business rules and workflow consistency',
  category: 'business',
  priority: 'critical',
  validator: async (workflowState) => {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Add business logic validations here
    // This is a placeholder for more complex business rule validations

    return {
      isValid: errors.filter(e => e.severity === 'critical').length === 0,
      errors,
      warnings,
      score: errors.length === 0 ? 100 : Math.max(0, 100 - errors.length * 10)
    }
  },
  appliesTo: {
    workflowTypes: ['event-lifecycle', 'operational']
  }
})

// Helper functions
export const validateWorkflowBeforeTransition = async (
  workflowState: WorkflowState,
  toPhase: string,
  toStep: string
): Promise<ValidationResult> => {
  return await workflowValidator.validateTransition(workflowState, toPhase, toStep)
}

export const getWorkflowHealthScore = async (
  workflowState: WorkflowState
): Promise<number> => {
  const result = await workflowValidator.validateWorkflow(workflowState)
  return result.score
}

export const getWorkflowIssues = async (
  workflowState: WorkflowState
): Promise<{
  errors: ValidationError[]
  warnings: ValidationWarning[]
  recommendations: string[]
}> => {
  const result = await workflowValidator.validateWorkflow(workflowState)
  const summary = workflowValidator.getValidationSummary([result])

  return {
    errors: result.errors,
    warnings: result.warnings,
    recommendations: summary.recommendations
  }
}
