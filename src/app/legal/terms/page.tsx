
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | ATLVS + GVTEWAY',
  description: 'Read our terms of service governing the use of ATLVS + GVTEWAY platform and services.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-neutral-600">Last updated: March 1, 2024</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p>
              Welcome to ATLVS + GVTEWAY. These Terms of Service ("Terms") govern your use of our website,
              mobile applications, and services (collectively, the "Service"). By accessing or using our Service,
              you agree to be bound by these Terms.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using ATLVS + GVTEWAY, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              ATLVS + GVTEWAY is a travel planning and booking platform that connects users with unique travel
              experiences, accommodations, transportation, and activities worldwide. We provide tools for trip planning,
              booking management, and travel inspiration.
            </p>

            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use certain features of our Service, you must create an account. You agree to provide accurate,
              current, and complete information during the registration process and to update such information
              to keep it accurate, current, and complete.
            </p>

            <h3>3.2 Account Security</h3>
            <p>
              You are responsible for safeguarding your account credentials and for all activities that occur under
              your account. You agree to immediately notify us of any unauthorized use of your account.
            </p>

            <h3>3.3 Account Termination</h3>
            <p>
              We reserve the right to terminate or suspend your account at our discretion, with or without notice,
              for conduct that violates these Terms or is harmful to other users, us, or third parties.
            </p>

            <h2>4. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Use the Service for commercial purposes without authorization</li>
              <li>Harass, threaten, or intimidate other users</li>
            </ul>

            <h2>5. Bookings and Payments</h2>
            <h3>5.1 Booking Process</h3>
            <p>
              All bookings are subject to availability and confirmation. We act as an intermediary between you and
              experience providers. Booking confirmations are sent via email and are also available in your account.
            </p>

            <h3>5.2 Payment Terms</h3>
            <p>
              Payments are processed securely through our platform. By making a payment, you authorize us to charge
              your selected payment method. All prices are displayed in USD unless otherwise noted.
            </p>

            <h3>5.3 Cancellation and Refunds</h3>
            <p>
              Cancellation policies vary by experience and are clearly stated during the booking process.
              Refunds are processed according to the specific cancellation policy of each booking.
            </p>

            <h2>6. Content and Intellectual Property</h2>
            <h3>6.1 User Content</h3>
            <p>
              You retain ownership of content you submit to our Service. By submitting content, you grant us a
              worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in
              connection with our Service.
            </p>

            <h3>6.2 Our Content</h3>
            <p>
              All content on our Service, including text, graphics, logos, and software, is owned by ATLVS + GVTEWAY
              or our licensors and is protected by intellectual property laws.
            </p>

            <h3>6.3 Copyright Policy</h3>
            <p>
              We respect the intellectual property rights of others and expect our users to do the same.
              If you believe your copyright has been infringed, please contact our designated agent.
            </p>

            <h2>7. Privacy</h2>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information.
              By using our Service, you consent to our collection and use of information as outlined in our Privacy Policy.
            </p>

            <h2>8. Disclaimers and Limitation of Liability</h2>
            <h3>8.1 Service Disclaimer</h3>
            <p>
              The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service
              will be uninterrupted, error-free, or secure.
            </p>

            <h3>8.2 Travel Disclaimers</h3>
            <p>
              Travel involves inherent risks. We are not responsible for any injuries, losses, or damages that may
              occur during travel. Users should exercise caution and follow all applicable laws and regulations.
            </p>

            <h3>8.3 Limitation of Liability</h3>
            <p>
              In no event shall ATLVS + GVTEWAY be liable for any indirect, incidental, special, consequential,
              or punitive damages arising out of or related to your use of the Service.
            </p>

            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ATLVS + GVTEWAY from any claims, damages, losses,
              or expenses arising from your use of the Service or violation of these Terms.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of New York,
              without regard to its conflict of law provisions.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes
              via email or through our Service. Continued use of the Service constitutes acceptance of modified Terms.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> legal@atlvs.com</p>
              <p><strong>Address:</strong> 123 Innovation Drive, New York, NY 10001</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Questions About These Terms?</h2>
          <p className="text-blue-800 mb-4">
            If you have questions about our Terms of Service, please contact our legal team.
          </p>
          <div className="flex gap-4">
            <a href="mailto:legal@atlvs.com" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Email Legal Team
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
