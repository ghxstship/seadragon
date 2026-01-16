
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Book Your Travel | ATLVS + GVTEWAY',
  description: 'Book flights, hotels, experiences, and travel packages with ATLVS + GVTEWAY. Secure, easy, and reliable bookings.',
}

export default function BookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Book Your Perfect Trip</h1>
          <p className="text-lg text-neutral-600">Flights, hotels, experiences, and packages - all in one place</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Your Journey</h2>
            <p className="text-xl mb-6">Comprehensive booking solutions with 24/7 support and best price guarantee</p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Flights</h3>
                <p className="text-sm">Best deals on flights worldwide</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Save Time</h3>
                <p className="text-sm">Everything arranged for you</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Experiences</h3>
                <p className="text-sm">Unique activities and tours</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Packages</h3>
                <p className="text-sm">All-inclusive travel deals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <a href="/book/flights" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block">️</span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Book Flights</h3>
              <p className="text-neutral-600">Find and book the best flight deals</p>
            </div>
          </a>

          <a href="/book/hotels" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Book Hotels</h3>
              <p className="text-neutral-600">Reserve accommodations worldwide</p>
            </div>
          </a>

          <a href="/book/experiences" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Book Experiences</h3>
              <p className="text-neutral-600">Reserve tours and activities</p>
            </div>
          </a>

          <a href="/book/packages" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Travel Packages</h3>
              <p className="text-neutral-600">All-inclusive vacation packages</p>
            </div>
          </a>

          <a href="/book/transfers" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Airport Transfers</h3>
              <p className="text-neutral-600">Ground transportation services</p>
            </div>
          </a>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <span className="text-4xl mb-4 block"></span>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">AI Trip Planner</h3>
            <p className="text-neutral-600 mb-4">Let AI create your perfect itinerary</p>
            <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Plan My Trip
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Why Book With Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Best Price Guarantee</h3>
              <p className="text-sm text-neutral-600">Find a lower price and we&#39;ll match it</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Secure Booking</h3>
              <p className="text-sm text-neutral-600">SSL encryption and secure payment processing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-neutral-600">Round-the-clock customer assistance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Free Cancellations</h3>
              <p className="text-sm text-neutral-600">Flexible booking with easy changes</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Booking Tools</h2>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Flight + Hotel Bundles</h3>
                <p className="text-sm text-neutral-600">Save up to 30% by booking flights and hotels together</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Last-Minute Deals</h3>
                <p className="text-sm text-neutral-600">Flash sales on flights, hotels, and experiences</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Group Bookings</h3>
                <p className="text-sm text-neutral-600">Special rates for groups of 10 or more</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Corporate Travel</h3>
                <p className="text-sm text-neutral-600">Business travel solutions and expense management</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Popular Destinations</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors cursor-pointer">
                <span className="text-2xl mb-2 block">🇯🇵</span>
                <h3 className="font-medium text-neutral-900 text-sm">Tokyo</h3>
                <p className="text-xs text-neutral-600">From $599</p>
              </div>
              <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors cursor-pointer">
                <span className="text-2xl mb-2 block">🇫🇷</span>
                <h3 className="font-medium text-neutral-900 text-sm">Paris</h3>
                <p className="text-xs text-neutral-600">From $699</p>
              </div>
              <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors cursor-pointer">
                <span className="text-2xl mb-2 block">🇹🇭</span>
                <h3 className="font-medium text-neutral-900 text-sm">Bangkok</h3>
                <p className="text-xs text-neutral-600">From $449</p>
              </div>
              <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors cursor-pointer">
                <span className="text-2xl mb-2 block">🇺🇸</span>
                <h3 className="font-medium text-neutral-900 text-sm">New York</h3>
                <p className="text-xs text-neutral-600">From $349</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Membership Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3"></span>
                <h3 className="font-medium text-neutral-900">Priority Booking</h3>
              </div>
              <p className="text-sm text-neutral-600">Skip the line and book popular experiences first</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3"></span>
                <h3 className="font-medium text-neutral-900">Exclusive Discounts</h3>
              </div>
              <p className="text-sm text-neutral-600">Up to 20% off flights, hotels, and experiences</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3"></span>
                <h3 className="font-medium text-neutral-900">Travel Credits</h3>
              </div>
              <p className="text-sm text-neutral-600">$500 annual travel credit for bookings</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <a href="/memberships" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Join Membership
            </a>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Book Your Trip?</h2>
          <p className="text-neutral-600 mb-6">Start your journey with our secure and easy booking system</p>
          <div className="flex justify-center gap-4">
            <a href="/travel/planning" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Plan & Book
            </a>
            <a href="/contact" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Need Help?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
