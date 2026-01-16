'use client'

import { useState, useEffect, useReducer, useCallback, useMemo, useRef, useContext, useLayoutEffect, use } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logger } from "@/lib/logger"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Star, ThumbsUp, Flag, Search, Filter, Calendar, MapPin, Users, MessageSquare, TrendingUp, Award, Camera, Heart } from "lucide-react"

interface ReviewApiResponse {
  id: string | number
  author_name?: string
  author?: {
    name?: string
    avatar?: string
    location?: string
    verified?: boolean
  }
  author_avatar?: string
  author_location?: string
  author_verified?: boolean
  rating?: number
  title?: string
  content?: string
  body?: string
  date?: string
  created_at?: string
  helpful?: number
  aspect?: string
  tags?: string[]
  images?: string[]
  response?: {
    author: string
    content: string
    date: string
  }
  experience_date?: string
  group_size?: number
}

interface Review {
  id: string
  author: {
    name: string
    avatar?: string
    location?: string
    verified: boolean
  }
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  aspect: 'overall' | 'guide' | 'activities' | 'value' | 'organization'
  tags: string[]
  images?: string[]
  response?: {
    author: string
    content: string
    date: string
  }
  experienceDate: string
  groupSize: number
}

interface RatingBreakdown {
  overall: number
  guide: number
  activities: number
  value: number
  organization: number
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchExperienceReviews = async (slug: string): Promise<Review[]> => {
  try {
    const res = await fetch(`/api/v1/experiences/${slug}/reviews`)
    if (res.ok) {
      const data = await res.json()
      const reviewsData = Array.isArray(data.reviews) ? data.reviews : []
      return reviewsData.map((r: ReviewApiResponse) => ({
        id: String(r.id),
        author: {
          name: String(r.author_name || r.author?.name || 'Anonymous'),
          avatar: r.author_avatar || r.author?.avatar,
          location: r.author_location || r.author?.location,
          verified: Boolean(r.author_verified || r.author?.verified)
        },
        rating: Number(r.rating) || 5,
        title: String(r.title || 'Review'),
        content: String(r.content || r.body || ''),
        date: r.date || r.created_at || new Date().toISOString(),
        helpful: Number(r.helpful) || 0,
        aspect: (r.aspect as 'overall' | 'guide' | 'activities' | 'value' | 'organization') || 'overall',
        tags: Array.isArray(r.tags) ? r.tags : [],
        images: r.images,
        response: r.response,
        experienceDate: r.experience_date || r.date,
        groupSize: Number(r.group_size) || 1
      }))
    }
    return []
  } catch (error) {
    logger.error('Error fetching reviews:', error)
    return []
  }
}

export default function Reviews({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const experienceName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const experienceSlug = slug
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown>({
    overall: 4.6,
    guide: 4.7,
    activities: 4.5,
    value: 4.3,
    organization: 4.8
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAspect, setSelectedAspect] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    aspect: 'overall',
    title: '',
    content: '',
    experienceDate: '',
    groupSize: 1,
    tags: [] as string[]
  })

  const aspects = [
    { value: "all", label: "All Reviews" },
    { value: "overall", label: "Overall Experience" },
    { value: "guide", label: "Guide Quality" },
    { value: "activities", label: "Activities" },
    { value: "value", label: "Value for Money" },
    { value: "organization", label: "Organization" }
  ]

  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" }
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest", label: "Highest Rated" },
    { value: "lowest", label: "Lowest Rated" },
    { value: "helpful", label: "Most Helpful" }
  ]

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchExperienceReviews(experienceSlug)
      setReviews(data)
      setFilteredReviews(data)
    }

    loadReviews()
  }, [experienceSlug])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = reviews

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Aspect filter
    if (selectedAspect !== "all") {
      filtered = filtered.filter(review => review.aspect === selectedAspect)
    }

    // Rating filter
    if (selectedRating !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(selectedRating))
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          return b.helpful - a.helpful
        default:
          return 0
      }
    })

    setFilteredReviews(filtered)
  }, [reviews, searchQuery, selectedAspect, selectedRating, sortBy])

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit review to API
    fetch(`/api/experiences/${slug}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newReview)
    })
  .then(response => response.json())
  .then(data => {
    alert('Thank you for your review! It will be published after moderation.')
    setNewReview({
      rating: 5,
      aspect: 'overall',
      title: '',
      content: '',
      experienceDate: '',
      groupSize: 1,
      tags: []
    })
    setShowReviewForm(false)
  })
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0] // 1-5 stars
    reviews.forEach(review => {
      distribution[review.rating - 1]++
    })
    return distribution.map(count => (count / reviews.length) * 100)
  }

  const ratingDistribution = getRatingDistribution()

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
            <Link href="/experiences" className="hover:text-foreground">Experiences</Link>
            <span>/</span>
            <Link href={`/experiences/${slug}`} className="hover:text-foreground">{experienceName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Reviews</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Rating Overview */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {experienceName} Reviews
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Read honest reviews from real travelers and share your experience
              </p>

              <div className="flex items-center space-x-6 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-accent-primary mb-1">
                    {ratingBreakdown.overall.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(ratingBreakdown.overall) ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {reviews.length} reviews
                  </div>
                </div>

                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2 mb-1">
                      <span className="text-sm w-3">{rating}</span>
                      <Star className="h-3 w-3 fill-accent-primary text-accent-primary"/>
                      <Progress value={ratingDistribution[rating - 1]} className="flex-1 h-2"/>
                      <span className="text-sm text-muted-foreground w-8">
                        {Math.round(ratingDistribution[rating - 1])}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button size="lg" className="mb-8">
                    <MessageSquare className="h-5 w-5 mr-2"/>
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Share Your Experience</DialogTitle>
                    <DialogDescription>
                      Help other travelers by sharing your experience with {experienceName}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-base font-semibold mb-2 block">Rating</Label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                              key={star}
                              type="button"
                              onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${star <= newReview.rating ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="aspect">Review Aspect</Label>
                        <Select value={newReview.aspect} onValueChange={(value) => setNewReview(prev => ({ ...prev, aspect: value as any }))}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {aspects.slice(1).map(aspect => (
                              <SelectItem key={aspect.value} value={aspect.value}>
                                {aspect.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="experienceDate">Experience Date</Label>
                        <Input
                          id="experienceDate"
                          type="date"
                          value={newReview.experienceDate}
                          onChange={(e) => setNewReview(prev => ({ ...prev, experienceDate: e.target.value }))}
                          required/>
                      </div>
                      <div>
                        <Label htmlFor="groupSize">Group Size</Label>
                        <Select value={newReview.groupSize.toString()} onValueChange={(value) => setNewReview(prev => ({ ...prev, groupSize: parseInt(value) }))}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'person' : 'people'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title">Review Title</Label>
                      <Input
                        id="title"
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Summarize your experience"
                        required/>
                    </div>

                    <div>
                      <Label htmlFor="content">Your Review</Label>
                      <Textarea
                        id="content"
                        value={newReview.content}
                        onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Share details of your experience..."
                        rows={6}
                        required/>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Submit Review
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category Ratings */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aspect Ratings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(ratingBreakdown).map(([aspect, rating]) => (
                    <div key={aspect} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{aspect.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                          ))}
                        </div>
                        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="px-4 py-6 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"/>
            </div>
            <Select value={selectedAspect} onValueChange={setSelectedAspect}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Aspect"/>
              </SelectTrigger>
              <SelectContent>
                {aspects.map(aspect => (
                  <SelectItem key={aspect.value} value={aspect.value}>
                    {aspect.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Rating"/>
              </SelectTrigger>
              <SelectContent>
                {ratings.map(rating => (
                  <SelectItem key={rating.value} value={rating.value}>
                    {rating.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by"/>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold mb-2">
              Guest Reviews ({filteredReviews.length})
            </h2>
          </div>

          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={review.author.avatar}/>
                        <AvatarFallback>
                          {review.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Review Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{review.author.name}</h3>
                            {review.author.verified && (
                              <Badge variant="secondary" className="text-xs bg-accent-primary/10 text-accent-primary">
                                <Award className="h-3 w-3 mr-1"/>
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                              ))}
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {review.aspect.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>

                        {review.author.location && (
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3 mr-1"/>
                            {review.author.location}
                          </div>
                        )}

                        <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{review.content}</p>

                        {/* Experience Details */}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1"/>
                            Experience: {formatDate(review.experienceDate)}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1"/>
                            Group: {review.groupSize} {review.groupSize === 1 ? 'person' : 'people'}
                          </div>
                        </div>

                        {/* Tags */}
                        {review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {review.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mb-4 overflow-x-auto">
                            {review.images.map((image, index) => (
                              <div key={index} className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                                <img
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-full object-cover"/>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Response */}
                        {review.response && (
                          <div className="bg-muted/50 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-accent-primary text-primary-foreground">
                                  EC
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-semibold text-sm">{review.response.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(review.response.date)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.response.content}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{formatDate(review.date)}</span>
                            <Button className="flex items-center space-x-1 hover:text-foreground">
                              <ThumbsUp className="h-4 w-4"/>
                              <span>Helpful ({review.helpful})</span>
                            </Button>
                          </div>
                          <Button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-destructive">
                            <Flag className="h-4 w-4"/>
                            <span>Report</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
