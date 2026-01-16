// Main integration exports for OpusZero
// This file provides a centralized entry point for all integration functionality

// Core integration infrastructure
export { IntegrationManager, integrationManager } from './manager'
export { integrationSecurity } from './security'
export { dataSyncManager } from './sync-manager'
export { IntegrationOrchestrator, integrationOrchestrator } from './orchestration'

// Types and interfaces
export * from './types'

// Core integration components
export * from './clients'
export * from './webhook-processor'
export * from './webhooks'

// Workflow and template systems
export * from './workflow-examples'
export * from './workflow-templates'
export * from './testing'

// Provider registrations - import all provider modules
import { registerProjectManagementIntegrations } from './providers/project-management'
import { registerVersionControlIntegrations } from './providers/version-control'
import { registerCICDIntegrations } from './providers/ci-cd'
import { registerDocumentationIntegrations } from './providers/documentation'
import { registerTimeTrackingIntegrations } from './providers/time-tracking'
import { registerFileStorageIntegrations } from './providers/file-storage'
import { registerAnalyticsIntegrations } from './providers/analytics'
import { registerHRManagementIntegrations } from './providers/hr-management'
import { registerPayrollIntegrations } from './providers/payroll'
import { registerPOSIntegrations } from './providers/pos'
import { registerTicketingIntegrations } from './providers/ticketing'
import { registerInventoryIntegrations } from './providers/inventory'
import { registerMonitoringIntegrations } from './providers/monitoring'
import { registerSecurityIntegrations } from './providers/security'
import { registerLearningIntegrations } from './providers/learning'
import { registerMarketingIntegrations } from './providers/marketing'
import { registerLegalIntegrations } from './providers/legal'

// Re-export finance integrations that were already implemented
export { registerFinanceIntegrations } from './providers/finance-accounting'

// Initialize all integrations on module load
export function initializeAllIntegrations(): void {
  // Register all provider integrations
  registerProjectManagementIntegrations()
  registerVersionControlIntegrations()
  registerCICDIntegrations()
  registerDocumentationIntegrations()
  registerTimeTrackingIntegrations()
  registerFileStorageIntegrations()
  registerAnalyticsIntegrations()
  registerHRManagementIntegrations()
  registerPayrollIntegrations()
  registerPOSIntegrations()
  registerTicketingIntegrations()
  registerInventoryIntegrations()
  registerMonitoringIntegrations()
  registerSecurityIntegrations()
  registerLearningIntegrations()
  registerMarketingIntegrations()
  registerLegalIntegrations()

  // Register existing implementations
  try {
    const { registerFinanceIntegrations } = require('./providers/finance-accounting')
    registerFinanceIntegrations()
  } catch (error) {
    // Silently handle missing finance integrations
  }
}

// Auto-initialize integrations
initializeAllIntegrations()
