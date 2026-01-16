"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, type DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { MultiStepWizard, type StepProps } from '@/components/forms/multi-step-wizard'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type ContentFormValues = z.infer<typeof contentSchema>
type DatabaseFormValues = z.infer<typeof databaseSchema>
type MediaFormValues = z.infer<typeof mediaSchema>
type StorageFormValues = z.infer<typeof storageSchema>
type RegulationFormValues = z.infer<typeof regulationSchema>
type ClassificationFormValues = z.infer<typeof classificationSchema>
type AuditFormValues = z.infer<typeof auditSchema>
type CleanupTempFormValues = z.infer<typeof cleanupTempSchema>
type CleanupDupFormValues = z.infer<typeof cleanupDupSchema>
type CleanupObsoleteFormValues = z.infer<typeof cleanupObsoleteSchema>
type CleanupVerificationFormValues = z.infer<typeof cleanupVerificationSchema>
type OrgStructureFormValues = z.infer<typeof orgStructureSchema>
type OrgIndexFormValues = z.infer<typeof orgIndexSchema>
type MetadataFormValues = z.infer<typeof metadataSchema>
type PermissionsFormValues = z.infer<typeof permissionsSchema>
type AuditLogFormValues = z.infer<typeof auditLogSchema>
type EncryptionFormValues = z.infer<typeof encryptionSchema>
type VerificationCompletenessFormValues = z.infer<typeof verificationCompletenessSchema>
type VerificationIntegrityFormValues = z.infer<typeof verificationIntegritySchema>
type VerificationAccessibilityFormValues = z.infer<typeof verificationAccessibilitySchema>

type ArchiveWizardData = {
  content?: ContentFormValues
  database?: DatabaseFormValues
  media?: MediaFormValues
  storage?: StorageFormValues
  regulation?: RegulationFormValues
  classification?: ClassificationFormValues
  audit?: AuditFormValues
  cleanupTemp?: CleanupTempFormValues
  cleanupDup?: CleanupDupFormValues
  cleanupObsolete?: CleanupObsoleteFormValues
  cleanupVerification?: CleanupVerificationFormValues
  orgStructure?: OrgStructureFormValues
  orgIndex?: OrgIndexFormValues
  metadata?: MetadataFormValues
  permissions?: PermissionsFormValues
  auditLog?: AuditLogFormValues
  encryption?: EncryptionFormValues
  verificationCompleteness?: VerificationCompletenessFormValues
  verificationIntegrity?: VerificationIntegrityFormValues
  verificationAccessibility?: VerificationAccessibilityFormValues
}

const contentSchema = z.object({
  contentType: z.string().min(1),
  location: z.string().optional(),
  sizeBytes: z.coerce.number().int().nonnegative().optional(),
  format: z.string().optional(),
  archived: z.boolean().default(false),
  backup: z.boolean().default(false)
})

const databaseSchema = z.object({
  databaseName: z.string().min(1),
  recordCount: z.coerce.number().int().nonnegative().optional(),
  sizeBytes: z.coerce.number().int().nonnegative().optional(),
  archived: z.boolean().default(false),
  retentionPeriod: z.string().optional()
})

const mediaSchema = z.object({
  mediaType: z.string().min(1),
  fileCount: z.coerce.number().int().nonnegative().optional(),
  totalSizeBytes: z.coerce.number().int().nonnegative().optional(),
  storageLocation: z.string().optional(),
  archived: z.boolean().default(false)
})

const storageSchema = z.object({
  storageType: z.enum(['primary', 'backup', 'disaster_recovery']),
  provider: z.string().min(1),
  location: z.string().optional(),
  redundancy: z.string().optional(),
  accessTime: z.string().optional(),
  costPerMonth: z.coerce.number().nonnegative().optional(),
  frequency: z.string().optional(),
  lastBackup: z.string().optional(),
  verified: z.boolean().default(false),
  plan: z.string().optional(),
  testedAt: z.string().optional(),
  rto: z.string().optional(),
  rpo: z.string().optional(),
  drStatus: z.enum(['current', 'outdated', 'testing']).default('current')
})

