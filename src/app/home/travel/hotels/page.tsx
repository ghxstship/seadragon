
import { Metadata } from 'next'
import { HotelsClient } from './hotels-client'

export const metadata: Metadata = {
  title: 'Hotel Bookings | ATLVS + GVTEWAY',
  description: 'Manage your hotel reservations and accommodation bookings.',
}

export default function HomeTravelHotelsPage() {
  return <HotelsClient />
}
