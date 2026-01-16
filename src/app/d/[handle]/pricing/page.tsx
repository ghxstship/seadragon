
import { notFound } from 'next/navigation'

interface DestinationPricingPageProps {
  params: Promise<{ handle: string }>
}

export default async function DestinationPricingPage({ params }: DestinationPricingPageProps) {
  const { handle } = await params
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Pricing for {handle}</h1>
      <p className="text-muted-foreground">Pricing information coming soon.</p>
    </div>
  )
}
