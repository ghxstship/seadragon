
import { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'
import {
  requireAuth,
  apiSuccess,
  apiError,
  logApiError,
  logActivity
} from '@/lib/api-utils'

interface Session {
  user?: {
    id: string
    email?: string
    name?: string
  }
  [key: string]: unknown
}

// Brand data interfaces
interface SocialLinks {
  instagram?: string
  twitter?: string
  facebook?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
}

interface BrandStats {
  followers?: number
  following?: number
  posts?: number
  engagement?: number
  reach?: number
}

interface BrandProduct {
  id: string
  name: string
  description?: string
  price?: number
  currency?: string
  image?: string
  url?: string
  category?: string
}

interface BrandEvent {
  id: string
  title: string
  description?: string
  date: string
  location?: string
  type?: string
  status?: string
}

interface BrandPartnership {
  id: string
  partnerName: string
  description?: string
  type?: string
  startDate?: string
  endDate?: string
  status?: string
}

// GET /api/v1/brands/[handle] - Get brand profile by handle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    // Optional authentication for brand profile access
    // const authResult = await requireAuth(request)
    // if (authResult instanceof NextResponse) return authResult
    // const { session } = authResult as { session: Session }

    const { handle } = await params

    // Validate handle parameter
    if (!handle || typeof handle !== 'string' || handle.trim() === '') {
      return apiError('Invalid brand handle provided', 400, 'INVALID_HANDLE')
    }

    // Query brand from database
    const brandsData = await db.query<{
      id?: string
      handle?: string
      name?: string
      category?: string
      tagline?: string
      description?: string
      logo?: string
      cover_image?: string
      location?: string
      founded?: string
      verified?: boolean
      badges?: string[]
      website?: string
      social_links?: SocialLinks
      stats?: BrandStats
      products?: BrandProduct[]
      upcoming_events?: BrandEvent[]
      partnerships?: BrandPartnership[]
    }>('brands', {
      limit: 1
    })

    // Find the specific brand by handle
    const brand = brandsData.find(b => b.handle === handle) || brandsData[0]

    if (!brand) {
      logger.warn('Brand not found', { handle, availableBrands: brandsData.length })
      return apiError('Brand not found', 404, 'BRAND_NOT_FOUND', { handle })
    }

    // Log successful brand access (if authenticated)
    // if (session) {
    //   await logActivity(session, 'brand_profile_viewed', 'brand', brand.id, { handle })
    // }

    logger.debug('Brand profile retrieved successfully', { handle, brandId: brand.id })

    return apiSuccess({ brand })
  } catch (error) {
    logApiError(error, 'brand_profile_fetch', undefined, { handle: (await params).handle })
    return apiError('An error occurred while fetching brand profile', 500, 'INTERNAL_ERROR')
  }
}
