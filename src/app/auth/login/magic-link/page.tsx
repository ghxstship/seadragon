
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Magic Link Sign In | ATLVS + GVTEWAY',
  description: 'Sign in to your ATLVS + GVTEWAY account using a magic link sent to your email.',
}

export default function MagicLinkLoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Magic Link Login</h1>
          <p className="text-neutral-600">Get instant access with a secure link</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Enter your email"
                required/>
              <p className="text-xs text-neutral-500 mt-1">
                We&apos;ll send you a secure link to sign in instantly
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Send Magic Link
            </Button>
          </form>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center">
            <div className="flex-1 border-t border-neutral-300"></div>
            <span className="px-4 text-sm text-neutral-500">or</span>
            <div className="flex-1 border-t border-neutral-300"></div>
          </div>

          <div className="space-y-2">
            <Link href="/auth/login/email" className="block w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Sign in with Password
            </Link>
            <Link href="/auth/login/sso" className="block w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Sign in with SSO
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
          <h3 className="text-sm font-medium text-blue-900 mb-2">How it works</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Enter your email address</li>
            <li>2. Check your email for a secure link</li>
            <li>3. Click the link to sign in instantly</li>
            <li>4. No passwords to remember!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
