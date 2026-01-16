'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Header } from '@/lib/design-system'
import Link from 'next/link'

export function OrganizationSignupClient() {
  const [organizationType, setOrganizationType] = useState('')
  const [teamSize, setTeamSize] = useState('')

  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header />

      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl heading-anton">Create Organization</h1>
            <p className="text-[--text-secondary] body-share-tech">Set up your team account and invite members</p>
          </div>

          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="heading-anton text-2xl">Organization Details</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">We&apos;ll verify your email after sign up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="text-[--text-secondary] body-share-tech">Organization Name</Label>
                  <Input id="orgName" type="text" placeholder="Your company or organization" className="h-11" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgType" className="text-[--text-secondary] body-share-tech">Organization Type</Label>
                  <Select value={organizationType} onValueChange={setOrganizationType}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business / Company</SelectItem>
                      <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                      <SelectItem value="school">School / Educational Institution</SelectItem>
                      <SelectItem value="government">Government Agency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName" className="text-[--text-secondary] body-share-tech">Admin Full Name</Label>
                    <Input id="adminName" type="text" placeholder="Jordan Doe" className="h-11" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail" className="text-[--text-secondary] body-share-tech">Admin Email</Label>
                    <Input id="adminEmail" type="email" placeholder="admin@company.com" className="h-11" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[--text-secondary] body-share-tech">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="h-11" required />
                  <p className="text-xs text-[--text-muted] body-share-tech">Use 8+ characters with numbers and symbols</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[--text-secondary] body-share-tech">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" className="h-11" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize" className="text-[--text-secondary] body-share-tech">Team Size</Label>
                  <Select value={teamSize} onValueChange={setTeamSize}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 members</SelectItem>
                      <SelectItem value="6-20">6-20 members</SelectItem>
                      <SelectItem value="21-50">21-50 members</SelectItem>
                      <SelectItem value="51-100">51-100 members</SelectItem>
                      <SelectItem value="100+">100+ members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 text-sm text-[--text-secondary] body-share-tech">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[--border-default] text-[--color-accent-primary] focus:ring-[--color-accent-primary]" required />
                    <span>
                      I agree to the{' '}
                      <Link href="/legal/terms" className="text-[--color-accent-primary] hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/legal/privacy" className="text-[--color-accent-primary] hover:underline">Privacy Policy</Link>
                      {' '}on behalf of my organization
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 text-sm text-[--text-secondary] body-share-tech">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[--border-default] text-[--color-accent-primary] focus:ring-[--color-accent-primary]" />
                    <span>Send me updates about enterprise features and team management tools</span>
                  </label>
                </div>

                <Button type="submit" className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5">
                  Create Organization
                </Button>
              </form>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-sm text-[--text-secondary] body-share-tech">
                  <div className="flex-1 h-px bg-[--border-default]" />
                  <span>or</span>
                  <div className="flex-1 h-px bg-[--border-default]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">Continue with Google Workspace</Button>
                  <Button variant="outline" className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">Continue with Microsoft Azure</Button>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-[--text-secondary] body-share-tech">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-[--color-accent-primary] hover:underline">Sign in</Link>
                  </p>
                  <p className="text-sm text-[--text-secondary] body-share-tech">
                    Looking to join as a{' '}
                    <Link href="/auth/signup/consumer" className="text-[--color-accent-primary] hover:underline">member</Link>
                    {' '}or{' '}
                    <Link href="/auth/signup/professional" className="text-[--color-accent-primary] hover:underline">professional</Link>
                    ?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[--border-default] bg-[--surface-default]/80 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur">
            <CardHeader>
              <CardTitle className="heading-anton text-xl">Organization Benefits</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">Tools built for teams</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[--text-secondary] body-share-tech">
                <li>• Centralized team management</li>
                <li>• Advanced analytics and reporting</li>
                <li>• Custom integrations and API access</li>
                <li>• Dedicated account management</li>
                <li>• Priority customer support</li>
                <li>• Bulk licensing and enterprise pricing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
