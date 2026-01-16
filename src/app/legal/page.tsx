
'use client'


import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { FileText, Shield, Search, Download, Calendar, ExternalLink, Eye, AlertTriangle, CheckCircle, Globe, Lock, Users, Scale, BookOpen, Clock, Mail, Phone } from "lucide-react"

interface LegalDocumentApiResponse {
  id: string | number
  title?: string
  description?: string
  category?: string
  last_updated?: string
  updated_at?: string
  version?: string
  status?: string
  download_url?: string
  view_url?: string
  size?: string
  importance?: string
}

interface LegalDocument {
  id: string
  title: string
  description: string
  category: 'terms' | 'privacy' | 'compliance' | 'policies' | 'disclaimers'
  lastUpdated: Date
  version: string
  status: 'active' | 'draft' | 'archived'
  downloadUrl?: string
  viewUrl: string
  size?: string
  icon: React.ComponentType<{ className?: string }>
  importance: 'critical' | 'important' | 'standard'
}

interface LegalDocument {
  id: string
  title: string
  description: string
  category: 'terms' | 'privacy' | 'compliance' | 'policies' | 'disclaimers'
  lastUpdated: Date
  version: string
  status: 'active' | 'draft' | 'archived'
  downloadUrl?: string
  viewUrl: string
  size?: string
  icon: React.ComponentType<{ className?: string }>
  importance: 'critical' | 'important' | 'standard'
}

interface ComplianceInfo {
  id: string
  standard: string
  description: string
  status: 'compliant' | 'in-progress' | 'planned'
  lastAudit: Date
  nextAudit: Date
  icon: string
}

