'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TravelPreferencesClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Travel Preferences</h1>
          <p className="text-neutral-600">Customize your travel planning and booking experience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Trip Planning</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Default Trip Duration</label>
                <Select defaultValue="1-2-weeks">
                  <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-5-days">3-5 days</SelectItem>
                    <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-months">1+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Travel Style</label>
                <div className="space-y-2">
                  {[
                    { label: "Adventure & Outdoor", defaultChecked: true },
                    { label: "Cultural Experiences", defaultChecked: true },
                    { label: "Relaxation & Wellness", defaultChecked: false },
                    { label: "Food & Culinary", defaultChecked: true },
                    { label: "Luxury & Comfort", defaultChecked: false },
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center">
                      <Input type="checkbox" className="mr-3" defaultChecked={item.defaultChecked} />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Budget Range</label>
                <Select defaultValue="2-500-5-000-per-person">
                  <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-000-2-500-per-person">$1,000 - $2,500 per person</SelectItem>
                    <SelectItem value="2-500-5-000-per-person">$2,500 - $5,000 per person</SelectItem>
                    <SelectItem value="5-000-10-000-per-person">$5,000 - $10,000 per person</SelectItem>
                    <SelectItem value="10-000-per-person">$10,000+ per person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Accommodation Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Hotel Type</label>
                {["Boutique & Unique", "Luxury Resorts", "Budget-Friendly", "Local Guesthouses"].map((label, idx) => (
                  <label key={idx} className="flex items-center">
                    <Input type="radio" name="hotel-type" className="mr-3" defaultChecked={idx === 0} />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Room Preferences</label>
                {[
                  { label: "Ocean/City View", defaultChecked: true },
                  { label: "Late Checkout", defaultChecked: false },
                  { label: "Quiet Room", defaultChecked: true },
                  { label: "High Floor", defaultChecked: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center">
                    <Input type="checkbox" className="mr-3" defaultChecked={item.defaultChecked} />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Transportation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Preferred Airline Class</label>
                <Select defaultValue="economy">
                  <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium-economy">Premium Economy</SelectItem>
                    <SelectItem value="business-class">Business Class</SelectItem>
                    <SelectItem value="first-class">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Seat Preferences</label>
                {["Window Seat", "Aisle Seat", "No Preference"].map((label, idx) => (
                  <label key={idx} className="flex items-center">
                    <Input type="radio" name="seat" className="mr-3" defaultChecked={idx === 0} />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Ground Transportation</label>
                {[
                  { label: "Airport Transfers", defaultChecked: true },
                  { label: "Car Rentals", defaultChecked: false },
                  { label: "Ride Sharing", defaultChecked: true },
                  { label: "Public Transportation", defaultChecked: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center">
                    <Input type="checkbox" className="mr-3" defaultChecked={item.defaultChecked} />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Dietary & Accessibility</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Dietary Restrictions</label>
                <Input
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="e.g., vegetarian, gluten-free, halal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Accessibility Requirements</label>
                {[
                  { label: "Wheelchair Accessible", defaultChecked: false },
                  { label: "Elevator/Lift Access", defaultChecked: true },
                  { label: "Step-free Entry", defaultChecked: false },
                  { label: "Service Animal Friendly", defaultChecked: false },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center">
                    <Input type="checkbox" className="mr-3" defaultChecked={item.defaultChecked} />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Health & Safety</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <Input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm">Prefer small group sizes</span>
                  </label>
                  <label className="flex items-center">
                    <Input type="checkbox" className="mr-3" />
                    <span className="text-sm">Mask-friendly experiences</span>
                  </label>
                  <label className="flex items-center">
                    <Input type="checkbox" className="mr-3" />
                    <span className="text-sm">Contactless check-in when available</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notifications</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <Input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-sm">Email me about price drops</span>
            </label>
            <label className="flex items-center">
              <Input type="checkbox" className="mr-3" />
              <span className="text-sm">Send alerts for new experiences in my favorite destinations</span>
            </label>
            <label className="flex items-center">
              <Input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-sm">Remind me about upcoming trips</span>
            </label>
          </div>
          <div className="mt-6 flex gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Save Preferences
            </Button>
            <Button variant="outline" className="px-4 py-2 rounded-md">
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
