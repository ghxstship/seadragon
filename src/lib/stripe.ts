
import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient

  const secretKey = process.env['STRIPE_SECRET_KEY']
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required')
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  })

  return stripeClient
}
