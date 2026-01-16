
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"

interface Favorite {
  id: string
  entity_type: string
  entity_id: string
  entity_name: string
  entity_description: string
  created_at: string
}

export default function HomeFavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/v1/favorites')
        if (res.ok) {
          const data = await res.json()
          setFavorites(data.data?.favorites || [])
        } else {
          logger.error('Failed to fetch favorites', new Error(`HTTP ${res.status}`))
          setFavorites([])
        }
      } catch (error) {
        logger.error('Failed to fetch favorites data', error)
        setFavorites([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const filteredFavorites = filter === 'all' 
    ? favorites 
    : favorites.filter(f => f.entity_type === filter)

  const removeFavorite = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/favorites/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.id !== id))
      }
    } catch (error) {
      logger.error('Failed to remove favorite', error, { favoriteId: id })
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'destination': return ''
      case 'experience': return ''
      case 'venue': return '️'
      case 'creator': return ''
      default: return '⭐'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">My Favorites</h1>
          <p className="text-neutral-600">Your saved destinations, experiences, and travel memories</p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'}
              onClick={() => setFilter('all')}
            >
              All Favorites
            </Button>
            <Button 
              variant={filter === 'destination' ? 'default' : 'ghost'}
              onClick={() => setFilter('destination')}
            >
              Destinations
            </Button>
            <Button 
              variant={filter === 'experience' ? 'default' : 'ghost'}
              onClick={() => setFilter('experience')}
            >
              Experiences
            </Button>
            <Button 
              variant={filter === 'venue' ? 'default' : 'ghost'}
              onClick={() => setFilter('venue')}
            >
              Venues
            </Button>
            <Button 
              variant={filter === 'creator' ? 'default' : 'ghost'}
              onClick={() => setFilter('creator')}
            >
              Creators
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Loading favorites...
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground">
                Start exploring and save your favorite destinations and experiences!
              </p>
            </div>
          ) : (
            filteredFavorites.map((favorite) => (
              <div key={favorite.id} className="bg-background rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                    <span className="text-4xl">{getEntityIcon(favorite.entity_type)}</span>
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-semantic-error rounded-full flex items-center justify-center text-primary-foreground hover:bg-red-700"
                  >
                    <span className="text-sm"></span>
                  </button>
                  <div className="absolute bottom-2 left-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs capitalize">
                    {favorite.entity_type}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">{favorite.entity_name}</h3>
                  <p className="text-neutral-600 text-sm mb-3">{favorite.entity_description || 'No description'}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      Saved {new Date(favorite.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="link" className="text-accent-secondary hover:text-blue-800">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Organize Your Favorites</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Create Collections</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Group your favorites into themed collections for easier browsing.
              </p>
              <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded hover:bg-accent-tertiary">
                Create Collection
              </Button>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Share Your Favorites</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Share your favorite destinations and experiences with friends.
              </p>
              <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded hover:bg-green-700">
                Share Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
