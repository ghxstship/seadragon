
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Membership FAQ | ATLVS + GVTEWAY',
  description: 'Frequently asked questions about our membership program and benefits.',
}

export default function MembershipFAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Membership FAQ</h1>
          <p className="text-lg text-neutral-600">Everything you need to know about our membership program</p>
        </div>

        <div className="space-y-6">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">What is the ATLVS + GVTEWAY Membership?</h3>
            <p className="text-neutral-700">
              Our membership program provides exclusive access to premium travel experiences, significant savings on bookings,
              priority service, and a range of travel benefits designed to enhance your journey. Members enjoy personalized
              concierge support, travel credits, and access to exclusive events and experiences.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">What are the different membership tiers?</h3>
            <p className="text-neutral-700 mb-4">
              We offer four membership tiers to suit different travel needs:
            </p>
            <ul className="space-y-2 text-neutral-700">
              <li><strong>Explorer ($99/year):</strong> Perfect for occasional travelers with basic benefits and 5% booking discounts.</li>
              <li><strong>Adventurer ($199/year):</strong> Great for regular travelers with 10% discounts, priority booking, and 24/7 support.</li>
              <li><strong>VIP ($399/year):</strong> Luxury tier with 15% discounts, personal concierge, and airport lounge access.</li>
              <li><strong>Legend ($799/year):</strong> Ultimate tier with 20% discounts, dedicated concierge, and private jet credits.</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">How do I join the membership program?</h3>
            <p className="text-neutral-700">
              Joining is simple! Visit our membership page, select your preferred tier, and complete the online registration.
              You'll need to provide basic personal information and payment details. Membership benefits are activated
              immediately upon successful payment, and you'll receive a welcome email with your member credentials.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Can I upgrade or downgrade my membership?</h3>
            <p className="text-neutral-700">
              Yes! You can upgrade your membership at any time, and the change will be effective immediately with prorated
              billing. Downgrades take effect at the next billing cycle. Contact our membership support team or manage
              your subscription through your member dashboard to make changes.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">What happens to my travel credits?</h3>
            <p className="text-neutral-700">
              Travel credits are awarded annually based on your membership tier. They don't expire during your membership
              year but are forfeited if you cancel. Credits can be used toward any booking and are applied automatically
              at checkout. Unused credits roll over to the next year for active members.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Is there a family membership option?</h3>
            <p className="text-neutral-700">
              Yes! Our Family Membership ($399/year) covers up to 6 family members and includes all the benefits of our
              individual tiers plus family-specific perks like kids' adventure discounts and family travel planning support.
              Additional family members can be added for a small monthly fee.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">What is included in concierge service?</h3>
            <p className="text-neutral-700">
              Our concierge service provides personalized travel planning assistance. VIP and Legend members receive
              dedicated concierge support, while Adventurer members have access to our 24/7 concierge hotline.
              Services include itinerary planning, restaurant reservations, activity bookings, and emergency assistance.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Can I cancel my membership anytime?</h3>
            <p className="text-neutral-700">
              Absolutely! You can cancel your membership at any time with no cancellation fees. If you cancel mid-year,
              you'll retain access to member benefits until the end of your billing period. Refunds are processed on a
              prorated basis for the unused portion of your membership.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Do membership benefits apply worldwide?</h3>
            <p className="text-neutral-700">
              Yes! Our membership benefits are valid worldwide for all our partnered destinations and services.
              Some regional benefits (like airport lounges) may vary by location, but core benefits like booking
              discounts and concierge support are available globally.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Can I gift a membership?</h3>
            <p className="text-neutral-700">
              Definitely! Our gift membership program allows you to purchase membership as a gift for friends or family.
              You can choose the membership tier, add a personal message, and schedule delivery. The recipient will
              receive a beautiful digital gift certificate and can activate their membership immediately.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Are there corporate membership options?</h3>
            <p className="text-neutral-700">
              Yes, we offer comprehensive corporate membership solutions for businesses. Our corporate plans include
              volume discounts, advanced reporting, API access, and dedicated account management. Contact our sales
              team for a custom quote based on your company's travel needs.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">How do I access member-only experiences?</h3>
            <p className="text-neutral-700">
              Member-exclusive experiences are available through your member dashboard. You'll receive notifications
              about new opportunities, and priority booking windows ensure members get first access. Some experiences
              require advance registration, so check your dashboard regularly for updates.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">What if I need to change my personal information?</h3>
            <p className="text-neutral-700">
              You can update your personal information anytime through your member dashboard under Account Settings.
              Changes to your name, email, or contact information can be made instantly. For security-related changes
              like passwords, follow the secure update process in your account settings.
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">How does the referral program work?</h3>
            <p className="text-neutral-700">
              Our referral program rewards you with travel credits when friends join using your referral link.
              You'll earn $50 in travel credits for each successful referral, and your referred friend gets a
              special welcome bonus. Track your referrals and earnings in your member dashboard.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Still have questions?</h3>
          <p className="text-blue-800 mb-4">
            Can't find the answer you're looking for? Our membership support team is here to help!
          </p>
          <div className="flex gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Support
            </Button>
            <Button className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
