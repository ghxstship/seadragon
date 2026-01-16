
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
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

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('name, slug')
    .eq('slug', resolvedParams.category)
    .single()

  if (!category) {
    return {
      title: 'Category Not Found | ATLVS + GVTEWAY'
    }
  }

  return {
    title: `${category.name} Experiences | ATLVS + GVTEWAY`,
    description: `Discover ${category.name} experiences on our platform.`,
  }
}

export default async function CategoryExperiencesPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', resolvedParams.category)
    .single()

  if (!category) {
    notFound()
  }

  const { data: experiences } = await supabase
    .from('experiences')
    .select(`
      *,
      categories(*),
      destinations(*),
      organizations(*)
    `)
    .eq('category_id', category.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">{category.name} Experiences</h1>
          <p className="text-xl text-neutral-600">
            {category.description || `Discover amazing ${category.name.toLowerCase()} experiences.`}
          </p>
        </div>

        {!experiences || experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">No experiences found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience: ExperienceApiResponse) => (
              <ExperienceCard key={experience.id} {...experience}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
