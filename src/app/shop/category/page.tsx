
'use client'


import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Header } from "@/lib/design-system"
import { Filter, Grid3X3, List, Heart, ShoppingCart, Star, Package, Tag, SlidersHorizontal } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  images: string[]
  category: string
  subcategory: string
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
  tags: string[]
  discount?: number
  brand: string
  material?: string
  colors: string[]
  sizes?: string[]
}

interface CategoryFilter {
  id: string
  name: string
  count: number
  selected: boolean
}

interface PriceRange {
  min: number
  max: number
  current: [number, number]
}

export default function ShopCategoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock products data
  const products: Product[] = [
    {
      id: "1",
      name: "ATLVS + GVTEWAY Hoodie",
      description: "Premium cotton blend hoodie with embroidered logo",
      price: 89.99,
      originalPrice: 119.99,
      currency: "USD",
      images: ["/api/placeholder/400/400"],
      category: "clothing",
      subcategory: "hoodies",
      rating: 4.8,
      reviewCount: 156,
      inStock: true,
      featured: true,
      tags: ["hoodie", "cotton", "embroidered"],
      discount: 25,
      brand: "ATLVS + GVTEWAY",
      material: "Cotton Blend",
      colors: ["Black", "Navy", "Gray"],
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: "2",
      name: "Experience Journal Set",
      description: "Handcrafted leather-bound journal for recording your adventures",
      price: 45.00,
      currency: "USD",
      images: ["/api/placeholder/400/400"],
      category: "accessories",
      subcategory: "journals",
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      featured: true,
      tags: ["journal", "leather", "handcrafted"],
      brand: "Artisan Collective",
      material: "Genuine Leather",
      colors: ["Brown", "Black"]
    },
    {
      id: "3",
      name: "Cultural Experience Guidebook",
      description: "Comprehensive guide to cultural experiences and etiquette",
      price: 29.99,
      currency: "USD",
      images: ["/api/placeholder/400/400"],
      category: "books",
      subcategory: "guides",
      rating: 4.7,
      reviewCount: 234,
      inStock: true,
      featured: false,
      tags: ["guidebook", "cultural", "experiences"],
      brand: "Cultural Insights Press",
      colors: []
    },
    {
      id: "4",
      name: "Premium Travel Mug",
      description: "Insulated stainless steel travel mug with custom engraving",
      price: 34.99,
      originalPrice: 44.99,
      currency: "USD",
      images: ["/api/placeholder/400/400"],
      category: "accessories",
      subcategory: "drinkware",
      rating: 4.6,
      reviewCount: 67,
      inStock: true,
      featured: false,
      tags: ["travel mug", "stainless steel", "insulated"],
      discount: 22,
      brand: "Adventure Gear",
      material: "Stainless Steel",
      colors: ["Silver", "Black", "Copper"]
    },
    {
      id: "5",
      name: "Membership Welcome Kit",
      description: "Complete welcome package for new Elite members",
      price: 149.99,
      currency: "USD",
      images: ["/api/placeholder/400/400"],
      category: "membership",
      subcategory: "welcome-kits",
      rating: 5.0,
      reviewCount: 45,
      inStock: true,
      featured: true,
      tags: ["membership", "welcome kit", "elite"],
      brand: "ATLVS + GVTEWAY",
      colors: ["Custom"]
    },
    {
      id: "6",
      name: "Cultural Art Print Set",
      description: "Set of 3 framed art prints featuring cultural motifs",
      price: 79.99,
      currency: "USD",
      images: ["/api/placeholder/400/400"],
      category: "home-decor",
      subcategory: "art-prints",
      rating: 4.8,
      reviewCount: 123,
      inStock: false,
      featured: false,
      tags: ["art prints", "cultural", "framed"],
      brand: "Global Artisans",
      colors: []
    }
  ]

  const categories: CategoryFilter[] = [
    { id: "clothing", name: "Clothing", count: 12, selected: false },
    { id: "accessories", name: "Accessories", count: 28, selected: false },
    { id: "books", name: "Books & Guides", count: 15, selected: false },
    { id: "home-decor", name: "Home Decor", count: 8, selected: false },
    { id: "membership", name: "Membership Items", count: 5, selected: false }
  ]

  const priceRange: PriceRange = {
    min: 0,
    max: 200,
    current: [0, 200]
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const selectedCategories = categories.filter(cat => cat.selected).map(cat => cat.id)
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(product.category)

    const matchesPrice = product.price >= priceRange.current[0] && product.price <= priceRange.current[1]

    return matchesSearch && matchesCategory && matchesPrice
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id.localeCompare(a.id) // Assuming higher ID = newer
      case "featured":
      default:
        return b.featured ? 1 : -1
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/20 rounded-full mb-4">
              <Package className="h-8 w-8 text-accent-primary"/>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Shop Collection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover unique items inspired by our cultural experiences and adventures
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-center"/>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4"/>
              Filters
              <Badge variant="secondary" className="ml-1">
                {categories.filter(c => c.selected).length}
              </Badge>
            </Button>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4"/>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4"/>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} products
            </span>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-4 w-4 mr-2"/>
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={category.selected}
                            onCheckedChange={(checked) => {
                              category.selected = checked as boolean
                              // Force re-render (in real app, use state)
                            }}/>
                          <label
                            htmlFor={category.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                            <span className="text-muted-foreground ml-1">({category.count})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          className="w-20"
                        />
                        <span className="self-center">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          className="w-20"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Price range: $0 - $200
                      </p>
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="font-semibold mb-3">Availability</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" defaultChecked/>
                        <label htmlFor="in-stock" className="text-sm">
                          In Stock
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="on-sale"/>
                        <label htmlFor="on-sale" className="text-sm">
                          On Sale
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Products Grid */}
          <main className="flex-1">
            <div className={`${
              viewMode === 'grid'
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }`}>
              {filteredProducts.map((product) => (
                viewMode === 'grid' ? (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                      {product.featured && (
                        <Badge className="absolute top-2 left-2 bg-accent-primary">
                          Featured
                        </Badge>
                      )}
                      {product.discount && (
                        <Badge className="absolute top-2 right-2 bg-semantic-error">
                          -{product.discount}%
                        </Badge>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center">
                          <Badge variant="secondary" className="bg-background text-foreground">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <Heart className="h-4 w-4"/>
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>

                        <Button size="sm" disabled={!product.inStock}>
                          <ShoppingCart className="h-4 w-4 mr-1"/>
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"/>
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center rounded-lg">
                              <span className="text-xs text-primary-foreground font-medium">Out</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {product.description}
                              </p>
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400"/>
                                  <span>{product.rating} ({product.reviewCount})</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {product.brand}
                                </Badge>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-bold">
                                  ${product.price}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                  <Heart className="h-4 w-4"/>
                                </Button>
                                <Button size="sm" disabled={!product.inStock}>
                                  <ShoppingCart className="h-4 w-4 mr-1"/>
                                  {product.inStock ? 'Add' : 'Out'}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            {product.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {product.discount && (
                              <Badge className="text-xs bg-semantic-error/10 text-red-800">
                                -{product.discount}% off
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Shop.</p>
            <p className="text-sm mt-2">
              Curated products inspired by extraordinary experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
