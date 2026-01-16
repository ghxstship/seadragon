
'use client'

import { useState, useEffect } from "react"
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Header } from "@/lib/design-system"
import { User, Briefcase, Building, Shield, CheckCircle, ArrowRight, AlertTriangle, Users, Crown, Star, Settings } from "lucide-react"

interface Profile {
  id: string
  type: 'personal' | 'professional' | 'organization'
  name: string
  role: string
  organization?: string
  avatar?: string
  lastActive: Date
  isCurrent: boolean
  status: 'active' | 'inactive' | 'pending'
  description: string
  features: string[]
}

interface ProfileApiResponse {
  id: string | number
  type?: string
  name?: string
  role?: string
  organization?: string
  avatar?: string
  last_active?: string
  lastActive?: string
  is_current?: boolean
  isCurrent?: boolean
  status?: string
  description?: string
  features?: string[]
}

export default function SwitchProfilePage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isSwitching, setIsSwitching] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadProfiles = async () => {
      try {
        const res = await fetch('/api/v1/profiles')
        if (res.ok) {
          const data = await res.json()
          const profs = Array.isArray(data.profiles) ? data.profiles : []
          if (!cancelled) {
            setProfiles(profs.map((p: ProfileApiResponse) => ({
              id: String(p.id),
              type: p.type || 'personal',
              name: String(p.name || ''),
              role: String(p.role || ''),
              organization: p.organization,
              avatar: p.avatar,
              lastActive: new Date(p.last_active || p.lastActive || new Date()),
              isCurrent: Boolean(p.is_current || p.isCurrent),
              status: p.status || 'active',
              description: String(p.description || ''),
              features: Array.isArray(p.features) ? p.features : []
            })))
          }
        } else {
          if (!cancelled) {
            setProfiles([])
          }
        }
      } catch (error) {
        logger.error('Error loading profiles:', error)
        if (!cancelled) {
          setProfiles([])
        }
      }
    }

    loadProfiles()

    return () => { cancelled = true }
  }, [])

  const handleSwitchProfile = async (profile: Profile) => {
    if (profile.isCurrent) return

    setIsSwitching(true)
    setSelectedProfile(profile)

    try {
      // Simulate profile switching
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In real app, this would update session/role and redirect
      alert(`Switched to ${profile.name} (${profile.type}) profile`)
      router.push('/dashboard')
    } catch (error) {
      logger.error('Failed to switch profile', error)
      alert('Failed to switch profile. Please try again.')
    } finally {
      setIsSwitching(false)
      setSelectedProfile(null)
    }
  }

  const getProfileIcon = (type: string) => {
    switch (type) {
      case 'organization':
        return <Building className="h-5 w-5"/>
      case 'professional':
        return <Briefcase className="h-5 w-5"/>
      case 'personal':
      default:
        return <User className="h-5 w-5"/>
    }
  }

  const getProfileColor = (type: string) => {
    switch (type) {
      case 'organization':
        return 'text-accent-secondary'
      case 'personal':
        return 'text-semantic-success'
      case 'professional':
        return 'text-accent-primary'
      default:
        return 'text-neutral-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-semantic-success/10 text-green-800">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary" className="bg-neutral-100 text-neutral-800">Inactive</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-semantic-warning/10 text-yellow-800">Pending</Badge>
      default:
        return null
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Active now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const personalProfiles = profiles.filter(p => p.type === 'personal')
  const professionalProfiles = profiles.filter(p => p.type === 'professional')
  const organizationProfiles = profiles.filter(p => p.type === 'organization')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Switch Profile</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <User className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Switch Profile</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose which profile you&apos;d like to use. Each profile maintains separate settings, preferences, and access levels.
            </p>
          </div>

          {/* Current Profile Highlight */}
          <Card className="mb-8 bg-accent-primary/5 border-accent-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent-primary/20 rounded-full">
                  <CheckCircle className="h-6 w-6 text-accent-primary"/>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Current Profile</h3>
                  <p className="text-muted-foreground">
                    You're currently using {profiles.find(p => p.isCurrent)?.name || 'Unknown'} profile
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Personal Profiles */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                  <User className="h-6 w-6 mr-2 text-semantic-success"/>
                  Personal
                </h2>
                <div className="space-y-4">
                  {personalProfiles.map((profile) => (
                    <Card key={profile.id} className={`cursor-pointer transition-all hover:shadow-lg ${
                      profile.isCurrent ? 'ring-2 ring-accent-primary bg-accent-primary/5' : ''
                    } ${profile.status !== 'active' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getProfileColor(profile.type)} bg-muted`}>
                              {getProfileIcon(profile.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{profile.name}</h3>
                              <p className="text-sm text-muted-foreground">{profile.role}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {profile.isCurrent && (
                              <Badge variant="default">Current</Badge>
                            )}
                            {getStatusBadge(profile.status)}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          {profile.description}
                        </p>

                        <p className="text-xs text-muted-foreground mb-4">
                          Last active: {formatLastActive(profile.lastActive)}
                        </p>

                        <div className="flex space-x-2">
                          {profile.isCurrent ? (
                            <Button disabled className="flex-1">
                              <CheckCircle className="h-4 w-4 mr-2"/>
                              Active
                            </Button>
                          ) : profile.status === 'active' ? (
                            <Button
                              className="flex-1"
                              onClick={() => handleSwitchProfile(profile)}
                              disabled={isSwitching}
                            >
                              {isSwitching && selectedProfile?.id === profile.id ? (
                                'Switching...'
                              ) : (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2"/>
                                  Switch
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button disabled variant="outline" className="flex-1">
                              {profile.status === 'inactive' ? 'Inactive' : 'Pending'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Professional Profiles */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-accent-primary"/>
                  Professional
                </h2>
                <div className="space-y-4">
                  {professionalProfiles.map((profile) => (
                    <Card key={profile.id} className={`cursor-pointer transition-all hover:shadow-lg ${
                      profile.isCurrent ? 'ring-2 ring-accent-primary bg-accent-primary/5' : ''
                    } ${profile.status !== 'active' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getProfileColor(profile.type)} bg-muted`}>
                              {getProfileIcon(profile.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{profile.name}</h3>
                              <p className="text-sm text-muted-foreground">{profile.role}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {profile.isCurrent && (
                              <Badge variant="default">Current</Badge>
                            )}
                            {getStatusBadge(profile.status)}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          {profile.description}
                        </p>

                        <p className="text-xs text-muted-foreground mb-4">
                          Last active: {formatLastActive(profile.lastActive)}
                        </p>

                        <div className="flex space-x-2">
                          {profile.isCurrent ? (
                            <Button disabled className="flex-1">
                              <CheckCircle className="h-4 w-4 mr-2"/>
                              Active
                            </Button>
                          ) : profile.status === 'active' ? (
                            <Button
                              className="flex-1"
                              onClick={() => handleSwitchProfile(profile)}
                              disabled={isSwitching}
                            >
                              {isSwitching && selectedProfile?.id === profile.id ? (
                                'Switching...'
                              ) : (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2"/>
                                  Switch
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button disabled variant="outline" className="flex-1">
                              {profile.status === 'inactive' ? 'Inactive' : 'Pending'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {professionalProfiles.length === 0 && (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                        <h3 className="font-semibold mb-2">No Professional Profile</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create a professional profile to manage business events and networking.
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Briefcase className="h-4 w-4 mr-2"/>
                              Create Professional Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Professional Profile</DialogTitle>
                              <DialogDescription>
                                Set up a professional profile for business networking and event management.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <label className="text-sm font-medium">Professional Title</label>
                                <Input
                                  type="text"
                                  className="w-full px-3 py-2 border rounded-md mt-1"
                                  placeholder="e.g., Event Organizer, Travel Agent"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Company/Organization</label>
                                <Input
                                  type="text"
                                  className="w-full px-3 py-2 border rounded-md mt-1"
                                  placeholder="e.g., Adventure Corp"
                                />
                              </div>
                              <Button className="w-full">Create Profile</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* Organization Profiles */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold mb-4 flex items-center">
                  <Building className="h-6 w-6 mr-2 text-accent-secondary"/>
                  Organizations
                </h2>
                <div className="space-y-4">
                  {organizationProfiles.map((profile) => (
                    <Card key={profile.id} className={`cursor-pointer transition-all hover:shadow-lg ${
                      profile.isCurrent ? 'ring-2 ring-accent-primary bg-accent-primary/5' : ''
                    } ${profile.status !== 'active' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getProfileColor(profile.type)} bg-muted`}>
                              {getProfileIcon(profile.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{profile.organization}</h3>
                              <p className="text-sm text-muted-foreground">{profile.role}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {profile.isCurrent && (
                              <Badge variant="default">Current</Badge>
                            )}
                            {getStatusBadge(profile.status)}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          {profile.description}
                        </p>

                        <p className="text-xs text-muted-foreground mb-4">
                          Last active: {formatLastActive(profile.lastActive)}
                        </p>

                        <div className="flex space-x-2">
                          {profile.isCurrent ? (
                            <Button disabled className="flex-1">
                              <CheckCircle className="h-4 w-4 mr-2"/>
                              Active
                            </Button>
                          ) : profile.status === 'active' ? (
                            <Button
                              className="flex-1"
                              onClick={() => handleSwitchProfile(profile)}
                              disabled={isSwitching}
                            >
                              {isSwitching && selectedProfile?.id === profile.id ? (
                                'Switching...'
                              ) : (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2"/>
                                  Switch
                                </>
                              )}
                            </Button>
                          ) : profile.status === 'inactive' ? (
                            <div className="flex-1">
                              <Alert>
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertTitle className="text-sm">Profile Inactive</AlertTitle>
                                <AlertDescription className="text-xs">
                                  Contact your organization admin to reactivate this profile.
                                </AlertDescription>
                              </Alert>
                            </div>
                          ) : (
                            <Button disabled variant="outline" className="flex-1">
                              Pending Approval
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {organizationProfiles.length === 0 && (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                        <h3 className="font-semibold mb-2">No Organization Profiles</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Join an organization or create one to access team features.
                        </p>
                        <div className="space-y-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full">
                                <Users className="h-4 w-4 mr-2"/>
                                Join Organization
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Join an Organization</DialogTitle>
                                <DialogDescription>
                                  Enter an organization code to join an existing organization.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <label className="text-sm font-medium">Organization Code</label>
                                  <Input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md mt-1"
                                    placeholder="Enter organization code"
                                  />
                                </div>
                                <Button className="w-full">Join Organization</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full">
                                <Building className="h-4 w-4 mr-2"/>
                                Create Organization
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Create Organization</DialogTitle>
                                <DialogDescription>
                                  Set up a new organization to manage team members and events.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <label className="text-sm font-medium">Organization Name</label>
                                  <Input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md mt-1"
                                    placeholder="e.g., Adventure Corp"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Organization Slug</label>
                                  <Input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md mt-1"
                                    placeholder="e.g., adventure-corp"
                                  />
                                </div>
                                <Button className="w-full">Create Organization</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Features Comparison */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2"/>
                  Profile Features
                </CardTitle>
                <CardDescription>
                  Each profile type offers different features and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-semantic-success"/>
                      <span className="font-medium">Personal</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• Personal bookings</li>
                      <li>• Travel planning</li>
                      <li>• Reviews & ratings</li>
                      <li>• Loyalty rewards</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-accent-primary"/>
                      <span className="font-medium">Professional</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• Event management</li>
                      <li>• Professional networking</li>
                      <li>• Analytics dashboard</li>
                      <li>• Team collaboration</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-accent-secondary"/>
                      <span className="font-medium">Organization</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• Team management</li>
                      <li>• Organization settings</li>
                      <li>• Bulk bookings</li>
                      <li>• Advanced analytics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <Alert className="mt-8">
            <Shield className="h-4 w-4"/>
            <AlertTitle>Profile Security</AlertTitle>
            <AlertDescription>
              Switching profiles maintains separate data and permissions. Your personal information remains secure within each profile context.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
