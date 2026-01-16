
'use client'


import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { CheckCircle, Download, Calendar, Share2, Mail, Smartphone, MapPin, Clock } from "lucide-react"
import Image from "next/image"

interface OrderItem {
  id: string
  type: 'experience' | 'ticket' | 'package' | 'merchandise'
  name: string
  description: string
  price: number
  currency: string
  quantity: number
  image?: string
  metadata?: {
    date?: string
    venue?: string
    category?: string
  }
}

interface OrderDetails {
  orderNumber: string
  orderDate: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  deliveryMethod: string
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered'
}

export default function Confirmation() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadOrderDetails = async () => {
      try {
        // Get order ID from URL params if available
        const urlParams = new URLSearchParams(window.location.search)
        const orderId = urlParams.get('orderId')

        if (orderId) {
          // Fetch real order from payments API
          const res = await fetch(`/api/v1/payments/${orderId}`)
          if (res.ok) {
            const data = await res.json()
            const payment = data.payment
            if (payment && !cancelled) {
              const order: OrderDetails = {
                orderNumber: String(payment.confirmation_code || payment.id),
                orderDate: new Date(payment.created_at || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                customerName: String(payment.customer_name || 'Customer'),
                customerEmail: String(payment.customer_email || ''),
                items: [{
                  id: String(payment.id),
                  type: 'ticket',
                  name: String(payment.description || 'Order Item'),
                  description: String(payment.notes || ''),
                  price: Number(payment.amount) || 0,
                  currency: String(payment.currency || 'USD'),
                  quantity: 1,
                  metadata: {
                    date: payment.event_date,
                    venue: payment.venue,
                    category: payment.ticket_type
                  }
                }],
                subtotal: Number(payment.amount) || 0,
                tax: Number(payment.tax) || 0,
                shipping: 0,
                total: Number(payment.total) || Number(payment.amount) || 0,
                deliveryMethod: 'digital',
                status: payment.status === 'completed' ? 'confirmed' : 'processing'
              }
              setOrderDetails(order)
              setLoading(false)
              return
            }
          }
        }

        // Fallback: show empty confirmation
        if (!cancelled) {
          setOrderDetails(null)
          setLoading(false)
        }
      } catch (error) {
        logger.error('Error loading order details:', error)
        if (!cancelled) {
          setOrderDetails(null)
          setLoading(false)
        }
      }
    }

    loadOrderDetails()

    return () => {
      cancelled = true
    }
  }, [])

  const handleDownloadTickets = () => {
    // In real app, this would download PDF tickets
    alert('Downloading tickets... (This would open a PDF download in a real implementation)')
  }

  const handleAddToCalendar = () => {
    // In real app, this would generate calendar invites
    alert('Adding to calendar... (This would open calendar app in a real implementation)')
  }

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Order Confirmation',
        text: `Check out my order ${orderDetails?.orderNumber} from ATLVS + GVTEWAY!`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Order link copied to clipboard!')
    }
  }

  if (loading) {
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

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn&apos;t find the order you&apos;re looking for.</p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Success Banner */}
      <div className="bg-success/10 border-b border-success/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="h-8 w-8 text-success"/>
            <div>
              <h1 className="text-2xl font-display font-bold text-success">Order Confirmed!</h1>
              <p className="text-muted-foreground">Your booking has been successfully processed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Order Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Order #{orderDetails.orderNumber}</CardTitle>
                  <CardDescription>
                    Placed on {orderDetails.orderDate}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-success bg-success/10">
                  {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p className="text-sm text-muted-foreground">{orderDetails.customerName}</p>
                  <p className="text-sm text-muted-foreground">{orderDetails.customerEmail}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Delivery Method</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {orderDetails.deliveryMethod === 'digital' ? ' Digital Delivery' :
                     orderDetails.deliveryMethod === 'physical' ? ' Physical Shipping' :
                     ' Will Call Pickup'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>Your purchased items</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0">
                      {/* Item Image */}
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"/>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center text-lg">
                            {item.type === 'experience' && ''}
                            {item.type === 'ticket' && ''}
                            {item.type === 'package' && ''}
                            {item.type === 'merchandise' && '️'}
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.description}
                        </p>

                        {item.metadata && (
                          <div className="text-xs text-muted-foreground space-y-1 mb-3">
                            {item.metadata.date && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1"/>
                                {item.metadata.date}
                              </div>
                            )}
                            {item.metadata.venue && (
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1"/>
                                {item.metadata.venue}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            Quantity: <span className="font-medium">{item.quantity}</span>
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
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${orderDetails.tax.toFixed(2)}</span>
                  </div>
                  {orderDetails.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>${orderDetails.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator/>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)} USD</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>What&apos;s Next?</CardTitle>
                  <CardDescription>Access your tickets and manage your booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleDownloadTickets} className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2"/>
                    Download Tickets
                  </Button>
                  <Button onClick={handleAddToCalendar} className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2"/>
                    Add to Calendar
                  </Button>
                  <Button onClick={handleShareOrder} className="w-full" variant="outline">
                    <Share2 className="h-4 w-4 mr-2"/>
                    Share Order
                  </Button>
                </CardContent>
              </Card>

              {/* Support & Help */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground"/>
                    <span>support@atlvs.com</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Smartphone className="h-4 w-4 mr-2 text-muted-foreground"/>
                    <span>1-800-ATLVS</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground"/>
                    <span>24/7 Support Available</span>
                  </div>
                </CardContent>
              </Card>

              {/* Back to Home */}
              <div className="text-center">
                <Button asChild size="lg">
                  <Link href="/">Continue Exploring</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Mail className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                  <h3 className="font-semibold mb-1">Email Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    Check your email for order details and digital tickets
                  </p>
                </div>
                <div>
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-accent-secondary"/>
                  <h3 className="font-semibold mb-1">Mobile Tickets</h3>
                  <p className="text-sm text-muted-foreground">
                    Access your tickets anytime through our mobile app
                  </p>
                </div>
                <div>
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-accent-tertiary"/>
                  <h3 className="font-semibold mb-1">Calendar Sync</h3>
                  <p className="text-sm text-muted-foreground">
                    Events automatically added to your calendar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
