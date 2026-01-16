
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"

export default async function TransactionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
            <Link href="/home" className="hover:text-foreground">Member Home</Link>
            <span>/</span>
            <Link href="/home/wallet" className="hover:text-foreground">Wallet</Link>
            <span>/</span>
            <Link href="/home/wallet/transactions" className="hover:text-foreground">Transactions</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Transaction {id}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Transaction {id}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Details for this transaction.
          </p>
        </div>
      </section>

      {/* Transaction Detail Placeholder */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Information for transaction {id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Transaction details for {id} will be displayed here.
              </p>
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
