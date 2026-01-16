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

type EventFormValues = z.infer<typeof eventSchema>
type BasicFormValues = z.infer<typeof basicSchema>
type VenueFormValues = z.infer<typeof venueSchema>
type BudgetFormValues = z.infer<typeof budgetSchema>
type RevenueFormValues = z.infer<typeof revenueSchema>
type ExpenseFormValues = z.infer<typeof expenseSchema>
type SponsorshipFormValues = z.infer<typeof sponsorshipSchema>
type TeamFormValues = z.infer<typeof teamSchema>
type TeamMemberFormValues = z.infer<typeof teamMemberSchema>
type VendorFormValues = z.infer<typeof vendorSchema>
type MarketingFormValues = z.infer<typeof marketingSchema>

type EventCreationWizardData = {
  event?: EventFormValues
  basic?: BasicFormValues
  venue?: VenueFormValues
  budget?: BudgetFormValues
  revenue?: RevenueFormValues
  expense?: ExpenseFormValues
  sponsorship?: SponsorshipFormValues
  team?: TeamFormValues
  teamMember?: TeamMemberFormValues
  vendor?: VendorFormValues
  marketing?: MarketingFormValues
}

const eventSchema = z.object({
  eventId: z.string().uuid('Event ID must be a valid UUID')
})

const basicSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  eventType: z.enum(['conference', 'concert', 'festival', 'corporate', 'wedding', 'other']),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  timezone: z.string().min(1).default('UTC'),
  capacity: z.coerce.number().int().nonnegative().optional(),
  isPublic: z.boolean().default(false)
})

const venueSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  capacity: z.coerce.number().int().nonnegative().optional(),
  rentalCost: z.coerce.number().nonnegative().optional(),
  setupRequirements: z.string().optional(),
  technicalRequirements: z.string().optional()
})

const budgetSchema = z.object({
  totalBudget: z.coerce.number().nonnegative()
})

const revenueSchema = z.object({
  name: z.string().min(1),
  estimatedAmount: z.coerce.number().nonnegative(),
  probability: z.coerce.number().nonnegative()
})

const expenseSchema = z.object({
  category: z.string().min(1),
  estimatedAmount: z.coerce.number().nonnegative(),
  description: z.string().optional()
})

const sponsorshipSchema = z.object({
  name: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  benefits: z.string().optional()
})

const teamSchema = z.object({
  projectManager: z.string().optional()
})

const teamMemberSchema = z.object({
  role: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  responsibilities: z.string().optional()
})

const vendorSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  contact: z.string().min(1),
  contractValue: z.coerce.number().nonnegative().optional()
})

