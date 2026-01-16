
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Travel Credits | ATLVS + GVTEWAY',
  description: 'Manage your travel credits, view earning history, and redeem for rewards.',
}

export default function HomeWalletCreditsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Travel Credits</h1>
          <p className="text-neutral-600">Earn credits through travel and redeem them for rewards</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2"></div>
            <div className="text-2xl font-bold text-accent-secondary mb-1">1,250</div>
            <div className="text-sm text-neutral-600">Available Credits</div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2"></div>
            <div className="text-2xl font-bold text-semantic-success mb-1">450</div>
            <div className="text-sm text-neutral-600">Earned This Month</div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">⏰</div>
            <div className="text-2xl font-bold text-semantic-warning mb-1">150</div>
            <div className="text-sm text-neutral-600">Expiring Soon</div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">How to Earn Credits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Travel Activities</h3>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent-primary rounded-full mr-3"></span>
                  Book experiences: 50 credits per booking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent-primary rounded-full mr-3"></span>
                  Write reviews: 25-100 credits based on quality
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent-primary rounded-full mr-3"></span>
                  Complete trips: 75 credits per completed itinerary
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-accent-primary rounded-full mr-3"></span>
                  Refer friends: 200 credits per successful referral
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Community Engagement</h3>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mr-3"></span>
                  Post in community: 10 credits per post
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mr-3"></span>
                  Helpful responses: 5 credits per upvote
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mr-3"></span>
                  Join challenges: 25 credits for participation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-semantic-success rounded-full mr-3"></span>
                  Complete challenges: 50-200 credits for finishing
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Credit Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">⭐</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Review Bonus</h3>
                  <p className="text-sm text-neutral-600">Tokyo Tea Ceremony experience</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-success font-medium">+50 credits</span>
                <p className="text-xs text-neutral-500">March 8, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Experience Booking</h3>
                  <p className="text-sm text-neutral-600">Broadway Musical: Hamilton</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-success font-medium">+50 credits</span>
                <p className="text-xs text-neutral-500">March 6, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Challenge Completion</h3>
                  <p className="text-sm text-neutral-600">March Mile Challenge</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-success font-medium">+100 credits</span>
                <p className="text-xs text-neutral-500">March 1, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-error/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Referral Bonus</h3>
                  <p className="text-sm text-neutral-600">Friend joined via your link</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-success font-medium">+200 credits</span>
                <p className="text-xs text-neutral-500">February 28, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-warning/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Credit Redemption</h3>
                  <p className="text-sm text-neutral-600">Hotel booking discount</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-error font-medium">-150 credits</span>
                <p className="text-xs text-neutral-500">February 25, 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Redeem Credits</h2>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Booking Discount</h3>
                  <span className="text-sm text-neutral-600">150 credits</span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">$15 off any experience booking</p>
                <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  Redeem
                </Button>
              </div>

              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Premium Upgrade</h3>
                  <span className="text-sm text-neutral-600">500 credits</span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">Upgrade to premium seating</p>
                <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded text-sm hover:bg-green-700">
                  Redeem
                </Button>
              </div>

              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Travel Gift Card</h3>
                  <span className="text-sm text-neutral-600">1,000 credits</span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">$100 travel gift card</p>
                <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-purple-700">
                  Redeem
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Credit Expirations</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-yellow-900">Expiring Soon</h3>
                  <span className="text-sm text-semantic-warning">150 credits</span>
                </div>
                <p className="text-sm text-yellow-800">Expires March 31, 2024</p>
                <div className="mt-2 bg-yellow-200 rounded-full h-2">
                  <div className="bg-semantic-warning h-2 rounded-full w-[80%]"></div>
                </div>
                <p className="text-xs text-semantic-warning mt-1">12 days left</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-green-900">Fresh Credits</h3>
                  <span className="text-sm text-semantic-success">450 credits</span>
                </div>
                <p className="text-sm text-green-800">Earned this month</p>
                <div className="mt-2 bg-green-200 rounded-full h-2">
                  <div className="bg-semantic-success h-2 rounded-full w-full"></div>
                </div>
                <p className="text-xs text-semantic-success mt-1">Expires February 2025</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-blue-900">Long-term Credits</h3>
                  <span className="text-sm text-accent-tertiary">650 credits</span>
                </div>
                <p className="text-sm text-blue-800">From completed challenges</p>
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div className="bg-accent-secondary h-2 rounded-full w-full"></div>
                </div>
                <p className="text-xs text-accent-tertiary mt-1">Expires December 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Credit Program Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Save Money</h3>
              <p className="text-sm text-neutral-600">Discounts on bookings and upgrades</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Exclusive Rewards</h3>
              <p className="text-sm text-neutral-600">Gift cards and premium perks</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Gamification</h3>
              <p className="text-sm text-neutral-600">Earn credits through travel activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
