'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OnboardingOrganizationCreateClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">️</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Create Organization</h1>
          <p className="text-neutral-600">Set up your team workspace</p>
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
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                placeholder="Your company name"
                required
              />
            </div>

            <div>
              <label htmlFor="orgSlug" className="block text-sm font-medium text-neutral-700 mb-2">
                Organization URL
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-neutral-300 bg-gray-50 text-neutral-500 text-sm rounded-l-md">
                  atlvs.com/
                </span>
                <Input
                  type="text"
                  id="orgSlug"
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  placeholder="your-org"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="orgType" className="block text-sm font-medium text-neutral-700 mb-2">
                Organization Type
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business/Company</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="education">Educational Institution</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-neutral-700 mb-2">
                Industry
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="travel">Travel &amp; Hospitality</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="size" className="block text-sm font-medium text-neutral-700 mb-2">
                Organization Size
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select organization size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2"
            >
              Create Organization
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Your organization workspace will be created</li>
            <li>• You&apos;ll become the organization admin</li>
            <li>• You can invite team members</li>
            <li>• Set up billing and preferences</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
