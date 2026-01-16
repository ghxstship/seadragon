
import { WorkflowDefinition } from '@/lib/workflow-state-manager'

export const conceptPhaseWorkflowDefinition: WorkflowDefinition = {
  id: 'concept-phase-workflow',
  name: 'Concept Phase Workflow',
  type: 'event-lifecycle',
  phases: [
    {
      id: 'ideation',
      name: 'Ideation & Brainstorming',
      description: 'Generate and evaluate initial event concepts',
      steps: [
        {
          id: 'basic-info',
          name: 'Basic Event Information',
          description: 'Collect basic event details and goals',
          type: 'form',
          config: {},
          requiredFields: ['eventType', 'targetAudience', 'eventGoals'],
          validations: [
            {
              id: 'event-type-required',
              stepId: 'basic-info',
              field: 'eventType',
              rule: 'required',
              message: 'Event type is required'
            },
            {
              id: 'audience-required',
              stepId: 'basic-info',
              field: 'targetAudience',
              rule: 'required',
              message: 'Target audience is required'
            }
          ]
        }
      ],
      entryConditions: [],
      exitConditions: []
    },
    {
      id: 'market-research',
      name: 'Market Research',
      description: 'Analyze market size, growth, and audience demographics',
      steps: [
        {
          id: 'research-analysis',
          name: 'Market Research Analysis',
          description: 'Conduct comprehensive market research',
          type: 'form',
          config: {},
          requiredFields: ['targetMarketSize', 'marketGrowth'],
          validations: [
            {
              id: 'market-size-required',
              stepId: 'research-analysis',
              field: 'targetMarketSize',
              rule: 'required',
              message: 'Target market size is required'
            }
          ]
        }
      ],
      entryConditions: [],
      exitConditions: []
    },
    {
      id: 'feasibility',
      name: 'Feasibility Study',
      description: 'Assess technical, logistical, and operational feasibility',
      steps: [
        {
          id: 'feasibility-assessment',
          name: 'Feasibility Assessment',
          description: 'Evaluate technical and logistical feasibility',
          type: 'form',
          config: {},
          requiredFields: ['technicalRequirements', 'venueRequirements'],
          validations: [
            {
              id: 'technical-req-required',
              stepId: 'feasibility-assessment',
              field: 'technicalRequirements',
              rule: 'required',
              message: 'Technical requirements are required'
            }
          ]
        }
      ],
      entryConditions: [],
      exitConditions: []
    },
    {
      id: 'budget',
      name: 'Budget Planning',
      description: 'Create initial budget estimates and funding strategy',
      steps: [
        {
          id: 'budget-estimation',
          name: 'Budget Estimation',
          description: 'Estimate costs and revenue projections',
          type: 'form',
          config: {},
          requiredFields: ['totalEstimatedBudget'],
          validations: [
            {
              id: 'budget-required',
              stepId: 'budget-estimation',
              field: 'totalEstimatedBudget',
              rule: 'required',
              message: 'Total budget estimate is required'
            }
          ]
        }
      ],
      entryConditions: [],
      exitConditions: []
    },
    {
      id: 'team',
      name: 'Team Assembly',
      description: 'Plan team structure and hiring requirements',
      steps: [
        {
          id: 'team-planning',
          name: 'Team Planning',
          description: 'Plan required roles and team structure',
          type: 'form',
          config: {},
          requiredFields: ['requiredRoles'],
          validations: [
            {
              id: 'roles-required',
              stepId: 'team-planning',
              field: 'requiredRoles',
              rule: 'required',
              message: 'Required roles are required'
            }
          ]
        }
      ],
      entryConditions: [],
      exitConditions: []
    }
  ],
  transitions: [
    {
      id: 'ideation-to-market-research',
      fromPhase: 'ideation',
      fromStep: 'basic-info',
      toPhase: 'market-research',
      toStep: 'research-analysis',
      conditions: [],
      automatic: false,
      requiredApprovals: 0
    },
    {
      id: 'market-research-to-feasibility',
      fromPhase: 'market-research',
      fromStep: 'research-analysis',
      toPhase: 'feasibility',
      toStep: 'feasibility-assessment',
      conditions: [],
      automatic: false,
      requiredApprovals: 0
    },
    {
      id: 'feasibility-to-budget',
      fromPhase: 'feasibility',
      fromStep: 'feasibility-assessment',
      toPhase: 'budget',
      toStep: 'budget-estimation',
      conditions: [],
      automatic: false,
      requiredApprovals: 0
    },
    {
      id: 'budget-to-team',
      fromPhase: 'budget',
      fromStep: 'budget-estimation',
      toPhase: 'team',
      toStep: 'team-planning',
      conditions: [],
      automatic: false,
      requiredApprovals: 0
    }
  ],
  validations: [],
  permissions: []
}

// Simple test workflow definition for performance tests
export const performanceTestWorkflowDefinition: WorkflowDefinition = {
  id: 'performance-test-workflow',
  name: 'Performance Test Workflow',
  type: 'custom',
  phases: [
    {
      id: 'test',
      name: 'Test Phase',
      description: 'Performance test phase',
      steps: [
        {
          id: 'test-step',
          name: 'Test Step',
          description: 'Test step for performance',
          type: 'manual',
          config: {},
          requiredFields: [],
          validations: []
        }
      ],
      entryConditions: [],
      exitConditions: []
    }
  ],
  transitions: [],
  validations: [],
  permissions: []
}

// Simple test workflow definition for integrity tests
export const integrityTestWorkflowDefinition: WorkflowDefinition = {
  id: 'integrity-test-workflow',
  name: 'Integrity Test Workflow',
  type: 'custom',
  phases: [
    {
      id: 'integrity',
      name: 'Integrity Phase',
      description: 'Data integrity test phase',
      steps: [
        {
          id: 'integrity-step',
          name: 'Integrity Step',
          description: 'Step for integrity testing',
          type: 'manual',
          config: {},
          requiredFields: [],
          validations: []
        }
      ],
      entryConditions: [],
      exitConditions: []
    }
  ],
  transitions: [],
  validations: [],
  permissions: []
}

// Register the definitions
// workflowStateManager.registerWorkflow(conceptPhaseWorkflowDefinition)
// workflowStateManager.registerWorkflow(performanceTestWorkflowDefinition)
// workflowStateManager.registerWorkflow(integrityTestWorkflowDefinition)
