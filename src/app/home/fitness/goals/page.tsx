
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Fitness Goals | ATLVS + GVTEWAY',
  description: 'Set and track your fitness goals to stay motivated and achieve your travel-ready physique.',
}

export default function HomeFitnessGoalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Fitness Goals</h1>
          <p className="text-neutral-600">Set targets and track progress toward your fitness objectives</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Goals</h2>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Run 100 Miles This Month</h3>
                  <span className="text-sm text-accent-secondary bg-accent-primary/10 px-2 py-1 rounded">67% Complete</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                  <div className="bg-accent-secondary h-2 rounded-full w-[67%]"></div>
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-600">
                  <span>67 / 100 miles</span>
                  <span>8 days left</span>
                </div>
              </div>

              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Complete 5 Challenges</h3>
                  <span className="text-sm text-semantic-success bg-semantic-success/10 px-2 py-1 rounded">Completed</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                  <div className="bg-semantic-success h-2 rounded-full w-full"></div>
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-600">
                  <span>5 / 5 challenges</span>
                  <span>Achieved!</span>
                </div>
              </div>

              <div className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Maintain Daily Streak</h3>
                  <span className="text-sm text-accent-primary bg-accent-primary/10 px-2 py-1 rounded">8 days</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                  <div className="bg-accent-primary h-2 rounded-full w-[40%]"></div>
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-600">
                  <span>8 / 20 days</span>
                  <span>12 days left</span>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4 bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Set New Goal
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Goal Categories</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button className="p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <div className="text-lg mb-2">‍️</div>
                <h3 className="font-medium text-neutral-900 mb-1">Cardio</h3>
                <p className="text-sm text-neutral-600">Running, cycling, swimming</p>
              </Button>

              <Button className="p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors text-left">
                <div className="text-lg mb-2"></div>
                <h3 className="font-medium text-neutral-900 mb-1">Strength</h3>
                <p className="text-sm text-neutral-600">Weight training, bodyweight</p>
              </Button>

              <Button className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors text-left">
                <div className="text-lg mb-2">‍️</div>
                <h3 className="font-medium text-neutral-900 mb-1">Flexibility</h3>
                <p className="text-sm text-neutral-600">Yoga, stretching, mobility</p>
              </Button>

              <Button className="p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors text-left">
                <div className="text-lg mb-2">️</div>
                <h3 className="font-medium text-neutral-900 mb-1">Adventure</h3>
                <p className="text-sm text-neutral-600">Hiking, climbing, sports</p>
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-neutral-900 mb-3">Quick Goal Templates</h3>
              <div className="space-y-2">
                <Button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                  Lose 5 pounds in 2 months
                </Button>
                <Button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                  Run a half marathon
                </Button>
                <Button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                  30-day yoga challenge
                </Button>
                <Button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                  Build hiking endurance
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Goal Progress History</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Lost 10 pounds</h3>
                  <p className="text-sm text-neutral-600">Goal achieved in 3 months</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-neutral-500">Dec 2023</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">‍️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Run 50 miles in a month</h3>
                  <p className="text-sm text-neutral-600">Goal achieved in 2 months</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-neutral-500">Nov 2023</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">‍️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">30-day meditation streak</h3>
                  <p className="text-sm text-neutral-600">Goal achieved in 1 month</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-neutral-500">Oct 2023</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-warning/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">‍️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Swim 100 laps</h3>
                  <p className="text-sm text-neutral-600">Goal achieved in 6 weeks</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-neutral-500">Sep 2023</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Motivation & Reminders</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Input type="checkbox" id="daily-reminders" className="mr-3" defaultChecked />
                <label htmlFor="daily-reminders" className="text-sm">
                  Daily progress reminders
                </label>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="weekly-summary" className="mr-3" defaultChecked />
                <label htmlFor="weekly-summary" className="text-sm">
                  Weekly progress summaries
                </label>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="goal-celebration" className="mr-3" defaultChecked />
                <label htmlFor="goal-celebration" className="text-sm">
                  Goal achievement celebrations
                </label>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="motivational-quotes" className="mr-3" />
                <label htmlFor="motivational-quotes" className="text-sm">
                  Daily motivational quotes
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Reminder Time
                </label>
                <Input
                  type="time"
                  defaultValue="08:00"
                  className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Goal Sharing</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Input type="checkbox" id="share-progress" className="mr-3" defaultChecked />
                <label htmlFor="share-progress" className="text-sm">
                  Share progress with connections
                </label>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="public-goals" className="mr-3" />
                <label htmlFor="public-goals" className="text-sm">
                  Make goals visible to community
                </label>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="achievement-badges" className="mr-3" defaultChecked />
                <label htmlFor="achievement-badges" className="text-sm">
                  Display achievement badges
                </label>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="leaderboard-opt-in" className="mr-3" />
                <label htmlFor="leaderboard-opt-in" className="text-sm">
                  Participate in community leaderboards
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Privacy Level
                </label>
                <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectItem value="friends-only">Friends only</SelectItem>
                  <SelectItem value="connections-only">Connections only</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
