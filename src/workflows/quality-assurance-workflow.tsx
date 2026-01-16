import React, { useCallback } from 'react'
import { logger } from '@/lib/logger'
import { MultiStepWizard } from '@/components/forms/multi-step-wizard'

interface WizardStep {
  id: string
  title: string
  description: string
  component: () => React.JSX.Element
}

const TestPlanning = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Define scope, strategy, environments, and entry/exit criteria.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Test plan, scope, features under test, non-functional targets</li>
        <li>Test types (functional, integration, performance, security, UAT)</li>
        <li>Environments, test data, tools, and entry/exit criteria</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Scope approved; risks identified; data and envs ready</li>
        <li>Traceability to requirements/user stories</li>
      </ul>
    </div>
  </div>
)

const TestExecution = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Run tests, capture results, and maintain traceability.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Test cases, steps, expected vs actual, evidence</li>
        <li>Automation runs, build IDs, environment, data set</li>
        <li>Pass/fail with timestamps and executor</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>All planned coverage executed; blockers escalated</li>
        <li>Results linked to requirements and defects</li>
      </ul>
    </div>
  </div>
)

const DefectTriage = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Log, classify, and prioritize defects with ownership.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Defect ID, severity, priority, repro steps, environment, build</li>
        <li>Owner/assignee, component, tags, attachments</li>
        <li>Status workflow: new → triaged → in progress → fixed → verified → closed</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Sev/Pri aligned to policy; duplicates avoided; SLA timers tracked</li>
        <li>Link defects to tests and requirements for traceability</li>
      </ul>
    </div>
  </div>
)

const RetestAndRegression = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Retest fixes and run regression to catch side effects.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Linked defects under retest, builds, environments</li>
        <li>Regression suite selection and execution results</li>
        <li>Automation reruns and flakiness tracking</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>All fixed defects verified; no critical regressions</li>
        <li>Flaky tests quarantined and tracked</li>
      </ul>
    </div>
  </div>
)

const SignoffAndRelease = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Apply exit criteria and sign off before release.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Exit criteria: coverage, open defects thresholds, performance/security gates</li>
        <li>Approvers, sign-off records, release notes</li>
        <li>Go/no-go decisions with rationale</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Exit criteria met; critical issues resolved or waived with approval</li>
        <li>Sign-offs captured; release artifacts finalized</li>
      </ul>
    </div>
  </div>
)

const ReportingAndMetrics = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Report quality metrics and feed improvements.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Defect trends, DRE, MTTR, coverage, pass rates</li>
        <li>Escaped defects and RCA; flakiness stats</li>
        <li>Action items for process/tooling improvements</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Metrics sourced from authoritative systems; RCA tracked to closure</li>
        <li>Improvements prioritized and owned</li>
      </ul>
    </div>
  </div>
)

const qaSteps: WizardStep[] = [
  { id: 'planning', title: 'Test Planning', description: 'Scope, strategy, environments, entry/exit', component: TestPlanning },
  { id: 'execution', title: 'Test Execution', description: 'Run tests with traceability and evidence', component: TestExecution },
  { id: 'defects', title: 'Defect Triage', description: 'Log, classify, and prioritize defects', component: DefectTriage },
  { id: 'retest', title: 'Retest & Regression', description: 'Verify fixes and run regression', component: RetestAndRegression },
  { id: 'signoff', title: 'Sign-off & Release', description: 'Apply exit criteria and approve release', component: SignoffAndRelease },
  { id: 'reporting', title: 'Reporting & Metrics', description: 'Quality metrics, RCA, and improvements', component: ReportingAndMetrics }
]

const handleWizardComplete = useCallback((finalData: Record<string, unknown>) => {
  logger.info('Quality assurance workflow completed', { data: finalData })
}, [])

export function QualityAssuranceWorkflow() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quality Assurance Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Plan, execute, triage, retest, sign off, and report with full auditability.
          </p>
        </div>

        <MultiStepWizard
          steps={qaSteps}
          onComplete={handleWizardComplete}
          initialData={{}}
          className="max-w-6xl mx-auto"
        />
      </div>
    </div>
  )
}

export default QualityAssuranceWorkflow
