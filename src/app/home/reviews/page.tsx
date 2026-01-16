
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/server"

interface UserReview {
  id: string
  entity_type: string
  entity_name: string
  entity_id: string
  rating: number
  title: string
  content: string
  created_at: string
  helpful_count: number
  verified: boolean
}

interface PendingReview {
  id: string
  entity_type: string
  entity_name: string
  entity_id: string
  attended_date: string
  status: string
}

export default async function ReviewsPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Fetch user reviews from Supabase
  const { data: userReviewsResult } = await supabase
    .from('reviews')
    .select('id, entity_type, entity_name, entity_id, rating, title, content, created_at, helpful_count, verified')
    .eq('user_id', session.user?.id)
    .order('created_at', { ascending: false })

  const userReviews: UserReview[] = userReviewsResult || []

  // Fetch pending reviews (events user attended but hasn't reviewed)
  const pendingReviews: PendingReview[] = []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-display font-bold">ATLVS + GVTEWAY</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/home" className="text-sm font-medium">Home</Link>
            <Link href="/home/itineraries" className="text-sm font-medium">Itineraries</Link>
            <Link href="/home/tickets" className="text-sm font-medium">Tickets</Link>
            <Link href="/home/community" className="text-sm font-medium">Community</Link>
            <Link href="/home/reviews" className="text-sm font-medium text-accent-primary">Reviews</Link>
            <Link href="/home/profile" className="text-sm font-medium">Profile</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Welcome, {session.user.name}
            </span>
            <Button variant="ghost" size="sm">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">My Reviews</h1>
          <p className="text-muted-foreground">
            Share your experiences and help others discover great events.
          </p>
        </div>

        <Tabs defaultValue="my-reviews" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-reviews">My Reviews ({userReviews.length})</TabsTrigger>
            <TabsTrigger value="pending">Write Reviews ({pendingReviews.length})</TabsTrigger>
            <TabsTrigger value="helpful">Helpful Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="my-reviews" className="space-y-6">
            {userReviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your experiences by writing reviews for events you've attended.
                  </p>
                  <Button>Write Your First Review</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {userReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={(session.user as any).image || undefined} alt={session.user.name || ''}/>
                            <AvatarFallback>
                              {session.user.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{session.user.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? "text-yellow-400" : "text-neutral-300"}>
                                
                              </span>
                            ))}
                          </div>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">
                            {review.entity_type === 'experience' ? '' : ''} {review.entity_name}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
                        <p className="text-muted-foreground">{review.content}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <Button className="flex items-center space-x-1 text-muted-foreground hover:text-accent-primary">
                            <span></span>
                            <span>{review.helpful_count} found this helpful</span>
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Delete</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Write Reviews</CardTitle>
                <CardDescription>
                  Share your experiences with the community. Reviews help others discover great events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pendingReviews.map((pending) => (
                    <Card key={pending.id} className="border-dashed">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{pending.entity_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Attended on {new Date(pending.attended_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {pending.entity_type === 'experience' ? 'Experience' : 'Event'}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Rating</label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Button
                                  key={star}
                                  className="text-2xl text-neutral-300 hover:text-yellow-400"
                                >
                                  
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Review Title</label>
                            <Input
                              type="text"
                              placeholder="Sum up your experience"
                              className="w-full px-3 py-2 border rounded"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Your Review</label>
                            <Textarea
                              placeholder="Tell others about your experience..."
                              className="min-h-24"/>
                          </div>

                          <div className="flex justify-end">
                            <Button>Submit Review</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {pendingReviews.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4"></div>
                      <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                      <p className="text-muted-foreground">
                        You don't have any pending reviews. Attend more events to share your experiences!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="helpful" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews You Found Helpful</CardTitle>
                <CardDescription>
                  Reviews you've marked as helpful to help improve recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar>
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">Sarah Johnson</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < 5 ? "text-yellow-400" : "text-neutral-300"}>
                                
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">2 days ago</span>
                        </div>
                      </div>
                    </div>
                    <h5 className="font-medium mb-2">&quot;Best sound system I've experienced&quot;</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      The audio quality at this venue is absolutely incredible. Every detail comes through clearly...
                    </p>
                    <Badge variant="outline">Summer Music Festival 2026</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar>
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">Mike Chen</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < 4 ? "text-yellow-400" : "text-neutral-300"}>
                                
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">1 week ago</span>
                        </div>
                      </div>
                    </div>
                    <h5 className="font-medium mb-2">&quot;Great venue, but arrive early&quot;</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Red Rocks is amazing, but parking can be challenging during peak times...
                    </p>
                    <Badge variant="outline">Jazz Under the Stars</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