const regulationSchema = z.object({
  regulation: z.string().min(1),
  applicable: z.boolean().default(false),
  retentionPeriod: z.string().optional(),
  requirements: z.string().optional(),
  complianceStatus: z.enum(['compliant', 'review', 'non-compliant']).default('compliant')
})

const classificationSchema = z.object({
  category: z.string().min(1),
  sensitivity: z.enum(['public', 'internal', 'confidential', 'restricted']).default('internal'),
  retention: z.string().optional(),
  disposalMethod: z.string().optional(),
  accessLevels: z.string().optional()
})

const auditSchema = z.object({
  auditType: z.string().min(1),
  lastAudit: z.string().optional(),
  nextAudit: z.string().optional(),
  status: z.enum(['passed', 'issues', 'pending']).default('pending'),
  findings: z.string().optional()
})

const cleanupTempSchema = z.object({
  location: z.string().min(1),
  fileCount: z.coerce.number().int().nonnegative().optional(),
  sizeBytes: z.coerce.number().int().nonnegative().optional(),
  ageCriteria: z.string().optional(),
  deleted: z.boolean().default(false),
  cleanupDate: z.string().optional()
})

const cleanupDupSchema = z.object({
  contentType: z.string().min(1),
  duplicateCount: z.coerce.number().int().nonnegative().optional(),
  sizeBytes: z.coerce.number().int().nonnegative().optional(),
  resolution: z.enum(['merged', 'deleted', 'pending']).default('pending'),
  cleanupDate: z.string().optional()
})

const cleanupObsoleteSchema = z.object({
  category: z.string().min(1),
  recordCount: z.coerce.number().int().nonnegative().optional(),
  lastAccessed: z.string().optional(),
  retentionMet: z.boolean().default(false),
  scheduledDeletion: z.string().optional()
})

const cleanupVerificationSchema = z.object({
  checksumsEnabled: z.boolean().default(false),
  integrityStatus: z.enum(['verified', 'issues', 'pending']).default('pending'),
  lastCheck: z.string().optional(),
  issuesFound: z.string().optional()
})

const orgStructureSchema = z.object({
  category: z.string().min(1),
  subcategories: z.string().optional(),
  namingConvention: z.string().optional(),
  accessLevels: z.string().optional()
})

const orgIndexSchema = z.object({
  indexType: z.string().min(1),
  fieldsIndexed: z.string().optional(),
  searchable: z.boolean().default(false),
  lastUpdated: z.string().optional()
})

const metadataSchema = z.object({
  fileName: z.string().min(1),
  tags: z.string().optional(),
  description: z.string().optional(),
  createdDate: z.string().optional(),
  modifiedDate: z.string().optional()
})

const permissionsSchema = z.object({
  roleName: z.string().min(1),
  usersList: z.string().optional(),
  accessPermissions: z.string().optional(),
  accessRestrictions: z.string().optional()
})

const auditLogSchema = z.object({
  userName: z.string().min(1),
  actionPerformed: z.string().min(1),
  resourceAccessed: z.string().optional(),
  actionTimestamp: z.string().optional(),
  ipAddress: z.string().optional()
})

const encryptionSchema = z.object({
  encryptionMethod: z.string().min(1),
  keyManagement: z.string().optional(),
  rotationPolicy: z.string().optional(),
  complianceStatus: z.enum(['compliant', 'review', 'non-compliant']).default('compliant')
})

const verificationCompletenessSchema = z.object({
  category: z.string().min(1),
  requiredItems: z.string().optional(),
  presentItems: z.string().optional(),
  missingItems: z.string().optional(),
  verificationStatus: z.enum(['complete', 'incomplete', 'verified']).default('incomplete'),
  verifiedAt: z.string().optional()
})

