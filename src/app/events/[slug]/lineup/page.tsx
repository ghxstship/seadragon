
'use client'


import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { Music, Clock, Calendar, MapPin, Heart, Share2, ExternalLink, Star, Mic, Users, Play, Pause, Volume2, VolumeX } from "lucide-react"

interface Artist {
  id: string
  name: string
  genre: string
  image: string
  bio: string
  socialLinks: {
    spotify?: string
    instagram?: string
    website?: string
  }
  performanceTime?: string
  stage?: string
  duration?: number
  isHeadliner: boolean
  popularity: number
  followers: number
  topTracks: string[]
}

interface Performance {
  id: string
  artistId: string
  startTime: string
  endTime: string
  stage: string
  day: string
  description?: string
}

interface EventLineupProps {
  params: Promise<{ slug: string }>
}

interface ArtistApiResponse {
  id: string | number
  name?: string
  genre?: string
  image?: string
  bio?: string
  description?: string
  social_links?: Record<string, string>
  performance_time?: string
  stage?: string
  duration?: number
  is_headliner?: boolean
  popularity?: number
  followers?: number
  top_tracks?: string[]
}

interface PerformanceApiResponse {
  id: string | number
  artist_id: string | number
  start_time?: string
  end_time?: string
  stage?: string
  day?: string
  description?: string
}