const marketingSchema = z.object({
  targetAudience: z.string().optional(),
  marketingChannels: z.string().optional(),
  promotionalMaterials: z.string().optional(),
  communicationPlan: z.string().optional(),
  ticketingStrategy: z.string().optional()
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
  dataKey: keyof EventCreationWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as EventCreationWizardData)[opts.dataKey] as T | undefined
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

const EventStep = createStep<EventFormValues>({
  schema: eventSchema,
  dataKey: 'event',
  defaults: { eventId: '' },
  render: (form) => <>{simpleInput('Event ID', 'eventId', form)}</>
})

const BasicStep = createStep<BasicFormValues>({
  schema: basicSchema,
  dataKey: 'basic',
  defaults: {
    title: '',
    category: '',
    eventType: 'conference',
    startDate: '',
    endDate: '',
    timezone: 'UTC',
    isPublic: false
  },
  render: (form) => (
    <>
      {simpleInput('Title', 'title', form)}
      {simpleTextarea('Description', 'description', form)}
      {simpleInput('Category', 'category', form)}
      {simpleInput('Event Type', 'eventType', form)}
      {simpleInput('Start Date', 'startDate', form, 'datetime-local')}
      {simpleInput('End Date', 'endDate', form, 'datetime-local')}
      {simpleInput('Timezone', 'timezone', form)}
      {simpleInput('Capacity', 'capacity', form, 'number')}
      <FormField control={form.control} name={'isPublic' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Public Event</FormLabel>
          <FormControl>
            <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}/>
    </>
  )
})

const VenueStep = createStep<VenueFormValues>({
  schema: venueSchema,
  dataKey: 'venue',
  defaults: { name: '', address: '' },
  render: (form) => (
    <>
      {simpleInput('Venue Name', 'name', form)}
      {simpleTextarea('Address', 'address', form)}
      {simpleInput('Capacity', 'capacity', form, 'number')}
      {simpleInput('Rental Cost', 'rentalCost', form, 'number')}
      {simpleTextarea('Setup Requirements (comma separated)', 'setupRequirements', form)}
      {simpleTextarea('Technical Requirements (comma separated)', 'technicalRequirements', form)}
    </>
  )
})

const BudgetStep = createStep<BudgetFormValues & RevenueFormValues & ExpenseFormValues & SponsorshipFormValues>({
  schema: budgetSchema.merge(revenueSchema).merge(expenseSchema).merge(sponsorshipSchema),
  dataKey: 'budget',
  defaults: {
    totalBudget: 0,
    name: '',
    estimatedAmount: 0,
    probability: 0,
    category: '',
    estimatedAmount_1: undefined,
    sponsorshipName: undefined
  } as unknown as BudgetFormValues & RevenueFormValues & ExpenseFormValues & SponsorshipFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Budget</div>
      {simpleInput('Total Budget', 'totalBudget', form, 'number')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Revenue Stream</div>
      {simpleInput('Name', 'name', form)}
      {simpleInput('Estimated Amount', 'estimatedAmount', form, 'number')}
      {simpleInput('Probability', 'probability', form, 'number')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Expense Category</div>
      {simpleInput('Category', 'category', form)}
      {simpleInput('Estimated Amount', 'estimatedAmount', form, 'number')}
      {simpleTextarea('Description', 'description', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Sponsorship Tier</div>
      {simpleInput('Sponsorship Name', 'name', form)}
      {simpleInput('Amount', 'amount', form, 'number')}
      {simpleTextarea('Benefits (comma separated)', 'benefits', form)}
    </>
  )
})

const TeamStep = createStep<TeamFormValues & TeamMemberFormValues & VendorFormValues>({
  schema: teamSchema.merge(teamMemberSchema).merge(vendorSchema),
  dataKey: 'team',
  defaults: {
    projectManager: '',
    role: '',
    name: '',
    email: '',
    type: '',
    contact: ''
  } as unknown as TeamFormValues & TeamMemberFormValues & VendorFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Team</div>
      {simpleInput('Project Manager', 'projectManager', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Team Member</div>
      {simpleInput('Role', 'role', form)}
      {simpleInput('Name', 'name', form)}
      {simpleInput('Email', 'email', form)}
      {simpleTextarea('Responsibilities (comma separated)', 'responsibilities', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Vendor</div>
      {simpleInput('Type', 'type', form)}
      {simpleInput('Vendor Name', 'name', form)}
      {simpleInput('Contact', 'contact', form)}
      {simpleInput('Contract Value', 'contractValue', form, 'number')}
    </>
  )
})

const MarketingStep = createStep<MarketingFormValues>({
  schema: marketingSchema,
  dataKey: 'marketing',
  defaults: {},
  render: (form) => (
    <>
      {simpleTextarea('Target Audience (comma separated)', 'targetAudience', form)}
      {simpleTextarea('Marketing Channels (comma separated)', 'marketingChannels', form)}
      {simpleTextarea('Promotional Materials (comma separated)', 'promotionalMaterials', form)}
      {simpleTextarea('Communication Plan', 'communicationPlan', form, 4)}
      {simpleTextarea('Ticketing Strategy', 'ticketingStrategy', form, 4)}
    </>
  )
})

const steps = [
  { id: 'event', title: 'Event Context', description: 'Provide event reference', component: EventStep },
  { id: 'basic', title: 'Basic Info', description: 'Core event details', component: BasicStep },
  { id: 'venue', title: 'Venue & Logistics', description: 'Venue, setup, technicals', component: VenueStep },
  { id: 'budget', title: 'Budget & Financials', description: 'Budget, revenue, expenses, sponsorship', component: BudgetStep },
  { id: 'team', title: 'Team & Vendors', description: 'Team roles and vendors', component: TeamStep },
  { id: 'marketing', title: 'Marketing & Communications', description: 'Audience, channels, ticketing', component: MarketingStep }
]

export function EventCreationWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as EventCreationWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')

      if (!data.event?.eventId) throw new Error('Event ID is required')
      const eventId = data.event.eventId

      if (data.basic) {
        const b = data.basic
        const { error } = await supabase.from('event_creation_basic_info').insert({
          event_id: eventId,
          title: b.title,
          description: b.description || null,
          category: b.category,
          event_type: b.eventType,
          start_date: b.startDate,
          end_date: b.endDate,
          timezone: b.timezone,
          capacity: b.capacity ?? null,
          is_public: b.isPublic
        })
        if (error) throw error
      }

      if (data.venue) {
        const v = data.venue
        const { error } = await supabase.from('event_creation_venue').insert({
          event_id: eventId,
          name: v.name,
          address: v.address,
          capacity: v.capacity ?? null,
          rental_cost: v.rentalCost ?? null,
          setup_requirements: parseCsv(v.setupRequirements),
          technical_requirements: parseCsv(v.technicalRequirements)
        })
        if (error) throw error
      }

      let budgetId: string | undefined
      if (data.budget) {
        const b = data.budget as BudgetFormValues
        const { data: budgetRow, error } = await supabase
          .from('event_creation_budget')
          .insert({ event_id: eventId, total_budget: b.totalBudget })
          .select('id')
          .single()
        if (error) throw error
        budgetId = budgetRow.id

        const rev = data.budget as unknown as RevenueFormValues
        const { error: revError } = await supabase.from('event_creation_revenue_streams').insert({
          budget_id: budgetId,
          name: rev.name,
          estimated_amount: rev.estimatedAmount,
          probability: rev.probability
        })
        if (revError) throw revError

        const exp = data.budget as unknown as ExpenseFormValues
        const { error: expError } = await supabase.from('event_creation_expense_categories').insert({
          budget_id: budgetId,
          category: exp.category,
          estimated_amount: exp.estimatedAmount,
          description: exp.description || null
        })
        if (expError) throw expError

        const sp = data.budget as unknown as SponsorshipFormValues
        const { error: spError } = await supabase.from('event_creation_sponsorship_tiers').insert({
          budget_id: budgetId,
          name: sp.name,
          amount: sp.amount,
          benefits: sp.benefits ? parseCsv(sp.benefits) : null
        })
        if (spError) throw spError
      }

      let teamId: string | undefined
      if (data.team) {
        const t = data.team as TeamFormValues
        const { data: teamRow, error } = await supabase
          .from('event_creation_team')
          .insert({ event_id: eventId, project_manager: t.projectManager || null })
          .select('id')
          .single()
        if (error) throw error
        teamId = teamRow.id

        const tm = data.team as unknown as TeamMemberFormValues
        const { error: tmError } = await supabase.from('event_creation_team_members').insert({
          team_id: teamId,
          role: tm.role,
          name: tm.name,
          email: tm.email,
          responsibilities: tm.responsibilities ? parseCsv(tm.responsibilities) : null
        })
        if (tmError) throw tmError

        const tv = data.team as unknown as VendorFormValues
        const { error: vendorError } = await supabase.from('event_creation_vendors').insert({
          team_id: teamId,
          type: tv.type,
          name: tv.name,
          contact: tv.contact,
          contract_value: tv.contractValue ?? null
        })
        if (vendorError) throw vendorError
      }

      if (data.marketing) {
        const m = data.marketing
        const { error } = await supabase.from('event_creation_marketing').insert({
          event_id: eventId,
          target_audience: m.targetAudience ? parseCsv(m.targetAudience) : null,
          marketing_channels: m.marketingChannels ? parseCsv(m.marketingChannels) : null,
          promotional_materials: m.promotionalMaterials ? parseCsv(m.promotionalMaterials) : null,
          communication_plan: m.communicationPlan || null,
          ticketing_strategy: m.ticketingStrategy || null
        })
        if (error) throw error
      }
    } catch (error) {
      logger.error('Event creation workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Event Creation Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Define event details, logistics, budget, team, marketing, schedule, and risk with full traceability.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="event-creation-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving event records...</p>}
      </div>
    </div>
  )
}

export default EventCreationWorkflow
