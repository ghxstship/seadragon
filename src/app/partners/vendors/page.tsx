
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Vendor Partners | ATLVS + GVTEWAY',
  description: 'Connect with our trusted vendor partners for exceptional travel services and experiences.',
}

export default function VendorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Vendor Partners</h1>
          <p className="text-lg text-neutral-600">Trusted service providers delivering exceptional travel experiences</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Partner With Us</h2>
            <p className="text-xl mb-6">Join our network of premium service providers</p>
            <Button className="bg-background text-accent-secondary px-6 py-3 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 font-semibold">
              Become a Vendor Partner
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Hospitality</h3>
            <p className="text-neutral-600 mb-4">Hotels, resorts, and accommodations worldwide</p>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>• Luxury beachfront resorts</p>
              <p>• Boutique urban hotels</p>
              <p>• Eco-friendly lodges</p>
              <p>• Vacation rentals</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Dining</h3>
            <p className="text-neutral-600 mb-4">Restaurants, food tours, and culinary experiences</p>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>• Michelin-starred restaurants</p>
              <p>• Local food markets</p>
              <p>• Cooking class venues</p>
              <p>• Wine tasting facilities</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Transportation</h3>
            <p className="text-neutral-600 mb-4">Ground transport, tours, and mobility services</p>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>• Private car services</p>
              <p>• Guided tours</p>
              <p>• Airport transfers</p>
              <p>• Adventure transport</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Experiences</h3>
            <p className="text-neutral-600 mb-4">Activities, tours, and unique experiences</p>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>• Adventure activities</p>
              <p>• Cultural experiences</p>
              <p>• Wellness retreats</p>
              <p>• Private events</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Equipment</h3>
            <p className="text-neutral-600 mb-4">Rental gear and adventure equipment</p>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>• Outdoor gear rentals</p>
              <p>• Photography equipment</p>
              <p>• Water sports gear</p>
              <p>• Camping supplies</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Insurance</h3>
            <p className="text-neutral-600 mb-4">Travel protection and insurance services</p>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>• Trip cancellation coverage</p>
              <p>• Medical emergency insurance</p>
              <p>• Baggage protection</p>
              <p>• Travel delay coverage</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Featured Vendor Partners</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Paradise Resort Collection",
                category: "Hospitality",
                description: "A curated collection of luxury beachfront resorts offering unparalleled service and breathtaking views.",
                benefits: ["Priority booking", "Exclusive rates", "Personal concierge", "Complimentary upgrades"],
                logo: "️"
              },
              {
                name: "Global Adventure Tours",
                category: "Experiences",
                description: "Specialized in creating unforgettable adventure experiences with expert local guides.",
                benefits: ["Certified guides", "Small group sizes", "Safety protocols", "Custom itineraries"],
                logo: "️"
              },
              {
                name: "Culinary Journeys",
                category: "Dining",
                description: "Authentic food experiences connecting travelers with local cuisines and culinary traditions.",
                benefits: ["Local chefs", "Market tours", "Cooking classes", "Wine pairings"],
                logo: "‍"
              },
              {
                name: "Premier Transport Services",
                category: "Transportation",
                description: "Luxury ground transportation and private tours with professional, knowledgeable drivers.",
                benefits: ["Licensed drivers", "Premium vehicles", "GPS tracking", "24/7 support"],
                logo: ""
              }
            ].map((vendor, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <span className="text-4xl mr-4">{vendor.logo}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">{vendor.name}</h3>
                    <span className="inline-block bg-accent-primary/10 text-blue-800 text-sm px-2 py-1 rounded">
                      {vendor.category}
                    </span>
                  </div>
                </div>
                <p className="text-neutral-600 mb-4">{vendor.description}</p>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Partner Benefits:</h4>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    {vendor.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-accent-secondary rounded-full mr-2"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Vendor Partnership Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Increased Visibility</h3>
              <p className="text-sm text-neutral-600">Featured placement across our platform</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Premium Audience</h3>
              <p className="text-sm text-neutral-600">Direct access to discerning travelers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Business Support</h3>
              <p className="text-sm text-neutral-600">Marketing and operational assistance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Performance Insights</h3>
              <p className="text-sm text-neutral-600">Detailed analytics and reporting</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Vendor Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Paradise Resort Collection</h3>
              <p className="text-neutral-600 mb-3">
                &ldquo;Partnering with ATLVS + GVTEWAY transformed our business. We&apos;ve seen a 60% increase
                in direct bookings and our brand now reaches a premium global audience we couldn&apos;t access before.&rdquo;
              </p>
              <p className="text-sm text-neutral-500">- Maria Santos, General Manager</p>
            </div>
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Global Adventure Tours</h3>
              <p className="text-neutral-600 mb-3">
                &ldquo;The partnership program provided us with incredible marketing support and helped us connect
                with travelers seeking authentic, high-quality experiences. Our bookings have grown significantly.&rdquo;
              </p>
              <p className="text-sm text-neutral-500">- David Chen, Owner</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Become a Vendor Partner?</h2>
          <p className="text-neutral-600 mb-6">Join our network of trusted service providers and grow your business</p>
          <div className="flex justify-center gap-4">
            <a href="/partners/become-partner" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Apply for Partnership
            </a>
            <a href="/contact" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
