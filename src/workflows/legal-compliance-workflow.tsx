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

type PolicyFormValues = z.infer<typeof policySchema>
type RiskFormValues = z.infer<typeof riskSchema>
type ContractFormValues = z.infer<typeof contractSchema>
type FilingFormValues = z.infer<typeof filingSchema>
type AuditFormValues = z.infer<typeof auditSchema>
type MetricsFormValues = z.infer<typeof metricsSchema>

type LegalWizardData = {
  policy?: PolicyFormValues
  risk?: RiskFormValues
  contract?: ContractFormValues
  filing?: FilingFormValues
  audit?: AuditFormValues
  metrics?: MetricsFormValues
}

export default LegalComplianceWorkflow

const policySchema = z.object({
  regulation: z.string().min(1),
  category: z.string().optional(),
  jurisdiction: z.string().optional(),
  complianceStatus: z.enum(['compliant', 'conditional', 'non-compliant']).default('compliant'),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  responsibleParty: z.string().optional(),
  lastReview: z.string().optional(),
  nextReview: z.string().optional()
})

const riskSchema = z.object({
  assessmentId: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  likelihood: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  impact: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  riskScore: z.coerce.number().int().optional(),
  mitigation: z.string().optional(),
  riskOwner: z.string().optional(),
  assessmentStatus: z.enum(['active', 'mitigated', 'closed']).default('active')
})

const contractSchema = z.object({
  contractId: z.string().min(1),
  title: z.string().min(1),
  contractType: z.string().min(1),
  party: z.string().min(1),
  contractValue: z.coerce.number().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  contractStatus: z.enum(['active', 'expiring', 'breached', 'terminated']).default('active'),
  keyTerms: z.string().optional(),
  renewalReminder: z.string().optional()
})

const filingSchema = z.object({
  filingType: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  submittedDate: z.string().optional(),
  filingStatus: z.enum(['pending', 'submitted', 'approved', 'rejected']).default('pending'),
  filingNumber: z.string().optional(),
  notes: z.string().optional()
})

const auditSchema = z.object({
  auditId: z.string().min(1),
  auditType: z.string().min(1),
  scope: z.string().optional(),
  auditor: z.string().optional(),
  scheduledDate: z.string().optional(),
  completionDate: z.string().optional(),
  overallRating: z.enum(['excellent', 'good', 'satisfactory', 'needs_improvement', 'critical']).default('good')
})

const metricsSchema = z.object({
  complianceRate: z.coerce.number().optional(),
  auditScore: z.coerce.number().optional(),
  incidentRate: z.coerce.number().optional(),
  responseTime: z.coerce.number().optional(),
  trainingCompletion: z.coerce.number().optional()
})

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema
  dataKey: keyof LegalWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as LegalWizardData)[opts.dataKey] as T | undefined
    const form = useForm<T>({ resolver: zodResolver(opts.schema), defaultValues: (existing ?? opts.defaults) as DefaultValues<T> })

    useEffect(() => {
      const subscription = form.watch((values) => {
        onChange({ ...data, [opts.dataKey]: values })
        onValidationChange?.(form.formState.isValid)
      }) as unknown as { unsubscribe?: () => void }
      return () => subscription?.unsubscribe?.()
    }, [form, data, onChange, onValidationChange])

    return <Form {...form}><form className="grid grid-cols-1 md:grid-cols-2 gap-4">{opts.render(form)}</form></Form>
  }
}

