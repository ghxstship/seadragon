'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function GiftMembershipClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Gift a Membership</h1>
          <p className="text-lg text-neutral-600">Give the gift of extraordinary travel experiences</p>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">The Perfect Gift for Travelers</h2>
            <p className="text-xl mb-6">Share the joy of premium travel with someone special</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: '', title: 'Thoughtful', desc: 'Memorable experiences they will cherish' },
                { icon: '️', title: 'Adventurous', desc: 'Opens doors to new destinations' },
                { icon: '', title: 'Exclusive', desc: 'VIP access and premium benefits' },
              ].map((item) => (
                <div key={item.title} className="bg-background bg-opacity-20 rounded-lg p-4">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="font-semibold mt-2">{item.title}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Gift Options</h3>
            <div className="space-y-4">
              {[
                { title: 'Individual Membership Gift', price: '$199', color: 'border-neutral-200 hover:border-blue-300' },
                { title: 'Family Membership Gift', price: '$399', color: 'border-neutral-200 hover:border-green-300' },
                { title: 'VIP Membership Gift', price: '$399', color: 'border-neutral-200 hover:border-purple-300' },
              ].map((opt) => (
                <div key={opt.title} className={`border rounded-lg p-4 transition-colors ${opt.color}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-neutral-900">{opt.title}</h4>
                    <span className="text-lg font-bold text-accent-secondary">{opt.price}</span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">One year of premium travel benefits</p>
                  <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary text-sm">
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Gift Details</h3>
            <form className="space-y-4">
              <Input type="text" placeholder="Recipient's Name" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              <Input type="email" placeholder="Recipient's Email" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              <Input type="text" placeholder="Your Name" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              <Textarea rows={3} placeholder="Add a personal message..." className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              <Input type="date" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
            </form>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">How Gift Membership Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Purchase Gift', desc: 'Choose membership tier and provide recipient details' },
              { step: '2', title: 'Send Gift', desc: 'We email a beautiful gift certificate on your chosen date' },
              { step: '3', title: 'Activate Membership', desc: 'Recipient creates account and unlocks premium benefits' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-accent-secondary">{item.step}</span>
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">{item.title}</h4>
                <p className="text-sm text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Gift Membership Benefits</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">For the Recipient</h4>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li> Premium travel benefits for one year</li>
                <li> Exclusive access to member-only experiences</li>
                <li> Personalized concierge service</li>
                <li> Significant savings on bookings</li>
                <li> Priority customer support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">For You (The Giver)</h4>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li> Instant delivery or scheduled sending</li>
                <li> Beautiful digital gift certificate</li>
                <li> Personal message included</li>
                <li> Easy online purchase process</li>
                <li> Gift receipts for your records</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Give the Gift of Travel?</h2>
          <p className="text-neutral-600 mb-6">Create unforgettable memories with the perfect travel gift</p>
          <Button className="bg-pink-600 text-primary-foreground px-8 py-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 font-semibold text-lg">
            Purchase Gift Membership
          </Button>
        </div>
      </div>
    </div>
  )
}
