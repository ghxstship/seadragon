
import { Metadata } from 'next'
import Link from 'next/link'

interface JobPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | ATLVS + GVTEWAY Careers`,
    description: `Apply for the ${slug.replace(/-/g, ' ')} position at ATLVS + GVTEWAY.`,
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params
  const jobTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <nav className="text-sm text-neutral-600 mb-4">
            <a href="/careers" className="hover:text-accent-secondary">Careers</a>
            <span className="mx-2">/</span>
            <Link href="/careers/openings" className="hover:text-accent-secondary">Openings</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{jobTitle}</span>
          </nav>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{jobTitle}</h1>
            <div className="flex flex-wrap items-center gap-4 text-neutral-600 mb-4">
              <span className="bg-accent-primary/10 text-blue-800 px-3 py-1 rounded text-sm">Engineering</span>
              <span>New York, NY (Hybrid)</span>
              <span>•</span>
              <span>Full-time</span>
              <span>•</span>
              <span>$140K - $180K</span>
            </div>
            <p className="text-lg text-neutral-700">
              We&apos;re looking for a talented Senior Software Engineer to join our engineering team and help build
              the next generation of travel technology. You&apos;ll work on scalable systems that serve millions of users worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">What You&apos;ll Do</h2>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Design and develop scalable web applications using modern technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Collaborate with cross-functional teams to deliver high-quality solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Optimize application performance and ensure system reliability</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Mentor junior developers and contribute to team knowledge sharing</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Participate in code reviews and maintain high code quality standards</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">What We Look For</h2>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>5+ years of experience in software development</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Strong proficiency in React, Node.js, and modern JavaScript</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Experience with cloud platforms (AWS, Azure, or GCP)</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Knowledge of database design and optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Excellent problem-solving and communication skills</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Nice to Have</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-neutral-600">
                <li>• Experience with TypeScript</li>
                <li>• Knowledge of microservices architecture</li>
                <li>• Familiarity with DevOps practices</li>
                <li>• Experience with mobile development</li>
              </ul>
              <ul className="space-y-2 text-neutral-600">
                <li>• Background in travel or hospitality industry</li>
                <li>• Experience with AI/ML integration</li>
                <li>• Open source contributions</li>
                <li>• International work experience</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <span className="text-2xl mb-2 block"></span>
                <h3 className="font-medium text-neutral-900 mb-1">Competitive Salary</h3>
                <p className="text-sm text-neutral-600">$140K - $180K</p>
              </div>
              <div className="text-center">
                <span className="text-2xl mb-2 block"></span>
                <h3 className="font-medium text-neutral-900 mb-1">Health Benefits</h3>
                <p className="text-sm text-neutral-600">Comprehensive coverage</p>
              </div>
              <div className="text-center">
                <span className="text-2xl mb-2 block">️</span>
                <h3 className="font-medium text-neutral-900 mb-1">Travel Perks</h3>
                <p className="text-sm text-neutral-600">Employee discounts</p>
              </div>
              <div className="text-center">
                <span className="text-2xl mb-2 block"></span>
                <h3 className="font-medium text-neutral-900 mb-1">Learning</h3>
                <p className="text-sm text-neutral-600">Professional development</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href={`/careers/job/${slug}/apply`} className="bg-accent-secondary text-primary-foreground px-8 py-4 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-semibold text-lg inline-block">
              Apply for This Position
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Related Positions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-medium text-neutral-900 mb-1">Software Engineer</h3>
              <p className="text-sm text-neutral-600 mb-2">Build user-facing features</p>
              <span className="text-xs text-accent-secondary">Engineering • New York, NY</span>
            </div>
            <div className="bg-background rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-medium text-neutral-900 mb-1">DevOps Engineer</h3>
              <p className="text-sm text-neutral-600 mb-2">Maintain cloud infrastructure</p>
              <span className="text-xs text-accent-secondary">Engineering • Remote</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
