'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Building2,
  Users,
  Settings,
  Palette,
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Upload,
  UserPlus
} from 'lucide-react'

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  website?: string
  email?: string
  phone?: string
  address?: any
  industry?: string
  size?: string
  founded_year?: number
  created_at: string
}

interface Branding {
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  font_family?: string
}

export default function OrganizationPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [branding, setBranding] = useState<Branding>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [orgFormData, setOrgFormData] = useState<Partial<Organization>>({})
  const [brandingFormData, setBrandingFormData] = useState<Partial<Branding>>({})

  useEffect(() => {
    const loadOrganizationData = async () => {
      if (!session?.user?.organizationId) return

      const orgId = session.user.organizationId

      // Load organization details
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single()

      if (orgError) {
        console.error('Error loading organization:', orgError)
      } else {
        setOrganization(orgData)
        setOrgFormData(orgData)
      }

      // Load branding settings
      const { data: brandingData } = await supabase
        .from('branding_settings')
        .select('*')
        .eq('organization_id', orgId)
        .single()

      if (brandingData) {
        setBranding({
          logo_url: brandingData.logo_url,
          primary_color: brandingData.primary_color,
          secondary_color: brandingData.secondary_color,
          font_family: brandingData.font_family
        })
        setBrandingFormData({
          logo_url: brandingData.logo_url,
          primary_color: brandingData.primary_color,
          secondary_color: brandingData.secondary_color,
          font_family: brandingData.font_family
        })
      }

      setLoading(false)
    }

    loadOrganizationData()
  }, [session, supabase])

  const handleSaveOrganization = async () => {
    if (!organization?.id) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('organizations')
        .update(orgFormData)
        .eq('id', organization.id)

      if (error) throw error

      setOrganization({ ...organization, ...orgFormData } as Organization)
    } catch (error) {
      console.error('Error saving organization:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBranding = async () => {
    if (!session?.user?.organizationId) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('branding_settings')
        .upsert({
          organization_id: session.user.organizationId,
          ...brandingFormData
        })

      if (error) throw error

      setBranding({ ...branding, ...brandingFormData })
    } catch (error) {
      console.error('Error saving branding:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleOrgInputChange = (field: keyof Organization, value: string | number) => {
    setOrgFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBrandingInputChange = (field: keyof Branding, value: string) => {
    setBrandingFormData(prev => ({ ...prev, [field]: value }))
  }

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

  if (!organization) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Organization not found</h3>
          <p className="text-muted-foreground">Unable to load organization information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Organization</h1>
        <p className="text-muted-foreground">
          Manage your organization settings, branding, and team
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={orgFormData.name || ''}
                    onChange={(e) => handleOrgInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={orgFormData.slug || ''}
                    onChange={(e) => handleOrgInputChange('slug', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your organization..."
                  value={orgFormData.description || ''}
                  onChange={(e) => handleOrgInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      placeholder="https://..."
                      value={orgFormData.website || ''}
                      onChange={(e) => handleOrgInputChange('website', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={orgFormData.email || ''}
                      onChange={(e) => handleOrgInputChange('email', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={orgFormData.phone || ''}
                      onChange={(e) => handleOrgInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={orgFormData.industry || ''}
                    onValueChange={(value) => handleOrgInputChange('industry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="size">Organization Size</Label>
                  <Select
                    value={orgFormData.size || ''}
                    onValueChange={(value) => handleOrgInputChange('size', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    type="number"
                    placeholder="2024"
                    value={orgFormData.founded_year || ''}
                    onChange={(e) => handleOrgInputChange('founded_year', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <div className="space-y-3">
                  <Input
                    placeholder="Street Address"
                    value={orgFormData.address?.street || ''}
                    onChange={(e) => handleOrgInputChange('address', {
                      ...orgFormData.address,
                      street: e.target.value
                    })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="City"
                      value={orgFormData.address?.city || ''}
                      onChange={(e) => handleOrgInputChange('address', {
                        ...orgFormData.address,
                        city: e.target.value
                      })}
                    />
                    <Input
                      placeholder="State/Province"
                      value={orgFormData.address?.state || ''}
                      onChange={(e) => handleOrgInputChange('address', {
                        ...orgFormData.address,
                        state: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="ZIP/Postal Code"
                      value={orgFormData.address?.zip || ''}
                      onChange={(e) => handleOrgInputChange('address', {
                        ...orgFormData.address,
                        zip: e.target.value
                      })}
                    />
                    <Input
                      placeholder="Country"
                      value={orgFormData.address?.country || ''}
                      onChange={(e) => handleOrgInputChange('address', {
                        ...orgFormData.address,
                        country: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveOrganization} disabled={saving} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Logo</h4>
                    <p className="text-sm text-muted-foreground">Upload your organization logo</p>
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={brandingFormData.primary_color || '#000000'}
                        onChange={(e) => handleBrandingInputChange('primary_color', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={brandingFormData.primary_color || '#000000'}
                        onChange={(e) => handleBrandingInputChange('primary_color', e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={brandingFormData.secondary_color || '#ffffff'}
                        onChange={(e) => handleBrandingInputChange('secondary_color', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={brandingFormData.secondary_color || '#ffffff'}
                        onChange={(e) => handleBrandingInputChange('secondary_color', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font_family">Font Family</Label>
                  <Select
                    value={brandingFormData.font_family || 'Inter'}
                    onValueChange={(value) => handleBrandingInputChange('font_family', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Feature Toggles</h4>
                    <p className="text-sm text-muted-foreground">Enable or disable organization features</p>
                  </div>
                  <Button variant="outline">Manage Features</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Terminology Overrides</h4>
                    <p className="text-sm text-muted-foreground">Customize terminology for your organization</p>
                  </div>
                  <Button variant="outline">Manage Terms</Button>
                </div>
              </div>

              <Button onClick={handleSaveBranding} disabled={saving} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Branding'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Team Members</h4>
                  <p className="text-sm text-muted-foreground">Manage your organization's team</p>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-medium">Roles & Permissions</h5>
                      <p className="text-sm text-muted-foreground">Define team roles and access levels</p>
                    </div>
                  </div>
                  <Badge variant="secondary">3 roles</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Settings className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-medium">Departments</h5>
                      <p className="text-sm text-muted-foreground">Organize team by departments</p>
                    </div>
                  </div>
                  <Badge variant="secondary">5 departments</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-medium">Pending Invitations</h5>
                      <p className="text-sm text-muted-foreground">Track outstanding team invitations</p>
                    </div>
                  </div>
                  <Badge variant="outline">2 pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Require 2FA for all organization members</p>
                  </div>
                  <Badge variant="outline">Optional</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Session Management</h4>
                    <p className="text-sm text-muted-foreground">Control session duration and concurrent logins</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Data Retention</h4>
                    <p className="text-sm text-muted-foreground">Set policies for data retention and deletion</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Audit Logs</h4>
                    <p className="text-sm text-muted-foreground">Monitor and review organization activity</p>
                  </div>
                  <Button variant="outline">View Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
