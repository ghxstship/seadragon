
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProfessionalPortfolioPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProfessionalPortfolioPageProps): Promise<Metadata> {
  const { handle } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, professional_profiles(*), users(*)')
    .eq('slug', handle)
    .single()

  if (!profile || !profile.professional_profiles) {
    return {
      title: 'Professional Not Found | ATLVS + GVTEWAY'
    }
  }

  const displayName = profile.display_name || `${profile.users?.first_name} ${profile.users?.last_name}` || profile.slug

  return {
    title: `${displayName} - Portfolio | ATLVS + GVTEWAY`,
    description: `Portfolio and work samples of professional ${displayName}.`,
  }
}

export default async function ProfessionalPortfolioPage({ params }: ProfessionalPortfolioPageProps) {
  const { handle } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, professional_profiles(*, professional_portfolio(*)), users(*)')
    .eq('slug', handle)
    .single()

  if (!profile || !profile.professional_profiles) {
    notFound()
  }

  const professional = profile.professional_profiles
  const displayName = profile.display_name || `${profile.users?.first_name} ${profile.users?.last_name}` || profile.slug

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-background rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">{displayName} - Portfolio</h1>

          {professional.professional_portfolio && professional.professional_portfolio.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professional.professional_portfolio.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-neutral-200 relative">
                    {item.mediaUrl ? (
                      <Image
                        src={item.mediaUrl}
                        alt={item.title}
                        fill
                        className="object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                        <span className="text-neutral-400">No preview</span>
                      </div>
                    )}
                    {item.featured && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-neutral-600">{item.type}</p>
                  </CardHeader>
                  <CardContent>
                    {item.description && (
                      <p className="text-sm text-neutral-700 mb-3 line-clamp-3">{item.description}</p>
                    )}

                    {item.collaborators && Array.isArray(item.collaborators) && item.collaborators.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-neutral-500">Collaborators:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.collaborators.slice(0, 3).map((collaborator, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{collaborator}</Badge>
                          ))}
                          {item.collaborators.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{item.collaborators.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-neutral-500">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.slice(0, 4).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                          {item.tags.length > 4 && (
                            <Badge variant="secondary" className="text-xs">+{item.tags.length - 4}</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {item.verified && (
                      <Badge variant="default" className="text-xs">Verified</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">No portfolio items available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
