
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/lib/design-system"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

export default async function MemberHome() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  const userId = session.user?.id
  const supabase = await createClient()

  // Fetch upcoming events from Supabase with proper error handling
  const { data: upcomingEvents, error: eventsError } = await supabase
    .from('events')
    .select('id, name, slug, start_date, end_date, status, venue_id')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(3)

  if (eventsError) {
    logger.error('Failed to fetch upcoming events', eventsError, { userId })
  }

  // Fetch recommendations from Supabase (events user hasn't attended)
  const { data: recommendations, error: recsError } = await supabase
    .from('events')
    .select('id, name, slug, start_date, end_date, status')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(3)

  if (recsError) {
    logger.error('Failed to fetch event recommendations', recsError, { userId })
  }

  // Fetch user's ticket count from Supabase
  const { data: ticketPurchases, error: ticketsError } = await supabase
    .from('ticket_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'confirmed')

  if (ticketsError) {
    logger.error('Failed to fetch ticket purchases', ticketsError, { userId })
  }
  const activeTickets = ticketPurchases?.length || 0

  // Fetch wallet balance from Supabase
  const { data: walletData, error: walletError } = await supabase
    .from('wallets')
    .select('balance, credits, currency')
    .eq('user_id', userId)
    .single()

  if (walletError && walletError.code !== 'PGRST116') {
    logger.error('Failed to fetch wallet data', walletError, { userId })
  }
  const walletBalance = walletData?.balance || 0
  const walletCredits = walletData?.credits || 0

  // Fetch recent community activity (follows, likes, reviews)
  const { data: recentActivity, error: activityError } = await supabase
    .from('activities')
    .select('id, user_id, action, entity, entity_id, details, "createdAt"')
    .order('"createdAt"', { ascending: false })
    .limit(5)

  if (activityError) {
    logger.error('Failed to fetch recent activity', activityError, { userId })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {session.user.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">
            Discover your next favorite experience and manage your entertainment journey.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-display text-accent-primary">{activeTickets}</CardTitle>
              <CardDescription>Active Tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{upcomingEvents?.length || 0} upcoming events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-display text-accent-secondary">${Number(walletBalance).toFixed(2)}</CardTitle>
              <CardDescription>Wallet Balance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{Number(walletCredits).toFixed(0)} credits available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-display text-accent-tertiary">0</CardTitle>
              <CardDescription>Fitness Goals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">0 completed this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-display text-success">{recentActivity?.length || 0}</CardTitle>
              <CardDescription>Recent Activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Community interactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Find Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse upcoming events and experiences.
              </p>
              <Button size="sm" className="w-full">Explore</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">My Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage your ticket purchases.
              </p>
              <Button size="sm" variant="outline" className="w-full">View Tickets</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Travel Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Organize your upcoming trips and itineraries.
              </p>
              <Button size="sm" variant="outline" className="w-full">Plan Trip</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">FAT Club</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track fitness goals and wellness progress.
              </p>
              <Button size="sm" variant="outline" className="w-full">View Progress</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your profile and preferences.
              </p>
              <Button size="sm" variant="outline" className="w-full">Settings</Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Events & Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your confirmed tickets and reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(upcomingEvents || []).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-medium">{event.name}</h3>
                          <Badge variant="secondary" className="text-xs">{event.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Get Directions</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">View All Events</Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Community Activity</CardTitle>
                <CardDescription>Recent activity from people you follow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-accent-primary">SJ</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Sarah Johnson</span> checked into{" "}
                        <span className="font-medium text-accent-primary">Summer Music Festival</span>
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-secondary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-accent-secondary">MR</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Mike Rodriguez</span> reviewed{" "}
                        <span className="font-medium text-accent-secondary">Blue Note Jazz Club</span>
                      </p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-tertiary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-accent-tertiary">LC</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Lisa Chen</span> added{" "}
                        <span className="font-medium text-accent-tertiary">Comedy Festival</span> to wishlist
                      </p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">View Community Feed</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recommendations & Fitness */}
          <div className="space-y-8">
            {/* Personalized Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>AI-powered suggestions based on your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(recommendations || []).map((rec) => (
                    <div key={rec.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm">{rec.name}</h3>
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {rec.start_date ? new Date(rec.start_date).toLocaleDateString() : 'TBD'}
                      </p>
                      <Button size="sm" className="w-full text-xs">Learn More</Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">View All Recommendations</Button>
                </div>
              </CardContent>
            </Card>

            {/* FAT Club Fitness Progress */}
            <Card>
              <CardHeader>
                <CardTitle>FAT Club Progress</CardTitle>
                <CardDescription>Your fitness and wellness journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Monthly Goal</span>
                    <span className="text-sm text-muted-foreground">8/10 completed</span>
                  </div>
                  <Progress value={80} className="h-2"/>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Workouts</span>
                    <span className="text-sm text-muted-foreground">5/6 completed</span>
                  </div>
                  <Progress value={83} className="h-2"/>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent-primary">1,247</div>
                    <div className="text-xs text-muted-foreground">Steps Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent-secondary">89</div>
                    <div className="text-xs text-muted-foreground">Active Minutes</div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">View Full Progress</Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                   Transfer Tickets
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                   Add Payment Method
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                   Gift Membership
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                   Download App
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                   Help & Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
