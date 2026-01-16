
'use client'

import { logger } from '@/lib/logger'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PaymentCheckout } from "@/components/payments/payment-checkout"

interface CartItemApiResponse {
  id: string | number
  product_id?: string | number
  productId?: string | number
  name?: string
  price?: number
  quantity?: number
  category?: string
}

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  category: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  const [shippingMethod, setShippingMethod] = useState('standard')

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
              category: String(item.category || '')
            })))
          }
        }
      } catch (error) {
        logger.error('Error loading cart:', error)
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

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePaymentSuccess = () => {
    setStep('review')
  }

  const handlePaymentError = (error: string) => {
    logger.error('Payment error', { error })
  }

  const handlePlaceOrder = () => {
    // In real app, this would submit the order
    logger.action('order_placed', { total, items: cartItems.length })
    // Redirect to confirmation page
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
            <Link href="/shop" className="text-sm font-medium hover:text-accent-primary">Shop</Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent-primary">About</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button variant="outline">Cart ({cartItems.length})</Button>
          </div>
        </div>
      </header>

      {/* Checkout Steps */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-8">
            <div className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-accent-primary' : step === 'payment' || step === 'review' ? 'text-semantic-success' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === 'shipping' ? 'bg-accent-primary text-primary-foreground' :
                step === 'payment' || step === 'review' ? 'bg-semantic-success text-primary-foreground' : 'bg-muted'
              }`}>
                1
              </div>
              <span className="font-medium">Shipping</span>
            </div>

            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-accent-primary' : step === 'review' ? 'text-semantic-success' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === 'payment' ? 'bg-accent-primary text-primary-foreground' :
                step === 'review' ? 'bg-semantic-success text-primary-foreground' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>

            <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-accent-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === 'review' ? 'bg-accent-primary text-primary-foreground' : 'bg-muted'
              }`}>
                3
              </div>
              <span className="font-medium">Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>
                    Enter your shipping details for equipment delivery.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                            required/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                            required/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                            required/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                            required/>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input
                            id="address"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                            required/>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={shippingInfo.city}
                              onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                              required/>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={shippingInfo.state}
                              onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                              required/>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              value={shippingInfo.zipCode}
                              onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                              required/>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Select value={shippingInfo.country} onValueChange={(value: string) => setShippingInfo({...shippingInfo, country: value})}>
                            <SelectTrigger>
                              <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center space-x-3">
                            <Input
                              type="radio"
                              name="shipping"
                              value="standard"
                              checked={shippingMethod === 'standard'}
                              onChange={(e) => setShippingMethod(e.target.value)}/>
                            <div>
                              <p className="font-medium">Standard Shipping</p>
                              <p className="text-sm text-muted-foreground">5-7 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold">$49.99</span>
                        </label>

                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center space-x-3">
                            <Input
                              type="radio"
                              name="shipping"
                              value="expedited"
                              checked={shippingMethod === 'expedited'}
                              onChange={(e) => setShippingMethod(e.target.value)}/>
                            <div>
                              <p className="font-medium">Expedited Shipping</p>
                              <p className="text-sm text-muted-foreground">2-3 business days</p>
                            </div>
                          </div>
                          <span className="font-semibold">$99.99</span>
                        </label>

                        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex items-center space-x-3">
                            <Input
                              type="radio"
                              name="shipping"
                              value="white-glove"
                              checked={shippingMethod === 'white-glove'}
                              onChange={(e) => setShippingMethod(e.target.value)}/>
                            <div>
                              <p className="font-medium">White Glove Service</p>
                              <p className="text-sm text-muted-foreground">Professional setup included</p>
                            </div>
                          </div>
                          <span className="font-semibold">$249.99</span>
                        </label>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="billing-same"
                          checked={billingSameAsShipping}
                          onCheckedChange={(checked) => setBillingSameAsShipping(checked as boolean)}/>
                        <Label htmlFor="billing-same">Billing address is the same as shipping</Label>
                      </div>

                      {!billingSameAsShipping && (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Billing Address</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="billingFirstName">First Name</Label>
                              <Input
                                id="billingFirstName"
                                value={billingInfo.firstName}
                                onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingLastName">Last Name</Label>
                              <Input
                                id="billingLastName"
                                value={billingInfo.lastName}
                                onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}/>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billingAddress">Street Address</Label>
                            <Input
                              id="billingAddress"
                              value={billingInfo.address}
                              onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}/>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="billingCity">City</Label>
                              <Input
                                id="billingCity"
                                value={billingInfo.city}
                                onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingState">State</Label>
                              <Input
                                id="billingState"
                                value={billingInfo.state}
                                onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingZipCode">ZIP Code</Label>
                              <Input
                                id="billingZipCode"
                                value={billingInfo.zipCode}
                                onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}/>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => window.history.back()}>
                        Back to Cart
                      </Button>
                      <Button type="submit">Continue to Payment</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <PaymentCheckout
                items={cartItems.map(item => ({
                  id: item.productId,
                  type: 'experience' as const,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity
                }))}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}/>
            )}

            {step === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                  <CardDescription>
                    Please review your order before placing it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity} • ${item.price.toLocaleString()} each
                            </p>
                          </div>
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Billing */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.email}</p>
                        <p>{shippingInfo.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Billing Address</h4>
                      <div className="text-sm text-muted-foreground">
                        {billingSameAsShipping ? (
                          <p>Same as shipping address</p>
                        ) : (
                          <>
                            <p>{billingInfo.firstName} {billingInfo.lastName}</p>
                            <p>{billingInfo.address}</p>
                            <p>{billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms"/>
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the <Link href="/legal/terms" className="text-accent-primary hover:underline">Terms of Service</Link> and <Link href="/legal/privacy" className="text-accent-primary hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('payment')}>
                      Back to Payment
                    </Button>
                    <Button onClick={handlePlaceOrder} size="lg">
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
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
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method Summary */}
            {step !== 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>
                      {shippingMethod === 'standard' && 'Standard Shipping (5-7 days)'}
                      {shippingMethod === 'expedited' && 'Expedited Shipping (2-3 days)'}
                      {shippingMethod === 'white-glove' && 'White Glove Service'}
                    </span>
                    <span>
                      {shippingMethod === 'standard' && '$49.99'}
                      {shippingMethod === 'expedited' && '$99.99'}
                      {shippingMethod === 'white-glove' && '$249.99'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
