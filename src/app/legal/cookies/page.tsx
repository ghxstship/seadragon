
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Cookie Policy | ATLVS + GVTEWAY',
  description: 'Learn about how ATLVS + GVTEWAY uses cookies and similar technologies on our website.',
}

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-neutral-600">Last updated: March 1, 2024</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p>
              This Cookie Policy explains how ATLVS + GVTEWAY ("we", "us", or "our") uses cookies and similar
              technologies on our website and mobile applications. By using our services, you consent to the use
              of cookies in accordance with this policy.
            </p>

            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our website. They help us
              provide you with a better browsing experience by remembering your preferences and understanding how
              you use our site. Cookies can be "persistent" (remain on your device until deleted) or "session-based"
              (deleted when you close your browser).
            </p>

            <h2>2. Types of Cookies We Use</h2>

            <h3>2.1 Essential Cookies</h3>
            <p>These cookies are necessary for our website to function properly:</p>
            <ul>
              <li><strong>Authentication:</strong> Keep you logged in during your session</li>
              <li><strong>Security:</strong> Protect against fraud and secure your data</li>
              <li><strong>Preferences:</strong> Remember your language and accessibility settings</li>
              <li><strong>Shopping Cart:</strong> Maintain your booking selections</li>
            </ul>

            <h3>2.2 Analytics Cookies</h3>
            <p>These cookies help us understand how visitors use our website:</p>
            <ul>
              <li><strong>Usage Patterns:</strong> Track pages visited and time spent</li>
              <li><strong>Performance:</strong> Monitor site speed and functionality</li>
              <li><strong>Conversion Tracking:</strong> Measure booking completion rates</li>
              <li><strong>Error Monitoring:</strong> Identify and fix technical issues</li>
            </ul>

            <h3>2.3 Functional Cookies</h3>
            <p>These cookies enhance your experience on our site:</p>
            <ul>
              <li><strong>Location Services:</strong> Provide location-based recommendations</li>
              <li><strong>Personalization:</strong> Remember your travel preferences</li>
              <li><strong>Live Chat:</strong> Enable customer support interactions</li>
              <li><strong>Social Sharing:</strong> Facilitate sharing on social media</li>
            </ul>

            <h3>2.4 Marketing Cookies</h3>
            <p>These cookies help us deliver relevant advertisements:</p>
            <ul>
              <li><strong>Interest-Based Ads:</strong> Show relevant travel offers</li>
              <li><strong>Retargeting:</strong> Display ads for experiences you've viewed</li>
              <li><strong>Affiliate Tracking:</strong> Track referrals from partner websites</li>
              <li><strong>Social Media:</strong> Integrate with social media platforms</li>
            </ul>

            <h2>3. Third-Party Cookies</h2>
            <p>We use services from third-party providers that may set their own cookies:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Website analytics and performance monitoring</li>
              <li><strong>Stripe:</strong> Secure payment processing</li>
              <li><strong>Intercom:</strong> Customer support and live chat</li>
              <li><strong>Social Media Platforms:</strong> Social sharing and login integration</li>
              <li><strong>Advertising Networks:</strong> Relevant advertising delivery</li>
            </ul>

            <h2>4. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul>
              <li><strong>Website Functionality:</strong> Ensure our site works correctly</li>
              <li><strong>User Experience:</strong> Personalize content and remember preferences</li>
              <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
              <li><strong>Analytics:</strong> Understand user behavior and improve our services</li>
              <li><strong>Marketing:</strong> Deliver relevant advertisements and measure campaign effectiveness</li>
              <li><strong>Compliance:</strong> Meet legal requirements and regulatory obligations</li>
            </ul>

            <h2>5. Cookie Management</h2>

            <h3>5.1 Browser Settings</h3>
            <p>You can control and manage cookies through your browser settings:</p>
            <ul>
              <li><strong>Chrome:</strong> Settings{" > "}Privacy and Security{" > "}Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options{" > "}Privacy & Security{" > "}Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences{" > "}Privacy{" > "}Manage Website Data</li>
              <li><strong>Edge:</strong> Settings{" > "}Cookies and site permissions</li>
            </ul>

            <h3>5.2 Our Cookie Preferences</h3>
            <p>You can manage your cookie preferences through our cookie consent banner or settings panel. You can:</p>
            <ul>
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your preferences by category</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h3>5.3 Opting Out</h3>
            <p>You can opt out of interest-based advertising by visiting:</p>
            <ul>
              <li><a href="https://optout.aboutads.info/" className="text-accent-secondary hover:text-blue-800">Digital Advertising Alliance</a></li>
              <li><a href="https://www.youronlinechoices.com/" className="text-accent-secondary hover:text-blue-800">Your Online Choices</a></li>
              <li><a href="https://www.networkadvertising.org/choices/" className="text-accent-secondary hover:text-blue-800">Network Advertising Initiative</a></li>
            </ul>

            <h2>6. Impact of Disabling Cookies</h2>
            <p>Disabling cookies may affect your experience on our website:</p>
            <ul>
              <li>Essential cookies cannot be disabled as they are required for site functionality</li>
              <li>Analytics cookies: May affect our ability to improve the site</li>
              <li>Functional cookies: May reduce personalization and convenience features</li>
              <li>Marketing cookies: May result in less relevant advertisements</li>
            </ul>

            <h2>7. Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of significant changes via email or through our website.</p>

            <h2>8. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@atlvs.com</p>
              <p><strong>Subject:</strong> Cookie Policy Inquiry</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Manage Your Cookie Preferences</h2>
          <p className="text-blue-800 mb-4">
            You can change your cookie preferences at any time. Your choices will be saved and respected on future visits.
          </p>
          <div className="flex gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Manage Cookies
            </Button>
            <a href="/legal/privacy" className="bg-background text-accent-secondary border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              View Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
