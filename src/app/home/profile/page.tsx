
'use client'

import { useState, useEffect } from "react"
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Header } from "@/lib/design-system"
import { User, Settings, Shield, Bell, CreditCard, MapPin, Calendar, Star, Camera, Edit, Save, X, Trash2, Lock, Eye, EyeOff, Globe, Mail, Phone, Heart, CheckCircle } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  location?: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  languages: string[]
  interests: string[]
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    publicProfile: boolean
    showActivity: boolean
  }
  stats: {
    totalBookings: number
    totalSpent: number
    favoriteDestinations: number
    reviewsWritten: number
    loyaltyPoints: number
  }
  membership: {
    level: string
    joinDate: string
    expiryDate?: string
    benefits: string[]
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      try {
        // Fetch user profile from session/auth API
        const res = await fetch('/api/auth/session')
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            const userProfile: UserProfile = {
              id: String(data.user.id || 'user-1'),
              name: String(data.user.name || 'User'),
              email: String(data.user.email || ''),
              phone: data.user.phone || undefined,
              avatar: data.user.image || undefined,
              bio: data.user.bio || '',
              location: data.user.location || '',
              dateOfBirth: data.user.dateOfBirth || undefined,
              gender: data.user.gender || undefined,
              nationality: data.user.nationality || undefined,
              languages: Array.isArray(data.user.languages) ? data.user.languages : ['English'],
              interests: Array.isArray(data.user.interests) ? data.user.interests : [],
              preferences: {
                emailNotifications: data.user.preferences?.emailNotifications ?? true,
                smsNotifications: data.user.preferences?.smsNotifications ?? false,
                marketingEmails: data.user.preferences?.marketingEmails ?? false,
                publicProfile: data.user.preferences?.publicProfile ?? true,
                showActivity: data.user.preferences?.showActivity ?? true
              },
              stats: {
                totalBookings: data.user.stats?.totalBookings ?? 0,
                totalSpent: data.user.stats?.totalSpent ?? 0,
                favoriteDestinations: data.user.stats?.favoriteDestinations ?? 0,
                reviewsWritten: data.user.stats?.reviewsWritten ?? 0,
                loyaltyPoints: data.user.stats?.loyaltyPoints ?? 0
              },
              membership: {
                level: data.user.membership?.level || 'Standard',
                joinDate: data.user.membership?.joinDate || new Date().toISOString(),
                expiryDate: data.user.membership?.expiryDate,
                benefits: data.user.membership?.benefits || []
              }
            }
            if (!cancelled) {
              setProfile(userProfile)
              setFormData(userProfile)
            }
          }
        }
      } catch (error) {
        logger.error('Error loading profile:', error)
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Save profile via API
      const res = await fetch('/api/v1/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          nationality: formData.nationality,
          languages: formData.languages,
          interests: formData.interests,
          preferences: formData.preferences
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to save profile')
      }

      setProfile(formData as UserProfile)
      setIsEditing(false)
    } catch (error) {
      logger.error('Failed to save profile', error)
      alert(error instanceof Error ? error.message : 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match')
      return
    }

    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to change password')
      }

      alert('Password changed successfully!')
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to change password')
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const res = await fetch('/api/v1/users/me', {
          method: 'DELETE'
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to delete account')
        }

        alert('Account deletion initiated. You will receive a confirmation email.')
        router.push('/auth/login')
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete account')
      }
    }
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }))
  }

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...(prev.languages || []), language]
    }))
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

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
            <Link href="/home" className="hover:text-foreground">Member Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Profile</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar} alt={profile.name}/>
                  <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-4 w-4"/>
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-display font-bold mb-2">{profile.name}</h1>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1"/>
                        {profile.email}
                      </div>
                      {profile.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1"/>
                          {profile.phone}
                        </div>
                      )}
                      {profile.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1"/>
                          {profile.location}
                        </div>
                      )}
                    </div>
                    <Badge variant="default" className="mb-3">
                      {profile.membership.level} Member
                    </Badge>
                    {profile.bio && (
                      <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2"/>
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSaveProfile} disabled={isSaving}>
                          <Save className="h-4 w-4 mr-2"/>
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setIsEditing(false)
                          setFormData(profile)
                        }}>
                          <X className="h-4 w-4 mr-2"/>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-2xl font-bold">{profile.stats.totalBookings}</div>
                <div className="text-sm text-muted-foreground">Bookings</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-semantic-success"/>
                <div className="text-2xl font-bold">${profile.stats.totalSpent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-semantic-error"/>
                <div className="text-2xl font-bold">{profile.stats.favoriteDestinations}</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-semantic-warning"/>
                <div className="text-2xl font-bold">{profile.stats.reviewsWritten}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-2xl font-bold">{profile.stats.loyaltyPoints.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.name?.split(' ')[0] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          name: `${e.target.value} ${prev.name?.split(' ')[1] || ''}`.trim()
                        }))}
                        disabled={!isEditing}/>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.name?.split(' ')[1] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          name: `${prev.name?.split(' ')[0] || ''} ${e.target.value}`.trim()
                        }))}
                        disabled={!isEditing}/>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}/>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}/>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}/>
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select
                        value={formData.nationality || ''}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="american">American</SelectItem>
                          <SelectItem value="british">British</SelectItem>
                          <SelectItem value="canadian">Canadian</SelectItem>
                          <SelectItem value="australian">Australian</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."/>
                  </div>

                  {/* Interests */}
                  <div>
                    <Label>Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Adventure Travel', 'Cultural Experiences', 'Fine Dining', 'Photography', 'Beach Activities', 'City Exploration', 'Nature', 'Shopping', 'Nightlife', 'Wellness'].map(interest => (
                        <Badge
                          key={interest}
                          variant={formData.interests?.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => isEditing && toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <Label>Languages</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean'].map(language => (
                        <Badge
                          key={language}
                          variant={formData.languages?.includes(language) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => isEditing && toggleLanguage(language)}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to receive updates and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive booking confirmations, updates, and important announcements
                      </p>
                    </div>
                    <Checkbox
                      id="email-notifications"
                      checked={formData.preferences?.emailNotifications}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        preferences: { 
                          emailNotifications: checked as boolean,
                          smsNotifications: prev.preferences?.smsNotifications ?? false,
                          marketingEmails: prev.preferences?.marketingEmails ?? false,
                          publicProfile: prev.preferences?.publicProfile ?? false,
                          showActivity: prev.preferences?.showActivity ?? false
                        }
                      }))}/>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications" className="text-base font-medium">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get text messages for urgent updates and reminders
                      </p>
                    </div>
                    <Checkbox
                      id="sms-notifications"
                      checked={formData.preferences?.smsNotifications ?? false}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        preferences: { 
                          emailNotifications: prev.preferences?.emailNotifications ?? false,
                          marketingEmails: prev.preferences?.marketingEmails ?? false,
                          publicProfile: prev.preferences?.publicProfile ?? false,
                          showActivity: prev.preferences?.showActivity ?? false,
                          smsNotifications: checked as boolean 
                        }
                      }))}/>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails" className="text-base font-medium">
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive special offers, destination highlights, and travel tips
                      </p>
                    </div>
                    <Checkbox
                      id="marketing-emails"
                      checked={formData.preferences?.marketingEmails}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, marketingEmails: checked as boolean }
                      }))}/>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your profile visibility and activity sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-profile" className="text-base font-medium">
                        Public Profile
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow other users to view your profile and travel history
                      </p>
                    </div>
                    <Checkbox
                      id="public-profile"
                      checked={formData.preferences?.publicProfile}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, publicProfile: checked as boolean }
                      }))}/>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-activity" className="text-base font-medium">
                        Show Activity
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Display your recent bookings and reviews on your public profile
                      </p>
                    </div>
                    <Checkbox
                      id="show-activity"
                      checked={formData.preferences?.showActivity}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, showActivity: checked as boolean }
                      }))}/>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword.current ? "text" : "password"}
                        value={passwordData.current}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}/>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPassword.current ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword.new ? "text" : "password"}
                        value={passwordData.new}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}/>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPassword.new ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}/>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPassword.confirm ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleChangePassword} className="w-full">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app for two-factor authentication
                      </p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/auth/mfa/setup">Set Up</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-destructive">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Delete Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                            <DialogDescription>
                              Are you absolutely sure you want to delete your account? This action cannot be undone.
                              All your bookings, reviews, and account data will be permanently removed.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex space-x-3 pt-4">
                            <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1">
                              Yes, Delete My Account
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-semantic-warning"/>
                    {profile.membership.level} Membership
                  </CardTitle>
                  <CardDescription>
                    Your current membership status and benefits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Membership Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Level:</span>
                          <Badge variant="default">{profile.membership.level}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Member Since:</span>
                          <span>{new Date(profile.membership.joinDate).toLocaleDateString()}</span>
                        </div>
                        {profile.membership.expiryDate && (
                          <div className="flex justify-between">
                            <span>Expires:</span>
                            <span>{new Date(profile.membership.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Loyalty Points:</span>
                          <span className="font-semibold">{profile.stats.loyaltyPoints.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Membership Benefits</h4>
                      <ul className="space-y-1 text-sm">
                        {profile.membership.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-semantic-success mr-2"/>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loyalty Program</CardTitle>
                  <CardDescription>
                    Earn points with every booking and unlock exclusive rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Current Points</span>
                      <span className="text-2xl font-bold text-accent-primary">
                        {profile.stats.loyaltyPoints.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent-primary h-2 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      1,250 points until next reward tier
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
