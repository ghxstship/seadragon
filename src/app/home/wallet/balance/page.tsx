
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Wallet Balance | ATLVS + GVTEWAY',
  description: 'View your account balance, credits, and financial overview.',
}

export default function HomeWalletBalancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Wallet Balance</h1>
          <p className="text-neutral-600">Manage your credits, balance, and payment history</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Account Balance</h2>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-semantic-success mb-2">$247.50</div>
              <p className="text-neutral-600">Available Balance</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Pending Charges</span>
                <span className="text-sm font-medium text-semantic-warning">-$89.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Available for Use</span>
                <span className="text-sm font-medium text-semantic-success">$158.50</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Travel Credits</h2>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-accent-secondary mb-2">1,250</div>
              <p className="text-neutral-600">Credits Available</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Earned This Month</span>
                <span className="text-sm font-medium text-semantic-success">+450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Used This Month</span>
                <span className="text-sm font-medium text-semantic-error">-320</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Expires Soon</span>
                <span className="text-sm font-medium text-semantic-warning">150 (Mar 31)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl"></span>
            </div>
            <h3 className="font-medium text-neutral-900 mb-1">Add Funds</h3>
            <p className="text-sm text-neutral-600 mb-3">Load money to your account</p>
            <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded hover:bg-green-700 text-sm">
              Add Funds
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl"></span>
            </div>
            <h3 className="font-medium text-neutral-900 mb-1">Buy Credits</h3>
            <p className="text-sm text-neutral-600 mb-3">Purchase travel credits</p>
            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded hover:bg-accent-tertiary text-sm">
              Buy Credits
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl"></span>
            </div>
            <h3 className="font-medium text-neutral-900 mb-1">Withdraw</h3>
            <p className="text-sm text-neutral-600 mb-3">Transfer to bank account</p>
            <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded hover:bg-purple-700 text-sm">
              Withdraw
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm"></span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Added Funds</p>
                  <p className="text-sm text-neutral-600">Credit Card **** 4567</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-success">+$100.00</p>
                <p className="text-sm text-neutral-500">Mar 10, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm"></span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Experience Booking</p>
                  <p className="text-sm text-neutral-600">Broadway Musical: Hamilton</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-error">-$89.00</p>
                <p className="text-sm text-neutral-500">Mar 8, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm"></span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Credits Earned</p>
                  <p className="text-sm text-neutral-600">Review bonus</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-success">+50 credits</p>
                <p className="text-sm text-neutral-500">Mar 5, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm">️</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Flight Booking</p>
                  <p className="text-sm text-neutral-600">JFK to NRT</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-error">-$450.00</p>
                <p className="text-sm text-neutral-500">Mar 3, 2024</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Button className="text-accent-secondary hover:text-blue-800">
              View All Transactions →
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Wallet Security</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Payment Methods</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Your stored payment methods are encrypted and secure.
              </p>
              <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                Manage Payment Methods →
              </Button>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Transaction Alerts</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Get notified of all account activity and charges.
              </p>
              <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                Configure Alerts →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
