
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

interface ReviewPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  return {
    title: `Review | ATLVS + GVTEWAY`,
    description: 'View and manage your review details and responses.',
  }
}

export default async function HomeReviewsIdPage({ params }: ReviewPageProps) {
  const { id } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button className="text-accent-secondary hover:text-blue-800 mb-4">
            ← Back to Reviews
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Review Details</h1>
          <p className="text-neutral-600">Your review of Traditional Tea Ceremony</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl"></span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Traditional Tea Ceremony</h3>
                <p className="text-neutral-600 mb-2">Kyoto, Japan • March 10, 2024</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-semantic-warning mr-1"></span>
                    <span className="text-sm text-neutral-600">Excellent</span>
                  </div>
                  <span className="text-sm text-neutral-500">23 helpful votes</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                Edit Review
              </Button>
              <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded text-sm hover:bg-red-700">
                Delete
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Review</h3>
            <p className="text-neutral-700 mb-6">
              An absolutely magical experience! The tea master was incredibly knowledgeable and patient,
              explaining the centuries-old tradition with such passion. The setting was serene and the matcha
              was exceptional quality. Highly recommend for anyone interested in Japanese culture.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">What you liked</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Authentic cultural experience</li>
                  <li>• Knowledgeable and patient instructor</li>
                  <li>• Beautiful traditional setting</li>
                  <li>• High-quality matcha tea</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Areas for improvement</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Could include more historical context</li>
                  <li>• Seating was a bit cramped for larger groups</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Posted March 10, 2024 • Edited March 11, 2024</span>
              <span>Review ID: REV-2024-001</span>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Host Response</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-semantic-success/10 rounded-full flex items-center justify-center">
                <span className="text-semantic-success font-semibold">TH</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-neutral-900">Tea House Kyoto</h4>
                  <span className="text-sm text-neutral-600">Host • March 12, 2024</span>
                </div>
                <p className="text-neutral-700">
                  Thank you so much for your wonderful review! We're delighted that you enjoyed the tea ceremony
                  and found it authentic and serene. We appreciate your feedback about the historical context and
                  seating arrangements - we'll work on incorporating more background information and improving the
                  space for larger groups. We hope to welcome you back soon!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Review Impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-secondary mb-1">23</div>
              <div className="text-sm text-neutral-600">Helpful Votes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-success mb-1">12</div>
              <div className="text-sm text-neutral-600">Views This Week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-primary mb-1">4.9</div>
              <div className="text-sm text-neutral-600">Overall Rating</div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Similar Reviews</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Zen Meditation Session</h3>
                  <p className="text-sm text-neutral-600">Kyoto • 5.0  • 45 helpful votes</p>
                </div>
              </div>
              <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Sushi Making Class</h3>
                  <p className="text-sm text-neutral-600">Tokyo • 4.8  • 32 helpful votes</p>
                </div>
              </div>
              <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Temple Tour with Monk</h3>
                  <p className="text-sm text-neutral-600">Kyoto • 4.9  • 28 helpful votes</p>
                </div>
              </div>
              <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                View
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Review Guidelines Reminder</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Be Helpful</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Include specific details about your experience</li>
                <li>• Mention what worked well and what could improve</li>
                <li>• Consider different traveler types (families, couples, solo)</li>
                <li>• Be honest but constructive</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Stay Appropriate</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Keep language appropriate for all audiences</li>
                <li>• Focus on the experience, not personal conflicts</li>
                <li>• Avoid sharing private or sensitive information</li>
                <li>• Respect hosts and other travelers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
