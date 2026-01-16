
'use client'


import { logger } from "@/lib/logger"
import { Calendar, Clock, MapPin, Filter, Heart, Share2, Bell, Star, Music, Mic, Users, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface PerformanceApiResponse {
  id: string | number
  artist_id?: string | number
  artist_name?: string
  name?: string
  artist_image?: string
  genre?: string
  start_time?: string
  end_time?: string
  duration?: number
  stage?: string
  day?: string
  description?: string
  is_headliner?: boolean
  popularity?: number
  followers?: number
  social_links?: {
    spotify?: string
    instagram?: string
  }
}

interface Performance {
  id: string
  artistId: string
  artistName: string
  artistImage: string
  genre: string
  startTime: string
  endTime: string
  duration: number
  stage: string
  day: string
  description?: string
  isHeadliner: boolean
  popularity: number
  followers: number
  socialLinks?: {
    spotify?: string
    instagram?: string
  }
}

interface Performance {
  id: string
  artistId: string
  artistName: string
  artistImage: string
  genre: string
  startTime: string
  endTime: string
  duration: number
  stage: string
  day: string
  description?: string
  isHeadliner: boolean
  popularity: number
  followers: number
  socialLinks?: {
    spotify?: string
    instagram?: string
  }
}

interface ScheduleItem {
  time: string
  performances: Performance[]
}

interface EventScheduleProps {
  params: Promise<{ slug: string }>
}

export default function Schedule({ params }: EventScheduleProps) {
  const { slug } = use(params)
  const [performances, setPerformances] = useState<Performance[]>([])
  const [selectedDay, setSelectedDay] = useState("friday")
  const [selectedStage, setSelectedStage] = useState("all")
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline")
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null)

  const eventName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const days = [
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

    const loadSchedule = async () => {
      try {
        // Fetch event schedule from API
        const res = await fetch(`/api/v1/ghxstship/events/${slug}/schedule`)
        if (res.ok) {
          const data = await res.json()
          const scheduleData = Array.isArray(data.performances) ? data.performances : []
          const mapped: Performance[] = scheduleData.map((p: PerformanceApiResponse) => ({
            id: String(p.id),
            artistId: String(p.artist_id || p.id),
            artistName: String(p.artist_name || p.name || 'Artist'),
            artistImage: p.artist_image || '/placeholder-artist.jpg',
            genre: String(p.genre || 'Music'),
            startTime: String(p.start_time || '18:00'),
            endTime: String(p.end_time || '19:00'),
            duration: Number(p.duration) || 60,
            stage: String(p.stage || 'Main Stage'),
            day: String(p.day || 'friday'),
            description: p.description,
            isHeadliner: Boolean(p.is_headliner),
            popularity: Number(p.popularity) || 50,
            followers: Number(p.followers) || 0,
            socialLinks: p.social_links
          }))
          if (!cancelled) setPerformances(mapped)
        } else {
          if (!cancelled) setPerformances([])
        }
      } catch (error) {
        logger.error('Error loading schedule:', error)
        if (!cancelled) setPerformances([])
      }
    }

    loadSchedule()

    return () => { cancelled = true }
  }, [slug])

  // Filter performances by selected day and stage
  const filteredPerformances = useMemo(() => {
    return performances.filter(perf => {
      const dayMatch = perf.day === selectedDay
      const stageMatch = selectedStage === "all" || perf.stage.toLowerCase().replace(" ", "-") === selectedStage
      return dayMatch && stageMatch
    })
  }, [performances, selectedDay, selectedStage])

  // Group performances by time for timeline view
  const timelineData = useMemo(() => {
    const grouped: { [key: string]: Performance[] } = {}

    filteredPerformances.forEach(perf => {
      if (!grouped[perf.startTime]) {
        grouped[perf.startTime] = []
      }
      grouped[perf.startTime].push(perf)
    })

    return Object.keys(grouped)
      .sort()
      .map(time => ({
        time,
        performances: grouped[time].sort((a, b) => a.stage.localeCompare(b.stage))
      }))
  }, [filteredPerformances])

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'main stage': return 'bg-semantic-error/10 text-red-800'
      case 'electronic stage': return 'bg-accent-primary/10 text-purple-800'
      case 'acoustic stage': return 'bg-semantic-success/10 text-green-800'
      case 'jazz lounge': return 'bg-accent-primary/10 text-blue-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getNextDay = () => {
    const currentIndex = days.findIndex(d => d.value === selectedDay)
    const nextIndex = (currentIndex + 1) % days.length
    setSelectedDay(days[nextIndex].value)
  }

  const getPrevDay = () => {
    const currentIndex = days.findIndex(d => d.value === selectedDay)
    const prevIndex = currentIndex === 0 ? days.length - 1 : currentIndex - 1
    setSelectedDay(days[prevIndex].value)
  }

  const headlinerCount = performances.filter(p => p.isHeadliner && p.day === selectedDay).length
  const totalPerformances = filteredPerformances.length
  const totalDuration = filteredPerformances.reduce((sum, p) => sum + p.duration, 0)

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
            <span className="text-foreground font-medium">Schedule</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-accent-primary/20 rounded-full">
              <Calendar className="h-8 w-8 text-accent-primary"/>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                {eventName} Schedule
              </h1>
              <p className="text-xl text-muted-foreground">
                Complete performance schedule and timetable
              </p>
            </div>
          </div>

          {/* Schedule Stats */}
          <div className="grid md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-3xl font-bold mb-1">{totalPerformances}</div>
                <div className="text-sm text-muted-foreground">Performances</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-semantic-warning"/>
                <div className="text-3xl font-bold mb-1">{headlinerCount}</div>
                <div className="text-sm text-muted-foreground">Headliners</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-semantic-success"/>
                <div className="text-3xl font-bold mb-1">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Music className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-3xl font-bold mb-1">{stages.length - 1}</div>
                <div className="text-sm text-muted-foreground">Stages</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mic className="h-8 w-8 mx-auto mb-2 text-semantic-warning"/>
                <div className="text-3xl font-bold mb-1">{days.length}</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Day Navigation and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={getPrevDay}>
              <ChevronLeft className="h-4 w-4"/>
            </Button>

            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-accent-primary"/>
              <span className="text-lg font-semibold">
                {days.find(d => d.value === selectedDay)?.label}
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={getNextDay}>
              <ChevronRight className="h-4 w-4"/>
            </Button>
          </div>

          <div className="flex gap-4">
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-48">
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

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "timeline" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("timeline")}
                className="rounded-r-none"
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
              >
                Grid
              </Button>
            </div>
          </div>
        </div>

        {/* Schedule Content */}
        {viewMode === "timeline" ? (
          <div className="space-y-6">
            {timelineData.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                  <h3 className="text-lg font-semibold mb-2">No performances scheduled</h3>
                  <p className="text-muted-foreground">
                    Check back later for schedule updates or try different filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              timelineData.map((slot, index) => (
                <div key={slot.time} className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-accent-primary/30"></div>

                  {/* Time marker */}
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-16 text-right">
                      <div className="bg-accent-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {formatTime(slot.time)}
                      </div>
                    </div>

                    {/* Performances */}
                    <div className="flex-1 space-y-4">
                      {slot.performances.map((performance, perfIndex) => (
                        <Card key={performance.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={performance.artistImage} alt={performance.artistName}/>
                                <AvatarFallback>{performance.artistName.charAt(0)}</AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h3 className="text-xl font-bold">{performance.artistName}</h3>
                                      {performance.isHeadliner && (
                                        <Badge className="bg-semantic-warning text-foreground">Headliner</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                      <Badge variant="outline">{performance.genre}</Badge>
                                      <span>{performance.stage}</span>
                                      <span>{performance.duration} min</span>
                                    </div>
                                  </div>

                                  <div className="text-right text-sm text-muted-foreground">
                                    <div>{performance.followers.toLocaleString()} followers</div>
                                    <div>{performance.popularity}% popularity</div>
                                  </div>
                                </div>

                                {performance.description && (
                                  <p className="text-muted-foreground mb-4">{performance.description}</p>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Heart className="h-4 w-4 mr-1"/>
                                      Follow
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Bell className="h-4 w-4 mr-1"/>
                                      Remind Me
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Share2 className="h-4 w-4 mr-1"/>
                                      Share
                                    </Button>
                                    {performance.socialLinks?.spotify && (
                                      <Button variant="outline" size="sm" asChild>
                                        <a href={performance.socialLinks.spotify} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-4 w-4"/>
                                        </a>
                                      </Button>
                                    )}
                                  </div>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button onClick={() => setSelectedPerformance(performance)}>
                                        View Details
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center space-x-3">
                                          <Avatar className="w-12 h-12">
                                            <AvatarImage src={performance.artistImage} alt={performance.artistName}/>
                                            <AvatarFallback>{performance.artistName.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <div className="text-xl font-bold">{performance.artistName}</div>
                                            <div className="text-sm text-muted-foreground">{performance.genre}</div>
                                          </div>
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="font-semibold">Time:</span> {formatTime(performance.startTime)} - {formatTime(performance.endTime)}
                                          </div>
                                          <div>
                                            <span className="font-semibold">Stage:</span> {performance.stage}
                                          </div>
                                          <div>
                                            <span className="font-semibold">Duration:</span> {performance.duration} minutes
                                          </div>
                                          <div>
                                            <span className="font-semibold">Day:</span> {performance.day.charAt(0).toUpperCase() + performance.day.slice(1)}
                                          </div>
                                        </div>

                                        {performance.description && (
                                          <div>
                                            <h4 className="font-semibold mb-2">About This Performance</h4>
                                            <p className="text-muted-foreground">{performance.description}</p>
                                          </div>
                                        )}

                                        <div className="flex justify-between items-center pt-4 border-t">
                                          <div className="text-sm text-muted-foreground">
                                            {performance.followers.toLocaleString()} followers • {performance.popularity}% popularity
                                          </div>
                                          <div className="flex space-x-2">
                                            <Button size="sm">
                                              <Heart className="h-4 w-4 mr-1"/>
                                              Follow Artist
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Share2 className="h-4 w-4 mr-1"/>
                                              Share
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Grid View
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerformances.map((performance) => (
              <Card key={performance.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Avatar className="w-20 h-20 mx-auto mb-3">
                      <AvatarImage src={performance.artistImage} alt={performance.artistName}/>
                      <AvatarFallback>{performance.artistName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg mb-1">{performance.artistName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{performance.genre}</p>
                    {performance.isHeadliner && (
                      <Badge className="bg-semantic-warning text-foreground mb-2">Headliner</Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-semibold">{formatTime(performance.startTime)} - {formatTime(performance.endTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stage:</span>
                      <Badge className={getStageColor(performance.stage)}>
                        {performance.stage}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{performance.duration} min</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-1"/>
                      Follow
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Bell className="h-4 w-4 mr-1"/>
                      Remind
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Don&apos;t miss your favorite performances! Set reminders and follow artists.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" asChild>
                <Link href={`/events/${slug}`}>
                  <Music className="h-4 w-4 mr-2"/>
                  Back to Event
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/events/${slug}/lineup`}>
                  <Users className="h-4 w-4 mr-2"/>
                  View Lineup
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
