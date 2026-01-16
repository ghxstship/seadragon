'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function CertificationsAddClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Add Certification</h1>
          <p className="text-neutral-600">Showcase your professional qualifications</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="certificationName" className="block text-sm font-medium text-neutral-700 mb-2">
                Certification Name
              </label>
              <Input
                type="text"
                id="certificationName"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="e.g., Certified Professional Photographer"
                required
              />
            </div>

            <div>
              <label htmlFor="issuingOrganization" className="block text-sm font-medium text-neutral-700 mb-2">
                Issuing Organization
              </label>
              <Input
                type="text"
                id="issuingOrganization"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="e.g., Professional Photographers of America"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-neutral-700 mb-2">
                  Issue Date
                </label>
                <Input
                  type="date"
                  id="issueDate"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <Input
                  type="date"
                  id="expiryDate"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="Leave blank if lifetime"
                />
              </div>
            </div>

            <div>
              <label htmlFor="certificationNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                Certification Number/ID (Optional)
              </label>
              <Input
                type="text"
                id="certificationNumber"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="e.g., CPP123456"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Description (Optional)
              </label>
              <Textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Brief description of what this certification covers..."/>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Upload Certificate (Optional)
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="certificate-upload"
                />
                <label htmlFor="certificate-upload" className="cursor-pointer">
                  <div className="text-4xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600 mb-1">Click to upload certificate</p>
                  <p className="text-sm text-neutral-500">PNG, JPG, PDF up to 5MB</p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Verification Status
              </label>
              <label className="flex items-center">
                <Input type="radio" name="verification" className="mr-3" defaultChecked />
                <div>
                  <div className="font-medium text-sm">Self-Declared</div>
                  <div className="text-xs text-neutral-600">I certify this information is accurate</div>
                </div>
              </label>
              <label className="flex items-center">
                <Input type="radio" name="verification" className="mr-3" />
                <div>
                  <div className="font-medium text-sm">Verified</div>
                  <div className="text-xs text-neutral-600">Upload official verification document</div>
                </div>
              </label>
            </div>

            <div className="flex items-center">
              <Input type="checkbox" id="publicDisplay" className="mr-3" defaultChecked />
              <label htmlFor="publicDisplay" className="text-sm">
                Display this certification on my public profile
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Add Certification
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Certification Tips</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Include the full official name of the certification</li>
            <li>• Double-check the issuing organization name</li>
            <li>• Upload a clear scan or photo of your certificate</li>
            <li>• Keep certification numbers for easy verification</li>
            <li>• Update expiry dates to avoid lapsed certifications</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            <a href="/home/professional/certifications" className="text-accent-secondary hover:text-blue-800">
              ← Back to certifications
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
