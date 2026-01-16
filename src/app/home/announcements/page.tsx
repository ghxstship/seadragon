
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { logger } from "@/lib/logger"

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  is_featured: boolean
  created_at: string
  action_url?: string
  action_label?: string
}

export default function HomeAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/v1/announcements?limit=20')
        if (res.ok) {
          const data = await res.json()
          setAnnouncements(data.data?.announcements || [])
        } else {
          logger.error('Failed to fetch announcements', new Error(`HTTP ${res.status}`))
          setAnnouncements([])
        }
      } catch (error) {
        logger.error('Failed to fetch announcements data', error)
        setAnnouncements([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  const handleSubscribe = async () => {
    if (!email.trim()) return

    try {
      const res = await fetch('/api/v1/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'announcements' })
      })

      if (res.ok) {
        alert('Successfully subscribed to updates!')
        setEmail('')
      } else {
        alert('Failed to subscribe. Please try again.')
      }
    } catch (error) {
      logger.error('Failed to subscribe to announcements', error, { email: email.substring(0, 50) })
      alert('Failed to subscribe. Please try again.')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return ''
      case 'promotion': return ''
      case 'maintenance': return '️'
      case 'security': return ''
      case 'destination': return ''
      default: return ''
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-accent-secondary'
      case 'promotion': return 'bg-semantic-success'
      case 'maintenance': return 'bg-semantic-warning'
      case 'security': return 'bg-semantic-error'
      case 'destination': return 'bg-indigo-600'
      default: return 'bg-neutral-500'
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-accent-secondary/10 text-blue-800'
      case 'promotion': return 'bg-semantic-success/10 text-green-800'
      case 'maintenance': return 'bg-semantic-warning/10 text-yellow-800'
      case 'security': return 'bg-semantic-error/10 text-red-800'
      case 'destination': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const featuredAnnouncement = announcements.find(a => a.is_featured)
  const regularAnnouncements = announcements.filter(a => !a.is_featured)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Announcements</h1>
          <p className="text-neutral-600">Latest updates and important news from our team</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">No announcements</h3>
            <p className="text-muted-foreground">Check back later for updates!</p>
          </div>
        ) : (
          <>
            {featuredAnnouncement && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${getTypeColor(featuredAnnouncement.type)} rounded-full flex items-center justify-center text-primary-foreground`}>
                    <span className="text-lg">{getTypeIcon(featuredAnnouncement.type)}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-blue-900 mb-2">{featuredAnnouncement.title}</h2>
                    <p className="text-blue-800 mb-3">{featuredAnnouncement.content}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-accent-tertiary">
                        {new Date(featuredAnnouncement.created_at).toLocaleDateString()}
                      </span>
                      {featuredAnnouncement.action_url && (
                        <Button 
                          className="bg-accent-secondary text-primary-foreground px-4 py-1 rounded hover:bg-accent-tertiary"
                          onClick={() => window.location.href = featuredAnnouncement.action_url!}
                        >
                          {featuredAnnouncement.action_label || 'Learn More'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {regularAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-background rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 ${getTypeColor(announcement.type)} rounded-full flex items-center justify-center text-primary-foreground`}>
                      <span className="text-sm">{getTypeIcon(announcement.type)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{announcement.title}</h3>
                      <p className="text-neutral-700 mb-3">{announcement.content}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-neutral-500">
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${getTypeBadgeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                        {announcement.action_url && (
                          <a href={announcement.action_url} className="text-accent-secondary hover:text-blue-800">
                            {announcement.action_label || 'Learn More'} →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Stay Updated</h2>
          <p className="text-neutral-600 mb-4">
            Never miss important announcements by customizing your notification preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <Button 
              onClick={handleSubscribe}
              className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-md hover:bg-accent-tertiary"
            >
              Subscribe to Updates
            </Button>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            You can unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
