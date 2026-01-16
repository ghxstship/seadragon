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

type RiderFormValues = z.infer<typeof riderSchema>
type InputListFormValues = z.infer<typeof inputListSchema>
type StagePlotFormValues = z.infer<typeof stagePlotSchema>
type LightingPlotFormValues = z.infer<typeof lightingPlotSchema>
type LoadInFormValues = z.infer<typeof loadInSchema>
type ParkingFormValues = z.infer<typeof parkingSchema>
type VendorFormValues = z.infer<typeof vendorSchema>
type EquipmentOrderFormValues = z.infer<typeof equipmentOrderSchema>
type EquipmentRentalFormValues = z.infer<typeof equipmentRentalSchema>
type InventoryCheckFormValues = z.infer<typeof inventoryCheckSchema>
type HotelFormValues = z.infer<typeof hotelSchema>
type FlightFormValues = z.infer<typeof flightSchema>
type GroundTransportFormValues = z.infer<typeof groundTransportSchema>
type PerDiemFormValues = z.infer<typeof perDiemSchema>
type CateringMenuFormValues = z.infer<typeof cateringMenuSchema>
type CateringBeverageFormValues = z.infer<typeof cateringBeverageSchema>
type CateringTimelineFormValues = z.infer<typeof cateringTimelineSchema>
type CateringStaffingFormValues = z.infer<typeof cateringStaffingSchema>
type CateringVendorFormValues = z.infer<typeof cateringVendorSchema>

type AdvanceWizardData = {
  rider?: RiderFormValues
  inputList?: InputListFormValues
  stagePlot?: StagePlotFormValues
  lightingPlot?: LightingPlotFormValues
  loadIn?: LoadInFormValues
  parking?: ParkingFormValues
  vendor?: VendorFormValues
  equipmentOrder?: EquipmentOrderFormValues
  equipmentRental?: EquipmentRentalFormValues
  inventoryCheck?: InventoryCheckFormValues
  hotel?: HotelFormValues
  flight?: FlightFormValues
  ground?: GroundTransportFormValues
  perDiem?: PerDiemFormValues
  cateringMenu?: CateringMenuFormValues
  cateringBeverage?: CateringBeverageFormValues
  cateringTimeline?: CateringTimelineFormValues
  cateringStaffing?: CateringStaffingFormValues
  cateringVendor?: CateringVendorFormValues
}

const riderSchema = z.object({
  stageRequirements: z.string().optional(),
  soundRequirements: z.string().optional(),
  lightingRequirements: z.string().optional(),
  powerRequirements: z.string().optional(),
  backlineRequirements: z.string().optional()
})

const inputListSchema = z.object({
  microphones: z.string().optional(),
  instruments: z.string().optional(),
  effects: z.string().optional(),
  monitoring: z.string().optional()
})

const stagePlotSchema = z.object({
  dimensions: z.string().optional(),
  elements: z.string().optional()
})

const lightingPlotSchema = z.object({
  fixtures: z.string().optional(),
  cues: z.string().optional()
})

const loadInSchema = z.object({
  timeSlot: z.string().min(1),
  activity: z.string().min(1),
  responsibleParty: z.string().optional(),
  equipmentNeeded: z.string().optional(),
  durationMinutes: z.coerce.number().int().nonnegative().optional()
})

const parkingSchema = z.object({
  areaName: z.string().min(1),
  vehicles: z.string().optional(),
  accessTime: z.string().optional(),
  restrictions: z.string().optional()
})

const vendorSchema = z.object({
  vendorName: z.string().min(1),
  contactInfo: z.string().optional(),
  arrivalTime: z.string().optional(),
  setupLocation: z.string().optional(),
  requirements: z.string().optional()
})

const equipmentOrderSchema = z.object({
  itemName: z.string().min(1),
  vendorName: z.string().min(1),
  quantity: z.coerce.number().int().positive().default(1),
  deliveryDate: z.string().optional(),
  cost: z.string().optional(),
  orderStatus: z.enum(['ordered', 'confirmed', 'delivered']).default('ordered')
})

