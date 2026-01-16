"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
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

interface AssetWizardData {
  catalog?: CatalogFormValues
  movement?: MovementFormValues
  maintenance?: MaintenanceFormValues
  depreciation?: DepreciationFormValues
  lifecycle?: LifecycleFormValues
  audit?: AuditFormValues
  analytics?: AnalyticsFormValues
}

type CatalogFormValues = z.infer<typeof catalogSchema>
type MovementFormValues = z.infer<typeof movementSchema>
type MaintenanceFormValues = z.infer<typeof maintenanceSchema>
type DepreciationFormValues = z.infer<typeof depreciationSchema>
type LifecycleFormValues = z.infer<typeof lifecycleSchema>
type AuditFormValues = z.infer<typeof auditSchema>
type AnalyticsFormValues = z.infer<typeof analyticsSchema>

const catalogSchema = z.object({
  eventId: z.string().uuid({ message: 'Event ID is required (UUID)' }),
  name: z.string().min(2),
  category: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().min(1, { message: 'Serial required' }),
  purchaseDate: z.string().optional(),
  purchasePrice: z.string().optional(),
  currentValue: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance', 'disposed']).default('active'),
  assignedTo: z.string().optional(),
  warrantyExpiry: z.string().optional()
})

const movementSchema = z.object({
  item: z.string().min(1),
  type: z.enum(['in', 'out', 'transfer', 'adjustment']),
  quantity: z.coerce.number().int().nonnegative(),
  fromLocation: z.string().optional(),
  toLocation: z.string().optional(),
  date: z.string(),
  performedBy: z.string().optional(),
  reason: z.string().optional(),
  reference: z.string().optional()
})

const maintenanceSchema = z.object({
  assetId: z.string().uuid({ message: 'Asset ID must be UUID' }).optional(),
  maintenanceType: z.string().min(1),
  frequency: z.string().min(1),
  nextDue: z.string().optional(),
  lastPerformed: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(['scheduled', 'overdue', 'completed']).default('scheduled')
})

const depreciationSchema = z.object({
  assetId: z.string().uuid({ message: 'Asset ID must be UUID' }).optional(),
  method: z.string().min(1),
  calculationDate: z.string(),
  accumulatedDepreciation: z.string().optional(),
  bookValue: z.string().optional()
})

const lifecycleSchema = z.object({
  assetId: z.string().uuid({ message: 'Asset ID must be UUID' }).optional(),
  action: z.enum(['acquisition', 'transfer', 'disposal']),
  details: z.string().optional(),
  fromLocation: z.string().optional(),
  toLocation: z.string().optional(),
  proceeds: z.string().optional()
})

const auditSchema = z.object({
  date: z.string(),
  location: z.string().min(1),
  auditor: z.string().min(1),
  itemsChecked: z.coerce.number().int().nonnegative(),
  discrepancies: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(['passed', 'minor_issues', 'major_issues']).default('passed'),
  findings: z.string().optional(),
  correctiveActions: z.string().optional()
})

const analyticsSchema = z.object({
  assetId: z.string().uuid({ message: 'Asset ID must be UUID' }).optional(),
  date: z.string(),
  usageHours: z.string().optional(),
  utilizationRate: z.string().optional(),
  notes: z.string().optional()
})