const PolicyStep = createStep<PolicyFormValues>({
  schema: policySchema,
  dataKey: 'policy',
  defaults: {
    regulation: '', category: '', jurisdiction: '', complianceStatus: 'compliant', riskLevel: 'medium', responsibleParty: '', lastReview: '', nextReview: ''
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'regulation' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Regulation</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'category' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'jurisdiction' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Jurisdiction</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'complianceStatus' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Compliance Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'riskLevel' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Risk Level</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'responsibleParty' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Responsible Party</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'lastReview' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Last Review</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'nextReview' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Next Review</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const RiskStep = createStep<RiskFormValues>({
  schema: riskSchema,
  dataKey: 'risk',
  defaults: {
    assessmentId: '', category: '', description: '', likelihood: 'medium', impact: 'medium', riskScore: undefined, mitigation: '', riskOwner: '', assessmentStatus: 'active'
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'assessmentId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Assessment ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'category' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'description' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Description</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'likelihood' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Likelihood</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'impact' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Impact</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'riskScore' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Risk Score</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'riskOwner' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Risk Owner</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'mitigation' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Mitigation</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ContractStep = createStep<ContractFormValues>({
  schema: contractSchema,
  dataKey: 'contract',
  defaults: {
    contractId: '', title: '', contractType: '', party: '', contractValue: undefined, startDate: '', endDate: '', contractStatus: 'active', keyTerms: '', renewalReminder: ''
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'contractId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Contract ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'title' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'contractType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Contract Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'party' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Party</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'contractValue' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Contract Value</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'startDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Start Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'endDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>End Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'contractStatus' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'renewalReminder' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Renewal Reminder</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'keyTerms' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Key Terms</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const FilingStep = createStep<FilingFormValues>({
  schema: filingSchema,
  dataKey: 'filing',
  defaults: {
    filingType: '', description: '', dueDate: '', submittedDate: '', filingStatus: 'pending', filingNumber: '', notes: ''
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'filingType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Filing Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'dueDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Due Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'submittedDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Submitted Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'filingStatus' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'filingNumber' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Filing Number</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'notes' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Notes</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'description' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Description</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const AuditStep = createStep<AuditFormValues>({
  schema: auditSchema,
  dataKey: 'audit',
  defaults: {
    auditId: '', auditType: '', scope: '', auditor: '', scheduledDate: '', completionDate: '', overallRating: 'good'
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'auditId' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Audit ID</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'auditType' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Audit Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'scope' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Scope</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'auditor' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Auditor</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'scheduledDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Scheduled Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'completionDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Completion Date</FormLabel>
          <FormControl><Input type="datetime-local" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'overallRating' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Overall Rating</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const MetricsStep = createStep<MetricsFormValues>({
  schema: metricsSchema,
  dataKey: 'metrics',
  defaults: { complianceRate: undefined, auditScore: undefined, incidentRate: undefined, responseTime: undefined, trainingCompletion: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'complianceRate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Compliance Rate (%)</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'auditScore' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Audit Score</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'incidentRate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Incident Rate</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'responseTime' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Response Time</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'trainingCompletion' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Training Completion (%)</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const steps = [
  { id: 'policy', title: 'Policy Mapping', description: 'Identify policies and jurisdictions', component: PolicyStep },
  { id: 'risk', title: 'Risk Review', description: 'Assess risks and mitigations', component: RiskStep },
  { id: 'contracts', title: 'Contracts & Waivers', description: 'Active contracts and terms', component: ContractStep },
  { id: 'filings', title: 'Compliance Tasks & Filings', description: 'Filings, status, due dates', component: FilingStep },
  { id: 'audits', title: 'Monitoring & Audits', description: 'Audit schedule and ratings', component: AuditStep },
  { id: 'metrics', title: 'Reporting & Metrics', description: 'Compliance metrics and scores', component: MetricsStep }
]

export function LegalComplianceWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as LegalWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')
      const userId = userData.user.id

      if (data.policy) {
        const { error } = await supabase.from('legal_regulations_applicable').insert({
          regulation: data.policy.regulation,
          category: data.policy.category,
          jurisdiction: data.policy.jurisdiction,
          compliance_status: data.policy.complianceStatus,
          risk_level: data.policy.riskLevel,
          responsible_party: data.policy.responsibleParty,
          last_review: data.policy.lastReview || null,
          next_review: data.policy.nextReview || null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.risk) {
        const { error } = await supabase.from('legal_risk_assessments').insert({
          assessment_id: data.risk.assessmentId,
          category: data.risk.category,
          description: data.risk.description,
          likelihood: data.risk.likelihood,
          impact: data.risk.impact,
          risk_score: data.risk.riskScore ?? null,
          mitigation: data.risk.mitigation ? JSON.parse(JSON.stringify(data.risk.mitigation)) : null,
          risk_owner: data.risk.riskOwner,
          assessment_status: data.risk.assessmentStatus,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.contract) {
        const { error } = await supabase.from('legal_contracts_active').insert({
          contract_id: data.contract.contractId,
          title: data.contract.title,
          contract_type: data.contract.contractType,
          party: data.contract.party,
          contract_value: data.contract.contractValue ?? null,
          start_date: data.contract.startDate,
          end_date: data.contract.endDate,
          contract_status: data.contract.contractStatus,
          key_terms: data.contract.keyTerms ? JSON.parse(JSON.stringify(data.contract.keyTerms)) : null,
          renewal_reminder: data.contract.renewalReminder || null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.filing) {
        const { error } = await supabase.from('legal_regulations_filings').insert({
          filing_type: data.filing.filingType,
          description: data.filing.description,
          due_date: data.filing.dueDate || null,
          submitted_date: data.filing.submittedDate || null,
          filing_status: data.filing.filingStatus,
          filing_number: data.filing.filingNumber,
          notes: data.filing.notes,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.audit) {
        const { error } = await supabase.from('legal_compliance_audits').insert({
          audit_id: data.audit.auditId,
          audit_type: data.audit.auditType,
          scope: data.audit.scope,
          auditor: data.audit.auditor,
          scheduled_date: data.audit.scheduledDate || null,
          completion_date: data.audit.completionDate || null,
          overall_rating: data.audit.overallRating,
          user_id: userId
        }).select('id').single()
        if (error) throw error
      }

      if (data.metrics) {
        const { error } = await supabase.from('legal_compliance_metrics').insert({
          compliance_rate: data.metrics.complianceRate ?? null,
          audit_score: data.metrics.auditScore ?? null,
          incident_rate: data.metrics.incidentRate ?? null,
          response_time: data.metrics.responseTime ?? null,
          training_completion: data.metrics.trainingCompletion ?? null,
          user_id: userId
        })
        if (error) throw error
      }

    } catch (error) {
      logger.error('Legal compliance workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Legal & Compliance Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Map policies, manage risks, contracts, filings, audits, and metrics with Supabase persistence.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="legal-compliance-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving legal compliance records...</p>}
      </div>
    </div>
  )
}
