
'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  CheckCircle,
  CheckCircle2,
  FileText,
  Shield,
  Camera,
  AlertCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  UserCheck,
  Home,
  ArrowLeft,
  Lock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/lib/design-system"

interface DocumentUpload {
  type: 'id' | 'address' | 'additional'
  file: File | null
  preview: string | null
  uploaded: boolean
  verified: boolean
}

interface VerificationStatus {
  overall: 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'rejected'
  documents: {
    id: boolean
    address: boolean
    additional: boolean
  }
  submittedAt?: Date
  estimatedCompletion?: Date
  rejectionReason?: string
}

export default function VerifyIdentityPage() {
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: 'id', file: null, preview: null, uploaded: false, verified: false },
    { type: 'address', file: null, preview: null, uploaded: false, verified: false },
    { type: 'additional', file: null, preview: null, uploaded: false, verified: false }
  ])

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    overall: 'not_started',
    documents: {
      id: false,
      address: false,
      additional: false
    }
  })

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    documentType: '',
    consent: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const acceptedDocuments = {
    id: [
      'Passport',
      'Driver\'s License',
      'National ID Card',
      'Residence Permit',
      'Military ID',
      'Student ID'
    ],
    address: [
      'Utility Bill',
      'Bank Statement',
      'Lease Agreement',
      'Mortgage Statement',
      'Insurance Policy',
      'Government Letter'
    ]
  }

  const handleFileUpload = (type: 'id' | 'address' | 'additional', file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG) or PDF file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setDocuments(prev => prev.map(doc =>
        doc.type === type
          ? { ...doc, file, preview: e.target?.result as string, uploaded: true }
          : doc
      ))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.documentType || !documents[0].uploaded) {
      setError('Please fill in all required fields and upload at least one document')
      setIsSubmitting(false)
      return
    }

    if (!formData.consent) {
      setError('You must consent to the processing of your personal information')
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setVerificationStatus({
        overall: 'in_progress',
        documents: {
          id: documents[0].uploaded,
          address: documents[1].uploaded,
          additional: documents[2].uploaded
        },
        submittedAt: new Date(),
        estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      })

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard?verification=submitted')
      }, 2000)

    } catch (error) {
      setError('Failed to submit verification. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-semantic-success'
      case 'pending_review': return 'text-semantic-warning'
      case 'in_progress': return 'text-accent-secondary'
      case 'rejected': return 'text-semantic-error'
      default: return 'text-neutral-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4"/>
      case 'pending_review': return <Clock className="h-4 w-4"/>
      case 'in_progress': return <Shield className="h-4 w-4"/>
      case 'rejected': return <AlertTriangle className="h-4 w-4"/>
      default: return <FileText className="h-4 w-4"/>
    }
  }

  const verificationBenefits = [
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Verified accounts have additional security measures'
    },
    {
      icon: CreditCard,
      title: 'Higher Limits',
      description: 'Access to higher booking and transaction limits'
    },
    {
      icon: UserCheck,
      title: 'Premium Features',
      description: 'Unlock premium experiences and exclusive access'
    },
    {
      icon: Home,
      title: 'Priority Support',
      description: 'Dedicated support for verified members'
    }
  ]

  if (verificationStatus.overall === 'approved') {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-semantic-success mx-auto"/>
                  <h2 className="text-2xl font-bold">Identity Verified!</h2>
                  <p className="text-muted-foreground">
                    Your identity has been successfully verified. You now have access to all premium features.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard">Continue to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (verificationStatus.overall === 'in_progress' || verificationStatus.overall === 'pending_review') {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getStatusIcon(verificationStatus.overall)}
                  <span className="ml-2">
                    {verificationStatus.overall === 'in_progress' ? 'Verification In Progress' : 'Pending Review'}
                  </span>
                </CardTitle>
                <CardDescription>
                  We&apos;re processing your identity verification documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Verification Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="w-full"/>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-semantic-success"/>
                      <span className="text-sm">Documents received</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-semantic-success"/>
                      <span className="text-sm">Information validated</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-semantic-warning"/>
                      <span className="text-sm">Manual review in progress</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Estimated completion:</strong>{' '}
                      {verificationStatus.estimatedCompletion?.toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-1">
                      We&apos;ll notify you via email once verification is complete.
                    </p>
                  </div>

                  <Button asChild className="w-full">
                    <Link href="/dashboard">Return to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

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
            <span className="text-foreground font-medium">Verify Identity</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Shield className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Identity Verification</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete identity verification to access premium features and ensure maximum account security
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Please provide your personal details for verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          required/>
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          required/>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}/>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Select value={formData.nationality} onValueChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select nationality"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="jp">Japan</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="documentType">Document Type *</Label>
                        <Select value={formData.documentType} onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type"/>
                          </SelectTrigger>
                          <SelectContent>
                            {acceptedDocuments.id.map(doc => (
                              <SelectItem key={doc} value={doc.toLowerCase().replace(/\s+/g, '-')}>
                                {doc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Document Uploads */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold">Government-Issued ID *</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload a clear photo or scan of your government-issued identification
                        </p>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          {documents[0].preview ? (
                            <div className="space-y-4">
                              <Image
                                src={documents[0].preview}
                                alt="ID Preview"
                                width={384}
                                height={384}
                                className="max-w-full max-h-48 mx-auto rounded"
                              />
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const input = document.createElement('input')
                                    input.type = 'file'
                                    input.accept = 'image/*,.pdf'
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0]
                                      if (file) handleFileUpload('id', file)
                                    }
                                    input.click()
                                  }}
                                >
                                  Replace
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDocuments(prev => prev.map(doc =>
                                    doc.type === 'id' ? { ...doc, file: null, preview: null, uploaded: false } : doc
                                  ))}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Upload ID Document</p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, PDF up to 10MB
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.accept = 'image/*,.pdf'
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) handleFileUpload('id', file)
                                  }
                                  input.click()
                                }}
                              >
                                Choose File
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Proof of Address (Optional)</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload a recent utility bill, bank statement, or other proof of address
                        </p>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          {documents[1].preview ? (
                            <div className="space-y-4">
                              <Image
                                src={documents[1].preview}
                                alt="Address Proof Preview"
                                width={384}
                                height={384}
                                className="max-w-full max-h-48 mx-auto rounded"
                              />
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const input = document.createElement('input')
                                    input.type = 'file'
                                    input.accept = 'image/*,.pdf'
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0]
                                      if (file) handleFileUpload('address', file)
                                    }
                                    input.click()
                                  }}
                                >
                                  Replace
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDocuments(prev => prev.map(doc =>
                                    doc.type === 'address' ? { ...doc, file: null, preview: null, uploaded: false } : doc
                                  ))}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Upload Proof of Address</p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, PDF up to 10MB
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.accept = 'image/*,.pdf'
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0]
                                    if (file) handleFileUpload('address', file)
                                  }
                                  input.click()
                                }}
                              >
                                Choose File
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked: boolean | "indeterminate") =>
                          setFormData(prev => ({ ...prev, consent: checked === true }))
                        }/>
                      <div className="text-sm">
                        <Label htmlFor="consent" className="text-sm font-medium">
                          I consent to the collection and processing of my personal information *
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          By submitting this form, I agree to the{' '}
                          <Link href="/legal/privacy" className="text-accent-primary hover:underline">
                            Privacy Policy
                          </Link>{' '}
                          and{' '}
                          <Link href="/legal/terms" className="text-accent-primary hover:underline">
                            Terms of Service
                          </Link>
                          . My information will be used solely for identity verification purposes.
                        </p>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="flex space-x-3">
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard">
                          <ArrowLeft className="h-4 w-4 mr-2"/>
                          Skip for Now
                        </Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Verification Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verificationBenefits.map((benefit, index) => (
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

              {/* Accepted Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Accepted Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Government-Issued ID</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {acceptedDocuments.id.map(doc => (
                          <li key={doc}>• {doc}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Proof of Address</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {acceptedDocuments.address.map(doc => (
                          <li key={doc}>• {doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2"/>
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Your documents are encrypted and stored securely.
                      We use bank-level encryption to protect your information.
                    </p>
                    <p>
                      Documents are automatically deleted after verification is complete.
                      We never share your information with third parties.
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
