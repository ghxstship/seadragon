
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Press Releases | ATLVS + GVTEWAY',
  description: 'Official press releases and announcements from ATLVS + GVTEWAY.',
}

export default function PressReleasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Press Releases</h1>
          <p className="text-lg text-neutral-600">Official announcements and news from ATLVS + GVTEWAY</p>
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search press releases..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
        </div>

        <div className="space-y-6">
          {[
            {
              title: "ATLVS + GVTEWAY Announces Travel Tech Summit 2024",
              date: "March 15, 2024",
              category: "Events",
              excerpt: "Leading travel innovators to gather for annual conference featuring cutting-edge AI technology, sustainability initiatives, and luxury travel experiences.",
              featured: true
            },
            {
              title: "Strategic Partnership with Global Luxury Airlines Alliance",
              date: "February 28, 2024",
              category: "Partnerships",
              excerpt: "New alliance brings premium air travel options and exclusive member benefits to our growing community of discerning travelers.",
              featured: false
            },
            {
              title: "Membership Program Surpasses 100,000 Members Worldwide",
              date: "February 15, 2024",
              category: "Company",
              excerpt: "Record milestone demonstrates strong demand for premium travel experiences and personalized concierge services.",
              featured: false
            },
            {
              title: "Carbon-Neutral Travel Initiative Wins Environmental Excellence Award",
              date: "February 8, 2024",
              category: "Sustainability",
              excerpt: "Industry-leading sustainability program recognized for innovative approach to reducing travel's environmental impact.",
              featured: false
            },
            {
              title: "AI-Powered Travel Planning Tool Revolutionizes Booking Experience",
              date: "January 25, 2024",
              category: "Technology",
              excerpt: "New proprietary technology transforms how travelers discover, plan, and book extraordinary experiences worldwide.",
              featured: true
            },
            {
              title: "Luxury Resort Collection Expands to 50+ Properties",
              date: "January 18, 2024",
              category: "Hospitality",
              excerpt: "Curated collection of boutique and luxury resorts now spans six continents with unparalleled service standards.",
              featured: false
            },
            {
              title: "Adventure Travel Safety Protocols Certified Industry-Leading",
              date: "January 10, 2024",
              category: "Safety",
              excerpt: "Comprehensive safety and risk management protocols receive highest industry certification and recognition.",
              featured: false
            },
            {
              title: "New Corporate Travel Solutions for Enterprise Clients",
              date: "December 20, 2023",
              category: "Business",
              excerpt: "Custom enterprise solutions launched to meet growing demand for streamlined corporate travel management.",
              featured: false
            }
          ].map((release, index) => (
            <article key={index} className={`bg-background rounded-lg shadow-md p-6 ${release.featured ? 'border-l-4 border-accent-primary' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-2 hover:text-accent-secondary cursor-pointer">
                    {release.title}
                  </h2>
                  <p className="text-neutral-700 mb-3">{release.excerpt}</p>
                </div>
                {release.featured && (
                  <span className="bg-accent-primary/10 text-blue-800 text-xs px-2 py-1 rounded ml-4">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-neutral-500">{release.date}</span>
                  <span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded">
                    {release.category}
                  </span>
                </div>
                <Button className="text-accent-secondary text-sm hover:text-blue-800 font-medium">
                  Read Full Release →
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mt-12">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Press Release Archive</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <h3 className="font-medium text-neutral-900 mb-2">2024</h3>
              <p className="text-sm text-neutral-600">8 releases</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-neutral-900 mb-2">2023</h3>
              <p className="text-sm text-neutral-600">24 releases</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-neutral-900 mb-2">2022</h3>
              <p className="text-sm text-neutral-600">18 releases</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-neutral-900 mb-2">2021</h3>
              <p className="text-sm text-neutral-600">12 releases</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Subscribe to Press Releases</h2>
          <p className="text-blue-800 mb-4">
            Get the latest news and announcements delivered directly to your inbox.
            Stay informed about our latest developments and industry insights.
          </p>
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