export default function LegalPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadLegalDocuments = async () => {
      try {
        const res = await fetch('/api/v1/legal/documents')
        if (res.ok) {
          const data = await res.json()
          const docs = Array.isArray(data.documents) ? data.documents : []
          if (!cancelled) {
            const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
              'terms': FileText,
              'privacy': Shield,
              'cookies': Lock,
              'policies': Scale,
              'compliance': Users,
              'disclaimers': BookOpen,
              'default': FileText
            }
            setLegalDocuments(docs.map((d: LegalDocumentApiResponse) => ({
              id: String(d.id),
              title: String(d.title || ''),
              description: String(d.description || ''),
              category: (d.category as 'terms' | 'privacy' | 'compliance' | 'policies' | 'disclaimers') || 'terms',
              lastUpdated: new Date(d.last_updated || d.updated_at || new Date()),
              version: String(d.version || '1.0.0'),
              status: (d.status as 'active' | 'draft' | 'archived') || 'active',
              downloadUrl: d.download_url,
              viewUrl: String(d.view_url || `/legal/${d.id}`),
              size: d.size,
              icon: iconMap[d.category] || iconMap['default'],
              importance: (d.importance as 'critical' | 'important' | 'standard') || 'standard'
            })))
          }
        } else {
          if (!cancelled) {
            setLegalDocuments([])
          }
        }
      } catch (error) {
        logger.error('Error loading legal documents:', error)
        if (!cancelled) {
          setLegalDocuments([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadLegalDocuments()

    return () => { cancelled = true }
  }, [])

  const filteredDocuments = legalDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const complianceInfo: ComplianceInfo[] = [
    {
      id: "gdpr",
      standard: "GDPR",
      description: "General Data Protection Regulation compliance for EU users",
      status: "compliant",
      lastAudit: new Date("2025-12-01"),
      nextAudit: new Date("2026-12-01"),
      icon: "🇪🇺"
    },
    {
      id: "ccpa",
      standard: "CCPA",
      description: "California Consumer Privacy Act compliance",
      status: "compliant",
      lastAudit: new Date("2025-11-15"),
      nextAudit: new Date("2026-11-15"),
      icon: "🇺🇸"
    },
    {
      id: "ada",
      standard: "ADA",
      description: "Americans with Disabilities Act accessibility compliance",
      status: "compliant",
      lastAudit: new Date("2025-10-20"),
      nextAudit: new Date("2026-10-20"),
      icon: ""
    },
    {
      id: "wcag",
      standard: "WCAG 2.1 AA",
      description: "Web Content Accessibility Guidelines compliance",
      status: "compliant",
      lastAudit: new Date("2025-09-30"),
      nextAudit: new Date("2026-09-30"),
      icon: ""
    }
  ]

  const categories = [
    { id: "all", label: "All Documents", count: legalDocuments.length },
    { id: "terms", label: "Terms & Conditions", count: legalDocuments.filter(d => d.category === "terms").length },
    { id: "privacy", label: "Privacy & Cookies", count: legalDocuments.filter(d => d.category === "privacy").length },
    { id: "policies", label: "Policies", count: legalDocuments.filter(d => d.category === "policies").length },
    { id: "compliance", label: "Compliance", count: legalDocuments.filter(d => d.category === "compliance").length },
    { id: "disclaimers", label: "Disclaimers", count: legalDocuments.filter(d => d.category === "disclaimers").length }
  ]

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-semantic-error/10 text-red-800'
      case 'important': return 'bg-semantic-warning/10 text-yellow-800'
      case 'standard': return 'bg-semantic-success/10 text-green-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-semantic-success/10 text-green-800'
      case 'draft': return 'bg-semantic-warning/10 text-yellow-800'
      case 'archived': return 'bg-neutral-100 text-neutral-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-semantic-success/10 text-green-800'
      case 'in-progress': return 'bg-semantic-warning/10 text-yellow-800'
      case 'planned': return 'bg-accent-primary/10 text-blue-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Scale className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Legal Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Access our complete collection of legal documents, policies, and compliance information.
              Transparency and trust are fundamental to our relationship with users.
            </p>

            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input
                    placeholder="Search legal documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"/>
                </div>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-64">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="terms" className="text-xs">Terms</TabsTrigger>
                    <TabsTrigger value="privacy" className="text-xs">Privacy</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Essential Documents</h2>
            <p className="text-lg text-muted-foreground">
              Most frequently accessed legal documents and policies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {legalDocuments.filter(doc => doc.importance === 'critical').map((doc) => (
              <Card key={doc.id} className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${doc.importance === 'critical' ? 'bg-semantic-error/10' : 'bg-accent-primary/20'}`}>
                      <doc.icon className="h-6 w-6 text-accent-primary"/>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getImportanceColor(doc.importance)}>
                        {doc.importance}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{doc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>v{doc.version}</span>
                    <span>{doc.size}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={doc.viewUrl}>
                        <Eye className="h-3 w-3 mr-1"/>
                        View
                      </Link>
                    </Button>
                    {doc.downloadUrl && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={doc.downloadUrl}>
                          <Download className="h-3 w-3 mr-1"/>
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="#all-documents">
                <FileText className="h-5 w-5 mr-2"/>
                Browse All Documents ({legalDocuments.length})
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Compliance & Standards */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Compliance & Standards</h2>
            <p className="text-lg text-muted-foreground">
              Our commitment to legal compliance and regulatory standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceInfo.map((compliance) => (
              <Card key={compliance.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{compliance.icon}</div>
                    <Badge className={getComplianceStatusColor(compliance.status)}>
                      {compliance.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{compliance.standard}</CardTitle>
                  <CardDescription>{compliance.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Audit:</span>
                      <span>{compliance.lastAudit.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Audit:</span>
                      <span>{compliance.nextAudit.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Legal Documents */}
      <section id="all-documents" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">All Legal Documents</h2>
              <p className="text-muted-foreground">
                Complete collection of our legal documents and policies
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2"/>
                Download All
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs lg:text-sm">
                  {cat.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {cat.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${doc.importance === 'critical' ? 'bg-semantic-error/10' : 'bg-accent-primary/20'}`}>
                        <doc.icon className="h-6 w-6 text-accent-primary"/>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold hover:text-accent-primary cursor-pointer">
                            {doc.title}
                          </h3>
                          <Badge className={getImportanceColor(doc.importance)}>
                            {doc.importance}
                          </Badge>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{doc.description}</p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4"/>
                            v{doc.version}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4"/>
                            Updated {doc.lastUpdated.toLocaleDateString()}
                          </div>
                          {doc.size && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4"/>
                              {doc.size}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={doc.viewUrl}>
                          <Eye className="h-4 w-4 mr-1"/>
                          View
                        </Link>
                      </Button>
                      {doc.downloadUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.downloadUrl}>
                            <Download className="h-4 w-4 mr-1"/>
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Team Contact */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/20 rounded-full mb-4">
                <Mail className="h-8 w-8 text-accent-primary"/>
              </div>
              <CardTitle className="text-2xl">Questions About Our Legal Documents?</CardTitle>
              <CardDescription>
                Our legal team is available to answer questions about our policies, terms, and compliance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground"/>
                      <div>
                        <div className="font-medium">Legal Team</div>
                        <div className="text-sm text-muted-foreground">legal@atlvs.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground"/>
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground"/>
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div className="text-sm text-muted-foreground">Within 24-48 hours</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Common Questions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 flex-shrink-0"/>
                      <span>Interpretation of terms and policies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 flex-shrink-0"/>
                      <span>Data privacy and rights inquiries</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 flex-shrink-0"/>
                      <span>Compliance and accessibility questions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 flex-shrink-0"/>
                      <span>Legal notices and document updates</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button size="lg" asChild>
                  <Link href="/contact?topic=legal">
                    <Mail className="h-5 w-5 mr-2"/>
                    Contact Legal Team
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Legal Center.</p>
            <p className="text-sm mt-2">
              All legal documents are regularly reviewed and updated to ensure compliance with applicable laws and regulations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
