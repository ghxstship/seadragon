
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'SSO Sign In | ATLVS + GVTEWAY',
  description: "Sign in to your ATLVS + GVTEWAY account using your organization's SSO provider.",
}

export default function SSOLoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Enterprise Sign In</h1>
          <p className="text-neutral-600">Sign in with your organization&apos;s SSO</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Work Email Address
              </label>
              <Input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="name@company.com"
                required/>
              <p className="text-xs text-neutral-500 mt-1">
                Enter your work email to find your SSO provider
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Continue with SSO
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Popular SSO Providers</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button className="p-2 border border-neutral-300 rounded hover:bg-neutral-100 text-sm">
              Google Workspace
            </Button>
            <Button className="p-2 border border-neutral-300 rounded hover:bg-neutral-100 text-sm">
              Microsoft Azure AD
            </Button>
            <Button className="p-2 border border-neutral-300 rounded hover:bg-neutral-100 text-sm">
              Okta
            </Button>
            <Button className="p-2 border border-neutral-300 rounded hover:bg-neutral-100 text-sm">
              OneLogin
            </Button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center">
            <div className="flex-1 border-t border-neutral-300"></div>
            <span className="px-4 text-sm text-neutral-500">or</span>
            <div className="flex-1 border-t border-neutral-300"></div>
          </div>

          <div className="space-y-2">
            <Link href="/auth/login/email" className="block w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Sign in with Email
            </Link>
            <Link href="/auth/login/magic-link" className="block w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Use Magic Link
            </Link>
          </div>

          <p className="text-sm text-neutral-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-accent-secondary hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">SSO Benefits</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Single sign-on across all platforms</li>
            <li>• Enhanced security with enterprise controls</li>
            <li>• Automatic account provisioning</li>
            <li>• Centralized user management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
