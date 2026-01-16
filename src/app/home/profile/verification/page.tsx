
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Identity Verification | ATLVS + GVTEWAY',
  description: 'Verify your identity to unlock premium features and increase account security.',
}

export default function HomeProfileVerificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🆔</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Identity Verification</h1>
          <p className="text-neutral-600">Verify your identity to access all features</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Why verify your identity?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <span className="text-semantic-success text-xl"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Higher Booking Limits</h3>
                  <p className="text-sm text-neutral-600">Book experiences up to $10,000</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-semantic-success text-xl"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Priority Support</h3>
                  <p className="text-sm text-neutral-600">24/7 dedicated support line</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-semantic-success text-xl"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Exclusive Experiences</h3>
                  <p className="text-sm text-neutral-600">Access to VIP and private events</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-semantic-success text-xl"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Enhanced Security</h3>
                  <p className="text-sm text-neutral-600">Advanced account protection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Verification Process</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Upload Documents</h4>
                  <p className="text-sm text-neutral-600">Provide government-issued ID and proof of address</p>
                </div>
                <span className="text-semantic-success font-medium">Complete</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Face Verification</h4>
                  <p className="text-sm text-neutral-600">Take a selfie for biometric verification</p>
                </div>
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                  Start
                </Button>
              </div>

              <div className="flex items-center space-x-4 opacity-50">
                <div className="w-8 h-8 bg-neutral-300 text-neutral-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">Review & Approval</h4>
                  <p className="text-sm text-neutral-600">Our team reviews your documents (1-2 business days)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Current Status</h3>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-semantic-warning text-xl">⏳</span>
                <div>
                  <h4 className="font-medium text-yellow-900">Documents Submitted</h4>
                  <p className="text-sm text-yellow-800">Your documents are being reviewed. We'll notify you within 24-48 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Accepted Documents</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Government-Issued ID</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Passport</li>
                <li>• Driver's license</li>
                <li>• National ID card</li>
                <li>• Residence permit</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Proof of Address</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Utility bill</li>
                <li>• Bank statement</li>
                <li>• Tax document</li>
                <li>• Lease agreement</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Document Requirements</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Documents must be in English or include translation</li>
              <li>• Photos must be clear and legible</li>
              <li>• Documents must not be expired</li>
              <li>• File size limit: 10MB per document</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
