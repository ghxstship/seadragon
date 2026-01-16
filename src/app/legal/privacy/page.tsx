
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | ATLVS + GVTEWAY',
  description: 'Learn how ATLVS + GVTEWAY collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-neutral-600">Last updated: March 1, 2024</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p>
              At ATLVS + GVTEWAY, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>1.1 Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li>Name, email address, phone number, and mailing address</li>
              <li>Payment information (processed securely by third-party providers)</li>
              <li>Travel preferences and booking history</li>
              <li>Account credentials and profile information</li>
              <li>Communication preferences and feedback</li>
            </ul>

            <h3>1.2 Automatically Collected Information</h3>
            <p>We automatically collect certain information when you use our services:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Location data (with your permission)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li><strong>Service Provision:</strong> To provide and maintain our travel planning and booking services</li>
              <li><strong>Account Management:</strong> To create and manage your account, process payments, and communicate with you</li>
              <li><strong>Personalization:</strong> To customize your experience and provide relevant recommendations</li>
              <li><strong>Communication:</strong> To send booking confirmations, updates, and important service information</li>
              <li><strong>Customer Support:</strong> To respond to your inquiries and provide assistance</li>
              <li><strong>Analytics:</strong> To improve our services and develop new features</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>

            <h3>3.1 Service Providers</h3>
            <p>We may share information with trusted third-party service providers who assist us in operating our platform, such as:</p>
            <ul>
              <li>Payment processors</li>
              <li>Email service providers</li>
              <li>Customer support platforms</li>
              <li>Analytics services</li>
            </ul>

            <h3>3.2 Experience Providers</h3>
            <p>When you book an experience, we share necessary information with the provider to fulfill your booking, including:</p>
            <ul>
              <li>Name and contact information</li>
              <li>Booking details and preferences</li>
              <li>Special requirements or accessibility needs</li>
            </ul>

            <h3>3.3 Legal Requirements</h3>
            <p>We may disclose information if required by law or to protect our rights, including:</p>
            <ul>
              <li>Legal subpoenas or court orders</li>
              <li>Investigations of fraud or security breaches</li>
              <li>Protection of user safety</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
            <ul>
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to enhance your experience:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p>You can control cookie settings through your browser or our cookie preferences tool.</p>

            <h2>6. Your Rights and Choices</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations:</p>
            <ul>
              <li>Account information: Retained while your account is active and for 3 years after closure</li>
              <li>Booking records: Retained for 7 years for tax and legal compliance</li>
              <li>Marketing data: Retained until you unsubscribe or request deletion</li>
              <li>Analytics data: Aggregated and anonymized after 2 years</li>
            </ul>

            <h2>8. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:</p>
            <ul>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Standard contractual clauses</li>
              <li>Binding corporate rules</li>
              <li>Your explicit consent where required</li>
            </ul>

            <h2>9. Children's Privacy</h2>
            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will delete it immediately.</p>

            <h2>10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our platform. Continued use of our services constitutes acceptance of the updated policy.</p>

            <h2>11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Data Protection Officer</strong></p>
              <p>Email: privacy@atlvs.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Innovation Drive, New York, NY 10001</p>
            </div>

            <h2>12. Complaints</h2>
            <p>If you are not satisfied with our response to your privacy concerns, you have the right to lodge a complaint with the relevant data protection authority in your jurisdiction.</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Questions About Privacy?</h2>
          <p className="text-blue-800 mb-4">
            Our privacy team is here to answer your questions and address your concerns.
          </p>
          <div className="flex gap-4">
            <a href="mailto:privacy@atlvs.com" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Privacy Team
            </a>
            <a href="/legal" className="bg-background text-accent-secondary border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Back to Legal
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
