
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'My QR Code | ATLVS + GVTEWAY',
  description: 'Share your profile with others using your unique QR code.',
}

export default function HomeProfileQrPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">My QR Code</h1>
          <p className="text-neutral-600">Share your profile instantly</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <div className="bg-neutral-100 rounded-lg p-6 mb-6">
              <div className="w-48 h-48 bg-background border-2 border-neutral-300 rounded mx-auto mb-4 flex items-center justify-center">
                <span className="text-6xl"></span>
              </div>
              <p className="text-sm text-neutral-600">Your unique profile QR code</p>
            </div>

            <div className="space-y-4">
              <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Download QR Code
              </Button>

              <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
                Copy Profile Link
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">How to use your QR code</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Print it on business cards or flyers</li>
            <li>• Display it at events or meetups</li>
            <li>• Share it on social media</li>
            <li>• Include it in email signatures</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            <a href="/home/profile" className="text-accent-secondary hover:text-blue-800">
              ← Back to profile
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
