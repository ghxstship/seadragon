
'use client'

import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/lib/design-system'
import { User, Shield, CreditCard, Bell, Eye, Palette, Link as LinkIcon, Download, Trash2, AlertTriangle } from 'lucide-react'
import {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  updateUserSecurity,
  exportUserData,
  deleteUserAccount,
  type UserProfile,
  type UserPreferences,
  type UserSecurity
} from '@/lib/services/userService'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const [isLoading, setIsLoading] = useState(true)

  // User data - fetched from API
  const [userData, setUserData] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone: '',
    bio: '',
    location: '',
    website: ''
  })

  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    theme: 'system',
    language: 'en',
    timezone: 'America/New_York'
  })

  const [security, setSecurity] = useState<UserSecurity>({
    mfaEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true
  })

  // Fetch user settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        const data = await getUserProfile()
        const user = data.user || {}
        setUserData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          username: user.username || '',
          phone: user.phone || '',
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || ''
        })
        if (user.preferences) {
          setPreferences(user.preferences)
        }
        if (user.security) {
          setSecurity(user.security)
        }
      } catch (error) {
        logger.error('Error fetching settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleUserDataChange = (field: string, value: string) => {
    const serviceField = field === 'firstName' ? 'first_name' : field === 'lastName' ? 'last_name' : field
    setUserData(prev => ({ ...prev, [serviceField]: value }))
  }

  const handlePreferenceChange = (field: string, value: string | boolean | number) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: string, value: string | boolean | number) => {
    setSecurity(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(userData)
      alert('Profile updated successfully!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save profile')
    }
  }

  const handleSavePreferences = async () => {
    try {
      await updateUserPreferences(preferences)
      alert('Preferences updated successfully!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save preferences')
    }
  }

  const handleSaveSecurity = async () => {
    try {
      await updateUserSecurity(security)
      alert('Security settings updated successfully!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save security settings')
    }
  }

  const handleExportData = async () => {
    try {
      await exportUserData()
      alert('Data export request submitted. You will receive an email when ready.')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to request data export')
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUserAccount()
        alert('Account deletion request submitted. You will receive a confirmation email.')
        window.location.href = '/auth/login'
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete account')
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2"/>
              Account
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2"/>
              Security
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2"/>
              Billing
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Bell className="h-4 w-4 mr-2"/>
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userData.first_name}
                      onChange={(e) => handleUserDataChange('firstName', e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userData.last_name}
                      onChange={(e) => handleUserDataChange('lastName', e.target.value)}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleUserDataChange('email', e.target.value)}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={userData.username}
                    onChange={(e) => handleUserDataChange('username', e.target.value)}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => handleUserDataChange('phone', e.target.value)}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    className="w-full px-3 py-2 border rounded-md resize-none"
                    rows={3}
                    value={userData.bio}
                    onChange={(e) => handleUserDataChange('bio', e.target.value)}/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userData.location}
                      onChange={(e) => handleUserDataChange('location', e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={userData.website}
                      onChange={(e) => handleUserDataChange('website', e.target.value)}/>
                  </div>
                </div>

                <Button onClick={handleSaveProfile}>
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            {/* Data Export & Account Deletion */}
            <Card>
              <CardHeader>
                <CardTitle>Data & Account</CardTitle>
                <CardDescription>
                  Manage your data and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-muted-foreground"/>
                    <div>
                      <h3 className="font-medium">Export Your Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of all your data
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    Export Data
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-destructive"/>
                    <div>
                      <h3 className="font-medium text-destructive">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Change */}
                <div className="space-y-4">
                  <h3 className="font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">
                        {security.mfaEnabled ? 'Enabled' : 'Add an extra layer of security'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={security.mfaEnabled}
                        onCheckedChange={(checked) => handleSecurityChange('mfaEnabled', checked)}/>
                      <Button variant="outline" size="sm">
                        {security.mfaEnabled ? 'Configure' : 'Set Up'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Session Management */}
                <div className="space-y-4">
                  <h3 className="font-medium">Session Management</h3>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Auto-logout after (minutes)</Label>
                    <Select
                      value={security.sessionTimeout.toString()}
                      onValueChange={(value) => handleSecurityChange('sessionTimeout', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginAlerts">Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified of new sign-ins to your account
                      </p>
                    </div>
                    <Switch
                      id="loginAlerts"
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => handleSecurityChange('loginAlerts', checked)}/>
                  </div>
                </div>

                <Button onClick={handleSaveSecurity}>
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Billing & Subscription</h3>
                <p className="text-muted-foreground mb-4">
                  Manage your subscription and billing information
                </p>
                <Button>
                  View Billing Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}/>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}/>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}/>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the platform looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => handlePreferenceChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => handlePreferenceChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => handlePreferenceChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
