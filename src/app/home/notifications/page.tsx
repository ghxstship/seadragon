
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { logger } from "@/lib/logger"
import { apiRequest } from "@/lib/api/client"

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  is_read: boolean
  created_at: string
  data?: Record<string, unknown>
}

export default function HomeNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const unreadOnly = filter === 'unread'
        const data = await apiRequest<{ data?: { notifications?: Notification[]; unreadCount?: number } }>(
          '/api/v1/notifications',
          {
            query: { limit: 20, unreadOnly },
          }
        )
        setNotifications(data.data?.notifications || [])
        setUnreadCount(data.data?.unreadCount || 0)
      } catch (error) {
        logger.error('Failed to fetch notifications data', error, { filter })
        setNotifications([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [filter])

  const markAsRead = async (notificationId: string) => {
    try {
      await apiRequest(`/api/v1/notifications/${notificationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_read: true })
      })
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      logger.error('Failed to mark notification as read', error, { notificationId })
    }
  }

  const markAllAsRead = async () => {
    try {
      await apiRequest('/api/v1/notifications/mark-all-read', {
        method: 'POST'
      })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      logger.error('Failed to mark all notifications as read', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return '️'
      case 'message': return ''
      case 'experience': return ''
      case 'achievement': return ''
      case 'alert': return '️'
      case 'reminder': return ''
      default: return ''
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-accent-secondary'
      case 'message': return 'bg-semantic-success'
      case 'experience': return 'bg-accent-primary'
      case 'achievement': return 'bg-semantic-warning'
      case 'alert': return 'bg-semantic-error'
      case 'reminder': return 'bg-indigo-600'
      default: return 'bg-neutral-500'
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Notifications</h1>
          <p className="text-neutral-600">Stay updated with your latest activity</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              <Button 
                variant={filter === 'all' ? 'default' : 'ghost'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'unread' ? 'default' : 'ghost'}
                onClick={() => setFilter('unread')}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </Button>
            </div>
            <Button variant="link" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Mark all as read
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    !notification.is_read ? 'border-blue-200 bg-blue-50' : 'border-neutral-200'
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center text-primary-foreground`}>
                      <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-neutral-900 mb-1">
                        <strong>{notification.title}</strong>
                      </p>
                      {notification.body && (
                        <p className="text-neutral-600 text-sm mb-2">{notification.body}</p>
                      )}
                      <p className="text-neutral-500 text-xs">{formatTimeAgo(notification.created_at)}</p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-accent-secondary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Email Notifications</p>
                <p className="text-sm text-neutral-600">Receive notifications via email</p>
              </div>
              <Input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Push Notifications</p>
                <p className="text-sm text-neutral-600">Receive notifications on your device</p>
              </div>
              <Input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Marketing Updates</p>
                <p className="text-sm text-neutral-600">Receive updates about new features and deals</p>
              </div>
              <Input type="checkbox" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Quiet Hours</p>
                <p className="text-sm text-neutral-600">Pause notifications between 10 PM and 8 AM</p>
              </div>
              <Input type="checkbox" defaultChecked />
            </div>
          </div>

          <div className="mt-6">
            <a href="/home/settings/notifications" className="text-accent-secondary hover:text-blue-800 text-sm">
              Advanced notification settings →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
