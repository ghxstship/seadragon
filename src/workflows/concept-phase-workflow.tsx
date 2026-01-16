import React, { useCallback } from 'react'
import { logger } from '@/lib/logger'
import { MultiStepWizard } from '@/components/forms/multi-step-wizard'

interface WizardStep {
  id: string
  title: string
  description: string
  component: () => React.JSX.Element
}

const VisionAndObjectives = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Capture vision, goals, and north stars for the concept.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Vision statement, goals, success measures</li>
        <li>Target audience and needs</li>
        <li>Constraints and assumptions</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Goals measurable; audience defined</li>
        <li>Assumptions recorded for validation later</li>
      </ul>
    </div>
  </div>
)

const IdeationAndOptions = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Generate and compare concept options.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Concept options with brief descriptions</li>
        <li>Pros/cons, risks, and resource implications</li>
        <li>Rough order of magnitude estimates</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Shortlist aligns to vision/goals</li>
        <li>Risks captured; feasibility noted</li>
      </ul>
    </div>
  </div>
)

const FeasibilityAndRisks = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Assess feasibility across technical, ops, budget, and timeline.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Feasibility notes by dimension; dependencies</li>
        <li>Risk register with likelihood/impact</li>
        <li>Mitigations and assumptions to validate</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Critical risks mitigated/accepted with rationale</li>
        <li>Feasibility approved by stakeholders</li>
      </ul>
    </div>
  </div>
)

const OptionSelection = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Select the preferred concept option with rationale.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Decision criteria, scoring, and selected option</li>
        <li>Stakeholder approvals</li>
        <li>Notes for next phases</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Decision documented; rationale clear</li>
        <li>Approvals recorded with actors/timestamps</li>
      </ul>
    </div>
  </div>
)

const ConceptHandoff = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Prepare handoff to planning/advance phases.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Selected concept, goals, risks, assumptions</li>
        <li>Artifacts: briefs, sketches, references</li>
        <li>Open questions and validation items</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Handoff sign-off captured</li>
        <li>Readiness to enter advance/plan confirmed</li>
      </ul>
    </div>
  </div>
)

const conceptSteps: WizardStep[] = [
  { id: 'vision', title: 'Vision & Objectives', description: 'Goals, success measures, audience', component: VisionAndObjectives },
  { id: 'ideation', title: 'Ideation & Options', description: 'Generate options and compare', component: IdeationAndOptions },
  { id: 'feasibility', title: 'Feasibility & Risks', description: 'Assess feasibility and risks', component: FeasibilityAndRisks },
  { id: 'selection', title: 'Option Selection', description: 'Select option with criteria and approvals', component: OptionSelection },
  { id: 'handoff', title: 'Concept Handoff', description: 'Prepare artifacts and sign-off for next phase', component: ConceptHandoff }
]

export function ConceptPhaseWorkflow() {
  const handleWizardComplete = useCallback((finalData: Record<string, unknown>) => {
    logger.info('Concept phase completed', { data: finalData })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Concept Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Define vision, explore options, assess feasibility, decide, and hand off to planning.
          </p>
        </div>

        <MultiStepWizard
          steps={conceptSteps}
          onComplete={handleWizardComplete}
          initialData={{}}
          className="max-w-6xl mx-auto"
        />
      </div>
    </div>
  )
}

export default ConceptPhaseWorkflow
