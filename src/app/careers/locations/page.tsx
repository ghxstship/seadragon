
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Locations | ATLVS + GVTEWAY Careers',
  description: 'Explore our office locations and remote work opportunities around the world.',
}

export default function LocationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Our Locations</h1>
          <p className="text-lg text-neutral-600">Global offices and remote opportunities for our worldwide team</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Work From Anywhere</h2>
            <p className="text-xl mb-6">Flexible work arrangements that put you first</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Remote First</h3>
                <p className="text-sm">Full remote options available</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Hybrid Model</h3>
                <p className="text-sm">Mix of office and remote work</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Global Team</h3>
                <p className="text-sm">250+ team members worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🇺🇸</span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">New York, NY</h3>
              <p className="text-neutral-600 mb-4">Headquarters - Innovation District</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• 150+ employees</p>
                <p>• Hybrid work model</p>
                <p>• Tech-forward culture</p>
                <p>• Easy subway access</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Perks</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Free daily lunch</li>
                <li>• Gym membership</li>
                <li>• Modern office space</li>
                <li>• Central location</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🇬🇧</span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">London, UK</h3>
              <p className="text-neutral-600 mb-4">European Hub - Shoreditch</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• 45+ employees</p>
                <p>• Flexible hours</p>
                <p>• Vibrant startup scene</p>
                <p>• Great coffee culture</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Perks</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Weekly team lunches</li>
                <li>• Learning stipends</li>
                <li>• Modern co-working space</li>
                <li>• Central transport links</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🇩🇪</span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Berlin, Germany</h3>
              <p className="text-neutral-600 mb-4">Engineering Center - Kreuzberg</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• 35+ employees</p>
                <p>• Remote-friendly</p>
                <p>• Creative community</p>
                <p>• Excellent work-life balance</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Perks</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Monthly team events</li>
                <li>• Professional development</li>
                <li>• Modern office design</li>
                <li>• Green transportation</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🇸🇬</span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Singapore</h3>
              <p className="text-neutral-600 mb-4">Asia Pacific Hub - Marina Bay</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• 20+ employees</p>
                <p>• Growing team</p>
                <p>• Tropical work environment</p>
                <p>• International business hub</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Perks</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Tropical climate year-round</li>
                <li>• Regional travel opportunities</li>
                <li>• Modern office facilities</li>
                <li>• Cultural experiences</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🇨🇦</span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Vancouver, Canada</h3>
              <p className="text-neutral-600 mb-4">Product & Design - Gastown</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• 25+ employees</p>
                <p>• Outdoor lifestyle</p>
                <p>• Creative community</p>
                <p>• Natural beauty</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Perks</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Mountain views</li>
                <li>• Outdoor activities</li>
                <li>• Modern design studio</li>
                <li>• Progressive culture</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 border-2 border-green-300">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Remote Work</h3>
              <p className="text-neutral-600 mb-4">Work from anywhere in the world</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• 80+ remote employees</p>
                <p>• Flexible schedules</p>
                <p>• Global collaboration</p>
                <p>• Home office stipends</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Perks</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• $500 home office setup</li>
                <li>• Travel stipends</li>
                <li>• Flexible work hours</li>
                <li>• Virtual team events</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Office Amenities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Premium Coffee</h3>
              <p className="text-sm text-neutral-600">Locally sourced, expertly brewed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Fitness Facilities</h3>
              <p className="text-sm text-neutral-600">On-site gyms and wellness programs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Catering Services</h3>
              <p className="text-sm text-neutral-600">Healthy meals and snacks provided</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Creative Spaces</h3>
              <p className="text-sm text-neutral-600">Design thinking rooms and collaboration areas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Recreation Areas</h3>
              <p className="text-sm text-neutral-600">Game rooms and relaxation spaces</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Green Initiatives</h3>
              <p className="text-sm text-neutral-600">Sustainable practices and eco-friendly spaces</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Family Friendly</h3>
              <p className="text-sm text-neutral-600">Childcare services and family events</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Transportation</h3>
              <p className="text-sm text-neutral-600">Subsidized transit and parking</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Relocation Support</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Housing Assistance</h3>
                  <p className="text-sm text-neutral-600">Help finding housing and temporary accommodations</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5">️</span>
                <div>
                  <h3 className="font-medium text-neutral-900">Travel Reimbursement</h3>
                  <p className="text-sm text-neutral-600">Flight and moving expenses covered</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-purple-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Cultural Orientation</h3>
                  <p className="text-sm text-neutral-600">Local culture and language training</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-warning/10 text-orange-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5">‍‍‍</span>
                <div>
                  <h3 className="font-medium text-neutral-900">Family Support</h3>
                  <p className="text-sm text-neutral-600">School finding and family relocation assistance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Remote Work Benefits</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-error/10 text-red-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Equipment Stipend</h3>
                  <p className="text-sm text-neutral-600">$500 for home office setup and equipment</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Internet Reimbursement</h3>
                  <p className="text-sm text-neutral-600">$50/month for high-speed internet</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Virtual Events</h3>
                  <p className="text-sm text-neutral-600">Regular virtual team building and social events</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-purple-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5">⏰</span>
                <div>
                  <h3 className="font-medium text-neutral-900">Flexible Hours</h3>
                  <p className="text-sm text-neutral-600">Work when you&apos;re most productive</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Employee Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-6">
              <blockquote className="text-neutral-700 italic mb-3">
                "The relocation support was incredible. They helped us find housing, covered moving costs,
                and even arranged cultural orientation sessions. Made the transition seamless."
              </blockquote>
              <p className="text-sm font-medium text-neutral-900">- David Chen, Senior Engineer (relocated to New York)</p>
            </div>
            <div className="bg-background rounded-lg p-6">
              <blockquote className="text-neutral-700 italic mb-3">
                "Working remotely has been fantastic. The stipend for my home office and the flexibility
                to work from anywhere allows me to maintain work-life balance while doing meaningful work."
              </blockquote>
              <p className="text-sm font-medium text-neutral-900">- Maria Rodriguez, Product Manager (Remote)</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Find Your Perfect Location</h2>
          <p className="text-neutral-600 mb-6">Whether you prefer office collaboration or remote flexibility, we have options for you</p>
          <div className="flex justify-center gap-4">
            <a href="/careers/openings" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Browse Jobs by Location
            </a>
            <a href="/careers/culture" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Learn About Culture
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
