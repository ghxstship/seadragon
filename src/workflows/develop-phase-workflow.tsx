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

type BudgetFormValues = z.infer<typeof budgetSchema>
type RevenueFormValues = z.infer<typeof revenueSchema>
type SponsorshipFormValues = z.infer<typeof sponsorshipSchema>
type VendorRfpFormValues = z.infer<typeof vendorRfpSchema>
type ContractFormValues = z.infer<typeof contractSchema>
type PermitFormValues = z.infer<typeof permitSchema>
type InsuranceFormValues = z.infer<typeof insuranceSchema>
type VenueFormValues = z.infer<typeof venueSchema>
type TalentFormValues = z.infer<typeof talentSchema>
type MarketingFormValues = z.infer<typeof marketingSchema>
type TicketingFormValues = z.infer<typeof ticketingSchema>
type TechnologyFormValues = z.infer<typeof technologySchema>

type DevelopWizardData = {
  budget?: BudgetFormValues
  revenue?: RevenueFormValues
  sponsorship?: SponsorshipFormValues
  vendorRfp?: VendorRfpFormValues
  contract?: ContractFormValues
  permit?: PermitFormValues
  insurance?: InsuranceFormValues
  venue?: VenueFormValues
  talent?: TalentFormValues
  marketing?: MarketingFormValues
  ticketing?: TicketingFormValues
  technology?: TechnologyFormValues
}

const budgetSchema = z.object({
  ticketSales: z.coerce.number().optional(),
  sponsorships: z.coerce.number().optional(),
  merchandise: z.coerce.number().optional(),
  concessions: z.coerce.number().optional(),
  otherRevenue: z.coerce.number().optional(),
  productionExpenses: z.coerce.number().optional(),
  venueExpenses: z.coerce.number().optional(),
  marketingExpenses: z.coerce.number().optional(),
  staffExpenses: z.coerce.number().optional(),
  insuranceExpenses: z.coerce.number().optional(),
  permitsExpenses: z.coerce.number().optional(),
  technologyExpenses: z.coerce.number().optional(),
  contingencyExpenses: z.coerce.number().optional(),
  breakEvenPoint: z.coerce.number().int().optional(),
  breakEvenRevenue: z.coerce.number().optional(),
  profitMargin: z.coerce.number().optional(),
  cashFlowProjections: z.string().optional()
})

const revenueSchema = z.object({
  attendanceScenarios: z.string().optional(),
  pricingStrategy: z.string().optional(),
  seasonalAdjustments: z.string().optional()
})

const sponsorshipSchema = z.object({
  targetSponsors: z.string().optional(),
  sponsorshipPackages: z.string().optional(),
  activationPlan: z.string().optional()
})

const vendorRfpSchema = z.object({
  category: z.string().min(1),
  vendors: z.string().optional(),
  evaluationCriteria: z.string().optional(),
  selectedVendor: z.string().optional(),
  rfpReleaseDate: z.string().optional(),
  proposalsDueDate: z.string().optional(),
  evaluationCompleteDate: z.string().optional(),
  contractsSignedDate: z.string().optional()
})

const contractSchema = z.object({
  vendor: z.string().min(1),
  category: z.string().min(1),
  value: z.coerce.number().optional(),
  terms: z.string().optional(),
  status: z.enum(['draft', 'negotiating', 'signed', 'executed']).default('draft'),
  keyClauses: z.string().optional(),
  negotiationLog: z.string().optional()
})

const permitSchema = z.object({
  type: z.string().min(1),
  authority: z.string().min(1),
  status: z.enum(['not_started', 'applied', 'approved', 'denied', 'appealed']).default('not_started'),
  applicationDate: z.string().optional(),
  approvalDate: z.string().optional(),
  cost: z.coerce.number().optional(),
  requirements: z.string().optional(),
  applicationStartDate: z.string().optional(),
  allPermitsApprovedDate: z.string().optional()
})

