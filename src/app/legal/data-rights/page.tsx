
import { Metadata } from 'next'
import { logger } from '@/lib/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Download, Eye, Trash2, UserCheck, UserX } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Data Subject Rights | ATLVS + GVTEWAY',
  description: 'Exercise your GDPR data subject rights including access, rectification, erasure, and portability.',
}

const rights = [
  {
    id: 'access',
    title: 'Right to Access',
    icon: Eye,
    description: 'Request a copy of all personal data we hold about you.',
    processingTime: '30 days',
    category: 'Information'
  },
  {
    id: 'rectification',
    title: 'Right to Rectification',
    icon: UserCheck,
    description: 'Request correction of inaccurate or incomplete personal data.',
    processingTime: '30 days',
    category: 'Correction'
  },
  {
    id: 'erasure',
    title: 'Right to Erasure',
    icon: Trash2,
    description: 'Request deletion of your personal data (right to be forgotten).',
    processingTime: '30 days',
    category: 'Deletion'
  },
  {
    id: 'portability',
    title: 'Right to Data Portability',
    icon: Download,
    description: 'Request your data in a structured, machine-readable format.',
    processingTime: '30 days',
    category: 'Transfer'
  },
  {
    id: 'restriction',
    title: 'Right to Restriction',
    icon: AlertTriangle,
    description: 'Request limitation of processing of your personal data.',
    processingTime: 'Immediate',
    category: 'Processing'
  },
  {
    id: 'objection',
    title: 'Right to Object',
    icon: UserX,
    description: 'Object to processing based on legitimate interests or direct marketing.',
    processingTime: 'Immediate',
    category: 'Processing'
  }
]

export default function DataRightsPage() {
  const handleRequest = async (rightId: string) => {
    try {
      const response = await fetch(`/api/data-rights/${rightId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Request submitted successfully: ${data.message}`)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      logger.error('Request error', error)
      alert('An error occurred while submitting your request. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Your Data Subject Rights</h1>
          <p className="text-lg text-neutral-600 mb-4">
            Under GDPR and other privacy regulations, you have several rights regarding your personal data.
            Exercise these rights below.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> To verify your identity and protect your privacy, we may require additional
              verification before processing your request. Processing times may vary based on complexity.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {rights.map((right) => {
            const Icon = right.icon
            return (
              <Card key={right.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className="h-8 w-8 text-accent-primary mb-2"/>
                    <Badge variant="secondary">{right.processingTime}</Badge>
                  </div>
                  <CardTitle className="text-lg">{right.title}</CardTitle>
                  <CardDescription>{right.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{right.category}</Badge>
                    <Button
                      size="sm"
                      onClick={() => handleRequest(right.id)}
                      className="ml-auto"
                    >
                      Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">How It Works</h2>
          <div className="space-y-4 text-sm text-neutral-700">
            <div>
              <h3 className="font-medium mb-1">1. Submit Your Request</h3>
              <p>Click "Request" on any right above to initiate the process.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">2. Identity Verification</h3>
              <p>We'll ask for information to verify your identity and ensure we're responding to the right person.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">3. Processing</h3>
              <p>We'll process your request within the timeframe shown. Complex requests may take longer.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">4. Response</h3>
              <p>You'll receive a response via email with the results or next steps.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">Important Information</h2>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Some rights may not apply in all situations (e.g., if we have legal obligations to retain data)</li>
            <li>• We'll explain our decision if we decline to fulfill a request</li>
            <li>• You can appeal our decision through our supervisory authority</li>
            <li>• Processing is free of charge, though excessive requests may incur reasonable fees</li>
            <li>• You can withdraw consent at any time for future processing</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">
            Need help or have questions about your rights?
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/contact">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/legal/privacy">View Privacy Policy</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
