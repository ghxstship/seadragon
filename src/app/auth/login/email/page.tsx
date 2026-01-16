
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Sign In | ATLVS + GVTEWAY',
  description: 'Sign in to your ATLVS + GVTEWAY account using email and password.',
}

export default function EmailLoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
          <p className="text-neutral-600">Sign in to your account</p>
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
                required/>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required/>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="remember"
                  className="mr-2"/>
                <label htmlFor="remember" className="text-sm text-neutral-600">
                  Remember me
                </label>
              </div>
              <a href="/auth/forgot-password" className="text-sm text-accent-secondary hover:text-blue-800">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Sign In
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
            <Link href="/auth/login/magic-link" className="block w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Send Magic Link
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
      </div>
    </div>
  )
}
