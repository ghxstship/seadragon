
import { Metadata } from 'next'
import { PartnershipsClient } from './partnerships-client'

export const metadata: Metadata = {
  title: 'Partnership Inquiries | ATLVS + GVTEWAY',
  description: 'Contact us about partnership opportunities, business development, and collaboration possibilities.',
}

export default function PartnershipsContactPage() {
  return <PartnershipsClient />
}