const equipmentRentalSchema = z.object({
  category: z.string().min(1),
  items: z.string().optional(),
  rentalStart: z.string().optional(),
  rentalEnd: z.string().optional(),
  cost: z.string().optional(),
  deliveryInfo: z.string().optional()
})

const inventoryCheckSchema = z.object({
  itemName: z.string().min(1),
  ownedQuantity: z.coerce.number().int().nonnegative().default(0),
  rentedQuantity: z.coerce.number().int().nonnegative().default(0),
  totalQuantity: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(['sufficient', 'low', 'shortage', 'excess']).default('sufficient')
})

const hotelSchema = z.object({
  hotelName: z.string().min(1),
  roomCount: z.coerce.number().int().nonnegative().default(0),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  nightlyRate: z.string().optional(),
  amenities: z.string().optional()
})

const flightSchema = z.object({
  route: z.string().min(1),
  passengers: z.string().optional(),
  departureTime: z.string().optional(),
  returnTime: z.string().optional(),
  cost: z.string().optional()
})

const groundTransportSchema = z.object({
  transportType: z.string().min(1),
  passengers: z.string().optional(),
  schedule: z.string().optional(),
  cost: z.string().optional()
})

const perDiemSchema = z.object({
  personName: z.string().min(1),
  dailyRate: z.string().optional(),
  daysCount: z.coerce.number().int().nonnegative().optional()
})

const cateringMenuSchema = z.object({
  mealType: z.string().min(1),
  servings: z.coerce.number().int().nonnegative().optional(),
  dietaryRestrictions: z.string().optional(),
  cost: z.string().optional()
})

const cateringBeverageSchema = z.object({
  beverageType: z.string().min(1),
  quantity: z.coerce.number().int().nonnegative().optional(),
  cost: z.string().optional()
})

const cateringTimelineSchema = z.object({
  serviceTime: z.string().min(1),
  serviceType: z.string().min(1),
  location: z.string().optional()
})

const cateringStaffingSchema = z.object({
  role: z.string().min(1),
  count: z.coerce.number().int().nonnegative().optional(),
  hours: z.coerce.number().int().nonnegative().optional()
})

const cateringVendorSchema = z.object({
  vendorName: z.string().min(1),
  serviceType: z.string().optional(),
  contactInfo: z.string().optional()
})

const simpleInput = (label: string, name: keyof any, form: any, type: string | undefined = undefined) => (
  <FormField control={form.control} name={name as never} render={({ field }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl><Input type={type} {...field}/></FormControl>
      <FormMessage/>
    </FormItem>
  )}/>
)

function createStep<T extends Record<string, unknown>>(opts: {
  schema: z.ZodSchema,
  dataKey: keyof AdvanceWizardData,
  defaults: T,
  render: (form: ReturnType<typeof useForm<T>>) => React.ReactNode
}) {
  return function Step({ data, onChange, onValidationChange }: StepProps) {
    const existing = (data as AdvanceWizardData)[opts.dataKey] as T | undefined
    const form = useForm<T>({ resolver: zodResolver(opts.schema), defaultValues: (existing ?? opts.defaults) as DefaultValues<T> })

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

    return <Form {...form}><form className="grid grid-cols-1 md:grid-cols-2 gap-4">{opts.render(form)}</form></Form>
  }
}

