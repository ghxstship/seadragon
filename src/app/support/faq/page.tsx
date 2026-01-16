
import { Metadata } from 'next'
import Link from 'next/link'
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | ATLVS + GVTEWAY Support',
  description: 'Find answers to common questions about ATLVS + GVTEWAY services, bookings, accounts, and travel planning.',
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-neutral-600">Find quick answers to common questions</p>
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search FAQs..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
        </div>

        <div className="space-y-6">
          <div className="bg-background rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-neutral-900 p-6 pb-0">Getting Started</h2>
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">How do I create an account?</h3>
                  <p className="text-neutral-600">Click the &quot;Sign Up&quot; button in the top right corner and follow the registration process. You&apos;ll need to provide your email address and create a password.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">Is there a mobile app?</h3>
                  <p className="text-neutral-600">Yes! Our mobile app is available for iOS and Android devices. Download it from the App Store or Google Play Store to manage your bookings on the go.</p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">Do I need a membership to use the platform?</h3>
                  <p className="text-neutral-600">No, you can browse and book experiences without a membership. However, membership provides exclusive benefits like priority booking and travel credits.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-neutral-900 p-6 pb-0">Bookings & Reservations</h2>
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">How do I make a booking?</h3>
                  <p className="text-neutral-600">Search for your desired experience, select dates and options, then click &quot;Book Now&quot; and complete the payment process. You&apos;ll receive a confirmation email immediately.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">Can I modify my booking?</h3>
                  <p className="text-neutral-600">Yes, most bookings can be modified up to 48 hours before the experience. Contact our support team or use the &quot;Modify&quot; button in your account dashboard.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">What&apos;s the cancellation policy?</h3>
                  <p className="text-neutral-600">Cancellation policies vary by experience. Generally, you can cancel up to 24 hours in advance for a full refund. Check the specific terms when booking.</p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">How do I get a refund?</h3>
                  <p className="text-neutral-600">Refunds are processed automatically for eligible cancellations. You&apos;ll see the refund in your original payment method within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-neutral-900 p-6 pb-0">Payments & Billing</h2>
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">What payment methods do you accept?</h3>
                  <p className="text-neutral-600">We accept major credit cards (Visa, Mastercard, American Express), PayPal, and in some regions, local payment methods like Apple Pay and Google Pay.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">Is my payment information secure?</h3>
                  <p className="text-neutral-600">Yes, we use industry-standard SSL encryption and PCI-compliant payment processing. Your payment information is never stored on our servers.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">Do you charge booking fees?</h3>
                  <p className="text-neutral-600">We don&apos;t charge booking fees for most experiences. Some premium services may include service fees, which are clearly disclosed before booking.</p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">How do I update my billing information?</h3>
                  <p className="text-neutral-600">Go to your account settings and navigate to the &quot;Payment Methods&quot; section. You can add, remove, or update your payment information at any time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-neutral-900 p-6 pb-0">Account & Membership</h2>
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">How do I reset my password?</h3>
                  <p className="text-neutral-600">Click &quot;Forgot Password&quot; on the login page and enter your email address. We&apos;ll send you a secure link to reset your password.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">What are the membership benefits?</h3>
                  <p className="text-neutral-600">Members get priority booking, exclusive discounts, travel credits, concierge support, and access to member-only experiences. Visit our membership page for full details.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">How do I cancel my membership?</h3>
                  <p className="text-neutral-600">You can cancel your membership anytime through your account settings. You&apos;ll retain access until the end of your billing period.</p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">Can I have multiple accounts?</h3>
                  <p className="text-neutral-600">Each person should have their own account. Multiple accounts for the same person violate our terms of service.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-neutral-900 p-6 pb-0">Travel Planning & Experiences</h2>
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">How does the trip planner work?</h3>
                  <p className="text-neutral-600">Enter your destination, dates, and preferences, and our AI will create a personalized itinerary with recommendations for activities, dining, and accommodations.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">Can I book multiple experiences at once?</h3>
                  <p className="text-neutral-600">Yes, you can add multiple experiences to your cart and check out all at once. This makes planning complex trips much easier.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">What if the weather affects my outdoor activity?</h3>
                  <p className="text-neutral-600">Most outdoor activities have rain-or-shine policies or rain date options. Contact the provider directly or check your booking confirmation for details.</p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">Do you offer group discounts?</h3>
                  <p className="text-neutral-600">Yes, many experiences offer group discounts. Contact our sales team or the experience provider for group rates.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-neutral-900 p-6 pb-0">Technical Support</h2>
            <div className="p-6 pt-4">
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">The website isn&apos;t loading properly</h3>
                  <p className="text-neutral-600">Try clearing your browser cache, disabling extensions, or using a different browser. Check our system status page for any outages.</p>
                </div>
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-medium text-neutral-900 mb-2">I can&apos;t log into my account</h3>
                  <p className="text-neutral-600">Use the &quot;Forgot Password&quot; link or contact support. Make sure you&apos;re using the correct email address associated with your account.</p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">The mobile app is crashing</h3>
                  <p className="text-neutral-600">Try updating the app to the latest version, restarting your device, or reinstalling the app. Contact support if the issue persists.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Still Have Questions?</h2>
          <p className="text-blue-800 mb-4">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex gap-4">
            <Link href="/support/contact" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Support
            </Link>
            <Link href="/support" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Back to Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
