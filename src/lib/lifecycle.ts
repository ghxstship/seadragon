
// Lifecycle management for event production phases
export const LIFECYCLE_PHASES = {
  CONCEPT: {
    name: 'Concept',
    description: 'Initial ideation, feasibility, stakeholder buy-in',
    duration: '2-8 weeks',
    tier1Access: true,
    tier2Access: false,
    tier3Access: false,
    workflows: [
      'Ideation & Brainstorming',
      'Market Research',
      'Competitive Analysis',
      'Feasibility Study',
      'Initial Budget Estimation',
      'Stakeholder Presentation',
      'Go/No-Go Decision',
      'Initial Timeline Creation',
      'Team Assembly Planning'
    ]
  },
  DEVELOP: {
    name: 'Develop',
    description: 'Planning, budgeting, vendor selection, contracts',
    duration: '4-16 weeks',
    tier1Access: true,
    tier2Access: true,
    tier3Access: false,
    workflows: [
      'Detailed Budget Creation',
      'Revenue Projections',
      'Sponsorship Strategy',
      'Vendor RFP Process',
      'Contract Negotiation',
      'Permit Applications',
      'Insurance Procurement',
      'Venue Selection/Booking',
      'Talent Booking',
      'Marketing Strategy',
      'Ticketing Strategy',
      'Technology Planning',
      'Safety Planning',
      'Accessibility Planning'
    ]
  },
  ADVANCE: {
    name: 'Advance',
    description: 'Detailed production planning, advancing, logistics',
    duration: '4-12 weeks',
    tier1Access: true,
    tier2Access: true,
    tier3Access: true,
    workflows: [
      'Production Advancing',
      'Technical Rider Review',
      'Input Lists',
      'Stage Plots',
      'Lighting Plots',
      'Video/LED Layouts',
      'Power Requirements',
      'Logistics Advancing',
      'Load-in Schedules',
      'Parking Assignments',
      'Credential Distribution',
      'Transportation Coordination',
      'Vendor Coordination',
      'Equipment Orders',
      'Rental Confirmations',
      'Hotel/Travel Booking',
      'Catering Planning',
      'Security Planning',
      'Medical Planning',
      'Communication Planning',
      'Contingency Planning'
    ]
  },
  SCHEDULE: {
    name: 'Schedule',
    description: 'Final scheduling, assignments, confirmations',
    duration: '2-4 weeks',
    tier1Access: true,
    tier2Access: true,
    tier3Access: true,
    workflows: [
      'Master Schedule Finalization',
      'Department Schedules',
      'Staff Assignments',
      'Credential Production',
      'Communication Distribution',
      'Final Confirmations',
      'Weather Monitoring',
      'Final Safety Briefings',
      'Document Distribution'
    ]
  },
  BUILD: {
    name: 'Build',
    description: 'Physical setup, load-in, installation',
    duration: '1-14 days',
    tier1Access: true,
    tier2Access: true,
    tier3Access: true,
    workflows: [
      'Site Preparation',
      'Infrastructure Setup',
      'Stage Construction',
      'Equipment Load-in',
      'System Installation',
      'Testing & Focus',
      'Scenic Installation',
      'Signage Installation',
      'Vendor Setup',
      'Safety Inspections'
    ]
  },
  TRAIN: {
    name: 'Train',
    description: 'Briefings, rehearsals, run-throughs',
    duration: '1-3 days',
    tier1Access: true,
    tier2Access: true,
    tier3Access: true,
    workflows: [
      'All-Hands Briefing',
      'Department Briefings',
      'Safety Training',
      'Technical Rehearsals',
      'Sound Checks',
      'Lighting Cues',
      'Run-of-Show Review',
      'Emergency Procedures',
      'Communication Testing'
    ]
  },
  OPERATE: {
    name: 'Operate',
    description: 'Live event execution',
    duration: 'Event duration',
    tier1Access: true,
    tier2Access: true,
    tier3Access: true,
    workflows: [
      'Doors/Gates Opening',
      'Show Execution',
      'Real-time Coordination',
      'Issue Resolution',
      'Communication Management',
      'Schedule Adherence',
      'Safety Monitoring',
      'Weather Monitoring',
      'Documentation'
    ]
  },
  EXPERIENCE: {
    name: 'Experience',
    description: 'Active guest/attendee engagement',
    duration: 'Event duration',
    tier1Access: true,
    tier2Access: true,
    tier3Access: true,
    workflows: [
      'Guest Services',
      'VIP Management',
      'Activation Operations',
      'Entertainment Coordination',
      'Food & Beverage Service',
      'Retail Operations',
      'Social Media Coverage',
      'Photography/Video',
      'Guest Feedback Collection'
    ]
  },
  STRIKE: {
    name: 'Strike',
    description: 'Tear-down, load-out, equipment return',
    duration: '1-7 days',
    tier1Access: true,
    tier2Access: true,
    tier3Access: true,
    workflows: [
      'Equipment Tear-down',
      'Load-out Coordination',
      'Equipment Returns',
      'Site Restoration',
      'Waste Removal',
      'Final Inspections',
      'Lost & Found Management',
      'Post-Event Security'
    ]
  },
  RECONCILE: {
    name: 'Reconcile',
    description: 'Financial closeout, settlements, reviews',
    duration: '2-8 weeks',
    tier1Access: false,
    tier2Access: true,
    tier3Access: true,
    workflows: [
      'Invoice Processing',
      'Vendor Settlements',
      'Artist Settlements',
      'Expense Reconciliation',
      'Budget vs. Actual Analysis',
      'P&L Statement',
      'Tax Documentation',
      'Insurance Claims',
      'Refund Processing'
    ]
  },
  ARCHIVE: {
    name: 'Archive',
    description: 'Documentation, lessons learned, storage',
    duration: '2-4 weeks',
    tier1Access: true,
    tier2Access: false,
    tier3Access: false,
    workflows: [
      'Document Organization',
      'Photo/Video Archive',
      'Lessons Learned Session',
      'Post-Mortem Report',
      'Template Creation',
      'Best Practice Documentation',
      'Contact Database Update',
      'Knowledge Base Update'
    ]
  }
}

