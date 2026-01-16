
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { logger } from "@/lib/logger"

interface FeedPost {
  id: string
  user_id: string
  user_name: string
  user_initials: string
  content: string
  post_type: string
  likes_count: number
  comments_count: number
  created_at: string
  experience?: {
    name: string
    location: string
    rating: number
  }
}

export default function HomeFeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [newPost, setNewPost] = useState('')

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('/api/v1/feed?limit=20')
        if (res.ok) {
          const data = await res.json()
          setPosts(data.data?.posts || [])
        } else {
          logger.error('Failed to fetch feed', new Error(`HTTP ${res.status}`))
          setPosts([])
        }
      } catch (error) {
        logger.error('Failed to fetch feed data', error)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeed()
  }, [])

  const handlePost = async () => {
    if (!newPost.trim()) return

    try {
      const res = await fetch('/api/v1/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost, post_type: 'general' })
      })

      if (res.ok) {
        const data = await res.json()
        setPosts(prev => [data.data?.post, ...prev].filter(Boolean))
        setNewPost('')
      }
    } catch (error) {
      logger.error('Failed to create feed post', error, { content: newPost.substring(0, 100) })
    }
  }

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/v1/feed/${postId}/like`, { method: 'POST' })
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
      ))
    } catch (error) {
      logger.error('Failed to like feed post', error, { postId })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'experience': return 'bg-semantic-success/10 text-green-800'
      case 'announcement': return 'bg-accent-primary/10 text-purple-800'
      case 'tip': return 'bg-semantic-warning/10 text-orange-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.post_type === filter)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Activity Feed</h1>
          <p className="text-neutral-600">Stay updated with your travel community</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <Input
              type="text"
              placeholder="Share your travel thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Button 
              onClick={handlePost}
              className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-lg hover:bg-accent-tertiary"
            >
              Post
            </Button>
          </div>

          <div className="flex space-x-4 text-sm">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'}
              onClick={() => setFilter('all')}
            >
              All Activity
            </Button>
            <Button 
              variant={filter === 'experience' ? 'default' : 'ghost'}
              onClick={() => setFilter('experience')}
            >
              Experiences
            </Button>
            <Button 
              variant={filter === 'tip' ? 'default' : 'ghost'}
              onClick={() => setFilter('tip')}
            >
              Travel Tips
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading feed...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-background rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Be the first to share something with the community!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-background rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-accent-secondary font-semibold">{post.user_initials || 'U'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-neutral-900">{post.user_name || 'User'}</h3>
                      <span className="text-neutral-500 text-sm">{formatTimeAgo(post.created_at)}</span>
                      {post.post_type !== 'general' && (
                        <span className={`text-xs px-2 py-1 rounded capitalize ${getTypeColor(post.post_type)}`}>
                          {post.post_type}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-700 mb-4">{post.content}</p>
                    {post.experience && (
                      <div className="bg-neutral-100 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl"></span>
                          <div>
                            <h4 className="font-medium text-neutral-900">{post.experience.name}</h4>
                            <p className="text-sm text-neutral-600">{post.experience.location} • {post.experience.rating} stars</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className="flex items-center space-x-1 hover:text-accent-secondary"
                      >
                        <span></span>
                        <span>{post.likes_count} Likes</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-accent-secondary">
                        <span></span>
                        <span>{post.comments_count} Comments</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-accent-secondary">
                        <span>↗️</span>
                        <span>Share</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredPosts.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="px-6 py-3">
              Load More Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
