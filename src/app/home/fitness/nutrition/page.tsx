
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Nutrition Tracking | ATLVS + GVTEWAY',
  description: 'Track your meals, nutrition goals, and dietary habits to fuel your adventures.',
}

export default function HomeFitnessNutritionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Nutrition Tracking</h1>
          <p className="text-neutral-600">Monitor your diet and fuel your travel adventures</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-secondary mb-1">2,150</div>
              <div className="text-sm text-neutral-600">Calories Today</div>
              <div className="text-xs text-neutral-500 mt-1">Goal: 2,200</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-success mb-1">185g</div>
              <div className="text-sm text-neutral-600">Protein</div>
              <div className="text-xs text-neutral-500 mt-1">Goal: 160g</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-warning mb-1">67g</div>
              <div className="text-sm text-neutral-600">Carbs</div>
              <div className="text-xs text-neutral-500 mt-1">Goal: 250g</div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-primary mb-1">78g</div>
              <div className="text-sm text-neutral-600">Fat</div>
              <div className="text-xs text-neutral-500 mt-1">Goal: 73g</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Today's Meals</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Breakfast</h3>
                  <span className="text-sm text-neutral-600">520 calories</span>
                </div>
                <div className="text-sm text-neutral-700">
                  <p>Oatmeal with berries and nuts</p>
                  <p className="text-xs text-neutral-500 mt-1">8:30 AM</p>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Lunch</h3>
                  <span className="text-sm text-neutral-600">680 calories</span>
                </div>
                <div className="text-sm text-neutral-700">
                  <p>Grilled chicken salad with quinoa</p>
                  <p className="text-xs text-neutral-500 mt-1">12:45 PM</p>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Snack</h3>
                  <span className="text-sm text-neutral-600">250 calories</span>
                </div>
                <div className="text-sm text-neutral-700">
                  <p>Greek yogurt with honey</p>
                  <p className="text-xs text-neutral-500 mt-1">3:15 PM</p>
                </div>
              </div>

              <div className="border border-dashed border-neutral-300 rounded-lg p-4">
                <div className="text-center">
                  <h3 className="font-medium text-neutral-900 mb-2">Dinner</h3>
                  <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                    Add Meal
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Add</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Search Foods
                </label>
                <Input
                  type="text"
                  placeholder="e.g., chicken breast, apple, rice"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="100"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Unit
                  </label>
                  <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="cup">cup</SelectItem>
                    <SelectItem value="tbsp">tbsp</SelectItem>
                    <SelectItem value="tsp">tsp</SelectItem>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Meal
                </label>
                <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </Select>
              </div>

              <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
                Add Food
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Nutrition Goals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Daily Targets</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Calories</span>
                  <span className="text-sm font-medium">2,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Protein</span>
                  <span className="text-sm font-medium">160g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Carbs</span>
                  <span className="text-sm font-medium">250g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Fat</span>
                  <span className="text-sm font-medium">73g</span>
                </div>
              </div>
              <Button className="mt-3 w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                Adjust Goals
              </Button>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Weekly Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Avg Daily Calories</span>
                  <span className="text-sm font-medium">2,180</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Protein Consistency</span>
                  <span className="text-sm font-medium text-semantic-success">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Meal Prep Days</span>
                  <span className="text-sm font-medium">5/7</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Travel Nutrition</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Local Foods Tried</span>
                  <span className="text-sm font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Allergies Managed</span>
                  <span className="text-sm font-medium text-semantic-success"></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Hydration Goal</span>
                  <span className="text-sm font-medium">8 glasses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Nutrition Tips for Travelers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Eating Local</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Research local dietary restrictions</li>
                <li>• Try street food safely</li>
                <li>• Find gluten-free options when needed</li>
                <li>• Balance adventure with nutrition</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Staying Healthy</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Pack protein bars for emergencies</li>
                <li>• Stay hydrated with electrolyte drinks</li>
                <li>• Adjust portions for activity level</li>
                <li>• Monitor caffeine and alcohol intake</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
