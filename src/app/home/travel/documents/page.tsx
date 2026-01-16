
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Travel Documents | ATLVS + GVTEWAY',
  description: 'Manage your travel documents, visas, and important paperwork for your trips.',
}

export default function HomeTravelDocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Travel Documents</h1>
          <p className="text-neutral-600">Keep your important travel documents organized and up to date</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Passport Information</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-blue-900">United States Passport</h3>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Valid</span>
                </div>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Number:</strong> 123456789</p>
                  <p><strong>Issued:</strong> January 15, 2020</p>
                  <p><strong>Expires:</strong> January 15, 2030</p>
                  <p><strong>Place of Issue:</strong> New York, NY</p>
                </div>
              </div>

              <div className="text-center">
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded hover:bg-accent-tertiary">
                  Update Passport Info
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Visa Status</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-green-900">Japan Visa</h3>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                </div>
                <div className="text-sm text-green-800 space-y-1">
                  <p><strong>Type:</strong> Tourist Visa</p>
                  <p><strong>Valid Until:</strong> March 15, 2024</p>
                  <p><strong>Entries:</strong> Multiple Entry</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-yellow-900">Schengen Visa</h3>
                  <span className="bg-semantic-warning/10 text-yellow-800 text-xs px-2 py-1 rounded">Expiring Soon</span>
                </div>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p><strong>Type:</strong> Tourist Visa</p>
                  <p><strong>Expires:</strong> April 30, 2024</p>
                  <p><strong>Days Used:</strong> 45/90</p>
                </div>
              </div>

              <div className="text-center">
                <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded hover:bg-green-700">
                  Add New Visa
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Document Library</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-accent-secondary"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Passport Scan</h3>
                  <p className="text-sm text-neutral-600">Updated Jan 2024</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">View</Button>
                <Button className="text-neutral-600 hover:text-neutral-800 text-sm">Download</Button>
              </div>
            </div>

            <div className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-semantic-success">️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Japan Visa</h3>
                  <p className="text-sm text-neutral-600">Valid until Mar 2024</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">View</Button>
                <Button className="text-neutral-600 hover:text-neutral-800 text-sm">Download</Button>
              </div>
            </div>

            <div className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-accent-primary"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Vaccination Records</h3>
                  <p className="text-sm text-neutral-600">COVID-19, Hepatitis A</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">View</Button>
                <Button className="text-neutral-600 hover:text-neutral-800 text-sm">Download</Button>
              </div>
            </div>

            <div className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-semantic-warning/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-semantic-warning">️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Travel Insurance</h3>
                  <p className="text-sm text-neutral-600">Policy #TI-2024-001</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">View</Button>
                <Button className="text-neutral-600 hover:text-neutral-800 text-sm">Download</Button>
              </div>
            </div>

            <div className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-semantic-error/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-semantic-error"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Driver's License</h3>
                  <p className="text-sm text-neutral-600">Expires Jan 2026</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">View</Button>
                <Button className="text-neutral-600 hover:text-neutral-800 text-sm">Download</Button>
              </div>
            </div>

            <div className="p-4 border border-dashed border-neutral-300 rounded-lg text-center">
              <div className="text-4xl text-neutral-400 mb-2"></div>
              <p className="text-neutral-600 mb-2">Add New Document</p>
              <Button className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded hover:bg-neutral-200">
                Upload
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Document Alerts</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-semantic-warning">️</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-yellow-900">Passport Expires Soon</h3>
                    <p className="text-sm text-yellow-800">Your passport expires in 6 months. Consider renewing it.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-semantic-error/10 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-semantic-error"></span>
                  </div>
                  <div>
                    <h3 className="font-medium text-red-900">Visa Expires Soon</h3>
                    <p className="text-sm text-red-800">Your Schengen visa expires on April 30, 2024.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-accent-secondary">ℹ️</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">Document Required</h3>
                    <p className="text-sm text-blue-800">Some destinations require proof of vaccination.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Travel Requirements</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2">Japan - March 2024 Trip</h3>
                <div className="text-sm text-neutral-600 space-y-1">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-semantic-success rounded-full mr-2"></span>
                    <span>Valid passport </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-semantic-success rounded-full mr-2"></span>
                    <span>Japan visa </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-semantic-warning rounded-full mr-2"></span>
                    <span>COVID vaccination (recommended)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-neutral-900 mb-2">Upcoming Requirements</h3>
                <div className="text-sm text-neutral-600 space-y-1">
                  <li>• Check visa requirements for future destinations</li>
                  <li>• Renew expiring documents</li>
                  <li>• Update vaccination records</li>
                  <li>• Review travel insurance coverage</li>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Document Security</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Digital Storage</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Encrypted cloud storage</li>
                <li>• Automatic backups</li>
                <li>• Secure access controls</li>
                <li>• Multi-device sync</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Best Practices</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Keep physical copies in secure location</li>
                <li>• Scan important documents</li>
                <li>• Use password protection</li>
                <li>• Share only when necessary</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Export All Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
