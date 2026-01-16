import React, { useCallback } from 'react'
import { logger } from '@/lib/logger'
import { MultiStepWizard } from '@/components/forms/multi-step-wizard'

interface WizardStep {
  id: string
  title: string
  description: string
  component: () => React.JSX.Element
}

const IntakeAndTaxonomy = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Ingest content with canonical taxonomy, metadata, and ownership.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Content IDs, type (doc/image/video/audio/archive), title, description</li>
        <li>File metadata: name, size, mime, URLs, thumbnails</li>
        <li>Tags, categories, language, duration/pages/dimensions</li>
        <li>Owner, collaborators with roles, collection/library linkage</li>
        <li>Status lifecycle: draft/review/published/archived</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Required fields present; enums constrained</li>
        <li>Collections exist and permissions set</li>
        <li>Checksum or integrity fields stored if policy requires</li>
      </ul>
    </div>
  </div>
)

const VersioningAndDrafts = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Manage versions, revisions, and branching safely.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Version numbers, change summaries, authorship</li>
        <li>Diffs or lineage references; attachments</li>
        <li>Locks or check-out status to avoid conflicts</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Branch/merge rules; only one active lock per item</li>
        <li>Published versions immutable; drafts isolated</li>
      </ul>
    </div>
  </div>
)

const ReviewAndApprovals = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Run structured reviews and approvals with auditability.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Reviewers, steps, due dates, decisions, comments</li>
        <li>Workflow linkage; status transitions; timestamps</li>
        <li>Attachments/annotations for feedback</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>All required approvers sign off before publish</li>
        <li>Audit log for decisions and changes</li>
      </ul>
    </div>
  </div>
)

const PublishingAndDistribution = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Publish to channels with correct permissions and variants.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Target channels, formats/variants, locales</li>
        <li>Schedules/embargoes, expiry dates</li>
        <li>CDN paths, public vs internal visibility</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Permissions match channel; PII-safe for public</li>
        <li>Publishing only from approved version; rollback plan</li>
      </ul>
    </div>
  </div>
)

const AccessAndPermissions = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Enforce RBAC and sharing for collections and items.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Collection permissions (private/team/org/public)</li>
        <li>Per-item roles (owner/editor/viewer)</li>
        <li>Share links with expiry/scope when allowed</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Least-privilege enforced; audit for sharing events</li>
        <li>Revocation and expiry behaviors verified</li>
      </ul>
    </div>
  </div>
)

const LocalizationAndVariants = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Manage localized and format variants of content.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Locale codes, variant types (text/media), relationships to source</li>
        <li>Translation status, QA, approvals per locale</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Source-of-truth linkage to canonical item/version</li>
        <li>Locale-specific compliance checks</li>
      </ul>
    </div>
  </div>
)

const ArchivalAndRetention = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Archive and retain content per policy and legal holds.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Retention policies, legal holds, archive locations</li>
        <li>Metadata for retrieval and chain of custody</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Content not deleted while on hold; archive completeness</li>
        <li>Expiry triggers reviewed before purge</li>
      </ul>
    </div>
  </div>
)

const AnalyticsAndFeedback = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Track performance and feedback to inform iterations.</p>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Data</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Views/engagement, conversions, retention by channel</li>
        <li>Feedback and issues; requests for changes</li>
      </ul>
    </div>
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">Validation</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Data lineage/tracking IDs; privacy-compliant analytics</li>
        <li>Feedback routed into backlog or revision workflow</li>
      </ul>
    </div>
  </div>
)

const contentSteps: WizardStep[] = [
  { id: 'intake', title: 'Intake & Taxonomy', description: 'Ingest content with canonical metadata and ownership', component: IntakeAndTaxonomy },
  { id: 'versioning', title: 'Versioning & Drafts', description: 'Manage revisions, locks, and lineage', component: VersioningAndDrafts },
  { id: 'approvals', title: 'Review & Approvals', description: 'Structured reviews with auditability', component: ReviewAndApprovals },
  { id: 'publishing', title: 'Publishing & Distribution', description: 'Publish to channels with correct permissions', component: PublishingAndDistribution },
  { id: 'access', title: 'Access & Permissions', description: 'RBAC and sharing for collections/items', component: AccessAndPermissions },
  { id: 'localization', title: 'Localization & Variants', description: 'Manage locales and format variants', component: LocalizationAndVariants },
  { id: 'archival', title: 'Archival & Retention', description: 'Archive/retain per policy and legal holds', component: ArchivalAndRetention },
  { id: 'analytics', title: 'Analytics & Feedback', description: 'Track performance and route feedback', component: AnalyticsAndFeedback }
]

const handleWizardComplete = useCallback((finalData: Record<string, unknown>) => {
  logger.info('Content management workflow completed', { data: finalData })
}, [])

export function ContentManagementWorkflow() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Content Management Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Manage content intake, versioning, approvals, publishing, access, localization, archival, and analytics.
          </p>
        </div>

        <MultiStepWizard
          steps={contentSteps}
          onComplete={handleWizardComplete}
          initialData={{}}
          className="max-w-6xl mx-auto"
        />
      </div>
    </div>
  )
}

export default ContentManagementWorkflow
