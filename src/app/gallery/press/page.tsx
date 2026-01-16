
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PressPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Press Photos</h1>
          <p className="text-lg text-neutral-600">High-resolution media assets for editorial and press use</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <span className="text-accent-secondary text-xl mr-3">ℹ️</span>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Usage Guidelines</h3>
              <p className="text-blue-800 text-sm">
                These images are available for editorial use only. Commercial use requires permission.
                Please credit "ATLVS + GVTEWAY" when using these images. High-resolution downloads
                are available for accredited media outlets.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search press photos..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <Select className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="destinations">Destinations</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="activities">Activities</SelectItem>
            </Select>
            <Select className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <SelectItem value="all-formats">All Formats</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="square">Square</SelectItem>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Sample press photos */}
          {[
            {
              title: "Bali Rice Terraces",
              category: "Destinations",
              resolution: "4000x3000",
              size: "8.2MB",
              format: "JPG"
            },
            {
              title: "Tokyo Night Market",
              category: "Culture",
              resolution: "3840x2160",
              size: "12.1MB",
              format: "JPG"
            },
            {
              title: "Swiss Alps Hiking",
              category: "Adventure",
              resolution: "6000x4000",
              size: "15.3MB",
              format: "JPG"
            },
            {
              title: "Santorini Sunset",
              category: "Landscapes",
              resolution: "5472x3648",
              size: "9.7MB",
              format: "JPG"
            },
            {
              title: "Moroccan Market",
              category: "Culture",
              resolution: "4896x3264",
              size: "11.2MB",
              format: "JPG"
            },
            {
              title: "Festival Crowd",
              category: "Events",
              resolution: "5184x3456",
              size: "13.8MB",
              format: "JPG"
            }
          ].map((photo, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative mb-4">
                <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-primary-foreground text-4xl"></span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                  <Button className="bg-background text-accent-primary px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Download
                  </Button>
                </div>
                <div className="absolute top-2 left-2 bg-accent-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                  {photo.category}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-accent-primary transition-colors">
                {photo.title}
              </h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <div>Resolution: {photo.resolution}</div>
                <div>Size: {photo.size}</div>
                <div>Format: {photo.format}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Press Kit Downloads</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Complete Press Kit</h3>
              <p className="text-neutral-600 mb-4">
                Full press kit including logos, brand guidelines, high-resolution images, and company facts.
              </p>
              <div className="text-sm text-neutral-600 mb-4">
                <div>• 50+ high-res images</div>
                <div>• Logo files (various formats)</div>
                <div>• Brand guidelines PDF</div>
                <div>• Company fact sheet</div>
                <div>• Size: 245MB</div>
              </div>
              <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Download Press Kit
              </Button>
            </div>

            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Destination Photo Sets</h3>
              <p className="text-neutral-600 mb-4">
                Curated photo collections organized by destination for easy selection and download.
              </p>
              <div className="text-sm text-neutral-600 mb-4">
                <div>• Bali (25 images)</div>
                <div>• Japan (30 images)</div>
                <div>• Europe (40 images)</div>
                <div>• Individual ZIP files</div>
                <div>• Total: 95 images</div>
              </div>
              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Browse Collections
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Media Accreditation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">For Journalists</h3>
              <p className="text-neutral-600 mb-3">
                Accredited journalists can access exclusive content and arrange interviews with our team.
              </p>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Press conference invitations</li>
                <li>• Exclusive photo access</li>
                <li>• Interview arrangements</li>
                <li>• Embargoed content</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Accreditation Process</h3>
              <p className="text-neutral-600 mb-3">
                Apply for media accreditation to access premium resources and networking opportunities.
              </p>
              <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 text-sm">
                Apply for Accreditation
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Recent Press Coverage</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { outlet: "Travel Weekly", date: "March 15, 2024", title: "Innovative Travel Platform Redefines Industry" },
              { outlet: " Conde Nast Traveler", date: "March 8, 2024", title: "Top 10 Emerging Travel Brands" },
              { outlet: "Forbes Travel", date: "February 28, 2024", title: "How Tech is Transforming Travel" }
            ].map((article, index) => (
              <div key={index} className="bg-background rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-neutral-900 mb-2">{article.outlet}</h3>
                <p className="text-sm text-neutral-600 mb-2">{article.date}</p>
                <p className="text-sm text-neutral-800">{article.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Need Media Assets?</h2>
          <p className="text-neutral-600 mb-6">Contact our press team for custom requests or additional resources.</p>
          <div className="flex justify-center gap-4">
            <Button className="bg-accent-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Contact Press Team
            </Button>
            <Button className="bg-background text-accent-primary border border-purple-600 px-6 py-3 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
              Media Guidelines
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
