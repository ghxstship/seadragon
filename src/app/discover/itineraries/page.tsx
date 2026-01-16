
import { Metadata } from 'next'
import { ItinerariesClient } from './ItinerariesClient'

export const metadata: Metadata = {
  title: 'Sample Itineraries | ATLVS + GVTEWAY',
  description: 'Explore ready-made travel itineraries and trip plans for destinations around the world.',
}

export default function ItinerariesPage() {
  return <ItinerariesClient/>
}
