
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

interface ReservationPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ReservationPageProps): Promise<Metadata> {
  return {
    title: `Reservation Details | ATLVS + GVTEWAY`,
    description: 'View and manage your reservation details and booking information.',
  }
}

export default async function HomeReservationsIdPage({ params }: ReservationPageProps) {
  const { id } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button className="text-accent-secondary hover:text-blue-800 mb-4">
            ← Back to Reservations
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Reservation Details</h1>
          <p className="text-neutral-600">Traditional Tea Ceremony • Kyoto, Japan</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl"></span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Traditional Tea Ceremony</h3>
                <p className="text-neutral-600 mb-2">En Tea House • Kyoto, Japan</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-semantic-success/10 text-green-800 px-2 py-1 rounded">Confirmed</span>
                  <span className="text-neutral-500">March 18, 2024 • 10:00 AM</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                Modify
              </Button>
              <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded text-sm hover:bg-red-700">
                Cancel
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Booking Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Booking Reference</span>
                  <span className="font-medium">EXP-2024-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Booking Date</span>
                  <span className="font-medium">March 10, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Paid</span>
                  <span className="font-medium">$89.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Payment Method</span>
                  <span className="font-medium">•••• 4567</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Experience Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Duration</span>
                  <span className="font-medium">2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Participants</span>
                  <span className="font-medium">2 people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Language</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Difficulty</span>
                  <span className="font-medium">Beginner</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">What's Included</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-semantic-success mr-3"></span>
                <span className="text-neutral-700">Traditional tea ceremony experience</span>
              </div>
              <div className="flex items-center">
                <span className="text-semantic-success mr-3"></span>
                <span className="text-neutral-700">Matcha tea and traditional sweets</span>
              </div>
              <div className="flex items-center">
                <span className="text-semantic-success mr-3"></span>
                <span className="text-neutral-700">English-speaking guide</span>
              </div>
              <div className="flex items-center">
                <span className="text-semantic-success mr-3"></span>
                <span className="text-neutral-700">Photo opportunities</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Location & Meeting Point</h2>
          <div className="bg-neutral-100 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="w-5 h-5 bg-accent-secondary rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-primary-foreground text-xs"></span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900">En Tea House</h3>
                <p className="text-neutral-600">349 Masuyacho, Higashiyama Ward, Kyoto, 605-0826, Japan</p>
                <p className="text-sm text-neutral-500 mt-1">Located in the Gion district, near Yasaka Shrine</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">How to Get There</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Subway: Higashiyama Station (5 min walk)</li>
                <li>• Bus: Kyoto Station to Gion (15 min)</li>
                <li>• Taxi: Available from major hotels</li>
                <li>• Walking: From downtown Kyoto (20 min)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Meeting Instructions</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Arrive 10 minutes early</li>
                <li>• Look for the red lantern entrance</li>
                <li>• Bring comfortable clothing</li>
                <li>• Remove shoes before entering</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Important Information</h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Cancellation Policy</h3>
              <p className="text-sm text-yellow-800">
                Free cancellation up to 24 hours before the experience. Cancellations within 24 hours are non-refundable.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What to Bring</h3>
              <p className="text-sm text-blue-800">
                Comfortable clothing, camera (optional), arrive with clean hands. Traditional dress available on request.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Health & Safety</h3>
              <p className="text-sm text-green-800">
                COVID-19 safety measures in place. Temperature checks and sanitization stations available.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Experience Provider</h3>
              <div className="space-y-2">
                <p className="text-neutral-600">En Tea House</p>
                <p className="text-neutral-600"> +81 75-525-2780</p>
                <p className="text-neutral-600">️ info@enteahouse.jp</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-2">ATLVS + GVTEWAY Support</h3>
              <div className="space-y-2">
                <p className="text-neutral-600">24/7 Customer Support</p>
                <p className="text-neutral-600"> 1-800-ATLVS</p>
                <p className="text-neutral-600">️ support@atlvs.com</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary">
              Download Voucher
            </Button>
            <Button className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
              Share Reservation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
