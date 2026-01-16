
'use client'

import { logger } from "@/lib/logger"

interface ExperienceApiResponse {
  id: string | number
  name?: string
  description?: string
  category?: string
  price?: number
  original_price?: number
  image?: string
  featured?: boolean
  in_stock?: boolean
  rating?: number
  review_count?: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  featured: boolean
  inStock: boolean
  rating: number
  reviews: number
}

const categories = [
  { name: "Audio", slug: "audio", count: 45 },
  { name: "Lighting", slug: "lighting", count: 38 },
  { name: "Video", slug: "video", count: 22 },
  { name: "Staging", slug: "staging", count: 29 },
  { name: "Accessories", slug: "accessories", count: 67 },
  { name: "Software", slug: "software", count: 15 }
]

export default function ShopPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      try {
        // Fetch products from experiences API
        const res = await fetch('/api/v1/experiences?limit=10')
        if (res.ok) {
          const data = await res.json()
          const experiences = data.data?.experiences || []
          const products: Product[] = experiences.map((e: ExperienceApiResponse, idx: number) => ({
            id: `product-${idx}`,
            name: String(e.name || 'Product'),
            description: String(e.description || ''),
            price: Number(e.price) || 0,
            originalPrice: e.original_price ? Number(e.original_price) : undefined,
            category: String(e.category || 'general'),
            image: e.image || '/placeholder-product.jpg',
            featured: Boolean(e.featured),
            inStock: e.in_stock !== false,
            rating: Number(e.rating) || 4.0,
            reviews: Number(e.review_count) || 0
          }))
          if (!cancelled) {
            setFeaturedProducts(products)
            setIsLoading(false)
          }
        } else {
          if (!cancelled) {
            setFeaturedProducts([])
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading products:', error)
        if (!cancelled) {
          setFeaturedProducts([])
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => { cancelled = true }
  }, [])
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Equipment Shop
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional-grade audio, lighting, video, and staging equipment for live entertainment production.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Browse All Products
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              View Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.slug} className="flex justify-between items-center">
                      <Link href={`/shop/${category.slug}`} className="text-sm hover:text-accent-primary">
                        {category.name}
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Price Range</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input type="number" placeholder="Min" className="w-full px-3 py-2 border rounded text-sm"/>
                        <span className="text-sm">-</span>
                        <Input type="number" placeholder="Max" className="w-full px-3 py-2 border rounded text-sm"/>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Availability</label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center space-x-2">
                        <Input type="checkbox" className="rounded"/>
                        <span className="text-sm">In Stock</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <Input type="checkbox" className="rounded"/>
                        <span className="text-sm">Pre-Order</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/shop/featured" className="block text-sm hover:text-accent-primary">Featured Products</Link>
                  <Link href="/shop/new" className="block text-sm hover:text-accent-primary">New Arrivals</Link>
                  <Link href="/shop/sale" className="block text-sm hover:text-accent-primary">Sale Items</Link>
                  <Link href="/shop/gift-cards" className="block text-sm hover:text-accent-primary">Gift Cards</Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Products */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-display font-bold">Featured Products</h2>
                <Button variant="outline">View All</Button>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <div className="absolute top-2 left-2 flex gap-2">
                        {product.featured && (
                          <Badge variant="default" className="text-xs">Featured</Badge>
                        )}
                        {product.originalPrice && (
                          <Badge variant="destructive" className="text-xs">Sale</Badge>
                        )}
                      </div>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center">
                          <Badge variant="secondary">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription className="text-sm">{product.category}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">
                           {product.rating} ({product.reviews})
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-accent-primary">
                              ${product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button size="sm" disabled={!product.inStock}>
                          {product.inStock ? 'Add to Cart' : 'Notify When Available'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Categories Grid */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">Shop by Category</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.slug} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.count} products available
                      </p>
                      <Button variant="outline" className="w-full">
                        Browse {category.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Newsletter Signup */}
            <section className="bg-muted/50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-display font-bold mb-4">
                Stay Updated on New Products
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get notified about new equipment arrivals, exclusive deals, and industry updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border rounded"/>
                <Button>Subscribe</Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
