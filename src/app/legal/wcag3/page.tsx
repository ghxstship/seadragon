
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, TrendingUp, Clock, CheckCircle, AlertTriangle, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'WCAG 3.0 Monitoring | Web Content Accessibility Guidelines 3.0 | ATLVS + GVTEWAY',
  description: 'Monitoring and preparation for WCAG 3.0 accessibility guidelines.',
}

const wcag3Features = [
  {
    feature: 'Outcome-Based Scoring',
    description: 'Bronze, Silver, Gold scoring system replacing binary pass/fail',
    currentStatus: 'WCAG 2.2 AA Maintained',
    readiness: 'Bronze level achieved',
    timeline: 'Q1 2026'
  },
  {
    feature: 'Expanded Scope',
    description: 'Beyond web content to include mobile apps, documents, and emerging technologies',
    currentStatus: 'Web-focused compliance',
    readiness: 'Mobile accessibility implemented',
    timeline: 'Q2 2026'
  },
  {
    feature: 'Contextual Compliance',
    description: 'Different requirements based on content criticality and user impact',
    currentStatus: 'Uniform AA standard',
    readiness: 'Risk-based assessment ready',
    timeline: 'Q3 2026'
  },
  {
    feature: 'Enhanced Testing',
    description: 'Improved testing methodologies and automated evaluation tools',
    currentStatus: 'Manual + automated testing',
    readiness: 'Advanced testing framework',
    timeline: 'Q4 2026'
  },
  {
    feature: 'Inclusive Design Focus',
    description: 'Greater emphasis on diverse user needs and intersectional accessibility',
    currentStatus: 'Standard user groups covered',
    readiness: 'Expanded user research',
    timeline: 'Ongoing'
  }
]

const monitoringSources = [
  {
    name: 'W3C WCAG 3.0 Working Drafts',
    url: 'https://www.w3.org/TR/wcag-3.0/',
    frequency: 'Monthly updates',
    lastChecked: 'January 2026'
  },
  {
    name: 'Accessibility Guidelines Working Group',
    url: 'https://www.w3.org/WAI/GL/',
    frequency: 'Weekly meetings',
    lastChecked: 'January 2026'
  },
  {
    name: 'ISO/IEC JTC 1/SC 35',
    url: 'https://www.iso.org/committee/45020.html',
    frequency: 'Bi-monthly',
    lastChecked: 'December 2025'
  },
  {
    name: 'Industry Accessibility Forums',
    url: '#',
    frequency: 'Quarterly conferences',
    lastChecked: 'November 2025'
  }
]

export default function WCAG3Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-8 w-8 text-indigo-600"/>
            <h1 className="text-3xl font-bold text-neutral-900">WCAG 3.0 Monitoring</h1>
          </div>
          <p className="text-lg text-neutral-600 mb-4">
            Tracking the development and preparing for adoption of WCAG 3.0 accessibility guidelines.
          </p>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-indigo-600"/>
              <p className="text-sm text-indigo-800">
                <strong>Current Status:</strong> WCAG 2.2 AA Compliant<br/>
                <strong>WCAG 3.0 Readiness:</strong> Monitoring Active<br/>
                <strong>Expected Release:</strong> 2026
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5"/>
                Key WCAG 3.0 Features
              </CardTitle>
              <CardDescription>Major changes and our preparation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wcag3Features.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{feature.feature}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      <Badge variant="outline">{feature.timeline}</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Current Status:</strong>
                        <p className="text-muted-foreground mt-1">{feature.currentStatus}</p>
                      </div>
                      <div>
                        <strong>Readiness:</strong>
                        <p className="text-muted-foreground mt-1">{feature.readiness}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5"/>
                Monitoring Sources
              </CardTitle>
              <CardDescription>Official sources we monitor for WCAG 3.0 developments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monitoringSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{source.name}</h3>
                      <p className="text-sm text-muted-foreground">{source.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Last checked</p>
                      <p className="text-sm font-medium">{source.lastChecked}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Preparation Roadmap</CardTitle>
              <CardDescription>Our timeline for WCAG 3.0 adoption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5"/>
                  <div>
                    <h3 className="font-medium">Phase 1: Foundation (Completed)</h3>
                    <p className="text-sm text-green-800">
                      WCAG 2.2 AA compliance achieved, monitoring systems established,
                      accessibility team trained on emerging standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-accent-secondary mt-0.5"/>
                  <div>
                    <h3 className="font-medium">Phase 2: Monitoring (Active)</h3>
                    <p className="text-sm text-blue-800">
                      Regular review of working drafts, participation in accessibility
                      standards development, technology evaluation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-semantic-warning mt-0.5"/>
                  <div>
                    <h3 className="font-medium">Phase 3: Assessment (2026)</h3>
                    <p className="text-sm text-yellow-800">
                      Gap analysis against final WCAG 3.0 requirements,
                      development of migration plan, resource allocation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-neutral-600 mt-0.5"/>
                  <div>
                    <h3 className="font-medium">Phase 4: Implementation (2026-2027)</h3>
                    <p className="text-sm text-neutral-800">
                      Gradual adoption of WCAG 3.0 requirements, updated testing
                      methodologies, enhanced accessibility features.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact Assessment</CardTitle>
              <CardDescription>Expected changes and our preparedness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4"/>
                  <AlertDescription>
                    <strong>Positive Impact:</strong> WCAG 3.0&#39;s outcome-based approach aligns
                    with our user-centered design philosophy and will enhance accessibility for
                    diverse user groups.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4"/>
                  <AlertDescription>
                    <strong>Challenges:</strong> Transition from binary compliance to scored
                    outcomes requires new testing and measurement approaches.
                  </AlertDescription>
                </Alert>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-1">Strengths</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Strong WCAG 2.2 foundation</li>
                      <li>• User research capabilities</li>
                      <li>• Accessibility expertise</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h3 className="font-medium text-orange-900 mb-1">Areas for Focus</h3>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Scoring methodology adaptation</li>
                      <li>• Enhanced testing tools</li>
                      <li>• Expanded user testing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Current WCAG 3.0 Developments</h2>
          <div className="space-y-4 text-sm text-neutral-700">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
              <div>
                <strong>Working Draft Status:</strong> Active development with regular updates.
                Current focus on core guidelines and scoring methodology.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
              <div>
                <strong>Key Changes:</strong> Shift from technology-specific success criteria to
                outcome-based guidelines applicable across platforms.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
              <div>
                <strong>Timeline:</strong> Final recommendation expected in 2026, with
                implementation guidance following in 2027.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-semantic-warning rounded-full mt-2"></div>
              <div>
                <strong>Industry Impact:</strong> Organizations should maintain WCAG 2.2 compliance
                while preparing for 3.0 adoption over 2-3 year transition period.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Our Commitment</h2>
          <p className="text-indigo-800 mb-4">
            ATLVS + GVTEWAY is committed to staying at the forefront of accessibility standards.
            We actively participate in standards development and will adopt WCAG 3.0 upon its final release,
            ensuring our platform remains accessible to all users.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/legal/accessibility">Current Accessibility Statement</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact?subject=WCAG%203.0%20Inquiry">Contact Accessibility Team</a>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">
            WCAG 3.0 monitoring page last updated January 2026.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="https://www.w3.org/TR/wcag-3.0/" target="_blank" rel="noopener noreferrer">
                WCAG 3.0 Working Draft
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/legal/vpat">VPAT Report</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
