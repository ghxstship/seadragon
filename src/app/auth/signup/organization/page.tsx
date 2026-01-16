
import { Metadata } from 'next'
import { OrganizationSignupClient } from './OrganizationSignupClient'

export const metadata: Metadata = {
  title: 'Create Organization | ATLVS + GVTEWAY',
  description: 'Set up your organization account and manage team access on ATLVS + GVTEWAY.',
}

export default function OrganizationSignupPage() {
  return <OrganizationSignupClient/>
}
