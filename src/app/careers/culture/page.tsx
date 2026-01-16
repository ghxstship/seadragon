
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Culture | ATLVS + GVTEWAY Careers',
  description: 'Discover our company culture, values, and what makes working at ATLVS + GVTEWAY special.',
}

export default function CulturePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Our Culture</h1>
          <p className="text-lg text-neutral-600">Where innovation meets inspiration in the world of travel</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Life at ATLVS + GVTEWAY</h2>
            <p className="text-xl mb-6">We&apos;re not just building technology – we&apos;re creating experiences that connect people to the world</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Innovation First</h3>
            <p className="text-neutral-600">We embrace cutting-edge technology and creative problem-solving</p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Global Mindset</h3>
            <p className="text-neutral-600">Our diverse team spans cultures and continents</p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Collaborative Spirit</h3>
            <p className="text-neutral-600">We believe the best ideas come from working together</p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Impact Driven</h3>
            <p className="text-neutral-600">Every role contributes to transforming travel experiences</p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Our Core Values</h2>
          <div className="space-y-8">
            <div className="border-l-4 border-accent-primary pl-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Innovation</h3>
              <p className="text-neutral-700 mb-3">
                We constantly push boundaries and embrace new technologies to solve complex problems.
                Our team is encouraged to experiment, learn, and share knowledge.
              </p>
              <ul className="text-neutral-600 space-y-1">
                <li>• Dedicated innovation time for personal projects</li>
                <li>• Regular hackathons and brainstorming sessions</li>
                <li>• Access to cutting-edge tools and resources</li>
              </ul>
            </div>

            <div className="border-l-4 border-semantic-success pl-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Sustainability</h3>
              <p className="text-neutral-700 mb-3">
                We believe in responsible travel that protects our planet while creating meaningful experiences.
                Sustainability is woven into everything we do.
              </p>
              <ul className="text-neutral-600 space-y-1">
                <li>• Carbon-neutral company operations</li>
                <li>• Employee environmental initiatives</li>
                <li>• Support for sustainable travel partners</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Inclusivity</h3>
              <p className="text-neutral-700 mb-3">
                We celebrate diversity and create an environment where everyone feels welcome and valued.
                Our differences make us stronger as a team.
              </p>
              <ul className="text-neutral-600 space-y-1">
                <li>• Employee resource groups and diversity initiatives</li>
                <li>• Flexible work arrangements</li>
                <li>• Global holiday observances</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Excellence</h3>
              <p className="text-neutral-700 mb-3">
                We strive for excellence in everything we do, from code quality to customer service.
                We set high standards and celebrate achievements.
              </p>
              <ul className="text-neutral-600 space-y-1">
                <li>• Recognition programs for outstanding work</li>
                <li>• Continuous learning and development</li>
                <li>• Quality-focused development processes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Team Activities</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Monthly Team Events</h3>
                  <p className="text-sm text-neutral-600">From virtual game nights to in-person team building</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5">️</span>
                <div>
                  <h3 className="font-medium text-neutral-900">Travel Adventures</h3>
                  <p className="text-sm text-neutral-600">Company-sponsored trips and destination explorations</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-purple-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Learning Sessions</h3>
                  <p className="text-sm text-neutral-600">Internal workshops and guest speaker events</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-warning/10 text-orange-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Creative Projects</h3>
                  <p className="text-sm text-neutral-600">Innovation challenges and creative collaborations</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Work Environment</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-error/10 text-red-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Flexible Work</h3>
                  <p className="text-sm text-neutral-600">Remote, hybrid, and office options available</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5">️</span>
                <div>
                  <h3 className="font-medium text-neutral-900">Work-Life Balance</h3>
                  <p className="text-sm text-neutral-600">Unlimited PTO and mental health support</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5">‍‍‍</span>
                <div>
                  <h3 className="font-medium text-neutral-900">Family Friendly</h3>
                  <p className="text-sm text-neutral-600">Parental leave and family support programs</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-purple-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Growth Opportunities</h3>
                  <p className="text-sm text-neutral-600">Career development and advancement paths</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Employee Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-6">
              <blockquote className="text-neutral-700 mb-4 italic">
                "The culture here is incredible. Everyone is passionate about travel and innovation,
                and I learn something new every day. The flexibility allows me to balance work with my love for exploring."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-neutral-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-neutral-900">Sarah Chen</p>
                  <p className="text-sm text-neutral-600">Senior Product Manager</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6">
              <blockquote className="text-neutral-700 mb-4 italic">
                "Working at ATLVS + GVTEWAY feels like being part of a movement. We&apos;re not just building software –
                we&apos;re creating tools that help people discover and experience the world in new ways."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-neutral-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-neutral-900">Marcus Rodriguez</p>
                  <p className="text-sm text-neutral-600">Lead Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Diversity & Inclusion</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Global Perspectives</h3>
              <p className="text-sm text-neutral-600">Team members from 25+ countries bringing diverse viewpoints</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Inclusive Practices</h3>
              <p className="text-sm text-neutral-600">ERG groups, unconscious bias training, and inclusive hiring</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Equal Opportunities</h3>
              <p className="text-sm text-neutral-600">Blind recruitment and equal pay initiatives</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Experience Our Culture</h2>
          <p className="text-neutral-600 mb-6">Ready to join a team that&apos;s passionate about travel and innovation?</p>
          <div className="flex justify-center gap-4">
            <a href="/careers/openings" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              View Open Positions
            </a>
            <a href="/careers/benefits" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Learn About Benefits
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
