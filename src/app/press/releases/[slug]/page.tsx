
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PressReleasePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PressReleasePageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} | Press Release | ATLVS + GVTEWAY`,
    description: `Read the full press release: ${slug.replace(/-/g, ' ')} from ATLVS + GVTEWAY.`,
  }
}

export default async function PressReleasePage({ params }: PressReleasePageProps) {
  const { slug } = await params
  const releaseTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <nav className="text-sm text-neutral-600 mb-4">
            <Link href="/press" className="hover:text-accent-secondary">Press Room</Link>
            <span className="mx-2">/</span>
            <Link href="/press/releases" className="hover:text-accent-secondary">Press Releases</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{releaseTitle}</span>
          </nav>
        </div>

        <article className="bg-background rounded-lg shadow-md p-8 mb-8">
          <header className="mb-8">
            <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
              <span className="bg-accent-primary/10 text-blue-800 px-3 py-1 rounded">Press Release</span>
              <span>March 15, 2024</span>
              <span>•</span>
              <span>New York, NY</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              {releaseTitle}
            </h1>
            <p className="text-xl text-neutral-700">
              ATLVS + GVTEWAY announces the launch of its highly anticipated Travel Tech Summit 2024,
              bringing together industry leaders, innovators, and visionaries for three days of transformative discussions.
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <p>
              <strong>New York, NY – March 15, 2024</strong> – ATLVS + GVTEWAY, the premier platform for luxury and
              authentic travel experiences, today announced the launch of Travel Tech Summit 2024. The annual conference
              will bring together over 500 industry leaders, technology innovators, and travel visionaries for three
              days of immersive sessions, workshops, and networking opportunities.
            </p>

            <p>
              This year&apos;s summit focuses on the intersection of artificial intelligence, sustainability, and luxury travel,
              featuring keynote presentations from leading voices in the travel technology space. Attendees will explore
              how emerging technologies are reshaping the travel experience and discover innovative solutions for the
              future of tourism.
            </p>

            <h2>Key Highlights of Travel Tech Summit 2024</h2>

            <ul>
              <li><strong>AI-Powered Personalization:</strong> Sessions exploring how artificial intelligence is revolutionizing
              travel planning and creating hyper-personalized experiences for discerning travelers.</li>
              <li><strong>Sustainable Innovation:</strong> Discussions on carbon-neutral travel initiatives and eco-friendly
              technologies that minimize environmental impact while maximizing guest satisfaction.</li>
              <li><strong>Luxury Experience Design:</strong> Workshops on creating memorable, authentic experiences that
              resonate with the modern luxury traveler.</li>
              <li><strong>Technology Integration:</strong> Demonstrations of cutting-edge tools and platforms that streamline
              operations and enhance guest experiences.</li>
            </ul>

            <h2>Featured Speakers and Sessions</h2>

            <p>
              The summit will feature presentations from industry leaders including:
            </p>

            <ul>
              <li>Sarah Chen, CEO of Global Luxury Airlines Alliance</li>
              <li>Michael Rodriguez, CTO of Paradise Resort Collection</li>
              <li>Dr. Emma Thompson, Director of Sustainable Tourism Institute</li>
              <li>David Kim, Founder of AI Travel Solutions</li>
            </ul>

            <p>
              &ldquo;Travel Tech Summit 2024 represents our commitment to driving innovation in the travel industry,&rdquo;
              said ATLVS + GVTEWAY CEO and Founder. &ldquo;We&apos;re bringing together the brightest minds to explore
              how technology can create more meaningful, sustainable, and luxurious travel experiences for our members.&rdquo;
            </p>

            <h2>Summit Details</h2>

            <ul>
              <li><strong>Date:</strong> June 15-17, 2024</li>
              <li><strong>Location:</strong> The Plaza Hotel, New York City</li>
              <li><strong>Registration:</strong> Opens April 1, 2024</li>
              <li><strong>Early Bird Pricing:</strong> Available until May 15, 2024</li>
            </ul>

            <p>
              For more information about Travel Tech Summit 2024, including registration details and sponsorship
              opportunities, visit <a href="#" className="text-accent-secondary hover:text-blue-800">travelsummit.atlvs.com</a>
              or contact our events team at events@atlvs.com.
            </p>

            <h2>About ATLVS + GVTEWAY</h2>

            <p>
              ATLVS + GVTEWAY is the premier platform connecting discerning travelers with extraordinary experiences
              worldwide. Through our exclusive membership program, cutting-edge technology, and curated partnerships,
              we provide unparalleled access to luxury travel opportunities and authentic cultural immersion.
            </p>

            <h2>Media Contact</h2>

            <p>
              For press inquiries or interview requests, please contact:
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Jennifer Walsh</strong></p>
              <p>Director of Communications</p>
              <p>ATLVS + GVTEWAY</p>
              <p>Email: press@atlvs.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </article>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Share This Press Release</h2>
          <div className="flex space-x-4">
            <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
               Share on Facebook
            </Button>
            <Button className="bg-accent-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-primary focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
               Share on Twitter
            </Button>
            <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
               Email
            </Button>
            <Button className="bg-neutral-600 text-primary-foreground px-4 py-2 rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2">
               Copy Link
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Related Press Releases</h2>
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-4">
              <h3 className="font-medium text-neutral-900 mb-1 hover:text-accent-secondary cursor-pointer">
                New Luxury Airline Partnership Expands Global Reach
              </h3>
              <p className="text-sm text-neutral-600 mb-2">Strategic alliance brings premium air travel options to our membership program.</p>
              <span className="text-xs text-neutral-500">February 28, 2024</span>
            </div>
            <div className="border-b border-neutral-200 pb-4">
              <h3 className="font-medium text-neutral-900 mb-1 hover:text-accent-secondary cursor-pointer">
                Membership Program Surpasses 100,000 Members Milestone
              </h3>
              <p className="text-sm text-neutral-600 mb-2">Record growth demonstrates demand for premium travel experiences.</p>
              <span className="text-xs text-neutral-500">February 15, 2024</span>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-1 hover:text-accent-secondary cursor-pointer">
                AI-Powered Travel Planning Tool Launches
              </h3>
              <p className="text-sm text-neutral-600 mb-2">Revolutionary technology transforms travel booking experience.</p>
              <span className="text-xs text-neutral-500">January 25, 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
