'use client'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { logger } from "@/lib/logger"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Search, Filter, MapPin, Star, Wifi, Car, Utensils, Dumbbell, Waves, Coffee, Calendar as CalendarIcon, Users, DollarSign, Heart, Share2, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { useState, useEffect, use } from 'react'

interface AccommodationApiResponse {
  id: string | number
  name?: string
  type?: string
  rating?: number
  review_count?: number
  price_per_night?: number
  currency?: string
  location?: string
  distance?: string
  images?: string[]
  description?: string
  amenities?: string[]
  rooms?: number
  capacity?: number
  breakfast?: boolean
  cancellation?: string
  featured?: boolean
}

interface Accommodation {
  id: string
  name: string
  type: 'hotel' | 'resort' | 'bnb' | 'apartment' | 'hostel' | 'villa'
  rating: number
  reviewCount: number
  pricePerNight: number
  currency: string
  location: string
  distance: string
  images: string[]
  description: string
  amenities: string[]
  rooms: number
  capacity: number
  breakfast: boolean
  cancellation: 'free' | 'flexible' | 'moderate' | 'strict'
  featured: boolean
}

interface FilterOptions {
  type: string[]
  priceRange: number[]
  amenities: string[]
  rating: string
  cancellation: string
}

export default function Accommodations({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const destinationName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    priceRange: [0, 500],
    amenities: [],
    rating: "all",
    cancellation: "all"
  })
  const [sortBy, setSortBy] = useState("recommended")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guests, setGuests] = useState(2)

  const accommodationTypes = [
    { value: "hotel", label: "Hotels", icon: "" },
    { value: "resort", label: "Resorts", icon: "️" },
    { value: "bnb", label: "Bed & Breakfast", icon: "" },
    { value: "apartment", label: "Apartments", icon: "" },
    { value: "hostel", label: "Hostels", icon: "️" },
    { value: "villa", label: "Villas", icon: "️" }
  ]

  const amenityOptions = [
    { value: "wifi", label: "Free WiFi", icon: Wifi },
    { value: "parking", label: "Free Parking", icon: Car },
    { value: "restaurant", label: "Restaurant", icon: Utensils },
    { value: "gym", label: "Fitness Center", icon: Dumbbell },
    { value: "pool", label: "Swimming Pool", icon: Waves },
    { value: "breakfast", label: "Breakfast", icon: Coffee }
  ]

  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "4.5", label: "4.5+ Stars" },
    { value: "4.0", label: "4.0+ Stars" },
    { value: "3.5", label: "3.5+ Stars" }
  ]

  const cancellationPolicies = [
    { value: "all", label: "All Policies" },
    { value: "free", label: "Free Cancellation" },
    { value: "flexible", label: "Flexible" },
    { value: "moderate", label: "Moderate" },
    { value: "strict", label: "Strict" }
  ]

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "distance", label: "Nearest First" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadAccommodations = async () => {
      try {
        const res = await fetch(`/api/v1/destinations/${slug}/accommodations`)
        if (res.ok) {
          const data = await res.json()
          const accommodationsData = Array.isArray(data.accommodations) ? data.accommodations : []
          const mapped: Accommodation[] = accommodationsData.map((a: AccommodationApiResponse) => ({
            id: String(a.id),
            name: String(a.name || 'Accommodation'),
            type: (a.type as 'hotel' | 'resort' | 'bnb' | 'apartment' | 'hostel' | 'villa') || 'hotel',
            rating: Number(a.rating) || 4.0,
            reviewCount: Number(a.review_count) || 0,
            pricePerNight: Number(a.price_per_night) || 0,
            currency: a.currency || 'USD',
            location: String(a.location || ''),
            distance: a.distance || '',
            images: Array.isArray(a.images) ? a.images : ['/placeholder-hotel.jpg'],
            description: String(a.description || ''),
            amenities: Array.isArray(a.amenities) ? a.amenities : [],
            rooms: Number(a.rooms) || 1,
            capacity: Number(a.capacity) || 2,
            breakfast: Boolean(a.breakfast),
            cancellation: (a.cancellation as 'free' | 'flexible' | 'moderate' | 'strict') || 'moderate',
            featured: Boolean(a.featured)
          }))
          if (!cancelled) {
            setAccommodations(mapped)
            setFilteredAccommodations(mapped)
          }
        } else {
          if (!cancelled) {
            setAccommodations([])
            setFilteredAccommodations([])
          }
        }
      } catch (error) {
        logger.error('Error loading accommodations:', error)
        if (!cancelled) {
          setAccommodations([])
          setFilteredAccommodations([])
        }
      }
    }

    loadAccommodations()

    return () => { cancelled = true }
  }, [slug])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = accommodations

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(acc =>
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(acc => filters.type.includes(acc.type))
    }

    // Price range filter
    filtered = filtered.filter(acc =>
      acc.pricePerNight >= filters.priceRange[0] && acc.pricePerNight <= filters.priceRange[1]
    )

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(acc =>
        filters.amenities.every(amenity => acc.amenities.includes(amenity))
      )
    }

    // Rating filter
    if (filters.rating !== "all") {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter(acc => acc.rating >= minRating)
    }

    // Cancellation filter
    if (filters.cancellation !== "all") {
      filtered = filtered.filter(acc => acc.cancellation === filters.cancellation)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricePerNight - b.pricePerNight
        case "price-high":
          return b.pricePerNight - a.pricePerNight
        case "rating":
          return b.rating - a.rating
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance)
        case "recommended":
        default:
          return a.featured ? -1 : b.featured ? 1 : 0
      }
    })

    setFilteredAccommodations(filtered)
  }, [accommodations, searchQuery, filters, sortBy])

  const handleTypeChange = (type: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      type: checked
        ? [...prev.type, type]
        : prev.type.filter(t => t !== type)
    }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }))
  }

  const toggleFavorite = (accommodationId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(accommodationId)) {
        newFavorites.delete(accommodationId)
      } else {
        newFavorites.add(accommodationId)
      }
      return newFavorites
    })
  }

  const getCancellationBadge = (cancellation: string) => {
    switch (cancellation) {
      case 'free': return <Badge variant="secondary" className="bg-success/10 text-success">Free Cancellation</Badge>
      case 'flexible': return <Badge variant="secondary" className="bg-warning/10 text-warning">Flexible</Badge>
      case 'moderate': return <Badge variant="secondary" className="bg-semantic-warning/10 text-semantic-warning">Moderate</Badge>
      case 'strict': return <Badge variant="secondary" className="bg-destructive/10 text-destructive">Strict</Badge>
      default: return null
    }
  }

  const getTypeIcon = (type: string) => {
    const typeData = accommodationTypes.find(t => t.value === type)
    return typeData ? typeData.icon : ""
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
            <span className="text-foreground font-medium">Accommodations</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Stay in {destinationName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the perfect accommodation for your stay. From luxury resorts to cozy boutique hotels,
              find your ideal lodging option in {destinationName}.
            </p>

            {/* Search and Quick Filters */}
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                  placeholder="Search accommodations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {checkInDate ? format(checkInDate, "MMM dd") : "Check-in"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    initialFocus/>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {checkOutDate ? format(checkOutDate, "MMM dd") : "Check-out"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    initialFocus/>
                </PopoverContent>
              </Popover>

              <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Guests"/>
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Guest{num !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="px-4 py-6 border-b bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Accommodation Types */}
              <div>
                <h3 className="font-semibold mb-3">Property Type</h3>
                <div className="space-y-2">
                  {accommodationTypes.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={filters.type.includes(type.value)}
                        onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}/>
                      <label htmlFor={type.value} className="text-sm flex items-center">
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price per Night</h3>
                <div className="space-y-4">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"/>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}+</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="space-y-2">
                  {amenityOptions.map(amenity => (
                    <div key={amenity.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.value}
                        checked={filters.amenities.includes(amenity.value)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity.value, checked as boolean)}/>
                      <label htmlFor={amenity.value} className="text-sm flex items-center">
                        <amenity.icon className="h-3 w-3 mr-2"/>
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating & Cancellation */}
              <div>
                <h3 className="font-semibold mb-3">Minimum Rating</h3>
                <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map(rating => (
                      <SelectItem key={rating.value} value={rating.value}>
                        {rating.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <h3 className="font-semibold mb-3 mt-6">Cancellation Policy</h3>
                <Select value={filters.cancellation} onValueChange={(value) => setFilters(prev => ({ ...prev, cancellation: value }))}>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {cancellationPolicies.map(policy => (
                      <SelectItem key={policy.value} value={policy.value}>
                        {policy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setFilters({
                type: [],
                priceRange: [0, 500],
                amenities: [],
                rating: "all",
                cancellation: "all"
              })}>
                Clear All Filters
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredAccommodations.length} propert{filteredAccommodations.length !== 1 ? 'ies' : 'y'} found
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Accommodations Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">
                {filteredAccommodations.length} Accommodation{filteredAccommodations.length !== 1 ? 's' : ''} in {destinationName}
              </h2>
              <p className="text-muted-foreground">
                {checkInDate && checkOutDate
                  ? `Showing availability from ${format(checkInDate, "MMM dd")} to ${format(checkOutDate, "MMM dd")} for ${guests} guest${guests !== 1 ? 's' : ''}`
                  : "Select dates to check availability"
                }
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2"/>
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>

          {filteredAccommodations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                <h3 className="text-lg font-semibold mb-2">No accommodations found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters to find more options.
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setFilters({
                    type: [],
                    priceRange: [0, 500],
                    amenities: [],
                    rating: "all",
                    cancellation: "all"
                  })
                }}>
                  Clear Search & Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAccommodations.map((accommodation) => (
                <Card key={accommodation.id} className={`overflow-hidden hover:shadow-xl transition-shadow ${accommodation.featured ? 'ring-2 ring-accent-primary/20' : ''}`}>
                  {/* Images */}
                  <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                    {accommodation.featured && (
                      <Badge className="absolute top-3 left-3 bg-accent-primary">
                        Featured
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                      onClick={() => toggleFavorite(accommodation.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.has(accommodation.id) ? 'fill-red-500 text-semantic-error' : 'text-muted-foreground'}`}/>
                    </Button>
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        {getTypeIcon(accommodation.type)} {accommodation.type}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{accommodation.name}</h3>
                        <div className="flex items-center space-x-1 ml-2">
                          <Star className="h-4 w-4 fill-accent-primary text-accent-primary"/>
                          <span className="text-sm font-medium">{accommodation.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({accommodation.reviewCount})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1"/>
                        {accommodation.location} • {accommodation.distance}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {accommodation.description}
                      </p>

                      {/* Amenities Preview */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {accommodation.amenities.slice(0, 3).map((amenity, index) => {
                          const amenityData = amenityOptions.find(a => a.value === amenity)
                          return amenityData ? (
                            <Badge key={index} variant="outline" className="text-xs">
                              <amenityData.icon className="h-2 w-2 mr-1"/>
                              {amenityData.label}
                            </Badge>
                          ) : null
                        })}
                        {accommodation.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{accommodation.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{accommodation.rooms} rooms</span>
                        <span>Up to {accommodation.capacity} guests</span>
                        {accommodation.breakfast && <span>Breakfast included</span>}
                      </div>

                      {getCancellationBadge(accommodation.cancellation)}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-accent-primary">
                          ${accommodation.pricePerNight}
                        </div>
                        <div className="text-sm text-muted-foreground">per night</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4"/>
                        </Button>
                        <Button size="sm">
                          <ExternalLink className="h-4 w-4 mr-1"/>
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
