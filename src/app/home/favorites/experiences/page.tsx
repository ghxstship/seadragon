import { Metadata } from 'next'
import { ExperiencesFavoritesClient } from './experiences-client'

export const metadata: Metadata = {
  title: 'Favorite Experiences | ATLVS + GVTEWAY',
  description: 'View and manage your saved travel experiences and activities.',
}

export default function HomeFavoritesExperiencesPage() {
  return <ExperiencesFavoritesClient />
}
