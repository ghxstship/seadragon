
'use client'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from "@/lib/logger"
import { Search, Filter, Calendar, MapPin, Users, Clock, Star, Heart, Share2, Ticket, DollarSign } from "lucide-react"

interface ExperienceApiResponse {
  id: string | number
  name?: string
  description?: string
  category?: string
  duration?: string
  price?: number
  currency?: string
  rating?: number
  review_count?: number
  image?: string
  location?: string
  difficulty?: string
  group_size?: string
  age_range?: string
  highlights?: string[]
  included?: string[]
  availability?: string
  featured?: boolean
}

interface Experience {
  id: string
  name: string
  description: string
  category: string
  duration: string
  price: number
  currency: string
  rating: number
  reviewCount: number
  image: string
  location: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
  groupSize: string
  ageRange: string
  highlights: string[]
  included: string[]
  availability: 'available' | 'limited' | 'sold-out'
  featured: boolean
}

interface Experience {
  id: string
  name: string
  description: string
  category: string
  duration: string
  price: number
  currency: string
  rating: number
  reviewCount: number
  image: string
  location: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
  groupSize: string
  ageRange: string
  highlights: string[]
  included: string[]
  availability: 'available' | 'limited' | 'sold-out'
  featured: boolean
}

interface FilterOptions {
  category: string[]
  priceRange: string
  duration: string
  difficulty: string[]
  rating: string
}

