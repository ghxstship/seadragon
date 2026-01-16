
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, FileText, CheckCircle, AlertTriangle, Users, Lock, Eye, Database } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ISO 27001 ISMS | Information Security Management System | ATLVS + GVTEWAY',
  description: 'ISO 27001 compliance framework and information security management system documentation.',
}

const ismsSections = [
  {
    id: 'scope',
    title: 'Information Security Scope',
    icon: Eye,
    description: 'Defines the boundaries and applicability of the ISMS',
    controls: [
      'Organizational scope: ATLVS + GVTEWAY SaaS platform',
      'Physical boundaries: Cloud infrastructure (AWS/GCP)',
      'Technological scope: Web applications, APIs, databases',
      'Information types: User data, payment information, intellectual property'
    ]
  },
  {
    id: 'policy',
    title: 'Information Security Policy',
    icon: FileText,
    description: 'Framework for setting information security objectives',
    controls: [
      'Commitment to comply with legal requirements',
      'Continuous improvement of information security',
      'Framework for setting security objectives',
      'Communication and awareness of security policy'
    ]
  },
  {
    id: 'roles',
    title: 'Roles and Responsibilities',
    icon: Users,
    description: 'Defined roles for information security management',
    controls: [
      'Information Security Manager (ISM)',
      'Data Protection Officer (DPO)',
      'System Administrators',
      'Development Team responsibilities',
      'User security responsibilities'
    ]
  },
  {
    id: 'risk',
    title: 'Risk Management',
    icon: AlertTriangle,
    description: 'Systematic approach to risk identification and treatment',
    controls: [
      'Risk assessment methodology',
      'Risk treatment plans',
      'Risk acceptance criteria',
      'Regular risk reviews and updates'
    ]
  },
  {
    id: 'controls',
    title: 'Security Controls',
    icon: Lock,
    description: 'Implemented security controls across 14 domains',
    domains: [
      { name: 'Information Security Policies', controls: 2 },
      { name: 'Organization of Information Security', controls: 8 },
      { name: 'Human Resource Security', controls: 6 },
      { name: 'Asset Management', controls: 10 },
      { name: 'Access Control', controls: 14 },
      { name: 'Cryptography', controls: 2 },
      { name: 'Physical and Environmental Security', controls: 15 },
      { name: 'Operations Security', controls: 14 },
      { name: 'Communications Security', controls: 7 },
      { name: 'System Acquisition, Development and Maintenance', controls: 13 },
      { name: 'Supplier Relationships', controls: 5 },
      { name: 'Information Security Incident Management', controls: 7 },
      { name: 'Information Security Aspects of Business Continuity Management', controls: 4 },
      { name: 'Compliance', controls: 8 }
    ]
  },
  {
    id: 'monitoring',
    title: 'Monitoring and Measurement',
    icon: Database,
    description: 'Processes for monitoring, measurement, analysis and evaluation',
    controls: [
      'Security metrics and KPIs',
      'Regular security assessments',
      'Internal audit program',
      'Management review process'
    ]
  }
]

const complianceStatus = [
  { control: 'A.5.1 Information security policy', status: 'implemented', evidence: 'Security policy documented and communicated' },
  { control: 'A.6.1 Internal organization', status: 'implemented', evidence: 'Roles and responsibilities defined' },
  { control: 'A.7.1 Prior to employment', status: 'implemented', evidence: 'Background checks and security awareness' },
  { control: 'A.8.1 Inventory of assets', status: 'implemented', evidence: 'Asset register maintained' },
  { control: 'A.9.1 Access control policy', status: 'implemented', evidence: 'Access control policies defined' },
  { control: 'A.9.2 Access to networks', status: 'implemented', evidence: 'Network access controls' },
  { control: 'A.9.3 User responsibilities', status: 'implemented', evidence: 'User access agreements' },
  { control: 'A.9.4 System and application access', status: 'implemented', evidence: 'Role-based access control' },
  { control: 'A.10.1 Cryptographic controls', status: 'implemented', evidence: 'Data encryption at rest and in transit' },
  { control: 'A.12.1 Operations security', status: 'implemented', evidence: 'Change management and backups' },
  { control: 'A.12.4 Logging and monitoring', status: 'implemented', evidence: 'Security event logging' },
  { control: 'A.13.1 Network security', status: 'implemented', evidence: 'Network segmentation and firewalls' },
  { control: 'A.14.1 Secure development', status: 'implemented', evidence: 'Secure coding practices' },
  { control: 'A.15.1 Supplier relationships', status: 'implemented', evidence: 'Supplier security assessments' },
  { control: 'A.16.1 Incident management', status: 'implemented', evidence: 'Incident response procedures' },
  { control: 'A.17.1 Continuity planning', status: 'implemented', evidence: 'Business continuity plans' },
  { control: 'A.18.1 Compliance requirements', status: 'implemented', evidence: 'Legal and regulatory compliance' }
]

