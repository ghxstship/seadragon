import { Metadata } from 'next'
import { TravelPreferencesClient } from './travel-preferences-client'

export const metadata: Metadata = {
  title: 'Travel Preferences | ATLVS + GVTEWAY',
  description: 'Set your travel preferences and customize your travel planning experience.',
}

export default function HomeTravelPreferencesPage() {
  return <TravelPreferencesClient />
}
