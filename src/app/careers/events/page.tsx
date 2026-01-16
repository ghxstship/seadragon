
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Hiring Events | ATLVS + GVTEWAY Careers',
  description: 'Attend our career fairs, hackathons, and networking events to connect with our team.',
}

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Hiring Events</h1>
          <p className="text-lg text-neutral-600">Connect with our team at career events, hackathons, and networking opportunities</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Experience ATLVS + GVTEWAY</h2>
            <p className="text-xl mb-6">Meet our team, see our culture, and discover career opportunities</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Upcoming Events</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-accent-primary pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Tech Career Fair - New York</h3>
                  <span className="bg-accent-primary/10 text-blue-800 text-xs px-2 py-1 rounded">In-Person</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Meet our engineering and product teams at Columbia University</p>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span> April 15, 2024</span>
                  <span> New York, NY</span>
                </div>
                <Button className="mt-3 w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary text-sm">
                  Register
                </Button>
              </div>

              <div className="border-l-4 border-semantic-success pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Virtual Coffee Chat</h3>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Virtual</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Informal Q&A with our CEO and leadership team</p>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span> April 22, 2024</span>
                  <span> Online</span>
                </div>
                <Button className="mt-3 w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 text-sm">
                  Sign Up
                </Button>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Women in Tech Meetup</h3>
                  <span className="bg-accent-primary/10 text-purple-800 text-xs px-2 py-1 rounded">In-Person</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Networking event for women in technology and travel</p>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span> May 8, 2024</span>
                  <span> San Francisco, CA</span>
                </div>
                <Button className="mt-3 w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 text-sm">
                  RSVP
                </Button>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Travel Tech Hackathon</h3>
                  <span className="bg-semantic-warning/10 text-orange-800 text-xs px-2 py-1 rounded">Hybrid</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">48-hour coding challenge to build travel solutions</p>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span> May 20-22, 2024</span>
                  <span> Multiple Cities</span>
                </div>
                <Button className="mt-3 w-full bg-semantic-warning text-primary-foreground py-2 px-4 rounded-md hover:bg-orange-700 text-sm">
                  Join Team
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Event Types</h2>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2"> Career Fairs</h3>
                <p className="text-sm text-neutral-600 mb-2">Meet our recruiters and learn about open positions</p>
                <p className="text-xs text-neutral-500">University campuses and tech conferences</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2"> Coffee Chats</h3>
                <p className="text-sm text-neutral-600 mb-2">Informal conversations with team members</p>
                <p className="text-xs text-neutral-500">Virtual and in-person networking</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2"> Hackathons</h3>
                <p className="text-sm text-neutral-600 mb-2">Coding challenges and innovation competitions</p>
                <p className="text-xs text-neutral-500">Team-based problem solving</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2"> Diversity Events</h3>
                <p className="text-sm text-neutral-600 mb-2">Inclusive networking for underrepresented groups</p>
                <p className="text-xs text-neutral-500">Focused on inclusion and diversity</p>
              </div>
              <div className="p-4 border border-neutral-200 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2"> Global Meetups</h3>
                <p className="text-sm text-neutral-600 mb-2">Local networking events in our global offices</p>
                <p className="text-xs text-neutral-500">City-specific gatherings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Event Preparation Tips</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Research</h3>
              <p className="text-sm text-neutral-600">Learn about our company and prepare questions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Resume</h3>
              <p className="text-sm text-neutral-600">Bring updated resumes and business cards</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Goals</h3>
              <p className="text-sm text-neutral-600">Know what you want to learn and achieve</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Network</h3>
              <p className="text-sm text-neutral-600">Connect with attendees and follow up</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Past Events</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-3"></div>
              <h3 className="font-medium text-neutral-900 mb-1">Winter Hackathon 2024</h3>
              <p className="text-sm text-neutral-600 mb-2">150 participants, 12 winning teams</p>
              <p className="text-xs text-neutral-500">February 2024</p>
            </div>
            <div className="text-center">
              <div className="aspect-video bg-gradient-to-br from-green-400 to-teal-500 rounded-lg mb-3"></div>
              <h3 className="font-medium text-neutral-900 mb-1">London Career Fair</h3>
              <p className="text-sm text-neutral-600 mb-2">200+ attendees, 50+ applications</p>
              <p className="text-xs text-neutral-500">January 2024</p>
            </div>
            <div className="text-center">
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-3"></div>
              <h3 className="font-medium text-neutral-900 mb-1">Diversity in Tech Panel</h3>
              <p className="text-sm text-neutral-600 mb-2">300+ virtual participants</p>
              <p className="text-xs text-neutral-500">December 2023</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Host Your Own Event</h2>
          <p className="text-blue-800 mb-4">
            Are you organizing a career fair, hackathon, or networking event? We&apos;d love to participate!
            Contact our recruiting team to discuss partnership opportunities.
          </p>
          <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
            Partner With Us
          </Button>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Student & Campus Programs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">University Partnerships</h3>
              <ul className="space-y-2 text-neutral-600">
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Guest lectures and workshops</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Career fairs and job shadowing</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Internship and co-op programs</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Research collaborations</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Featured Universities</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium text-neutral-900">Stanford University</span>
                  <span className="text-sm text-accent-secondary">Partner</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium text-neutral-900">MIT</span>
                  <span className="text-sm text-accent-secondary">Partner</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium text-neutral-900">Carnegie Mellon</span>
                  <span className="text-sm text-semantic-success">Upcoming</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium text-neutral-900">UC Berkeley</span>
                  <span className="text-sm text-semantic-success">Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Stay Connected</h2>
          <p className="text-neutral-600 mb-6">Get notified about upcoming events and career opportunities</p>
          <div className="flex justify-center gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
