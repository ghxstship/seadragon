import { Metadata } from 'next'
import { GuidesClient } from './guides-client'

export const metadata: Metadata = {
  title: 'Travel Guides | ATLVS + GVTEWAY',
  description: 'Expert travel guides and insider tips for destinations around the world.',
}

export default function GuidesPage() {
  return <GuidesClient />
}
