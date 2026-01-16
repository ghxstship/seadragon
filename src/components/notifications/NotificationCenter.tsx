
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Bell,
  Calendar,
  Star,
  Heart,
  MessageSquare,
  UserPlus,
  CheckCircle,
  AlertTriangle,
  X,
  Settings,
  Trash2
} from 'lucide-react'

export interface Notification {
  id: string
  type: 'booking' | 'review' | 'social' | 'event' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: {
    user?: {
      name: string
      avatar: string
    }
    experience?: {
      name: string
      image: string
    }
    event?: {
      name: string
      date: string
    }
    booking?: {
      id: string
      status: string
    }
  }
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4"/>
      case 'review':
        return <Star className="h-4 w-4"/>
      case 'social':
        return <Heart className="h-4 w-4"/>
      case 'event':
        return <AlertTriangle className="h-4 w-4"/>
      case 'system':
        return <CheckCircle className="h-4 w-4"/>
      default:
        return <Bell className="h-4 w-4"/>
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return 'text-accent-secondary'
      case 'review':
        return 'text-semantic-warning'
      case 'social':
        return 'text-semantic-error'
      case 'event':
        return 'text-semantic-warning'
      case 'system':
        return 'text-semantic-success'
      default:
        return 'text-neutral-600'
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4"/>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-xs text-destructive hover:text-destructive"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="h-12 w-12 text-muted-foreground mb-4"/>
              <p className="text-sm text-muted-foreground text-center">
                You&apos;re all caught up! No new notifications.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-muted ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                              Math.floor((notification.timestamp.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                              'day'
                            )}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(notification.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3"/>
                          </Button>
                        </div>
                      </div>

                      {notification.actionUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            onMarkAsRead(notification.id)
                            window.location.href = notification.actionUrl!
                          }}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" size="sm">
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking for "Texas BBQ Trail Experience" has been confirmed for tomorrow at 2:00 PM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      actionUrl: '/bookings/1',
      metadata: {
        experience: {
          name: 'Texas BBQ Trail Experience',
          image: '/api/placeholder/100/60'
        },
        booking: {
          id: '1',
          status: 'confirmed'
        }
      }
    },
    {
      id: '2',
      type: 'review',
      title: 'New Review on Your Experience',
      message: 'Sarah left a 5-star review: "Absolutely incredible experience! The guide was amazing."',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionUrl: '/reviews/2',
      metadata: {
        user: {
          name: 'Sarah Johnson',
          avatar: '/api/placeholder/40/40'
        }
      }
    },
    {
      id: '3',
      type: 'social',
      title: 'New Follower',
      message: 'Mike Chen started following you.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
      actionUrl: '/m/mike-chen',
      metadata: {
        user: {
          name: 'Mike Chen',
          avatar: '/api/placeholder/40/40'
        }
      }
    },
    {
      id: '4',
      type: 'event',
      title: 'Event Reminder',
      message: 'Your event "Jazz Masters Series" starts tomorrow at 8:00 PM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      actionUrl: '/dashboard/events/1',
      metadata: {
        event: {
          name: 'Jazz Masters Series',
          date: '2026-01-25'
        }
      }
    },
    {
      id: '5',
      type: 'system',
      title: 'Welcome to ATLVS + GVTEWAY',
      message: 'Thanks for joining our community! Discover amazing experiences and connect with fellow adventurers.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      read: true
    }
  ])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification
  }
}
