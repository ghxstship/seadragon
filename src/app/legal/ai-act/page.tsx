
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, Shield, AlertTriangle, Eye, FileText, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Act Compliance | EU Artificial Intelligence Act | ATLVS + GVTEWAY',
  description: 'Risk classification and transparency measures for AI systems under EU AI Act.',
}

const aiSystems = [
  {
    name: 'Recommendation Engine',
    riskLevel: 'Low Risk',
    category: 'Content Personalization',
    description: 'AI-powered content and experience recommendations',
    transparency: 'Algorithm explainability, user control over recommendations',
    riskMitigation: 'User opt-out, bias monitoring, human oversight'
  },
  {
    name: 'Search & Discovery',
    riskLevel: 'Low Risk',
    category: 'Information Retrieval',
    description: 'Intelligent search and content discovery features',
    transparency: 'Search result explanations, relevance factors',
    riskMitigation: 'Query logging, result diversity, appeal mechanisms'
  },
  {
    name: 'Automated Scheduling',
    riskLevel: 'Minimal Risk',
    category: 'Planning Assistance',
    description: 'AI-assisted event and travel planning',
    transparency: 'Suggestion reasoning, alternative options',
    riskMitigation: 'Human approval required, clear limitations'
  }
]

const riskLevels = [
  {
    level: 'Unacceptable Risk',
    description: 'Prohibited AI systems',
    examples: ['Social scoring', 'Real-time biometric identification', 'Emotion recognition'],
    compliance: 'Not permitted under EU AI Act'
  },
  {
    level: 'High Risk',
    description: 'Systems requiring strict oversight',
    examples: ['Critical infrastructure', 'Education & vocational training', 'Employment & workers management'],
    compliance: 'Conformity assessment, data governance, transparency'
  },
  {
    level: 'Limited Risk',
    description: 'Systems with specific requirements',
    examples: ['Chatbots', 'Deepfakes', 'Biometric categorization'],
    compliance: 'Transparency obligations, user information'
  },
  {
    level: 'Minimal Risk',
    description: 'Most AI applications',
    examples: ['Spam filters', 'Recommendation systems', 'AI-generated art'],
    compliance: 'General transparency, voluntary codes of conduct'
  }
]

