
import { Metadata } from 'next'
import { GroupClient } from './group-client'

export const metadata: Metadata = {
  title: 'Group Booking | ATLVS + GVTEWAY',
  description: 'Plan and request quotes for group events.',
}

export default function Group() {
  return <GroupClient />
}
