
'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/lib/design-system'
import { Calendar, MapPin, Clock, CreditCard, Download, Edit, X, CheckCircle, AlertCircle } from 'lucide-react'

interface Reservation {
  id: string
  experience: string
  venue: string
  location: string
  date: string
  time: string
  guests: number
  total_amount: number
  status: string
  booking_ref: string
  payment_status: string
}

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([])
  const [pastReservations, setPastReservations] = useState<Reservation[]>([])
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch reservations from Supabase API
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/v1/bookings?status=all')
        if (res.ok) {
          const data = await res.json()
          const reservations = data.reservations || []
          
          // Filter by status
          setActiveReservations(reservations.filter((r: Reservation) => r.status === 'confirmed'))
          setPastReservations(reservations.filter((r: Reservation) => r.status === 'completed'))
          setPendingReservations(reservations.filter((r: Reservation) => r.status === 'pending'))
        }
      } catch (error) {
        logger.error('Error fetching reservations', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReservations()
  }, [])


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-semantic-success/10 text-green-800'
      case 'completed': return 'bg-accent-primary/10 text-blue-800'
      case 'pending_payment': return 'bg-semantic-warning/10 text-yellow-800'
      case 'cancelled': return 'bg-semantic-error/10 text-red-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-semantic-success'
      case 'pending': return 'text-semantic-warning'
      case 'refunded': return 'text-accent-secondary'
      case 'failed': return 'text-semantic-error'
      default: return 'text-neutral-600'
    }
  }

  const handleCancelReservation = (id: string) => {
    // In real app, this would make an API call
    logger.action('cancel_reservation', { reservationId: id })
  }

  const handleDownloadTicket = (id: string) => {
    // In real app, this would trigger a download
    logger.action('download_ticket', { reservationId: id })
  }

  const renderReservationCard = (reservation: Reservation) => (
    <Card key={reservation.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{reservation.experience}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1"/>
              {reservation.venue}, {reservation.location}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(reservation.status)}>
              {reservation.status.replace('_', ' ')}
            </Badge>
            {reservation.status === 'confirmed' && (
              <Button variant="ghost" size="sm" onClick={() => handleDownloadTicket(reservation.id)}>
                <Download className="h-4 w-4"/>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
              <span>{new Date(reservation.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground"/>
              <span>{reservation.time}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground mr-2">Guests:</span>
              <span>{reservation.guests}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground mr-2">Booking Ref:</span>
              <span className="font-mono">{reservation.booking_ref}</span>
            </div>
            <div className="flex items-center text-sm">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground"/>
              <span className={getPaymentStatusColor(reservation.payment_status)}>
                {reservation.payment_status}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground mr-2">Total:</span>
              <span className="font-semibold">${reservation.total_amount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Items breakdown */}
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-sm">Reservation Details</h4>
          {/* Items would be fetched from a separate API call */}
          <div className="text-sm text-muted-foreground">Reservation details available in booking confirmation</div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Booked on {new Date().toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            {reservation.status === 'confirmed' && (
              <>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1"/>
                  Modify
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelReservation(reservation.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1"/>
                  Cancel
                </Button>
              </>
            )}
            {reservation.status === 'pending_payment' && (
              <Button size="sm">
                Complete Payment
              </Button>
            )}
            {reservation.status === 'completed' && (
              <Button variant="outline" size="sm">
                Leave Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold">My Reservations</h1>
              <p className="text-muted-foreground">
                Manage your bookings and reservations
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeReservations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-lg font-semibold mb-2">No active reservations</h3>
                  <p className="text-muted-foreground">
                    Your confirmed bookings will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {activeReservations.map(renderReservationCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid gap-6">
              {pastReservations.map(renderReservationCard)}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingReservations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-lg font-semibold mb-2">No pending reservations</h3>
                  <p className="text-muted-foreground">
                    Reservations requiring payment or confirmation will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {pendingReservations.map(renderReservationCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
