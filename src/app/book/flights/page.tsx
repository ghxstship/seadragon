
import { Metadata } from 'next'
import { FlightsClient } from './FlightsClient'

export const metadata: Metadata = {
  title: 'Book Flights | ATLVS + GVTEWAY',
  description: 'Find and book flights worldwide with the best prices and flexible options. Compare airlines and routes for your perfect trip.',
}

export default function FlightsPage() {
  return <FlightsClient/>
}
