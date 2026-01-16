
import { Metadata } from 'next'
import { BillingClient } from './BillingClient'

export const metadata: Metadata = {
  title: 'Billing Settings | ATLVS + GVTEWAY',
  description: 'Manage your subscription, payment methods, and billing information.',
}

export default function HomeSettingsBillingPage() {
  return <BillingClient/>
}