const verificationIntegritySchema = z.object({
  component: z.string().min(1),
  testPerformed: z.string().optional(),
  testResult: z.enum(['passed', 'failed', 'warning']).default('passed'),
  testDetails: z.string().optional(),
  verifiedAt: z.string().optional()
})

const verificationAccessibilitySchema = z.object({
  archiveLocation: z.string().min(1),
  testPerformed: z.string().optional(),
  testResult: z.enum(['accessible', 'issues', 'inaccessible']).default('accessible'),
  resolutionNotes: z.string().optional(),
  verifiedAt: z.string().optional()
})

const parseCsv = (value?: string) =>
  value ? value.split(',').map((v) => v.trim()).filter((v) => v.length > 0) : null

function simpleInput(label: string, name: keyof any, form: any, type?: string) {
  return (
    <FormField
      control={form.control}
      name={name as never}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function simpleTextarea(label: string, name: keyof any, form: any, rows = 3) {
  return (
    <FormField
      control={form.control}
      name={name as never}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea rows={rows} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema
  dataKey: keyof ArchiveWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as ArchiveWizardData)[opts.dataKey] as T | undefined
    const form = useForm<T>({
      resolver: zodResolver(opts.schema),
      defaultValues: (existing ?? opts.defaults) as DefaultValues<T>
    })

    useEffect(() => {
      const subscription = form.watch((values) => {
        onChange({ ...data, [opts.dataKey]: values })
        onValidationChange?.(form.formState.isValid)
      })
      return () => {
        if (typeof subscription === 'object' && subscription && 'unsubscribe' in subscription) {
          ;(subscription as { unsubscribe: () => void }).unsubscribe()
        }
      }
    }, [form, data, onChange, onValidationChange])

    return (
      <Form {...form}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">{opts.render(form)}</form>
      </Form>
    )
  }
}

const DataArchivingStep = createStep<ContentFormValues & DatabaseFormValues & MediaFormValues>({
  schema: contentSchema.merge(databaseSchema).merge(mediaSchema),
  dataKey: 'content',
  defaults: {
    contentType: '',
    archived: false,
    backup: false,
    databaseName: '',
    archived_1: undefined,
    mediaType: '',
    archived_2: undefined
  } as unknown as ContentFormValues & DatabaseFormValues & MediaFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Content</div>
      {simpleInput('Content Type', 'contentType', form)}
      {simpleInput('Location', 'location', form)}
      {simpleInput('Size (bytes)', 'sizeBytes', form, 'number')}
      {simpleInput('Format', 'format', form)}
      <FormField control={form.control} name={'archived' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Archived</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      <FormField control={form.control} name={'backup' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Backup</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>

      <div className="md:col-span-2 text-sm font-semibold mt-2">Database</div>
      {simpleInput('Database Name', 'databaseName', form)}
      {simpleInput('Record Count', 'recordCount', form, 'number')}
      {simpleInput('Size (bytes)', 'sizeBytes', form, 'number')}
      <FormField control={form.control} name={'archived' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Archived (DB)</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleInput('Retention Period', 'retentionPeriod', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Media</div>
      {simpleInput('Media Type', 'mediaType', form)}
      {simpleInput('File Count', 'fileCount', form, 'number')}
      {simpleInput('Total Size (bytes)', 'totalSizeBytes', form, 'number')}
      {simpleInput('Storage Location', 'storageLocation', form)}
      <FormField control={form.control} name={'archived' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Archived (Media)</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
    </>
  )
})

const StorageStep = createStep<StorageFormValues>({
  schema: storageSchema,
  dataKey: 'storage',
  defaults: { storageType: 'primary', provider: '', drStatus: 'current', verified: false },
  render: (form) => (
    <>
      {simpleInput('Storage Type', 'storageType', form)}
      {simpleInput('Provider', 'provider', form)}
      {simpleInput('Location', 'location', form)}
      {simpleInput('Redundancy', 'redundancy', form)}
      {simpleInput('Access Time', 'accessTime', form)}
      {simpleInput('Cost / Month', 'costPerMonth', form, 'number')}
      {simpleInput('Backup Frequency', 'frequency', form)}
      {simpleInput('Last Backup', 'lastBackup', form, 'datetime-local')}
      <FormField control={form.control} name={'verified' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Verified</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleTextarea('Plan', 'plan', form)}
      {simpleInput('Tested At', 'testedAt', form, 'datetime-local')}
      {simpleInput('RTO', 'rto', form)}
      {simpleInput('RPO', 'rpo', form)}
      {simpleInput('DR Status', 'drStatus', form)}
    </>
  )
})

const ComplianceStep = createStep<RegulationFormValues & ClassificationFormValues & AuditFormValues>({
  schema: regulationSchema.merge(classificationSchema).merge(auditSchema),
  dataKey: 'regulation',
  defaults: {
    regulation: '',
    applicable: false,
    complianceStatus: 'compliant',
    category: '',
    sensitivity: 'internal',
    auditType: '',
    status: 'pending'
  } as unknown as RegulationFormValues & ClassificationFormValues & AuditFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Regulation</div>
      {simpleInput('Regulation', 'regulation', form)}
      <FormField control={form.control} name={'applicable' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Applicable</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleInput('Retention Period', 'retentionPeriod', form)}
      {simpleTextarea('Requirements', 'requirements', form)}
      {simpleInput('Compliance Status', 'complianceStatus', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Classification</div>
      {simpleInput('Category', 'category', form)}
      {simpleInput('Sensitivity', 'sensitivity', form)}
      {simpleInput('Retention', 'retention', form)}
      {simpleInput('Disposal Method', 'disposalMethod', form)}
      {simpleTextarea('Access Levels', 'accessLevels', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Audits</div>
      {simpleInput('Audit Type', 'auditType', form)}
      {simpleInput('Last Audit', 'lastAudit', form, 'datetime-local')}
      {simpleInput('Next Audit', 'nextAudit', form, 'datetime-local')}
      {simpleInput('Audit Status', 'status', form)}
      {simpleTextarea('Findings', 'findings', form)}
    </>
  )
})

const CleanupStep = createStep<CleanupTempFormValues & CleanupDupFormValues & CleanupObsoleteFormValues & CleanupVerificationFormValues>({
  schema: cleanupTempSchema.merge(cleanupDupSchema).merge(cleanupObsoleteSchema).merge(cleanupVerificationSchema),
  dataKey: 'cleanupTemp',
  defaults: {
    location: '',
    fileCount: 0,
    deleted: false,
    contentType: '',
    resolution: 'pending',
    category: '',
    retentionMet: false,
    checksumsEnabled: false,
    integrityStatus: 'pending'
  } as unknown as CleanupTempFormValues & CleanupDupFormValues & CleanupObsoleteFormValues & CleanupVerificationFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Temporary Files</div>
      {simpleInput('Location', 'location', form)}
      {simpleInput('File Count', 'fileCount', form, 'number')}
      {simpleInput('Size (bytes)', 'sizeBytes', form, 'number')}
      {simpleInput('Age Criteria', 'ageCriteria', form)}
      <FormField control={form.control} name={'deleted' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Deleted</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleInput('Cleanup Date', 'cleanupDate', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Duplicates</div>
      {simpleInput('Content Type', 'contentType', form)}
      {simpleInput('Duplicate Count', 'duplicateCount', form, 'number')}
      {simpleInput('Size (bytes)', 'sizeBytes', form, 'number')}
      {simpleInput('Resolution', 'resolution', form)}
      {simpleInput('Cleanup Date (Dup)', 'cleanupDate', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Obsolete Data</div>
      {simpleInput('Category', 'category', form)}
      {simpleInput('Record Count', 'recordCount', form, 'number')}
      {simpleInput('Last Accessed', 'lastAccessed', form, 'datetime-local')}
      <FormField control={form.control} name={'retentionMet' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Retention Met</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleInput('Scheduled Deletion', 'scheduledDeletion', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Verification</div>
      <FormField control={form.control} name={'checksumsEnabled' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Checksums Enabled</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleInput('Integrity Status', 'integrityStatus', form)}
      {simpleInput('Last Check', 'lastCheck', form, 'datetime-local')}
      {simpleTextarea('Issues Found', 'issuesFound', form)}
    </>
  )
})

const OrganizationStep = createStep<OrgStructureFormValues & OrgIndexFormValues & MetadataFormValues>({
  schema: orgStructureSchema.merge(orgIndexSchema).merge(metadataSchema),
  dataKey: 'orgStructure',
  defaults: {
    category: '',
    indexType: '',
    searchable: false,
    fileName: ''
  } as unknown as OrgStructureFormValues & OrgIndexFormValues & MetadataFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Organization Structure</div>
      {simpleInput('Category', 'category', form)}
      {simpleTextarea('Subcategories (comma separated)', 'subcategories', form)}
      {simpleInput('Naming Convention', 'namingConvention', form)}
      {simpleTextarea('Access Levels', 'accessLevels', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Indexing</div>
      {simpleInput('Index Type', 'indexType', form)}
      {simpleTextarea('Fields Indexed (comma separated)', 'fieldsIndexed', form)}
      <FormField control={form.control} name={'searchable' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Searchable</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
      {simpleInput('Last Updated', 'lastUpdated', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Metadata</div>
      {simpleInput('File Name', 'fileName', form)}
      {simpleTextarea('Tags (comma separated)', 'tags', form)}
      {simpleTextarea('Description', 'description', form)}
      {simpleInput('Created Date', 'createdDate', form, 'datetime-local')}
      {simpleInput('Modified Date', 'modifiedDate', form, 'datetime-local')}
    </>
  )
})

const AccessStep = createStep<PermissionsFormValues & AuditLogFormValues & EncryptionFormValues>({
  schema: permissionsSchema.merge(auditLogSchema).merge(encryptionSchema),
  dataKey: 'permissions',
  defaults: {
    roleName: '',
    userName: '',
    actionPerformed: '',
    encryptionMethod: '',
    complianceStatus: 'compliant'
  } as unknown as PermissionsFormValues & AuditLogFormValues & EncryptionFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Permissions</div>
      {simpleInput('Role Name', 'roleName', form)}
      {simpleTextarea('Users List (comma separated)', 'usersList', form)}
      {simpleTextarea('Access Permissions', 'accessPermissions', form)}
      {simpleTextarea('Access Restrictions', 'accessRestrictions', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Audit Logs</div>
      {simpleInput('User Name', 'userName', form)}
      {simpleInput('Action Performed', 'actionPerformed', form)}
      {simpleInput('Resource Accessed', 'resourceAccessed', form)}
      {simpleInput('Action Timestamp', 'actionTimestamp', form, 'datetime-local')}
      {simpleInput('IP Address', 'ipAddress', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Encryption</div>
      {simpleInput('Encryption Method', 'encryptionMethod', form)}
      {simpleInput('Key Management', 'keyManagement', form)}
      {simpleInput('Rotation Policy', 'rotationPolicy', form)}
      {simpleInput('Compliance Status', 'complianceStatus', form)}
    </>
  )
})

const VerificationStep = createStep<
  VerificationCompletenessFormValues & VerificationIntegrityFormValues & VerificationAccessibilityFormValues
>({
  schema: verificationCompletenessSchema
    .merge(verificationIntegritySchema)
    .merge(verificationAccessibilitySchema),
  dataKey: 'verificationCompleteness',
  defaults: {
    category: '',
    verificationStatus: 'incomplete',
    component: '',
    testResult: 'passed',
    archiveLocation: '',
    testResult_1: undefined
  } as unknown as VerificationCompletenessFormValues & VerificationIntegrityFormValues & VerificationAccessibilityFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Completeness</div>
      {simpleInput('Category', 'category', form)}
      {simpleTextarea('Required Items (JSON/CSV)', 'requiredItems', form)}
      {simpleTextarea('Present Items (JSON/CSV)', 'presentItems', form)}
      {simpleTextarea('Missing Items (JSON/CSV)', 'missingItems', form)}
      {simpleInput('Verification Status', 'verificationStatus', form)}
      {simpleInput('Verified At', 'verifiedAt', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Integrity</div>
      {simpleInput('Component', 'component', form)}
      {simpleInput('Test Performed', 'testPerformed', form)}
      {simpleInput('Test Result', 'testResult', form)}
      {simpleTextarea('Test Details', 'testDetails', form)}
      {simpleInput('Verified At (Integrity)', 'verifiedAt', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Accessibility</div>
      {simpleInput('Archive Location', 'archiveLocation', form)}
      {simpleInput('Test Performed (Accessibility)', 'testPerformed', form)}
      {simpleInput('Test Result (Accessibility)', 'testResult', form)}
      {simpleTextarea('Resolution Notes', 'resolutionNotes', form)}
      {simpleInput('Verified At (Accessibility)', 'verifiedAt', form, 'datetime-local')}
    </>
  )
})

const steps = [
  { id: 'archiving', title: 'Data Archiving', description: 'Content, databases, media', component: DataArchivingStep },
  { id: 'storage', title: 'Storage & DR', description: 'Primary/backup/DR configuration', component: StorageStep },
  { id: 'compliance', title: 'Compliance & Retention', description: 'Regulations, classification, audits', component: ComplianceStep },
  { id: 'cleanup', title: 'Cleanup & Verification', description: 'Temp, duplicates, obsolete, integrity', component: CleanupStep },
  { id: 'organization', title: 'Organization & Metadata', description: 'Structure, indexing, metadata', component: OrganizationStep },
  { id: 'access', title: 'Access & Audit', description: 'Permissions, audit logs, encryption', component: AccessStep },
  { id: 'verification', title: 'Final Verification', description: 'Completeness, integrity, accessibility', component: VerificationStep }
]

export default function ArchivePhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as ArchiveWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')
      const userId = userData.user.id

      if (data.content) {
        const c = data.content as ContentFormValues
        const d = data.content as unknown as DatabaseFormValues
        const m = data.content as unknown as MediaFormValues
        const { error } = await supabase.from('archive_content').insert({
          content_type: c.contentType,
          location: c.location || null,
          size_bytes: c.sizeBytes ?? null,
          format: c.format || null,
          archived: c.archived,
          backup: c.backup,
          user_id: userId
        })
        if (error) throw error

        const { error: dbError } = await supabase.from('archive_databases').insert({
          database_name: d.databaseName,
          record_count: d.recordCount ?? 0,
          size_bytes: d.sizeBytes ?? null,
          archived: d.archived,
          retention_period: d.retentionPeriod || null,
          user_id: userId
        })
        if (dbError) throw dbError

        const { error: mediaError } = await supabase.from('archive_media').insert({
          media_type: m.mediaType,
          file_count: m.fileCount ?? 0,
          total_size_bytes: m.totalSizeBytes ?? null,
          storage_location: m.storageLocation || null,
          archived: m.archived,
          user_id: userId
        })
        if (mediaError) throw mediaError
      }

      if (data.storage) {
        const s = data.storage as StorageFormValues
        const { error } = await supabase.from('archive_storage').insert({
          storage_type: s.storageType,
          provider: s.provider,
          location: s.location || null,
          redundancy: s.redundancy || null,
          access_time: s.accessTime || null,
          cost_per_month: s.costPerMonth ?? null,
          frequency: s.frequency || null,
          last_backup: s.lastBackup || null,
          verified: s.verified,
          plan: s.plan || null,
          tested_at: s.testedAt || null,
          rto: s.rto || null,
          rpo: s.rpo || null,
          dr_status: s.drStatus,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.regulation) {
        const r = data.regulation as RegulationFormValues
        const cls = data.regulation as unknown as ClassificationFormValues
        const au = data.regulation as unknown as AuditFormValues
        const { error } = await supabase.from('archive_compliance_regulations').insert({
          regulation: r.regulation,
          applicable: r.applicable,
          retention_period: r.retentionPeriod || null,
          requirements: r.requirements ? JSON.parse(JSON.stringify(r.requirements)) : null,
          compliance_status: r.complianceStatus,
          user_id: userId
        })
        if (error) throw error

        const { error: clsError } = await supabase.from('archive_data_classification').insert({
          category: cls.category,
          sensitivity: cls.sensitivity,
          retention: cls.retention || null,
          disposal_method: cls.disposalMethod || null,
          access_levels: cls.accessLevels ? JSON.parse(JSON.stringify(cls.accessLevels)) : null,
          user_id: userId
        })
        if (clsError) throw clsError

        const { error: auditError } = await supabase.from('archive_audits').insert({
          audit_type: au.auditType,
          last_audit: au.lastAudit || null,
          next_audit: au.nextAudit || null,
          status: au.status,
          findings: au.findings ? JSON.parse(JSON.stringify(au.findings)) : null,
          user_id: userId
        })
        if (auditError) throw auditError
      }

      if (data.cleanupTemp) {
        const ct = data.cleanupTemp as CleanupTempFormValues
        const cd = data.cleanupTemp as unknown as CleanupDupFormValues
        const co = data.cleanupTemp as unknown as CleanupObsoleteFormValues
        const cv = data.cleanupTemp as unknown as CleanupVerificationFormValues
        const { error } = await supabase.from('archive_cleanup_temporary').insert({
          location: ct.location,
          file_count: ct.fileCount ?? 0,
          size_bytes: ct.sizeBytes ?? null,
          age_criteria: ct.ageCriteria || null,
          deleted: ct.deleted,
          cleanup_date: ct.cleanupDate || null,
          user_id: userId
        })
        if (error) throw error

        const { error: dupError } = await supabase.from('archive_cleanup_duplicates').insert({
          content_type: cd.contentType,
          duplicate_count: cd.duplicateCount ?? 0,
          size_bytes: cd.sizeBytes ?? null,
          resolution: cd.resolution,
          cleanup_date: cd.cleanupDate || null,
          user_id: userId
        })
        if (dupError) throw dupError

        const { error: obsError } = await supabase.from('archive_cleanup_obsolete').insert({
          category: co.category,
          record_count: co.recordCount ?? 0,
          last_accessed: co.lastAccessed || null,
          retention_met: co.retentionMet,
          scheduled_deletion: co.scheduledDeletion || null,
          user_id: userId
        })
        if (obsError) throw obsError

        const { error: verError } = await supabase.from('archive_cleanup_verification').insert({
          checksums_enabled: cv.checksumsEnabled,
          integrity_status: cv.integrityStatus,
          last_check: cv.lastCheck || null,
          issues_found: cv.issuesFound ? JSON.parse(JSON.stringify(cv.issuesFound)) : null,
          user_id: userId
        })
        if (verError) throw verError
      }

      if (data.orgStructure) {
        const os = data.orgStructure as OrgStructureFormValues
        const oi = data.orgStructure as unknown as OrgIndexFormValues
        const md = data.orgStructure as unknown as MetadataFormValues
        const { error } = await supabase.from('archive_organization_structure').insert({
          category: os.category,
          subcategories: os.subcategories ? JSON.parse(JSON.stringify(os.subcategories)) : null,
          naming_convention: os.namingConvention || null,
          access_levels: os.accessLevels ? JSON.parse(JSON.stringify(os.accessLevels)) : null,
          user_id: userId
        })
        if (error) throw error

        const { error: indexError } = await supabase.from('archive_organization_indexing').insert({
          index_type: oi.indexType,
          fields_indexed: oi.fieldsIndexed ? JSON.parse(JSON.stringify(oi.fieldsIndexed)) : null,
          searchable: oi.searchable,
          last_updated: oi.lastUpdated || null,
          user_id: userId
        })
        if (indexError) throw indexError

        const { error: metaError } = await supabase.from('archive_metadata').insert({
          file_name: md.fileName,
          tags: md.tags ? JSON.parse(JSON.stringify(md.tags)) : null,
          description: md.description || null,
          created_date: md.createdDate || null,
          modified_date: md.modifiedDate || null,
          user_id: userId
        })
        if (metaError) throw metaError
      }

      if (data.permissions) {
        const p = data.permissions as PermissionsFormValues
        const al = data.permissions as unknown as AuditLogFormValues
        const enc = data.permissions as unknown as EncryptionFormValues
        const { error } = await supabase.from('archive_permissions').insert({
          role_name: p.roleName,
          users_list: p.usersList ? parseCsv(p.usersList) : null,
          access_permissions: p.accessPermissions ? JSON.parse(JSON.stringify(p.accessPermissions)) : null,
          access_restrictions: p.accessRestrictions ? JSON.parse(JSON.stringify(p.accessRestrictions)) : null,
          user_id: userId
        })
        if (error) throw error

        const { error: logError } = await supabase.from('archive_audit_logs').insert({
          user_name: al.userName,
          action_performed: al.actionPerformed,
          resource_accessed: al.resourceAccessed || null,
          action_timestamp: al.actionTimestamp || null,
          ip_address: al.ipAddress || null,
          user_id: userId
        })
        if (logError) throw logError

        const { error: encError } = await supabase.from('archive_encryption').insert({
          encryption_method: enc.encryptionMethod,
          key_management: enc.keyManagement || null,
          rotation_policy: enc.rotationPolicy || null,
          compliance_status: enc.complianceStatus,
          user_id: userId
        })
        if (encError) throw encError
      }

      if (data.verificationCompleteness) {
        const vc = data.verificationCompleteness as VerificationCompletenessFormValues
        const vi = data.verificationCompleteness as unknown as VerificationIntegrityFormValues
        const va = data.verificationCompleteness as unknown as VerificationAccessibilityFormValues
        const { error } = await supabase.from('archive_verification_completeness').insert({
          category: vc.category,
          required_items: vc.requiredItems ? JSON.parse(JSON.stringify(vc.requiredItems)) : null,
          present_items: vc.presentItems ? JSON.parse(JSON.stringify(vc.presentItems)) : null,
          missing_items: vc.missingItems ? JSON.parse(JSON.stringify(vc.missingItems)) : null,
          verification_status: vc.verificationStatus,
          verified_at: vc.verifiedAt || null,
          user_id: userId
        })
        if (error) throw error

        const { error: integrityError } = await supabase.from('archive_verification_integrity').insert({
          component: vi.component,
          test_performed: vi.testPerformed || null,
          test_result: vi.testResult,
          test_details: vi.testDetails || null,
          verified_at: vi.verifiedAt || null,
          user_id: userId
        })
        if (integrityError) throw integrityError

        const { error: accessError } = await supabase.from('archive_verification_accessibility').insert({
          archive_location: va.archiveLocation,
          test_performed: va.testPerformed || null,
          test_result: va.testResult,
          resolution_notes: va.resolutionNotes || null,
          verified_at: va.verifiedAt || null,
          user_id: userId
        })
        if (accessError) throw accessError
      }
    } catch (error) {
      logger.error('Archive phase workflow save failed', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [])

  const initialData = useMemo(() => ({}), [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Archive Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Archive, retain, clean up, and sign off with full compliance and auditability.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="archive-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving archive records...</p>}
      </div>
    </div>
  )
}
