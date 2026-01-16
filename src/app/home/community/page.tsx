
'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { logger } from "@/lib/logger"

interface UserApiResponse {
  id: string | number
  name?: string
  avatar?: string
  role?: string
}

interface SocialPost {
  id: string
  user: { name: string; avatar: string; username: string }
  content: string
  type: string
  entityName: string
  entityId: string
  images?: string[]
  likes: number
  comments: number
  timestamp: string
  tags: string[]
}

interface UserGroup {
  id: string
  name: string
  description: string
  members: number
  posts: number
  avatar: string
  category: string
}

interface UserConnection {
  id: string
  name: string
  title: string
  company: string
  avatar: string
  mutualConnections: number
  status: string
}

export default function CommunityPage() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [userGroups, setUserGroups] = useState<UserGroup[]>([])
  const [userConnections, setUserConnections] = useState<UserConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadCommunityData = async () => {
      try {
        // Fetch users as connections
        const usersRes = await fetch('/api/v1/users?limit=10')
        if (usersRes.ok) {
          const data = await usersRes.json()
          const users = Array.isArray(data.users) ? data.users : []
          const connections: UserConnection[] = users.map((u: UserApiResponse, idx: number) => ({
            id: String(u.id || idx),
            name: String(u.name || 'User'),
            title: String(u.role || 'Member'),
            company: 'ATLVS + COMPVSS',
            avatar: u.avatar || '',
            mutualConnections: Math.floor(Math.random() * 20),
            status: idx % 3 === 0 ? 'pending' : 'connected'
          }))
          if (!cancelled) setUserConnections(connections)
        }
        if (!cancelled) {
          setSocialPosts([])
          setUserGroups([])
          setIsLoading(false)
        }
      } catch (error) {
        logger.error('Error loading community data:', error)
        if (!cancelled) {
          setSocialPosts([])
          setUserGroups([])
          setUserConnections([])
          setIsLoading(false)
        }
      }
    }

    loadCommunityData()

    return () => { cancelled = true }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading community...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-display font-bold">ATLVS + GVTEWAY</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/home" className="text-sm font-medium">Home</a>
            <a href="/home/itineraries" className="text-sm font-medium">Itineraries</a>
            <a href="/home/tickets" className="text-sm font-medium">Tickets</a>
            <a href="/home/community" className="text-sm font-medium text-accent-primary">Community</a>
            <a href="/home/profile" className="text-sm font-medium">Profile</a>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">
            Connect with fellow event professionals and share your experiences.
          </p>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList>
            <TabsTrigger value="feed">Social Feed</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="activity">My Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Your Thoughts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="What's happening in your event world?"
                    className="min-h-20"/>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                         Photo
                      </Button>
                      <Button variant="outline" size="sm">
                         Event
                      </Button>
                      <Button variant="outline" size="sm">
                        ️ Tag
                      </Button>
                    </div>
                    <Button>Post</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Feed */}
            <div className="space-y-6">
              {socialPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Avatar>
                        <AvatarImage src={post.user.avatar} alt={post.user.name}/>
                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold">{post.user.name}</span>
                          <span className="text-muted-foreground text-sm">{post.user.username}</span>
                          <span className="text-muted-foreground text-sm">•</span>
                          <span className="text-muted-foreground text-sm">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mb-3">{post.content}</p>

                        {post.entityName && (
                          <div className="inline-flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-sm mb-3">
                            <span>
                              {post.type === 'event' && ''}
                              {post.type === 'experience' && ''}
                              {post.type === 'product' && '️'}
                            </span>
                            <span>{post.entityName}</span>
                          </div>
                        )}

                        {post.tags && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {post.images && post.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {post.images.map((image, index) => (
                              <div key={index} className="aspect-square bg-muted rounded-lg"/>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-6">
                            <Button className="flex items-center space-x-1 hover:text-accent-primary">
                              <span>️</span>
                              <span>{post.likes}</span>
                            </Button>
                            <Button className="flex items-center space-x-1 hover:text-accent-primary">
                              <span></span>
                              <span>{post.comments}</span>
                            </Button>
                            <Button className="hover:text-accent-primary"> Share</Button>
                          </div>
                          <Button className="text-muted-foreground hover:text-accent-primary">
                            ⋯
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold">Your Groups</h2>
              <Button>Create Group</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"/>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{group.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium">{group.members.toLocaleString()}</span>
                            <span className="text-muted-foreground"> members</span>
                          </div>
                          <div>
                            <span className="font-medium">{group.posts}</span>
                            <span className="text-muted-foreground"> posts</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-2">{group.category}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Suggested Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested Groups</CardTitle>
                <CardDescription>Groups you might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Theater Producers Network</h4>
                      <p className="text-sm text-muted-foreground">Share insights on theater production</p>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Corporate Events Hub</h4>
                      <p className="text-sm text-muted-foreground">Connect with corporate event planners</p>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold">Your Network</h2>
              <Button>Find Connections</Button>
            </div>

            {/* Connection Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Requests</CardTitle>
                <CardDescription>People who want to connect with you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userConnections.filter(conn => conn.status === 'pending').map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={connection.avatar} alt={connection.name}/>
                          <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{connection.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {connection.title} at {connection.company}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {connection.mutualConnections} mutual connections
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Ignore</Button>
                        <Button size="sm">Accept</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Connections */}
            <Card>
              <CardHeader>
                <CardTitle>Your Connections</CardTitle>
                <CardDescription>People in your professional network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {userConnections.filter(conn => conn.status === 'connected').map((connection) => (
                    <div key={connection.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={connection.avatar} alt={connection.name}/>
                        <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{connection.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {connection.title} at {connection.company}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">Message</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Activity</CardTitle>
                <CardDescription>Posts, comments, and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"/>
                    <div>
                      <p className="text-sm">
                        You posted about <span className="font-medium">&quot;Summer Music Festival 2026&quot;</span>
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"/>
                    <div>
                      <p className="text-sm">
                        You joined the group <span className="font-medium">&quot;Festival Producers&quot;</span>
                      </p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"/>
                    <div>
                      <p className="text-sm">
                        Sarah Johnson commented on your post
                      </p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"/>
                    <div>
                      <p className="text-sm">
                        You purchased <span className="font-medium">&quot;LED Lighting Rig&quot;</span>
                      </p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
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
