import { Metadata } from 'next'
import VideosClient from './videos-client'

export const metadata: Metadata = {
  title: 'Video Gallery | ATLVS + GVTEWAY',
  description: 'Watch cinematic travel videos showcasing destinations.',
}

export default function VideosPage() {
  return <VideosClient />
}