function CatalogStep({ data, onChange, onValidationChange }: StepProps) {
  const catalogData = (data as AssetWizardData).catalog
  const form = useForm<CatalogFormValues>({
    resolver: zodResolver(catalogSchema),
    defaultValues: {
      eventId: catalogData?.eventId || '',
      name: catalogData?.name || '',
      category: catalogData?.category || '',
      type: catalogData?.type || '',
      description: catalogData?.description || '',
      manufacturer: catalogData?.manufacturer || '',
      model: catalogData?.model || '',
      serialNumber: catalogData?.serialNumber || '',
      purchaseDate: catalogData?.purchaseDate || '',
      purchasePrice: catalogData?.purchasePrice || '',
      currentValue: catalogData?.currentValue || '',
      location: catalogData?.location || '',
      status: catalogData?.status || 'active',
      assignedTo: catalogData?.assignedTo || '',
      warrantyExpiry: catalogData?.warrantyExpiry || ''
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, catalog: values as CatalogFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="eventId" render={({ field }) => (
          <FormItem>
            <FormLabel>Event ID</FormLabel>
            <FormControl><Input placeholder="UUID" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="serialNumber" render={({ field }) => (
          <FormItem>
            <FormLabel>Serial Number</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="purchaseDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Purchase Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="purchasePrice" render={({ field }) => (
          <FormItem>
            <FormLabel>Purchase Price</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="currentValue" render={({ field }) => (
          <FormItem>
            <FormLabel>Current Value</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="assignedTo" render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned To</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="warrantyExpiry" render={({ field }) => (
          <FormItem>
            <FormLabel>Warranty Expiry</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function MovementStep({ data, onChange, onValidationChange }: StepProps) {
  const movementData = (data as AssetWizardData).movement
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: movementData || {
      item: '', type: 'in', quantity: 0, date: ''
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, movement: values as MovementFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="item" render={({ field }) => (
          <FormItem>
            <FormLabel>Item</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem>
            <FormLabel>Type (in/out/transfer/adjustment)</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="quantity" render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="fromLocation" render={({ field }) => (
          <FormItem>
            <FormLabel>From Location</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="toLocation" render={({ field }) => (
          <FormItem>
            <FormLabel>To Location</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="performedBy" render={({ field }) => (
          <FormItem>
            <FormLabel>Performed By</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="reference" render={({ field }) => (
          <FormItem>
            <FormLabel>Reference</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="reason" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Reason</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function MaintenanceStep({ data, onChange, onValidationChange }: StepProps) {
  const maintenanceData = (data as AssetWizardData).maintenance
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: maintenanceData || {
      maintenanceType: '', frequency: '', status: 'scheduled'
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, maintenance: values as MaintenanceFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="assetId" render={({ field }) => (
          <FormItem>
            <FormLabel>Asset ID</FormLabel>
            <FormControl><Input placeholder="UUID (optional to link)" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="maintenanceType" render={({ field }) => (
          <FormItem>
            <FormLabel>Maintenance Type</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="frequency" render={({ field }) => (
          <FormItem>
            <FormLabel>Frequency</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="nextDue" render={({ field }) => (
          <FormItem>
            <FormLabel>Next Due</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="lastPerformed" render={({ field }) => (
          <FormItem>
            <FormLabel>Last Performed</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="assignedTo" render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned To</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function DepreciationStep({ data, onChange, onValidationChange }: StepProps) {
  const depreciationData = (data as AssetWizardData).depreciation
  const form = useForm<DepreciationFormValues>({
    resolver: zodResolver(depreciationSchema),
    defaultValues: depreciationData || {
      method: '', calculationDate: ''
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, depreciation: values as DepreciationFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="assetId" render={({ field }) => (
          <FormItem>
            <FormLabel>Asset ID</FormLabel>
            <FormControl><Input placeholder="UUID (optional to link)" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="method" render={({ field }) => (
          <FormItem>
            <FormLabel>Method</FormLabel>
            <FormControl><Input placeholder="e.g., straight_line" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="calculationDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Calculation Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="accumulatedDepreciation" render={({ field }) => (
          <FormItem>
            <FormLabel>Accumulated Depreciation</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="bookValue" render={({ field }) => (
          <FormItem>
            <FormLabel>Book Value</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function LifecycleStep({ data, onChange, onValidationChange }: StepProps) {
  const lifecycleData = (data as AssetWizardData).lifecycle
  const form = useForm<LifecycleFormValues>({
    resolver: zodResolver(lifecycleSchema),
    defaultValues: lifecycleData || {
      action: 'acquisition'
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, lifecycle: values as LifecycleFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="assetId" render={({ field }) => (
          <FormItem>
            <FormLabel>Asset ID</FormLabel>
            <FormControl><Input placeholder="UUID (optional to link)" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="action" render={({ field }) => (
          <FormItem>
            <FormLabel>Action (acquisition/transfer/disposal)</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="fromLocation" render={({ field }) => (
          <FormItem>
            <FormLabel>From Location</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="toLocation" render={({ field }) => (
          <FormItem>
            <FormLabel>To Location</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="proceeds" render={({ field }) => (
          <FormItem>
            <FormLabel>Proceeds (for disposal)</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="details" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Details</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function AuditStep({ data, onChange, onValidationChange }: StepProps) {
  const auditData = (data as AssetWizardData).audit
  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditSchema),
    defaultValues: auditData || {
      date: '', location: '', auditor: '', itemsChecked: 0, discrepancies: 0, status: 'passed'
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, audit: values as AuditFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="auditor" render={({ field }) => (
          <FormItem>
            <FormLabel>Auditor</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="itemsChecked" render={({ field }) => (
          <FormItem>
            <FormLabel>Items Checked</FormLabel>
            <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="discrepancies" render={({ field }) => (
          <FormItem>
            <FormLabel>Discrepancies</FormLabel>
            <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl><Input {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="findings" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Findings</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="correctiveActions" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Corrective Actions</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

function AnalyticsStep({ data, onChange, onValidationChange }: StepProps) {
  const analyticsData = (data as AssetWizardData).analytics
  const form = useForm<AnalyticsFormValues>({
    resolver: zodResolver(analyticsSchema),
    defaultValues: analyticsData || {
      date: ''
    }
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange({ ...data, analytics: values as AnalyticsFormValues })
      onValidationChange?.(form.formState.isValid)
    }) as unknown as { unsubscribe?: () => void }
    return () => subscription?.unsubscribe?.()
  }, [form, data, onChange, onValidationChange])

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="assetId" render={({ field }) => (
          <FormItem>
            <FormLabel>Asset ID</FormLabel>
            <FormControl><Input placeholder="UUID (optional to link)" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl><Input type="date" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="usageHours" render={({ field }) => (
          <FormItem>
            <FormLabel>Usage Hours</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="utilizationRate" render={({ field }) => (
          <FormItem>
            <FormLabel>Utilization Rate (%)</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Notes</FormLabel>
            <FormControl><Textarea rows={3} {...field}/></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      </form>
    </Form>
  )
}

const steps = [
  { id: 'catalog', title: 'Catalog & Normalization', description: 'Create canonical asset entries', component: CatalogStep },
  { id: 'tracking', title: 'Inventory Tracking', description: 'Record movements with traceability', component: MovementStep },
  { id: 'maintenance', title: 'Maintenance Scheduling', description: 'Plan and track maintenance', component: MaintenanceStep },
  { id: 'depreciation', title: 'Depreciation', description: 'Capture depreciation calculations', component: DepreciationStep },
  { id: 'lifecycle', title: 'Lifecycle', description: 'Acquisitions, transfers, disposals', component: LifecycleStep },
  { id: 'audits', title: 'Audits & Compliance', description: 'Audit records and corrective actions', component: AuditStep },
  { id: 'analytics', title: 'Reporting & Analytics', description: 'Utilization and performance inputs', component: AnalyticsStep }
]

export default function AssetInventoryWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const catalog = (finalData as AssetWizardData).catalog
      if (!catalog) throw new Error('Catalog step is required')

      const { data: catalogInsert, error: catalogError } = await supabase
        .from('asset_inventory_catalog_assets')
        .insert({
          event_id: catalog.eventId,
          name: catalog.name,
          category: catalog.category,
          type: catalog.type,
          description: catalog.description,
          manufacturer: catalog.manufacturer,
          model: catalog.model,
          serial_number: catalog.serialNumber,
          purchase_date: catalog.purchaseDate || null,
          purchase_price: catalog.purchasePrice ? Number(catalog.purchasePrice) : null,
          current_value: catalog.currentValue ? Number(catalog.currentValue) : null,
          location: catalog.location,
          status: catalog.status,
          assigned_to: catalog.assignedTo,
          warranty_expiry: catalog.warrantyExpiry || null
        })
        .select('id')
        .single()

      if (catalogError) throw catalogError

      const assetId = catalogInsert?.id as string | undefined

      const movement = (finalData as AssetWizardData).movement
      if (movement) {
        const { error } = await supabase.from('asset_inventory_tracking_movements').insert({
          event_id: catalog.eventId,
          item: movement.item,
          type: movement.type,
          quantity: movement.quantity,
          from_location: movement.fromLocation,
          to_location: movement.toLocation,
          date: movement.date,
          performed_by: movement.performedBy,
          reason: movement.reason,
          reference: movement.reference
        })
        if (error) throw error
      }

      const maintenance = (finalData as AssetWizardData).maintenance
      if (maintenance) {
        const { error } = await supabase.from('asset_inventory_maintenance_schedules').insert({
          event_id: catalog.eventId,
          asset_id: maintenance.assetId || assetId || null,
          maintenance_type: maintenance.maintenanceType,
          frequency: maintenance.frequency,
          next_due: maintenance.nextDue || null,
          last_performed: maintenance.lastPerformed || null,
          assigned_to: maintenance.assignedTo,
          status: maintenance.status
        })
        if (error) throw error
      }

      const depreciation = (finalData as AssetWizardData).depreciation
      if (depreciation) {
        const { error } = await supabase.from('asset_inventory_analytics_depreciation').insert({
          event_id: catalog.eventId,
          asset_id: depreciation.assetId || assetId || null,
          calculation_date: depreciation.calculationDate,
          method: depreciation.method,
          accumulated_depreciation: depreciation.accumulatedDepreciation ? Number(depreciation.accumulatedDepreciation) : null,
          book_value: depreciation.bookValue ? Number(depreciation.bookValue) : null
        })
        if (error) throw error
      }

      const lifecycle = (finalData as AssetWizardData).lifecycle
      if (lifecycle) {
        const movementType = lifecycle.action === 'transfer' ? 'transfer' : lifecycle.action === 'disposal' ? 'out' : 'in'
        const { error } = await supabase.from('asset_inventory_tracking_movements').insert({
          event_id: catalog.eventId,
          item: lifecycle.action,
          type: movementType,
          quantity: 0,
          from_location: lifecycle.fromLocation,
          to_location: lifecycle.toLocation,
          date: new Date().toISOString().slice(0, 10),
          reason: lifecycle.details,
          reference: lifecycle.proceeds
        })
        if (error) throw error
      }

      const audit = (finalData as AssetWizardData).audit
      if (audit) {
        const { error } = await supabase.from('asset_inventory_tracking_audits').insert({
          event_id: catalog.eventId,
          date: audit.date,
          location: audit.location,
          auditor: audit.auditor,
          items_checked: audit.itemsChecked,
          discrepancies: audit.discrepancies,
          status: audit.status,
          findings: audit.findings ? [audit.findings] : [],
          corrective_actions: audit.correctiveActions ? [audit.correctiveActions] : []
        })
        if (error) throw error
      }

      const analytics = (finalData as AssetWizardData).analytics
      if (analytics) {
        const { error } = await supabase.from('asset_inventory_analytics_usage').insert({
          event_id: catalog.eventId,
          asset_id: analytics.assetId || assetId || null,
          date: analytics.date,
          usage_hours: analytics.usageHours ? Number(analytics.usageHours) : null,
          utilization_rate: analytics.utilizationRate ? Number(analytics.utilizationRate) : null,
          notes: analytics.notes
        })
        if (error) throw error
      }

    } catch (error) {
      logger.error('Failed to save asset inventory workflow', error)
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
          <h1 className="text-3xl font-bold">Asset Inventory Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Catalog, track, maintain, depreciate, and govern assets with full auditability.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="asset-inventory-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving records...</p>}
      </div>
    </div>
  )
}

