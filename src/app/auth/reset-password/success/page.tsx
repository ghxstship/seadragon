
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"

export default function Success() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/auth/reset-password" className="hover:text-foreground">Reset Password</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Success</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Password Updated
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
        </div>
      </section>

      {/* Success Message */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Password Reset Successful</CardTitle>
              <CardDescription>Your password has been changed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You can now sign in to your account using your new password.
              </p>
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
