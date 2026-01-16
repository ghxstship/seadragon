
'use client'

import { logger } from '@/lib/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, Download, FileText, Calendar, Shield, Info } from 'lucide-react'

const dataCategories = [
  {
    category: 'Profile Information',
    description: 'Basic account details and preferences',
    includes: ['Name', 'Email', 'Phone', 'Profile settings', 'Preferences'],
    format: 'JSON',
    size: '~2KB'
  },
  {
    category: 'Booking History',
    description: 'Complete booking and transaction records',
    includes: ['Booking details', 'Payment history', 'Travel records', 'Cancellations'],
    format: 'JSON/CSV',
    size: 'Varies by usage'
  },
  {
    category: 'Communication Data',
    description: 'Messages, notifications, and support interactions',
    includes: ['Email communications', 'Support tickets', 'Notifications', 'Feedback'],
    format: 'JSON',
    size: '~50KB'
  },
  {
    category: 'Usage Analytics',
    description: 'Aggregated usage statistics and analytics',
    includes: ['Page views', 'Feature usage', 'Session data', 'Performance metrics'],
    format: 'JSON',
    size: '~10KB'
  },
  {
    category: 'Social Data',
    description: 'Social interactions and connections',
    includes: ['Reviews', 'Ratings', 'Followers', 'Following', 'Social shares'],
    format: 'JSON',
    size: '~5KB'
  },
  {
    category: 'Device & Access Data',
    description: 'Login history and device information',
    includes: ['Login sessions', 'Device info', 'IP addresses', 'Access logs'],
    format: 'JSON',
    size: '~15KB'
  }
]

export default function DataPortabilityPage() {
  const handleExportRequest = async (category: string) => {
    // In a real implementation, this would initiate the data export process
    logger.action('data_export_request', { category })

    // Show loading state
    const button = document.querySelector(`[data-category="${category}"]`) as HTMLButtonElement
    if (button) {
      button.textContent = 'Processing...'
      button.disabled = true
    }

    // Simulate API call
    setTimeout(() => {
      alert(`Export request for ${category} has been submitted. You'll receive an email when ready.`)
      if (button) {
        button.textContent = 'Request Export'
        button.disabled = false
      }
    }, 2000)
  }

  const handleFullExport = () => {
    alert('Full data export request submitted. This may take up to 30 days to complete.')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-8 w-8 text-accent-secondary"/>
            <h1 className="text-3xl font-bold text-neutral-900">Data Portability</h1>
          </div>
          <p className="text-lg text-neutral-600 mb-4">
            Under the EU Data Act, you have the right to obtain and reuse your personal data in a machine-readable format.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-accent-secondary"/>
              <p className="text-sm text-blue-800">
                <strong>EU Data Act Compliance:</strong> Data exports are provided free of charge within 30 days of request.
                You can also request data deletion or restriction at any time.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5"/>
                Export Your Data
              </CardTitle>
              <CardDescription>
                Choose specific data categories or request a complete export of all your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {dataCategories.map((item, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.category}</h3>
                        <Badge variant="outline">{item.format}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="text-xs text-muted-foreground mb-3">
                        <strong>Includes:</strong> {item.includes.join(', ')}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Size: {item.size}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          data-category={item.category}
                          onClick={() => handleExportRequest(item.category)}
                        >
                          Request Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert className="mb-4">
                <Shield className="h-4 w-4"/>
                <AlertDescription>
                  <strong>Security Note:</strong> All data exports are encrypted and delivered via secure download links
                  that expire after 7 days. You will receive an email notification when your export is ready.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button onClick={handleFullExport} size="lg" className="gap-2">
                  <FileText className="h-4 w-4"/>
                  Request Complete Data Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5"/>
                Processing Timeline
              </CardTitle>
              <CardDescription>How long it takes to process your data export requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium">Profile & Usage Data</span>
                    <p className="text-sm text-muted-foreground">Basic account information</p>
                  </div>
                  <Badge className="bg-semantic-success">1-3 days</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <span className="font-medium">Booking History</span>
                    <p className="text-sm text-muted-foreground">Transaction and travel records</p>
                  </div>
                  <Badge className="bg-semantic-warning">7-14 days</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <span className="font-medium">Complete Export</span>
                    <p className="text-sm text-muted-foreground">All data categories combined</p>
                  </div>
                  <Badge className="bg-semantic-warning">14-30 days</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Format & Compatibility</CardTitle>
              <CardDescription>Technical details about exported data formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">JSON Format</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Structured data in JSON format for programmatic access and reuse.
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                    {`{
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "profile": { ... }
  },
  "exportedAt": "2026-01-15T10:00:00Z"
}`}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">CSV Format</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tabular data in CSV format for spreadsheet applications.
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                    id,name,email,created_at<br/>
                    12345,John Doe,john@example.com,2023-01-15
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Compatibility:</strong> All exports are compatible with major data analysis tools,
                  spreadsheet applications, and can be imported into other services.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">EU Data Act Rights</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Data Portability</h3>
              <p className="text-sm text-muted-foreground">
                Receive your data in machine-readable format and transfer it to other services.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Service Switching</h3>
              <p className="text-sm text-muted-foreground">
                Switch to competing services with 2-month notice, no additional charges.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">API Access</h3>
              <p className="text-sm text-muted-foreground">
                Access your data through standardized APIs for seamless integration.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Data Deletion</h3>
              <p className="text-sm text-muted-foreground">
                Request complete deletion of your data when switching services.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">Important Information</h2>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Data exports are provided free of charge</li>
            <li>• Processing time depends on data volume and complexity</li>
            <li>• You will receive email notifications about export status</li>
            <li>• Download links expire after 7 days for security</li>
            <li>• Some data may be anonymized or aggregated for privacy</li>
            <li>• Historical data older than 7 years may not be available</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">
            Questions about data portability or the EU Data Act?
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/contact?subject=Data%20Portability">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/legal/privacy">Privacy Policy</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
