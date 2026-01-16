import { Metadata } from 'next'
import { DiscoverExperiencesClient } from './discover-experiences-client'

export const metadata: Metadata = {
  title: 'Experiences | ATLVS + GVTEWAY',
  description: 'Discover unique and authentic travel experiences from around the world.',
}

export default function ExperiencesPage() {
  return <DiscoverExperiencesClient />
}
