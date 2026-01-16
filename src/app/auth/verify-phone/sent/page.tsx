
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Enter Code | ATLVS + GVTEWAY',
  description: 'Enter the verification code sent to your phone to complete phone verification.',
}

export default function VerifyPhoneSentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Enter Verification Code</h1>
          <p className="text-neutral-600">We sent a code to your phone</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Verification Code
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-lg font-semibold"
                    required
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Verify Phone Number
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Didn&apos;t receive the code?</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Wait a few minutes for delivery</li>
            <li>• Check your spam/junk folder</li>
            <li>• Ensure your phone number is correct</li>
            <li>• <Button className="text-accent-secondary hover:text-blue-800">Resend code</Button> (available in 30 seconds)</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Wrong number?{' '}
            <a href="/auth/verify-phone" className="text-accent-secondary hover:text-blue-800">
              Change phone number
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
