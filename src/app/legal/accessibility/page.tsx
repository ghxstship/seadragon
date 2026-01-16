
import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accessibility, CheckCircle, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Accessibility Statement | ATLVS + GVTEWAY',
  description: 'Our commitment to digital accessibility and WCAG 2.2 AA compliance.',
}

export default function AccessibilityPage() {
  const conformanceLevel = "WCAG 2.2 AA"
  const lastAuditDate = "January 2026"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Accessibility className="h-8 w-8 text-accent-secondary"/>
            <h1 className="text-3xl font-bold text-neutral-900">Accessibility Statement</h1>
          </div>
          <p className="text-lg text-neutral-600 mb-4">
            ATLVS + GVTEWAY is committed to ensuring digital accessibility for people with disabilities.
            We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-accent-secondary"/>
              <p className="text-sm text-blue-800">
                <strong>Conformance:</strong> This website conforms to {conformanceLevel} as of {lastAuditDate}.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-semantic-success"/>
                What We Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Design with accessibility in mind from the start</li>
                <li>• Regular accessibility audits and testing</li>
                <li>• Use modern, accessible UI components</li>
                <li>• Support assistive technologies</li>
                <li>• Provide alternative text for images</li>
                <li>• Ensure keyboard navigation works</li>
                <li>• Maintain proper color contrast ratios</li>
                <li>• Support screen readers and other AT</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-semantic-warning"/>
                Known Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Some third-party content may not be fully accessible</li>
                <li>• Legacy documents may have accessibility issues</li>
                <li>• Complex data visualizations may need alternatives</li>
                <li>• Some interactive features may need enhancement</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                We are actively working to address these limitations.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">WCAG 2.2 AA Success Criteria</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Perceivable</Badge>
              <p className="text-sm">Information and UI components must be presentable to users in ways they can perceive.</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Operable</Badge>
              <p className="text-sm">UI components and navigation must be operable.</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Understandable</Badge>
              <p className="text-sm">Information and operation of UI must be understandable.</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Robust</Badge>
              <p className="text-sm">Content must be robust enough to work with current and future technologies.</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Accessibility Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Keyboard Navigation</h3>
              <p className="text-sm text-green-800">
                All interactive elements can be accessed and operated using only the keyboard.
                Use Tab to navigate and Enter/Space to activate.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Screen Reader Support</h3>
              <p className="text-sm text-green-800">
                Compatible with screen readers like NVDA, JAWS, and VoiceOver.
                Proper ARIA labels and semantic HTML structure.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Color Contrast</h3>
              <p className="text-sm text-green-800">
                Text meets WCAG contrast requirements (4.5:1 for normal text, 3:1 for large text).
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Responsive Design</h3>
              <p className="text-sm text-green-800">
                Works on all device sizes with touch targets meeting minimum size requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">How to Use This Site</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">For Screen Reader Users</h3>
              <p className="text-sm text-yellow-800">
                Use your screen reader&#39;s navigation commands to explore headings, links, and form controls.
                All images include descriptive alt text.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">For Keyboard Users</h3>
              <p className="text-sm text-yellow-800">
                Tab through interactive elements. Use arrow keys in menus and lists.
                Press Enter or Space to activate buttons and links.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">For Users with Motor Disabilities</h3>
              <p className="text-sm text-yellow-800">
                All functionality is available without time limits. Touch targets are at least 44x44 pixels.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">For Users with Cognitive Disabilities</h3>
              <p className="text-sm text-yellow-800">
                Clear, simple language is used. Instructions are provided for complex tasks.
                Consistent navigation and layout throughout the site.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Report Accessibility Issues</h2>
          <p className="text-red-800 mb-4">
            We strive to make our website accessible to everyone. If you encounter any accessibility barriers,
            please let us know so we can improve.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/contact?subject=Accessibility%20Issue">
                Report Issue
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:accessibility@atlvs.com">
                Email Us
              </a>
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Assessment and Compliance</h2>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-accent-secondary mt-0.5"/>
              <div>
                <strong>Automated Testing:</strong> Regular scans with axe, Lighthouse, and WAVE
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-accent-secondary mt-0.5"/>
              <div>
                <strong>Manual Testing:</strong> Screen reader testing with NVDA and JAWS
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-accent-secondary mt-0.5"/>
              <div>
                <strong>User Testing:</strong> Accessibility testing with users who have disabilities
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-accent-secondary mt-0.5"/>
              <div>
                <strong>Standards Compliance:</strong> WCAG 2.2 AA, Section 508, EN 301 549
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Contact Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Accessibility Team</h3>
              <p className="text-sm text-muted-foreground">
                Email: accessibility@atlvs.com<br/>
                Phone: +1 (555) 123-4567<br/>
                Hours: Monday-Friday, 9 AM - 5 PM EST
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Response Time</h3>
              <p className="text-sm text-muted-foreground">
                We aim to respond to accessibility concerns within 5 business days.<br/>
                Complex issues may take up to 30 days to resolve.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">
            This accessibility statement was last updated on {lastAuditDate}.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/legal/privacy">
                Privacy Policy
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/legal/terms">
                Terms of Service
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
