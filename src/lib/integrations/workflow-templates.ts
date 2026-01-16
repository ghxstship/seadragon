
// Workflow Templates for All 11 Event Lifecycle Phases

import { integrationOrchestrator, OrchestrationChain } from './orchestration'

// Workflow Templates mapped to the 11 event lifecycle phases
export const EventLifecycleWorkflowTemplates = {
  // CONCEPT Phase (2-8 weeks) - Ideation, research, planning
  conceptPhaseWorkflows: {
    'market-research-analysis': {
      id: 'concept-market-research',
      name: 'Market Research & Analysis',
      description: 'Comprehensive market research and competitive analysis for event planning',
      type: 'sequential' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'audience-research',
          name: 'Audience Research',
          description: 'Research target audience demographics and preferences',
          connectionId: 'google-analytics-connection',
          action: 'sync_data',
          parameters: { reportType: 'audience', dateRange: '12months' }
        },
        {
          id: 'competitor-analysis',
          name: 'Competitor Analysis',
          description: 'Analyze competitor events and market positioning',
          connectionId: 'google-analytics-connection',
          action: 'sync_data',
          parameters: { reportType: 'competitor', includeMarketShare: true },
          dependsOn: ['audience-research']
        },
        {
          id: 'trend-identification',
          name: 'Trend Identification',
          description: 'Identify industry trends and audience preferences',
          connectionId: 'google-analytics-connection',
          action: 'sync_data',
          parameters: { reportType: 'trends', dateRange: '6months' },
          dependsOn: ['competitor-analysis']
        }
      ]
    },

    'budget-financial-planning': {
      id: 'concept-budget-planning',
      name: 'Budget & Financial Planning',
      description: 'Initial budget estimation and financial projections',
      type: 'sequential' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'historical-data',
          name: 'Historical Event Data',
          description: 'Analyze data from previous similar events',
          connectionId: 'quickbooks-connection',
          action: 'sync_data',
          parameters: { category: 'event-history', dateRange: '2years' }
        },
        {
          id: 'cost-projections',
          name: 'Cost Projections',
          description: 'Project costs for venue, production, marketing',
          connectionId: 'stripe-connection',
          action: 'sync_data',
          parameters: { includeProjections: true, category: 'event-planning' },
          dependsOn: ['historical-data']
        }
      ]
    }
  },

  // DEVELOP Phase (4-16 weeks) - Detailed planning, vendor selection
  developPhaseWorkflows: {
    'vendor-procurement-management': {
      id: 'develop-vendor-procurement',
      name: 'Vendor Procurement & Management',
      description: 'Manage RFP process, vendor selection, and contract negotiation',
      type: 'sequential' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'rfp-distribution',
          name: 'RFP Distribution',
          description: 'Send RFPs to potential vendors',
          connectionId: 'jira-connection',
          action: 'create_issue',
          parameters: {
            project: 'VENDOR_RFP',
            type: 'Task',
            summary: 'Distribute RFPs to vendor list',
            assignee: 'procurement-team'
          }
        },
        {
          id: 'vendor-responses',
          name: 'Collect Vendor Responses',
          description: 'Collect and organize vendor proposals',
          connectionId: 'jira-connection',
          action: 'sync_data',
          parameters: { project: 'VENDOR_RFP', includeAttachments: true },
          dependsOn: ['rfp-distribution']
        },
        {
          id: 'vendor-evaluation',
          name: 'Vendor Evaluation',
          description: 'Evaluate vendor proposals and select finalists',
          connectionId: 'asana-connection',
          action: 'create_issue',
          parameters: {
            project: 'vendor-evaluation',
            type: 'Evaluation',
            summary: 'Evaluate vendor proposals and rankings'
          },
          dependsOn: ['vendor-responses']
        }
      ]
    },

    'marketing-campaign-planning': {
      id: 'develop-marketing-planning',
      name: 'Marketing Campaign Planning',
      description: 'Develop comprehensive marketing strategy and campaign planning',
      type: 'parallel' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'audience-segmentation',
          name: 'Audience Segmentation',
          description: 'Segment target audience for personalized marketing',
          connectionId: 'mixpanel-connection',
          action: 'sync_data',
          parameters: { reportType: 'audience_segments', realTime: false }
        },
        {
          id: 'content-strategy',
          name: 'Content Strategy Development',
          description: 'Develop content marketing strategy',
          connectionId: 'github-connection',
          action: 'sync_data',
          parameters: { repo: 'marketing-assets', includeContent: true }
        },
        {
          id: 'budget-allocation',
          name: 'Marketing Budget Allocation',
          description: 'Allocate budget across marketing channels',
          connectionId: 'quickbooks-connection',
          action: 'sync_data',
          parameters: { category: 'marketing-budget', includeForecasts: true }
        }
      ]
    }
  },

  // ADVANCE Phase (4-12 weeks) - Production advancing, technical preparation
  advancePhaseWorkflows: {
    'technical-production-setup': {
      id: 'advance-technical-setup',
      name: 'Technical Production Setup',
      description: 'Set up technical infrastructure and production systems',
      type: 'sequential' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'equipment-procurement',
          name: 'Equipment Procurement',
          description: 'Procure and configure production equipment',
          connectionId: 'github-actions-connection',
          action: 'run_command',
          parameters: {
            workflow: 'equipment-procurement',
            inputs: { priority: 'high', category: 'production' }
          }
        },
        {
          id: 'system-testing',
          name: 'System Testing',
          description: 'Test all production systems and backup procedures',
          connectionId: 'github-actions-connection',
          action: 'run_command',
          parameters: {
            workflow: 'system-testing',
            inputs: { environment: 'staging', includeLoadTesting: true }
          },
          dependsOn: ['equipment-procurement']
        },
        {
          id: 'contingency-planning',
          name: 'Contingency Planning',
          description: 'Develop and test contingency plans',
          connectionId: 'slack-connection',
          action: 'send_notification',
          parameters: {
            channel: '#production',
            message: 'Contingency planning completed - review and approve',
            urgent: false
          },
          dependsOn: ['system-testing']
        }
      ]
    },

    'team-coordination-setup': {
      id: 'advance-team-coordination',
      name: 'Team Coordination & Communication',
      description: 'Set up team communication channels and coordination systems',
      type: 'parallel' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'communication-channels',
          name: 'Communication Channels Setup',
          description: 'Create dedicated communication channels for all teams',
          connectionId: 'slack-connection',
          action: 'sync_data',
          parameters: { action: 'create_channels', teams: ['production', 'logistics', 'marketing'] }
        },
        {
          id: 'task-management',
          name: 'Task Management Setup',
          description: 'Set up task management and project tracking',
          connectionId: 'jira-connection',
          action: 'sync_data',
          parameters: { action: 'create_boards', projects: ['advance-production', 'logistics'] }
        },
        {
          id: 'document-repository',
          name: 'Document Repository Setup',
          description: 'Set up centralized document repository',
          connectionId: 'github-connection',
          action: 'sync_data',
          parameters: { repo: 'event-documents', action: 'initialize_folders' }
        }
      ]
    }
  },

  // OPERATE Phase - Live event execution
  operatePhaseWorkflows: {
    'real-time-monitoring-dashboard': {
      id: 'operate-real-time-monitoring',
      name: 'Real-Time Monitoring Dashboard',
      description: 'Monitor all systems and performance metrics during live event',
      type: 'parallel' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'performance-monitoring',
          name: 'Performance Monitoring',
          description: 'Monitor system performance and user engagement',
          connectionId: 'amplitude-connection',
          action: 'sync_data',
          parameters: { realTime: true, alertThresholds: true }
        },
        {
          id: 'financial-transactions',
          name: 'Financial Transaction Monitoring',
          description: 'Monitor real-time financial transactions and revenue',
          connectionId: 'stripe-connection',
          action: 'sync_data',
          parameters: { realTime: true, includeRevenue: true }
        },
        {
          id: 'team-communication',
          name: 'Team Communication Hub',
          description: 'Centralized communication for all team members',
          connectionId: 'slack-connection',
          action: 'sync_data',
          parameters: { realTime: true, includeStatusUpdates: true }
        },
        {
          id: 'issue-tracking',
          name: 'Real-Time Issue Tracking',
          description: 'Track and resolve issues as they occur',
          connectionId: 'jira-connection',
          action: 'sync_data',
          parameters: { project: 'EVENT_OPERATIONS', realTime: true }
        }
      ]
    }
  },

  // RECONCILE Phase - Post-event reconciliation and analysis
  reconcilePhaseWorkflows: {
    'comprehensive-financial-reconciliation': {
      id: 'reconcile-financial-closeout',
      name: 'Financial Reconciliation & Closeout',
      description: 'Complete financial reconciliation and reporting',
      type: 'sequential' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'payment-reconciliation',
          name: 'Payment Reconciliation',
          description: 'Reconcile all payments and transactions',
          connectionId: 'stripe-connection',
          action: 'sync_data',
          parameters: {
            action: 'reconcile',
            dateRange: 'event-duration',
            includeRefunds: true
          }
        },
        {
          id: 'expense-processing',
          name: 'Expense Processing',
          description: 'Process and categorize all event expenses',
          connectionId: 'quickbooks-connection',
          action: 'sync_data',
          parameters: {
            action: 'process_expenses',
            category: 'event-expenses',
            includeReceipts: true
          },
          dependsOn: ['payment-reconciliation']
        },
        {
          id: 'financial-reporting',
          name: 'Financial Reporting',
          description: 'Generate comprehensive financial reports',
          connectionId: 'xero-connection',
          action: 'sync_data',
          parameters: {
            action: 'generate_reports',
            reportType: 'event-pnl',
            includeCharts: true
          },
          dependsOn: ['expense-processing']
        }
      ]
    },

    'performance-analytics-review': {
      id: 'reconcile-performance-analytics',
      name: 'Performance Analytics & Review',
      description: 'Analyze event performance and generate insights',
      type: 'parallel' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'attendance-analytics',
          name: 'Attendance & Engagement Analytics',
          description: 'Analyze attendance patterns and engagement metrics',
          connectionId: 'amplitude-connection',
          action: 'sync_data',
          parameters: {
            eventId: 'recent-event',
            includeCohorts: true,
            includeRetention: true
          }
        },
        {
          id: 'content-performance',
          name: 'Content Performance Analysis',
          description: 'Analyze performance of different content and activities',
          connectionId: 'google-analytics-connection',
          action: 'sync_data',
          parameters: {
            eventId: 'recent-event',
            includeContentMetrics: true
          }
        },
        {
          id: 'team-performance',
          name: 'Team Performance Review',
          description: 'Review team performance and identify improvement areas',
          connectionId: 'harvest-connection',
          action: 'sync_data',
          parameters: {
            project: 'event-execution',
            includePerformanceMetrics: true
          }
        }
      ]
    }
  },

  // ARCHIVE Phase - Documentation and knowledge preservation
  archivePhaseWorkflows: {
    'comprehensive-event-documentation': {
      id: 'archive-event-documentation',
      name: 'Comprehensive Event Documentation',
      description: 'Archive all event documentation and create knowledge base',
      type: 'sequential' as const,
      organizationId: 'system-template',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 'document-collection',
          name: 'Document Collection',
          description: 'Collect all event-related documents and materials',
          connectionId: 'github-connection',
          action: 'sync_data',
          parameters: {
            repo: 'event-archive',
            action: 'collect_documents',
            includeAllFormats: true
          }
        },
        {
          id: 'lessons-learned',
          name: 'Lessons Learned Documentation',
          description: 'Document lessons learned and best practices',
          connectionId: 'notion-connection',
          action: 'create_issue',
          parameters: {
            database: 'lessons-learned',
            template: 'event-post-mortem',
            tags: ['archive', 'lessons-learned']
          },
          dependsOn: ['document-collection']
        },
        {
          id: 'knowledge-base-update',
          name: 'Knowledge Base Update',
          description: 'Update organizational knowledge base with event insights',
          connectionId: 'github-connection',
          action: 'sync_data',
          parameters: {
            repo: 'knowledge-base',
            action: 'add_event_insights',
            category: 'event-management'
          },
          dependsOn: ['lessons-learned']
        }
      ]
    }
  }
}

