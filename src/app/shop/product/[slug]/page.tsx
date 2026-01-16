
'use client'

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logger } from "@/lib/logger"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  sku: string
  inStock: boolean
  inventory: number
  images: string[]
  rating: number
  reviews: number
  specifications: Record<string, string>
  features: string[]
  reviewsData: { id: string; user: string; rating: number; title: string; content: string; date: string; verified: boolean }[]
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/v1/products/${slug}`)
        if (res.ok) {
          const data = await res.json()
          const p = data.product || data
          if (!cancelled && p) {
            setProduct({
              id: String(p.id || slug),
              name: String(p.name || ''),
              slug: slug,
              description: String(p.description || ''),
              longDescription: String(p.long_description || p.longDescription || ''),
              price: Number(p.price || 0),
              originalPrice: p.original_price || p.originalPrice,
              category: String(p.category || ''),
              brand: String(p.brand || ''),
              sku: String(p.sku || ''),
              inStock: Boolean(p.in_stock ?? p.inStock ?? true),
              inventory: Number(p.inventory || 0),
              images: Array.isArray(p.images) ? p.images : [],
              rating: Number(p.rating || 0),
              reviews: Number(p.reviews || 0),
              specifications: p.specifications || {},
              features: Array.isArray(p.features) ? p.features : [],
              reviewsData: Array.isArray(p.reviews_data || p.reviewsData) ? (p.reviews_data || p.reviewsData) : []
            })
          }
        }
      } catch (error) {
        logger.error('Error loading product:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground">The product {slug} does not exist.</p>
          <Link href="/shop" className="text-accent-primary mt-4 inline-block">Back to Shop</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-display font-bold">ATLVS + GVTEWAY</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-accent-primary">Home</Link>
            <Link href="/destinations" className="text-sm font-medium hover:text-accent-primary">Destinations</Link>
            <Link href="/experiences" className="text-sm font-medium hover:text-accent-primary">Experiences</Link>
            <Link href="/events" className="text-sm font-medium hover:text-accent-primary">Events</Link>
            <Link href="/shop" className="text-sm font-medium text-accent-primary">Shop</Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent-primary">About</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button>Cart (0)</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent-primary">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
                <div className="flex items-center space-x-1">
                  <span className="text-sm"></span>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviewsData.length} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl font-display font-bold mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-accent-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </Badge>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${product.inStock ? 'text-semantic-success' : 'text-semantic-error'}`}>
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-semantic-success' : 'bg-semantic-error'}`}/>
                <span className="font-medium">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              {product.inStock && (
                <span className="text-sm text-muted-foreground">
                  {product.inventory} available
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded">
                  <Button className="px-3 py-2 hover:bg-muted">-</Button>
                  <span className="px-4 py-2 border-x">1</span>
                  <Button className="px-3 py-2 hover:bg-muted">+</Button>
                </div>
                <Button className="flex-1" size="lg" disabled={!product.inStock}>
                  {product.inStock ? 'Add to Cart' : 'Notify When Available'}
                </Button>
              </div>
              <Button variant="outline" className="w-full" size="lg">
                Add to Wishlist
              </Button>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-accent-primary mt-1"></span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SKU */}
            <div className="text-sm text-muted-foreground">
              SKU: {product.sku}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-lg max-w-none">
                    {product.longDescription.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {product.reviewsData.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">{review.user}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? "text-yellow-400" : "text-neutral-300"}>
                                
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                      <p className="text-muted-foreground">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Options</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Standard Shipping (5-7 business days)</span>
                          <span>$49.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expedited Shipping (2-3 business days)</span>
                          <span>$99.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>White Glove Service (professional setup)</span>
                          <span>$249.99</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Returns & Exchanges</h4>
                      <p className="text-sm text-muted-foreground">
                        30-day return policy for unused equipment in original packaging.
                        Professional equipment may require inspection before return.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Warranty</h4>
                      <p className="text-sm text-muted-foreground">
                        1-year manufacturer warranty on all equipment.
                        Extended warranty options available.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-display font-bold mb-8">Related Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-muted rounded-t-lg"/>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Related Product {i}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Professional audio equipment</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">$1,299</span>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
