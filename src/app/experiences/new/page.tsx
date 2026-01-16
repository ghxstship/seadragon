
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ExperienceCard } from '@/components/experience-card'

interface ExperienceApiResponse {
  id: string
  name: string
  description?: string
  price?: number
  duration?: number
  difficulty?: string
  max_participants?: number
  image_url?: string
  categories?: {
    id: string
    name: string
    slug: string
  }
  destinations?: {
    id: string
    name: string
    slug: string
  }
  organizations?: {
    id: string
    name: string
    slug: string
  }
}

export const metadata: Metadata = {
  title: 'New Experiences | ATLVS + GVTEWAY',
  description: 'Discover the latest experiences added to our platform.',
}

export default async function NewExperiencesPage() {
  const supabase = await createClient()
  
  const { data: experiences } = await supabase
    .from('experiences')
    .select(`
      *,
      categories(*),
      destinations(*),
      organizations(*)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20)

  const experienceList = experiences || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">New Experiences</h1>
          <p className="text-xl text-neutral-600">
            Discover the latest experiences added to our platform.
          </p>
        </div>

        {experienceList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">No experiences available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experienceList.map((experience: ExperienceApiResponse) => (
              <ExperienceCard key={experience.id} {...experience}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
