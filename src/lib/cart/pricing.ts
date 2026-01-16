import { CURRENCY, SHIPPING, TAX_RATES } from '../constants/pricing'

export type DeliveryMethod = 'digital' | 'physical' | 'pickup'

export interface CartItem {
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

export const mapApiCartItems = (items: unknown): CartItem[] => {
  if (!Array.isArray(items)) return []

  const normalized: CartItem[] = []

  items.forEach((item) => {
    if (typeof item !== 'object' || item === null) return
    const candidate = item as Record<string, unknown>

    const price = Number(candidate['price'] ?? 0)
    const quantity = Number(candidate['quantity'] ?? 1)
    const id = candidate['id']

    if (!id) return

    const image = typeof candidate['image'] === 'string' ? candidate['image'] : undefined
    const metadata = candidate['metadata'] as CartItem['metadata']

    normalized.push({
      id: String(id),
      type: (candidate['type'] as CartItem['type']) ?? 'ticket',
      name: String(candidate['name'] ?? ''),
      description: String(candidate['description'] ?? ''),
      price: Number.isFinite(price) ? price : 0,
      currency: String(candidate['currency'] ?? CURRENCY.DEFAULT),
      quantity: Number.isFinite(quantity) ? quantity : 1,
      ...(image ? { image } : {}),
      ...(metadata ? { metadata } : {}),
    })
  })

  return normalized
}

export const calculateCartTotals = (
  items: CartItem[],
  deliveryMethod: DeliveryMethod = 'digital'
) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * TAX_RATES.DEFAULT
  const shipping = deliveryMethod === 'physical' ? SHIPPING.PHYSICAL_FLAT : SHIPPING.DIGITAL
  const total = subtotal + tax + shipping

  return { subtotal, tax, shipping, total }
}