export default function AIActPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-accent-primary"/>
            <h1 className="text-3xl font-bold text-neutral-900">EU AI Act Compliance</h1>
          </div>
          <p className="text-lg text-neutral-600 mb-4">
            Risk classification and transparency measures for artificial intelligence systems under the EU Artificial Intelligence Act.
          </p>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-accent-primary"/>
              <p className="text-sm text-purple-800">
                <strong>Compliance Status:</strong> EU AI Act Ready<br/>
                <strong>Risk Classification:</strong> Minimal to Low Risk Systems<br/>
                <strong>Implementation Date:</strong> Prepared for 2026 Enforcement
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Risk Classification Framework</CardTitle>
              <CardDescription>AI systems categorized by risk level under EU AI Act</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {riskLevels.map((level, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{level.level}</h3>
                      <Badge variant={
                        level.level === 'Unacceptable Risk' ? 'destructive' :
                        level.level === 'High Risk' ? 'destructive' :
                        level.level === 'Limited Risk' ? 'secondary' :
                        'outline'
                      }>
                        {level.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                    <div className="mb-2">
                      <strong className="text-sm">Examples:</strong>
                      <p className="text-sm text-muted-foreground">{level.examples.join(', ')}</p>
                    </div>
                    <div>
                      <strong className="text-sm">Requirements:</strong>
                      <p className="text-sm text-muted-foreground">{level.compliance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5"/>
                AI Systems in Our Platform
              </CardTitle>
              <CardDescription>Risk assessment of AI systems used in ATLVS + GVTEWAY</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiSystems.map((system, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{system.name}</h3>
                        <p className="text-sm text-muted-foreground">{system.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          system.riskLevel === 'Low Risk' ? 'secondary' :
                          'outline'
                        }>
                          {system.riskLevel}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{system.category}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Transparency Measures:</strong>
                        <p className="text-muted-foreground mt-1">{system.transparency}</p>
                      </div>
                      <div>
                        <strong>Risk Mitigation:</strong>
                        <p className="text-muted-foreground mt-1">{system.riskMitigation}</p>
                      </div>
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
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5"/>
                Transparency Obligations
              </CardTitle>
              <CardDescription>Information provided to users about AI systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-accent-secondary"/>
                    <span className="font-medium">User Information</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Clear indication when interacting with AI systems, explanation of AI role,
                    and information about data used for AI training.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-semantic-success"/>
                    <span className="font-medium">AI Content Disclosure</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Clear labeling of AI-generated content, including summaries, reviews,
                    and personalized recommendations.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-accent-primary"/>
                    <span className="font-medium">Data Usage Transparency</span>
                  </div>
                  <p className="text-sm text-purple-800">
                    Information about what data is used to train AI systems and how user
                    data contributes to AI model improvement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5"/>
                Fundamental Rights Impact Assessment
              </CardTitle>
              <CardDescription>Assessment of AI systems impact on fundamental rights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4"/>
                  <AlertDescription>
                    <strong>All AI systems classified as Minimal/Low Risk:</strong> No significant impact
                    on fundamental rights identified. Systems are designed for user benefit and include
                    appropriate safeguards and opt-out mechanisms.
                  </AlertDescription>
                </Alert>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="font-medium mb-1">Privacy</div>
                    <div className="text-muted-foreground">Data minimization, user consent</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="font-medium mb-1">Non-Discrimination</div>
                    <div className="text-muted-foreground">Bias monitoring, fair algorithms</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="font-medium mb-1">Human Oversight</div>
                    <div className="text-muted-foreground">Human review, appeal mechanisms</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Implementation Timeline</h2>
          <div className="space-y-4 text-sm text-neutral-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-semantic-success text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold"></div>
              <div>
                <h3 className="font-medium">Phase 1: Risk Assessment (Completed)</h3>
                <p>Identified and classified all AI systems by risk level</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-semantic-success text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold"></div>
              <div>
                <h3 className="font-medium">Phase 2: Transparency Measures (Completed)</h3>
                <p>Implemented user information and AI content disclosure</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">→</div>
              <div>
                <h3 className="font-medium">Phase 3: Monitoring & Compliance (2026)</h3>
                <p>Continuous monitoring and compliance with EU AI Act requirements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-neutral-400 text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">○</div>
              <div>
                <h3 className="font-medium">Phase 4: High-Risk Assessment (If Applicable)</h3>
                <p>Conformity assessment for any future high-risk AI systems</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">User Rights & Controls</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4"/>
                AI Opt-Out
              </h3>
              <p className="text-sm text-yellow-800">
                Users can opt-out of AI-powered features and request human-only processing
                for any service aspect.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4"/>
                Explainability
              </h3>
              <p className="text-sm text-yellow-800">
                Users can request explanations for AI-driven decisions and recommendations.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4"/>
                Appeal Mechanisms
              </h3>
              <p className="text-sm text-yellow-800">
                Users can appeal AI-generated outcomes and request human review.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4"/>
                Data Control
              </h3>
              <p className="text-sm text-yellow-800">
                Users control whether their data is used for AI training and model improvement.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Prohibited AI Practices</h2>
          <p className="text-red-800 mb-4">
            ATLVS + GVTEWAY does not engage in any AI practices prohibited under the EU AI Act:
          </p>
          <ul className="space-y-2 text-sm text-red-800">
            <li>• Social scoring or social credit systems</li>
            <li>• Real-time remote biometric identification in public spaces</li>
            <li>• AI systems that manipulate human behavior beyond legitimate purposes</li>
            <li>• AI used for exploitative labor practices</li>
            <li>• Emotion recognition in workplaces and educational institutions</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">
            Questions about our AI systems or EU AI Act compliance?
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/contact?subject=AI%20Compliance">Contact AI Team</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/legal/data-portability">Data Portability</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
