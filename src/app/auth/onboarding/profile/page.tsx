
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Create Profile | ATLVS + GVTEWAY',
  description: 'Set up your basic profile information to get started with ATLVS + GVTEWAY.',
}

export default function OnboardingProfilePage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[--color-accent-primary]/15 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-[--color-accent-primary]">YOU</span>
            </div>
            <h1 className="text-3xl heading-anton">Create Your Profile</h1>
            <p className="text-[--text-secondary] body-share-tech">Tell us a bit about yourself</p>
          </div>

          <div className="border border-[--border-default] bg-[--surface-default]/90 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur p-6">
            <form className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-24 h-24 bg-[--surface-hover] border border-[--border-default] rounded-full mx-auto flex items-center justify-center text-[--text-secondary]">
                  <span className="text-3xl">🙂</span>
                </div>
                <Button type="button" variant="outline" className="h-10 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                  Add profile photo
                </Button>
              </div>

              <div className="space-y-2">
                <label htmlFor="displayName" className="block text-sm text-[--text-secondary] body-share-tech">
                  Display Name
                </label>
                <Input
                  type="text"
                  id="displayName"
                  className="h-11 rounded-full border-[--border-default]"
                  placeholder="How you'd like to be known"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm text-[--text-secondary] body-share-tech">
                  Bio (Optional)
                </label>
                <Textarea
                  id="bio"
                  rows={3}
                  className="w-full rounded-2xl border-[--border-default] focus-visible:ring-[--focus-ring]"
                  placeholder="Tell others about yourself..."/>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm text-[--text-secondary] body-share-tech">
                  Location
                </label>
                <Input
                  type="text"
                  id="location"
                  className="h-11 rounded-full border-[--border-default]"
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="block text-sm text-[--text-secondary] body-share-tech">
                  Website (Optional)
                </label>
                <Input
                  type="url"
                  id="website"
                  className="h-11 rounded-full border-[--border-default]"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition"
              >
                Continue
              </Button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm text-[--text-secondary] body-share-tech">
              Skip for now?{' '}
              <Button variant="ghost" className="text-[--color-accent-primary]" asChild>
                <Link href="/auth/onboarding/preferences">Complete later</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