const RiderStep = createStep<RiderFormValues>({
  schema: riderSchema,
  dataKey: 'rider',
  defaults: {},
  render: (form) => (
    <>
      {simpleInput('Stage Requirements', 'stageRequirements', form)}
      {simpleInput('Sound Requirements', 'soundRequirements', form)}
      {simpleInput('Lighting Requirements', 'lightingRequirements', form)}
      {simpleInput('Power Requirements', 'powerRequirements', form)}
      <FormField control={form.control} name={'backlineRequirements' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Backline Requirements</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const InputListStep = createStep<InputListFormValues>({
  schema: inputListSchema,
  dataKey: 'inputList',
  defaults: {},
  render: (form) => (
    <>
      {simpleInput('Microphones', 'microphones', form)}
      {simpleInput('Instruments', 'instruments', form)}
      {simpleInput('Effects', 'effects', form)}
      {simpleInput('Monitoring', 'monitoring', form)}
    </>
  )
})

const StagePlotStep = createStep<StagePlotFormValues>({
  schema: stagePlotSchema,
  dataKey: 'stagePlot',
  defaults: {},
  render: (form) => (
    <>
      {simpleInput('Dimensions', 'dimensions', form)}
      <FormField control={form.control} name={'elements' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Elements</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const LightingPlotStep = createStep<LightingPlotFormValues>({
  schema: lightingPlotSchema,
  dataKey: 'lightingPlot',
  defaults: {},
  render: (form) => (
    <>
      {simpleInput('Fixtures', 'fixtures', form)}
      {simpleInput('Cues', 'cues', form)}
    </>
  )
})

const LoadInStep = createStep<LoadInFormValues>({
  schema: loadInSchema,
  dataKey: 'loadIn',
  defaults: { activity: '', timeSlot: '' },
  render: (form) => (
    <>
      {simpleInput('Time Slot', 'timeSlot', form)}
      {simpleInput('Activity', 'activity', form)}
      {simpleInput('Responsible Party', 'responsibleParty', form)}
      {simpleInput('Equipment Needed', 'equipmentNeeded', form)}
      <FormField control={form.control} name={'durationMinutes' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Duration (minutes)</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const ParkingStep = createStep<ParkingFormValues>({
  schema: parkingSchema,
  dataKey: 'parking',
  defaults: { areaName: '' },
  render: (form) => (
    <>
      {simpleInput('Area Name', 'areaName', form)}
      {simpleInput('Vehicles', 'vehicles', form)}
      {simpleInput('Access Time', 'accessTime', form)}
      {simpleInput('Restrictions', 'restrictions', form)}
    </>
  )
})

const VendorStep = createStep<VendorFormValues>({
  schema: vendorSchema,
  dataKey: 'vendor',
  defaults: { vendorName: '' },
  render: (form) => (
    <>
      {simpleInput('Vendor Name', 'vendorName', form)}
      {simpleInput('Contact Info', 'contactInfo', form)}
      {simpleInput('Arrival Time', 'arrivalTime', form)}
      {simpleInput('Setup Location', 'setupLocation', form)}
      <FormField control={form.control} name={'requirements' as never} render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Requirements</FormLabel>
          <FormControl><Textarea rows={3} {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const EquipmentOrderStep = createStep<EquipmentOrderFormValues>({
  schema: equipmentOrderSchema,
  dataKey: 'equipmentOrder',
  defaults: { itemName: '', vendorName: '', quantity: 1, orderStatus: 'ordered' },
  render: (form) => (
    <>
      {simpleInput('Item Name', 'itemName', form)}
      {simpleInput('Vendor Name', 'vendorName', form)}
      <FormField control={form.control} name={'quantity' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Quantity</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      {simpleInput('Delivery Date', 'deliveryDate', form, 'date')}
      {simpleInput('Cost', 'cost', form, 'number')}
      {simpleInput('Order Status', 'orderStatus', form)}
    </>
  )
})

const EquipmentRentalStep = createStep<EquipmentRentalFormValues>({
  schema: equipmentRentalSchema,
  dataKey: 'equipmentRental',
  defaults: { category: '' },
  render: (form) => (
    <>
      {simpleInput('Category', 'category', form)}
      {simpleInput('Items', 'items', form)}
      {simpleInput('Rental Start', 'rentalStart', form, 'date')}
      {simpleInput('Rental End', 'rentalEnd', form, 'date')}
      {simpleInput('Cost', 'cost', form, 'number')}
      {simpleInput('Delivery Info', 'deliveryInfo', form)}
    </>
  )
})

const InventoryCheckStep = createStep<InventoryCheckFormValues>({
  schema: inventoryCheckSchema,
  dataKey: 'inventoryCheck',
  defaults: { itemName: '', ownedQuantity: 0, rentedQuantity: 0, totalQuantity: 0, status: 'sufficient' },
  render: (form) => (
    <>
      {simpleInput('Item Name', 'itemName', form)}
      <FormField control={form.control} name={'ownedQuantity' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Owned Quantity</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'rentedQuantity' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Rented Quantity</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'totalQuantity' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Total Quantity</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      {simpleInput('Status', 'status', form)}
    </>
  )
})

const HotelStep = createStep<HotelFormValues>({
  schema: hotelSchema,
  dataKey: 'hotel',
  defaults: { hotelName: '', roomCount: 0 },
  render: (form) => (
    <>
      {simpleInput('Hotel Name', 'hotelName', form)}
      <FormField control={form.control} name={'roomCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Room Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      {simpleInput('Check-in Date', 'checkInDate', form, 'date')}
      {simpleInput('Check-out Date', 'checkOutDate', form, 'date')}
      {simpleInput('Nightly Rate', 'nightlyRate', form, 'number')}
      {simpleInput('Amenities', 'amenities', form)}
    </>
  )
})

const FlightStep = createStep<FlightFormValues>({
  schema: flightSchema,
  dataKey: 'flight',
  defaults: { route: '' },
  render: (form) => (
    <>
      {simpleInput('Route', 'route', form)}
      {simpleInput('Passengers', 'passengers', form)}
      {simpleInput('Departure Time', 'departureTime', form, 'datetime-local')}
      {simpleInput('Return Time', 'returnTime', form, 'datetime-local')}
      {simpleInput('Cost', 'cost', form, 'number')}
    </>
  )
})

const GroundTransportStep = createStep<GroundTransportFormValues>({
  schema: groundTransportSchema,
  dataKey: 'ground',
  defaults: { transportType: '' },
  render: (form) => (
    <>
      {simpleInput('Transport Type', 'transportType', form)}
      {simpleInput('Passengers', 'passengers', form)}
      {simpleInput('Schedule', 'schedule', form)}
      {simpleInput('Cost', 'cost', form, 'number')}
    </>
  )
})

const PerDiemStep = createStep<PerDiemFormValues>({
  schema: perDiemSchema,
  dataKey: 'perDiem',
  defaults: { personName: '' },
  render: (form) => (
    <>
      {simpleInput('Person Name', 'personName', form)}
      {simpleInput('Daily Rate', 'dailyRate', form, 'number')}
      <FormField control={form.control} name={'daysCount' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Days</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const CateringMenuStep = createStep<CateringMenuFormValues>({
  schema: cateringMenuSchema,
  dataKey: 'cateringMenu',
  defaults: { mealType: '' },
  render: (form) => (
    <>
      {simpleInput('Meal Type', 'mealType', form)}
      <FormField control={form.control} name={'servings' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Servings</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      {simpleInput('Dietary Restrictions', 'dietaryRestrictions', form)}
      {simpleInput('Cost', 'cost', form, 'number')}
    </>
  )
})

const CateringBeverageStep = createStep<CateringBeverageFormValues>({
  schema: cateringBeverageSchema,
  dataKey: 'cateringBeverage',
  defaults: { beverageType: '' },
  render: (form) => (
    <>
      {simpleInput('Beverage Type', 'beverageType', form)}
      <FormField control={form.control} name={'quantity' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Quantity</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      {simpleInput('Cost', 'cost', form, 'number')}
    </>
  )
})

const CateringTimelineStep = createStep<CateringTimelineFormValues>({
  schema: cateringTimelineSchema,
  dataKey: 'cateringTimeline',
  defaults: { serviceTime: '', serviceType: '' },
  render: (form) => (
    <>
      {simpleInput('Service Time', 'serviceTime', form)}
      {simpleInput('Service Type', 'serviceType', form)}
      {simpleInput('Location', 'location', form)}
    </>
  )
})

const CateringStaffingStep = createStep<CateringStaffingFormValues>({
  schema: cateringStaffingSchema,
  dataKey: 'cateringStaffing',
  defaults: { role: '' },
  render: (form) => (
    <>
      {simpleInput('Role', 'role', form)}
      <FormField control={form.control} name={'count' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Count</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={form.control} name={'hours' as never} render={({ field }) => (
        <FormItem>
          <FormLabel>Hours</FormLabel>
          <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </>
  )
})

const CateringVendorStep = createStep<CateringVendorFormValues>({
  schema: cateringVendorSchema,
  dataKey: 'cateringVendor',
  defaults: { vendorName: '' },
  render: (form) => (
    <>
      {simpleInput('Vendor Name', 'vendorName', form)}
      {simpleInput('Service Type', 'serviceType', form)}
      {simpleInput('Contact Info', 'contactInfo', form)}
    </>
  )
})

const steps = [
  { id: 'rider', title: 'Production Rider', description: 'Tech requirements', component: RiderStep },
  { id: 'input', title: 'Input List', description: 'Inputs and monitoring', component: InputListStep },
  { id: 'stage', title: 'Stage Plot', description: 'Stage layout', component: StagePlotStep },
  { id: 'lighting', title: 'Lighting Plot', description: 'Lighting needs', component: LightingPlotStep },
  { id: 'loadin', title: 'Load-in Schedule', description: 'Activities and slots', component: LoadInStep },
  { id: 'parking', title: 'Parking', description: 'Parking allocations', component: ParkingStep },
  { id: 'vendor', title: 'Vendor Coordination', description: 'Vendors and arrivals', component: VendorStep },
  { id: 'order', title: 'Equipment Orders', description: 'Ordered items', component: EquipmentOrderStep },
  { id: 'rental', title: 'Equipment Rentals', description: 'Rental packages', component: EquipmentRentalStep },
  { id: 'inventory', title: 'Inventory Check', description: 'Availability and status', component: InventoryCheckStep },
  { id: 'hotel', title: 'Hotels', description: 'Rooms and rates', component: HotelStep },
  { id: 'flight', title: 'Flights', description: 'Routes and pax', component: FlightStep },
  { id: 'ground', title: 'Ground Transport', description: 'Vehicles and schedule', component: GroundTransportStep },
  { id: 'perdiem', title: 'Per Diems', description: 'Allowances', component: PerDiemStep },
  { id: 'cateringMenu', title: 'Catering Menu', description: 'Meals and servings', component: CateringMenuStep },
  { id: 'cateringBeverage', title: 'Catering Beverages', description: 'Beverage plan', component: CateringBeverageStep },
  { id: 'cateringTimeline', title: 'Catering Timeline', description: 'Service times', component: CateringTimelineStep },
  { id: 'cateringStaffing', title: 'Catering Staffing', description: 'Staff counts', component: CateringStaffingStep },
  { id: 'cateringVendor', title: 'Catering Vendors', description: 'Vendor contacts', component: CateringVendorStep }
]

export default function AdvancePhaseWorkflow() {
  const [isSaving, setIsSaving] = useState(false)

  const handleWizardComplete = useCallback(async (finalData: Record<string, unknown>) => {
    try {
      setIsSaving(true)
      const data = finalData as AdvanceWizardData
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not authenticated')
      const userId = userData.user.id

      if (data.rider) {
        const { error } = await supabase.from('advance_production_rider').insert({
          stage_requirements: data.rider.stageRequirements ? JSON.parse(JSON.stringify(data.rider.stageRequirements)) : null,
          sound_requirements: data.rider.soundRequirements ? JSON.parse(JSON.stringify(data.rider.soundRequirements)) : null,
          lighting_requirements: data.rider.lightingRequirements ? JSON.parse(JSON.stringify(data.rider.lightingRequirements)) : null,
          power_requirements: data.rider.powerRequirements ? JSON.parse(JSON.stringify(data.rider.powerRequirements)) : null,
          backline_requirements: data.rider.backlineRequirements ? JSON.parse(JSON.stringify(data.rider.backlineRequirements)) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.inputList) {
        const { error } = await supabase.from('advance_input_list').insert({
          microphones: data.inputList.microphones ? JSON.parse(JSON.stringify(data.inputList.microphones)) : null,
          instruments: data.inputList.instruments ? JSON.parse(JSON.stringify(data.inputList.instruments)) : null,
          effects: data.inputList.effects ? JSON.parse(JSON.stringify(data.inputList.effects)) : null,
          monitoring: data.inputList.monitoring ? JSON.parse(JSON.stringify(data.inputList.monitoring)) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.stagePlot) {
        const { error } = await supabase.from('advance_stage_plot').insert({
          dimensions: data.stagePlot.dimensions ? JSON.parse(JSON.stringify(data.stagePlot.dimensions)) : null,
          elements: data.stagePlot.elements ? JSON.parse(JSON.stringify(data.stagePlot.elements)) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.lightingPlot) {
        const { error } = await supabase.from('advance_lighting_plot').insert({
          fixtures: data.lightingPlot.fixtures ? JSON.parse(JSON.stringify(data.lightingPlot.fixtures)) : null,
          cues: data.lightingPlot.cues ? JSON.parse(JSON.stringify(data.lightingPlot.cues)) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.loadIn) {
        const { error } = await supabase.from('advance_loadin_schedule').insert({
          time_slot: data.loadIn.timeSlot,
          activity: data.loadIn.activity,
          responsible_party: data.loadIn.responsibleParty,
          equipment_needed: data.loadIn.equipmentNeeded ? JSON.parse(JSON.stringify(data.loadIn.equipmentNeeded)) : null,
          duration_minutes: data.loadIn.durationMinutes ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.parking) {
        const { error } = await supabase.from('advance_parking_assignments').insert({
          area_name: data.parking.areaName,
          vehicles: data.parking.vehicles ? JSON.parse(JSON.stringify(data.parking.vehicles)) : null,
          access_time: data.parking.accessTime,
          restrictions: data.parking.restrictions ? JSON.parse(JSON.stringify(data.parking.restrictions)) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.vendor) {
        const { error } = await supabase.from('advance_vendor_coordination').insert({
          vendor_name: data.vendor.vendorName,
          contact_info: data.vendor.contactInfo,
          arrival_time: data.vendor.arrivalTime,
          setup_location: data.vendor.setupLocation,
          requirements: data.vendor.requirements ? JSON.parse(JSON.stringify(data.vendor.requirements)) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.equipmentOrder) {
        const { error } = await supabase.from('advance_equipment_orders').insert({
          item_name: data.equipmentOrder.itemName,
          vendor_name: data.equipmentOrder.vendorName,
          quantity: data.equipmentOrder.quantity,
          delivery_date: data.equipmentOrder.deliveryDate || null,
          cost: data.equipmentOrder.cost ? Number(data.equipmentOrder.cost) : null,
          order_status: data.equipmentOrder.orderStatus,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.equipmentRental) {
        const { error } = await supabase.from('advance_equipment_rentals').insert({
          category: data.equipmentRental.category,
          items: data.equipmentRental.items ? JSON.parse(JSON.stringify(data.equipmentRental.items)) : null,
          rental_start: data.equipmentRental.rentalStart || null,
          rental_end: data.equipmentRental.rentalEnd || null,
          cost: data.equipmentRental.cost ? Number(data.equipmentRental.cost) : null,
          delivery_info: data.equipmentRental.deliveryInfo,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.inventoryCheck) {
        const { error } = await supabase.from('advance_inventory_check').insert({
          item_name: data.inventoryCheck.itemName,
          owned_quantity: data.inventoryCheck.ownedQuantity,
          rented_quantity: data.inventoryCheck.rentedQuantity,
          total_quantity: data.inventoryCheck.totalQuantity,
          status: data.inventoryCheck.status,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.hotel) {
        const { error } = await supabase.from('advance_hotels').insert({
          hotel_name: data.hotel.hotelName,
          room_count: data.hotel.roomCount,
          check_in_date: data.hotel.checkInDate || null,
          check_out_date: data.hotel.checkOutDate || null,
          nightly_rate: data.hotel.nightlyRate ? Number(data.hotel.nightlyRate) : null,
          amenities: data.hotel.amenities ? JSON.parse(JSON.stringify(data.hotel.amenities)) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.flight) {
        const { error } = await supabase.from('advance_travel_flights').insert({
          route: data.flight.route,
          passengers: data.flight.passengers ? JSON.parse(JSON.stringify(data.flight.passengers)) : null,
          departure_time: data.flight.departureTime || null,
          return_time: data.flight.returnTime || null,
          cost: data.flight.cost ? Number(data.flight.cost) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.ground) {
        const { error } = await supabase.from('advance_ground_transport').insert({
          transport_type: data.ground.transportType,
          passengers: data.ground.passengers ? JSON.parse(JSON.stringify(data.ground.passengers)) : null,
          schedule: data.ground.schedule,
          cost: data.ground.cost ? Number(data.ground.cost) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.perDiem) {
        const { error } = await supabase.from('advance_per_diems').insert({
          person_name: data.perDiem.personName,
          daily_rate: data.perDiem.dailyRate ? Number(data.perDiem.dailyRate) : null,
          days_count: data.perDiem.daysCount ?? null,
          total_amount: data.perDiem.dailyRate && data.perDiem.daysCount ? Number(data.perDiem.dailyRate) * data.perDiem.daysCount : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.cateringMenu) {
        const { error } = await supabase.from('advance_catering_menu').insert({
          meal_type: data.cateringMenu.mealType,
          servings: data.cateringMenu.servings ?? null,
          dietary_restrictions: data.cateringMenu.dietaryRestrictions ? JSON.parse(JSON.stringify(data.cateringMenu.dietaryRestrictions)) : null,
          cost: data.cateringMenu.cost ? Number(data.cateringMenu.cost) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.cateringBeverage) {
        const { error } = await supabase.from('advance_catering_beverages').insert({
          beverage_type: data.cateringBeverage.beverageType,
          quantity: data.cateringBeverage.quantity ?? null,
          cost: data.cateringBeverage.cost ? Number(data.cateringBeverage.cost) : null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.cateringTimeline) {
        const { error } = await supabase.from('advance_catering_timeline').insert({
          service_time: data.cateringTimeline.serviceTime,
          service_type: data.cateringTimeline.serviceType,
          location: data.cateringTimeline.location,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.cateringStaffing) {
        const { error } = await supabase.from('advance_catering_staffing').insert({
          role: data.cateringStaffing.role,
          count: data.cateringStaffing.count ?? null,
          hours: data.cateringStaffing.hours ?? null,
          user_id: userId
        })
        if (error) throw error
      }

      if (data.cateringVendor) {
        const { error } = await supabase.from('advance_catering_vendors').insert({
          vendor_name: data.cateringVendor.vendorName,
          service_type: data.cateringVendor.serviceType,
          contact_info: data.cateringVendor.contactInfo,
          user_id: userId
        })
        if (error) throw error
      }

    } catch (error) {
      logger.error('Advance phase workflow save failed', error)
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
          <h1 className="text-3xl font-bold">Advance Phase Workflow (Production Advancing)</h1>
          <p className="text-muted-foreground mt-2">
            Advance all production requests (site infrastructure, equipment, services, travel, credentials, riders) and push into procurement and inventory with approvals, logistics, and compliance.
          </p>
        </div>

        <MultiStepWizard
          steps={steps}
          onComplete={handleWizardComplete}
          initialData={initialData}
          className="max-w-6xl mx-auto"
          autoSave
          persistenceKey="advance-phase-workflow"
        />
        {isSaving && <p className="mt-4 text-sm text-muted-foreground">Saving advance records...</p>}
      </div>
    </div>
  )
}