export const PHASE_ORDER = Object.keys(LIFECYCLE_PHASES)

export function getPhaseInfo(phase: string) {
  return LIFECYCLE_PHASES[phase as keyof typeof LIFECYCLE_PHASES]
}

export function getNextPhase(currentPhase: string) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase)
  if (currentIndex === -1 || currentIndex === PHASE_ORDER.length - 1) {
    return null
  }
  return PHASE_ORDER[currentIndex + 1]
}

export function getPreviousPhase(currentPhase: string) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase)
  if (currentIndex <= 0) {
    return null
  }
  return PHASE_ORDER[currentIndex - 1]
}

export function canAccessPhase(phase: string, userTier: number) {
  const phaseInfo = getPhaseInfo(phase)
  if (!phaseInfo) return false

  if (userTier === 1) return phaseInfo.tier1Access
  if (userTier === 2) return phaseInfo.tier2Access
  if (userTier === 3) return phaseInfo.tier3Access

  return false
}

export function getPhaseWorkflows(phase: string) {
  const phaseInfo = getPhaseInfo(phase)
  return phaseInfo?.workflows || []
}

// Helper to determine user tier based on role
export function getUserTier(role: string): number {
  const executiveRoles = ['executive', 'ceo', 'coo', 'cfo', 'cmo', 'cto']
  const strategicRoles = ['director', 'manager', 'lead', 'head']
  const operationalRoles = ['coordinator', 'specialist', 'technician', 'assistant']

  if (executiveRoles.some(r => role.toLowerCase().includes(r))) return 1
  if (strategicRoles.some(r => role.toLowerCase().includes(r))) return 2
  return 3 // Default to operational/tier 3
}
