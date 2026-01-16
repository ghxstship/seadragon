
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Header } from '@/lib/design-system'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Join as Professional | ATLVS + GVTEWAY',
  description: 'Create your professional account and join the ATLVS + GVTEWAY network of creators and service providers.',
}

export default function ProfessionalSignupPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header />

      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl heading-anton">Join as a Professional</h1>
            <p className="text-[--text-secondary] body-share-tech">Build your business with ATLVS + GVTEWAY</p>
          </div>

          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="heading-anton text-2xl">Create Your Professional Account</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                We&apos;ll verify your email after you sign up
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[--text-secondary] body-share-tech">First Name</Label>
                    <Input id="firstName" type="text" placeholder="Jordan" className="h-11" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[--text-secondary] body-share-tech">Last Name</Label>
                    <Input id="lastName" type="text" placeholder="Lee" className="h-11" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[--text-secondary] body-share-tech">Business Email</Label>
                  <Input id="email" type="email" placeholder="you@studio.com" className="h-11" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[--text-secondary] body-share-tech">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="h-11" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-[--text-secondary] body-share-tech">Profession / Service Type</Label>
                  <Select defaultValue="">
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photographer">Photographer</SelectItem>
                      <SelectItem value="videographer">Videographer</SelectItem>
                      <SelectItem value="tour-guide">Tour Guide</SelectItem>
                      <SelectItem value="chef">Chef / Cooking Instructor</SelectItem>
                      <SelectItem value="artist">Artist / Artisan</SelectItem>
                      <SelectItem value="instructor">Fitness / Meditation Instructor</SelectItem>
                      <SelectItem value="consultant">Travel Consultant</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-[--text-secondary] body-share-tech">Business Name (Optional)</Label>
                  <Input id="businessName" type="text" placeholder="Your studio or brand" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[--text-secondary] body-share-tech">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="h-11" required />
                  <p className="text-xs text-[--text-muted] body-share-tech">Use 8+ characters with numbers and symbols</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[--text-secondary] body-share-tech">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" className="h-11" required />
                </div>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 text-sm text-[--text-secondary] body-share-tech">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[--border-default] text-[--color-accent-primary] focus:ring-[--color-accent-primary]" required />
                    <span>
                      I agree to the{' '}
                      <Link href="/legal/terms" className="text-[--color-accent-primary] hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/legal/privacy" className="text-[--color-accent-primary] hover:underline">Privacy Policy</Link>
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 text-sm text-[--text-secondary] body-share-tech">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[--border-default] text-[--color-accent-primary] focus:ring-[--color-accent-primary]" />
                    <span>Send me updates about platform features and business opportunities</span>
                  </label>
                </div>

                <Button type="submit" className="w-full h-11 rounded-full bg-[--color-accent-primary] text-black shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5">
                  Create Professional Account
                </Button>
              </form>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-sm text-[--text-secondary] body-share-tech">
                  <div className="flex-1 h-px bg-[--border-default]" />
                  <span>or</span>
                  <div className="flex-1 h-px bg-[--border-default]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">Continue with LinkedIn</Button>
                  <Button variant="outline" className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">Continue with Google</Button>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-[--text-secondary] body-share-tech">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-[--color-accent-primary] hover:underline">Sign in</Link>
                  </p>
                  <p className="text-sm text-[--text-secondary] body-share-tech">
                    Looking to join as a{' '}
                    <Link href="/auth/signup/consumer" className="text-[--color-accent-primary] hover:underline">member</Link>
                    {' '}or{' '}
                    <Link href="/auth/signup/organization" className="text-[--color-accent-primary] hover:underline">organization</Link>
                    ?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[--border-default] bg-[--surface-default]/80 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur">
            <CardHeader>
              <CardTitle className="heading-anton text-xl">Why pros choose ATLVS</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">Grow your practice with trusted clients</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[--text-secondary] body-share-tech">
                <li>• Verified clientele and safer bookings</li>
                <li>• Built-in payments and scheduling</li>
                <li>• Featured placement for top providers</li>
                <li>• Support for packages, add-ons, and upsells</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