// Register all workflow templates
export function registerWorkflowTemplates(): void {
  // Register CONCEPT phase workflows
  Object.values(EventLifecycleWorkflowTemplates.conceptPhaseWorkflows).forEach(workflow => {
    integrationOrchestrator.registerChain(workflow)
  })

  // Register DEVELOP phase workflows
  Object.values(EventLifecycleWorkflowTemplates.developPhaseWorkflows).forEach(workflow => {
    integrationOrchestrator.registerChain(workflow)
  })

  // Register ADVANCE phase workflows
  Object.values(EventLifecycleWorkflowTemplates.advancePhaseWorkflows).forEach(workflow => {
    integrationOrchestrator.registerChain(workflow)
  })

  // Register OPERATE phase workflows
  Object.values(EventLifecycleWorkflowTemplates.operatePhaseWorkflows).forEach(workflow => {
    integrationOrchestrator.registerChain(workflow)
  })

  // Register RECONCILE phase workflows
  Object.values(EventLifecycleWorkflowTemplates.reconcilePhaseWorkflows).forEach(workflow => {
    integrationOrchestrator.registerChain(workflow)
  })

  // Register ARCHIVE phase workflows
  Object.values(EventLifecycleWorkflowTemplates.archivePhaseWorkflows).forEach(workflow => {
    integrationOrchestrator.registerChain(workflow)
  })
}

