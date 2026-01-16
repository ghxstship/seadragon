
'use client'

import { logger } from '@/lib/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, UserX } from 'lucide-react'

export default function CCPAOptOutPage() {
  const handleOptOut = async () => {
    // In a real implementation, this would:
    // 1. Verify the user's identity
    // 2. Add them to a do-not-sell list
    // 3. Stop selling their data to third parties
    // 4. Confirm the opt-out within 45 days
    logger.action('ccpa_opt_out_request')

    // For demo purposes, show an alert
    alert('Your opt-out request has been submitted. You will receive confirmation within 45 days.')
  }

  const handleOptIn = async () => {
    // Allow users to opt back in if they want
    logger.action('ccpa_opt_in_request')
    alert('Your opt-in request has been processed. You may now receive personalized offers.')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent-secondary"/>
            <h1 className="text-3xl font-bold text-neutral-900">California Privacy Rights</h1>
          </div>
          <p className="text-lg text-neutral-600 mb-4">
            Under the California Consumer Privacy Act (CCPA), you have the right to opt-out of the sale of your personal information.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-accent-secondary mt-0.5"/>
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> We do not sell personal information to third parties for monetary compensation.
                  However, we may share information with service providers or for business purposes as allowed by law.
                  You can opt-out of these sharing practices below.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <UserX className="h-8 w-8 text-semantic-error mb-2"/>
                <Badge variant="destructive">Opt Out</Badge>
              </div>
              <CardTitle className="text-lg">Do Not Sell My Information</CardTitle>
              <CardDescription>
                Opt-out of the sale or sharing of your personal information with third parties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>What happens when you opt out?</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>We stop selling your personal information</li>
                    <li>We limit sharing with third parties</li>
                    <li>You may still receive general marketing</li>
                    <li>Service functionality remains unchanged</li>
                  </ul>
                </div>
                <Button onClick={handleOptOut} variant="destructive" className="w-full">
                  Opt Out of Sale
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Shield className="h-8 w-8 text-semantic-success mb-2"/>
                <Badge variant="secondary">Current Status</Badge>
              </div>
              <CardTitle className="text-lg">Your Privacy Status</CardTitle>
              <CardDescription>
                Check your current opt-out status and privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Sale Opt-Out Status</span>
                  <Badge variant="outline">Not Opted Out</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Data Deletion Status</span>
                  <Badge variant="outline">No Request Pending</Badge>
                </div>
                <Button onClick={handleOptIn} variant="outline" className="w-full">
                  Opt Back In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Additional CCPA Rights</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Right to Know</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Request information about the personal data we collect, use, and share.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/legal/data-rights">Request Data</a>
              </Button>
            </div>
            <div>
              <h3 className="font-medium mb-2">Right to Delete</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Request deletion of your personal information, subject to legal limitations.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/legal/data-rights">Delete Data</a>
              </Button>
            </div>
            <div>
              <h3 className="font-medium mb-2">Right to Correct</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Request correction of inaccurate personal information.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/legal/data-rights">Correct Data</a>
              </Button>
            </div>
            <div>
              <h3 className="font-medium mb-2">Non-Discrimination</h3>
              <p className="text-sm text-muted-foreground mb-3">
                We will not discriminate against you for exercising your CCPA rights.
              </p>
              <Badge variant="secondary">Guaranteed</Badge>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">Processing Timeline</h2>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-semantic-warning rounded-full"></div>
              <span><strong>Opt-out requests:</strong> Processed within 15 days</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-semantic-warning rounded-full"></div>
              <span><strong>Data requests:</strong> Processed within 45 days</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-semantic-warning rounded-full"></div>
              <span><strong>Verification:</strong> May require identity confirmation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-semantic-warning rounded-full"></div>
              <span><strong>Appeals:</strong> Contact us if you disagree with our response</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Authorized Agent Requests</h2>
          <p className="text-red-800 mb-4">
            You can designate an authorized agent to make CCPA requests on your behalf.
            The agent must provide proof of authorization and we may require verification of your identity directly.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/contact">Contact for Agent Requests</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/legal/privacy">View Full CCPA Notice</a>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">
            Questions about your CCPA rights or this process?
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/contact">Contact Privacy Team</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:+1-555-123-4567">Call Support</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
