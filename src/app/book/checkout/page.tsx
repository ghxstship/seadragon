
'use client'


import { useEffect, useMemo, useState } from "react"
import { storage } from '@/lib/storage'
import { logger } from '@/lib/logger'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { PaymentCheckout } from "@/components/payments/payment-checkout"
import { ArrowLeft, CreditCard, Shield, Truck } from "lucide-react"
import { calculateCartTotals, type CartItem, type DeliveryMethod } from "@/lib/cart/pricing"

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface BillingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function Checkout() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('digital')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = storage.local.get<CartItem[]>('atlvs-cart')
        if (savedCart && Array.isArray(savedCart)) {
          if (savedCart.length === 0) {
            router.push('/book/cart')
            return
          }
          setCartItems(savedCart)
        } else {
          router.push('/book/cart')
          return
        }
      } catch (error) {
        logger.error('Failed to load cart', error)
        router.push('/book/cart')
        return
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [router])

  const { subtotal, tax, shipping, total } = useMemo(
    () => calculateCartTotals(cartItems, deliveryMethod),
    [cartItems, deliveryMethod]
  )

  const handlePaymentSuccess = () => {
    // Clear cart
    storage.local.remove('atlvs-cart')
    // Redirect to confirmation
    router.push('/book/confirmation')
  }

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`)
  }

  const validateForm = () => {
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
      alert('Please fill in all required customer information')
      return false
    }
    if (!billingAddress.street || !billingAddress.city || !billingAddress.state || !billingAddress.zipCode) {
      alert('Please fill in all billing address information')
      return false
    }
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions')
      return false
    }
    return true
  }

  const proceedToPayment = () => {
    if (validateForm()) {
      setShowPayment(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => setShowPayment(false)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Checkout
          </Button>

          <PaymentCheckout
            items={cartItems.map(item => ({
              id: item.id,
              // constrain to PaymentCheckout accepted types
              type: item.type === 'ticket' ? 'ticket' : 'experience',
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }))}
            customerInfo={customerInfo}
            billingAddress={billingAddress}
            deliveryMethod={deliveryMethod}
            specialInstructions={specialInstructions}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}/>
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
            <Link href="/book/cart" className="hover:text-foreground">Cart</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Checkout</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Complete your order for {cartItems.length} item{cartItems.length > 1 ? 's' : ''}.
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>We&apos;ll use this to send your order confirmation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        required/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        required/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}/>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                  <CardDescription>Where should we send your receipt?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={billingAddress.street}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, street: e.target.value }))}
                      required/>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                        required/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                        required/>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                      <Input
                        id="zipCode"
                        value={billingAddress.zipCode}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        required/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select value={billingAddress.country} onValueChange={(value) => setBillingAddress(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger>
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Method</CardTitle>
                  <CardDescription>How would you like to receive your items?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={deliveryMethod}
                    onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">
                        <div className="flex items-center">
                          <span className="mr-2"></span>
                          Digital Delivery (Free)
                        </div>
                      </SelectItem>
                      <SelectItem value="physical">
                        <div className="flex items-center">
                          <span className="mr-2"></span>
                          Physical Shipping ($9.99)
                        </div>
                      </SelectItem>
                      <SelectItem value="pickup">
                        <div className="flex items-center">
                          <span className="mr-2"></span>
                          Will Call Pickup (Free)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                  <CardDescription>Any special requests or notes for your order</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Dietary restrictions, accessibility needs, special occasions..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}/>
                </CardContent>
              </Card>

              {/* Terms and Marketing */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}/>
                    <div className="text-sm">
                      <Label htmlFor="terms" className="text-sm font-medium">
                        I agree to the Terms of Service and Privacy Policy *
                      </Label>
                      <p className="text-muted-foreground mt-1">
                        By completing this purchase, you agree to our terms and conditions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={marketingConsent}
                      onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}/>
                    <div className="text-sm">
                      <Label htmlFor="marketing" className="text-sm">
                        I would like to receive marketing communications
                      </Label>
                      <p className="text-muted-foreground mt-1">
                        Stay updated with exclusive offers, new experiences, and platform updates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator/>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {shipping > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator/>

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)} USD</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={proceedToPayment}
                    disabled={!agreeToTerms}
                  >
                    <CreditCard className="h-4 w-4 mr-2"/>
                    Complete Payment
                  </Button>

                  <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1"/>
                      Secure
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-3 w-3 mr-1"/>
                      Fast Delivery
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/book/cart">
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Back to Cart
                  </Link>
                </Button>
              </div>
            </div>
          </div>
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