const insuranceSchema = z.object({
  type: z.string().min(1),
  provider: z.string().min(1),
  coverage: z.coerce.number().optional(),
  premium: z.coerce.number().optional(),
  deductible: z.coerce.number().optional(),
  term: z.string().optional(),
  status: z.enum(['quoted', 'purchased', 'active']).default('quoted'),
  riskAssessment: z.string().optional()
})

const venueSchema = z.object({
  venues: z.string().optional(),
  selectedVenue: z.string().optional(),
  siteSurveyCompleted: z.boolean().default(false),
  siteSurveyFindings: z.string().optional(),
  siteSurveyRecommendations: z.string().optional()
})

const talentSchema = z.object({
  lineup: z.string().optional(),
  bookingAgency: z.string().optional(),
  totalTalentBudget: z.coerce.number().optional(),
  riderRequirements: z.string().optional()
})

const marketingSchema = z.object({
  strategy: z.string().optional(),
  campaignPlan: z.string().optional()
})

const ticketingSchema = z.object({
  platform: z.string().optional(),
  pricingTiers: z.string().optional(),
  salesPhases: z.string().optional(),
  distributionChannels: z.string().optional(),
  platformFee: z.coerce.number().optional(),
  processingFee: z.coerce.number().optional(),
  totalFee: z.coerce.number().optional()
})

const technologySchema = z.object({
  systems: z.string().optional(),
  integrations: z.string().optional()
})

function parseJsonOrNull(value?: string) {
  if (!value || value.trim() === '') return null
  try {
    return JSON.parse(value)
  } catch (err) {
    logger.error('Failed to parse JSON field', err)
    return null
  }
}

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema
  dataKey: keyof DevelopWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as DevelopWizardData)[opts.dataKey] as T | undefined
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

