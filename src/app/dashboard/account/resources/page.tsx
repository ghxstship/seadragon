'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  BookOpen,
  Search,
  FileText,
  Play,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  Download,
  Star,
  Clock
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: string
  category: string
  url?: string
  content?: string
  tags: string[]
  is_featured: boolean
  view_count: number
  created_at: string
}

export default function ResourcesPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentCategory, setCurrentCategory] = useState('all')

  useEffect(() => {
    const loadResources = async () => {
      // Mock resources data - in real implementation, this would come from Supabase
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Getting Started Guide',
          description: 'Complete walkthrough for new users to get up and running quickly.',
          type: 'guide',
          category: 'getting-started',
          url: '/docs/getting-started',
          tags: ['beginner', 'setup', 'tutorial'],
          is_featured: true,
          view_count: 1250,
          created_at: '2024-01-01'
        },
        {
          id: '2',
          title: 'Project Management Best Practices',
          description: 'Learn how to effectively manage projects using our platform.',
          type: 'article',
          category: 'project-management',
          url: '/docs/project-management',
          tags: ['projects', 'management', 'best-practices'],
          is_featured: true,
          view_count: 890,
          created_at: '2024-01-15'
        },
        {
          id: '3',
          title: 'API Documentation',
          description: 'Complete API reference with examples and code samples.',
          type: 'documentation',
          category: 'developer',
          url: '/docs/api',
          tags: ['api', 'developer', 'reference'],
          is_featured: false,
          view_count: 567,
          created_at: '2024-02-01'
        },
        {
          id: '4',
          title: 'Video: Advanced Workflows',
          description: 'Step-by-step video tutorial on creating complex automation workflows.',
          type: 'video',
          category: 'tutorials',
          url: '/videos/advanced-workflows',
          tags: ['video', 'workflows', 'automation'],
          is_featured: false,
          view_count: 432,
          created_at: '2024-02-15'
        },
        {
          id: '5',
          title: 'Troubleshooting Common Issues',
          description: 'Solutions to frequently encountered problems and error messages.',
          type: 'faq',
          category: 'support',
          url: '/help/troubleshooting',
          tags: ['faq', 'troubleshooting', 'support'],
          is_featured: false,
          view_count: 678,
          created_at: '2024-03-01'
        }
      ]

      setResources(mockResources)
      setLoading(false)
    }

    loadResources()
  }, [])

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = currentCategory === 'all' || resource.category === currentCategory

    return matchesSearch && matchesCategory
  })

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="h-5 w-5 text-blue-500" />
      case 'article': return <FileText className="h-5 w-5 text-green-500" />
      case 'video': return <Play className="h-5 w-5 text-red-500" />
      case 'documentation': return <FileText className="h-5 w-5 text-purple-500" />
      case 'faq': return <HelpCircle className="h-5 w-5 text-yellow-500" />
      default: return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const categories = [
    { id: 'all', label: 'All Resources', count: resources.length },
    { id: 'getting-started', label: 'Getting Started', count: resources.filter(r => r.category === 'getting-started').length },
    { id: 'project-management', label: 'Project Management', count: resources.filter(r => r.category === 'project-management').length },
    { id: 'tutorials', label: 'Tutorials', count: resources.filter(r => r.category === 'tutorials').length },
    { id: 'developer', label: 'Developer', count: resources.filter(r => r.category === 'developer').length },
    { id: 'support', label: 'Support', count: resources.filter(r => r.category === 'support').length }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Resources & Help</h1>
        <p className="text-muted-foreground">
          Documentation, tutorials, and support resources to help you succeed
        </p>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={currentCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  {category.label}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Featured Resources */}
            {currentCategory === 'all' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Featured Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resources.filter(r => r.is_featured).map(resource => (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getResourceTypeIcon(resource.type)}
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                          </div>
                          <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getResourceTypeIcon(resource.type)}
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </div>
                      {resource.is_featured && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.view_count} views
                        </span>
                        <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full">
                        {resource.type === 'video' && <Play className="h-4 w-4 mr-2" />}
                        {resource.type === 'guide' && <BookOpen className="h-4 w-4 mr-2" />}
                        {resource.type === 'documentation' && <FileText className="h-4 w-4 mr-2" />}
                        {(resource.type === 'article' || resource.type === 'faq') && <FileText className="h-4 w-4 mr-2" />}
                        View Resource
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || currentCategory !== 'all'
                    ? 'Try adjusting your search or category filter'
                    : 'Resources will be added here soon'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="help" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">How do I create a new project?</span>
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                      Navigate to the Projects section and click "New Project". Fill in the required details and save.
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">How do I invite team members?</span>
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                      Go to Account → Organization → Team and click "Invite Member" to send invitations via email.
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">What are the different user roles?</span>
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                      Member: Basic access to assigned projects. Manager: Can create and manage projects. Admin: Full organization access. Platform Dev: System-level access.
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Support</h4>
                      <p className="text-sm text-muted-foreground">Get help from our support team</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-muted-foreground">Chat with support agents</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Knowledge Base</h4>
                      <p className="text-sm text-muted-foreground">Search our comprehensive help articles</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Community Forums
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">General Discussion</h4>
                      <p className="text-sm text-muted-foreground">Share ideas and get feedback</p>
                    </div>
                    <Badge variant="secondary">1.2k posts</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Feature Requests</h4>
                      <p className="text-sm text-muted-foreground">Suggest new features and improvements</p>
                    </div>
                    <Badge variant="secondary">340 posts</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Best Practices</h4>
                      <p className="text-sm text-muted-foreground">Share your success stories</p>
                    </div>
                    <Badge variant="secondary">89 posts</Badge>
                  </div>
                </div>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Visit Community
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning & Certification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">User Certification</h4>
                      <p className="text-sm text-muted-foreground">Become a certified platform user</p>
                    </div>
                    <Button variant="outline" size="sm">Start Course</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Admin Training</h4>
                      <p className="text-sm text-muted-foreground">Advanced administration training</p>
                    </div>
                    <Button variant="outline" size="sm">Enroll</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Webinars</h4>
                      <p className="text-sm text-muted-foreground">Live training sessions</p>
                    </div>
                    <Button variant="outline" size="sm">View Schedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
