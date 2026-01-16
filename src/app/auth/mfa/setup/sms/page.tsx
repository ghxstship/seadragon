import { Metadata } from 'next'
import { SmsSetupClient } from './sms-client'

export const metadata: Metadata = {
  title: 'Setup SMS Verification | ATLVS + GVTEWAY',
  description: 'Set up two-factor authentication using SMS text messages to your phone.',
}

export default function MFASMSetupPage() {
  return <SmsSetupClient />
}
