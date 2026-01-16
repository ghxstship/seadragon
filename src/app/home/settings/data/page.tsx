
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Data Export | ATLVS + GVTEWAY',
  description: 'Download and manage your personal data from ATLVS + GVTEWAY.',
}

export default function HomeSettingsDataPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Data Export</h1>
          <p className="text-neutral-600">Download your personal data and manage your information</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Request Data Export</h2>
            <div className="space-y-4">
              <p className="text-neutral-600 text-sm">
                You can download a complete copy of all your personal data stored on our platform.
                This includes your profile information, travel history, reviews, and activity data.
              </p>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">What's included:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Profile information and settings</li>
                  <li>• Travel bookings and itineraries</li>
                  <li>• Reviews and ratings</li>
                  <li>• Payment and transaction history</li>
                  <li>• Communication and message history</li>
                  <li>• Activity logs and preferences</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Input type="checkbox" id="include-media" className="mr-3" defaultChecked />
                  <label htmlFor="include-media" className="text-sm">
                    Include uploaded photos and media files
                  </label>
                </div>
                <div className="flex items-center">
                  <Input type="checkbox" id="include-deleted" className="mr-3" />
                  <label htmlFor="include-deleted" className="text-sm">
                    Include deleted items and archived data
                  </label>
                </div>
              </div>

              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Request Data Export
              </Button>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Export History</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-neutral-900">Complete Data Export</h3>
                    <p className="text-sm text-neutral-600">Requested on March 1, 2024</p>
                  </div>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Ready</span>
                </div>
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                  Download (2.3 GB)
                </Button>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-neutral-900">Profile Data Only</h3>
                    <p className="text-sm text-neutral-600">Requested on February 15, 2024</p>
                  </div>
                  <span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded">Expired</span>
                </div>
                <p className="text-xs text-neutral-500">Download link expired after 7 days</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  Export files are available for download for 7 days after completion.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Data Portability</h2>
            <div className="space-y-4">
              <p className="text-neutral-600 text-sm">
                Transfer your data to other services or keep a backup for your records.
              </p>

              <div className="space-y-3">
                <Button className="w-full text-left px-4 py-3 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="font-medium text-neutral-900">JSON Format</div>
                  <div className="text-sm text-neutral-600">Machine-readable format for developers</div>
                </Button>

                <Button className="w-full text-left px-4 py-3 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors">
                  <div className="font-medium text-neutral-900">CSV Format</div>
                  <div className="text-sm text-neutral-600">Spreadsheet format for easy viewing</div>
                </Button>

                <Button className="w-full text-left px-4 py-3 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors">
                  <div className="font-medium text-neutral-900">PDF Report</div>
                  <div className="text-sm text-neutral-600">Human-readable summary report</div>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Data Management</h2>
            <div className="space-y-4">
              <p className="text-neutral-600 text-sm">
                Review and manage specific types of data stored in your account.
              </p>

              <div className="space-y-3">
                <Button className="w-full text-left px-4 py-3 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="font-medium text-neutral-900">Review Data</div>
                  <div className="text-sm text-neutral-600">View and edit your reviews (24 items)</div>
                </Button>

                <Button className="w-full text-left px-4 py-3 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors">
                  <div className="font-medium text-neutral-900">Uploaded Media</div>
                  <div className="text-sm text-neutral-600">Manage photos and files (156 items)</div>
                </Button>

                <Button className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:border-red-300 transition-colors">
                  <div className="font-medium text-red-900">Delete Data</div>
                  <div className="text-sm text-semantic-error">Permanently remove specific data</div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Data Privacy & Security</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">How we protect your data</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• End-to-end encryption for sensitive data</li>
                <li>• Secure cloud storage with access controls</li>
                <li>• Regular security audits and updates</li>
                <li>• Two-factor authentication for account access</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Your rights</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Access to all your personal data</li>
                <li>• Correct inaccurate information</li>
                <li>• Delete your data permanently</li>
                <li>• Data portability between services</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-4">
              <h3 className="font-medium text-neutral-900 mb-2">How long does an export take?</h3>
              <p className="text-sm text-neutral-600">
                Most exports are processed within 24-48 hours. Large exports with media files may take up to 72 hours.
              </p>
            </div>

            <div className="border-b border-neutral-200 pb-4">
              <h3 className="font-medium text-neutral-900 mb-2">What format is the data in?</h3>
              <p className="text-sm text-neutral-600">
                You can choose between JSON (developer-friendly), CSV (spreadsheet), or PDF (readable report) formats.
              </p>
            </div>

            <div className="border-b border-neutral-200 pb-4">
              <h3 className="font-medium text-neutral-900 mb-2">Can I delete my data instead?</h3>
              <p className="text-sm text-neutral-600">
                Yes, you can request account deletion in your account settings. This permanently removes all your data.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Need help with data export?</h3>
              <p className="text-sm text-neutral-600">
                Contact our support team if you have questions about accessing or understanding your data.
              </p>
              <Button className="mt-2 bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
