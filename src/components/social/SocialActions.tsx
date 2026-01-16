
"use client"

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { ErrorBoundary } from '@/lib/error-handling'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  UserMinus,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialActionsProps {
  contentId: string
  contentType: 'experience' | 'profile' | 'event' | 'destination' | 'review'
  initialLikes?: number
  initialComments?: number
  initialShares?: number
  isLiked?: boolean
  isFollowing?: boolean
  showFollow?: boolean
  className?: string
}

export function SocialActions({
  contentId,
  contentType,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  isLiked = false,
  isFollowing = false,
  showFollow = false,
  className
}: SocialActionsProps) {
  return (
    <ErrorBoundary>
      <SocialActionsInner
        contentId={contentId}
        contentType={contentType}
        initialLikes={initialLikes}
        initialComments={initialComments}
        initialShares={initialShares}
        isLiked={isLiked}
        isFollowing={isFollowing}
        showFollow={showFollow}
        className={className}
      />
    </ErrorBoundary>
  )
}

function SocialActionsInner({
  contentId,
  contentType,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  isLiked = false,
  isFollowing = false,
  showFollow = false,
  className
}: SocialActionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [comments, setComments] = useState(initialComments)
  const [shares, setShares] = useState(initialShares)
  const [liked, setLiked] = useState(isLiked)
  const [following, setFollowing] = useState(isFollowing)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentsList, setCommentsList] = useState<Array<{
    id: string
    user: { name: string; avatar: string }
    text: string
    timestamp: Date
    likes: number
  }>>(() => [
    {
      id: '1',
      user: { name: 'Sarah Johnson', avatar: '/api/placeholder/40/40' },
      text: 'This looks amazing! I\'ve been wanting to try this experience.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 3
    },
    {
      id: '2',
      user: { name: 'Mike Chen', avatar: '/api/placeholder/40/40' },
      text: 'Great recommendation! The BBQ scene in Austin is world-class.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      likes: 1
    }
  ])
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  // Update current time every minute for relative time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const handleLike = async () => {
    try {
      const response = await fetch('/api/social/like', {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, contentType })
      })

      if (response.ok) {
        setLiked(!liked)
        setLikes(prev => liked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      logger.error('Error toggling like', error)
    }
  }

  const handleFollow = async () => {
    try {
      const response = await fetch('/api/social/follow', {
        method: following ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: contentId })
      })

      if (response.ok) {
        setFollowing(!following)
      }
    } catch (error) {
      logger.error('Error toggling follow', error)
    }
  }

  const handleShare = async () => {
    try {
      const response = await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, contentType })
      })

      if (response.ok) {
        setShares(prev => prev + 1)
        // Copy URL to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } catch (error) {
      logger.error('Error sharing', error)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim()) return

    try {
      const response = await fetch('/api/social/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, contentType, text: commentText })
      })

      if (response.ok) {
        const newComment = await response.json()
        setCommentsList(prev => [newComment, ...prev])
        setComments(prev => prev + 1)
        setCommentText('')
      }
    } catch (error) {
      logger.error('Error posting comment', error)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              'flex items-center space-x-2',
              liked && 'text-semantic-error hover:text-semantic-error'
            )}
          >
            <Heart className={cn('h-4 w-4', liked && 'fill-current')}/>
            <span>{likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4"/>
            <span>{comments}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4"/>
            <span>{shares}</span>
          </Button>
        </div>

        {showFollow && (
          <Button
            variant={following ? 'outline' : 'default'}
            size="sm"
            onClick={handleFollow}
            className="flex items-center space-x-2"
          >
            {following ? (
              <>
                <UserMinus className="h-4 w-4"/>
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4"/>
                <span>Follow</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4 pt-4 border-t">
          {/* Comment Input */}
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px] resize-none"/>
              <div className="flex justify-end">
                <Button size="sm" onClick={handleComment} disabled={!commentText.trim()}>
                  <Send className="h-4 w-4 mr-2"/>
                  Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {commentsList.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name}/>
                  <AvatarFallback>
                    {comment.user.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                          Math.floor((comment.timestamp.getTime() - currentTime) / (1000 * 60)),
                          'minute'
                        )}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 ml-3">
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Like ({comment.likes})
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Follow Button Component
interface FollowButtonProps {
  targetId: string
  targetType: 'user' | 'business' | 'brand'
  initialFollowing?: boolean
  showCount?: boolean
  className?: string
}

export function FollowButton({
  targetId,
  targetType,
  initialFollowing = false,
  showCount = false,
  className
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [followerCount, setFollowerCount] = useState(0)

  const handleFollow = async () => {
    try {
      const response = await fetch('/api/social/follow', {
        method: following ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, targetType })
      })

      if (response.ok) {
        setFollowing(!following)
        setFollowerCount(prev => following ? prev - 1 : prev + 1)
      }
    } catch (error) {
      logger.error('Error toggling follow', error)
    }
  }

  return (
    <Button
      variant={following ? 'outline' : 'default'}
      onClick={handleFollow}
      className={cn('flex items-center space-x-2', className)}
    >
      {following ? (
        <>
          <UserMinus className="h-4 w-4"/>
          <span>Following</span>
          {showCount && <span className="text-sm opacity-75">({followerCount})</span>}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4"/>
          <span>Follow</span>
          {showCount && <span className="text-sm opacity-75">({followerCount})</span>}
        </>
      )}
    </Button>
  )
}

// Like Button Component
interface LikeButtonProps {
  contentId: string
  contentType: string
  initialLiked?: boolean
  initialCount?: number
  showCount?: boolean
  size?: 'sm' | 'lg' | 'default' | 'icon'
  className?: string
}

export function LikeButton({
  contentId,
  contentType,
  initialLiked = false,
  initialCount = 0,
  showCount = true,
  size = 'default',
  className
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)

  const handleLike = async () => {
    try {
      const response = await fetch('/api/social/like', {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, contentType })
      })

      if (response.ok) {
        setLiked(!liked)
        setCount(prev => liked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      logger.error('Error toggling like', error)
    }
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleLike}
      className={cn(
        'flex items-center space-x-2 transition-colors',
        liked && 'text-semantic-error hover:text-semantic-error',
        className
      )}
    >
      <Heart className={cn('transition-all', liked && 'fill-current scale-110')}/>
      {showCount && <span>{count}</span>}
    </Button>
  )
}

// Share Button Component
interface ShareButtonProps {
  contentId: string
  contentType: string
  url?: string
  title?: string
  showCount?: boolean
  initialCount?: number
  className?: string
}

export function ShareButton({
  contentId,
  contentType,
  url,
  title,
  showCount = false,
  initialCount = 0,
  className
}: ShareButtonProps) {
  const [shares, setShares] = useState(initialCount)

  const handleShare = async () => {
    const shareUrl = url || window.location.href
    const shareTitle = title || document.title

    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: shareTitle,
          url: shareUrl
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl)
        // Could show a toast notification here
      }

      // Record the share
      const response = await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, contentType, url: shareUrl })
      })

      if (response.ok) {
        setShares(prev => prev + 1)
      }
    } catch (error) {
      logger.error('Error sharing', error)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={cn('flex items-center space-x-2', className)}
    >
      <Share2 className="h-4 w-4"/>
      {showCount && <span>{shares}</span>}
    </Button>
  )
}
