
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'Plan Your Trip | ATLVS + GVTEWAY',
  description: 'Get personalized travel recommendations and create your perfect itinerary.',
}

export default function TravelPlanningPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Plan Your Trip</h1>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Tell us about your dream trip</h2>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-neutral-700 mb-2">
                  Destination
                </label>
                <Input
                  type="text"
                  id="destination"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="Where do you want to go?"/>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-neutral-700 mb-2">
                  Trip Duration
                </label>
                <Select
                  id="duration"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <SelectItem value="1-3-days">1-3 days</SelectItem>
                  <SelectItem value="4-7-days">4-7 days</SelectItem>
                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                  <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                  <SelectItem value="1-months">1+ months</SelectItem>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="travelers" className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Travelers
                </label>
                <Select
                  id="travelers"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <SelectItem value="1-person">1 person</SelectItem>
                  <SelectItem value="2-people">2 people</SelectItem>
                  <SelectItem value="3-5-people">3-5 people</SelectItem>
                  <SelectItem value="6-10-people">6-10 people</SelectItem>
                  <SelectItem value="10-people">10+ people</SelectItem>
                </Select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-neutral-700 mb-2">
                  Budget Range
                </label>
                <Select
                  id="budget"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <SelectItem value="budget">Budget ($)</SelectItem>
                  <SelectItem value="mid-range">Mid-range ($)</SelectItem>
                  <SelectItem value="luxury">Luxury ($$)</SelectItem>
                  <SelectItem value="ultra-luxury">Ultra-luxury ($$)</SelectItem>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Interests
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Adventure', 'Culture', 'Food & Wine', 'Nature', 'Nightlife', 'Relaxation', 'Shopping', 'Sports'].map((interest) => (
                  <label key={interest} className="flex items-center">
                    <Input
                      type="checkbox"
                      className="rounded border-neutral-300 text-accent-secondary focus:ring-accent-primary"/>
                    <span className="ml-2 text-sm text-neutral-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="special-requirements" className="block text-sm font-medium text-neutral-700 mb-2">
                Special Requirements
              </label>
              <Textarea
                id="special-requirements"
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Accessibility needs, dietary restrictions, etc."/>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
            >
              Get Personalized Recommendations
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
