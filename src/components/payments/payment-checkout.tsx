
'use client'

import { useCallback, useEffect, useState } from 'react'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Initialize Stripe
const stripePromise = loadStripe(process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']!)

interface PaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
}

function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement/>
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Processing...' : 'Complete Payment'}
      </Button>
    </form>
  )
}

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

interface BillingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentCheckoutProps {
  items: Array<{
    id: string
    type: 'ticket' | 'experience'
    name: string
    price: number
    quantity?: number
  }>
  customerInfo?: CustomerInfo
  billingAddress?: BillingAddress
  deliveryMethod?: 'digital' | 'physical' | 'pickup'
  specialInstructions?: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function PaymentCheckout({
  items,
  customerInfo,
  billingAddress,
  deliveryMethod,
  specialInstructions,
  onSuccess,
  onError,
}: PaymentCheckoutProps) {
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const createPaymentIntent = useCallback(async () => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo,
          billingAddress,
          deliveryMethod,
          specialInstructions,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment setup failed'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [billingAddress, customerInfo, deliveryMethod, items, onError, specialInstructions])

  useEffect(() => {
    createPaymentIntent()
  }, [createPaymentIntent])

  const handlePaymentSuccess = () => {
    onSuccess()
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    onError(errorMessage)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p>Loading payment form...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-error">
            <p className="mb-4">Payment setup failed: {error}</p>
            <Button onClick={createPaymentIntent} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Purchase</CardTitle>
        <CardDescription>
          Secure payment powered by Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name} {item.quantity && item.quantity > 1 ? `x${item.quantity}` : ''}</span>
                <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>${items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Stripe Elements */}
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}/>
        </Elements>
      </CardContent>
    </Card>
  )
}
