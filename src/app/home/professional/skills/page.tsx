
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Skills Management | ATLVS + GVTEWAY',
  description: 'Manage and showcase your professional skills and expertise to potential clients.',
}

export default function HomeProfessionalSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Skills Management</h1>
          <p className="text-neutral-600">Showcase your expertise and get matched with relevant opportunities</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Core Skills</h2>
            <div className="space-y-4">
              {[
                { name: 'Photography', level: 95, endorsed: 12 },
                { name: 'Content Creation', level: 90, endorsed: 8 },
                { name: 'Social Media Marketing', level: 85, endorsed: 15 },
                { name: 'Video Production', level: 80, endorsed: 6 },
                { name: 'Adobe Creative Suite', level: 88, endorsed: 9 }
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-900">{skill.name}</span>
                    <span className="text-sm text-neutral-600">{skill.endorsed} endorsements</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-accent-secondary h-2 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-neutral-500">Expert</span>
                    <Button className="text-xs text-accent-secondary hover:text-blue-800">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Add New Skill
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Skill Categories</h2>
            <div className="space-y-3">
              {[
                { category: 'Creative', skills: ['Photography', 'Videography', 'Graphic Design'], count: 3 },
                { category: 'Technical', skills: ['Video Editing', 'Adobe Suite', 'Drone Operation'], count: 3 },
                { category: 'Business', skills: ['Project Management', 'Client Relations', 'Marketing'], count: 3 },
                { category: 'Specialized', skills: ['Travel Planning', 'Cultural Expertise', 'Language Skills'], count: 3 }
              ].map((cat) => (
                <div key={cat.category} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-neutral-900">{cat.category}</h3>
                    <span className="text-sm text-neutral-600">{cat.count} skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((skill) => (
                      <span key={skill} className="bg-accent-primary/10 text-blue-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Skill Assessment</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Skills Match</h3>
              <p className="text-sm text-neutral-600">87% match with available opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Profile Strength</h3>
              <p className="text-sm text-neutral-600">Strong - Ready for opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Top Skill</h3>
              <p className="text-sm text-neutral-600">Photography (95% proficiency)</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Skill Development Recommendations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">High-Demand Skills</h3>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mr-3"></span>
                  AI Content Creation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mr-3"></span>
                  Drone Photography
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mr-3"></span>
                  Social Media Analytics
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Learning Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-accent-secondary hover:text-blue-800">
                   Photography Masterclass
                </a>
                <a href="#" className="block text-sm text-accent-secondary hover:text-blue-800">
                   Video Production Course
                </a>
                <a href="#" className="block text-sm text-accent-secondary hover:text-blue-800">
                   Social Media Certification
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
