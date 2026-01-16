import React, { useCallback } from 'react'
import { logger } from '@/lib/logger'
import { MultiStepWizard } from '@/components/forms/multi-step-wizard'

interface WizardStep {
  id: string
  title: string
  description: string
  component: () => React.JSX.Element
}

const RunbooksAndOncall = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Finalize runbooks and on-call rotations for live operations.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Runbooks (SOPs), playbooks for incidents, contact trees</li>
        <li>On-call schedules, escalation paths, ownership per system</li>
        <li>Environment/service inventory and health checks</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Runbooks approved; on-call coverage complete</li>
        <li>Escalations tested; monitoring/alerts wired</li>
      </ul>
    </div>
  </div>
)

const GoLiveReadiness = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Confirm go-live gates across technical and operational readiness.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Checklist: performance, security, backups, access controls</li>
        <li>Capacity plans, load test results, DR/backup verification</li>
        <li>Approvals for go/no-go stakeholders</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>All gates passed; waivers documented and approved</li>
        <li>Roll-forward/back plans documented</li>
      </ul>
    </div>
  </div>
)

const LiveOperations = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Operate the event/system with monitoring and incident handling.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Monitoring dashboards, alert rules, SLO/SLA targets</li>
        <li>Incident playbooks, comms templates, stakeholder updates</li>
        <li>Access control and change windows</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Alerts tested; paging working; comms channels ready</li>
        <li>Change freeze rules enforced where applicable</li>
      </ul>
    </div>
  </div>
)

const IncidentManagement = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Respond to incidents with triage, comms, and resolution tracking.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Incident tickets: severity, status, commander, scribe</li>
        <li>Timeline of events, actions, decisions</li>
        <li>Customer/internal comms, status pages</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>SLAs for response/resolve met; comms sent</li>
        <li>Mitigations applied; follow-ups created</li>
      </ul>
    </div>
  </div>
)

const PostEventReview = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Run post-event/post-incident reviews and feed improvements.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Postmortems with root cause, contributing factors, action items</li>
        <li>Metrics: SLAs, SLO attainment, incident counts</li>
        <li>Customer feedback and sentiment</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Action items tracked and owned with due dates</li>
        <li>Learnings fed into runbooks and future readiness</li>
      </ul>
    </div>
  </div>
)

const operateSteps: WizardStep[] = [
  { id: 'runbooks', title: 'Runbooks & On-call', description: 'SOPs, on-call, and escalation readiness', component: RunbooksAndOncall },
  { id: 'golive', title: 'Go-live Readiness', description: 'Gates for performance, security, DR, and approvals', component: GoLiveReadiness },
  { id: 'live', title: 'Live Operations', description: 'Monitoring, alerting, and operational comms', component: LiveOperations },
  { id: 'incidents', title: 'Incident Management', description: 'Triage, comms, and resolution tracking', component: IncidentManagement },
  { id: 'post', title: 'Post-Event Review', description: 'Postmortems, action items, and improvements', component: PostEventReview }
]

const handleWizardComplete = useCallback((finalData: Record<string, unknown>) => {
  logger.info('Operate phase completed', { data: finalData })
}, [])

export default function OperatePhaseWorkflow() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Operate Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Runbooks, readiness, live ops, incident handling, and post-event improvements with auditability.
          </p>
        </div>

        <MultiStepWizard
          steps={operateSteps}
          onComplete={handleWizardComplete}
          initialData={{}}
          className="max-w-6xl mx-auto"
        />
      </div>
    </div>
  )
}
