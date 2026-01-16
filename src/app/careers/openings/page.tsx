
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Open Positions | ATLVS + GVTEWAY',
  description: 'Explore current job openings and career opportunities at ATLVS + GVTEWAY.',
}

export default function OpeningsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Open Positions</h1>
          <p className="text-lg text-neutral-600">Join our team and help shape the future of travel</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>
          <div className="flex gap-2">
            <Select className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <SelectItem value="all-departments">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
            </Select>
            <Select className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <SelectItem value="all-locations">All Locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="new-york-ny">New York, NY</SelectItem>
              <SelectItem value="san-francisco-ca">San Francisco, CA</SelectItem>
              <SelectItem value="london-uk">London, UK</SelectItem>
              <SelectItem value="berlin-germany">Berlin, Germany</SelectItem>
            </Select>
            <Select className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </Select>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Featured Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Senior Software Engineer",
                department: "Engineering",
                location: "New York, NY (Hybrid)",
                type: "Full-time",
                salary: "$140K - $180K",
                featured: true,
                urgent: true
              },
              {
                title: "Travel Experience Designer",
                department: "Product",
                location: "Remote",
                type: "Full-time",
                salary: "$100K - $130K",
                featured: true,
                urgent: false
              }
            ].map((job, index) => (
              <div key={index} className={`border border-neutral-200 rounded-lg p-6 hover:border-blue-300 transition-colors ${job.featured ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-1">{job.title}</h3>
                    <p className="text-neutral-600 mb-2">{job.department} • {job.location}</p>
                    <p className="text-sm text-neutral-500">{job.type} • {job.salary}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {job.urgent && (
                      <span className="bg-semantic-error/10 text-red-800 text-xs px-2 py-1 rounded">Urgent</span>
                    )}
                    {job.featured && (
                      <span className="bg-accent-primary/10 text-blue-800 text-xs px-2 py-1 rounded">Featured</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-neutral-500">
                    Posted 2 days ago
                  </div>
                  <Button className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">All Open Positions</h2>
          <div className="space-y-4">
            {[
              {
                title: "Senior Software Engineer",
                department: "Engineering",
                location: "New York, NY",
                type: "Full-time",
                salary: "$140K - $180K"
              },
              {
                title: "Product Manager",
                department: "Product",
                location: "San Francisco, CA",
                type: "Full-time",
                salary: "$130K - $160K"
              },
              {
                title: "UX Designer",
                department: "Design",
                location: "Remote",
                type: "Full-time",
                salary: "$90K - $120K"
              },
              {
                title: "Content Marketing Manager",
                department: "Marketing",
                location: "New York, NY",
                type: "Full-time",
                salary: "$85K - $110K"
              },
              {
                title: "Sales Development Representative",
                department: "Sales",
                location: "Remote",
                type: "Full-time",
                salary: "$60K - $80K + Commission"
              },
              {
                title: "Customer Success Manager",
                department: "Operations",
                location: "London, UK",
                type: "Full-time",
                salary: "£50K - £65K"
              },
              {
                title: "Data Analyst",
                department: "Analytics",
                location: "Berlin, Germany",
                type: "Full-time",
                salary: "€55K - €75K"
              },
              {
                title: "DevOps Engineer",
                department: "Engineering",
                location: "Remote",
                type: "Full-time",
                salary: "$120K - $150K"
              },
              {
                title: "Legal Counsel",
                department: "Legal",
                location: "New York, NY",
                type: "Full-time",
                salary: "$150K - $190K"
              },
              {
                title: "HR Business Partner",
                department: "People",
                location: "San Francisco, CA",
                type: "Full-time",
                salary: "$110K - $140K"
              }
            ].map((job, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-6 hover:border-neutral-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">{job.title}</h3>
                    <p className="text-neutral-600 mb-1">{job.department} • {job.location}</p>
                    <p className="text-sm text-neutral-500">{job.type} • {job.salary}</p>
                  </div>
                  <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Department Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="/careers/openings/engineering" className="bg-background rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Engineering</h3>
              <p className="text-sm text-neutral-600">12 open positions</p>
            </a>
            <a href="/careers/openings/product" className="bg-background rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Product</h3>
              <p className="text-sm text-neutral-600">8 open positions</p>
            </a>
            <a href="/careers/openings/marketing" className="bg-background rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Marketing</h3>
              <p className="text-sm text-neutral-600">6 open positions</p>
            </a>
            <a href="/careers/openings/sales" className="bg-background rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Sales</h3>
              <p className="text-sm text-neutral-600">4 open positions</p>
            </a>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Don't See Your Role?</h2>
          <p className="text-blue-800 mb-4">
            We're always looking for talented individuals to join our team. Send us your resume and let us know
            how you'd like to contribute to our mission.
          </p>
          <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
            Submit General Application
          </Button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Questions About Working Here?</h2>
          <p className="text-neutral-600 mb-6">Learn more about our culture, benefits, and what it's like to work at ATLVS + GVTEWAY.</p>
          <div className="flex justify-center gap-4">
            <a href="/careers/culture" className="bg-semantic-success text-primary-foreground px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
              Our Culture
            </a>
            <a href="/careers/benefits" className="bg-accent-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Benefits
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
