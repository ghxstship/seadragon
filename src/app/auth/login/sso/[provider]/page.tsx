
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { use } from 'react'

interface SSOProviderPageProps {
  params: Promise<{ provider: string }>
}

export async function generateMetadata({ params }: SSOProviderPageProps): Promise<Metadata> {
  const { provider } = await params
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1)
  return {
    title: `${providerName} SSO Login | ATLVS + GVTEWAY`,
    description: `Sign in to ATLVS + GVTEWAY using your ${providerName} account.`,
  }
}

export default function SSOProviderPage({ params }: SSOProviderPageProps) {
  const { provider } = use(params)
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{providerName === 'Google' ? '🇬' : providerName === 'Microsoft' ? '' : ''}</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">{providerName} SSO Login</h1>
          <p className="text-neutral-600">Continue with your {providerName} account</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              You will be redirected to {providerName} to authenticate and then brought back to ATLVS + GVTEWAY.
            </p>

            <Button
              className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
            >
              Continue with {providerName}
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
            <a href="/auth/login/email" className="block w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Sign in with Email
            </a>
            <a href="/auth/login/magic-link" className="block w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Use Magic Link
            </a>
          </div>

          <p className="text-sm text-neutral-600">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="text-accent-secondary hover:text-blue-800">
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Privacy & Security</h3>
          <p className="text-sm text-neutral-600">
            We only request the minimum information needed from {providerName} to create or access your account.
            Your data remains secure and is not shared with third parties without your consent.
          </p>
        </div>
      </div>
    </div>
  )
}