const BudgetStep = createStep<BudgetFormValues>({
  schema: budgetSchema,
  dataKey: 'budget',
  defaults: {
    ticketSales: undefined,
    sponsorships: undefined,
    merchandise: undefined,
    concessions: undefined,
    otherRevenue: undefined,
    productionExpenses: undefined,
    venueExpenses: undefined,
    marketingExpenses: undefined,
    staffExpenses: undefined,
    insuranceExpenses: undefined,
    permitsExpenses: undefined,
    technologyExpenses: undefined,
    contingencyExpenses: undefined,
    breakEvenPoint: undefined,
    breakEvenRevenue: undefined,
    profitMargin: undefined,
    cashFlowProjections: ''
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'ticketSales' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Ticket Sales</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'sponsorships' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Sponsorships</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'productionExpenses' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Production Expenses</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'venueExpenses' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Venue Expenses</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'marketingExpenses' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Marketing Expenses</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'cashFlowProjections' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Cash Flow Projections (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const RevenueStep = createStep<RevenueFormValues>({
  schema: revenueSchema,
  dataKey: 'revenue',
  defaults: { attendanceScenarios: '', pricingStrategy: '', seasonalAdjustments: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'attendanceScenarios' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Attendance Scenarios (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'pricingStrategy' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Pricing Strategy (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'seasonalAdjustments' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Seasonal Adjustments (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const SponsorshipStep = createStep<SponsorshipFormValues>({
  schema: sponsorshipSchema,
  dataKey: 'sponsorship',
  defaults: { targetSponsors: '', sponsorshipPackages: '', activationPlan: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'targetSponsors' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Target Sponsors (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'sponsorshipPackages' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Sponsorship Packages (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'activationPlan' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Activation Plan (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const VendorRfpStep = createStep<VendorRfpFormValues>({
  schema: vendorRfpSchema,
  dataKey: 'vendorRfp',
  defaults: {
    category: '', vendors: '', evaluationCriteria: '', selectedVendor: '', rfpReleaseDate: '', proposalsDueDate: '', evaluationCompleteDate: '', contractsSignedDate: ''
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'category' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'vendors' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Vendors (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'evaluationCriteria' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Evaluation Criteria (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'selectedVendor' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Selected Vendor</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'rfpReleaseDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>RFP Release Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'proposalsDueDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Proposals Due</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'evaluationCompleteDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Evaluation Complete</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'contractsSignedDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Contracts Signed</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ContractStep = createStep<ContractFormValues>({
  schema: contractSchema,
  dataKey: 'contract',
  defaults: { vendor: '', category: '', value: undefined, terms: '', status: 'draft', keyClauses: '', negotiationLog: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'vendor' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Vendor</FormLabel>
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
      <FormField control={form.control} name={'value' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Value</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'terms' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Terms (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'keyClauses' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Key Clauses (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'negotiationLog' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Negotiation Log (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const PermitStep = createStep<PermitFormValues>({
  schema: permitSchema,
  dataKey: 'permit',
  defaults: {
    type: '', authority: '', status: 'not_started', applicationDate: '', approvalDate: '', cost: undefined, requirements: '', applicationStartDate: '', allPermitsApprovedDate: ''
  },
  render: (form) => (
    <>
      <FormField control={form.control} name={'type' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Permit Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'authority' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Authority</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'applicationDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Application Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'approvalDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Approval Date</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'cost' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Cost</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'requirements' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Requirements (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'allPermitsApprovedDate' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>All Permits Approved</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const InsuranceStep = createStep<InsuranceFormValues>({
  schema: insuranceSchema,
  dataKey: 'insurance',
  defaults: { type: '', provider: '', coverage: undefined, premium: undefined, deductible: undefined, term: '', status: 'quoted', riskAssessment: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'type' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Insurance Type</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'provider' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Provider</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'coverage' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Coverage</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'premium' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Premium</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'deductible' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Deductible</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'status' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'riskAssessment' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Risk Assessment (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const VenueStep = createStep<VenueFormValues>({
  schema: venueSchema,
  dataKey: 'venue',
  defaults: { venues: '', selectedVenue: '', siteSurveyCompleted: false, siteSurveyFindings: '', siteSurveyRecommendations: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'venues' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Venues (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'selectedVenue' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Selected Venue (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'siteSurveyCompleted' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Site Survey Completed</FormLabel>
          <FormControl><Input type="checkbox" checked={field.value ?? false} onChange={e => field.onChange(e.target.checked)}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'siteSurveyFindings' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Findings (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'siteSurveyRecommendations' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Recommendations (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const TalentStep = createStep<TalentFormValues>({
  schema: talentSchema,
  dataKey: 'talent',
  defaults: { lineup: '', bookingAgency: '', totalTalentBudget: undefined, riderRequirements: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'lineup' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Lineup (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'bookingAgency' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Booking Agency</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'totalTalentBudget' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Total Talent Budget</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'riderRequirements' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Rider Requirements (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const MarketingStep = createStep<MarketingFormValues>({
  schema: marketingSchema,
  dataKey: 'marketing',
  defaults: { strategy: '', campaignPlan: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'strategy' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Strategy (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'campaignPlan' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Campaign Plan (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const TicketingStep = createStep<TicketingFormValues>({
  schema: ticketingSchema,
  dataKey: 'ticketing',
  defaults: { platform: '', pricingTiers: '', salesPhases: '', distributionChannels: '', platformFee: undefined, processingFee: undefined, totalFee: undefined },
  render: (form) => (
    <>
      <FormField control={form.control} name={'platform' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Platform</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'pricingTiers' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Pricing Tiers (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'salesPhases' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Sales Phases (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'distributionChannels' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Distribution Channels (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'platformFee' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Platform Fee</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'processingFee' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Processing Fee</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'totalFee' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Total Fee</FormLabel>
          <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const TechnologyStep = createStep<TechnologyFormValues>({
  schema: technologySchema,
  dataKey: 'technology',
  defaults: { systems: '', integrations: '' },
  render: (form) => (
    <>
      <FormField control={form.control} name={'systems' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Systems (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'integrations' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Integrations (JSON)</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const steps = [
  { id: 'budget', title: 'Budget', description: 'Detailed budget and projections', component: BudgetStep },
  { id: 'revenue', title: 'Revenue Projections', description: 'Attendance and pricing scenarios', component: RevenueStep },
  { id: 'sponsorship', title: 'Sponsorship', description: 'Sponsors and activations', component: SponsorshipStep },
  { id: 'vendorRfp', title: 'Vendor RFP', description: 'RFPs and vendor evaluation', component: VendorRfpStep },
  { id: 'contracts', title: 'Contracts', description: 'Contracts and key clauses', component: ContractStep },
  { id: 'permits', title: 'Permits', description: 'Permits and approvals', component: PermitStep },
  { id: 'insurance', title: 'Insurance', description: 'Insurance coverage and status', component: InsuranceStep },
  { id: 'venue', title: 'Venue', description: 'Venue selection and surveys', component: VenueStep },
  { id: 'talent', title: 'Talent', description: 'Talent booking and riders', component: TalentStep },
  { id: 'marketing', title: 'Marketing', description: 'Strategy and campaigns', component: MarketingStep },
  { id: 'ticketing', title: 'Ticketing', description: 'Platform, pricing, phases', component: TicketingStep },
  { id: 'technology', title: 'Technology', description: 'Systems and integrations', component: TechnologyStep }
]

export function DevelopPhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as DevelopWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated for develop workflow')
      const userId = userData.user.id

      if (data.budget) {
        const { error } = await supabase.from('develop_budget').insert({
          ticket_sales: data.budget.ticketSales ?? 0,
          sponsorships: data.budget.sponsorships ?? 0,
          merchandise: data.budget.merchandise ?? 0,
          concessions: data.budget.concessions ?? 0,
          other_revenue: data.budget.otherRevenue ?? 0,
          production_expenses: data.budget.productionExpenses ?? 0,
          venue_expenses: data.budget.venueExpenses ?? 0,
          marketing_expenses: data.budget.marketingExpenses ?? 0,
          staff_expenses: data.budget.staffExpenses ?? 0,
          insurance_expenses: data.budget.insuranceExpenses ?? 0,
          permits_expenses: data.budget.permitsExpenses ?? 0,
          technology_expenses: data.budget.technologyExpenses ?? 0,
          contingency_expenses: data.budget.contingencyExpenses ?? 0,
          break_even_point: data.budget.breakEvenPoint ?? 0,
          break_even_revenue: data.budget.breakEvenRevenue ?? 0,
          profit_margin: data.budget.profitMargin ?? 0,
          cash_flow_projections: parseJsonOrNull(data.budget.cashFlowProjections),
          user_id: userId
        })
        if (error) throw error
      }

      if (data.revenue) {
        const { error } = await supabase.from('develop_revenue_projections').insert({
          attendance_scenarios: parseJsonOrNull(data.revenue.attendanceScenarios),
          pricing_strategy: parseJsonOrNull(data.revenue.pricingStrategy),
          seasonal_adjustments: parseJsonOrNull(data.revenue.seasonalAdjustments),
          user_id: userId
        })
        if (error) throw error
      }

      if (data.sponsorship) {
        const { error } = await supabase.from('develop_sponsorship').insert({
          target_sponsors: parseJsonOrNull(data.sponsorship.targetSponsors),
          sponsorship_packages: parseJsonOrNull(data.sponsorship.sponsorshipPackages),
          activation_plan: parseJsonOrNull(data.sponsorship.activationPlan),
          user_id: userId
        })
        if (error) throw error
      }

      if (data.vendorRfp) {
        const { error } = await supabase.from('develop_vendor_rfp').insert({
          category: data.vendorRfp.category,
          vendors: parseJsonOrNull(data.vendorRfp.vendors),
          evaluation_criteria: parseJsonOrNull(data.vendorRfp.evaluationCriteria),
          selected_vendor: data.vendorRfp.selectedVendor,
          rfp_release_date: data.vendorRfp.rfpReleaseDate || null,
          proposals_due_date: data.vendorRfp.proposalsDueDate || null,
          evaluation_complete_date: data.vendorRfp.evaluationCompleteDate || null,
          contracts_signed_date: data.vendorRfp.contractsSignedDate || null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.contract) {
        const { error } = await supabase.from('develop_contracts').insert({
          vendor: data.contract.vendor,
          category: data.contract.category,
          value: data.contract.value ?? null,
          terms: parseJsonOrNull(data.contract.terms),
          status: data.contract.status,
          key_clauses: parseJsonOrNull(data.contract.keyClauses),
          negotiation_log: parseJsonOrNull(data.contract.negotiationLog),
          user_id: userId
        })
        if (error) throw error
      }

      if (data.permit) {
        const { error } = await supabase.from('develop_permits').insert({
          type: data.permit.type,
          authority: data.permit.authority,
          status: data.permit.status,
          application_date: data.permit.applicationDate || null,
          approval_date: data.permit.approvalDate || null,
          cost: data.permit.cost ?? 0,
          requirements: parseJsonOrNull(data.permit.requirements),
          application_start_date: data.permit.applicationStartDate || null,
          all_permits_approved_date: data.permit.allPermitsApprovedDate || null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.insurance) {
        const { error } = await supabase.from('develop_insurance').insert({
          type: data.insurance.type,
          provider: data.insurance.provider,
          coverage: data.insurance.coverage ?? null,
          premium: data.insurance.premium ?? null,
          deductible: data.insurance.deductible ?? null,
          term: data.insurance.term,
          status: data.insurance.status,
          risk_assessment: parseJsonOrNull(data.insurance.riskAssessment),
          user_id: userId
        })
        if (error) throw error
      }

      if (data.venue) {
        const { error } = await supabase.from('develop_venue').insert({
          venues: parseJsonOrNull(data.venue.venues),
          selected_venue: parseJsonOrNull(data.venue.selectedVenue),
          site_survey_completed: data.venue.siteSurveyCompleted ?? false,
          site_survey_findings: parseJsonOrNull(data.venue.siteSurveyFindings),
          site_survey_recommendations: parseJsonOrNull(data.venue.siteSurveyRecommendations),
          user_id: userId
        })
        if (error) throw error
      }

      if (data.talent) {
        const { error } = await supabase.from('develop_talent').insert({
          lineup: parseJsonOrNull(data.talent.lineup),
          booking_agency: data.talent.bookingAgency,
          total_talent_budget: data.talent.totalTalentBudget ?? null,
          rider_requirements: parseJsonOrNull(data.talent.riderRequirements),
          user_id: userId
        })
        if (error) throw error
      }

      if (data.marketing) {
        const { error } = await supabase.from('develop_marketing').insert({
          strategy: parseJsonOrNull(data.marketing.strategy),
          campaign_plan: parseJsonOrNull(data.marketing.campaignPlan),
          user_id: userId
        })
        if (error) throw error
      }

      if (data.ticketing) {
        const { error } = await supabase.from('develop_ticketing').insert({
          platform: data.ticketing.platform,
          pricing_tiers: parseJsonOrNull(data.ticketing.pricingTiers),
          sales_phases: parseJsonOrNull(data.ticketing.salesPhases),
          distribution_channels: parseJsonOrNull(data.ticketing.distributionChannels),
          platform_fee: data.ticketing.platformFee ?? null,
          processing_fee: data.ticketing.processingFee ?? null,
          total_fee: data.ticketing.totalFee ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.technology) {
        const { error } = await supabase.from('develop_technology').insert({
          systems: parseJsonOrNull(data.technology.systems),
          integrations: parseJsonOrNull(data.technology.integrations),
          user_id: userId
        })
        if (error) throw error
      }

    } catch (error) {
      logger.error('Develop phase workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Develop Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Capture budgets, revenue models, RFPs, contracts, permits, insurance, venue, talent, marketing, ticketing, and technology plans with Supabase persistence.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="develop-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving develop phase records...</p>}
      </div>
    </div>
  )
}

export default DevelopPhaseWorkflow
