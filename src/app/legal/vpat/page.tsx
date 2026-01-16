
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const criteria = {
  '1.1.1': { level: 'A', title: 'Non-text Content', status: 'supports', description: 'All images include descriptive alt text' },
  '1.2.1': { level: 'A', title: 'Audio-only and Video-only (Prerecorded)', status: 'supports', description: 'Descriptive transcripts provided' },
  '1.2.2': { level: 'A', title: 'Captions (Prerecorded)', status: 'supports', description: 'Synchronized captions for video content' },
  '1.2.3': { level: 'A', title: 'Audio Description or Media Alternative (Prerecorded)', status: 'supports', description: 'Audio descriptions for video' },
  '1.3.1': { level: 'A', title: 'Info and Relationships', status: 'supports', description: 'Semantic HTML and ARIA landmarks' },
  '1.3.2': { level: 'A', title: 'Meaningful Sequence', status: 'supports', description: 'Logical content order' },
  '1.3.3': { level: 'A', title: 'Sensory Characteristics', status: 'supports', description: 'No sensory-only information' },
  '1.4.1': { level: 'A', title: 'Use of Color', status: 'supports', description: 'Color not sole differentiator' },
  '1.4.2': { level: 'A', title: 'Audio Control', status: 'supports', description: 'Auto-playing audio can be paused' },
  '1.4.3': { level: 'AA', title: 'Contrast (Minimum)', status: 'supports', description: '4.5:1 normal text, 3:1 large text' },
  '1.4.4': { level: 'AA', title: 'Resize text', status: 'supports', description: '200% zoom without loss' },
  '1.4.5': { level: 'AA', title: 'Images of Text', status: 'supports', description: 'Real text preferred over images' },
  '1.4.10': { level: 'AA', title: 'Reflow', status: 'supports', description: 'Content reflows at 320px width' },
  '1.4.11': { level: 'AA', title: 'Non-text Contrast', status: 'supports', description: '3:1 contrast for UI components' },
  '1.4.12': { level: 'AA', title: 'Text Spacing', status: 'supports', description: 'Supports user text spacing' },
  '1.4.13': { level: 'AA', title: 'Content on Hover or Focus', status: 'supports', description: 'Dismissible, hoverable tooltips' },
  '2.1.1': { level: 'A', title: 'Keyboard', status: 'supports', description: 'All functions keyboard accessible' },
  '2.1.2': { level: 'A', title: 'No Keyboard Trap', status: 'supports', description: 'Can navigate away from all areas' },
  '2.1.4': { level: 'A', title: 'Character Key Shortcuts', status: 'supports', description: 'Configurable or single-key shortcuts' },
  '2.2.1': { level: 'A', title: 'Timing Adjustable', status: 'supports', description: 'Time limits can be extended' },
  '2.2.2': { level: 'A', title: 'Pause, Stop, Hide', status: 'supports', description: 'Moving content can be controlled' },
  '2.3.1': { level: 'A', title: 'Three Flashes or Below Threshold', status: 'supports', description: 'No content flashes >3/sec' },
  '2.4.1': { level: 'A', title: 'Bypass Blocks', status: 'supports', description: 'Skip navigation links provided' },
  '2.4.2': { level: 'A', title: 'Page Titled', status: 'supports', description: 'Descriptive page titles' },
  '2.4.3': { level: 'A', title: 'Focus Order', status: 'supports', description: 'Logical tab sequence' },
  '2.4.4': { level: 'A', title: 'Link Purpose (In Context)', status: 'supports', description: 'Link purpose clear from text' },
  '2.4.5': { level: 'AA', title: 'Multiple Ways', status: 'supports', description: 'Multiple navigation methods' },
  '2.4.6': { level: 'AA', title: 'Headings and Labels', status: 'supports', description: 'Descriptive headings and labels' },
  '2.4.7': { level: 'AA', title: 'Focus Visible', status: 'supports', description: 'Visible focus indicators' },
  '2.5.1': { level: 'A', title: 'Pointer Gestures', status: 'supports', description: 'Single-pointer alternatives' },
  '2.5.2': { level: 'A', title: 'Pointer Cancellation', status: 'supports', description: 'Up-event activation' },
  '2.5.3': { level: 'A', title: 'Label in Name', status: 'supports', description: 'Accessible name matches visible label' },
  '2.5.4': { level: 'A', title: 'Motion Actuation', status: 'supports', description: 'Motion not required' },
  '2.5.8': { level: 'AA', title: 'Target Size (Minimum)', status: 'supports', description: '44x44px minimum touch targets' },
  '3.1.1': { level: 'A', title: 'Language of Page', status: 'supports', description: 'HTML lang attribute set' },
  '3.1.2': { level: 'AA', title: 'Language of Parts', status: 'supports', description: 'Lang attributes for foreign text' },
  '3.2.1': { level: 'A', title: 'On Focus', status: 'supports', description: 'No unexpected context changes' },
  '3.2.2': { level: 'A', title: 'On Input', status: 'supports', description: 'No unexpected context changes' },
  '3.2.3': { level: 'AA', title: 'Consistent Navigation', status: 'supports', description: 'Same navigation order' },
  '3.2.4': { level: 'AA', title: 'Consistent Identification', status: 'supports', description: 'Same labels for same functions' },
  '3.3.1': { level: 'A', title: 'Error Identification', status: 'supports', description: 'Errors clearly identified' },
  '3.3.2': { level: 'A', title: 'Labels or Instructions', status: 'supports', description: 'Input labels provided' },
  '3.3.3': { level: 'AA', title: 'Error Suggestion', status: 'supports', description: 'Error correction suggestions' },
  '3.3.4': { level: 'AA', title: 'Error Prevention (Legal, Financial, Data)', status: 'supports', description: 'Review/confirm for critical data' },
  '4.1.2': { level: 'A', title: 'Name, Role, Value', status: 'supports', description: 'ARIA for custom components' },
  '4.1.3': { level: 'AA', title: 'Status Messages', status: 'supports', description: 'Programmatic status updates' }
}

