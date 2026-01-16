
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

interface WalletData {
  balance: number
  credits: number
  currency: string
}

interface Transaction {
  id: string
  type: string
  description: string
  amount: number
  date: string
  status: string
}

interface PaymentMethod {
  id: string
  type: string
  last4: string
  brand: string
  expiry_month: number
  expiry_year: number
  is_default: boolean
}

export default async function WalletPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Fetch wallet data from Supabase
  const { data: walletResult } = await supabase
    .from('wallets')
    .select('balance, credits, currency')
    .eq('user_id', session.user?.id)
    .single()

  const walletData: WalletData = walletResult || { balance: 0, credits: 0, currency: 'USD' }

  // Fetch wallet transactions from Supabase (using correct table name)
  const { data: walletRecord, error: walletRecordError } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', session.user?.id)
    .single()

  if (walletRecordError && walletRecordError.code !== 'PGRST116') {
    logger.error('Failed to fetch wallet record', walletRecordError, { userId: session.user?.id })
  }

  let transactions: Transaction[] = []
  if (walletRecord?.id) {
    const { data: transactionsResult, error: transactionsError } = await supabase
      .from('wallet_transactions')
      .select('id, type, description, amount, reference_id, "createdAt"')
      .eq('wallet_id', walletRecord.id)
      .order('"createdAt"', { ascending: false })
      .limit(10)

    if (transactionsError) {
      logger.error('Failed to fetch wallet transactions', transactionsError, { walletId: walletRecord.id })
    }

    transactions = (transactionsResult || []).map((t: { id: string; type: string; description: string | null; amount: number; createdAt: string }) => ({
      id: t.id,
      type: t.type,
      description: t.description || 'Transaction',
      amount: Number(t.amount),
      date: t.createdAt,
      status: 'completed'
    }))
  }

  const paymentMethods: PaymentMethod[] = []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-display font-bold">ATLVS + GVTEWAY</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/home" className="text-sm font-medium">Home</Link>
            <Link href="/home/itineraries" className="text-sm font-medium">Itineraries</Link>
            <Link href="/home/tickets" className="text-sm font-medium">Tickets</Link>
            <Link href="/home/wallet" className="text-sm font-medium text-accent-primary">Wallet</Link>
            <Link href="/home/profile" className="text-sm font-medium">Profile</Link>
          </nav>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Welcome, {session.user.name}
            </span>
            <Button variant="ghost" size="sm">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">My Wallet</h1>
          <p className="text-muted-foreground">
            Manage your balance, credits, and payment methods.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Balance Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Account Balance
                    <Badge variant="secondary">Active</Badge>
                  </CardTitle>
                  <CardDescription>Your available spending balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent-primary mb-4">
                    ${walletData.balance.toFixed(2)}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Add Funds</Button>
                    <Button size="sm" variant="outline">Transfer</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Platform Credits
                    <Badge variant="outline">Bonus</Badge>
                  </CardTitle>
                  <CardDescription>Credits for future purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-semantic-success mb-4">
                    ${walletData.credits.toFixed(2)}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Earn More</Button>
                    <Button size="sm" variant="outline">Redeem</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common wallet operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-2xl mb-2"></span>
                    Add Payment Method
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-2xl mb-2"></span>
                    Buy Credits
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <span className="text-2xl mb-2"></span>
                    Download Statement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'purchase' ? 'bg-semantic-error/10 text-semantic-error' :
                          transaction.type === 'credit' ? 'bg-semantic-success/10 text-semantic-success' :
                          'bg-accent-primary/10 text-accent-secondary'
                        }`}>
                          {transaction.type === 'purchase' ? '' :
                           transaction.type === 'credit' ? '' : '↩️'}
                        </div>
                        <div>
                          <p className="font-semibold">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.amount > 0 ? 'text-semantic-success' : 'text-semantic-error'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Payment Methods</CardTitle>
                <CardDescription>Manage your stored payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-neutral-100 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">
                            {method.brand === 'Visa' ? 'VISA' : method.brand}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">
                            •••• •••• •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiry_month}/{method.expiry_year}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.is_default && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button>Add New Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earn Credits</CardTitle>
                  <CardDescription>Ways to earn platform credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-semibold">Refer a Friend</p>
                      <p className="text-sm text-muted-foreground">$25 credit for each referral</p>
                    </div>
                    <Button size="sm">Share</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-semibold">Leave Reviews</p>
                      <p className="text-sm text-muted-foreground">$5 credit per review</p>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-semibold">Complete Profile</p>
                      <p className="text-sm text-muted-foreground">$10 one-time bonus</p>
                    </div>
                    <Button size="sm">Complete</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Redeem Credits</CardTitle>
                  <CardDescription>Use your credits on purchases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-semantic-success mb-2">
                      ${walletData.credits.toFixed(2)} Available
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Credits are automatically applied at checkout
                    </p>
                    <Button disabled={walletData.credits === 0}>
                      Use Credits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
