
'use client'


import { logger } from "@/lib/logger"
import { Search, Filter, Star, Heart, ShoppingCart, Truck, Shield, Award, Zap, Crown, Sparkles, Camera, Music, Lightbulb, Clock } from "lucide-react"

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
  created_at?: string
}

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  originalPrice?: number
  currency: string
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
  addedDate: string
}

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  originalPrice?: number
  currency: string
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
  addedDate: string
}

interface FilterOptions {
  category: string[]
  priceRange: string
  rating: string
  availability: string
}

export default function New() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: "all",
    rating: "all",
    availability: "all"
  })
  const [sortBy, setSortBy] = useState("newest")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

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

  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "4.5", label: "4.5+ Stars" },
    { value: "4.0", label: "4.0+ Stars" },
    { value: "3.5", label: "3.5+ Stars" }
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      try {
        const res = await fetch('/api/v1/products?is_new=true&limit=20')
        if (res.ok) {
          const data = await res.json()
          const productsData = Array.isArray(data.products) ? data.products : []
          const mapped: Product[] = productsData.map((p: ProductApiResponse) => ({
            id: String(p.id),
            name: String(p.name || 'Product'),
            description: String(p.description || ''),
            category: String(p.category || 'general'),
            price: Number(p.price) || 0,
            originalPrice: p.original_price ? Number(p.original_price) : undefined,
            currency: p.currency || 'USD',
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
            addedDate: p.created_at || new Date().toISOString()
          }))
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
        logger.error('Error loading new products:', error)
        if (!cancelled) {
          setProducts([])
          setFilteredProducts([])
        }
      }
    }

    loadProducts()

    return () => { cancelled = true }
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Additional filters
    if (filters.category.length > 0) {
      filtered = filtered.filter(product => filters.category.includes(product.category))
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      if (filters.priceRange === "1000+") {
        filtered = filtered.filter(product => product.price >= 1000)
      } else {
        const [min, max] = filters.priceRange.split('-').map(v => parseInt(v))
        filtered = filtered.filter(product => product.price >= min && product.price <= max)
      }
    }

    // Rating filter
    if (filters.rating !== "all") {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter(product => product.rating >= minRating)
    }

    // Availability filter
    if (filters.availability === "in-stock") {
      filtered = filtered.filter(product => product.inStock)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        case "oldest":
          return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Added today"
    if (diffDays < 7) return `Added ${diffDays} days ago`
    if (diffDays < 30) return `Added ${Math.ceil(diffDays / 7)} weeks ago`
    return `Added ${Math.ceil(diffDays / 30)} months ago`
  }

  const newProducts = products.filter(p => p.badge === 'new')
  const categoryProducts = selectedCategory === "all"
    ? products
    : products.filter(p => p.category === selectedCategory)

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
            <span className="text-foreground font-medium">New</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              New Arrivals
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the latest innovations in professional equipment. Stay ahead of the curve with our newest products,
              featuring cutting-edge technology and premium quality.
            </p>

            {/* New Arrivals Stats */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-2xl font-bold text-accent-primary">{newProducts.length}</div>
                <div className="text-sm text-muted-foreground">New This Month</div>
              </div>
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-2xl font-bold text-accent-primary">6</div>
                <div className="text-sm text-muted-foreground">Cutting-Edge Tech</div>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-2xl font-bold text-accent-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Expert Support</div>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-2xl font-bold text-accent-primary">Free</div>
                <div className="text-sm text-muted-foreground">Shipping on New</div>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                  placeholder="Search new arrivals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto mb-8">
              <TabsTrigger value="all" className="text-xs">
                All New ({products.length})
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.value} value={category.value} className="text-xs">
                  <category.icon className="h-3 w-3 mr-1"/>
                  {category.label} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>

            {/* New Products Grid */}
            <TabsContent value={selectedCategory} className="mt-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">
                    {selectedCategory === "all" ? "All New Arrivals" : categories.find(c => c.value === selectedCategory)?.label}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredProducts.length} new product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex items-center space-x-4">
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
                    <div className="grid md:grid-cols-4 gap-6">
                      {/* Categories */}
                      <div>
                        <h3 className="font-semibold mb-3">Categories</h3>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={category.value}
                                checked={filters.category.includes(category.value)}
                                onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}/>
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

                      {/* Rating */}
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
                      </div>

                      {/* Availability */}
                      <div>
                        <h3 className="font-semibold mb-3">Availability</h3>
                        <Select value={filters.availability} onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}>
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
                {filteredProducts.map((product) => (
                  <Card key={product.id} className={`overflow-hidden hover:shadow-xl transition-shadow ${product.badge === 'new' ? 'ring-2 ring-success/20' : ''}`}>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-semantic-error' : 'text-muted-foreground'}`}/>
                      </Button>
                      {/* New Badge with Date */}
                      <div className="absolute bottom-3 left-3 bg-success/90 text-primary-foreground px-2 py-1 rounded text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1"/>
                        {formatDate(product.addedDate)}
                      </div>
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

                        {/* Price */}
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-2xl font-bold text-accent-primary">
                            ${product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground">{product.currency}</span>
                        </div>

                        {/* Features Preview */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.features.slice(0, 2).map((feature, index) => (
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
                    <h3 className="text-lg font-semibold mb-2">No new products found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or filters to find more new arrivals.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery("")
                      setFilters({
                        category: [],
                        priceRange: "all",
                        rating: "all",
                        availability: "all"
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

      {/* Newsletter Signup */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
              <h3 className="text-2xl font-display font-bold mb-4">Stay Updated on New Arrivals</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Be the first to know about our latest products and innovations. Get exclusive access to new releases and special offers.
              </p>
              <div className="flex max-w-md mx-auto gap-2">
                <Input placeholder="Enter your email" className="flex-1"/>
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Unsubscribe at any time. We respect your privacy.
              </p>
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
