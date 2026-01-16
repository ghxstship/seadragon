
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Disclaimer | ATLVS + GVTEWAY',
  description: 'Important legal notices and disclaimers for using ATLVS + GVTEWAY services.',
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Legal Disclaimer</h1>
          <p className="text-lg text-neutral-600">Last updated: March 1, 2024</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p>
              This legal disclaimer governs your use of the ATLVS + GVTEWAY website, mobile applications,
              and services. By accessing or using our services, you acknowledge that you have read,
              understood, and agree to be bound by this disclaimer.
            </p>

            <h2>1. General Information</h2>
            <p>
              ATLVS + GVTEWAY provides travel planning, booking, and experience services. While we strive
              for accuracy, we make no guarantees about the completeness, reliability, or accuracy of information
              provided through our services.
            </p>

            <h2>2. Travel Advisories and Risks</h2>
            <h3>2.1 Travel Risks</h3>
            <p>
              Travel involves inherent risks including, but not limited to:
            </p>
            <ul>
              <li>Accidents, injuries, or illnesses</li>
              <li>Weather-related disruptions</li>
              <li>Transportation delays or cancellations</li>
              <li>Political instability or unrest</li>
              <li>Natural disasters or emergencies</li>
              <li>Health and safety concerns</li>
              <li>Theft, loss, or damage to property</li>
            </ul>

            <h3>2.2 Assumption of Risk</h3>
            <p>
              By booking travel through our platform, you acknowledge and assume all risks associated with travel.
              You are responsible for your own safety and well-being during all travel activities. We strongly
              recommend purchasing travel insurance and staying informed about destination conditions.
            </p>

            <h3>2.3 Government Advisories</h3>
            <p>
              You should consult official government travel advisories before planning or undertaking travel.
              We are not responsible for changes in travel advisories, visa requirements, or entry restrictions
              that occur after booking.
            </p>

            <h2>3. Service Limitations</h2>

            <h3>3.1 Third-Party Services</h3>
            <p>
              We act as an intermediary between travelers and experience providers. We do not directly provide
              travel services, accommodations, or activities. The quality and availability of third-party services
              are the responsibility of the respective providers.
            </p>

            <h3>3.2 Information Accuracy</h3>
            <p>
              While we strive to provide accurate information, we do not guarantee the accuracy, completeness,
              or timeliness of any information on our platform. Prices, availability, and terms may change
              without notice.
            </p>

            <h3>3.3 Technical Limitations</h3>
            <p>
              Our services are provided "as is" and we do not guarantee uninterrupted access. We are not
              responsible for technical issues, data loss, or service interruptions beyond our reasonable control.
            </p>

            <h2>4. Health and Safety</h2>

            <h3>4.1 Health Requirements</h3>
            <p>
              Travelers are responsible for ensuring they meet all health requirements for their destinations,
              including vaccinations, medications, and medical clearances. We recommend consulting healthcare
              professionals for personalized medical advice.
            </p>

            <h3>4.2 Accessibility</h3>
            <p>
              Not all experiences may be suitable for travelers with disabilities or special needs.
              Contact providers directly to inquire about accessibility accommodations.
            </p>

            <h3>4.3 Emergency Services</h3>
            <p>
              In case of emergencies, contact local emergency services immediately. We provide emergency
              contact information but are not equipped to handle emergency situations directly.
            </p>

            <h2>5. Financial Disclaimers</h2>

            <h3>5.1 Currency and Pricing</h3>
            <p>
              Prices are displayed in USD unless otherwise noted. Currency conversion rates may vary.
              We reserve the right to change prices at any time without notice.
            </p>

            <h3>5.2 Payment Security</h3>
            <p>
              While we use industry-standard security measures, we cannot guarantee absolute security
              of payment information transmitted over the internet.
            </p>

            <h3>5.3 Refunds</h3>
            <p>
              Refund eligibility is determined by specific cancellation policies. We do not guarantee
              refunds in all circumstances. See our Refund Policy for complete details.
            </p>

            <h2>6. Content and User-Generated Material</h2>

            <h3>6.1 User Content</h3>
            <p>
              Content posted by users (reviews, photos, comments) is the responsibility of the poster.
              We do not endorse or verify the accuracy of user-generated content.
            </p>

            <h3>6.2 Copyright</h3>
            <p>
              All content on our platform is protected by copyright law. Unauthorized use of our content
              may violate intellectual property rights.
            </p>

            <h3>6.3 Links to Third Parties</h3>
            <p>
              Our platform may contain links to third-party websites. We are not responsible for the
              content, privacy policies, or practices of linked websites.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ATLVS + GVTEWAY shall not be liable for any
              direct, indirect, incidental, special, consequential, or punitive damages arising from your
              use of our services, including but not limited to:
            </p>
            <ul>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Travel disruptions or cancellations</li>
              <li>Personal injury or property damage</li>
              <li>Emotional distress or inconvenience</li>
              <li>Third-party claims or disputes</li>
            </ul>

            <h2>8. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ATLVS + GVTEWAY from any claims, damages,
              losses, or expenses arising from your use of our services or violation of this disclaimer.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              This disclaimer shall be governed by and construed in accordance with the laws of the
              State of New York, without regard to its conflict of law provisions.
            </p>

            <h2>10. Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Changes will be posted on
              our website with an updated effective date.
            </p>

            <h2>11. Severability</h2>
            <p>
              If any provision of this disclaimer is found to be unenforceable, the remaining provisions
              shall remain in full force and effect.
            </p>

            <h2>12. Entire Agreement</h2>
            <p>
              This disclaimer, together with our Terms of Service and Privacy Policy, constitutes the
              entire agreement between you and ATLVS + GVTEWAY regarding the use of our services.
            </p>

            <h2>13. Contact Information</h2>
            <p>
              If you have questions about this disclaimer, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> legal@atlvs.com</p>
              <p><strong>Address:</strong> 123 Innovation Drive, New York, NY 10001</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Important Notice</h2>
          <p className="text-blue-800 mb-4">
            This disclaimer contains important legal information. Please read it carefully before using our services.
            By continuing to use ATLVS + GVTEWAY, you acknowledge that you understand and accept these terms.
          </p>
          <div className="flex gap-4">
            <a href="/legal/terms" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              View Terms of Service
            </a>
            <a href="/legal/privacy" className="bg-background text-accent-secondary border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              View Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
