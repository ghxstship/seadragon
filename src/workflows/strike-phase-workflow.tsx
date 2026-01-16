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
type TeardownScheduleFormValues = z.infer<typeof teardownScheduleSchema>
type TeardownInventoryFormValues = z.infer<typeof teardownInventorySchema>
type TeardownChecklistFormValues = z.infer<typeof teardownChecklistSchema>
type LoadoutTruckFormValues = z.infer<typeof loadoutTruckSchema>
type LoadoutPermitFormValues = z.infer<typeof loadoutPermitSchema>
type ReturnsRentalFormValues = z.infer<typeof returnsRentalSchema>
type ReturnsOwnedFormValues = z.infer<typeof returnsOwnedSchema>
type CleanupFormValues = z.infer<typeof cleanupSchema>
type RepairFormValues = z.infer<typeof repairSchema>
type WasteFormValues = z.infer<typeof wasteSchema>
type InspectionVenueFormValues = z.infer<typeof inspectionVenueSchema>
type InspectionEquipmentFormValues = z.infer<typeof inspectionEquipmentSchema>
type LostItemFormValues = z.infer<typeof lostItemSchema>
type LostProcessingFormValues = z.infer<typeof lostProcessingSchema>
type SecurityPatrolFormValues = z.infer<typeof securityPatrolSchema>
type SecurityMonitoringFormValues = z.infer<typeof securityMonitoringSchema>
type SecurityHandoverFormValues = z.infer<typeof securityHandoverSchema>

type StrikeWizardData = {
  event?: EventFormValues
  teardownSchedule?: TeardownScheduleFormValues
  teardownInventory?: TeardownInventoryFormValues
  teardownChecklist?: TeardownChecklistFormValues
  loadoutTruck?: LoadoutTruckFormValues
  loadoutPermit?: LoadoutPermitFormValues
  returnsRental?: ReturnsRentalFormValues
  returnsOwned?: ReturnsOwnedFormValues
  cleanup?: CleanupFormValues
  repair?: RepairFormValues
  waste?: WasteFormValues
  inspectionVenue?: InspectionVenueFormValues
  inspectionEquipment?: InspectionEquipmentFormValues
  lostItem?: LostItemFormValues
  lostProcessing?: LostProcessingFormValues
  securityPatrol?: SecurityPatrolFormValues
  securityMonitoring?: SecurityMonitoringFormValues
  securityHandover?: SecurityHandoverFormValues
}

const eventSchema = z.object({
  eventId: z.string().uuid('Event ID must be a valid UUID')
})

const teardownScheduleSchema = z.object({
  time: z.string().min(1),
  activity: z.string().min(1),
  location: z.string().optional(),
  team: z.string().optional(),
  equipment: z.string().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed']).default('scheduled')
})

const teardownInventorySchema = z.object({
  item: z.string().min(1),
  location: z.string().optional(),
  condition: z.string().optional(),
  packed: z.boolean().default(false),
  responsible: z.string().optional()
})

const teardownChecklistSchema = z.object({
  area: z.string().min(1),
  items: z.string().optional(),
  inspector: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending')
})

const loadoutTruckSchema = z.object({
  truckId: z.string().min(1),
  driver: z.string().optional(),
  capacity: z.string().optional(),
  loadOrder: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(['pending', 'loading', 'loaded', 'departed']).default('pending')
})

const loadoutPermitSchema = z.object({
  permitType: z.string().min(1),
  permitNumber: z.string().optional(),
  issuedBy: z.string().optional(),
  validUntil: z.string().optional(),
  status: z.enum(['valid', 'expired', 'revoked']).default('valid')
})

const returnsRentalSchema = z.object({
  item: z.string().min(1),
  rentalCompany: z.string().optional(),
  returnDate: z.string().optional(),
  condition: z.string().optional(),
  status: z.enum(['pending', 'returned', 'overdue']).default('pending')
})

const returnsOwnedSchema = z.object({
  item: z.string().min(1),
  storageLocation: z.string().optional(),
  condition: z.string().optional(),
  needsRepair: z.boolean().default(false),
  status: z.enum(['pending', 'stored', 'repaired']).default('pending')
})

