
import { Metadata } from 'next'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: 'Signed Out | ATLVS + GVTEWAY',
  description: 'You have been successfully signed out of your ATLVS + GVTEWAY account.',
}

export default function LogoutSuccessPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-semantic-success" />
            </div>
            <h1 className="text-3xl heading-anton mb-2">Signed Out Successfully</h1>
            <p className="text-[--text-secondary] body-share-tech">You&apos;ve been signed out of your account.</p>
          </div>

          <Card className="border border-[--border-default] bg-[--surface-default]/90 backdrop-blur shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <p className="text-[--text-secondary] body-share-tech">
                  Thank you for using ATLVS + GVTEWAY. You&apos;re securely signed out.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition">
                    <Link href="/auth/login">
                      Sign In Again
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                    <Link href="/">
                      Go to Homepage
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[--border-default] bg-[--surface-default]/90 backdrop-blur">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-[--color-accent-primary]" />
                <h3 className="text-sm font-semibold heading-anton">Security Tips</h3>
              </div>
              <ul className="text-sm text-[--text-secondary] body-share-tech space-y-2">
                <li>• Always sign out when using shared devices</li>
                <li>• Clear your browser cache for extra security</li>
                <li>• Use strong, unique passwords</li>
                <li>• Enable two-factor authentication</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
