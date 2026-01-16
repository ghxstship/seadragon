'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react'

interface Subscription {
  id: string
  plan_name: string
  status: string
  current_period_start: string
  current_period_end: string
  amount: number
  currency: string
  interval: string
}

interface Invoice {
  id: string
  number: string
  status: string
  amount_due: number
  currency: string
  created: string
  due_date?: string
  paid_at?: string
}

interface PaymentMethod {
  id: string
  type: string
  last4: string
  brand: string
  expiry_month: number
  expiry_year: number
  is_default: boolean
}

export default function BillingPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBillingData = async () => {
      if (!session?.user?.organizationId) return

      // Load subscription (mock data for now)
      setSubscription({
        id: 'sub_123',
        plan_name: 'Professional Plan',
        status: 'active',
        current_period_start: '2024-01-01',
        current_period_end: '2024-12-31',
        amount: 99.00,
        currency: 'USD',
        interval: 'yearly'
      })

      // Load invoices (mock data)
      setInvoices([
        {
          id: 'inv_001',
          number: 'INV-2024-001',
          status: 'paid',
          amount_due: 99.00,
          currency: 'USD',
          created: '2024-01-01',
          paid_at: '2024-01-02'
        },
        {
          id: 'inv_002',
          number: 'INV-2024-002',
          status: 'pending',
          amount_due: 99.00,
          currency: 'USD',
          created: '2024-02-01',
          due_date: '2024-02-15'
        }
      ])

      // Load payment methods (mock data)
      setPaymentMethods([
        {
          id: 'pm_123',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiry_month: 12,
          expiry_year: 2025,
          is_default: true
        }
      ])

      setLoading(false)
    }

    loadBillingData()
  }, [session])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage your subscription, billing history, and payment methods
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Payment Methods
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                    <p className="text-2xl font-bold">{subscription?.plan_name || 'Free'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                    <p className="text-2xl font-bold">
                      {subscription ? formatCurrency(subscription.amount / 12, subscription.currency) : '$0.00'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Next Billing</p>
                    <p className="text-2xl font-bold">
                      {subscription ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
                <Button variant="outline" className="justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
                <Button variant="outline" className="justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{subscription.plan_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(subscription.amount, subscription.currency)} / {subscription.interval}
                      </p>
                    </div>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Current Period</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Next Billing Date</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">Cancel Subscription</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
                  <p className="text-muted-foreground mb-4">Upgrade to access premium features</p>
                  <Button>View Plans</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(invoice.status)}
                      <div>
                        <h4 className="font-medium">{invoice.number}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(invoice.created).toLocaleDateString()}
                          {invoice.due_date && ` • Due ${new Date(invoice.due_date).toLocaleDateString()}`}
                          {invoice.paid_at && ` • Paid ${new Date(invoice.paid_at).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        {formatCurrency(invoice.amount_due, invoice.currency)}
                      </span>
                      <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {invoices.length === 0 && (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
                  <p className="text-muted-foreground">Your billing history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-8 w-8" />
                      <div>
                        <h4 className="font-medium capitalize">
                          {method.brand} •••• {method.last4}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiry_month}/{method.expiry_year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.is_default && <Badge variant="default">Default</Badge>}
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>

              {paymentMethods.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                  <p className="text-muted-foreground mb-4">Add a payment method to enable billing</p>
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