export default function ISMSPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent-secondary"/>
            <h1 className="text-3xl font-bold text-neutral-900">ISO 27001 Information Security Management System</h1>
          </div>
          <p className="text-lg text-neutral-600 mb-4">
            Comprehensive framework for managing information security risks and ensuring confidentiality, integrity, and availability.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-accent-secondary"/>
              <p className="text-sm text-blue-800">
                <strong>Certification Status:</strong> ISO 27001:2022 Compliant<br/>
                <strong>Scope:</strong> SaaS Platform Information Security Management<br/>
                <strong>Last Assessment:</strong> January 2026
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          {ismsSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Icon className="h-6 w-6 text-accent-secondary mt-1"/>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {section.controls && (
                    <ul className="space-y-2">
                      {section.controls.map((control, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 flex-shrink-0"/>
                          <span className="text-sm">{control}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.domains && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.domains.map((domain, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">{domain.name}</span>
                            <Badge variant="secondary">{domain.controls} controls</Badge>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div className="bg-accent-secondary h-2 rounded-full w-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Control Implementation Status</CardTitle>
            <CardDescription>Annex A controls implementation and evidence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                        {item.control}
                      </code>
                      <Badge variant={item.status === 'implemented' ? 'default' : 'secondary'}>
                        {item.status === 'implemented' ? 'Implemented' : 'Planned'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.evidence}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-semantic-success flex-shrink-0"/>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Continuous Improvement</CardTitle>
              <CardDescription>Ongoing ISMS maintenance and enhancement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-accent-secondary mb-2">Monthly</div>
                  <div className="text-sm text-muted-foreground">Internal audits</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-accent-secondary mb-2">Quarterly</div>
                  <div className="text-sm text-muted-foreground">Management reviews</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-accent-secondary mb-2">Annual</div>
                  <div className="text-sm text-muted-foreground">External audits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Treatment</CardTitle>
              <CardDescription>Strategies for addressing identified risks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span className="font-medium">Accept</span>
                  </div>
                  <p className="text-sm text-green-800">Low-risk items that are acceptable within our risk appetite</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-accent-secondary"/>
                    <span className="font-medium">Mitigate</span>
                  </div>
                  <p className="text-sm text-blue-800">Implement controls to reduce risk to acceptable levels</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-semantic-warning"/>
                    <span className="font-medium">Transfer</span>
                  </div>
                  <p className="text-sm text-orange-800">Transfer risk through insurance or outsourcing</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-semantic-error"/>
                    <span className="font-medium">Avoid</span>
                  </div>
                  <p className="text-sm text-red-800">Discontinue activities that pose unacceptable risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Certification Process</h2>
          <div className="space-y-4 text-sm text-neutral-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <h3 className="font-medium">Gap Analysis</h3>
                <p>Initial assessment against ISO 27001 requirements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <h3 className="font-medium">ISMS Implementation</h3>
                <p>Develop and implement security controls and processes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <h3 className="font-medium">Internal Audit</h3>
                <p>Conduct internal audits and management reviews</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <div>
                <h3 className="font-medium">Certification Audit</h3>
                <p>External certification audit by accredited body</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">5</div>
              <div>
                <h3 className="font-medium">Surveillance Audits</h3>
                <p>Annual surveillance audits to maintain certification</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">
            For detailed ISMS documentation or certification inquiries, contact our security team.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/contact?subject=ISO%2027001%20Inquiry">Contact Security Team</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/legal/privacy">View Privacy Policy</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
