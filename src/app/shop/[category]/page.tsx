
'use client'


import { logger } from "@/lib/logger"
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star, ChevronDown, SlidersHorizontal, X, ChevronLeft } from "lucide-react"

interface ProductApiResponse {
  id: string | number
  name?: string
  price?: number
  original_price?: number
  rating?: number
  review_count?: number
  image?: string
  category?: string
  brand?: string
  in_stock?: boolean
  is_new?: boolean
  is_sale?: boolean
  tags?: string[]
  description?: string
  variants?: string[]
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  category: string
  brand: string
  inStock: boolean
  isNew: boolean
  isSale: boolean
  tags: string[]
  description: string
  variants?: string[]
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  category: string
  brand: string
  inStock: boolean
  isNew: boolean
  isSale: boolean
  tags: string[]
  description: string
  variants?: string[]
}

interface CategoryShopProps {
  params: Promise<{ category: string }>
}

export default function CategoryShop({ params }: CategoryShopProps) {
  const { category } = use(params)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
    { value: "name", label: "Name A-Z" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      try {
        // Fetch products from API
        const res = await fetch(`/api/v1/products?category=${category}&limit=20`)
        if (res.ok) {
          const data = await res.json()
          const productsData = Array.isArray(data.products) ? data.products : []
          const mapped: Product[] = productsData.map((p: ProductApiResponse) => ({
            id: String(p.id),
            name: String(p.name || 'Product'),
            price: Number(p.price) || 0,
            originalPrice: p.original_price ? Number(p.original_price) : undefined,
            rating: Number(p.rating) || 4.0,
            reviewCount: Number(p.review_count) || 0,
            image: p.image || '/placeholder-product.jpg',
            category: String(p.category || category),
            brand: String(p.brand || 'Brand'),
            inStock: p.in_stock !== false,
            isNew: Boolean(p.is_new),
            isSale: Boolean(p.is_sale),
            tags: Array.isArray(p.tags) ? p.tags : [],
            description: String(p.description || ''),
            variants: p.variants
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
        logger.error('Error loading products:', error)
        if (!cancelled) {
          setProducts([])
          setFilteredProducts([])
        }
      }
    }

    loadProducts()

    return () => { cancelled = true }
  }, [category])

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false

      // Tags filter
      if (selectedTags.length > 0 && !selectedTags.some(tag => product.tags.includes(tag))) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!product.name.toLowerCase().includes(query) &&
            !product.brand.toLowerCase().includes(query) &&
            !product.tags.some(tag => tag.toLowerCase().includes(query))) {
          return false
        }
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.isNew ? 1 : -1
        case "name":
          return a.name.localeCompare(b.name)
        case "featured":
        default:
          // Featured: prioritize new items, then sale items, then by rating
          if (a.isNew && !b.isNew) return -1
          if (!a.isNew && b.isNew) return 1
          if (a.isSale && !b.isSale) return -1
          if (!a.isSale && b.isSale) return 1
          return b.rating - a.rating
      }
    })

    return filtered
  }, [products, priceRange, selectedBrands, selectedTags, searchQuery, sortBy])

  const uniqueBrands = [...new Set(products.map(p => p.brand))]
  const uniqueTags = [...new Set(products.flatMap(p => p.tags))]

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

  const clearAllFilters = () => {
    setPriceRange([0, 500])
    setSelectedBrands([])
    setSelectedTags([])
    setSearchQuery("")
  }

  const activeFiltersCount = (selectedBrands.length + selectedTags.length) +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0) +
    (searchQuery ? 1 : 0)

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
            <span className="text-foreground font-medium">{categoryName}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {categoryName}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover our premium selection of {categoryName.toLowerCase()} products
            </p>

            {/* Category Stats */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">{products.length}</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">{uniqueBrands.length}</div>
                <div className="text-sm text-muted-foreground">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  {products.filter(p => p.isNew).length}
                </div>
                <div className="text-sm text-muted-foreground">New Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  {products.filter(p => p.isSale).length}
                </div>
                <div className="text-sm text-muted-foreground">On Sale</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2"/>
                    Filters
                  </span>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear All ({activeFiltersCount})
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"/>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"/>
                </div>

                {/* Brands */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Brands</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uniqueBrands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands(prev => [...prev, brand])
                            } else {
                              setSelectedBrands(prev => prev.filter(b => b !== brand))
                            }
                          }}/>
                        <label
                          htmlFor={`brand-${brand}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Features</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uniqueTags.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTags(prev => [...prev, tag])
                            } else {
                              setSelectedTags(prev => prev.filter(t => t !== tag))
                            }
                          }}/>
                        <label
                          htmlFor={`tag-${tag}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {tag.replace('-', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2"/>
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>

                <div className="text-sm text-muted-foreground">
                  {processedProducts.length} of {products.length} products
                </div>
              </div>

              <div className="flex items-center gap-4 ml-auto">
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

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4"/>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            {processedProducts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms.
                  </p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {processedProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative">
                      <Link href={`/shop/product/${product.id}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={256}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"/>
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <Badge className="bg-semantic-success text-primary-foreground">New</Badge>
                        )}
                        {product.isSale && (
                          <Badge className="bg-semantic-error text-primary-foreground">Sale</Badge>
                        )}
                        {!product.inStock && (
                          <Badge variant="secondary">Out of Stock</Badge>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.has(product.id)
                              ? 'fill-red-500 text-semantic-error'
                              : 'text-neutral-600'
                          }`}/>
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <Link href={`/shop/product/${product.id}`}>
                          <h3 className="font-semibold text-lg hover:text-accent-primary transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current"/>
                          <span className="text-sm font-medium ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-bold text-accent-primary">
                          ${product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          disabled={!product.inStock}
                          asChild={product.inStock}
                        >
                          {product.inStock ? (
                            <Link href={`/shop/product/${product.id}`}>
                              View Details
                            </Link>
                          ) : (
                            <span>Out of Stock</span>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ShoppingCart className="h-4 w-4"/>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Find the perfect {categoryName.toLowerCase()} products for your needs.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" asChild>
                <Link href="/shop">
                  <ChevronLeft className="h-4 w-4 mr-2"/>
                  Back to Shop
                </Link>
              </Button>
              <Button asChild>
                <Link href="/shop/cart">
                  <ShoppingCart className="h-4 w-4 mr-2"/>
                  View Cart
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
