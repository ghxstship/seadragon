
'use client'

import { logger } from "@/lib/logger"

interface CartItemApiResponse {
  id: string | number
  product_id?: string | number
  productId?: string | number
  name?: string
  price?: number
  quantity?: number
  image?: string
  category?: string
  in_stock?: boolean
  max_quantity?: number
}

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
  inStock: boolean
  maxQuantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadCart = async () => {
      try {
        const res = await fetch('/api/v1/cart')
        if (res.ok) {
          const data = await res.json()
          const items = Array.isArray(data.items) ? data.items : []
          if (!cancelled) {
            setCartItems(items.map((item: CartItemApiResponse) => ({
              id: String(item.id),
              productId: String(item.product_id || item.productId),
              name: String(item.name || ''),
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 1),
              image: item.image || '/placeholder-product.jpg',
              category: String(item.category || ''),
              inStock: Boolean(item.in_stock !== false),
              maxQuantity: Number(item.max_quantity || 10)
            })))
          }
        } else {
          if (!cancelled) {
            setCartItems([])
          }
        }
      } catch (error) {
        logger.error('Error loading cart:', error)
        if (!cancelled) {
          setCartItems([])
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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    return subtotal > 1000 ? 0 : 49.99
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping()
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax()
  const shipping = calculateShipping()
  const total = calculateTotal()

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
            <Link href="/shop" className="text-sm font-medium hover:text-accent-primary">Shop</Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent-primary">About</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button variant="outline">Cart ({cartItems.length})</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your items and proceed to checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-2xl font-display font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some equipment to get started with your event production setup.</p>
            <Button size="lg">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0"/>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-semantic-error hover:text-semantic-error">
                            Remove
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border rounded">
                              <Button className="px-3 py-1 hover:bg-muted">-</Button>
                              <span className="px-4 py-1 border-x">{item.quantity}</span>
                              <Button className="px-3 py-1 hover:bg-muted">+</Button>
                            </div>

                            <div className="text-sm">
                              {item.inStock ? (
                                <span className="text-semantic-success"> In stock</span>
                              ) : (
                                <span className="text-semantic-error"> Out of stock</span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold">
                              ${(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Continue Shopping */}
              <div className="flex justify-between items-center">
                <Button variant="outline">
                  ← Continue Shopping
                </Button>
                <Button variant="outline">
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {subtotal < 1000 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Add ${(1000 - subtotal).toLocaleString()} more for free shipping!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Promo Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter promo code"/>
                    <Button variant="outline">Apply</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accepted Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Badge variant="outline"> Credit Card</Badge>
                    <Badge variant="outline"> Bank Transfer</Badge>
                    <Badge variant="outline"> Digital Wallet</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Orders typically ship within 2-3 business days</p>
                    <p>• White glove delivery available for large equipment</p>
                    <p>• Free shipping on orders over $1,000</p>
                    <p>• Professional setup services available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
