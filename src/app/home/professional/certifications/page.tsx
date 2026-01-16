
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Certifications | ATLVS + GVTEWAY',
  description: 'Manage your professional certifications and qualifications to build credibility with clients.',
}

export default function HomeProfessionalCertificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Certifications</h1>
            <p className="text-neutral-600">Showcase your professional qualifications</p>
          </div>
          <a href="/home/professional/certifications/add" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
            Add Certification
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Certifications</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl"></span>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">Certified Professional Photographer</h3>
                      <p className="text-sm text-neutral-600">Professional Photographers of America</p>
                    </div>
                  </div>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>Issued: Jan 2022</span>
                  <span>Expires: Jan 2025</span>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl"></span>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">Adobe Certified Expert</h3>
                      <p className="text-sm text-neutral-600">Adobe Systems</p>
                    </div>
                  </div>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>Issued: Jun 2023</span>
                  <span>Expires: Jun 2026</span>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl"></span>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">Content Marketing Certified</h3>
                      <p className="text-sm text-neutral-600">Content Marketing Institute</p>
                    </div>
                  </div>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>Issued: Mar 2023</span>
                  <span>Lifetime</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Certification Stats</h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-secondary mb-1">7</div>
                <div className="text-sm text-neutral-600">Total Certifications</div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-700">Photography</span>
                    <span className="text-sm text-neutral-600">3</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-accent-secondary h-2 rounded-full w-[43%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-700">Digital Marketing</span>
                    <span className="text-sm text-neutral-600">2</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-semantic-success h-2 rounded-full w-[29%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-700">Technical Skills</span>
                    <span className="text-sm text-neutral-600">2</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-accent-primary h-2 rounded-full w-[29%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recommended Certifications</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">AI Content Creation</h3>
              <p className="text-sm text-neutral-600 mb-3">Learn to leverage AI tools for content creation</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Google</span>
                <span className="text-sm font-medium text-accent-secondary">View Course</span>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Social Media Analytics</h3>
              <p className="text-sm text-neutral-600 mb-3">Master social media metrics and insights</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">HubSpot</span>
                <span className="text-sm font-medium text-semantic-success">View Course</span>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Advanced Photography</h3>
              <p className="text-sm text-neutral-600 mb-3">Professional photography techniques</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">National Geographic</span>
                <span className="text-sm font-medium text-accent-primary">View Course</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Certification Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Client Trust</h3>
              <p className="text-sm text-neutral-600">
                Certifications demonstrate your expertise and build credibility with potential clients.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Marketability</h3>
              <p className="text-sm text-neutral-600">
                Stand out in a competitive market with recognized qualifications and skills.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Networking</h3>
              <p className="text-sm text-neutral-600">
                Join professional networks and communities through certification programs.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Career Growth</h3>
              <p className="text-sm text-neutral-600">
                Open doors to higher-paying opportunities and advanced career paths.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
