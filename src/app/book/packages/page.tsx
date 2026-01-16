
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Travel Packages | ATLVS + GVTEWAY',
  description: 'Book all-inclusive travel packages with flights, hotels, and experiences. Save money and time with our curated vacation deals.',
}

export default function PackagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Travel Packages</h1>
          <p className="text-lg text-neutral-600">All-inclusive vacation packages with everything you need for the perfect trip</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Save Time & Money</h2>
            <p className="text-xl mb-6">Bundle flights, hotels, and experiences for unbeatable deals</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Up to 30% Savings</h3>
                <p className="text-sm">Compared to booking separately</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block">⏰</span>
                <h3 className="font-semibold">Save Time</h3>
                <p className="text-sm">Everything arranged for you</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block">️</span>
                <h3 className="font-semibold">Peace of Mind</h3>
                <p className="text-sm">24/7 support and guarantees</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Find Your Perfect Package</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Destination</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="caribbean">Caribbean</SelectItem>
                  <SelectItem value="mexico">Mexico</SelectItem>
                  <SelectItem value="hawaii">Hawaii</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Departure Month</label>
              <Select defaultValue="any">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Month</SelectItem>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Duration</label>
              <Select defaultValue="any">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Duration</SelectItem>
                  <SelectItem value="3-4">3-4 Days</SelectItem>
                  <SelectItem value="5-7">5-7 Days</SelectItem>
                  <SelectItem value="8-10">8-10 Days</SelectItem>
                  <SelectItem value="11-14">11-14 Days</SelectItem>
                  <SelectItem value="15+">15+ Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Budget per Person</label>
              <Select defaultValue="any">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Budget</SelectItem>
                  <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                  <SelectItem value="2001-3000">$2,001 - $3,000</SelectItem>
                  <SelectItem value="3001-4000">$3,001 - $4,000</SelectItem>
                  <SelectItem value="4001-5000">$4,001 - $5,000</SelectItem>
                  <SelectItem value="5000+">$5,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                All-inclusive resorts
              </label>
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Family-friendly
              </label>
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Luxury packages
              </label>
            </div>
            <Button className="bg-accent-primary text-primary-foreground py-2 px-6 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Search Packages
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Popular Package Deals</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Cancun All-Inclusive Resort</h3>
                  <span className="bg-semantic-success/10 text-green-800 text-sm px-2 py-1 rounded">Save $450</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">7 nights at 5-star resort with flights from NYC</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-accent-primary">From $1,299</span>
                  <span className="text-sm text-neutral-500">per person</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Rome & Florence Cultural Tour</h3>
                  <span className="bg-semantic-success/10 text-green-800 text-sm px-2 py-1 rounded">Save $320</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">8 days with flights, hotels, and guided tours</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-accent-primary">From $2,199</span>
                  <span className="text-sm text-neutral-500">per person</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Tokyo Adventure Package</h3>
                  <span className="bg-semantic-success/10 text-green-800 text-sm px-2 py-1 rounded">Save $280</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">6 nights with flights and city experiences</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-accent-primary">From $1,899</span>
                  <span className="text-sm text-neutral-500">per person</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Package Types</h2>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">All-Inclusive Resorts</h3>
                <p className="text-sm text-neutral-600">Flights, resort stay, meals, and drinks included</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">City & Cultural Tours</h3>
                <p className="text-sm text-neutral-600">Explore multiple cities with guided experiences</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Adventure Packages</h3>
                <p className="text-sm text-neutral-600">Thrilling activities and outdoor adventures</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <h3 className="font-medium text-neutral-900 mb-2">Luxury Escapes</h3>
                <p className="text-sm text-neutral-600">Premium accommodations and VIP experiences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">What&#39;s Included in Our Packages</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Round-trip Flights</h3>
              <p className="text-sm text-neutral-600">Economy or premium economy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Hotel Accommodations</h3>
              <p className="text-sm text-neutral-600">Handpicked properties</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Meals & Dining</h3>
              <p className="text-sm text-neutral-600">Breakfast and select meals</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Experiences</h3>
              <p className="text-sm text-neutral-600">Tours and activities included</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Transportation</h3>
              <p className="text-sm text-neutral-600">Airport transfers included</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-neutral-600">Travel assistance anytime</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Member Perks</h3>
              <p className="text-sm text-neutral-600">Exclusive benefits for members</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Mobile App</h3>
              <p className="text-sm text-neutral-600">Manage your trip on the go</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Booking Policies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Payment & Deposits</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Low deposit to secure booking</li>
                <li>• Full payment due 60 days before travel</li>
                <li>• Flexible payment plans available</li>
                <li>• All major credit cards accepted</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Cancellation Protection</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Free cancellation up to 30 days</li>
                <li>• Trip protection insurance included</li>
                <li>• Rebooking options available</li>
                <li>• 24/7 emergency assistance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Travel Insurance</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Medical emergency coverage</li>
                <li>• Trip cancellation protection</li>
                <li>• Baggage loss compensation</li>
                <li>• Travel delay benefits</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Group Bookings</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Special group rates available</li>
                <li>• Dedicated group coordinator</li>
                <li>• Customized itineraries</li>
                <li>• Bulk booking discounts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Why Choose Our Packages?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-purple-900 mb-1">Best Value</h3>
              <p className="text-sm text-purple-800">Save up to 30% vs booking separately</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">⏰</span>
              </div>
              <h3 className="font-medium text-purple-900 mb-1">Time Saver</h3>
              <p className="text-sm text-purple-800">Everything arranged for you</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">️</span>
              </div>
              <h3 className="font-medium text-purple-900 mb-1">Peace of Mind</h3>
              <p className="text-sm text-purple-800">Full support and protection</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="font-medium text-purple-900 mb-1">Expert Curated</h3>
              <p className="text-sm text-purple-800">Handpicked by travel experts</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Book Your Dream Vacation?</h2>
          <p className="text-neutral-600 mb-6">Let us handle all the details so you can focus on making memories</p>
          <div className="flex justify-center gap-4">
            <a href="/contact" className="bg-accent-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Get Package Quote
            </a>
            <a href="/memberships" className="bg-background text-accent-primary border border-purple-600 px-6 py-3 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
              Become a Member
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
