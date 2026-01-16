
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Fitness Leaderboard | ATLVS + GVTEWAY',
  description: 'View your ranking and compete with other travelers in fitness challenges.',
}

export default function HomeFitnessLeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Fitness Leaderboard</h1>
          <p className="text-neutral-600">See how you rank against other travelers and stay motivated</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-accent-secondary mb-1">#23</div>
            <div className="text-sm text-neutral-600">Your Rank</div>
            <div className="text-xs text-neutral-500 mt-1">Top 15%</div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-semantic-success mb-1">1,247</div>
            <div className="text-sm text-neutral-600">Active Members</div>
            <div className="text-xs text-neutral-500 mt-1">This month</div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-accent-primary mb-1">85</div>
            <div className="text-sm text-neutral-600">Points This Week</div>
            <div className="text-xs text-neutral-500 mt-1">Keep it up!</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <Button className="text-accent-secondary font-medium">Overall Ranking</Button>
            <Button className="text-neutral-600 hover:text-neutral-900">This Month</Button>
            <Button className="text-neutral-600 hover:text-neutral-900">This Week</Button>
            <Button className="text-neutral-600 hover:text-neutral-900">Friends Only</Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Top Performers</h2>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 flex items-center bg-yellow-50">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-semantic-warning font-bold">1</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent-secondary font-semibold">AJ</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Alex Johnson</h3>
                    <p className="text-sm text-neutral-600">San Francisco, CA</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-neutral-900">2,847 pts</div>
                <div className="text-sm text-neutral-600">89 miles</div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center bg-gray-50">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-neutral-600 font-bold">2</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-success/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-semantic-success font-semibold">SC</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Sarah Chen</h3>
                    <p className="text-sm text-neutral-600">New York, NY</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-neutral-900">2,634 pts</div>
                <div className="text-sm text-neutral-600">87 miles</div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-semantic-warning font-bold">3</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent-primary font-semibold">MR</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Marcus Rodriguez</h3>
                    <p className="text-sm text-neutral-600">Los Angeles, CA</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-neutral-900">2,421 pts</div>
                <div className="text-sm text-neutral-600">85 miles</div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-neutral-600 font-bold">4</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-error/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-semantic-error font-semibold">ET</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Emma Thompson</h3>
                    <p className="text-sm text-neutral-600">London, UK</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-neutral-900">2,198 pts</div>
                <div className="text-sm text-neutral-600">82 miles</div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-neutral-600 font-bold">5</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold">DK</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">David Kim</h3>
                    <p className="text-sm text-neutral-600">Seoul, South Korea</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-neutral-900">2,056 pts</div>
                <div className="text-sm text-neutral-600">79 miles</div>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center bg-blue-50">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-accent-secondary font-bold">23</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent-secondary font-semibold">JD</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">John Doe</h3>
                    <p className="text-sm text-accent-tertiary">New York, NY</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-900">1,547 pts</div>
                <div className="text-sm text-accent-tertiary">67 miles</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total Points</span>
                <span className="text-sm font-medium">12,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Challenges Completed</span>
                <span className="text-sm font-medium">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Current Streak</span>
                <span className="text-sm font-medium">8 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Personal Best</span>
                <span className="text-sm font-medium">15 miles in a day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Friends Beaten</span>
                <span className="text-sm font-medium">3 this week</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Achievements</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-yellow-50 rounded">
                <div className="w-8 h-8 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-semantic-warning"></span>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-900">First Place Finisher</p>
                  <p className="text-xs text-semantic-warning">Won March Mile Challenge</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-blue-50 rounded">
                <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-accent-secondary"></span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Streak Master</p>
                  <p className="text-xs text-accent-tertiary">30-day workout streak</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-green-50 rounded">
                <div className="w-8 h-8 bg-semantic-success/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-semantic-success"></span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">Strength Champion</p>
                  <p className="text-xs text-semantic-success">Completed advanced program</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-purple-50 rounded">
                <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-accent-primary"></span>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Team Player</p>
                  <p className="text-xs text-purple-700">Helped 5 friends join challenges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">How Rankings Work</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Points System</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• 10 points per workout logged</li>
                <li>• 25 points per challenge joined</li>
                <li>• 50-200 points per challenge completed</li>
                <li>• Bonus points for streaks and consistency</li>
                <li>• Social points for encouraging others</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Ranking Benefits</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Exclusive badges and achievements</li>
                <li>• Priority access to new challenges</li>
                <li>• Featured in community highlights</li>
                <li>• Travel rewards and discounts</li>
                <li>• Recognition in leaderboards</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 mb-4">
              Rankings reset monthly. Keep active to maintain and improve your position!
            </p>
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              View Full Rankings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
