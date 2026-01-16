
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

export const metadata: Metadata = {
  title: 'Fitness Tracking | ATLVS + GVTEWAY',
  description: 'Track your fitness activities, workouts, and progress in the FAT Club.',
}

export default function HomeFitnessTrackingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Fitness Tracking</h1>
          <p className="text-neutral-600">Monitor your progress and stay motivated</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-secondary mb-1">24</div>
              <div className="text-sm text-neutral-600">Workouts This Month</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-success mb-1">156</div>
              <div className="text-sm text-neutral-600">Minutes This Week</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-primary mb-1">12.5</div>
              <div className="text-sm text-neutral-600">Miles This Week</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-warning mb-1">8</div>
              <div className="text-sm text-neutral-600">Streak (days)</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Today's Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Steps</span>
                <span className="text-sm font-medium">8,432 / 10,000</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-accent-secondary h-2 rounded-full w-[84%]"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Active Minutes</span>
                <span className="text-sm font-medium">45 / 60</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-semantic-success h-2 rounded-full w-[75%]"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Calories Burned</span>
                <span className="text-sm font-medium">320 / 400</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-semantic-warning h-2 rounded-full w-[80%]"></div>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full">
                Log Today's Activity
              </Button>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Log</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Activity Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Duration (min)
                  </label>
                  <Input
                    type="number"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Distance (miles)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="3.2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notes (Optional)
                </label>
                <Textarea
                  rows={2}
                  placeholder="How did it go?"/>
              </div>

              <Button className="w-full">
                Add Activity
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">‍️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Morning Run</h3>
                  <p className="text-sm text-neutral-600">5.2 miles • 45 minutes • 520 calories</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-neutral-500">Today</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">‍️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Yoga Session</h3>
                  <p className="text-sm text-neutral-600">60 minutes • 200 calories</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-neutral-500">Yesterday</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">‍️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Evening Walk</h3>
                  <p className="text-sm text-neutral-600">2.1 miles • 30 minutes • 180 calories</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-neutral-500">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Weekly Goals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-secondary mb-1">70,000</div>
              <div className="text-sm text-neutral-600 mb-2">Steps Goal</div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-accent-secondary h-2 rounded-full w-[85%]"></div>
              </div>
              <div className="text-xs text-neutral-500 mt-1">59,500 / 70,000</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-semantic-success mb-1">300</div>
              <div className="text-sm text-neutral-600 mb-2">Active Minutes</div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-semantic-success h-2 rounded-full w-[67%]"></div>
              </div>
              <div className="text-xs text-neutral-500 mt-1">200 / 300</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-accent-primary mb-1">5</div>
              <div className="text-sm text-neutral-600 mb-2">Workouts</div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-accent-primary h-2 rounded-full w-[80%]"></div>
              </div>
              <div className="text-xs text-neutral-500 mt-1">4 / 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
