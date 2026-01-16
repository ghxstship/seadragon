// =============================================================================
// WORKFLOWS INDEX - Workflow Implementations
// =============================================================================
// This file provides centralized exports for all workflow implementations.
// Organized by phase and business domain for better discoverability.
// =============================================================================

// =============================================================================
// EVENT MANAGEMENT WORKFLOWS
// =============================================================================
export { default as EventCreationWorkflow } from './event-creation-workflow'

// =============================================================================
// PROJECT PHASE WORKFLOWS
// =============================================================================
export { default as ConceptPhaseWorkflow } from './concept-phase-workflow'
export { default as DevelopPhaseWorkflow } from './develop-phase-workflow'
export { default as AdvancePhaseWorkflow } from './advance-phase-workflow'
export { default as SchedulePhaseWorkflow } from './schedule-phase-workflow'
export { default as BuildPhaseWorkflow } from './build-phase-workflow'
export { default as TrainPhaseWorkflow } from './train-phase-workflow'
export { default as OperatePhaseWorkflow } from './operate-phase-workflow'

// =============================================================================
// EVENT EXECUTION WORKFLOWS
// =============================================================================
export { default as ExperiencePhaseWorkflow } from './experience-phase-workflow'
export { default as StrikePhaseWorkflow } from './strike-phase-workflow'
export { default as ReconcilePhaseWorkflow } from './reconcile-phase-workflow'
export { default as ArchivePhaseWorkflow } from './archive-phase-workflow'

// =============================================================================
// BUSINESS OPERATIONS WORKFLOWS
// =============================================================================
export { default as ProcurementWorkflow } from './procurement-workflow'
export { default as RecruitmentWorkflow } from './recruitment-workflow'
export { default as AssetInventoryWorkflow } from './asset-inventory-workflow'
export { default as QualityAssuranceWorkflow } from './quality-assurance-workflow'
export { default as MarketingCampaignWorkflow } from './marketing-campaign-workflow'
export { default as LegalComplianceWorkflow } from './legal-compliance-workflow'

// =============================================================================
// ADVANCED WORKFLOWS
// =============================================================================
export { default as CustomWorkflowEngineWorkflow } from './custom-workflow-engine-workflow'
