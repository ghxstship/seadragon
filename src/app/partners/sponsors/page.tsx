
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Sponsors | ATLVS + GVTEWAY',
  description: 'Meet the amazing sponsors who make our travel experiences possible.',
}

export default function SponsorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Our Sponsors</h1>
          <p className="text-lg text-neutral-600">Grateful for the incredible partners who support our mission</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Thank You to Our Sponsors</h2>
            <p className="text-xl mb-6">Their support enables us to create unforgettable travel experiences</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Platinum Sponsors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Global Luxury Airways",
                description: "Premium air travel solutions connecting the world",
                logo: "️",
                website: "#"
              },
              {
                name: "Paradise Resort Collection",
                description: "Luxury beachfront resorts and wellness retreats",
                logo: "️",
                website: "#"
              },
              {
                name: "Adventure Gear Pro",
                description: "High-performance equipment for outdoor enthusiasts",
                logo: "",
                website: "#"
              }
            ].map((sponsor, index) => (
              <div key={index} className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{sponsor.logo}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{sponsor.name}</h3>
                <p className="text-neutral-600 mb-4">{sponsor.description}</p>
                <a
                  href={sponsor.website}
                  className="inline-block bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
                >
                  Visit Website
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Gold Sponsors</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "Mountain View Hotels", logo: "" },
              { name: "Ocean Adventures", logo: "" },
              { name: "City Explorer Tours", logo: "️" },
              { name: "Wellness Retreats", logo: "" },
              { name: "Culinary Journeys", logo: "‍" },
              { name: "Artisan Experiences", logo: "" },
              { name: "Nature Photography", logo: "" },
              { name: "Local Transport Co.", logo: "" }
            ].map((sponsor, index) => (
              <div key={index} className="bg-background rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{sponsor.logo}</div>
                <h3 className="font-semibold text-neutral-900">{sponsor.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Silver Sponsors</h2>
          <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Coffee Culture", logo: "" },
              { name: "Street Food Guide", logo: "" },
              { name: "Travel Insurance Plus", logo: "️" },
              { name: "Language Learning", logo: "️" },
              { name: "Photography Academy", logo: "" },
              { name: "Adventure Books", logo: "" },
              { name: "Eco Travel Gear", logo: "" },
              { name: "Local Music Festival", logo: "" },
              { name: "Artisan Crafts", logo: "" },
              { name: "Wellness Spa", logo: "" },
              { name: "Bike Rentals", logo: "" },
              { name: "Camping Equipment", logo: "" }
            ].map((sponsor, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-background hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{sponsor.logo}</div>
                <h3 className="text-sm font-medium text-neutral-900">{sponsor.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Sponsor Impact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">What Our Sponsors Enable</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Destination Preservation</h4>
                    <p className="text-sm text-neutral-600">Support for conservation and community projects</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Educational Programs</h4>
                    <p className="text-sm text-neutral-600">Travel education and cultural exchange initiatives</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Accessible Travel</h4>
                    <p className="text-sm text-neutral-600">Making travel inclusive for all abilities</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Sponsor Recognition</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Brand Visibility</h4>
                    <p className="text-sm text-neutral-600">Prominent placement across our platform</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Direct Engagement</h4>
                    <p className="text-sm text-neutral-600">Opportunities to connect with our community</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Performance Insights</h4>
                    <p className="text-sm text-neutral-600">Detailed analytics and impact reporting</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Featured Sponsor Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Global Luxury Airways</h3>
              <p className="text-neutral-600 mb-3">
                "Partnering with ATLVS + GVTEWAY has allowed us to reach a premium audience
                of discerning travelers. Their platform perfectly aligns with our brand values
                of exceptional service and luxury experiences."
              </p>
              <p className="text-sm text-neutral-500">- Sarah Chen, Partnership Director</p>
            </div>
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Adventure Gear Pro</h3>
              <p className="text-neutral-600 mb-3">
                "The partnership has been transformative for our brand. We've seen significant
                growth in engagement with outdoor enthusiasts and our products are now featured
                in some of the most inspiring travel content."
              </p>
              <p className="text-sm text-neutral-500">- Mike Rodriguez, CEO</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Become a Sponsor</h2>
          <p className="text-neutral-600 mb-6">Join our amazing sponsors in supporting extraordinary travel experiences</p>
          <div className="flex justify-center gap-4">
            <a href="/sponsors/opportunities" className="bg-semantic-warning text-primary-foreground px-6 py-3 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2">
              View Opportunities
            </a>
            <a href="/sponsors/inquire" className="bg-background text-semantic-warning border border-yellow-600 px-6 py-3 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2">
              Start Conversation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
