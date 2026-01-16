
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Book Hotels | ATLVS + GVTEWAY',
  description: 'Find and book hotels worldwide with the best rates and amenities. Compare options and reserve your perfect stay.',
}

export default function HotelsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Book Your Hotel</h1>
          <p className="text-lg text-neutral-600">Find the perfect accommodation for your stay</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Hotel Search</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Destination</label>
              <Input
                type="text"
                placeholder="City, hotel, or landmark"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Check-in</label>
              <Input
                type="date"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Check-out</label>
              <Input
                type="date"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Guests</label>
              <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectItem value="1-guest">1 Guest</SelectItem>
                <SelectItem value="2-guests">2 Guests</SelectItem>
                <SelectItem value="1-guest-1-room">1 Guest, 1 Room</SelectItem>
                <SelectItem value="2-guests-1-room">2 Guests, 1 Room</SelectItem>
                <SelectItem value="family-2-adults-2-children">Family (2 Adults, 2 Children)</SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Free cancellation
              </label>
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Breakfast included
              </label>
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Pool available
              </label>
            </div>
            <Button className="bg-accent-secondary text-primary-foreground py-2 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Search Hotels
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Popular Destinations</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-900">Paris, France</span>
                  <p className="text-sm text-neutral-600">From $149/night</p>
                </div>
                <span className="text-accent-secondary">→</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-900">Tokyo, Japan</span>
                  <p className="text-sm text-neutral-600">From $89/night</p>
                </div>
                <span className="text-accent-secondary">→</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-900">New York City, USA</span>
                  <p className="text-sm text-neutral-600">From $199/night</p>
                </div>
                <span className="text-accent-secondary">→</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-900">Bali, Indonesia</span>
                  <p className="text-sm text-neutral-600">From $75/night</p>
                </div>
                <span className="text-accent-secondary">→</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Hotel Categories</h2>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Luxury Hotels</h3>
                <p className="text-sm text-neutral-600">5-star properties with premium amenities</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Boutique Hotels</h3>
                <p className="text-sm text-neutral-600">Unique, stylish accommodations</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Budget Options</h3>
                <p className="text-sm text-neutral-600">Affordable stays without compromising comfort</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Vacation Rentals</h3>
                <p className="text-sm text-neutral-600">Apartments and homes for extended stays</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Hotel Amenities</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Swimming Pool</h3>
              <p className="text-sm text-neutral-600">Indoor/outdoor pools</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Restaurant</h3>
              <p className="text-sm text-neutral-600">On-site dining options</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Fitness Center</h3>
              <p className="text-sm text-neutral-600">Gym and wellness facilities</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Free Parking</h3>
              <p className="text-sm text-neutral-600">Complimentary parking</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-red-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Free WiFi</h3>
              <p className="text-sm text-neutral-600">High-speed internet</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-teal-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Pet Friendly</h3>
              <p className="text-sm text-neutral-600">Allows pets with conditions</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Accessible</h3>
              <p className="text-sm text-neutral-600">ADA compliant facilities</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-pink-300 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Beach Access</h3>
              <p className="text-sm text-neutral-600">Direct beach access</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Booking Policies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Cancellation</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Free cancellation up to 24 hours</li>
                <li>• Flexible rates allow changes</li>
                <li>• Non-refundable rates available</li>
                <li>• Contact hotel for modifications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Check-in/Check-out</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Standard check-in: 3:00 PM</li>
                <li>• Check-out: 11:00 AM</li>
                <li>• Early check-in may be available</li>
                <li>• Late check-out for a fee</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Payment</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Credit cards accepted</li>
                <li>• Pay now or at hotel</li>
                <li>• Currency conversion may apply</li>
                <li>• Additional fees may apply</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Additional Information</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Age restrictions may apply</li>
                <li>• Extra beds available</li>
                <li>• Smoking policies vary</li>
                <li>• Accessibility features</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Hotel Booking Tips</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Book Early</h3>
              <p className="text-sm text-blue-800">Best rates for advance bookings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Read Reviews</h3>
              <p className="text-sm text-blue-800">Check guest experiences</p>
            </div>
            <div className="text-center">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl"></span>
                </div>
                <h3 className="font-medium text-blue-900 mb-1">Location Matters</h3>
                <p className="text-sm text-blue-800">Consider proximity to attractions</p>
              </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Compare Prices</h3>
              <p className="text-sm text-blue-800">Use our comparison tools</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Need Help Finding a Hotel?</h2>
          <p className="text-neutral-600 mb-6">Our hotel experts can help you find the perfect accommodation</p>
          <div className="flex justify-center gap-4">
            <a href="/contact/support" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Get Hotel Help
            </a>
            <a href="/book/packages" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Book Package Deal
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
