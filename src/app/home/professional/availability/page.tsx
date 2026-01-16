
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Availability Calendar | ATLVS + GVTEWAY',
  description: 'Manage your professional availability and schedule to coordinate with client bookings.',
}

export default function HomeProfessionalAvailabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Availability Calendar</h1>
          <p className="text-neutral-600">Set your schedule and manage bookings</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">March 2024</h2>
                <div className="flex space-x-2">
                  <Button className="p-1 hover:bg-neutral-100 rounded">
                    <span className="text-neutral-600">‹</span>
                  </Button>
                  <Button className="p-1 hover:bg-neutral-100 rounded">
                    <span className="text-neutral-600">›</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-neutral-700">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 3; // Start from March 1
                  const isCurrentMonth = day >= 1 && day <= 31;
                  const isToday = day === 15;
                  const isBooked = [5, 12, 18, 25].includes(day);
                  const isAvailable = [3, 4, 6, 7, 10, 11, 13, 14, 17, 19, 20, 21, 24, 26, 27, 28, 31].includes(day);

                  return (
                    <div
                      key={i}
                      className={`p-2 text-center text-sm cursor-pointer hover:bg-neutral-100 rounded ${
                        !isCurrentMonth ? 'text-neutral-400' :
                        isToday ? 'bg-accent-secondary text-primary-foreground' :
                        isBooked ? 'bg-semantic-error/10 text-red-800' :
                        isAvailable ? 'bg-semantic-success/10 text-green-800' :
                        'text-neutral-700'
                      }`}
                    >
                      {isCurrentMonth ? day : ''}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-semantic-success/10 rounded mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-semantic-error/10 rounded mr-2"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-neutral-100 rounded mr-2"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Bookings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
                  <div>
                    <h3 className="font-medium text-neutral-900">Wedding Photography</h3>
                    <p className="text-sm text-neutral-600">March 18, 2024 • 8:00 AM - 6:00 PM</p>
                  </div>
                  <span className="bg-semantic-error/10 text-red-800 text-xs px-2 py-1 rounded">Confirmed</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
                  <div>
                    <h3 className="font-medium text-neutral-900">Corporate Headshots</h3>
                    <p className="text-sm text-neutral-600">March 25, 2024 • 10:00 AM - 2:00 PM</p>
                  </div>
                  <span className="bg-semantic-warning/10 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Availability
                  </label>
                  <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectItem value="weekdays-9-am-5-pm">Weekdays 9 AM - 5 PM</SelectItem>
                    <SelectItem value="weekends-only">Weekends Only</SelectItem>
                    <SelectItem value="flexible-schedule">Flexible Schedule</SelectItem>
                    <SelectItem value="custom-hours">Custom Hours</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Buffer Time
                  </label>
                  <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectItem value="15-minutes">15 minutes</SelectItem>
                    <SelectItem value="30-minutes">30 minutes</SelectItem>
                    <SelectItem value="1-hour">1 hour</SelectItem>
                    <SelectItem value="2-hours">2 hours</SelectItem>
                  </Select>
                  <p className="text-xs text-neutral-500 mt-1">Time between bookings</p>
                </div>

                <div className="flex items-center">
                  <Input type="checkbox" id="auto-confirm" className="mr-3" />
                  <label htmlFor="auto-confirm" className="text-sm">
                    Auto-confirm bookings
                  </label>
                </div>

                <div className="flex items-center">
                  <Input type="checkbox" id="weekends" className="mr-3" defaultChecked />
                  <label htmlFor="weekends" className="text-sm">
                    Available on weekends
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Time Zone</h2>
              <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectItem value="eastern-time-et">Eastern Time (ET)</SelectItem>
                <SelectItem value="pacific-time-pt">Pacific Time (PT)</SelectItem>
                <SelectItem value="central-time-ct">Central Time (CT)</SelectItem>
                <SelectItem value="mountain-time-mt">Mountain Time (MT)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
              </Select>
              <p className="text-xs text-neutral-500 mt-2">
                All bookings will be displayed in your local time zone
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Availability Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Set buffer time between bookings</li>
                <li>• Block personal time and holidays</li>
                <li>• Update availability regularly</li>
                <li>• Consider travel time for on-site work</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
