'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { type LucideIcon, CheckCircle, Star, MapPin, Calendar, Users, Heart, Award, Rocket, ArrowRight, Sparkles, Gift, TrendingUp, Clock } from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  icon: LucideIcon
  action?: {
    label: string
    href: string
  }
}

interface PersonalizedRecommendation {
  id: string
  type: 'destination' | 'experience' | 'event'
  title: string
  description: string
  image: string
  rating?: number
  location?: string
  date?: string
  price?: string
}

interface RecommendationApiResponse {
  id: string | number
  type?: string
  title?: string
  name?: string
  description?: string
  image?: string
  image_url?: string
  rating?: number
  location?: string
  date?: string
  price?: string
}

export default function OnboardingCompletePage() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([])

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)

    let cancelled = false

    const loadOnboardingData = async () => {
      try {
        // Load completed steps from API
        const stepsRes = await fetch('/api/v1/onboarding/status')
        if (stepsRes.ok) {
          const stepsData = await stepsRes.json()
          if (!cancelled && stepsData.completedSteps) {
            setCompletedSteps(new Set(stepsData.completedSteps))
          }
        }

        // Load personalized recommendations from API
        const recsRes = await fetch('/api/v1/recommendations')
        if (recsRes.ok) {
          const recsData = await recsRes.json()
          const recs = Array.isArray(recsData.recommendations) ? recsData.recommendations : []
          if (!cancelled) {
            setRecommendations(recs.map((r: RecommendationApiResponse) => ({
              id: String(r.id),
              type: r.type || 'destination',
              title: String(r.title || r.name || ''),
              description: String(r.description || ''),
              image: r.image || r.image_url || '/placeholder.jpg',
              rating: Number(r.rating) || undefined,
              location: r.location,
              date: r.date,
              price: r.price
            })))
          }
        }
      } catch (error) {
        logger.error('Error loading onboarding data:', error)
      }
    }

    loadOnboardingData()

    return () => { cancelled = true }
  }, [])

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add personal details and preferences for better recommendations',
      completed: completedSteps.has('profile'),
      icon: Users,
      action: {
        label: 'Update Profile',
        href: '/home/profile'
      }
    },
    {
      id: 'preferences',
      title: 'Set Travel Preferences',
      description: 'Tell us about your interests and travel style',
      completed: completedSteps.has('preferences'),
      icon: Heart,
      action: {
        label: 'Set Preferences',
        href: '/home/profile?tab=preferences'
      }
    },
    {
      id: 'verification',
      title: 'Verify Your Account',
      description: 'Secure your account with email and phone verification',
      completed: completedSteps.has('verification'),
      icon: CheckCircle
    },
    {
      id: 'first-booking',
      title: 'Make Your First Booking',
      description: 'Book your first experience or trip',
      completed: completedSteps.has('first-booking'),
      icon: Calendar,
      action: {
        label: 'Browse Experiences',
        href: '/experiences'
      }
    },
    {
      id: 'join-community',
      title: 'Join the Community',
      description: 'Connect with fellow travelers and share experiences',
      completed: completedSteps.has('join-community'),
      icon: Users,
      action: {
        label: 'Explore Community',
        href: '/community'
      }
    }
  ]

  const nextSteps = [
    {
      icon: MapPin,
      title: 'Explore Destinations',
      description: 'Discover amazing places around the world',
      action: { label: 'Browse Destinations', href: '/destinations' }
    },
    {
      icon: Calendar,
      title: 'Plan Your Trip',
      description: 'Create detailed itineraries and manage bookings',
      action: { label: 'Create Itinerary', href: '/home/itineraries' }
    },
    {
      icon: Award,
      title: 'Earn Rewards',
      description: 'Join our loyalty program and earn points',
      action: { label: 'View Rewards', href: '/rewards' }
    },
    {
      icon: Users,
      title: 'Connect & Share',
      description: 'Share experiences and connect with travelers',
      action: { label: 'Join Community', href: '/community' }
    }
  ]

  const benefits = [
    'Priority customer support',
    'Exclusive member discounts',
    'Early access to new features',
    'Personalized travel recommendations',
    'Loyalty points on every booking',
    'Flexible cancellation policies'
  ]

  const handleContinue = () => {
    router.push('/home')
  }

  const completedCount = onboardingSteps.filter(step => step.completed).length
  const progressPercentage = (completedCount / onboardingSteps.length) * 100

  const cardClass = "border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur"

  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      {/* Header */}
      <Header/>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce"></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[--color-accent-primary]/15 rounded-full mb-8">
              <CheckCircle className="h-12 w-12 text-[--color-accent-primary]"/>
            </div>
            <h1 className="text-5xl heading-anton mb-4">
              Welcome to ATLVS + GVTEWAY!
            </h1>
            <p className="text-xl text-[--text-secondary] body-share-tech max-w-2xl mx-auto mb-8">
              Your account setup is complete! You&apos;re now ready to discover amazing travel experiences,
              connect with fellow adventurers, and create unforgettable memories.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" onClick={handleContinue} className="px-8 h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition">
                <Rocket className="h-5 w-5 mr-2"/>
                Start Exploring
              </Button>
              <Button variant="outline" size="lg" asChild className="h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                <Link href="/home/profile">
                  <Sparkles className="h-5 w-5 mr-2"/>
                  Complete Profile
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Onboarding Progress */}
            <div className="lg:col-span-2">
              <Card className={`mb-8 ${cardClass}`}>
                <CardHeader>
                  <CardTitle className="flex items-center heading-anton">
                    <Award className="h-5 w-5 mr-2 text-[--color-accent-primary]"/>
                    Onboarding Progress
                  </CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    Track your setup completion and unlock premium features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Setup Complete</span>
                      <span className="text-sm text-muted-foreground">
                        {completedCount} of {onboardingSteps.length} steps
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="w-full"/>
                  </div>

                  <div className="space-y-4">
                    {onboardingSteps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                          step.completed
                            ? 'bg-semantic-success/5 border-semantic-success/40'
                            : 'bg-[--surface-hover] border-[--border-default]'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          step.completed ? 'bg-semantic-success/10' : 'bg-[--surface-default]'
                        }`}>
                          <step.icon className={`h-4 w-4 ${
                            step.completed ? 'text-semantic-success' : 'text-muted-foreground'
                          }`}/>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{step.title}</h4>
                            {step.completed && (
                              <Badge variant="secondary" className="bg-semantic-success/10 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1"/>
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[--text-secondary] body-share-tech mt-1">
                            {step.description}
                          </p>
                          {!step.completed && step.action && (
                            <Button variant="outline" size="sm" className="mt-2 h-9 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]" asChild>
                              <Link href={step.action.href}>
                                {step.action.label}
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Recommendations */}
              <Card className={`mb-8 ${cardClass}`}>
                <CardHeader>
                  <CardTitle className="flex items-center heading-anton">
                    <Star className="h-5 w-5 mr-2 text-semantic-warning"/>
                    Recommended for You
                  </CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    Based on your interests, here are some personalized suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec) => (
                      <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="capitalize">
                              {rec.type}
                            </Badge>
                          </div>
                          {rec.rating && (
                            <div className="absolute top-3 right-3 flex items-center bg-background/90 rounded px-2 py-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"/>
                              <span className="text-xs font-medium">{rec.rating}</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 line-clamp-2">{rec.title}</h4>
                          <p className="text-sm text-[--text-secondary] body-share-tech mb-3 line-clamp-2">
                            {rec.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            {rec.location && (
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1"/>
                                {rec.location}
                              </div>
                            )}
                            {rec.price && (
                              <div className="flex items-center">
                                <span className="font-medium text-accent-primary">{rec.price}</span>
                              </div>
                            )}
                          </div>
                          {rec.date && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1"/>
                              {rec.date}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Member Benefits */}
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="flex items-center heading-anton">
                    <Gift className="h-5 w-5 mr-2 text-[--color-accent-primary]"/>
                    Member Benefits
                  </CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    Enjoy these exclusive perks as a member
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 flex-shrink-0"/>
                        <span className="text-sm text-[--text-primary]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="flex items-center heading-anton">
                    <TrendingUp className="h-5 w-5 mr-2 text-[--color-accent-primary]"/>
                    Next Steps
                  </CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    Get the most out of your membership
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-accent-primary/10 rounded-lg">
                          <step.icon className="h-4 w-4 text-[--color-accent-primary]"/>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-[--text-primary]">{step.title}</h4>
                          <p className="text-sm text-[--text-secondary] body-share-tech">{step.description}</p>
                          <Button variant="link" className="px-0 text-accent-primary" asChild>
                            <Link href={step.action.href}>
                              {step.action.label}
                              <ArrowRight className="h-3 w-3 ml-1"/>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-semantic-success"/>
                    Your Journey Starts Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Account Created:</span>
                      <span className="font-medium">Today</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Member Level:</span>
                      <span className="font-medium">Standard</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loyalty Points:</span>
                      <span className="font-medium text-accent-primary">100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Reward:</span>
                      <span className="font-medium">200 points</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Alert>
                <CheckCircle className="h-4 w-4"/>
                <AlertTitle>Need Help?</AlertTitle>
                <AlertDescription>
                  Our support team is here to help you get started. Contact us anytime for assistance with your account or booking questions.
                  <div className="mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/support/contact">Contact Support</Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
