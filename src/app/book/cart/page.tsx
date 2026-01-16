
'use client'


import { useEffect, useMemo, useState } from "react"
import { storage } from '@/lib/storage'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/lib/design-system"
import { Minus, Plus, Trash2, ShoppingBag, Ticket } from "lucide-react"
import { calculateCartTotals, mapApiCartItems, type CartItem } from "@/lib/cart/pricing"

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load cart from API or localStorage on mount
  useEffect(() => {
    let cancelled = false

    const loadCart = async () => {
      try {
        // Try API first
        const res = await fetch('/api/v1/cart')
        if (res.ok) {
          const data = await res.json()
          const items = mapApiCartItems(data.items)
          if (!cancelled && items.length > 0) {
            setCartItems(items)
            setLoading(false)
            return
          }
        }

        // Fallback to localStorage
        const savedCart = storage.local.get<CartItem[]>('atlvs-cart')
        if (!cancelled && savedCart && Array.isArray(savedCart)) {
          setCartItems(savedCart)
        }
      } catch (error) {
        logger.error('Error loading cart:', error)
        // Fallback to localStorage on error
        const savedCart = storage.local.get<CartItem[]>('atlvs-cart')
        if (!cancelled && savedCart && Array.isArray(savedCart)) {
          setCartItems(savedCart)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCart()

    return () => { cancelled = true }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      storage.local.set('atlvs-cart', cartItems)
    }
  }, [cartItems, loading])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const { subtotal, tax, total } = useMemo(
    () => calculateCartTotals(cartItems),
    [cartItems]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
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
            <Link href="/book" className="hover:text-foreground">Book</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Cart</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length > 0
              ? `Review your ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} and proceed to checkout.`
              : "Your cart is empty."
            }
          </p>
        </div>
      </section>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6"/>
            <h2 className="text-2xl font-display font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Discover amazing experiences and add them to your cart.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/experiences">Browse Experiences</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/events">Find Events</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        /* Cart Content */
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Item Image */}
                        <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-accent-primary/10 flex items-center justify-center">
                              <Ticket className="h-6 w-6 text-accent-primary"/>
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                              <Badge variant="secondary" className="text-xs mb-2">
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          {item.metadata && (
                            <div className="text-xs text-muted-foreground space-y-1 mb-3">
                              {item.metadata.date && <div> {item.metadata.date}</div>}
                              {item.metadata.venue && <div> {item.metadata.venue}</div>}
                              {item.metadata.category && <div>️ {item.metadata.category}</div>}
                            </div>
                          )}

                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3"/>
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 text-center"
                                min="1"/>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3"/>
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)} {item.currency}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-success">FREE</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)} USD</span>
                    </div>

                    <Button className="w-full" size="lg" asChild>
                      <Link href="/book/checkout">
                        Proceed to Checkout
                      </Link>
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Secure checkout powered by Stripe
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <span className="text-success mr-2"></span>
                        Free cancellation up to 24 hours
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-success mr-2"></span>
                        Instant confirmation
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-success mr-2"></span>
                        Mobile tickets
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-success mr-2"></span>
                        24/7 customer support
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/book">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
