
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Fitness Challenges | ATLVS + GVTEWAY',
  description: 'Join fitness challenges and compete with fellow travelers in the FAT Club.',
}

export default function HomeFitnessChallengesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Fitness Challenges</h1>
          <p className="text-neutral-600">Join challenges, earn rewards, and stay motivated</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-4xl">‍️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Active
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                1,247 joined
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">March Mile Challenge</h3>
              <p className="text-neutral-600 text-sm mb-3">Run or walk 100 miles in March. Track your progress daily!</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Ends March 31</span>
                <span className="text-accent-secondary font-medium">Join Challenge</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-4xl">‍️</span>
              </div>
              <div className="absolute top-2 left-2 bg-accent-secondary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Starting Soon
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                892 joined
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Mindful Minutes</h3>
              <p className="text-neutral-600 text-sm mb-3">30 days of meditation and mindfulness practice</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Starts April 1</span>
                <span className="text-accent-secondary font-medium">Pre-register</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-4xl"></span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Completed
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                2,134 completed
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Strength & Travel</h3>
              <p className="text-neutral-600 text-sm mb-3">Build strength with hotel room workouts</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Ended Feb 28</span>
                <span className="text-accent-secondary font-medium">View Results</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-4xl">‍️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Active
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                756 joined
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Water Warrior</h3>
              <p className="text-neutral-600 text-sm mb-3">Swim, surf, or paddle for 50 sessions</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Ends May 15</span>
                <span className="text-accent-secondary font-medium">Join Challenge</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-4xl">‍️</span>
              </div>
              <div className="absolute top-2 left-2 bg-accent-secondary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Starting Soon
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                1,023 joined
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Global Steps Challenge</h3>
              <p className="text-neutral-600 text-sm mb-3">Walk 10,000 steps daily for 30 days</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Starts April 15</span>
                <span className="text-accent-secondary font-medium">Pre-register</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
                <span className="text-4xl">️</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Active
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                634 joined
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Adventure Athlete</h3>
              <p className="text-neutral-600 text-sm mb-3">Complete 5 outdoor activities this month</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Ends March 31</span>
                <span className="text-accent-secondary font-medium">Join Challenge</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Your Active Challenges</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">March Mile Challenge</h3>
                <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Day 15/31</span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-neutral-600">Progress</span>
                  <span className="text-sm font-medium">67 miles / 100 miles</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-accent-secondary h-2 rounded-full w-[67%]"></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Rank: #23 of 1,247</span>
                <Button className="text-accent-secondary hover:text-blue-800">Update Progress</Button>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-neutral-900">Water Warrior Challenge</h3>
                <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Week 3/8</span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-neutral-600">Sessions</span>
                  <span className="text-sm font-medium">18 / 50 sessions</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-semantic-success h-2 rounded-full w-[36%]"></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Rank: #45 of 756</span>
                <Button className="text-accent-secondary hover:text-blue-800">Log Session</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Challenge Leaderboard</h2>
          <div className="bg-background rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-neutral-200">
              <h3 className="font-medium text-neutral-900">March Mile Challenge - Top Performers</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-semantic-warning/10 rounded-full flex items-center justify-center text-semantic-warning font-bold text-sm mr-3">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Alex Johnson</p>
                    <p className="text-sm text-neutral-600">89 miles completed</p>
                  </div>
                </div>
                <span className="text-semantic-warning font-medium"></span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 font-bold text-sm mr-3">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Sarah Chen</p>
                    <p className="text-sm text-neutral-600">87 miles completed</p>
                  </div>
                </div>
                <span className="text-neutral-600 font-medium"></span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-semantic-warning/10 rounded-full flex items-center justify-center text-semantic-warning font-bold text-sm mr-3">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">Marcus Rodriguez</p>
                    <p className="text-sm text-neutral-600">85 miles completed</p>
                  </div>
                </div>
                <span className="text-semantic-warning font-medium"></span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between bg-blue-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-secondary font-bold text-sm mr-3">
                    23
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">You</p>
                    <p className="text-sm text-neutral-600">67 miles completed</p>
                  </div>
                </div>
                <span className="text-accent-secondary font-medium">Keep going!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
