
'use client'


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Gift, Heart, Mail, Calendar, DollarSign, CreditCard, Truck, Smartphone, Star, CheckCircle, Sparkles } from "lucide-react"

interface GiftCardOption {
  id: string
  name: string
  amount: number
  description: string
  features: string[]
  popular?: boolean
  image: string
}

interface GiftCardOrder {
  type: 'digital' | 'physical'
  recipientName: string
  recipientEmail: string
  senderName: string
  senderEmail: string
  message: string
  deliveryDate?: string
  amount: number
  quantity: number
  design: string
}

export default function GiftCards() {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [customAmount, setCustomAmount] = useState<number>(0)
  const [giftCardType, setGiftCardType] = useState<'digital' | 'physical'>('digital')
  const [order, setOrder] = useState<GiftCardOrder>({
    type: 'digital',
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    senderEmail: '',
    message: '',
    deliveryDate: '',
    amount: 0,
    quantity: 1,
    design: 'classic'
  })

  const giftCardOptions: GiftCardOption[] = [
    {
      id: "classic-50",
      name: "Classic $50",
      amount: 50,
      description: "Perfect for a small thank you or gesture",
      features: ["Digital delivery", "No expiration", "Redeemable online"],
      image: "/api/placeholder/300/200"
    },
    {
      id: "classic-100",
      name: "Classic $100",
      amount: 100,
      description: "Great for birthdays and special occasions",
      features: ["Digital delivery", "No expiration", "Redeemable online"],
      popular: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: "classic-250",
      name: "Classic $250",
      amount: 250,
      description: "Ideal for anniversaries and celebrations",
      features: ["Digital delivery", "No expiration", "Redeemable online"],
      image: "/api/placeholder/300/200"
    },
    {
      id: "premium-100",
      name: "Premium $100",
      amount: 100,
      description: "Premium design with enhanced features",
      features: ["Physical card option", "Custom message", "Scheduled delivery", "No expiration"],
      image: "/api/placeholder/300/200"
    },
    {
      id: "premium-200",
      name: "Premium $200",
      amount: 200,
      description: "Luxury gift card with premium benefits",
      features: ["Physical card option", "Custom message", "Scheduled delivery", "No expiration", "Priority support"],
      image: "/api/placeholder/300/200"
    }
  ]

  const designs = [
    { id: "classic", name: "Classic", description: "Timeless design with our signature colors", preview: "" },
    { id: "nature", name: "Nature", description: "Inspired by beautiful landscapes", preview: "" },
    { id: "urban", name: "Urban", description: "Modern city-inspired design", preview: "️" },
    { id: "celebration", name: "Celebration", description: "Perfect for special occasions", preview: "" }
  ]

  const handleOptionSelect = (optionId: string) => {
    const option = giftCardOptions.find(opt => opt.id === optionId)
    if (option) {
      setSelectedOption(optionId)
      setOrder(prev => ({
        ...prev,
        amount: option.amount
      }))
      setCustomAmount(0)
    }
  }

  const handleCustomAmountChange = (amount: number) => {
    setSelectedOption("")
    setOrder(prev => ({
      ...prev,
      amount: amount
    }))
    setCustomAmount(amount)
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to payment processing
    alert(`Gift card order submitted! Amount: $${order.amount}, Type: ${order.type}, Quantity: ${order.quantity}`)
  }

  const calculateTotal = () => {
    const baseTotal = order.amount * order.quantity
    const deliveryFee = order.type === 'physical' ? 9.99 : 0
    return baseTotal + deliveryFee
  }

  const selectedGiftCard = giftCardOptions.find(opt => opt.id === selectedOption)

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
            <span className="text-foreground font-medium">Gift Cards</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Gift Cards
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Give the gift of unforgettable experiences. Our gift cards never expire and can be used for any ATLVS + GVTEWAY adventure.
            </p>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <Gift className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-sm font-medium">Never Expires</div>
                <div className="text-xs text-muted-foreground">No time pressure to use</div>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-sm font-medium">Personal Message</div>
                <div className="text-xs text-muted-foreground">Add a custom note</div>
              </div>
              <div className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-sm font-medium">Scheduled Delivery</div>
                <div className="text-xs text-muted-foreground">Send on special dates</div>
              </div>
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-sm font-medium">Premium Designs</div>
                <div className="text-xs text-muted-foreground">Beautiful gift options</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Gift Card Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gift Card Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2"/>
                    Choose Gift Card Amount
                  </CardTitle>
                  <CardDescription>
                    Select a pre-set amount or enter a custom value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {giftCardOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedOption === option.id
                            ? 'border-accent-primary bg-accent-primary/5'
                            : 'border-border hover:border-accent-primary hover:bg-accent-primary/5'
                        }`}
                        onClick={() => handleOptionSelect(option.id)}
                      >
                        {option.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-accent-primary">
                            Popular
                          </Badge>
                        )}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent-primary mb-2">
                            ${option.amount}
                          </div>
                          <div className="text-sm font-medium mb-1">{option.name}</div>
                          <div className="text-xs text-muted-foreground mb-3">
                            {option.description}
                          </div>
                          <div className="space-y-1">
                            {option.features.slice(0, 2).map((feature, index) => (
                              <div key={index} className="text-xs text-muted-foreground flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1 text-success"/>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="border-t pt-6">
                    <Label className="text-base font-semibold mb-3 block">Or Enter Custom Amount</Label>
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                        <Input
                          type="number"
                          placeholder="Enter amount (min $10)"
                          value={customAmount || ""}
                          onChange={(e) => handleCustomAmountChange(parseInt(e.target.value) || 0)}
                          min={10}
                          max={1000}
                          className="pl-10"/>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Minimum $10, Maximum $1,000
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gift Card Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2"/>
                    Delivery Method
                  </CardTitle>
                  <CardDescription>
                    Choose how you'd like to send your gift card
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={giftCardType}
                    onValueChange={(value: 'digital' | 'physical') => {
                      setGiftCardType(value)
                      setOrder(prev => ({ ...prev, type: value }))
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="digital" id="digital"/>
                      <div className="flex-1">
                        <Label htmlFor="digital" className="font-medium cursor-pointer">Digital Gift Card</Label>
                        <p className="text-sm text-muted-foreground">Instant delivery via email</p>
                        <div className="flex items-center mt-2">
                          <CheckCircle className="h-4 w-4 mr-2 text-success"/>
                          <span className="text-xs text-muted-foreground">Free delivery</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="physical" id="physical"/>
                      <div className="flex-1">
                        <Label htmlFor="physical" className="font-medium cursor-pointer">Physical Gift Card</Label>
                        <p className="text-sm text-muted-foreground">Beautiful printed card delivered by mail</p>
                        <div className="flex items-center mt-2">
                          <Truck className="h-4 w-4 mr-2 text-accent-primary"/>
                          <span className="text-xs text-muted-foreground">+$9.99 delivery fee</span>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Design Selection */}
              {giftCardType === 'digital' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2"/>
                      Choose Design
                    </CardTitle>
                    <CardDescription>
                      Select a beautiful design for your digital gift card
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {designs.map((design) => (
                        <div
                          key={design.id}
                          className={`border rounded-lg p-4 cursor-pointer text-center transition-all ${
                            order.design === design.id
                              ? 'border-accent-primary bg-accent-primary/5'
                              : 'border-border hover:border-accent-primary'
                          }`}
                          onClick={() => setOrder(prev => ({ ...prev, design: design.id }))}
                        >
                          <div className="text-3xl mb-2">{design.preview}</div>
                          <div className="font-medium text-sm">{design.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{design.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recipient Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Gift Card Details</CardTitle>
                  <CardDescription>
                    Enter the recipient and sender information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOrderSubmit} className="space-y-6">
                    {/* Quantity */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Quantity</Label>
                      <Select
                        value={order.quantity.toString()}
                        onValueChange={(value) => setOrder(prev => ({ ...prev, quantity: parseInt(value) }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 10, 25, 50].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} gift card{num !== 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Recipient Information */}
                    <div>
                      <h4 className="font-semibold mb-4">Recipient Information</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="recipientName">Recipient Name</Label>
                          <Input
                            id="recipientName"
                            value={order.recipientName}
                            onChange={(e) => setOrder(prev => ({ ...prev, recipientName: e.target.value }))}
                            required/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recipientEmail">Recipient Email</Label>
                          <Input
                            id="recipientEmail"
                            type="email"
                            value={order.recipientEmail}
                            onChange={(e) => setOrder(prev => ({ ...prev, recipientEmail: e.target.value }))}
                            required/>
                        </div>
                      </div>
                    </div>

                    {/* Sender Information */}
                    <div>
                      <h4 className="font-semibold mb-4">Your Information</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="senderName">Your Name</Label>
                          <Input
                            id="senderName"
                            value={order.senderName}
                            onChange={(e) => setOrder(prev => ({ ...prev, senderName: e.target.value }))}
                            required/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="senderEmail">Your Email</Label>
                          <Input
                            id="senderEmail"
                            type="email"
                            value={order.senderEmail}
                            onChange={(e) => setOrder(prev => ({ ...prev, senderEmail: e.target.value }))}
                            required/>
                        </div>
                      </div>
                    </div>

                    {/* Personal Message */}
                    <div>
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={order.message}
                        onChange={(e) => setOrder(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Add a personal message to make this gift extra special..."
                        rows={3}
                        maxLength={500}/>
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.message.length}/500 characters
                      </div>
                    </div>

                    {/* Delivery Date (for digital) */}
                    {giftCardType === 'digital' && (
                      <div>
                        <Label htmlFor="deliveryDate">Delivery Date (Optional)</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={order.deliveryDate}
                          onChange={(e) => setOrder(prev => ({ ...prev, deliveryDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}/>
                        <p className="text-xs text-muted-foreground mt-1">
                          Leave blank for immediate delivery
                        </p>
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2"/>
                      Purchase Gift Card{order.quantity > 1 ? 's' : ''}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Gift Card */}
                  {(selectedOption || customAmount > 0) && (
                    <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                        <Gift className="h-6 w-6 text-accent-primary"/>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {selectedGiftCard ? selectedGiftCard.name : `Custom $${customAmount}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {giftCardType === 'digital' ? 'Digital delivery' : 'Physical card'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gift Card Value:</span>
                      <span>${order.amount.toFixed(2)} × {order.quantity}</span>
                    </div>
                    {giftCardType === 'physical' && (
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>$9.99</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${(calculateTotal() + calculateTotal() * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Features */}
                  {selectedGiftCard && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Included Features:</h4>
                      <ul className="text-xs space-y-1">
                        {selectedGiftCard.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <CheckCircle className="h-3 w-3 mr-2 text-success"/>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gift Card Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gift Card Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0"/>
                    <div className="text-sm">
                      <div className="font-medium">Never Expires</div>
                      <div className="text-muted-foreground">Use anytime, no rush</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Smartphone className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0"/>
                    <div className="text-sm">
                      <div className="font-medium">Easy Redemption</div>
                      <div className="text-muted-foreground">Use online or in-app</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0"/>
                    <div className="text-sm">
                      <div className="font-medium">Perfect Gift</div>
                      <div className="text-muted-foreground">For any occasion</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