const cleanupSchema = z.object({
  area: z.string().min(1),
  task: z.string().min(1),
  assignedTo: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  completionDate: z.string().optional()
})

const repairSchema = z.object({
  item: z.string().min(1),
  damageDescription: z.string().optional(),
  repairCost: z.string().optional(),
  repairCompany: z.string().optional(),
  status: z.enum(['pending', 'quoted', 'approved', 'completed']).default('pending')
})

const wasteSchema = z.object({
  wasteType: z.string().min(1),
  volume: z.string().optional(),
  disposalMethod: z.string().optional(),
  cost: z.string().optional(),
  status: z.enum(['pending', 'collected', 'disposed']).default('pending')
})

const inspectionVenueSchema = z.object({
  area: z.string().min(1),
  inspector: z.string().optional(),
  status: z.enum(['pending', 'passed', 'failed']).default('pending'),
  notes: z.string().optional(),
  inspectionDate: z.string().optional()
})

const inspectionEquipmentSchema = z.object({
  equipment: z.string().min(1),
  inspector: z.string().optional(),
  status: z.enum(['pending', 'passed', 'failed']).default('pending'),
  condition: z.string().optional(),
  notes: z.string().optional(),
  inspectionDate: z.string().optional()
})

const lostItemSchema = z.object({
  item: z.string().min(1),
  description: z.string().optional(),
  locationFound: z.string().optional(),
  claimant: z.string().optional(),
  claimantContact: z.string().optional(),
  status: z.enum(['found', 'claimed', 'disposed']).default('found'),
  dateFound: z.string().optional(),
  dateClaimed: z.string().optional()
})

const lostProcessingSchema = z.object({
  totalIntake: z.coerce.number().int().nonnegative().default(0),
  totalClaimed: z.coerce.number().int().nonnegative().default(0),
  totalUnclaimed: z.coerce.number().int().nonnegative().default(0),
  totalDonated: z.coerce.number().int().nonnegative().default(0),
  totalDisposed: z.coerce.number().int().nonnegative().default(0)
})

const securityPatrolSchema = z.object({
  time: z.string().min(1),
  area: z.string().min(1),
  officer: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'missed']).default('scheduled'),
  notes: z.string().optional()
})

const securityMonitoringSchema = z.object({
  system: z.string().min(1),
  status: z.enum(['active', 'inactive', 'error']).default('active'),
  lastCheck: z.string().optional(),
  notes: z.string().optional()
})

