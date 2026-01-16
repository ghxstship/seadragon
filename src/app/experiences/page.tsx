
'use client'


import { Button } from "@/components/ui/button"
import { logger } from '@/lib/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { PaymentCheckout } from "@/components/payments/payment-checkout"
import { Header } from "@/lib/design-system"
// Dashboard Shell Components
import { CommandBar } from "@/components/command-bar"
import { ViewsBar } from "@/components/views-bar"

interface Experience {
  id: string
  name: string
  slug: string
  description: string
  type: string
  price: number
  currency: string
  maxCapacity: number
  featured: boolean
  status: string
  images: string[]
  destination?: {
    id: string
    name: string
  }
  category?: {
    id: string
    name: string
  }
  // Mock rating for display
  rating?: number
}

const categories = [
  "All",
  "Music",
  "Performing Arts",
  "Comedy",
  "Dance",
  "Sports",
  "Multi-Genre",
]

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/v1/experiences')
        if (response.ok) {
          const data = await response.json()
          const experiencesList = data.data?.experiences || data.experiences || []
          setExperiences(experiencesList)
          setFilteredExperiences(experiencesList)
        } else {
          logger.error('Failed to fetch experiences - API returned error')
          setExperiences([])
          setFilteredExperiences([])
        }
      } catch (error) {
        logger.error('Failed to fetch experiences', error)
        setExperiences([])
        setFilteredExperiences([])
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  // Filter experiences by category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredExperiences(experiences)
    } else {
      setFilteredExperiences(experiences.filter(exp => exp.type === selectedCategory))
    }
  }, [selectedCategory, experiences])

  const handleBookExperience = (experience: Experience) => {
    setSelectedExperience(experience)
    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    setSelectedExperience(null)
    alert('Experience booked successfully!')
  }

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`)
  }

  if (showPayment && selectedExperience) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => setShowPayment(false)}
            className="mb-6"
          >
            ← Back to Experiences
          </Button>

          <PaymentCheckout
            items={[{
              id: selectedExperience.id,
              type: 'experience',
              name: selectedExperience.name,
              price: selectedExperience.price,
              quantity: 1
            }]}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}/>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Command Bar - Standardized across all pages */}
      <div className="sticky top-0 z-50">
        <CommandBar
          isGuest={true}
          currentPage="experiences"
          onSearch={(query) => logger.search(query, { page: 'experiences' })}
          onCreate={(type) => logger.action('create', { type, page: 'experiences' })}
          onNavigate={(path) => logger.navigate(path)}
          onSharePage={() => logger.action('share_page', { page: 'experiences' })}
          onBookmarkPage={() => logger.action('bookmark_page', { page: 'experiences' })}
          onPageSettings={() => logger.action('page_settings')}
          onProfile={() => logger.action('profile')}
          onSettings={() => logger.action('settings')}
          onLogout={() => logger.action('logout')}/>
      </div>

      {/* Header */}
      <Header/>

      {/* ViewsBar - Page-level command bar */}
      <ViewsBar
        currentView="list"
        availableViews={[
          { id: 'list', name: 'List View', type: 'list' },
          { id: 'grid', name: 'Grid View', type: 'list' },
          { id: 'map', name: 'Map View', type: 'map' }
        ]}
        onViewChange={(viewId) => logger.action('view_change', { viewId })}
        searchQuery=""
        onSearchChange={(query) => logger.search(query)}
        availableFilters={[
          { id: 'category', name: 'Category', type: 'select', options: categories.map(cat => ({ label: cat, value: cat })) },
          { id: 'price', name: 'Price Range', type: 'select', options: [
            { label: '$0 - $50', value: '0-50' },
            { label: '$50 - $100', value: '50-100' },
            { label: '$100+', value: '100+' }
          ]},
          { id: 'rating', name: 'Rating', type: 'select', options: [
            { label: '4+ Stars', value: '4' },
            { label: '3+ Stars', value: '3' }
          ]},
          { id: 'featured', name: 'Featured Only', type: 'boolean' }
        ]}
        availableSortFields={[
          { id: 'name', name: 'Name', type: 'string' },
          { id: 'price', name: 'Price', type: 'number' },
          { id: 'rating', name: 'Rating', type: 'number' },
          { id: 'date', name: 'Date Added', type: 'date' }
        ]}
        activeFilters={{}}
        activeSorting={null}
        activeGrouping=""
        onAdvancedFilterChange={(filters) => logger.action('filter_change', { filters })}
        onAdvancedSortChange={(sorting) => logger.action('sort_change', { sorting })}
        onAdvancedGroupChange={(grouping) => logger.action('group_change', { grouping })}
        onClearFilters={() => logger.action('clear_filters')}
        onSaveFilterPreset={(name, filters) => logger.action('save_filter_preset', { name, filters })}
        filterPresets={[
          { id: 'featured', name: 'Featured Only', filters: { featured: true } },
          { id: 'music', name: 'Music Events', filters: { category: 'Music' } }
        ]}
        onCreateRecord={() => logger.action('create_record', { page: 'experiences' })}
        onImport={() => logger.action('import', { page: 'experiences' })}
        onExport={() => logger.action('export', { page: 'experiences' })}
        onScan={() => logger.action('scan', { page: 'experiences' })}
        availableFields={[
          { id: 'name', name: 'Name', visible: true },
          { id: 'category', name: 'Category', visible: true },
          { id: 'price', name: 'Price', visible: true },
          { id: 'rating', name: 'Rating', visible: true },
          { id: 'capacity', name: 'Capacity', visible: false }
        ]}
        isGuest={true}/>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Unforgettable Experiences
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover and book extraordinary live entertainment experiences tailored to your interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Browse All Experiences
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Find by Category
            </Button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted"/>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded mb-2"/>
                    <div className="h-4 bg-muted rounded w-2/3"/>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded mb-2"/>
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"/>
                    <div className="flex gap-2">
                      <div className="h-8 bg-muted rounded flex-1"/>
                      <div className="h-8 bg-muted rounded flex-1"/>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExperiences.map((experience) => (
                <Card key={experience.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold text-accent-primary mb-2">
                        {experience.type}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Experience Preview
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{experience.name}</CardTitle>
                      <div className="flex items-center text-sm">
                        <span className="text-semantic-warning mr-1"></span>
                        {experience.rating?.toFixed(1)}
                      </div>
                    </div>
                    <CardDescription>
                      {experience.type} • ${experience.price} {experience.currency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {experience.description}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Learn More
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleBookExperience(experience)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Why Choose Our Experiences?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Curated entertainment that delivers exceptional quality and memorable moments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Verified Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every experience is vetted for quality, safety, and exceptional production values.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personalized Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI-powered recommendations help you find experiences tailored to your preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seamless Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Easy booking, secure payments, and instant confirmation for all experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            Ready to Create Your Own Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our community of creators and producers building the future of entertainment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Creating
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Partner With Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