// Workflow template utilities
export const WorkflowTemplateUtils = {
  // Get workflows for a specific phase
  getWorkflowsForPhase(phase: string): OrchestrationChain[] {
    const phaseMap = {
      concept: EventLifecycleWorkflowTemplates.conceptPhaseWorkflows,
      develop: EventLifecycleWorkflowTemplates.developPhaseWorkflows,
      advance: EventLifecycleWorkflowTemplates.advancePhaseWorkflows,
      operate: EventLifecycleWorkflowTemplates.operatePhaseWorkflows,
      reconcile: EventLifecycleWorkflowTemplates.reconcilePhaseWorkflows,
      archive: EventLifecycleWorkflowTemplates.archivePhaseWorkflows
    }

    const phaseWorkflows = phaseMap[phase as keyof typeof phaseMap]
    return phaseWorkflows ? Object.values(phaseWorkflows) : []
  },

  // Get all available workflow templates
  getAllWorkflowTemplates(): OrchestrationChain[] {
    const allWorkflows: OrchestrationChain[] = []

    Object.values(EventLifecycleWorkflowTemplates).forEach(phaseWorkflows => {
      Object.values(phaseWorkflows).forEach(workflow => {
        allWorkflows.push(workflow)
      })
    })

    return allWorkflows
  },

  // Create a custom workflow based on template
  createWorkflowFromTemplate(templateId: string, customizations: {
    organizationId: string
    name?: string
    description?: string
    customParameters?: Record<string, unknown>
  }): OrchestrationChain {
    // Find the template
    const template = WorkflowTemplateUtils.getAllWorkflowTemplates()
      .find(w => w.id === templateId)

    if (!template) {
      throw new Error(`Workflow template ${templateId} not found`)
    }

    // Create customized version
    const customWorkflow: OrchestrationChain = {
      ...template,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      organizationId: customizations.organizationId,
      name: customizations.name || template.name,
      description: customizations.description || template.description,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Apply custom parameters if provided
    if (customizations.customParameters) {
      customWorkflow.steps = customWorkflow.steps.map(step => ({
        ...step,
        parameters: { ...step.parameters, ...customizations.customParameters }
      }))
    }

    return customWorkflow
  },

  // Get workflow recommendations for specific use cases
  getWorkflowRecommendations(useCase: string): OrchestrationChain[] {
    const recommendations = {
      'event-planning': ['concept-market-research', 'concept-budget-planning'],
      'vendor-management': ['develop-vendor-procurement'],
      'marketing-campaign': ['develop-marketing-planning'],
      'technical-setup': ['advance-technical-setup', 'advance-team-coordination'],
      'live-operations': ['operate-real-time-monitoring'],
      'financial-closeout': ['reconcile-financial-closeout', 'reconcile-performance-analytics'],
      'documentation': ['archive-event-documentation']
    }

    const recommendedIds = recommendations[useCase as keyof typeof recommendations] || []
    return WorkflowTemplateUtils.getAllWorkflowTemplates()
      .filter(w => recommendedIds.includes(w.id))
  }
}

// Initialize workflow templates
registerWorkflowTemplates()
