
import { Metadata } from 'next'
import { CommunityConnectionsClient } from './connections-client'

export const metadata: Metadata = {
  title: 'My Connections | ATLVS + GVTEWAY',
  description: 'View and manage your connections, followers, and network on ATLVS + GVTEWAY.',
}

export default function HomeCommunityConnectionsPage() {
  return <CommunityConnectionsClient />
}
