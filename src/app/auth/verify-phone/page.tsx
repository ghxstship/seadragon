
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Smartphone, Shield, CheckCircle, AlertTriangle, Clock, ArrowLeft, Phone, Key, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: 'Verify Phone | ATLVS + GVTEWAY',
  description: 'Verify your phone number to secure your ATLVS + GVTEWAY account.',
}

interface VerifyPhonePageProps {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function VerifyPhonePage({ searchParams }: VerifyPhonePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  // Mock user data - in real app this would come from session
  const user = {
    name: session.user?.name || 'User',
    email: session.user?.email || '',
    phoneVerified: false,
    phoneNumber: resolvedSearchParams?.phone as string || ''
  }

  const countryCodes = [
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' }
  ]

  const securityBenefits = [
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Add an extra layer of protection to your account'
    },
    {
      icon: Key,
      title: 'Password Recovery',
      description: 'Easily recover your account if you forget your password'
    },
    {
      icon: CheckCircle,
      title: 'Account Verification',
      description: 'Verify your identity for important account changes'
    },
    {
      icon: Phone,
      title: 'SMS Notifications',
      description: 'Receive important alerts and updates via SMS'
    }
  ]

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
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Verify Phone</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Smartphone className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Verify Your Phone Number</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Add an extra layer of security to your account by verifying your phone number
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Phone Verification Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2"/>
                    Phone Verification
                  </CardTitle>
                  <CardDescription>
                    Enter your phone number to receive a verification code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Current Status */}
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge variant={user.phoneVerified ? "default" : "secondary"}>
                        {user.phoneVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1"/>
                            Phone Verified
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1"/>
                            Phone Not Verified
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Phone Number Form */}
                  <form className="space-y-6">
                    <div>
                      <Label htmlFor="country-code" className="text-base font-medium">
                        Country Code & Phone Number
                      </Label>
                      <div className="flex mt-2">
                        <Select defaultValue="+1">
                          <SelectTrigger className="w-32">
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.flag} {country.code} {country.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone-number"
                          type="tel"
                          placeholder="(555) 123-4567"
                          className="flex-1 ml-2"
                          defaultValue={user.phoneNumber}
                          required
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        We&apos;ll send a 6-digit verification code to this number via SMS.
                        Standard messaging rates may apply.
                      </p>
                    </div>

                    {/* Verification Code Input (shown after sending code) */}
                    <div className="hidden">
                      <Label htmlFor="verification-code" className="text-base font-medium">
                        Verification Code
                      </Label>
                      <div className="flex space-x-2 mt-2">
                        {[...Array(6)].map((_, index) => (
                          <Input
                            key={index}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl font-bold"
                            required
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-muted-foreground">
                          Enter the 6-digit code sent to your phone
                        </p>
                        <Button variant="ghost" size="sm" className="text-accent-primary">
                          <RefreshCw className="h-4 w-4 mr-1"/>
                          Resend Code
                        </Button>
                      </div>
                    </div>

                    {/* Error Message */}
                    <div className="hidden">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Verification Failed</AlertTitle>
                        <AlertDescription>
                          The code you entered is incorrect or has expired. Please try again.
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Success Message */}
                    <div className="hidden">
                      <Alert>
                        <CheckCircle className="h-4 w-4"/>
                        <AlertTitle>Phone Verified!</AlertTitle>
                        <AlertDescription>
                          Your phone number has been successfully verified and added to your account.
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button type="submit" className="flex-1">
                        <Phone className="h-4 w-4 mr-2"/>
                        Send Verification Code
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard">
                          <ArrowLeft className="h-4 w-4 mr-2"/>
                          Skip for Now
                        </Link>
                      </Button>
                    </div>
                  </form>

                  {/* Additional Options */}
                  <div className="mt-8 pt-6 border-t">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Alternative Verification Methods</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Shield className="h-4 w-4 mr-2"/>
                            Use Authenticator App Instead
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <CheckCircle className="h-4 w-4 mr-2"/>
                            Verify via Email Instead
                          </Button>
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">
                          Need help? Contact our{' '}
                          <Link href="/support" className="text-accent-primary hover:underline">
                            support team
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2"/>
                    Why Verify?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-accent-primary/10 rounded-lg">
                          <benefit.icon className="h-4 w-4 text-accent-primary"/>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{benefit.title}</h4>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Facts */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Facts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Verification Time:</span>
                      <span className="font-medium">2-3 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Code Validity:</span>
                      <span className="font-medium">10 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SMS Cost:</span>
                      <span className="font-medium">Standard rates</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Level:</span>
                      <span className="font-medium">Enhanced</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2"/>
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Your phone number is encrypted and stored securely.
                      We only use it for account security and important notifications.
                    </p>
                    <p>
                      You can remove your phone number or change it anytime
                      in your account settings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
