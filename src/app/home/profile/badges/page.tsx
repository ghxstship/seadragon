
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Badges | ATLVS + GVTEWAY',
  description: 'View your achievements, badges, and milestones earned through your travel experiences.',
}

export default function HomeProfileBadgesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">My Badges & Achievements</h1>
          <p className="text-neutral-600">Celebrate your travel milestones and accomplishments</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Badge Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-900">First Adventure</span>
                  <span className="text-sm text-neutral-600">3/5 experiences</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-accent-secondary h-2 rounded-full w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-900">Globe Trotter</span>
                  <span className="text-sm text-neutral-600">7/10 countries</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-semantic-success h-2 rounded-full w-[70%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-900">Review Master</span>
                  <span className="text-sm text-neutral-600">12/15 reviews</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-accent-primary h-2 rounded-full w-[80%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Achievements</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-semantic-warning/10 rounded-full flex items-center justify-center">
                  <span className="text-lg"></span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Early Bird</p>
                  <p className="text-xs text-neutral-600">Booked before 8 AM - 2 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">️</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Jet Setter</p>
                  <p className="text-xs text-neutral-600">5th flight booked - 1 week ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-full flex items-center justify-center">
                  <span className="text-lg"></span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Super Reviewer</p>
                  <p className="text-xs text-neutral-600">10th review posted - 2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Earned Badges</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: 'First Steps', icon: '', description: 'Completed your first booking', earned: true },
              { name: 'Explorer', icon: '️', description: 'Visited 3 different destinations', earned: true },
              { name: 'Reviewer', icon: '⭐', description: 'Left your first review', earned: true },
              { name: 'Early Bird', icon: '', description: 'Booked before 8 AM', earned: true },
              { name: 'Jet Setter', icon: '️', description: 'Booked 5 flights', earned: true },
              { name: 'Foodie', icon: '️', description: 'Attended a cooking class', earned: true },
              { name: 'Adventurer', icon: '️', description: 'Completed an outdoor activity', earned: true },
              { name: 'Culture Vulture', icon: '️', description: 'Visited a historical site', earned: true },
              { name: 'Wellness Warrior', icon: '', description: 'Tried a wellness experience', earned: false },
              { name: 'Night Owl', icon: '', description: 'Booked a late-night activity', earned: false },
              { name: 'Group Leader', icon: '', description: 'Organized a group booking', earned: false },
              { name: 'Loyal Member', icon: '', description: 'Member for 1 year', earned: false }
            ].map((badge, index) => (
              <div key={index} className={`text-center p-4 rounded-lg border-2 ${badge.earned ? 'border-yellow-300 bg-yellow-50' : 'border-neutral-200 bg-gray-50'}`}>
                <div className={`text-3xl mb-2 ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                  {badge.icon}
                </div>
                <h3 className={`font-medium mb-1 ${badge.earned ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  {badge.name}
                </h3>
                <p className={`text-xs ${badge.earned ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  {badge.description}
                </p>
                {badge.earned && (
                  <div className="mt-2">
                    <span className="inline-block w-2 h-2 bg-semantic-warning rounded-full"></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">How Badges Work</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Earning Badges</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Complete specific actions and activities</li>
                <li>• Reach milestones in your travel journey</li>
                <li>• Participate in community events</li>
                <li>• Share your experiences and reviews</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Badge Benefits</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Showcase achievements on your profile</li>
                <li>• Unlock exclusive experiences and deals</li>
                <li>• Gain recognition in the community</li>
                <li>• Track your travel progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
