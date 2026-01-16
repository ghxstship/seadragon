import React, { useCallback } from 'react'
import { logger } from '@/lib/logger'
import { MultiStepWizard } from '@/components/forms/multi-step-wizard'

interface WizardStep {
  id: string
  title: string
  description: string
  component: () => React.JSX.Element
}

const JobAnalysisAndPlanning = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Align the project manning requirement with the standardized role taxonomy and 3NF fields.
    </p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Canonical fields to capture</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Link to project and organization (immutable foreign keys)</li>
        <li>Role taxonomy reference (responsibilities, emergency duties, qualifications, required certifications)</li>
        <li>Location, start/end dates, engagement type, classification, payment structure, payment terms</li>
        <li>Travel, accommodations, per diem, and any provided logistics</li>
        <li>Quantity required with availability window and emergency responsibilities mapping</li>
        <li>Public-safe job description and prerequisites</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Readiness checklist</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>All fields reference canonical objects (no free text for controlled enums)</li>
        <li>Capacity defined (quantity_required) and audit metadata present</li>
        <li>Emergency duties aligned with the project safety plan</li>
      </ul>
    </div>
  </div>
)

const InternalReviewAndApproval = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Validate compliance before posting: completeness, policy conformance, and RBAC approvals.
    </p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation gates</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Role taxonomy attached and frozen for this revision</li>
        <li>Dates valid; engagement type and classification allowed for the org</li>
        <li>Payment terms and structure conform to policy</li>
        <li>Travel/accommodation/per diem flags match project logistics</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Approval path</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Org/project approver signs off; audit entry recorded</li>
        <li>Status transitions Draft → Reviewed → Approved</li>
        <li>Ready for public exposure only after Approved</li>
      </ul>
    </div>
  </div>
)

const PublicPosting = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Publish a public-safe listing that stays linked to the originating project and organization.
    </p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Public exposure rules</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Use derived listing slug and ID tied to the manning requirement</li>
        <li>Expose: role title, location, dates, engagement type, classification, payment terms (if allowed), logistics flags</li>
        <li>Hide: internal rates, internal notes, reviewer comments, PII</li>
        <li>Auto-close when remaining openings reach zero; reopen on cancellations</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Distribution</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Publish to platform job board and external federated boards via feeds/webhooks</li>
        <li>Track source attribution for inbound applications</li>
      </ul>
    </div>
  </div>
)

const ApplicationIntake = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Capture applicants and normalize them to canonical person records with role-aligned profiles.
    </p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Intake requirements</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Application links to listing_id and requirement_id</li>
        <li>De-duplicate or attach to existing person and person_profile_role</li>
        <li>Pre-screen on availability window, required certifications, location constraints</li>
        <li>Log communication: application_received notification</li>
      </ul>
    </div>
  </div>
)

const EvaluationAndInterviews = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Structured evaluation with scoring, comments, and auditability.
    </p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Evaluation flow</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Status transitions: applied → shortlisted → interview → offer/reject</li>
        <li>Scoring dimensions: taxonomy fit, certifications, availability, prior performance, logistics readiness</li>
        <li>Reviewer comments stored internally; no public leakage</li>
        <li>Interview scheduling triggers communication templates</li>
      </ul>
    </div>
  </div>
)

const OffersAndOnboarding = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Convert offers to hires and execute onboarding tasks tied to project access and compliance.
    </p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Offer handling</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Offer references classification, payment terms, start date, and engagement type</li>
        <li>Audit acceptance; decrement remaining openings on hire</li>
        <li>Send offer_sent and offer_accepted communications</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Onboarding</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Tasks: credentials, compliance docs, safety/emergency duties acknowledgement</li>
        <li>Provision project access control and schedule assignment</li>
        <li>Sync to payroll/HR if applicable; mark application as active</li>
      </ul>
    </div>
  </div>
)

const recruitmentPhaseSteps: WizardStep[] = [
  {
    id: 'job-analysis',
    title: 'Job Analysis & Planning',
    description: 'Create project-linked, taxonomy-aligned requirements',
    component: JobAnalysisAndPlanning
  },
  {
    id: 'internal-review',
    title: 'Internal Review & Approval',
    description: 'Validate compliance and secure approvals before publishing',
    component: InternalReviewAndApproval
  },
  {
    id: 'public-posting',
    title: 'Public Posting',
    description: 'Publish a public-safe listing tied to the manning requirement',
    component: PublicPosting
  },
  {
    id: 'application-intake',
    title: 'Application Intake',
    description: 'Capture and normalize applicants into canonical person records',
    component: ApplicationIntake
  },
  {
    id: 'evaluation',
    title: 'Evaluation & Interviews',
    description: 'Shortlist, score, and run interviews with auditability',
    component: EvaluationAndInterviews
  },
  {
    id: 'offers-onboarding',
    title: 'Offers & Onboarding',
    description: 'Convert offers to hires and complete onboarding tasks',
    component: OffersAndOnboarding
  }
]

export default function RecruitmentWorkflow() {
  const handleWizardComplete = useCallback((finalData: Record<string, unknown>) => {
    logger.info('Recruitment phase completed', { data: finalData })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Recruitment Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Manage the complete recruitment process from job analysis to onboarding
          </p>
        </div>

        <MultiStepWizard
          steps={recruitmentPhaseSteps}
          onComplete={handleWizardComplete}
          initialData={{}}
          className="max-w-6xl mx-auto"/>
      </div>
    </div>
  )
}
