
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | ATLVS + GVTEWAY',
  description: 'Learn about our refund policy for bookings, memberships, and other services.',
}

export default function RefundPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Refund Policy</h1>
          <p className="text-lg text-neutral-600">Last updated: March 1, 2024</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p>
              At ATLVS + GVTEWAY, we want you to have a great experience. This Refund Policy explains when and how
              you can request refunds for our services, bookings, and memberships.
            </p>

            <h2>1. General Refund Principles</h2>
            <ul>
              <li>All refund requests are evaluated on a case-by-case basis</li>
              <li>Refunds are processed to the original payment method</li>
              <li>Processing times vary by payment method (3-10 business days)</li>
              <li>Some fees may be non-refundable (see specific policies below)</li>
              <li>We reserve the right to deny refunds for policy violations</li>
            </ul>

            <h2>2. Experience Bookings</h2>

            <h3>2.1 Cancellation Policy</h3>
            <table className="border-collapse border border-neutral-300 w-full mt-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-neutral-300 px-4 py-2 text-left">Cancellation Timing</th>
                  <th className="border border-neutral-300 px-4 py-2 text-left">Refund Amount</th>
                  <th className="border border-neutral-300 px-4 py-2 text-left">Processing Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-300 px-4 py-2">More than 30 days before</td>
                  <td className="border border-neutral-300 px-4 py-2">100% refund</td>
                  <td className="border border-neutral-300 px-4 py-2">$25</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-2">15-30 days before</td>
                  <td className="border border-neutral-300 px-4 py-2">75% refund</td>
                  <td className="border border-neutral-300 px-4 py-2">$25</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-2">7-14 days before</td>
                  <td className="border border-neutral-300 px-4 py-2">50% refund</td>
                  <td className="border border-neutral-300 px-4 py-2">$25</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-2">Less than 7 days before</td>
                  <td className="border border-neutral-300 px-4 py-2">No refund</td>
                  <td className="border border-neutral-300 px-4 py-2">$25</td>
                </tr>
              </tbody>
            </table>

            <h3>2.2 Special Circumstances</h3>
            <p>We may offer full or partial refunds in the following situations:</p>
            <ul>
              <li><strong>Provider Cancellation:</strong> Full refund if the experience provider cancels</li>
              <li><strong>Force Majeure:</strong> Full refund for events beyond our control (natural disasters, etc.)</li>
              <li><strong>Medical Emergency:</strong> Case-by-case review with documentation</li>
              <li><strong>Significant Changes:</strong> Partial refund if the experience changes substantially</li>
            </ul>

            <h3>2.3 Non-Refundable Items</h3>
            <ul>
              <li>Transportation booking fees</li>
              <li>Third-party service charges</li>
              <li>Visa application fees</li>
              <li>Insurance premiums (unless canceled within 24 hours)</li>
            </ul>

            <h2>3. Membership Refunds</h2>

            <h3>3.1 Annual Membership</h3>
            <ul>
              <li><strong>First 30 days:</strong> Full refund available</li>
              <li><strong>After 30 days:</strong> Prorated refund minus $50 processing fee</li>
              <li><strong>Travel credits:</strong> Forfeited upon cancellation</li>
              <li><strong>Family plans:</strong> Subject to individual cancellation terms</li>
            </ul>

            <h3>3.2 Corporate Membership</h3>
            <ul>
              <li><strong>Contract terms:</strong> Governed by specific contract language</li>
              <li><strong>Early termination:</strong> May incur penalties as outlined in agreement</li>
              <li><strong>Custom arrangements:</strong> Reviewed on case-by-case basis</li>
            </ul>

            <h2>4. Gift Purchases</h2>
            <ul>
              <li><strong>Unused gifts:</strong> Full refund within 30 days of purchase</li>
              <li><strong>Partially used:</strong> No refund once recipient has redeemed</li>
              <li><strong>Digital gifts:</strong> Non-transferable, no refunds after delivery</li>
            </ul>

            <h2>5. Technical Issues</h2>
            <p>If you experience technical issues that prevent you from using our service:</p>
            <ul>
              <li><strong>Website downtime:</strong> No charge for affected bookings</li>
              <li><strong>Booking errors:</strong> Full refund and correction of booking</li>
              <li><strong>Payment processing failures:</strong> No additional charges applied</li>
            </ul>

            <h2>6. Refund Processing</h2>

            <h3>6.1 How to Request a Refund</h3>
            <ol>
              <li>Log into your account and navigate to "My Bookings"</li>
              <li>Select the booking and click "Request Refund"</li>
              <li>Provide reason for cancellation and any supporting documentation</li>
              <li>Submit request - we'll respond within 2 business days</li>
            </ol>

            <h3>6.2 Refund Timeline</h3>
            <ul>
              <li><strong>Approval:</strong> 1-3 business days for standard requests</li>
              <li><strong>Processing:</strong> 3-5 business days to process refund</li>
              <li><strong>Bank transfer:</strong> 3-10 business days to appear in your account</li>
              <li><strong>Complex cases:</strong> May take up to 30 days for investigation</li>
            </ul>

            <h3>6.3 Refund Methods</h3>
            <table className="border-collapse border border-neutral-300 w-full mt-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-neutral-300 px-4 py-2 text-left">Payment Method</th>
                  <th className="border border-neutral-300 px-4 py-2 text-left">Processing Time</th>
                  <th className="border border-neutral-300 px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-300 px-4 py-2">Credit Card</td>
                  <td className="border border-neutral-300 px-4 py-2">3-5 business days</td>
                  <td className="border border-neutral-300 px-4 py-2">Original card credited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-2">PayPal</td>
                  <td className="border border-neutral-300 px-4 py-2">1-3 business days</td>
                  <td className="border border-neutral-300 px-4 py-2">Returned to PayPal account</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-2">Bank Transfer</td>
                  <td className="border border-neutral-300 px-4 py-2">5-10 business days</td>
                  <td className="border border-neutral-300 px-4 py-2">Wire transfer to bank account</td>
                </tr>
              </tbody>
            </table>

            <h2>7. Exceptions and Special Cases</h2>
            <ul>
              <li><strong>Government travel advisories:</strong> Full refund for official warnings</li>
              <li><strong>Medical conditions:</strong> Doctor's note required for consideration</li>
              <li><strong>Death in family:</strong> Full refund with death certificate</li>
              <li><strong>Military deployment:</strong> Full refund with deployment orders</li>
              <li><strong>Visa denials:</strong> Full refund with rejection letter</li>
            </ul>

            <h2>8. Dispute Resolution</h2>
            <p>If you're not satisfied with our refund decision:</p>
            <ol>
              <li>Contact our customer service team for reconsideration</li>
              <li>Escalate to our refund review committee if needed</li>
              <li>Final decisions reviewed by executive leadership</li>
              <li>Small claims court available as last resort</li>
            </ol>

            <h2>9. Contact Information</h2>
            <p>For refund requests or questions about this policy:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> refunds@atlvs.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday-Friday, 9AM-6PM EST</p>
              <p><strong>Address:</strong> 123 Innovation Drive, New York, NY 10001</p>
            </div>

            <h2>10. Policy Updates</h2>
            <p>
              We may update this refund policy from time to time. Changes will be posted on our website
              and communicated to existing customers. Continued use of our services constitutes acceptance
              of the updated policy.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Need a Refund?</h2>
          <p className="text-blue-800 mb-4">
            Our refund team is here to help you through the process. Contact us to discuss your specific situation.
          </p>
          <div className="flex gap-4">
            <a href="mailto:refunds@atlvs.com" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Request Refund
            </a>
            <a href="/support/contact" className="bg-background text-accent-secondary border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
