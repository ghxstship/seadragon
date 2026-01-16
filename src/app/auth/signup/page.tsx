
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/lib/design-system'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationSlug: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: 'consumer' // Default to consumer signup
        }),
      })

      if (response.ok) {
        setSuccess(true)
        // Redirect to email verification after a delay
        setTimeout(() => {
          router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email))
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-[--color-accent-primary] mx-auto"/>
                  <h2 className="text-3xl leading-tight" style={{ fontFamily: 'Anton, var(--font-sans)' }}>Account Created!</h2>
                  <p className="text-[--text-secondary]" style={{ fontFamily: 'Share Tech, sans-serif' }}>
                    Please check your email for a verification link to complete your registration.
                  </p>
                  <Button asChild className="h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5">
                    <Link href="/auth/login">Continue to Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      {/* Header */}
      <Header/>

      {/* Signup Form */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl leading-tight heading-anton">Create Your Account</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Join the ATLVS + GVTEWAY community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="consumer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[--surface-hover]">
                  <TabsTrigger value="consumer" className="data-[state=active]:bg-[--surface-default] data-[state=active]:text-[--text-primary]">Join as Member</TabsTrigger>
                  <TabsTrigger value="professional" className="data-[state=active]:bg-[--surface-default] data-[state=active]:text-[--text-primary]">Join as Professional</TabsTrigger>
                </TabsList>

                <TabsContent value="consumer" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-[--text-secondary] body-share-tech">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-[--text-secondary] body-share-tech">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required/>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[--text-secondary] body-share-tech">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required/>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[--text-secondary] body-share-tech">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required/>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4"/>
                          ) : (
                            <Eye className="h-4 w-4"/>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm text-[--text-secondary] font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                          className="bg-[--surface-default] py-3 px-4 text-[--text-primary] placeholder:text-[--text-placeholder] focus:ring-[--color-accent-primary]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-[--text-secondary]" />
                          ) : (
                            <Eye className="h-4 w-4 text-[--text-secondary]" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center space-x-2 text-sm text-[--color-error] bg-[--color-error-light] p-3 rounded">
                        <AlertCircle className="h-4 w-4 text-[--color-error]" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-full bg-[--color-accent-primary] text-black shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="professional" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Organization Name */}
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="text-sm text-[--text-secondary] font-medium">Organization Name</Label>
                      <Input
                        id="organizationName"
                        type="text"
                        placeholder="Your Company LLC"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        className="bg-[--surface-default] py-3 px-4 text-[--text-primary] placeholder:text-[--text-placeholder] focus:ring-[--color-accent-primary]"
                      />
                      <p className="text-xs text-[--text-muted]">
                        Leave blank if joining an existing organization
                      </p>
                    </div>

                    {/* Organization Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="organizationSlug" className="text-sm text-[--text-secondary] font-medium">Organization Slug</Label>
                      <Input
                        id="organizationSlug"
                        type="text"
                        placeholder="your-company"
                        value={formData.organizationSlug}
                        onChange={(e) => handleInputChange('organizationSlug', e.target.value)}
                        className="bg-[--surface-default] py-3 px-4 text-[--text-primary] placeholder:text-[--text-placeholder] focus:ring-[--color-accent-primary]"
                      />
                      <p className="text-xs text-[--text-muted]">
                        Used for your organization's subdomain
                      </p>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm text-[--text-secondary] font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="bg-[--surface-default] py-3 px-4 text-[--text-primary] placeholder:text-[--text-placeholder] focus:ring-[--color-accent-primary]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm text-[--text-secondary] font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          className="bg-[--surface-default] py-3 px-4 text-[--text-primary] placeholder:text-[--text-placeholder] focus:ring-[--color-accent-primary]"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm text-[--text-secondary] font-medium">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="bg-[--surface-default] py-3 px-4 text-[--text-primary] placeholder:text-[--text-placeholder] focus:ring-[--color-accent-primary]"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm text-[--text-secondary] font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                          className="bg-[--surface-default] py-3 px-4 text-[--text-primary] placeholder:text-[--text-placeholder] focus:ring-[--color-accent-primary]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-[--text-secondary]" />
                          ) : (
                            <Eye className="h-4 w-4 text-[--text-secondary]" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm text-[--text-secondary] font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                          className="bg-[--surface-default] py-3 px-4 text-[--text-primary] placeholder:text-[--text-placeholder] focus:ring-[--color-accent-primary]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-[--text-secondary]" />
                          ) : (
                            <Eye className="h-4 w-4 text-[--text-secondary]" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center space-x-2 text-sm text-[--color-error] bg-[--color-error-light] p-3 rounded">
                        <AlertCircle className="h-4 w-4 text-[--color-error]" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Professional Account...' : 'Create Professional Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Links */}
              <div className="text-center space-y-2 pt-4 border-t border-[--border-default]">
                <p className="text-sm text-[--text-secondary]">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-[--color-accent-primary] hover:underline">
                    Sign in
                  </Link>
                </p>
                <Link
                  href="/legal/terms"
                  className="text-xs text-[--text-muted] hover:underline"
                >
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
