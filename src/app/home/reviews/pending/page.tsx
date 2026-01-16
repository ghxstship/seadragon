
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Pending Reviews | ATLVS + GVTEWAY',
  description: 'Write reviews for your completed experiences and help other travelers make informed decisions.',
}

export default function HomeReviewsPendingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Pending Reviews</h1>
          <p className="text-neutral-600">Share your experiences to help other travelers</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Santorini Photography Tour</h3>
                <p className="text-neutral-600 mb-2">Completed on March 5, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-semantic-warning/10 text-orange-800 px-2 py-1 rounded">Due in 3 days</span>
                  <span className="text-neutral-500">Earn 50 credits</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Write Review
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Tokyo Food Tour</h3>
                <p className="text-neutral-600 mb-2">Completed on February 28, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-semantic-error/10 text-red-800 px-2 py-1 rounded">Overdue</span>
                  <span className="text-neutral-500">Earn 30 credits</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-semantic-error text-primary-foreground py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
              Write Review (Urgent)
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Broadway Musical Experience</h3>
                <p className="text-neutral-600 mb-2">Completed on February 20, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded">Due in 10 days</span>
                  <span className="text-neutral-500">Earn 75 credits</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Write Review
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-semantic-warning/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">New Zealand Hiking Adventure</h3>
                <p className="text-neutral-600 mb-2">Completed on February 10, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-semantic-error/10 text-red-800 px-2 py-1 rounded">Overdue</span>
                  <span className="text-neutral-500">Earn 100 credits</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-semantic-error text-primary-foreground py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
              Write Review (Urgent)
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Why Write Reviews?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Earn Credits</h3>
              <p className="text-sm text-blue-800">Get travel credits for each review you write</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Help Others</h3>
              <p className="text-sm text-blue-800">Guide fellow travelers with your experiences</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Build Reputation</h3>
              <p className="text-sm text-blue-800">Become a trusted reviewer in the community</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Review Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">What to Include</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Overall experience rating</li>
                <li>• Specific details about the activity</li>
                <li>• Quality of service and staff</li>
                <li>• Value for money</li>
                <li>• Tips for other travelers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Review Tips</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Be honest and constructive</li>
                <li>• Include both positives and areas for improvement</li>
                <li>• Keep it relevant and helpful</li>
                <li>• Use photos if available</li>
                <li>• Reviews are public and help the community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
