
'use client'


import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ReactElement } from 'react'
import { CheckCircle, Truck, Package, CreditCard, Mail, Phone, Download, Share, Star, Calendar, MapPin, Clock, Shield, Award, Gift } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

interface OrderItemApiResponse {
  id: string | number
  name?: string
  price?: number
  quantity?: number
  image?: string
  category?: string
}

interface Order {
  id: string
  date: string
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered'
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: {
    type: string
    last4: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  completed: boolean
  icon: React.ComponentType<{ className?: string }>
}

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadOrder = async () => {
      try {
        // Get order ID from URL params if available
        const urlParams = new URLSearchParams(window.location.search)
        const orderId = urlParams.get('orderId')

        if (orderId) {
          const res = await fetch(`/api/v1/orders/${orderId}`)
          if (res.ok) {
            const data = await res.json()
            const ord = data.order || data
            if (!cancelled && ord) {
              setOrder({
                id: String(ord.id),
                date: ord.date || ord.created_at || new Date().toISOString(),
                status: ord.status || 'confirmed',
                items: Array.isArray(ord.items) ? ord.items.map((item: OrderItemApiResponse) => ({
                  id: String(item.id),
                  name: String(item.name || ''),
                  price: Number(item.price || 0),
                  quantity: Number(item.quantity || 1),
                  image: item.image || '/placeholder-product.jpg',
                  category: String(item.category || '')
                })) : [],
                subtotal: Number(ord.subtotal || 0),
                tax: Number(ord.tax || 0),
                shipping: Number(ord.shipping || 0),
                total: Number(ord.total || 0),
                shippingAddress: ord.shipping_address || ord.shippingAddress || {},
                billingAddress: ord.billing_address || ord.billingAddress || {},
                paymentMethod: ord.payment_method || ord.paymentMethod || {},
                trackingNumber: ord.tracking_number,
                estimatedDelivery: ord.estimated_delivery
              })
            }
          }
        }
      } catch (error) {
        logger.error('Error loading order:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOrder()

    return () => { cancelled = true }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-accent-primary/10 text-blue-800'
      case 'processing': return 'bg-semantic-warning/10 text-yellow-800'
      case 'shipped': return 'bg-accent-primary/10 text-purple-800'
      case 'delivered': return 'bg-semantic-success/10 text-green-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'confirmed': return 25
      case 'processing': return 50
      case 'shipped': return 75
      case 'delivered': return 100
      default: return 0
    }
  }

  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      title: "Order Confirmed",
      description: "Your order has been received and confirmed",
      date: order?.date || "",
      completed: true,
      icon: CheckCircle
    },
    {
      id: "2",
      title: "Payment Processed",
      description: "Payment has been successfully processed",
      date: order?.date || "",
      completed: true,
      icon: CreditCard
    },
    {
      id: "3",
      title: "Order Processing",
      description: "Your order is being prepared for shipment",
      date: order?.date || "",
      completed: order?.status !== 'confirmed',
      icon: Package
    },
    {
      id: "4",
      title: "Shipped",
      description: "Your order has been shipped",
      date: "",
      completed: ['shipped', 'delivered'].includes(order?.status || ''),
      icon: Truck
    },
    {
      id: "5",
      title: "Delivered",
      description: "Your order has been delivered",
      date: order?.estimatedDelivery || "",
      completed: order?.status === 'delivered',
      icon: CheckCircle
    }
  ]

  const formatDate = (dateString: string) => {
    if (!dateString) return "Pending"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownloadInvoice = () => {
    // In real app, this would trigger PDF download
    alert('Invoice download would start here')
  }

  const handleShareOrder = () => {
    // In real app, this would open share dialog
    alert('Share dialog would open here')
  }

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
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
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Order Confirmation</span>
          </div>
        </div>
      </nav>

      {/* Success Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-primary-foreground"/>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Thank you for your purchase. Your order #{order.id} has been successfully placed.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2"/>
              Ordered on {formatDate(order.date)}
            </div>
            <div className="flex items-center">
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2"/>
                    Order Status
                  </CardTitle>
                  <CardDescription>
                    Track your order progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{getStatusProgress(order.status)}% Complete</span>
                    </div>
                    <Progress value={getStatusProgress(order.status)} className="h-2"/>
                  </div>

                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                      <div key={event.id} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed ? 'bg-accent-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          <event.icon className="h-5 w-5"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {event.title}
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${event.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} in this order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"/>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="text-sm font-medium">${item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6"/>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping & Billing */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2"/>
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2"/>
                      Billing & Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div>
                        <p className="font-medium">{order.billingAddress.name}</p>
                        <p>{order.billingAddress.address}</p>
                        <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                      </div>
                      <Separator/>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4"/>
                        <span>{order.paymentMethod.type} ending in {order.paymentMethod.last4}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Shipping Information */}
              {order.trackingNumber && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2"/>
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Tracking Number</p>
                        <p className="font-mono">{order.trackingNumber}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Estimated Delivery</p>
                        <p>{order.estimatedDelivery}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleDownloadInvoice}>
                    <Download className="h-4 w-4 mr-2"/>
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleShareOrder}>
                    <Share className="h-4 w-4 mr-2"/>
                    Share Order
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/shop">
                      Continue Shopping
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2"/>
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-4 w-4 text-accent-primary"/>
                    <div>
                      <p className="font-medium">Support Hotline</p>
                      <p className="text-muted-foreground">1-800-SUPPORT (24/7)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-accent-primary"/>
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-muted-foreground">support@atlvs.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* What's Next */}
              <Card>
                <CardHeader>
                  <CardTitle>What&apos;s Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-accent-primary"/>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Preparation</p>
                      <p className="text-muted-foreground">We&apos;ll prepare your equipment for shipping</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-accent-primary"/>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Shipping</p>
                      <p className="text-muted-foreground">Professional delivery with white glove service</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-accent-primary"/>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Setup Support</p>
                      <p className="text-muted-foreground">Free setup assistance and training</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Reminder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2"/>
                    Love Your Purchase?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Help other customers by leaving a review for your order.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Star className="h-4 w-4 mr-2"/>
                    Write Reviews
                  </Button>
                </CardContent>
              </Card>

              {/* Gift Card Promotion */}
              <Card className="bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border-accent-primary/20">
                <CardContent className="p-6 text-center">
                  <Gift className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                  <h3 className="font-semibold mb-2">Give the Gift of Excellence</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share the experience with someone special
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/shop/gift-cards">
                      Buy Gift Cards
                    </Link>
                  </Button>
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
