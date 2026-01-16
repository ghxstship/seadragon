
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Travel Rewards | ATLVS + GVTEWAY',
  description: 'Redeem your travel rewards, track points, and unlock exclusive benefits.',
}

export default function HomeWalletRewardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Travel Rewards</h1>
          <p className="text-neutral-600">Earn points through travel and redeem them for exclusive benefits</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Points</h2>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-accent-primary mb-2">8,750</div>
              <div className="text-sm text-neutral-600">Available Points</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Earned this month</span>
                <span className="text-sm font-medium text-semantic-success">+2,340</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Redeemed this month</span>
                <span className="text-sm font-medium text-semantic-error">-890</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium text-neutral-900">Lifetime earned</span>
                <span className="text-sm font-medium">12,450</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Reward Tiers</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-neutral-400 rounded-full mr-2"></div>
                  <span className="text-sm">Bronze (0-4,999)</span>
                </div>
                <span className="text-xs text-neutral-500">Earned</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-semantic-warning rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Gold (5,000-9,999)</span>
                </div>
                <span className="text-xs text-accent-primary">Current</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-neutral-300 rounded-full mr-2"></div>
                  <span className="text-sm">Platinum (10,000+)</span>
                </div>
                <span className="text-xs text-neutral-500">1,250 to go</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-semantic-warning h-2 rounded-full" style={{ width: '87.5%' }}></div>
              </div>
              <p className="text-xs text-neutral-600 mt-1">8,750 / 10,000 points to Platinum</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Points per dollar</span>
                <span className="text-sm font-medium">2.5x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Avg monthly earning</span>
                <span className="text-sm font-medium">2,180 pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Best earning month</span>
                <span className="text-sm font-medium">March 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Points expire</span>
                <span className="text-sm font-medium">Dec 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Available Rewards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">Free Night Stay</h3>
                <span className="text-sm text-neutral-600">2,500 pts</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">One free night at participating hotels worldwide</p>
              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                Redeem
              </Button>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">Flight Upgrade</h3>
                <span className="text-sm text-neutral-600">3,750 pts</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">Upgrade to premium economy on eligible flights</p>
              <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded text-sm hover:bg-green-700">
                Redeem
              </Button>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">$50 Travel Credit</h3>
                <span className="text-sm text-neutral-600">1,250 pts</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">Credit toward any booking on our platform</p>
              <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-purple-700">
                Redeem
              </Button>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">VIP Experience</h3>
                <span className="text-sm text-neutral-600">5,000 pts</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">Exclusive access to VIP events and experiences</p>
              <Button className="w-full bg-semantic-warning text-primary-foreground py-2 px-4 rounded text-sm hover:bg-orange-700">
                Redeem
              </Button>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4 hover:border-red-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">Priority Support</h3>
                <span className="text-sm text-neutral-600">750 pts</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">24/7 priority customer support for 3 months</p>
              <Button className="w-full bg-semantic-error text-primary-foreground py-2 px-4 rounded text-sm hover:bg-red-700">
                Redeem
              </Button>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">Lounge Access</h3>
                <span className="text-sm text-neutral-600">1,500 pts</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">Airport lounge access for one use</p>
              <Button className="w-full bg-indigo-600 text-primary-foreground py-2 px-4 rounded text-sm hover:bg-indigo-700">
                Redeem
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">⭐</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Review Bonus</h3>
                  <p className="text-sm text-neutral-600">Tokyo restaurant review</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-success font-medium">+75 points</span>
                <p className="text-xs text-neutral-500">March 10, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Experience Booking</h3>
                  <p className="text-sm text-neutral-600">Tea ceremony in Kyoto</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-success font-medium">+100 points</span>
                <p className="text-xs text-neutral-500">March 8, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Reward Redeemed</h3>
                  <p className="text-sm text-neutral-600">$50 travel credit</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-error font-medium">-1,250 points</span>
                <p className="text-xs text-neutral-500">March 5, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-warning/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Challenge Completion</h3>
                  <p className="text-sm text-neutral-600">March fitness challenge</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-semantic-success font-medium">+250 points</span>
                <p className="text-xs text-neutral-500">March 1, 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">How to Earn More Points</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Travel Activities</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Book experiences: 50-100 points per booking</li>
                <li>• Write reviews: 25-100 points based on quality</li>
                <li>• Complete trips: 75 points per finished itinerary</li>
                <li>• Share photos: 10 points per shared travel photo</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Community Engagement</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Join groups: 25 points for joining travel groups</li>
                <li>• Post in community: 10 points per community post</li>
                <li>• Help others: 5 points per helpful response</li>
                <li>• Refer friends: 200 points per successful referral</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
