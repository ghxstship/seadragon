
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'Professional Resume | ATLVS + GVTEWAY',
  description: 'Build and manage your professional resume to showcase your experience and qualifications.',
}

export default function HomeProfessionalResumePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Professional Resume</h1>
          <p className="text-neutral-600">Create a compelling resume showcasing your expertise</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Resume Builder</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-neutral-900 mb-3">Professional Summary</h3>
                  <Textarea
                    rows={4}
                    defaultValue="Experienced travel photographer with 8+ years in capturing stunning destinations worldwide. Specialized in adventure and cultural photography for luxury brands and publications. Proficient in Adobe Creative Suite and drone photography."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    placeholder="Write a compelling summary of your professional background..."/>
                </div>

                <div>
                  <h3 className="text-md font-medium text-neutral-900 mb-3">Experience</h3>
                  <div className="space-y-4">
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-neutral-900">Freelance Travel Photographer</h4>
                          <p className="text-sm text-neutral-600">Self-Employed • 2018 - Present</p>
                        </div>
                        <Button className="text-semantic-error hover:text-red-800 text-sm">Remove</Button>
                      </div>
                      <ul className="text-sm text-neutral-700 space-y-1">
                        <li>• Photographed for luxury travel brands and publications</li>
                        <li>• Managed end-to-end project delivery from concept to final edits</li>
                        <li>• Built portfolio that attracted high-profile clients</li>
                      </ul>
                    </div>

                    <div className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-neutral-900">Photo Editor</h4>
                          <p className="text-sm text-neutral-600">Adventure Magazine • 2016 - 2018</p>
                        </div>
                        <Button className="text-semantic-error hover:text-red-800 text-sm">Remove</Button>
                      </div>
                      <ul className="text-sm text-neutral-700 space-y-1">
                        <li>• Edited and retouched travel photography for print and digital</li>
                        <li>• Collaborated with photographers on creative direction</li>
                        <li>• Maintained quality standards for publication</li>
                      </ul>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-md hover:bg-neutral-200">
                    + Add Experience
                  </Button>
                </div>

                <div>
                  <h3 className="text-md font-medium text-neutral-900 mb-3">Education</h3>
                  <div className="space-y-4">
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-neutral-900">Bachelor of Fine Arts in Photography</h4>
                          <p className="text-sm text-neutral-600">New York Institute of Photography • 2012 - 2016</p>
                        </div>
                        <Button className="text-semantic-error hover:text-red-800 text-sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-md hover:bg-neutral-200">
                    + Add Education
                  </Button>
                </div>

                <div>
                  <h3 className="text-md font-medium text-neutral-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-accent-primary/10 text-blue-800 px-3 py-1 rounded-full text-sm">Photography</span>
                    <span className="bg-accent-primary/10 text-blue-800 px-3 py-1 rounded-full text-sm">Adobe Photoshop</span>
                    <span className="bg-accent-primary/10 text-blue-800 px-3 py-1 rounded-full text-sm">Drone Operation</span>
                    <span className="bg-accent-primary/10 text-blue-800 px-3 py-1 rounded-full text-sm">Content Creation</span>
                    <span className="bg-accent-primary/10 text-blue-800 px-3 py-1 rounded-full text-sm">Client Relations</span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Add a skill..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Resume Preview</h2>
              <div className="bg-neutral-100 rounded-lg p-4 text-center">
                <div className="text-4xl text-neutral-400 mb-2"></div>
                <p className="text-sm text-neutral-600">Resume preview will appear here</p>
                <Button className="mt-2 text-accent-secondary hover:text-blue-800 text-sm">
                  Generate Preview
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Templates</h2>
              <div className="space-y-3">
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-3 cursor-pointer">
                  <h4 className="font-medium text-blue-900">Creative Template</h4>
                  <p className="text-sm text-accent-tertiary">Perfect for photographers and creatives</p>
                </div>
                <div className="border border-neutral-200 rounded-lg p-3 cursor-pointer hover:border-neutral-300">
                  <h4 className="font-medium text-neutral-900">Professional Template</h4>
                  <p className="text-sm text-neutral-600">Clean and corporate style</p>
                </div>
                <div className="border border-neutral-200 rounded-lg p-3 cursor-pointer hover:border-neutral-300">
                  <h4 className="font-medium text-neutral-900">Modern Template</h4>
                  <p className="text-sm text-neutral-600">Contemporary design</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Export Options</h2>
              <div className="space-y-2">
                <Button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                   Download as PDF
                </Button>
                <Button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                   Download as Word
                </Button>
                <Button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                   Get Shareable Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