export default function Lineup({ params }: EventLineupProps) {
  const { slug } = use(params)
  const [artists, setArtists] = useState<Artist[]>([])
  const [performances, setPerformances] = useState<Performance[]>([])
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [selectedDay, setSelectedDay] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"time" | "popularity" | "name">("time")

  const eventName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const days = [
    { value: "all", label: "All Days" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" }
  ]

  const stages = [
    { value: "all", label: "All Stages" },
    { value: "main", label: "Main Stage" },
    { value: "electronic", label: "Electronic Stage" },
    { value: "acoustic", label: "Acoustic Stage" },
    { value: "jazz", label: "Jazz Lounge" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadLineup = async () => {
      try {
        // Fetch lineup from API
        const res = await fetch(`/api/v1/ghxstship/events/${slug}/lineup`)
        if (res.ok) {
          const data = await res.json()
          const artistsData = Array.isArray(data.artists) ? data.artists : []
          const performancesData = Array.isArray(data.performances) ? data.performances : []
          
          const mappedArtists: Artist[] = artistsData.map((a: ArtistApiResponse) => ({
            id: String(a.id),
            name: String(a.name || 'Artist'),
            genre: String(a.genre || 'Music'),
            image: a.image || '/placeholder-artist.jpg',
            bio: String(a.bio || a.description || ''),
            socialLinks: a.social_links || {},
            performanceTime: a.performance_time,
            stage: a.stage,
            duration: Number(a.duration) || 60,
            isHeadliner: Boolean(a.is_headliner),
            popularity: Number(a.popularity) || 50,
            followers: Number(a.followers) || 0,
            topTracks: Array.isArray(a.top_tracks) ? a.top_tracks : []
          }))
          
          const mappedPerformances: Performance[] = performancesData.map((p: PerformanceApiResponse) => ({
            id: String(p.id),
            artistId: String(p.artist_id),
            startTime: String(p.start_time || '18:00'),
            endTime: String(p.end_time || '19:00'),
            stage: String(p.stage || 'Main Stage'),
            day: String(p.day || 'friday'),
            description: p.description
          }))
          
          if (!cancelled) {
            setArtists(mappedArtists)
            setPerformances(mappedPerformances)
          }
        } else {
          if (!cancelled) {
            setArtists([])
            setPerformances([])
          }
        }
      } catch (error) {
        logger.error('Error loading lineup:', error)
        if (!cancelled) {
          setArtists([])
          setPerformances([])
        }
      }
    }

    loadLineup()

    return () => { cancelled = true }
  }, [slug])

  const filteredPerformances = performances.filter(perf => {
    if (selectedDay !== "all" && perf.day !== selectedDay) return false
    if (selectedStage !== "all" && perf.stage.toLowerCase().replace(" ", "-") !== selectedStage) return false
    return true
  })

  const sortedArtists = [...artists].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularity - a.popularity
      case "name":
        return a.name.localeCompare(b.name)
      case "time":
      default:
        // Sort by performance time if available, otherwise by name
        if (a.performanceTime && b.performanceTime) {
          return a.performanceTime.localeCompare(b.performanceTime)
        }
        return a.name.localeCompare(b.name)
    }
  })

  const headliners = artists.filter(artist => artist.isHeadliner)
  const totalArtists = artists.length
  const totalPerformances = performances.length
  const averagePopularity = artists.length > 0
    ? Math.round(artists.reduce((sum, artist) => sum + artist.popularity, 0) / artists.length)
    : 0

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
            <Link href="/events" className="hover:text-foreground">Events</Link>
            <span>/</span>
            <Link href={`/events/${slug}`} className="hover:text-foreground">{eventName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Lineup</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-accent-primary/20 rounded-full">
              <Music className="h-8 w-8 text-accent-primary"/>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                {eventName} Lineup
              </h1>
              <p className="text-xl text-muted-foreground">
                Meet the incredible artists bringing this event to life
              </p>
            </div>
          </div>

          {/* Lineup Stats */}
          <div className="grid md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-3xl font-bold mb-1">{totalArtists}</div>
                <div className="text-sm text-muted-foreground">Artists</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mic className="h-8 w-8 mx-auto mb-2 text-semantic-success"/>
                <div className="text-3xl font-bold mb-1">{headliners.length}</div>
                <div className="text-sm text-muted-foreground">Headliners</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-3xl font-bold mb-1">{totalPerformances}</div>
                <div className="text-sm text-muted-foreground">Performances</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-semantic-warning"/>
                <div className="text-3xl font-bold mb-1">{averagePopularity}%</div>
                <div className="text-sm text-muted-foreground">Avg Popularity</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-semantic-warning"/>
                <div className="text-3xl font-bold mb-1">3</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="artists" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="headliners">Headliners</TabsTrigger>
          </TabsList>

          <TabsContent value="artists" className="space-y-8">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Select value={sortBy} onValueChange={(value: "time" | "popularity" | "name") => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Sort by Time</SelectItem>
                    <SelectItem value="popularity">Sort by Popularity</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Artists Grid/List */}
            <div className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {sortedArtists.map((artist) => (
                <Card key={artist.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-48 object-cover rounded-t-lg"/>
                      {artist.isHeadliner && (
                        <Badge className="absolute top-2 right-2 bg-semantic-warning text-foreground">
                          Headliner
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-colors rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setSelectedArtist(artist)}
                            >
                              <Play className="h-4 w-4 mr-2"/>
                              View Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-3">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={artist.image} alt={artist.name}/>
                                  <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-xl font-bold">{artist.name}</div>
                                  <div className="text-sm text-muted-foreground">{artist.genre}</div>
                                </div>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-muted-foreground">{artist.bio}</p>

                              {artist.performanceTime && (
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4"/>
                                    <span>{artist.performanceTime}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4"/>
                                    <span>{artist.stage}</span>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                  {artist.followers.toLocaleString()} followers • {artist.popularity}% popularity
                                </div>
                                <div className="flex space-x-2">
                                  {artist.socialLinks.spotify && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={artist.socialLinks.spotify} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4"/>
                                      </a>
                                    </Button>
                                  )}
                                  {artist.socialLinks.instagram && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4"/>
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {artist.topTracks.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Top Tracks</h4>
                                  <div className="space-y-1">
                                    {artist.topTracks.map((track, index) => (
                                      <div key={index} className="text-sm text-muted-foreground">
                                        {index + 1}. {track}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{artist.name}</h3>
                          <p className="text-sm text-muted-foreground">{artist.genre}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{artist.popularity}%</div>
                          <div>{artist.followers.toLocaleString()} followers</div>
                        </div>
                      </div>

                      {artist.performanceTime && (
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4"/>
                            <span>{artist.performanceTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4"/>
                            <span>{artist.stage}</span>
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {artist.bio}
                      </p>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Heart className="h-4 w-4 mr-1"/>
                          Follow
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Share2 className="h-4 w-4 mr-1"/>
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-8">
            {/* Schedule Filters */}
            <div className="flex gap-4">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-40">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-40">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Schedule</CardTitle>
                <CardDescription>
                  Complete lineup schedule for {eventName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPerformances.map((performance) => {
                    const artist = artists.find(a => a.id === performance.artistId)
                    if (!artist) return null

                    return (
                      <div key={performance.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-20 text-center">
                          <div className="text-sm font-semibold">{performance.startTime}</div>
                          <div className="text-xs text-muted-foreground">
                            {performance.endTime}
                          </div>
                        </div>

                        <Avatar className="w-12 h-12">
                          <AvatarImage src={artist.image} alt={artist.name}/>
                          <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{artist.name}</h4>
                            <Badge variant="outline">{artist.genre}</Badge>
                            {artist.isHeadliner && (
                              <Badge className="bg-semantic-warning text-foreground">Headliner</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{performance.stage}</span>
                            <span>{performance.day.charAt(0).toUpperCase() + performance.day.slice(1)}</span>
                            <span>{artist.duration} min</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 mr-1"/>
                            Follow
                          </Button>
                          <Button variant="outline" size="sm">
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="headliners" className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Featured Headliners</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {headliners.map((artist) => (
                  <Card key={artist.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-64 object-cover"/>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-semantic-warning text-foreground text-lg px-3 py-1">
                           Headliner
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={artist.image} alt={artist.name}/>
                          <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-1">{artist.name}</h3>
                          <p className="text-lg text-muted-foreground mb-2">{artist.genre}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{artist.followers.toLocaleString()} followers</span>
                            <span>{artist.popularity}% popularity</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{artist.bio}</p>

                      {artist.performanceTime && (
                        <div className="bg-accent-primary/10 p-4 rounded-lg mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">Performance</div>
                              <div className="text-sm text-muted-foreground">
                                {artist.performanceTime} • {artist.stage} • {artist.duration} minutes
                              </div>
                            </div>
                            <Button>Set Reminder</Button>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Button className="flex-1">
                          <Heart className="h-4 w-4 mr-2"/>
                          Follow Artist
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="h-4 w-4 mr-2"/>
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Get ready for an unforgettable experience with these amazing artists.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" asChild>
                <Link href={`/events/${slug}`}>
                  <Music className="h-4 w-4 mr-2"/>
                  Back to Event
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/events/${slug}/tickets`}>
                  <ExternalLink className="h-4 w-4 mr-2"/>
                  Get Tickets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
