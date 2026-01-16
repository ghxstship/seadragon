
'use client'

import { useState, useEffect } from "react"
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Header } from "@/lib/design-system"
import { User, Building, Shield, CheckCircle, Plus, ArrowRight, AlertTriangle, Users, Briefcase } from "lucide-react"

interface Account {
  id: string
  type: 'personal' | 'organization' | 'professional'
  name: string
  email: string
  avatar?: string
  role?: string
  organization?: string
  lastActive: Date
  isCurrent: boolean
  status: 'active' | 'suspended' | 'pending'
  permissions: string[]
}

interface AccountApiResponse {
  id: string | number
  type?: string
  name?: string
  email?: string
  avatar?: string
  role?: string
  organization?: string
  last_active?: string
  lastActive?: string
  is_current?: boolean
  isCurrent?: boolean
  status?: string
  permissions?: string[]
}

export default function SwitchAccountPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isSwitching, setIsSwitching] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadAccounts = async () => {
      try {
        const res = await fetch('/api/v1/accounts')
        if (res.ok) {
          const data = await res.json()
          const accts = Array.isArray(data.accounts) ? data.accounts : []
          if (!cancelled) {
            setAccounts(accts.map((a: AccountApiResponse) => ({
              id: String(a.id),
              type: a.type || 'personal',
              name: String(a.name || ''),
              email: String(a.email || ''),
              avatar: a.avatar,
              role: a.role,
              organization: a.organization,
              lastActive: new Date(a.last_active || a.lastActive || new Date()),
              isCurrent: Boolean(a.is_current || a.isCurrent),
              status: a.status || 'active',
              permissions: Array.isArray(a.permissions) ? a.permissions : []
            })))
          }
        } else {
          if (!cancelled) {
            setAccounts([])
          }
        }
      } catch (error) {
        logger.error('Error loading accounts:', error)
        if (!cancelled) {
          setAccounts([])
        }
      }
    }

    loadAccounts()

    return () => { cancelled = true }
  }, [])

  const handleSwitchAccount = async (account: Account) => {
    if (account.isCurrent) return

    setIsSwitching(true)
    setSelectedAccount(account)

    try {
      // Simulate account switching
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In real app, this would update session/cookies and redirect
      alert(`Switched to ${account.name} (${account.type})`)
      router.push('/dashboard')
    } catch (error) {
      logger.error('Failed to switch account', error)
      alert('Failed to switch account. Please try again.')
    } finally {
      setIsSwitching(false)
      setSelectedAccount(null)
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'organization':
        return <Building className="h-5 w-5"/>
      case 'professional':
        return <Briefcase className="h-5 w-5"/>
      case 'personal':
      default:
        return <User className="h-5 w-5"/>
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'organization':
        return 'text-accent-secondary'
      case 'personal':
        return 'text-semantic-success'
      case 'professional':
        return 'text-accent-primary'
      default:
        return 'text-neutral-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-semantic-success/10 text-green-800">Active</Badge>
      case 'suspended':
        return <Badge variant="secondary" className="bg-semantic-warning/10 text-orange-800">Suspended</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-semantic-warning/10 text-yellow-800">Pending</Badge>
      default:
        return null
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Active now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const personalAccounts = accounts.filter(a => a.type === 'personal')
  const organizationAccounts = accounts.filter(a => a.type === 'organization')
  const professionalAccounts = accounts.filter(a => a.type === 'professional')

  const cardClass = "border border-[--border-default] bg-[--surface-default]/90 backdrop-blur shadow-[0_12px_30px_rgba(0,0,0,0.08)]"

  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-[--text-secondary] body-share-tech">
            <Link href="/" className="hover:text-[--text-primary]">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-[--text-primary]">Dashboard</Link>
            <span>/</span>
            <span className="text-[--text-primary] font-semibold">Switch Account</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[--color-accent-primary]/15 rounded-full mb-6">
              <User className="h-10 w-10 text-[--color-accent-primary]"/>
            </div>
            <h1 className="text-4xl heading-anton mb-4">Switch Account</h1>
            <p className="text-lg text-[--text-secondary] body-share-tech max-w-2xl mx-auto">
              Choose which account or organization you&apos;d like to use. Your data and preferences are kept separate for each account.
            </p>
          </div>

          {/* Current Account Highlight */}
          <Card className={`mb-8 ${cardClass}`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[--color-accent-primary]/15 rounded-full">
                  <CheckCircle className="h-6 w-6 text-[--color-accent-primary]"/>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold heading-anton mb-1">Current Account</h3>
                  <p className="text-[--text-secondary] body-share-tech">
                    You&apos;re currently signed in as {accounts.find(a => a.isCurrent)?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Personal Accounts */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl heading-anton mb-4 flex items-center">
                  <User className="h-6 w-6 mr-2 text-semantic-success"/>
                  Personal
                </h2>
                <div className="space-y-4">
                  {personalAccounts.map((account) => (
                    <Card key={account.id} className={`cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] ${
                      account.isCurrent ? 'ring-2 ring-[--color-accent-primary] bg-[--surface-default]' : cardClass
                    } ${account.status !== 'active' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getAccountColor(account.type)} bg-[--surface-hover]`}>
                              {getAccountIcon(account.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[--text-primary]">{account.name}</h3>
                              <p className="text-sm text-[--text-secondary] body-share-tech">{account.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {account.isCurrent && (
                              <Badge variant="secondary" className="bg-[--color-accent-primary]/10 text-[--color-accent-primary]">Current</Badge>
                            )}
                            {getStatusBadge(account.status)}
                          </div>
                        </div>

                        <div className="text-sm text-[--text-secondary] body-share-tech mb-4">
                          <p>Role: {account.role}</p>
                          <p>Last active: {formatLastActive(account.lastActive)}</p>
                        </div>

                        <div className="flex space-x-2">
                          {account.isCurrent ? (
                            <Button disabled className="flex-1 h-10 rounded-full">
                              <CheckCircle className="h-4 w-4 mr-2"/>
                              Active
                            </Button>
                          ) : account.status === 'active' ? (
                            <Button
                              className="flex-1 h-10 rounded-full bg-[--color-accent-primary] text-white hover:-translate-y-0.5 transition"
                              onClick={() => handleSwitchAccount(account)}
                              disabled={isSwitching}
                            >
                              {isSwitching && selectedAccount?.id === account.id ? (
                                'Switching...'
                              ) : (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2"/>
                                  Switch
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button disabled variant="outline" className="flex-1 h-10 rounded-full">
                              {account.status === 'suspended' ? 'Suspended' : 'Pending'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Organization Accounts */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl heading-anton mb-4 flex items-center">
                  <Building className="h-6 w-6 mr-2 text-[--color-accent-secondary]"/>
                  Organizations
                </h2>
                <div className="space-y-4">
                  {organizationAccounts.map((account) => (
                    <Card key={account.id} className={`cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] ${
                      account.isCurrent ? 'ring-2 ring-[--color-accent-primary] bg-[--surface-default]' : cardClass
                    } ${account.status !== 'active' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getAccountColor(account.type)} bg-[--surface-hover]`}>
                              {getAccountIcon(account.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[--text-primary]">{account.organization}</h3>
                              <p className="text-sm text-[--text-secondary] body-share-tech">{account.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {account.isCurrent && (
                              <Badge variant="secondary" className="bg-[--color-accent-primary]/10 text-[--color-accent-primary]">Current</Badge>
                            )}
                            {getStatusBadge(account.status)}
                          </div>
                        </div>

                        <div className="text-sm text-[--text-secondary] body-share-tech mb-4">
                          <p>Role: {account.role}</p>
                          <p>Last active: {formatLastActive(account.lastActive)}</p>
                          <p className="mt-2">
                            <Badge variant="outline" className="text-xs bg-[--surface-hover] border-[--border-default] text-[--text-primary]">
                              <Users className="h-3 w-3 mr-1"/>
                              {account.permissions.length} permissions
                            </Badge>
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          {account.isCurrent ? (
                            <Button disabled className="flex-1 h-10 rounded-full">
                              <CheckCircle className="h-4 w-4 mr-2"/>
                              Active
                            </Button>
                          ) : account.status === 'active' ? (
                            <Button
                              className="flex-1"
                              onClick={() => handleSwitchAccount(account)}
                              disabled={isSwitching}
                            >
                              {isSwitching && selectedAccount?.id === account.id ? (
                                'Switching...'
                              ) : (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2"/>
                                  Switch
                                </>
                              )}
                            </Button>
                          ) : account.status === 'suspended' ? (
                            <div className="flex-1">
                              <Alert className="border-[--border-default] bg-[--surface-default]/90">
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertTitle className="heading-anton text-sm">Account Suspended</AlertTitle>
                                <AlertDescription className="text-xs body-share-tech text-[--text-secondary]">
                                  Contact your organization admin to restore access.
                                </AlertDescription>
                              </Alert>
                            </div>
                          ) : (
                            <Button disabled variant="outline" className="flex-1 h-10 rounded-full">
                              Pending Approval
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {organizationAccounts.length === 0 && (
                    <Card className={cardClass}>
                      <CardContent className="p-6 text-center space-y-3">
                        <Building className="h-12 w-12 mx-auto mb-2 text-[--color-accent-secondary]"/>
                        <h3 className="font-semibold heading-anton">No Organizations</h3>
                        <p className="text-sm text-[--text-secondary] body-share-tech">
                          You haven&apos;t been added to any organizations yet.
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-full h-10">
                              <Plus className="h-4 w-4 mr-2"/>
                              Join Organization
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-[--border-default] bg-[--surface-default]/95 backdrop-blur">
                            <DialogHeader>
                              <DialogTitle className="heading-anton">Join an Organization</DialogTitle>
                              <DialogDescription className="body-share-tech text-[--text-secondary]">
                                Enter an organization code or email to join an existing organization.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <label className="text-sm font-medium body-share-tech">Organization Code or Email</label>
                                <Input
                                  type="text"
                                  className="w-full h-11 mt-1 border-[--border-default]"
                                  placeholder="Enter code or admin email"
                                />
                              </div>
                              <Button className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white">
                                Send Request
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Accounts */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl heading-anton mb-4 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-[--color-accent-primary]"/>
                  Professional
                </h2>
                <div className="space-y-4">
                  {professionalAccounts.map((account) => (
                    <Card key={account.id} className={`cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] ${
                      account.isCurrent ? 'ring-2 ring-[--color-accent-primary] bg-[--surface-default]' : cardClass
                    } ${account.status !== 'active' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getAccountColor(account.type)} bg-[--surface-hover]`}>
                              {getAccountIcon(account.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[--text-primary]">{account.name}</h3>
                              <p className="text-sm text-[--text-secondary] body-share-tech">{account.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {account.isCurrent && (
                              <Badge variant="secondary" className="bg-[--color-accent-primary]/10 text-[--color-accent-primary]">Current</Badge>
                            )}
                            {getStatusBadge(account.status)}
                          </div>
                        </div>

                        <div className="text-sm text-[--text-secondary] body-share-tech mb-4">
                          <p>Professional Account</p>
                          <p>Last active: {formatLastActive(account.lastActive)}</p>
                        </div>

                        <div className="flex space-x-2">
                          {account.isCurrent ? (
                            <Button disabled className="flex-1 h-10 rounded-full">
                              <CheckCircle className="h-4 w-4 mr-2"/>
                              Active
                            </Button>
                          ) : account.status === 'active' ? (
                            <Button
                              className="flex-1 h-10 rounded-full bg-[--color-accent-primary] text-white hover:-translate-y-0.5 transition"
                              onClick={() => handleSwitchAccount(account)}
                              disabled={isSwitching}
                            >
                              {isSwitching && selectedAccount?.id === account.id ? (
                                'Switching...'
                              ) : (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2"/>
                                  Switch
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button disabled variant="outline" className="flex-1 h-10 rounded-full">
                              {account.status === 'suspended' ? 'Suspended' : 'Pending'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {professionalAccounts.length === 0 && (
                    <Card className={cardClass}>
                      <CardContent className="p-6 text-center space-y-3">
                        <Briefcase className="h-12 w-12 mx-auto mb-2 text-[--color-accent-primary]"/>
                        <h3 className="font-semibold heading-anton">No Professional Accounts</h3>
                        <p className="text-sm text-[--text-secondary] body-share-tech">
                          Create a professional account to sell experiences and manage bookings.
                        </p>
                        <Button variant="outline" asChild className="h-10 rounded-full border-[--border-default]">
                          <Link href="/auth/signup?type=professional">
                            <Plus className="h-4 w-4 mr-2"/>
                            Create Professional Account
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Add Account Section */}
          <div className="mt-12">
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className="flex items-center heading-anton">
                  <Plus className="h-5 w-5 mr-2"/>
                  Add Another Account
                </CardTitle>
                <CardDescription className="text-[--text-secondary] body-share-tech">
                  Connect additional accounts or create new ones to switch between them easily.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col rounded-2xl border-[--border-default] bg-[--surface-default]" asChild>
                    <Link href="/auth/signup?type=personal">
                      <User className="h-6 w-6 mb-2"/>
                      Add Personal Account
                    </Link>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col rounded-2xl border-[--border-default] bg-[--surface-default]">
                    <Building className="h-6 w-6 mb-2"/>
                    Join Organization
                  </Button>

                  <Button variant="outline" className="h-20 flex-col rounded-2xl border-[--border-default] bg-[--surface-default]" asChild>
                    <Link href="/auth/signup?type=professional">
                      <Briefcase className="h-6 w-6 mb-2"/>
                      Create Professional Account
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <Alert className="mt-8 border-[--border-default] bg-[--surface-default]/90 backdrop-blur">
            <Shield className="h-4 w-4"/>
            <AlertTitle className="heading-anton text-sm">Account Security</AlertTitle>
            <AlertDescription className="body-share-tech text-[--text-secondary]">
              Switching accounts will sign you out of your current session and sign you into the selected account.
              Make sure to save any unsaved work before switching.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
