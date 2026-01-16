
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Users, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ExperienceCardProps {
  id: string
  title: string
  description: string
  image: string
  price: number
  currency?: string
  rating?: number
  reviewCount?: number
  location?: string
  duration?: string
  maxParticipants?: number
  category?: string
  featured?: boolean
  href?: string
}

export function ExperienceCard({
  id,
  title,
  description,
  image,
  price,
  currency = "USD",
  rating,
  reviewCount,
  location,
  duration,
  maxParticipants,
  category,
  featured = false,
  href
}: ExperienceCardProps) {
  const linkHref = href || `/experiences/${id}`

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${featured ? 'border-accent-primary' : ''}`}>
      <div className="relative aspect-video">
        <Image
          src={image}
          alt={title}
          width={400}
          height={225}
          className="w-full h-full object-cover"
        />
        {featured && (
          <Badge className="absolute top-2 left-2 bg-accent-primary">
            Featured
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            {category && (
              <Badge variant="outline" className="mb-2 text-xs">
                {category}
              </Badge>
            )}
            <CardTitle className="text-lg line-clamp-1">
              <Link href={linkHref} className="hover:text-accent-primary">
                {title}
              </Link>
            </CardTitle>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {duration && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {duration}
              </div>
            )}
            {maxParticipants && (
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Up to {maxParticipants}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
                  {reviewCount && (
                    <span className="text-muted-foreground text-sm ml-1">
                      ({reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-accent-primary">
                ${price}
              </span>
              <span className="text-sm text-muted-foreground"> / person</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExperienceCard
