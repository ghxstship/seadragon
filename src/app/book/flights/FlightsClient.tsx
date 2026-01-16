'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FlightsClient() {
  const [passengers, setPassengers] = useState('1-adult')
  const [cabinClass, setCabinClass] = useState('economy')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Book Your Flight</h1>
          <p className="text-lg text-neutral-600">Find the best flight deals and book with confidence</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Flight Search</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">From</label>
              <Input type="text" placeholder="Departure city" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">To</label>
              <Input type="text" placeholder="Destination city" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Depart</label>
              <Input type="date" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Return</label>
              <Input type="date" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Passengers</label>
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-adult">1 Adult</SelectItem>
                  <SelectItem value="2-adults">2 Adults</SelectItem>
                  <SelectItem value="1-adult-1-child">1 Adult, 1 Child</SelectItem>
                  <SelectItem value="2-adults-2-children">2 Adults, 2 Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Class</label>
              <Select value={cabinClass} onValueChange={setCabinClass}>
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first-class">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Search Flights
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center">
              <Input type="checkbox" className="mr-2" />
              Flexible dates
            </label>
            <label className="flex items-center">
              <Input type="checkbox" className="mr-2" />
              Nearby airports
            </label>
            <label className="flex items-center">
              <Input type="checkbox" className="mr-2" />
              Include nearby destinations
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Popular Routes</h2>
            <div className="space-y-3">
              {[
                { route: 'New York → London', price: 'From $399 round-trip' },
                { route: 'Los Angeles → Tokyo', price: 'From $599 round-trip' },
                { route: 'Chicago → Paris', price: 'From $449 round-trip' },
                { route: 'Miami → Cancun', price: 'From $199 round-trip' },
              ].map((item) => (
                <div key={item.route} className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                  <div>
                    <span className="font-medium text-neutral-900">{item.route}</span>
                    <p className="text-sm text-neutral-600">{item.price}</p>
                  </div>
                  <span className="text-accent-secondary">→</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Flight Booking Tips</h2>
            <div className="space-y-4">
              {[
                { icon: '', title: 'Book in Advance', desc: 'Best deals found 2-3 months before travel' },
                { icon: '⏰', title: 'Midweek Flights', desc: 'Tuesday and Wednesday often have lower fares' },
                { icon: '', title: 'Price Alerts', desc: 'Set up fare alerts to track price changes' },
                { icon: '', title: 'Membership Perks', desc: 'Exclusive discounts for members' },
              ].map((tip) => (
                <div key={tip.title} className="flex items-start">
                  <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5">{tip.icon}</span>
                  <div>
                    <h3 className="font-medium text-neutral-900">{tip.title}</h3>
                    <p className="text-sm text-neutral-600">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Flight Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '️', title: 'Commercial Flights', bullets: ['Multiple airlines', 'Frequent flyer programs', 'In-flight amenities'] },
              { icon: '️', title: 'Private Charter', bullets: ['Flexible scheduling', 'Custom routes', 'Luxury service'] },
              { icon: '', title: 'Low-Cost Carriers', bullets: ['Lowest fares', 'Basic service', 'Additional fees apply'] },
            ].map((option) => (
              <div key={option.title} className="bg-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <h3 className="font-medium text-neutral-900">{option.title}</h3>
                </div>
                <ul className="text-sm text-neutral-600 space-y-1">
                  {option.bullets.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Booking Policies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Cancellation', items: ['Free cancellation up to 24 hours', 'Refund depends on airline policy', 'Change fees may apply', 'Contact us for assistance'] },
              { title: 'Baggage', items: ['Checked baggage fees vary', 'Carry-on included in most fares', 'Special items may have restrictions', 'Check airline policies'] },
              { title: 'Check-in', items: ['Online check-in 24 hours before', 'Airport counter check-in', 'Mobile check-in available', 'Arrive 2-3 hours early'] },
              { title: 'Travel Documents', items: ['Valid passport required', 'Visa requirements vary', 'Destination rules may apply', 'Check entry requirements'] },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-medium text-neutral-900 mb-3">{section.title}</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  {section.items.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Need Help Booking?</h2>
          <p className="text-blue-800 mb-4">
            Our flight experts are here to help you find the perfect flight and answer any questions.
          </p>
          <div className="flex gap-4">
            <a href="/contact/support" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Get Support
            </a>
            <a href="/travel/planning" className="bg-background text-accent-secondary border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Plan Full Trip
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
