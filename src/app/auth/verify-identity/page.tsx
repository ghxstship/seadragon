
'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  CheckCircle,
  FileText,
  Shield,
  Camera,
  AlertCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  UserCheck,
  Home,
  ArrowLeft
} from "lucide-react"
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
    if (!formData.firstName || !formData.lastName || !formData.documentType || !(documents[0]?.uploaded)) {
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
          id: Boolean(documents[0]?.uploaded),
          address: Boolean(documents[1]?.uploaded),
          additional: Boolean(documents[2]?.uploaded)
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
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-[--color-accent-primary] mx-auto"/>
                  <h2 className="text-2xl heading-anton">Identity Verified!</h2>
                  <p className="text-[--text-secondary] body-share-tech">
                    Your identity has been successfully verified. You now have access to all premium features.
                  </p>
                  <Button asChild className="h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition">
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
      <div className="min-h-screen bg-transparent text-[--text-primary]">
        <Header/>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center heading-anton">
                  {getStatusIcon(verificationStatus.overall)}
                  <span className="ml-2">
                    {verificationStatus.overall === 'in_progress' ? 'Verification In Progress' : 'Pending Review'}
                  </span>
                </CardTitle>
                <CardDescription className="text-[--text-secondary] body-share-tech">
                  We&apos;re processing your identity verification documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm text-[--text-secondary] body-share-tech mb-2">
                      <span>Verification Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="w-full"/>
                  </div>

                  <div className="space-y-3 text-[--text-secondary] body-share-tech">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-[--color-accent-primary]"/>
                      <span className="text-sm">Documents received</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-[--color-accent-primary]"/>
                      <span className="text-sm">Information validated</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-[--text-secondary]"/>
                      <span className="text-sm">Manual review in progress</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[--surface-hover] border border-[--border-default] text-[--text-secondary] body-share-tech">
                    <p className="text-sm">
                      <strong>Estimated completion:</strong>{' '}
                      {verificationStatus.estimatedCompletion?.toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-1">
                      We&apos;ll notify you via email once verification is complete.
                    </p>
                  </div>

                  <Button asChild className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition">
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
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-[--surface-default]/70 backdrop-blur border-b border-[--border-default] px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-[--text-secondary]">
            <Link href="/" className="hover:text-[--text-primary]">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-[--text-primary]">Dashboard</Link>
            <span>/</span>
            <span className="text-[--text-primary] font-medium">Verify Identity</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[--color-accent-primary]/15 rounded-full mb-6">
              <Shield className="h-10 w-10 text-[--color-accent-primary]"/>
            </div>
            <h1 className="text-4xl heading-anton mb-4">Identity Verification</h1>
            <p className="text-xl text-[--text-secondary] body-share-tech max-w-2xl mx-auto">
              Complete identity verification to access premium features and ensure maximum account security
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
                <CardHeader>
                  <CardTitle className="heading-anton">Personal Information</CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
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
                        <Label className="text-base font-semibold text-[--text-primary]">Government-Issued ID *</Label>
                        <p className="text-sm text-[--text-secondary] body-share-tech mb-4">
                          Upload a clear photo or scan of your government-issued identification
                        </p>
                        <div className="border-2 border-dashed border-[--border-default] rounded-lg p-6 text-center bg-[--surface-hover]">
                          {documents[0]?.preview ? (
                            <div className="space-y-4">
                              <Image
                                src={documents[0]?.preview as string}
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
                              <Upload className="h-6 w-6 text-muted-foreground"/>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Upload ID Document</p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, PDF up to 10MB
                                </p>
                              </div>
                              <label className="text-sm font-medium text-accent-primary cursor-pointer">
                                Browse Files
                              </label>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-semibold text-[--text-primary]">Proof of Address (Optional)</Label>
                        <p className="text-sm text-[--text-secondary] body-share-tech mb-4">
                          Provide a document that confirms your current address
                        </p>
                        <div className="border-2 border-dashed border-[--border-default] rounded-lg p-6 text-center bg-[--surface-hover]">
                          {documents[1]?.preview ? (
                            <div className="space-y-4">
                              <Image
                                src={documents[1]?.preview as string}
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
                              <Home className="h-6 w-6 text-muted-foreground"/>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Upload Proof of Address</p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, PDF up to 10MB
                                </p>
                              </div>
                              <label className="text-sm font-medium text-accent-primary cursor-pointer">
                                Browse Files
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="space-y-3">
                      <p className="text-sm text-[--text-secondary] body-share-tech">We will securely review your documents to verify your identity.</p>
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="consent"
                          checked={formData.consent}
                          onCheckedChange={(checked: boolean | "indeterminate") =>
                            setFormData(prev => ({ ...prev, consent: checked === true }))
                          }/>
                        <Label htmlFor="consent" className="text-sm text-[--text-secondary] body-share-tech">
                          I consent to the processing of my personal information for verification purposes
                        </Label>
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
                      <Button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5">
                        {isSubmitting ? 'Submitting...' : 'Submit Verification'}
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
              <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur">
                <CardHeader>
                  <CardTitle className="heading-anton">Why verify your identity?</CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    Benefits of completing identity verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {verificationBenefits.map((benefit) => (
                    <div key={benefit.title} className="flex items-start space-x-3">
                      <div className="mt-1">
                        <benefit.icon className="h-5 w-5 text-[--color-accent-primary]"/>
                      </div>
                      <div>
                        <p className="font-medium text-[--text-primary]">{benefit.title}</p>
                        <p className="text-sm text-[--text-secondary] body-share-tech">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur">
                <CardHeader>
                  <CardTitle className="heading-anton">Helpful Tips</CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    Ensure a smooth verification process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-[--text-secondary] body-share-tech">
                  <div className="flex items-start space-x-3">
                    <Camera className="h-4 w-4 text-[--color-accent-primary] mt-0.5"/>
                    <div>
                      <p className="font-medium text-[--text-primary]">Use a clear photo</p>
                      <p className="text-sm">Ensure your document photo is well-lit and readable.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-4 w-4 text-[--color-accent-primary] mt-0.5"/>
                    <div>
                      <p className="font-medium text-[--text-primary]">Check expiration dates</p>
                      <p className="text-sm">Expired documents will not be accepted.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-4 w-4 text-[--color-accent-primary] mt-0.5"/>
                    <div>
                      <p className="font-medium text-[--text-primary]">Match your information</p>
                      <p className="text-sm">Ensure the details you provide match your documents.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur">
                <CardHeader>
                  <CardTitle className="heading-anton">Need help?</CardTitle>
                  <CardDescription className="text-[--text-secondary] body-share-tech">
                    We&apos;re here to support your verification journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert>
                    <AlertTitle>Support</AlertTitle>
                    <AlertDescription>
                      Contact our support team if you need assistance with verification.
                    </AlertDescription>
                  </Alert>
                  <Button asChild variant="outline" className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
                    <Link href="/support">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
