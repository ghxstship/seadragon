import { Metadata } from 'next'
import { SupportContactClient } from './support-contact.client'

export const metadata: Metadata = {
  title: 'Contact Support | ATLVS + GVTEWAY',
  description: 'Get in touch with our support team for help with bookings, accounts, and technical issues.',
}

export default function SupportContactPage() {
  return <SupportContactClient />
}
