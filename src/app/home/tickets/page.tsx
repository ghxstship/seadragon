
'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logger } from "@/lib/logger"

interface PaymentApiResponse {
  id: string | number
  description?: string
  event_name?: string
  venue?: string
  event_date?: string
  event_time?: string
  ticket_type?: string
  seat?: string
  confirmation_code?: string | number
  status?: string
}

interface Ticket {
  id: string
  event: string
  venue: string
  date: string
  time: string
  section: string
  seat: string
  qrCode: string
  status: string
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadTickets = async () => {
      try {
        // Fetch user's tickets/bookings from payments API
        const res = await fetch('/api/v1/payments?type=ticket&limit=20')
        if (res.ok) {
          const data = await res.json()
          const payments = Array.isArray(data.payments) ? data.payments : []
          // Map payments to ticket shape
          const mapped: Ticket[] = payments.map((p: PaymentApiResponse) => ({
            id: String(p.id),
            event: String(p.description || p.event_name || 'Event'),
            venue: String(p.venue || 'Venue TBD'),
            date: p.event_date ? new Date(p.event_date).toLocaleDateString() : 'TBD',
            time: p.event_time || '',
            section: String(p.ticket_type || 'General'),
            seat: String(p.seat || 'GA'),
            qrCode: String(p.confirmation_code || p.id),
            status: p.status === 'completed' ? 'active' : p.status
          }))
          if (!cancelled) {
            setTickets(mapped)
            setIsLoading(false)
          }
        } else {
          if (!cancelled) {
            setTickets([])
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading tickets:', error)
        if (!cancelled) {
          setTickets([])
          setIsLoading(false)
        }
      }
    }

    loadTickets()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-display font-bold">ATLVS + GVTEWAY</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/home" className="text-sm font-medium">Home</Link>
            <Link href="/home/itineraries" className="text-sm font-medium">Itineraries</Link>
            <Link href="/home/tickets" className="text-sm font-medium text-accent-primary">Tickets</Link>
            <Link href="/home/profile" className="text-sm font-medium">Profile</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage all your event tickets and passes.
          </p>
        </div>

        {/* Ticket Filters */}
        <div className="mb-6 flex gap-2">
          <Button variant="default" size="sm">All Tickets</Button>
          <Button variant="outline" size="sm">Upcoming</Button>
          <Button variant="outline" size="sm">Past Events</Button>
          <Button variant="outline" size="sm">Digital Wallet</Button>
        </div>

        {/* Tickets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t purchased any tickets yet. Start exploring events!
              </p>
              <Button asChild><Link href="/book/tickets">Browse Events</Link></Button>
            </div>
          )}
          {tickets.map((ticket: Ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{ticket.event}</CardTitle>
                    <CardDescription>{ticket.venue}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === 'active'
                      ? 'bg-semantic-success/10 text-green-800'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">{ticket.date} at {ticket.time}</div>
                  <div className="text-muted-foreground">
                    Section {ticket.section} • Seat {ticket.seat}
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="bg-neutral-100 p-4 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-2">Ticket QR Code</div>
                  <div className="w-20 h-20 bg-background border mx-auto flex items-center justify-center">
                    <span className="text-xs font-mono">{ticket.qrCode}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Ticket Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Management</CardTitle>
              <CardDescription>
                Additional actions for your tickets and passes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Digital Wallet</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Access your tickets on any device with our mobile wallet.
                </p>
                <Button size="sm" variant="outline">Download App</Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Transfer Tickets</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Send tickets to friends or resell through our marketplace.
                </p>
                <Button size="sm" variant="outline">Transfer Hub</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