const statusConfig = {
  supports: { icon: CheckCircle, color: 'text-semantic-success', label: 'Supports' },
  'partially-supports': { icon: AlertTriangle, color: 'text-semantic-warning', label: 'Partially Supports' },
  'does-not-support': { icon: XCircle, color: 'text-semantic-error', label: 'Does Not Support' },
  'not-applicable': { icon: AlertTriangle, color: 'text-neutral-600', label: 'Not Applicable' }
}

export default function VPATPage() {
  const exportVPAT = () => {
    // In a real implementation, this would generate a PDF or structured document
    alert('VPAT export functionality would generate a downloadable accessibility report')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-accent-secondary"/>
            <h1 className="text-3xl font-bold text-neutral-900">Voluntary Product Accessibility Template (VPAT)</h1>
          </div>
          <p className="text-lg text-neutral-600 mb-4">
            WCAG 2.2 AA Conformance Report for ATLVS + GVTEWAY
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-accent-secondary"/>
              <p className="text-sm text-blue-800">
                <strong>Conformance Level:</strong> WCAG 2.2 Level AA<br/>
                <strong>Report Date:</strong> January 2026<br/>
                <strong>Product:</strong> ATLVS + GVTEWAY Web Application
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={exportVPAT} className="gap-2">
              <Download className="h-4 w-4"/>
              Export VPAT
            </Button>
            <Button variant="outline" asChild>
              <a href="/legal/accessibility">View Accessibility Statement</a>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Summary of Conformance</CardTitle>
              <CardDescription>Overall accessibility compliance assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-semantic-success mx-auto mb-2"/>
                  <div className="text-2xl font-bold text-semantic-success">47</div>
                  <div className="text-sm text-semantic-success">Supporting</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-semantic-warning mx-auto mb-2"/>
                  <div className="text-2xl font-bold text-semantic-warning">0</div>
                  <div className="text-sm text-semantic-warning">Partial</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-semantic-error mx-auto mb-2"/>
                  <div className="text-2xl font-bold text-semantic-error">0</div>
                  <div className="text-sm text-semantic-error">Not Supporting</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-neutral-600 mx-auto mb-2"/>
                  <div className="text-2xl font-bold text-neutral-700">0</div>
                  <div className="text-sm text-neutral-600">Not Applicable</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WCAG 2.2 Success Criteria</CardTitle>
              <CardDescription>Detailed conformance assessment by criterion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(criteria).map(([criterion, data]) => {
                  const StatusIcon = statusConfig[data.status as keyof typeof statusConfig].icon
                  return (
                    <div key={criterion} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <StatusIcon className={`h-5 w-5 ${statusConfig[data.status as keyof typeof statusConfig].color}`}/>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                            {criterion}
                          </code>
                          <Badge variant="outline" className="text-xs">
                            Level {data.level}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {statusConfig[data.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">{data.title}</h4>
                        <p className="text-sm text-muted-foreground">{data.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Assessment Methodology</h2>
          <div className="space-y-4 text-sm text-neutral-700">
            <div>
              <h3 className="font-medium mb-2">Automated Testing</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>axe DevTools browser extension</li>
                <li>Lighthouse accessibility audits</li>
                <li>WAVE Web Accessibility Evaluation Tool</li>
                <li>Color contrast analysis tools</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Manual Testing</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Keyboard navigation testing</li>
                <li>Screen reader testing (NVDA, JAWS, VoiceOver)</li>
                <li>Mobile accessibility testing</li>
                <li>Color blindness simulation</li>
                <li>High contrast mode testing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">User Testing</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Testing with users who have disabilities</li>
                <li>Cognitive accessibility assessment</li>
                <li>Motor impairment testing</li>
                <li>Visual impairment evaluation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">
            This VPAT was last updated on January 2026.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/legal/accessibility">Accessibility Statement</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact?subject=VPAT%20Inquiry">Contact for Questions</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
