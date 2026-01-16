
import { Metadata } from 'next'
import { PhotosClient } from './PhotosClient'

export const metadata: Metadata = {
  title: 'Photo Gallery | ATLVS + GVTEWAY',
  description: 'Browse our extensive collection of travel photography from destinations around the world.',
}

export default function PhotosPage() {
  return <PhotosClient/>
}
