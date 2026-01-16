
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function OnboardingOrganizationDetailsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Organization Details</h1>
          <p className="text-neutral-600">Complete your organization setup</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Organization Description
              </label>
              <Textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description of your organization..."/>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                Website
              </label>
              <Input
                type="url"
                id="website"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://yourcompany.com"/>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
                Headquarters Address
              </label>
              <Input
                type="text"
                id="address"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Street address"/>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  type="text"
                  placeholder="City"
                  className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                <Input
                  type="text"
                  placeholder="ZIP/Postal Code"
                  className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                Business Phone
              </label>
              <Input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+1 (555) 123-4567"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Organization Logo
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"/>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="text-3xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600">Upload organization logo</p>
                  <p className="text-sm text-neutral-500">PNG, JPG up to 2MB</p>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Save & Continue
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Next Steps</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Invite team members to your organization</li>
            <li>• Set up billing and subscription preferences</li>
            <li>• Configure organization settings and permissions</li>
            <li>• Start collaborating on travel planning</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