export default function Experiences({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const destinationName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: "all",
    duration: "all",
    difficulty: [],
    rating: "all"
  })
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    "Adventure", "Cultural", "Food & Drink", "Nature", "Sports", "Arts & Theater",
    "Wellness", "Nightlife", "Shopping", "History", "Photography", "Family"
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-50", label: "$0 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-200", label: "$100 - $200" },
    { value: "200+", label: "$200+" }
  ]

  const durations = [
    { value: "all", label: "Any Duration" },
    { value: "0-2", label: "0-2 hours" },
    { value: "2-4", label: "2-4 hours" },
    { value: "4-8", label: "4-8 hours" },
    { value: "8+", label: "8+ hours" }
  ]

  const difficulties = ["Easy", "Moderate", "Challenging", "Extreme"]

  useEffect(() => {
    let cancelled = false

    const loadExperiences = async () => {
      try {
        const res = await fetch(`/api/v1/destinations/${slug}/experiences`)
        if (res.ok) {
          const data = await res.json()
          const experiencesData = Array.isArray(data.experiences) ? data.experiences : []
          const mapped: Experience[] = experiencesData.map((e: ExperienceApiResponse) => ({
            id: String(e.id),
            name: String(e.name || 'Experience'),
            description: String(e.description || ''),
            category: String(e.category || 'Adventure'),
            duration: e.duration || '2-4 hours',
            price: Number(e.price) || 0,
            currency: e.currency || 'USD',
            rating: Number(e.rating) || 4.5,
            reviewCount: Number(e.review_count) || 0,
            image: e.image || '/placeholder-experience.jpg',
            location: String(e.location || ''),
            difficulty: (e.difficulty as 'Easy' | 'Moderate' | 'Challenging' | 'Extreme') || 'Moderate',
            groupSize: e.group_size || '1-10',
            ageRange: e.age_range || 'All ages',
            highlights: Array.isArray(e.highlights) ? e.highlights : [],
            included: Array.isArray(e.included) ? e.included : [],
            availability: (e.availability as 'available' | 'limited' | 'sold-out') || 'available',
            featured: Boolean(e.featured)
          }))
          if (!cancelled) {
            setExperiences(mapped)
            setFilteredExperiences(mapped)
          }
        } else {
          if (!cancelled) {
            setExperiences([])
            setFilteredExperiences([])
          }
        }
      } catch (error) {
        logger.error('Error loading experiences:', error)
        if (!cancelled) {
          setExperiences([])
          setFilteredExperiences([])
        }
      }
    }

    loadExperiences()

    return () => { cancelled = true }
  }, [slug])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = experiences

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(exp =>
        exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(exp => filters.category.includes(exp.category))
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      filtered = filtered.filter(exp => {
        const [min, max] = filters.priceRange.split('-').map(v => v === '+' ? Infinity : parseInt(v))
        return exp.price >= min && (max === Infinity ? true : exp.price <= max)
      })
    }

    // Duration filter
    if (filters.duration !== "all") {
      filtered = filtered.filter(exp => {
        const expHours = parseInt(exp.duration.split(' ')[0])
        const [min, max] = filters.duration.split('-').map(v => v === '+' ? Infinity : parseInt(v))
        return expHours >= min && (max === Infinity ? true : expHours <= max)
      })
    }

    // Difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(exp => filters.difficulty.includes(exp.difficulty))
    }

    // Rating filter
    if (filters.rating !== "all") {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter(exp => exp.rating >= minRating)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "duration":
          return parseInt(a.duration) - parseInt(b.duration)
        case "featured":
        default:
          return a.featured ? -1 : b.featured ? 1 : 0
      }
    })

    setFilteredExperiences(filtered)
  }, [experiences, searchQuery, filters, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      category: checked
        ? [...prev.category, category]
        : prev.category.filter(c => c !== category)
    }))
  }

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      difficulty: checked
        ? [...prev.difficulty, difficulty]
        : prev.difficulty.filter(d => d !== difficulty)
    }))
  }

  const toggleFavorite = (experienceId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(experienceId)) {
        newFavorites.delete(experienceId)
      } else {
        newFavorites.add(experienceId)
      }
      return newFavorites
    })
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available': return <Badge variant="secondary" className="bg-success/10 text-success">Available</Badge>
      case 'limited': return <Badge variant="secondary" className="bg-warning/10 text-warning">Limited</Badge>
      case 'sold-out': return <Badge variant="secondary" className="bg-destructive/10 text-destructive">Sold Out</Badge>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-foreground">Destinations</Link>
            <span>/</span>
            <Link href={`/destinations/${slug}`} className="hover:text-foreground">{destinationName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Experiences</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Things to Do in {destinationName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover unforgettable experiences and activities in {destinationName}.
              From cultural tours to adventure activities, find the perfect way to explore this amazing destination.
            </p>

            {/* Search and Quick Filters */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto"
              >
                <Filter className="h-4 w-4 mr-2"/>
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="px-4 py-6 border-b bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={slug} className="flex items-center space-x-2">
                      <Checkbox
                        id={slug}
                        checked={filters.category.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}/>
                      <label htmlFor={slug} className="text-sm">{slug}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div>
                <h3 className="font-semibold mb-3">Duration</h3>
                <Select value={filters.duration} onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map(duration => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty & Rating */}
              <div>
                <h3 className="font-semibold mb-3">Difficulty</h3>
                <div className="space-y-2">
                  {difficulties.map(difficulty => (
                    <div key={difficulty} className="flex items-center space-x-2">
                      <Checkbox
                        id={difficulty}
                        checked={filters.difficulty.includes(difficulty)}
                        onCheckedChange={(checked) => handleDifficultyChange(difficulty, checked as boolean)}/>
                      <label htmlFor={difficulty} className="text-sm">{difficulty}</label>
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold mb-3 mt-6">Min Rating</h3>
                <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setFilters({
                category: [],
                priceRange: "all",
                duration: "all",
                difficulty: [],
                rating: "all"
              })}>
                Clear All Filters
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''} found
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="duration">Shortest Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Experiences Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {filteredExperiences.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">No experiences found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters to find more experiences.
              </p>
              <Button onClick={() => {
                setSearchQuery("")
                setFilters({
                  category: [],
                  priceRange: "all",
                  duration: "all",
                  difficulty: [],
                  rating: "all"
                })
              }}>
                Clear Search & Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExperiences.map((experience) => (
                <Card key={experience.id} className={`overflow-hidden hover:shadow-xl transition-shadow ${experience.featured ? 'ring-2 ring-accent-primary/20' : ''}`}>
                  {/* Image */}
                  <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                    {experience.featured && (
                      <Badge className="absolute top-3 left-3 bg-accent-primary">
                        Featured
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                      onClick={() => toggleFavorite(experience.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.has(experience.id) ? 'fill-red-500 text-semantic-error' : 'text-muted-foreground'}`}/>
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {experience.category}
                        </Badge>
                        {getAvailabilityBadge(experience.availability)}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{experience.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{experience.description}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(experience.rating) ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                        ))}
                      </div>
                      <span className="text-sm font-medium">{experience.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({experience.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2"/>
                        {experience.duration}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2"/>
                        {experience.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2"/>
                        {experience.groupSize}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {experience.highlights.slice(0, 2).map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                        {experience.highlights.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{experience.highlights.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-accent-primary">
                          ${experience.price}
                        </div>
                        <div className="text-sm text-muted-foreground">per person</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4"/>
                        </Button>
                        <Button size="sm">
                          <Ticket className="h-4 w-4 mr-1"/>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
