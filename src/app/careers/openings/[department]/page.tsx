
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

interface DepartmentPageProps {
  params: Promise<{ department: string }>
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const departmentName = department.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: `${departmentName} Jobs | ATLVS + GVTEWAY`,
    description: `Explore ${departmentName} career opportunities and job openings at ATLVS + GVTEWAY.`,
  }
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { department } = await params
  const departmentName = department.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <nav className="text-sm text-neutral-600 mb-4">
            <a href="/careers" className="hover:text-accent-secondary">Careers</a>
            <span className="mx-2">/</span>
            <a href="/careers/openings" className="hover:text-accent-secondary">Openings</a>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{departmentName}</span>
          </nav>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">{departmentName} Careers</h1>
          <p className="text-lg text-neutral-600">
            Join our {departmentName.toLowerCase()} team and help build the future of travel technology.
          </p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Open Positions in {departmentName}</h2>

          <div className="space-y-6">
            {[
              {
                title: "Senior Software Engineer",
                location: "New York, NY (Hybrid)",
                type: "Full-time",
                salary: "$140K - $180K",
                description: "Build scalable systems and work on cutting-edge travel technology.",
                requirements: ["5+ years experience", "React/Node.js", "AWS/Azure"],
                posted: "2 days ago"
              },
              {
                title: "Product Manager",
                location: "San Francisco, CA",
                type: "Full-time",
                salary: "$130K - $160K",
                description: "Drive product strategy and work with cross-functional teams.",
                requirements: ["3+ years PM experience", "Travel industry knowledge", "Data-driven"],
                posted: "1 week ago"
              },
              {
                title: "UX Designer",
                location: "Remote",
                type: "Full-time",
                salary: "$90K - $120K",
                description: "Create intuitive user experiences for our travel platform.",
                requirements: ["Portfolio required", "Figma/Sketch", "User research experience"],
                posted: "3 days ago"
              },
              {
                title: "DevOps Engineer",
                location: "Remote",
                type: "Full-time",
                salary: "$120K - $150K",
                description: "Maintain and optimize our cloud infrastructure.",
                requirements: ["Kubernetes experience", "CI/CD pipelines", "Monitoring tools"],
                posted: "5 days ago"
              }
            ].map((job, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-1">{job.title}</h3>
                    <p className="text-neutral-600 mb-2">{job.location} • {job.type}</p>
                    <p className="text-sm text-neutral-500 mb-3">{job.salary}</p>
                    <p className="text-neutral-700 mb-3">{job.description}</p>
                    <div className="mb-3">
                      <h4 className="font-medium text-neutral-900 mb-2">Requirements:</h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-accent-secondary rounded-full mr-2"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-neutral-500">Posted {job.posted}</p>
                  </div>
                  <Button className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ml-4">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">About the {departmentName} Team</h2>
          <p className="text-neutral-600 mb-6">
            Our {departmentName.toLowerCase()} team is at the forefront of innovation, working on projects that impact millions of travelers worldwide.
            We value collaboration, creativity, and a passion for solving complex problems.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">What We Do</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Build scalable software solutions</li>
                <li>• Drive product innovation</li>
                <li>• Solve complex technical challenges</li>
                <li>• Collaborate with cross-functional teams</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">What We Offer</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Competitive compensation</li>
                <li>• Professional development opportunities</li>
                <li>• Flexible work arrangements</li>
                <li>• Cutting-edge technology stack</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Ready to Join Our Team?</h2>
          <p className="text-blue-800 mb-4">
            Don't see a position that matches your skills? We're always interested in talented individuals who share our passion for travel and technology.
          </p>
          <div className="flex gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Submit General Application
            </Button>
            <a href="/careers" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Back to Careers
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
