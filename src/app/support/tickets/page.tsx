
'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Plus, Clock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react"

interface SupportTicket {
  id: string
  subject: string
  category: string
  priority: string
  status: string
  description: string
  created_at: string
  updated_at?: string
}

export default function Tickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/support/tickets')
        if (!response.ok) {
          if (response.status === 401) {
            setError('Please sign in to view your support tickets')
            return
          }
          throw new Error('Failed to fetch tickets')
        }
        const data = await response.json()
        setTickets(data.data || [])
      } catch (err) {
        setError('Failed to load support tickets')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1"/>Open</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800"><MessageSquare className="h-3 w-3 mr-1"/>In Progress</Badge>
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1"/>Resolved</Badge>
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'normal':
        return <Badge className="bg-gray-100 text-gray-800">Normal</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header/>

      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/support" className="hover:text-foreground">Support</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tickets</span>
          </div>
        </div>
      </nav>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">Support Tickets</h1>
              <p className="text-muted-foreground">View and manage your support requests</p>
            </div>
            <Button asChild>
              <Link href="/support/tickets/new">
                <Plus className="h-4 w-4 mr-2"/>New Ticket
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {loading ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading tickets...</p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                  <p className="text-muted-foreground">{error}</p>
                  <Button className="mt-4" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
                  <p className="text-muted-foreground mb-4">You haven&apos;t submitted any support tickets yet.</p>
                  <Button asChild>
                    <Link href="/support/tickets/new">
                      <Plus className="h-4 w-4 mr-2"/>Create Your First Ticket
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          <Link href={`/support/tickets/${ticket.id}`} className="hover:text-accent-primary">
                            {ticket.subject}
                          </Link>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {ticket.category} • Created {new Date(ticket.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t py-12 px-4 mt-12">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
