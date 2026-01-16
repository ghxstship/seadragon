'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Store,
  Handshake,
  MessageCircle,
  Link as LinkIcon,
  Sparkles,
  Award,
  Plus,
  Search,
  Filter,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  Star,
  TrendingUp
} from 'lucide-react'

interface MarketplaceListing {
  id: string
  title: string
  description?: string
  listing_type: string
  pricing?: any
  contact_info?: any
  is_active: boolean
  created_at: string
}

interface Opportunity {
  id: string
  title: string
  description?: string
  opportunity_type: string
  stage: string
  value?: number
  assigned_to?: string
  created_at: string
}

interface Discussion {
  id: string
  title: string
  discussion_type: string
  replies_count: number
  last_reply_at?: string
  created_by: string
  created_at: string
}

interface Connection {
  id: string
  connected_organization_id: string
  connection_type: string
  status: string
  relationship_details?: any
  created_at: string
}

interface Showcase {
  id: string
  title: string
  description?: string
  showcase_type: string
  featured: boolean
  created_at: string
}

interface Challenge {
  id: string
  title: string
  challenge_type: string
  status: string
  participants: string[]
  deadline?: string
  created_at: string
}

export default function NetworkPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('marketplace')
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [showcases, setShowcases] = useState<Showcase[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNetworkData = async () => {
      if (!session?.user?.organizationId) return

      const orgId = session.user.organizationId

      // Load marketplace listings
      const { data: listings } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      // Load opportunities
      const { data: opps } = await supabase
        .from('opportunities')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      // Load discussions
      const { data: discs } = await supabase
        .from('discussions')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      // Load connections
      const { data: conns } = await supabase
        .from('connections')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      // Load showcases
      const { data: shows } = await supabase
        .from('showcases')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      // Load challenges
      const { data: challs } = await supabase
        .from('challenges')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      setMarketplaceListings(listings || [])
      setOpportunities(opps || [])
      setDiscussions(discs || [])
      setConnections(conns || [])
      setShowcases(shows || [])
      setChallenges(challs || [])
      setLoading(false)
    }

    loadNetworkData()
  }, [session, supabase])

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketplace</h2>
          <p className="text-muted-foreground">Browse and list services, equipment, and opportunities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceListings.map(listing => (
          <Card key={listing.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <Badge variant={listing.is_active ? 'default' : 'secondary'}>
                  {listing.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {listing.description && (
                <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>
              )}
              <div className="space-y-2">
                <Badge variant="outline" className="capitalize">
                  {listing.listing_type}
                </Badge>
                {listing.pricing?.amount && (
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>{listing.pricing.amount} {listing.pricing.currency || 'USD'}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {marketplaceListings.length === 0 && (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No marketplace listings yet</h3>
          <p className="text-muted-foreground mb-4">Create your first listing to connect with potential partners</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Button>
        </div>
      )}
    </div>
  )

  const renderOpportunities = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Opportunities</h2>
          <p className="text-muted-foreground">Discover collaborations, partnerships, and business opportunities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <Card key={opp.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{opp.title}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {opp.stage.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {opp.description && (
                <p className="text-sm text-muted-foreground mb-4">{opp.description}</p>
              )}
              <div className="space-y-2">
                <Badge variant="secondary" className="capitalize">
                  {opp.opportunity_type}
                </Badge>
                {opp.value && (
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    <span>{opp.value.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="text-center py-12">
          <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No opportunities yet</h3>
          <p className="text-muted-foreground mb-4">Explore potential partnerships and collaborations</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Opportunity
          </Button>
        </div>
      )}
    </div>
  )

  const renderDiscussions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discussions</h2>
          <p className="text-muted-foreground">Connect with the community and share insights</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Start Discussion
        </Button>
      </div>

      <div className="space-y-4">
        {discussions.map(discussion => (
          <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2">{discussion.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline" className="capitalize">
                      {discussion.discussion_type}
                    </Badge>
                    <span>{discussion.replies_count} replies</span>
                    {discussion.last_reply_at && (
                      <span>Last reply {new Date(discussion.last_reply_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {discussions.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
          <p className="text-muted-foreground mb-4">Start the first discussion in your network</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
        </div>
      )}
    </div>
  )

  const renderConnections = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Connections</h2>
          <p className="text-muted-foreground">Manage relationships with partners, clients, and competitors</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map(connection => (
          <Card key={connection.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">Connection #{connection.id.slice(-4)}</CardTitle>
                <Badge variant={connection.status === 'active' ? 'default' : 'secondary'}>
                  {connection.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <Badge variant="outline" className="capitalize">
                  {connection.connection_type}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Connected {new Date(connection.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {connections.length === 0 && (
        <div className="text-center py-12">
          <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No connections yet</h3>
          <p className="text-muted-foreground mb-4">Build relationships with other organizations</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Connection
          </Button>
        </div>
      )}
    </div>
  )

  const renderShowcases = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Showcases</h2>
          <p className="text-muted-foreground">Showcase your work and achievements to the community</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Showcase
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcases.map(showcase => (
          <Card key={showcase.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{showcase.title}</CardTitle>
                {showcase.featured && <Star className="h-5 w-5 text-yellow-500" />}
              </div>
            </CardHeader>
            <CardContent>
              {showcase.description && (
                <p className="text-sm text-muted-foreground mb-4">{showcase.description}</p>
              )}
              <div className="space-y-2">
                <Badge variant="outline" className="capitalize">
                  {showcase.showcase_type}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(showcase.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Showcase
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {showcases.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No showcases yet</h3>
          <p className="text-muted-foreground mb-4">Share your achievements and work with the community</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Showcase
          </Button>
        </div>
      )}
    </div>
  )

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Challenges</h2>
          <p className="text-muted-foreground">Participate in innovation challenges and competitions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => (
          <Card key={challenge.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <Badge variant="outline" className="capitalize">
                  {challenge.challenge_type}
                </Badge>
                <Badge variant={challenge.status === 'open' ? 'default' : 'secondary'}>
                  {challenge.status.replace('_', ' ')}
                </Badge>
                {challenge.deadline && (
                  <p className="text-sm text-muted-foreground">
                    Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                  </p>
                )}
                <p className="text-sm">
                  {challenge.participants.length} participants
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Challenge
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {challenges.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No challenges yet</h3>
          <p className="text-muted-foreground mb-4">Join or create innovation challenges</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Network</h1>
        <p className="text-muted-foreground">
          Connect with the external ecosystem - marketplace, opportunities, and community
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="showcases" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Showcases
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="mt-6">
          {renderMarketplace()}
        </TabsContent>

        <TabsContent value="opportunities" className="mt-6">
          {renderOpportunities()}
        </TabsContent>

        <TabsContent value="discussions" className="mt-6">
          {renderDiscussions()}
        </TabsContent>

        <TabsContent value="connections" className="mt-6">
          {renderConnections()}
        </TabsContent>

        <TabsContent value="showcases" className="mt-6">
          {renderShowcases()}
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          {renderChallenges()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
