'use client'

import { useState } from 'react'
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Header } from '@/lib/design-system'
import { CheckCircle, User, Building2, Bell } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const steps = [
  { id: 'welcome', title: 'Welcome', icon: User },
  { id: 'profile', title: 'Profile', icon: User },
  { id: 'organization', title: 'Organization', icon: Building2 },
  { id: 'preferences', title: 'Preferences', icon: Bell },
  { id: 'complete', title: 'Complete', icon: CheckCircle },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Profile data
    bio: '',
    location: '',
    website: '',
    avatar: null,

    // Organization data
    joinOrganization: false,
    organizationName: '',
    organizationRole: '',

    // Preferences
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    theme: 'system',
    language: 'en',
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/home')
      } else {
        logger.error('Failed to complete onboarding')
      }
    } catch (error) {
      logger.error('Error completing onboarding', error)
    } finally {
      setIsLoading(false)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-semantic-success mx-auto"/>
              <h2 className="text-3xl font-display font-bold">Welcome to ATLVS + GVTEWAY!</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Let&apos;s get your account set up so you can start creating amazing experiences.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">Step 1</div>
                  <div className="text-muted-foreground">Complete your profile</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Step 2</div>
                  <div className="text-muted-foreground">Set up organization</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Step 3</div>
                  <div className="text-muted-foreground">Configure preferences</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 1: // Profile
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">
                Help others get to know you better
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  className="w-full px-3 py-2 border rounded-md resize-none"
                  rows={3}
                  placeholder="Tell us about yourself, your interests, or your experience..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}/>
                <p className="text-xs text-muted-foreground">
                  Share a bit about yourself (max 500 characters)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}/>
              </div>
            </div>
          </div>
        )

      case 2: // Organization
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold mb-2">Organization Setup</h2>
              <p className="text-muted-foreground">
                Connect with your team or create a new organization
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    id="join-existing"
                    name="org-choice"
                    checked={!formData.joinOrganization}
                    onChange={() => handleInputChange('joinOrganization', false)}
                    className="rounded"/>
                  <Label htmlFor="join-existing" className="cursor-pointer">
                    Join an existing organization
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    id="create-new"
                    name="org-choice"
                    checked={formData.joinOrganization}
                    onChange={() => handleInputChange('joinOrganization', true)}
                    className="rounded"/>
                  <Label htmlFor="create-new" className="cursor-pointer">
                    Create a new organization
                  </Label>
                </div>
              </div>

              {formData.joinOrganization ? (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      placeholder="Your Company Name"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationRole">Your Role</Label>
                    <Input
                      id="organizationRole"
                      placeholder="e.g., Founder, CEO, Manager"
                      value={formData.organizationRole}
                      onChange={(e) => handleInputChange('organizationRole', e.target.value)}/>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You can join or create organizations later from your dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 3: // Preferences
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold mb-2">Set Your Preferences</h2>
              <p className="text-muted-foreground">
                Customize your experience
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="cursor-pointer">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Input
                      type="checkbox"
                      id="email-notifications"
                      checked={formData.emailNotifications}
                      onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                      className="rounded"/>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="cursor-pointer">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Input
                      type="checkbox"
                      id="push-notifications"
                      checked={formData.pushNotifications}
                      onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                      className="rounded"/>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails" className="cursor-pointer">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                    </div>
                    <Input
                      type="checkbox"
                      id="marketing-emails"
                      checked={formData.marketingEmails}
                      onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                      className="rounded"/>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Appearance</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={formData.theme}
                      onValueChange={(value) => handleInputChange('theme', value)}
                    >
                      <SelectTrigger className="w-full px-3 py-2 border rounded-md mt-1">
                        <SelectValue placeholder="Select a theme"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => handleInputChange('language', value)}
                    >
                      <SelectTrigger className="w-full px-3 py-2 border rounded-md mt-1">
                        <SelectValue placeholder="Select a language"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4: // Complete
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-semantic-success mx-auto"/>
            <h2 className="text-3xl font-display font-bold">You&apos;re all set!</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your account is ready and you&apos;ve completed the initial setup.
              Let&apos;s start exploring what ATLVS + GVTEWAY can do for you.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Quick Start Guide</h3>
              <ul className="text-sm space-y-2 text-left">
                <li>• Complete your profile in settings</li>
                <li>• Explore destinations and experiences</li>
                <li>• Join or create an organization</li>
                <li>• Start planning your first event</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Onboarding */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep ? 'bg-accent-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <step.icon className="h-4 w-4"/>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-accent-primary' : 'bg-muted'
                    }`}/>
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="w-full"/>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {steps.map((step, index) => (
                <span key={step.id} className={index === currentStep ? 'font-medium' : ''}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardContent className="pt-6">
              {renderStepContent()}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Completing...' : 'Get Started'}
                  </Button>
                ) : (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
