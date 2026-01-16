
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Internships | ATLVS + GVTEWAY Careers',
  description: 'Launch your career with our internship programs in travel technology and innovation.',
}

export default function InternshipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Internship Programs</h1>
          <p className="text-lg text-neutral-600">Launch your career in travel technology and innovation</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Real Experience, Real Impact</h2>
            <p className="text-xl mb-6">Work on projects that shape the future of travel</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Hands-On Projects</h3>
                <p className="text-sm">Contribute to real products</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block">‍</span>
                <h3 className="font-semibold">Mentorship</h3>
                <p className="text-sm">Learn from industry experts</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Career Growth</h3>
                <p className="text-sm">Path to full-time opportunities</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Software Engineering</h3>
              <p className="text-neutral-600 mb-4">Build scalable web applications</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• Full-stack development</p>
                <p>• Modern JavaScript frameworks</p>
                <p>• Cloud technologies</p>
                <p>• 12-week program</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Skills You&apos;ll Learn</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• React & Node.js</li>
                <li>• AWS/Azure deployment</li>
                <li>• Agile development</li>
                <li>• Code review processes</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Product Design</h3>
              <p className="text-neutral-600 mb-4">Create user-centered travel experiences</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• UX/UI design</p>
                <p>• User research</p>
                <p>• Prototyping</p>
                <p>• 10-week program</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Skills You&apos;ll Learn</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Figma & design tools</li>
                <li>• User experience principles</li>
                <li>• Design systems</li>
                <li>• Usability testing</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Data Science</h3>
              <p className="text-neutral-600 mb-4">Analyze travel trends and user behavior</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• Data analysis</p>
                <p>• Machine learning</p>
                <p>• Business intelligence</p>
                <p>• 14-week program</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Skills You&apos;ll Learn</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Python & SQL</li>
                <li>• Data visualization</li>
                <li>• Statistical analysis</li>
                <li>• A/B testing</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Marketing</h3>
              <p className="text-neutral-600 mb-4">Digital marketing and content creation</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• Social media strategy</p>
                <p>• Content marketing</p>
                <p>• SEO optimization</p>
                <p>• 10-week program</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Skills You&apos;ll Learn</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Social media marketing</li>
                <li>• Content strategy</li>
                <li>• Analytics & reporting</li>
                <li>• Brand storytelling</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Product Management</h3>
              <p className="text-neutral-600 mb-4">Drive product strategy and development</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• Product strategy</p>
                <p>• Roadmap planning</p>
                <p>• User research</p>
                <p>• 12-week program</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Skills You&apos;ll Learn</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Product development</li>
                <li>• User story creation</li>
                <li>• Agile methodologies</li>
                <li>• Stakeholder management</li>
              </ul>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block"></span>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Operations</h3>
              <p className="text-neutral-600 mb-4">Streamline business processes</p>
              <div className="text-sm text-neutral-500 space-y-1">
                <p>• Process optimization</p>
                <p>• Customer support</p>
                <p>• Vendor management</p>
                <p>• 10-week program</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Skills You&apos;ll Learn</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Operational efficiency</li>
                <li>• Customer service</li>
                <li>• Project management</li>
                <li>• Data analysis</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Program Details</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">What You&apos;ll Get</h3>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Competitive Compensation</h4>
                    <p className="text-sm">Paid internships with hourly rates starting at $25/hour</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">‍</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Mentorship Program</h4>
                    <p className="text-sm">One-on-one mentorship with senior team members</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Learning Opportunities</h4>
                    <p className="text-sm">Workshops, online courses, and professional development</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Social Events</h4>
                    <p className="text-sm">Team outings, hackathons, and networking events</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Eligibility & Timeline</h3>
              <ul className="space-y-3 text-neutral-600">
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Academic Status</h4>
                    <p className="text-sm">Current students or recent graduates (within 12 months)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Program Duration</h4>
                    <p className="text-sm">10-14 weeks, typically summer or fall semesters</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Locations</h4>
                    <p className="text-sm">New York, San Francisco, London, Berlin, and remote options</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Application Process</h4>
                    <p className="text-sm">Resume submission, coding challenge, and interviews</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Intern Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-6">
              <blockquote className="text-neutral-700 italic mb-3">
                "My internship at ATLVS + GVTEWAY was transformative. I worked on real features that
                impacted millions of users and learned more in 12 weeks than I did in a year of classes.
                Now I&apos;m a full-time engineer here!"
              </blockquote>
              <p className="text-sm font-medium text-neutral-900">- Alex Johnson, Former Intern (Now Senior Engineer)</p>
            </div>
            <div className="bg-background rounded-lg p-6">
              <blockquote className="text-neutral-700 italic mb-3">
                "The mentorship program was incredible. My mentor guided me through complex projects and
                helped me develop the skills I needed for my career. The experience was invaluable."
              </blockquote>
              <p className="text-sm font-medium text-neutral-900">- Sarah Chen, Former Intern (Now Product Manager)</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Career Development</h2>
          <p className="text-blue-800 mb-4">
            Our internship program is designed as a pathway to full-time employment.
            Many of our interns continue their careers with us after graduation.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">75%</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Return Rate</h3>
              <p className="text-sm text-blue-800">Interns who return for full-time positions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">90%</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Satisfaction Rate</h3>
              <p className="text-sm text-blue-800">Interns who rate their experience highly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">4.9</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Average Rating</h3>
              <p className="text-sm text-blue-800">Out of 5 stars from exit surveys</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Apply for an Internship</h2>
          <p className="text-neutral-600 mb-6">Join our talented team of interns and start building your career in travel technology</p>
          <Button className="bg-semantic-success text-primary-foreground px-8 py-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 font-semibold text-lg">
            Apply Now
          </Button>
          <p className="text-sm text-neutral-500 mt-4">
            Applications typically open in January for summer internships and September for winter/spring internships.
          </p>
        </div>
      </div>
    </div>
  )
}
