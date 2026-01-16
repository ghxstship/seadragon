import { Metadata } from 'next'
import { BookExperiencesClient } from './book-experiences-client'

export const metadata: Metadata = {
  title: 'Book Experiences | ATLVS + GVTEWAY',
  description: 'Book unique travel experiences and activities worldwide. From cultural tours to adventure activities.',
}

export default function ExperiencesPage() {
  return <BookExperiencesClient />
}
