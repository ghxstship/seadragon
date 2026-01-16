'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { logger } from "@/lib/logger"
import { Search, Filter, Star, Heart, ShoppingCart, Truck, Shield, Award, Zap, Crown, Sparkles, Camera, Music, Lightbulb, Percent, Timer } from "lucide-react"
import { Header } from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

interface ProductApiResponse {
  id: string | number
  name?: string
  description?: string
  category?: string
  price?: number
  original_price?: number
  currency?: string
  rating?: number
  review_count?: number
  image?: string
  images?: string[]
  in_stock?: boolean
  featured?: boolean
  badge?: string
  tags?: string[]
  features?: string[]
  specifications?: Record<string, string>
  sale_ends_at?: string
}

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  originalPrice: number
  currency: string
  discountPercentage: number
  rating: number
  reviewCount: number
  image: string
  images: string[]
  inStock: boolean
  featured: boolean
  badge?: 'new' | 'bestseller' | 'limited' | 'sale'
  tags: string[]
  features: string[]
  specifications: Record<string, string>
  saleEndsAt?: string
}

interface FilterOptions {
  category: string[]
  priceRange: string
  rating: string
  availability: string
  discountRange: string
}

export default function Sale() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: "all",
    rating: "all",
    availability: "all",
    discountRange: "all"
  })
  const [sortBy, setSortBy] = useState("discount")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({})

  const categories = [
    { value: "audio", label: "Audio Equipment", icon: Music, count: 12 },
    { value: "lighting", label: "Lighting", icon: Lightbulb, count: 8 },
    { value: "cameras", label: "Cameras & Video", icon: Camera, count: 6 },
    { value: "accessories", label: "Accessories", icon: Sparkles, count: 15 },
    { value: "bundles", label: "Bundles & Kits", icon: Crown, count: 4 }
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-100", label: "Under $100" },
    { value: "100-500", label: "$100 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "1000+", label: "$1,000+" }
  ]

  const discountRanges = [
    { value: "all", label: "All Discounts" },
    { value: "10-25", label: "10% - 25% off" },
    { value: "25-50", label: "25% - 50% off" },
    { value: "50+", label: "50%+ off" }
  ]

  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "4.5", label: "4.5+ Stars" },
    { value: "4.0", label: "4.0+ Stars" },
    { value: "3.5", label: "3.5+ Stars" }
  ]

  const sortOptions = [
    { value: "discount", label: "Highest Discount" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      try {
        const res = await fetch('/api/v1/products?is_sale=true&limit=20')
        if (res.ok) {
          const data = await res.json()
          const productsData = Array.isArray(data.products) ? data.products : []
          const mapped: Product[] = productsData.map((p: ProductApiResponse) => {
            const price = Number(p.price) || 0
            const originalPrice = Number(p.original_price) || price
            const discountPercentage = originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0
            return {
              id: String(p.id),
              name: String(p.name || 'Product'),
              description: String(p.description || ''),
              category: String(p.category || 'general'),
              price,
              originalPrice,
              currency: p.currency || 'USD',
              discountPercentage,
              rating: Number(p.rating) || 4.5,
              reviewCount: Number(p.review_count) || 0,
              image: p.image || '/placeholder-product.jpg',
              images: Array.isArray(p.images) ? p.images : [p.image || '/placeholder-product.jpg'],
              inStock: p.in_stock !== false,
              featured: Boolean(p.featured),
              badge: p.badge as 'new' | 'bestseller' | 'limited' | 'sale' | undefined,
              tags: Array.isArray(p.tags) ? p.tags : [],
              features: Array.isArray(p.features) ? p.features : [],
              specifications: p.specifications || {},
              saleEndsAt: p.sale_ends_at
            }
          })
          if (!cancelled) {
            setProducts(mapped)
            setFilteredProducts(mapped)
          }
        } else {
          if (!cancelled) {
            setProducts([])
            setFilteredProducts([])
          }
        }
      } catch (error) {
        logger.error('Error loading sale products:', error)
        if (!cancelled) {
          setProducts([])
          setFilteredProducts([])
        }
      }
    }

    loadProducts()

    return () => { cancelled = true }
  }, [])

  // Update countdown timers
  useEffect(() => {
    const updateTimers = () => {
      const newTimeLeft: { [key: string]: string } = {}

      products.forEach((product: Product) => {
        if (product.saleEndsAt) {
          const endTime = new Date(product.saleEndsAt).getTime()
          const now = new Date().getTime()
          const distance = endTime - now

          if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            newTimeLeft[product.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`
          } else {
            newTimeLeft[product.id] = "Expired"
          }
        }
      })

      setTimeLeft(newTimeLeft)
    }

    updateTimers()
    const timer = setInterval(updateTimers, 1000)

    return () => clearInterval(timer)
  }, [products])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product: Product) => product.category === selectedCategory)
    }

    // Additional filters
    if (filters.category.length > 0) {
      filtered = filtered.filter((product: Product) => filters.category.includes(product.category))
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      if (filters.priceRange === "1000+") {
        filtered = filtered.filter((product: Product) => product.price >= 1000)
      } else if (filters.priceRange.includes('-')) {
        const parts = filters.priceRange.split('-')
        const min = parseInt(parts[0] || '0') || 0
        const max = parseInt(parts[1] || '999999') || Infinity
        filtered = filtered.filter((product: Product) => product.price >= min && product.price <= max)
      }
    }

    // Discount range filter
    if (filters.discountRange !== "all") {
      if (filters.discountRange === "50+") {
        filtered = filtered.filter((product: Product) => product.discountPercentage >= 50)
      } else if (filters.discountRange.includes('-')) {
        const parts = filters.discountRange.split('-')
        const min = parseInt(parts[0] || '0') || 0
        const max = parseInt(parts[1] || '100') || Infinity
        filtered = filtered.filter((product: Product) => product.discountPercentage >= min && product.discountPercentage <= max)
      }
    }

    // Rating filter
    if (filters.rating !== "all") {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter((product: Product) => product.rating >= minRating)
    }

    // Availability filter
    if (filters.availability === "in-stock") {
      filtered = filtered.filter((product: Product) => product.inStock)
    }

    // Sorting
    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "discount":
          return b.discountPercentage - a.discountPercentage
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.id.localeCompare(a.id) // Mock newest by ID
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, filters, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      category: checked
        ? [...prev.category, category]
        : prev.category.filter(c => c !== category)
    }))
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'new': return 'bg-success text-primary-foreground'
      case 'bestseller': return 'bg-warning text-primary-foreground'
      case 'limited': return 'bg-destructive text-primary-foreground'
      case 'sale': return 'bg-accent-primary text-primary-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getCategoryIcon = (categoryValue: string, className?: string) => {
    const category = categories.find(c => c.value === categoryValue)
    const Icon = category ? category.icon : Star
    return <Icon className={className}/>
  }

  const saleProducts = products.filter((p: Product) => p.discountPercentage > 0)
  const totalSavings = saleProducts.reduce((total: number, product: Product) => {
    return total + (product.originalPrice - product.price)
  }, 0)

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
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Sale</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Percent className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-4xl md-text-5xl font-display font-bold mb-4">
              Flash Sale
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Limited-time offers on premium equipment. Don&apos;t miss out on these incredible deals -
              all sales are final and while supplies last.
            </p>

            {/* Sale Stats */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">{saleProducts.length}</div>
                <div className="text-sm text-muted-foreground">Items on Sale</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  {Math.round(saleProducts.reduce((acc: number, p: Product) => acc + p.discountPercentage, 0) / saleProducts.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Discount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  ${totalSavings.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Timer className="h-6 w-6 text-accent-primary mr-2"/>
                  <span className="text-2xl font-bold text-accent-primary">24h</span>
                </div>
                <div className="text-sm text-muted-foreground">Left in Sale</div>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                  placeholder="Search sale items..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto mb-8">
              <TabsTrigger value="all" className="text-xs">
                All Sale ({products.length})
              </TabsTrigger>
              {categories.map((category: typeof categories[0]) => (
                <TabsTrigger key={category.value} value={category.value} className="text-xs">
                  <category.icon className="h-3 w-3 mr-1"/>
                  {category.label} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Sale Products Grid */}
            <TabsContent value={selectedCategory} className="mt-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">
                    {selectedCategory === "all" ? "All Sale Items" : categories.find(c => c.value === selectedCategory)?.label}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredProducts.length} sale item{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option: typeof sortOptions[0]) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2"/>
                    Filters
                  </Button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-5 gap-6">
                      {/* Categories */}
                      <div>
                        <h3 className="font-semibold mb-3">Categories</h3>
                        <div className="space-y-2">
                          {categories.map((category: typeof categories[0]) => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={category.value}
                                checked={filters.category.includes(category.value)}
                                onCheckedChange={(checked: boolean) => handleCategoryChange(category.value, checked)}/>
                              <label htmlFor={category.value} className="text-sm flex items-center">
                                <category.icon className="h-3 w-3 mr-2"/>
                                {category.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h3 className="font-semibold mb-3">Price Range</h3>
                        <Select value={filters.priceRange} onValueChange={(value: string) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {priceRanges.map((range: typeof priceRanges[0]) => (
                              <SelectItem key={range.value} value={range.value}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Discount Range */}
                      <div>
                        <h3 className="font-semibold mb-3">Discount</h3>
                        <Select value={filters.discountRange} onValueChange={(value: string) => setFilters(prev => ({ ...prev, discountRange: value }))}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {discountRanges.map((range: typeof discountRanges[0]) => (
                              <SelectItem key={range.value} value={range.value}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Rating */}
                      <div>
                        <h3 className="font-semibold mb-3">Minimum Rating</h3>
                        <Select value={filters.rating} onValueChange={(value: string) => setFilters(prev => ({ ...prev, rating: value }))}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {ratings.map((rating: typeof ratings[0]) => (
                              <SelectItem key={rating.value} value={rating.value}>
                                {rating.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Availability */}
                      <div>
                        <h3 className="font-semibold mb-3">Availability</h3>
                        <Select value={filters.availability} onValueChange={(value: string) => setFilters(prev => ({ ...prev, availability: value }))}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            <SelectItem value="in-stock">In Stock Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product: Product) => (
                  <Card key={product.id} className={`overflow-hidden hover:shadow-xl transition-shadow ${product.discountPercentage > 0 ? 'ring-2 ring-accent-primary/20' : ''}`}>
                    {/* Product Image */}
                    <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                      {product.badge && (
                        <Badge className={`absolute top-3 left-3 ${getBadgeColor(product.badge)}`}>
                          {product.badge === 'new' && <Zap className="h-3 w-3 mr-1"/>}
                          {product.badge === 'bestseller' && <Award className="h-3 w-3 mr-1"/>}
                          {product.badge === 'limited' && <Crown className="h-3 w-3 mr-1"/>}
                          {product.badge === 'sale' && <Sparkles className="h-3 w-3 mr-1"/>}
                          {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                        </Badge>
                      )}
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-destructive text-primary-foreground px-2 py-1 rounded text-sm font-bold">
                        -{product.discountPercentage}%
                      </div>
                      {/* Countdown Timer */}
                      {product.saleEndsAt && timeLeft[product.id] && (
                        <div className="absolute bottom-3 left-3 bg-neutral-900/80 text-primary-foreground px-2 py-1 rounded text-xs">
                          <Timer className="h-3 w-3 inline mr-1"/>
                          {timeLeft[product.id]}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-12 bg-background/80 hover:bg-background"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-semantic-error' : 'text-muted-foreground'}`}/>
                      </Button>
                    </div>

                    <CardContent className="p-6">
                      {/* Product Info */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryIcon(product.category, "h-3 w-3 mr-1")}
                            {categories.find(c => c.value === product.category)?.label}
                          </Badge>
                          {product.featured && (
                            <Badge variant="outline" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                            ))}
                          </div>
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviewCount} reviews)
                          </span>
                        </div>

                        {/* Price with Discount */}
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-2xl font-bold text-accent-primary">
                            ${product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            Save ${(product.originalPrice - product.price).toLocaleString()}
                          </Badge>
                        </div>

                        {/* Features Preview */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.features.slice(0, 2).map((feature: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {product.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Heart className="h-4 w-4 mr-1"/>
                          Save
                        </Button>
                        <Button size="sm" className="flex-1" disabled={!product.inStock}>
                          <ShoppingCart className="h-4 w-4 mr-1"/>
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span className={product.inStock ? 'text-success' : 'text-destructive'}>
                          {product.inStock ? ' In Stock' : ' Out of Stock'}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Truck className="h-3 w-3 mr-1"/>
                            Free shipping
                          </span>
                          <span className="flex items-center">
                            <Shield className="h-3 w-3 mr-1"/>
                            Warranty
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                    <h3 className="text-lg font-semibold mb-2">No sale items found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or filters to find more sale products.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery("")
                      setFilters({
                        category: [],
                        priceRange: "all",
                        rating: "all",
                        availability: "all",
                        discountRange: "all"
                      })
                    }}>
                      Clear Search & Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Sale Terms */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Percent className="h-5 w-5 mr-2"/>
                Sale Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Pricing & Payment</h4>
                  <ul className="space-y-1">
                    <li>• All sale prices are final and non-negotiable</li>
                    <li>• Sale items may not be combined with other offers</li>
                    <li>• Payment must be completed at time of purchase</li>
                    <li>• No price adjustments after purchase</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Availability & Shipping</h4>
                  <ul className="space-y-1">
                    <li>• Sale items are available while supplies last</li>
                    <li>• Free shipping on all sale items</li>
                    <li>• Limited-time offers end at specified times</li>
                    <li>• No rain checks or backorders on sale items</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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
