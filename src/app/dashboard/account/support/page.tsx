'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  HelpCircle,
  Plus,
  Search,
  DollarSign,
  User,
  Lightbulb
} from 'lucide-react'

interface SupportTicket {
  id: string
  subject: string
  description: string
  priority: string
  status: string
  category: string
  created_at: string
  updated_at: string
  assigned_to?: string
  resolution?: string
}

export default function SupportPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadSupportTickets = async () => {
      if (!session?.user?.organizationId) return

      // Mock support tickets - in real implementation, this would come from Supabase
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          subject: 'Unable to upload large files',
          description: 'Getting error when trying to upload files over 50MB',
          priority: 'high',
          status: 'open',
          category: 'technical',
          created_at: '2024-01-10',
          updated_at: '2024-01-10'
        },
        {
          id: '2',
          subject: 'Billing question about additional users',
          description: 'Need clarification on pricing for adding team members',
          priority: 'medium',
          status: 'resolved',
          category: 'billing',
          created_at: '2024-01-08',
          updated_at: '2024-01-09',
          resolution: 'Provided detailed pricing information via email'
        },
        {
          id: '3',
          subject: 'Feature request: API improvements',
          description: 'Would like to see better API documentation and webhook support',
          priority: 'low',
          status: 'in_progress',
          category: 'feature_request',
          created_at: '2024-01-05',
          updated_at: '2024-01-07',
          assigned_to: 'Product Team'
        }
      ]

      setTickets(mockTickets)
      setLoading(false)
    }

    loadSupportTickets()
  }, [session])

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return

    setSubmitting(true)

    // Create new ticket
    const ticket: SupportTicket = {
      id: Date.now().toString(),
      ...newTicket,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setTickets(prev => [ticket, ...prev])
    setNewTicket({
      subject: '',
      description: '',
      priority: 'medium',
      category: 'general'
    })
    setShowNewTicket(false)
    setSubmitting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
      case 'new': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
      case 'closed': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <FileText className="h-4 w-4" />
      case 'billing': return <DollarSign className="h-4 w-4" />
      case 'account': return <User className="h-4 w-4" />
      case 'feature_request': return <Lightbulb className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const getStats = () => {
    const total = tickets.length
    const open = tickets.filter(t => t.status === 'open').length
    const inProgress = tickets.filter(t => t.status === 'in_progress').length
    const resolved = tickets.filter(t => t.status === 'resolved').length
    const urgent = tickets.filter(t => t.priority === 'urgent').length

    return { total, open, inProgress, resolved, urgent }
  }

  const stats = getStats()

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
        <h1 className="text-3xl font-bold">Support Center</h1>
        <p className="text-muted-foreground">
          Get help, submit tickets, and access support resources
        </p>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Us
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-6">
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Open</p>
                      <p className="text-2xl font-bold">{stats.open}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold">{stats.inProgress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                      <p className="text-2xl font-bold">{stats.resolved}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Urgent</p>
                      <p className="text-2xl font-bold">{stats.urgent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* New Ticket Button */}
            <div className="flex justify-end">
              <Button onClick={() => setShowNewTicket(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Support Ticket
              </Button>
            </div>

            {/* New Ticket Form */}
            {showNewTicket && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Support Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTicket.priority}
                        onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTicket.category}
                        onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="feature_request">Feature Request</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of your issue or request"
                      rows={4}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleCreateTicket} disabled={submitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {submitting ? 'Creating...' : 'Create Ticket'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tickets List */}
            <div className="space-y-4">
              {tickets.map(ticket => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-lg">{ticket.subject}</h3>
                          {getStatusIcon(ticket.status)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <Badge variant="outline" className="capitalize">
                            {ticket.category.replace('_', ' ')}
                          </Badge>
                          <Badge variant={getPriorityColor(ticket.priority) as any}>
                            {ticket.priority} priority
                          </Badge>
                          <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
                          {ticket.assigned_to && (
                            <span>Assigned to {ticket.assigned_to}</span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ticket.description}
                        </p>

                        {ticket.resolution && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center gap-2 text-green-800 text-sm font-medium mb-1">
                              <CheckCircle className="h-4 w-4" />
                              Resolution
                            </div>
                            <p className="text-sm text-green-700">{ticket.resolution}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {tickets.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No support tickets yet</h3>
                <p className="text-muted-foreground mb-4">Your support tickets will appear here</p>
                <Button onClick={() => setShowNewTicket(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="help" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">How do I reset my password?</span>
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                      Go to Account → Profile → Security and click "Change Password". Follow the instructions to set a new password.
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">How do I invite team members?</span>
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                      Navigate to Account → Organization → Team and use the "Invite Member" button to send email invitations.
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">What are the user roles?</span>
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                      Member: Basic access, Manager: Project management, Admin: Organization control, Platform Dev: System access.
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Getting Started Guide</div>
                      <div className="text-sm text-muted-foreground">Complete walkthrough for new users</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Project Management</div>
                      <div className="text-sm text-muted-foreground">Best practices and workflows</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">API Documentation</div>
                      <div className="text-sm text-muted-foreground">Complete developer reference</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Troubleshooting</div>
                      <div className="text-sm text-muted-foreground">Common issues and solutions</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get instant help from our support team
                </p>
                <div className="space-y-2">
                  <Badge variant="default">Available 24/7</Badge>
                  <p className="text-xs text-muted-foreground">Average response: 2 minutes</p>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us a detailed message about your issue
                </p>
                <div className="space-y-2">
                  <Badge variant="secondary">Business Hours</Badge>
                  <p className="text-xs text-muted-foreground">Response within 4 hours</p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Speak directly with a support specialist
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">Premium Plans</Badge>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  User Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  API Reference
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Integration Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Security Best Practices
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Community Forums
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Knowledge Base
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Release Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
