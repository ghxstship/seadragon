'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OrganizationSignupClient() {
  const [organizationType, setOrganizationType] = useState('')
  const [teamSize, setTeamSize] = useState('')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Create Organization</h1>
          <p className="text-neutral-600">Set up your team account</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-neutral-700 mb-2">
                Organization Name
              </label>
              <Input
                type="text"
                id="orgName"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your company or organization name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="orgType" className="block text-sm font-medium text-neutral-700 mb-2">
                Organization Type
              </label>
              <Select
                value={organizationType}
                onValueChange={setOrganizationType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business/Company</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                  <SelectItem value="school">School/Educational Institution</SelectItem>
                  <SelectItem value="government">Government Agency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-neutral-700 mb-2">
                Admin Email Address
              </label>
              <Input
                type="email"
                id="adminEmail"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="admin@yourcompany.com"
                required
              />
            </div>

            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-neutral-700 mb-2">
                Admin Full Name
              </label>
              <Input
                type="text"
                id="adminName"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                Must be at least 8 characters with numbers and symbols
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="teamSize" className="block text-sm font-medium text-neutral-700 mb-2">
                Team Size
              </label>
              <Select
                value={teamSize}
                onValueChange={setTeamSize}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team size"/>
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

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="terms"
                className="mt-1 mr-3"
                required
              />
              <label htmlFor="terms" className="text-sm text-neutral-600">
                I agree to the{' '}
                <a href="/legal/terms" className="text-accent-primary hover:text-purple-800">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="/legal/privacy" className="text-accent-primary hover:text-purple-800">
                  Privacy Policy
                </a>
                {' '}on behalf of my organization
              </label>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="marketing"
                className="mt-1 mr-3"
              />
              <label htmlFor="marketing" className="text-sm text-neutral-600">
                Send me updates about enterprise features and team management tools
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Create Organization
            </Button>
          </form>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center">
            <div className="flex-1 border-t border-neutral-300"></div>
            <span className="px-4 text-sm text-neutral-500">or</span>
            <div className="flex-1 border-t border-neutral-300"></div>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Continue with Google Workspace
            </Button>
            <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Continue with Microsoft Azure
            </Button>
          </div>

          <p className="text-sm text-neutral-600">
            Already have an account?{' '}
            <a href="/auth/login" className="text-accent-secondary hover:text-blue-800">
              Sign in
            </a>
          </p>

          <p className="text-sm text-neutral-600">
            Looking to join as a{' '}
            <a href="/auth/signup/consumer" className="text-semantic-success hover:text-green-800">
              member
            </a>
            {' '}or{' '}
            <a href="/auth/signup/professional" className="text-accent-primary hover:text-purple-800">
              professional
            </a>
            ?
          </p>
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-medium text-purple-900 mb-2">Organization Benefits</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Centralized team management</li>
            <li>• Advanced analytics and reporting</li>
            <li>• Custom integrations and API access</li>
            <li>• Dedicated account management</li>
            <li>• Priority customer support</li>
            <li>• Bulk licensing and enterprise pricing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
