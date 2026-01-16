import { Metadata } from 'next'
import { InquireClient } from './inquire-client'

export const metadata: Metadata = {
  title: 'Sponsorship Inquiry | ATLVS + GVTEWAY',
  description: 'Start your sponsorship partnership with ATLVS + GVTEWAY.',
}

export default function InquirePage() {
  return <InquireClient />
}
