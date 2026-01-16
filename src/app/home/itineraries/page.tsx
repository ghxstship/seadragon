
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/lib/design-system'
import { logger } from '@/lib/logger'
import { Calendar, MapPin, Users, Clock, Plus, Edit, Trash2 } from 'lucide-react'

interface EventApiResponse {
  id: string | number
  name?: string
  description?: string
  start_date?: string
  end_date?: string
  venue_name?: string
  location?: string
  capacity?: number
  status?: string
}

interface ItineraryItem {
  type: string
  name: string
  date: string
  time: string
}

interface Itinerary {
  id: number
  name: string
  destination: string
  startDate: string
  endDate: string
  status: string
  items: ItineraryItem[]
}

export default function ItinerariesPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [upcomingItineraries, setUpcomingItineraries] = useState<Itinerary[]>([])
  const [pastItineraries, setPastItineraries] = useState<Itinerary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadItineraries = async () => {
      try {
        // Fetch events as itineraries
        const res = await fetch('/api/v1/ghxstship/events?limit=20')
        if (res.ok) {
          const data = await res.json()
          const events = Array.isArray(data.events) ? data.events : []
          const now = new Date()
          
          // Map events to itinerary shape
          const mapped: Itinerary[] = events.map((e: EventApiResponse, idx: number) => ({
            id: idx + 1,
            name: String(e.name || 'Itinerary'),
            destination: String(e.venue_name || e.location || 'Destination'),
            startDate: e.start_date ? new Date(e.start_date).toISOString().split('T')[0] : '',
            endDate: e.end_date ? new Date(e.end_date).toISOString().split('T')[0] : '',
            status: 'active',
            items: [
              {
                type: 'event',
                name: String(e.name || 'Event'),
                date: e.start_date ? new Date(e.start_date).toISOString().split('T')[0] : '',
                time: 'TBD'
              }
            ]
          }))

          // Split into upcoming and past
          const upcoming = mapped.filter(i => new Date(i.startDate) >= now || !i.startDate)
          const past = mapped.filter(i => i.startDate && new Date(i.startDate) < now)

          if (!cancelled) {
            setUpcomingItineraries(upcoming)
            setPastItineraries(past)
            setIsLoading(false)
          }
        } else {
          if (!cancelled) {
            setUpcomingItineraries([])
            setPastItineraries([])
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading itineraries:', error)
        if (!cancelled) {
          setUpcomingItineraries([])
          setPastItineraries([])
          setIsLoading(false)
        }
      }
    }

    loadItineraries()

    return () => {
      cancelled = true
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-semantic-success/10 text-green-800'
      case 'planning': return 'bg-semantic-warning/10 text-yellow-800'
      case 'completed': return 'bg-neutral-100 text-neutral-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="h-4 w-4"/>
      case 'accommodation': return <MapPin className="h-4 w-4"/>
      case 'transportation': return <Users className="h-4 w-4"/>
      case 'dining': return <Clock className="h-4 w-4"/>
      default: return <Calendar className="h-4 w-4"/>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold">My Itineraries</h1>
              <p className="text-muted-foreground">
                Plan and manage your entertainment experiences
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2"/>
              Create Itinerary
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingItineraries.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-lg font-semibold mb-2">No upcoming itineraries</h3>
                  <p className="text-muted-foreground mb-4">
                    Start planning your next entertainment adventure
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Create Your First Itinerary
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {upcomingItineraries.map((itinerary) => (
                  <Card key={itinerary.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{itinerary.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1"/>
                            {itinerary.destination}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(itinerary.status)}>
                            {itinerary.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4"/>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                          {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {itinerary.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                            {getItemIcon(item.type)}
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(item.date).toLocaleDateString()} at {item.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          {itinerary.items.length} items planned
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Book Remaining
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid gap-6">
              {pastItineraries.map((itinerary) => (
                <Card key={itinerary.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{itinerary.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1"/>
                          {itinerary.destination}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {itinerary.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {itinerary.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                          {getItemIcon(item.type)}
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()} at {item.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Trip completed
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Write Review
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">No draft itineraries</h3>
                <p className="text-muted-foreground mb-4">
                  Start planning your next trip and save drafts here
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2"/>
                  Create Draft Itinerary
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