const securityHandoverSchema = z.object({
  fromOfficer: z.string().min(1),
  toOfficer: z.string().min(1),
  handoverDate: z.string().optional(),
  assetsSecured: z.string().optional(),
  documentationComplete: z.boolean().default(false),
  status: z.enum(['pending', 'completed']).default('pending')
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
  dataKey: keyof StrikeWizardData
  defaults: T
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as StrikeWizardData)[opts.dataKey] as T | undefined
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

const TeardownStep = createStep<
  TeardownScheduleFormValues & TeardownInventoryFormValues & TeardownChecklistFormValues
>({
  schema: teardownScheduleSchema
    .merge(teardownInventorySchema)
    .merge(teardownChecklistSchema),
  dataKey: 'teardownSchedule',
  defaults: {
    time: '',
    activity: '',
    location: '',
    team: '',
    equipment: '',
    status: 'scheduled',
    item: '',
    condition: '',
    packed: false,
    responsible: '',
    area: '',
    items: '',
    inspector: '',
    locationFound: undefined
  } as unknown as TeardownScheduleFormValues & TeardownInventoryFormValues & TeardownChecklistFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Teardown Schedule</div>
      {simpleInput('Time', 'time', form)}
      {simpleInput('Activity', 'activity', form)}
      {simpleInput('Location', 'location', form)}
      {simpleInput('Team', 'team', form)}
      {simpleInput('Equipment (comma separated)', 'equipment', form)}
      {simpleInput('Status', 'status', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Inventory</div>
      {simpleInput('Item', 'item', form)}
      {simpleInput('Condition', 'condition', form)}
      {simpleInput('Location', 'location', form)}
      <FormField
        control={form.control}
        name={'packed' as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Packed</FormLabel>
            <FormControl>
              <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {simpleInput('Responsible', 'responsible', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Checklist</div>
      {simpleInput('Area', 'area', form)}
      {simpleInput('Items (comma separated)', 'items', form)}
      {simpleInput('Inspector', 'inspector', form)}
      {simpleInput('Status', 'status', form)}
    </>
  )
})

const LoadoutStep = createStep<LoadoutTruckFormValues & LoadoutPermitFormValues>({
  schema: loadoutTruckSchema.merge(loadoutPermitSchema),
  dataKey: 'loadoutTruck',
  defaults: {
    truckId: '',
    driver: '',
    capacity: '',
    status: 'pending',
    permitType: '',
    status_1: undefined
  } as unknown as LoadoutTruckFormValues & LoadoutPermitFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Loadout Truck</div>
      {simpleInput('Truck ID', 'truckId', form)}
      {simpleInput('Driver', 'driver', form)}
      {simpleInput('Capacity', 'capacity', form)}
      {simpleInput('Load Order', 'loadOrder', form, 'number')}
      {simpleInput('Status', 'status', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Permit</div>
      {simpleInput('Permit Type', 'permitType', form)}
      {simpleInput('Permit Number', 'permitNumber', form)}
      {simpleInput('Issued By', 'issuedBy', form)}
      {simpleInput('Valid Until', 'validUntil', form, 'date')}
      {simpleInput('Permit Status', 'status', form)}
    </>
  )
})

const ReturnsStep = createStep<ReturnsRentalFormValues & ReturnsOwnedFormValues>({
  schema: returnsRentalSchema.merge(returnsOwnedSchema),
  dataKey: 'returnsRental',
  defaults: {
    item: '',
    status: 'pending',
    storageLocation: '',
    needsRepair: false
  } as unknown as ReturnsRentalFormValues & ReturnsOwnedFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Rental Returns</div>
      {simpleInput('Item', 'item', form)}
      {simpleInput('Rental Company', 'rentalCompany', form)}
      {simpleInput('Return Date', 'returnDate', form, 'date')}
      {simpleInput('Condition', 'condition', form)}
      {simpleInput('Status', 'status', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Owned Returns</div>
      {simpleInput('Storage Location', 'storageLocation', form)}
      {simpleInput('Condition (Owned)', 'condition', form)}
      <FormField
        control={form.control}
        name={'needsRepair' as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Needs Repair</FormLabel>
            <FormControl>
              <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {simpleInput('Owned Status', 'status', form)}
    </>
  )
})

const RestorationStep = createStep<CleanupFormValues & RepairFormValues>({
  schema: cleanupSchema.merge(repairSchema),
  dataKey: 'cleanup',
  defaults: {
    area: '',
    task: '',
    status: 'pending',
    item: '',
    status_1: undefined
  } as unknown as CleanupFormValues & RepairFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Cleanup</div>
      {simpleInput('Area', 'area', form)}
      {simpleInput('Task', 'task', form)}
      {simpleInput('Assigned To', 'assignedTo', form)}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Completion Date', 'completionDate', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Repairs</div>
      {simpleInput('Item', 'item', form)}
      {simpleTextarea('Damage Description', 'damageDescription', form)}
      {simpleInput('Repair Cost', 'repairCost', form, 'number')}
      {simpleInput('Repair Company', 'repairCompany', form)}
      {simpleInput('Repair Status', 'status', form)}
    </>
  )
})

const WasteStep = createStep<WasteFormValues>({
  schema: wasteSchema,
  dataKey: 'waste',
  defaults: { wasteType: '', status: 'pending' },
  render: (form) => (
    <>
      {simpleInput('Waste Type', 'wasteType', form)}
      {simpleInput('Volume', 'volume', form)}
      {simpleInput('Disposal Method', 'disposalMethod', form)}
      {simpleInput('Cost', 'cost', form, 'number')}
      {simpleInput('Status', 'status', form)}
    </>
  )
})

const InspectionStep = createStep<InspectionVenueFormValues & InspectionEquipmentFormValues>({
  schema: inspectionVenueSchema.merge(inspectionEquipmentSchema),
  dataKey: 'inspectionVenue',
  defaults: {
    area: '',
    status: 'pending',
    equipment: '',
    status_1: undefined
  } as unknown as InspectionVenueFormValues & InspectionEquipmentFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Venue Inspection</div>
      {simpleInput('Area', 'area', form)}
      {simpleInput('Inspector', 'inspector', form)}
      {simpleInput('Status', 'status', form)}
      {simpleTextarea('Notes', 'notes', form)}
      {simpleInput('Inspection Date', 'inspectionDate', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Equipment Inspection</div>
      {simpleInput('Equipment', 'equipment', form)}
      {simpleInput('Inspector (Equipment)', 'inspector', form)}
      {simpleInput('Status (Equipment)', 'status', form)}
      {simpleInput('Condition', 'condition', form)}
      {simpleTextarea('Notes (Equipment)', 'notes', form)}
      {simpleInput('Inspection Date (Equipment)', 'inspectionDate', form, 'datetime-local')}
    </>
  )
})

const LostAndFoundStep = createStep<LostItemFormValues & LostProcessingFormValues>({
  schema: lostItemSchema.merge(lostProcessingSchema),
  dataKey: 'lostItem',
  defaults: {
    item: '',
    status: 'found',
    totalIntake: 0,
    totalClaimed: 0,
    totalUnclaimed: 0,
    totalDonated: 0,
    totalDisposed: 0
  } as unknown as LostItemFormValues & LostProcessingFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Lost Item</div>
      {simpleInput('Item', 'item', form)}
      {simpleTextarea('Description', 'description', form)}
      {simpleInput('Location Found', 'locationFound', form)}
      {simpleInput('Claimant', 'claimant', form)}
      {simpleInput('Claimant Contact', 'claimantContact', form)}
      {simpleInput('Status', 'status', form)}
      {simpleInput('Date Found', 'dateFound', form, 'datetime-local')}
      {simpleInput('Date Claimed', 'dateClaimed', form, 'datetime-local')}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Processing Totals</div>
      {simpleInput('Total Intake', 'totalIntake', form, 'number')}
      {simpleInput('Total Claimed', 'totalClaimed', form, 'number')}
      {simpleInput('Total Unclaimed', 'totalUnclaimed', form, 'number')}
      {simpleInput('Total Donated', 'totalDonated', form, 'number')}
      {simpleInput('Total Disposed', 'totalDisposed', form, 'number')}
    </>
  )
})

const SecurityStep = createStep<
  SecurityPatrolFormValues & SecurityMonitoringFormValues & SecurityHandoverFormValues
>({
  schema: securityPatrolSchema
    .merge(securityMonitoringSchema)
    .merge(securityHandoverSchema),
  dataKey: 'securityPatrol',
  defaults: {
    time: '',
    area: '',
    status: 'scheduled',
    system: '',
    status_1: undefined,
    fromOfficer: '',
    toOfficer: '',
    documentationComplete: false,
    status_2: undefined
  } as unknown as SecurityPatrolFormValues & SecurityMonitoringFormValues & SecurityHandoverFormValues,
  render: (form) => (
    <>
      <div className="md:col-span-2 text-sm font-semibold">Security Patrol</div>
      {simpleInput('Time', 'time', form)}
      {simpleInput('Area', 'area', form)}
      {simpleInput('Officer', 'officer', form)}
      {simpleInput('Status', 'status', form)}
      {simpleTextarea('Notes', 'notes', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Monitoring</div>
      {simpleInput('System', 'system', form)}
      {simpleInput('Monitoring Status', 'status', form)}
      {simpleInput('Last Check', 'lastCheck', form, 'datetime-local')}
      {simpleTextarea('Monitoring Notes', 'notes', form)}

      <div className="md:col-span-2 text-sm font-semibold mt-2">Handover</div>
      {simpleInput('From Officer', 'fromOfficer', form)}
      {simpleInput('To Officer', 'toOfficer', form)}
      {simpleInput('Handover Date', 'handoverDate', form, 'datetime-local')}
      {simpleInput('Assets Secured (comma separated)', 'assetsSecured', form)}
      <FormField
        control={form.control}
        name={'documentationComplete' as never}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Documentation Complete</FormLabel>
            <FormControl>
              <Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {simpleInput('Handover Status', 'status', form)}
    </>
  )
})

const steps = [
  { id: 'event', title: 'Event Context', description: 'Provide event identifier', component: EventStep },
  { id: 'teardown', title: 'Teardown & Inventory', description: 'Schedule, inventory, checklist', component: TeardownStep },
  { id: 'loadout', title: 'Loadout & Permits', description: 'Transport planning and permits', component: LoadoutStep },
  { id: 'returns', title: 'Returns & Documentation', description: 'Rental and owned returns', component: ReturnsStep },
  { id: 'restoration', title: 'Restoration & Cleanup', description: 'Cleanup and repairs', component: RestorationStep },
  { id: 'waste', title: 'Waste & Recycling', description: 'Disposal tracking', component: WasteStep },
  { id: 'inspections', title: 'Inspections & Sign-off', description: 'Venue and equipment inspections', component: InspectionStep },
  { id: 'lostfound', title: 'Lost & Found', description: 'Lost items and processing totals', component: LostAndFoundStep },
  { id: 'security', title: 'Security & Handover', description: 'Patrols, monitoring, handover', component: SecurityStep }
]

export default function StrikePhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as StrikeWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')

      if (!data.event?.eventId) throw new Error('Event ID is required')
      const eventId = data.event.eventId

      if (data.teardownSchedule) {
        const ts = data.teardownSchedule as TeardownScheduleFormValues
        const ti = data.teardownSchedule as unknown as TeardownInventoryFormValues
        const tc = data.teardownSchedule as unknown as TeardownChecklistFormValues
        const { error } = await supabase.from('strike_teardown_schedule').insert({
          event_id: eventId,
          time: ts.time,
          activity: ts.activity,
          location: ts.location || null,
          team: ts.team || null,
          equipment: parseCsv(ts.equipment),
          status: ts.status
        })
        if (error) throw error

        const { error: invError } = await supabase.from('strike_teardown_inventory').insert({
          event_id: eventId,
          item: ti.item,
          location: ti.location || null,
          condition: ti.condition || null,
          packed: ti.packed,
          responsible: ti.responsible || null
        })
        if (invError) throw invError

        const { error: checklistError } = await supabase.from('strike_teardown_checklists').insert({
          event_id: eventId,
          area: tc.area,
          items: parseCsv(tc.items),
          inspector: tc.inspector || null,
          status: tc.status
        })
        if (checklistError) throw checklistError
      }

      if (data.loadoutTruck) {
        const lt = data.loadoutTruck as LoadoutTruckFormValues
        const lp = data.loadoutTruck as unknown as LoadoutPermitFormValues
        const { error } = await supabase.from('strike_loadout_trucks').insert({
          event_id: eventId,
          truck_id: lt.truckId,
          driver: lt.driver || null,
          capacity: lt.capacity ? Number(lt.capacity) : null,
          load_order: lt.loadOrder ?? null,
          status: lt.status
        })
        if (error) throw error

        const { error: permitError } = await supabase.from('strike_loadout_permits').insert({
          event_id: eventId,
          permit_type: lp.permitType,
          permit_number: lp.permitNumber || null,
          issued_by: lp.issuedBy || null,
          valid_until: lp.validUntil || null,
          status: lp.status
        })
        if (permitError) throw permitError
      }

      if (data.returnsRental) {
        const rr = data.returnsRental as ReturnsRentalFormValues
        const ro = data.returnsRental as unknown as ReturnsOwnedFormValues
        const { error } = await supabase.from('strike_returns_rentals').insert({
          event_id: eventId,
          item: rr.item,
          rental_company: rr.rentalCompany || null,
          return_date: rr.returnDate || null,
          condition: rr.condition || null,
          status: rr.status
        })
        if (error) throw error

        const { error: ownedError } = await supabase.from('strike_returns_owned').insert({
          event_id: eventId,
          item: ro.item,
          storage_location: ro.storageLocation || null,
          condition: ro.condition || null,
          needs_repair: ro.needsRepair,
          status: ro.status
        })
        if (ownedError) throw ownedError
      }

      if (data.cleanup) {
        const cl = data.cleanup as CleanupFormValues
        const rp = data.cleanup as unknown as RepairFormValues
        const { error } = await supabase.from('strike_restoration_cleanup').insert({
          event_id: eventId,
          area: cl.area,
          task: cl.task,
          assigned_to: cl.assignedTo || null,
          status: cl.status,
          completion_date: cl.completionDate || null
        })
        if (error) throw error

        const { error: repairError } = await supabase.from('strike_restoration_repairs').insert({
          event_id: eventId,
          item: rp.item,
          damage_description: rp.damageDescription || null,
          repair_cost: rp.repairCost ? Number(rp.repairCost) : null,
          repair_company: rp.repairCompany || null,
          status: rp.status
        })
        if (repairError) throw repairError
      }

      if (data.waste) {
        const ws = data.waste as WasteFormValues
        const { error } = await supabase.from('strike_waste_collection').insert({
          event_id: eventId,
          waste_type: ws.wasteType,
          volume: ws.volume ? Number(ws.volume) : null,
          disposal_method: ws.disposalMethod || null,
          cost: ws.cost ? Number(ws.cost) : null,
          status: ws.status
        })
        if (error) throw error
      }

      if (data.inspectionVenue) {
        const iv = data.inspectionVenue as InspectionVenueFormValues
        const ie = data.inspectionVenue as unknown as InspectionEquipmentFormValues
        const { error } = await supabase.from('strike_inspections_venue').insert({
          event_id: eventId,
          area: iv.area,
          inspector: iv.inspector || null,
          status: iv.status,
          notes: iv.notes || null,
          inspection_date: iv.inspectionDate || null
        })
        if (error) throw error

        const { error: equipError } = await supabase.from('strike_inspections_equipment').insert({
          event_id: eventId,
          equipment: ie.equipment,
          inspector: ie.inspector || null,
          status: ie.status,
          condition: ie.condition || null,
          notes: ie.notes || null,
          inspection_date: ie.inspectionDate || null
        })
        if (equipError) throw equipError
      }

      if (data.lostItem) {
        const li = data.lostItem as LostItemFormValues
        const lp = data.lostItem as unknown as LostProcessingFormValues
        const { error } = await supabase.from('strike_lost_found_items').insert({
          event_id: eventId,
          item: li.item,
          description: li.description || null,
          location_found: li.locationFound || null,
          claimant: li.claimant || null,
          claimant_contact: li.claimantContact || null,
          status: li.status,
          date_found: li.dateFound || null,
          date_claimed: li.dateClaimed || null
        })
        if (error) throw error

        const { error: processingError } = await supabase.from('strike_lost_found_processing').insert({
          event_id: eventId,
          total_intake: lp.totalIntake,
          total_claimed: lp.totalClaimed,
          total_unclaimed: lp.totalUnclaimed,
          total_donated: lp.totalDonated,
          total_disposed: lp.totalDisposed
        })
        if (processingError) throw processingError
      }

      if (data.securityPatrol) {
        const sp = data.securityPatrol as SecurityPatrolFormValues
        const sm = data.securityPatrol as unknown as SecurityMonitoringFormValues
        const sh = data.securityPatrol as unknown as SecurityHandoverFormValues
        const { error } = await supabase.from('strike_security_patrols').insert({
          event_id: eventId,
          time: sp.time,
          area: sp.area,
          officer: sp.officer || null,
          status: sp.status,
          notes: sp.notes || null
        })
        if (error) throw error

        const { error: monitoringError } = await supabase.from('strike_security_monitoring').insert({
          event_id: eventId,
          system: sm.system,
          status: sm.status,
          last_check: sm.lastCheck || null,
          notes: sm.notes || null
        })
        if (monitoringError) throw monitoringError

        const { error: handoverError } = await supabase.from('strike_security_handover').insert({
          event_id: eventId,
          from_officer: sh.fromOfficer,
          to_officer: sh.toOfficer,
          handover_date: sh.handoverDate || null,
          assets_secured: parseCsv(sh.assetsSecured),
          documentation_complete: sh.documentationComplete,
          status: sh.status
        })
        if (handoverError) throw handoverError
      }
    } catch (error) {
      logger.error('Strike phase workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Strike Phase Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Teardown, transport, returns, cleanup, inspections, and lost & found with full traceability.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="strike-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving strike records...</p>}
      </div>
    </div>
  )
}
