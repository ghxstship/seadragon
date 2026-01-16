
import { Metadata } from 'next'
import { NotificationsClient } from './NotificationsClient'

export const metadata: Metadata = {
  title: 'Notification Settings | ATLVS + GVTEWAY',
  description: 'Configure your email, push, and SMS notification preferences.',
}

export default function HomeSettingsNotificationsPage() {
  return <NotificationsClient/>
}
