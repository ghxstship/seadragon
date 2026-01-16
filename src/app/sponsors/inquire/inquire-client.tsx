'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function InquireClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Sponsorship Inquiry</h1>
          <p className="text-lg text-neutral-600">Tell us about your brand and sponsorship goals</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name
                </label>
                <Input id="firstName" required />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name
                </label>
                <Input id="lastName" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                  Company Name
                </label>
                <Input id="company" required />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                  Job Title
                </label>
                <Input id="title" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <Input id="email" type="email" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <Input id="phone" type="tel" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-neutral-700 mb-2">
                  Company Size
                </label>
                <Select defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                    <SelectItem value="small">Small (11-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                    <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-neutral-700 mb-2">
                  Industry
                </label>
                <Select defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel & Hospitality</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail & eCommerce</SelectItem>
                    <SelectItem value="media">Media & Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-neutral-700 mb-2">
                  Budget Range
                </label>
                <Select defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10k-25k">$10k - $25k</SelectItem>
                    <SelectItem value="25k-50k">$25k - $50k</SelectItem>
                    <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                    <SelectItem value="100k+">$100k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-neutral-700 mb-2">
                  Desired Timeline
                </label>
                <Select defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (0-1 month)</SelectItem>
                    <SelectItem value="short-term">Short-term (1-3 months)</SelectItem>
                    <SelectItem value="mid-term">Mid-term (3-6 months)</SelectItem>
                    <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-neutral-700 mb-2">
                Sponsorship Goals
              </label>
              <Textarea id="goals" rows={4} placeholder="Brand awareness, lead generation, co-marketing, etc." />
            </div>

            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-neutral-700 mb-2">
                Target Audience
              </label>
              <Textarea id="audience" rows={3} placeholder="Demographics, regions, interests" />
            </div>

            <div>
              <label htmlFor="additional" className="block text-sm font-medium text-neutral-700 mb-2">
                Additional Details
              </label>
              <Textarea id="additional" rows={4} placeholder="Key dates, deliverables, KPIs, or specific requests" />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Submit Inquiry
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
