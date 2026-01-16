
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Fitness Statistics | ATLVS + GVTEWAY',
  description: 'View detailed statistics and analytics for your fitness journey and progress tracking.',
}

export default function HomeFitnessStatsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Fitness Statistics</h1>
          <p className="text-neutral-600">Detailed analytics and insights into your fitness journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-secondary mb-1">156</div>
              <div className="text-sm text-neutral-600">Total Workouts</div>
              <div className="text-xs text-neutral-500 mt-1">Since joining</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-success mb-1">487</div>
              <div className="text-sm text-neutral-600">Active Minutes</div>
              <div className="text-xs text-neutral-500 mt-1">This month</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-primary mb-1">23</div>
              <div className="text-sm text-neutral-600">Miles Run</div>
              <div className="text-xs text-neutral-500 mt-1">This week</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-warning mb-1">8</div>
              <div className="text-sm text-neutral-600">Current Streak</div>
              <div className="text-xs text-neutral-500 mt-1">Consecutive days</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Monthly Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Workouts Completed</span>
                  <span className="text-sm font-medium">24 / 30 goal</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-accent-secondary h-2 rounded-full w-[80%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Active Minutes</span>
                  <span className="text-sm font-medium">487 / 600 goal</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-semantic-success h-2 rounded-full w-[81%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Miles Run</span>
                  <span className="text-sm font-medium">23 / 25 goal</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-accent-primary h-2 rounded-full w-[92%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Challenge Participation</span>
                  <span className="text-sm font-medium">3 / 4 goal</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-semantic-warning h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Activity Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-accent-primary rounded mr-3"></div>
                  <span className="text-sm">Running</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-semantic-success rounded mr-3"></div>
                  <span className="text-sm">Yoga</span>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-accent-primary rounded mr-3"></div>
                  <span className="text-sm">Strength Training</span>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-semantic-warning rounded mr-3"></div>
                  <span className="text-sm">Swimming</span>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Most Active Day</h3>
              <p className="text-sm text-neutral-600">Tuesday (avg 67 min)</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Performance Trends</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Weekly Averages</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Workouts</span>
                  <span className="text-sm font-medium">3.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Minutes</span>
                  <span className="text-sm font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Miles</span>
                  <span className="text-sm font-medium">5.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Calories</span>
                  <span className="text-sm font-medium">1,240</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Monthly Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">vs Last Month</span>
                  <span className="text-sm font-medium text-semantic-success">+12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Workouts</span>
                  <span className="text-sm font-medium">+3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Minutes</span>
                  <span className="text-sm font-medium text-semantic-success">+45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Consistency</span>
                  <span className="text-sm font-medium text-semantic-success">+8%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Personal Records</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Longest Run</span>
                  <span className="text-sm font-medium">12.5 miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Most Minutes</span>
                  <span className="text-sm font-medium">180 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Best Week</span>
                  <span className="text-sm font-medium">28 miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Current Streak</span>
                  <span className="text-sm font-medium">8 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Health Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Recovery & Rest</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Rest Days</span>
                  <span className="text-sm font-medium">4 this month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Sleep Quality</span>
                  <span className="text-sm font-medium text-semantic-success">Good</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Injury Risk</span>
                  <span className="text-sm font-medium text-semantic-success">Low</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Recommendations</h3>
              <div className="space-y-2">
                <p className="text-sm text-neutral-600">• Consider adding more strength training</p>
                <p className="text-sm text-neutral-600">• Your running pace has improved by 15%</p>
                <p className="text-sm text-neutral-600">• Try incorporating HIIT workouts</p>
                <p className="text-sm text-neutral-600">• Schedule a rest day this weekend</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Export Fitness Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
