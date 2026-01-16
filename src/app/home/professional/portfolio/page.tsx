
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Portfolio | ATLVS + GVTEWAY',
  description: 'View and manage your professional portfolio showcasing your work and expertise.',
}

export default function HomeProfessionalPortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Portfolio</h1>
            <p className="text-neutral-600">Showcase your best work</p>
          </div>
          <a href="/home/professional/portfolio/add" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
            Add New Work
          </a>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <Button className="text-accent-secondary font-medium">All Work</Button>
            <Button className="text-neutral-600 hover:text-neutral-900">Photography</Button>
            <Button className="text-neutral-600 hover:text-neutral-900">Videography</Button>
            <Button className="text-neutral-600 hover:text-neutral-900">Content Creation</Button>
            <Button className="text-neutral-600 hover:text-neutral-900">Events</Button>
          </div>

          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search portfolio..."
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Select className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <SelectItem value="most-recent">Most Recent</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
              <SelectItem value="highest-rated">Highest Rated</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              id: 1,
              title: 'Santorini Sunset Photography',
              category: 'Photography',
              type: 'Commercial',
              image: '️',
              views: 1240,
              likes: 89,
              date: '2024-01-15',
              featured: true
            },
            {
              id: 2,
              title: 'Tokyo Street Food Documentary',
              category: 'Videography',
              type: 'Personal',
              image: '',
              views: 856,
              likes: 67,
              date: '2024-01-08',
              featured: false
            },
            {
              id: 3,
              title: 'Machu Picchu Hiking Guide',
              category: 'Content Creation',
              type: 'Commercial',
              image: '️',
              views: 2103,
              likes: 145,
              date: '2023-12-20',
              featured: true
            },
            {
              id: 4,
              title: 'Bali Yoga Retreat Video',
              category: 'Videography',
              type: 'Commercial',
              image: '',
              views: 742,
              likes: 53,
              date: '2023-12-10',
              featured: false
            },
            {
              id: 5,
              title: 'Paris Fashion Week Coverage',
              category: 'Photography',
              type: 'Commercial',
              image: '',
              views: 1589,
              likes: 98,
              date: '2023-11-28',
              featured: false
            },
            {
              id: 6,
              title: 'Amazon Rainforest Expedition',
              category: 'Content Creation',
              type: 'Personal',
              image: '',
              views: 934,
              likes: 76,
              date: '2023-11-15',
              featured: true
            }
          ].map((item) => (
            <div key={item.id} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl">
                  {item.image}
                </div>
                {item.featured && (
                  <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
                  <span>{item.type}</span>
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>️ {item.views.toLocaleString()}</span>
                  <span>️ {item.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Portfolio Analytics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-secondary mb-1">8,724</div>
              <div className="text-sm text-neutral-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-semantic-success mb-1">528</div>
              <div className="text-sm text-neutral-600">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">42</div>
              <div className="text-sm text-neutral-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-semantic-warning mb-1">4.8</div>
              <div className="text-sm text-neutral-600">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
