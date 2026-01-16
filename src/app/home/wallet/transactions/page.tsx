
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Transaction History | ATLVS + GVTEWAY',
  description: 'View your complete transaction history, receipts, and financial activity.',
}

export default function HomeWalletTransactionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Transaction History</h1>
          <p className="text-neutral-600">Your complete financial activity and receipts</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 sm:mb-0">All Transactions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
                <SelectItem value="credits">Credits</SelectItem>
                <SelectItem value="refunds">Refunds</SelectItem>
                <SelectItem value="fees">Fees</SelectItem>
              </Select>
              <Select className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="last-3-months">Last 3 months</SelectItem>
                <SelectItem value="last-year">Last year</SelectItem>
              </Select>
              <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-error/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Flight to Tokyo</h3>
                  <p className="text-sm text-neutral-600">Japan Airlines • March 15, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-error">-$450.00</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-neutral-500">•••• 4567</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Receipt</Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Broadway Musical Ticket</h3>
                  <p className="text-sm text-neutral-600">Hamilton • March 20, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-error">-$89.00</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-neutral-500">•••• 4567</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Receipt</Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Added Funds</h3>
                  <p className="text-sm text-neutral-600">Credit Card • March 10, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-success">+$100.00</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-neutral-500">•••• 4567</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Receipt</Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Travel Credits Earned</h3>
                  <p className="text-sm text-neutral-600">Review bonus • March 8, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-success">+50 credits</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-neutral-500">Bonus</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Details</Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-warning/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Hotel Booking</h3>
                  <p className="text-sm text-neutral-600">Tokyo Marriott • March 15-22, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-error">-$1,200.00</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-neutral-500">•••• 4567</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Receipt</Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">↩️</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Refund - Cancelled Flight</h3>
                  <p className="text-sm text-neutral-600">American Airlines • March 5, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-success">+$320.00</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-neutral-500">Refund</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Details</Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Premium Membership</h3>
                  <p className="text-sm text-neutral-600">Monthly subscription • March 1, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-semantic-error">-$29.99</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-neutral-500">Auto</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Receipt</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button className="bg-background text-neutral-700 border border-neutral-300 px-6 py-3 rounded-lg hover:bg-gray-50">
              Load More Transactions
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Transaction Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total Spent (Last 30 days)</span>
                <span className="text-sm font-medium text-semantic-error">-$2,089.99</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total Earned (Last 30 days)</span>
                <span className="text-sm font-medium text-semantic-success">+$470.00</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium text-neutral-900">Net Change</span>
                <span className="text-sm font-medium text-semantic-error">-$1,619.99</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Download Statements</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded">
                <div>
                  <h3 className="font-medium text-neutral-900">March 2024</h3>
                  <p className="text-sm text-neutral-600">8 transactions</p>
                </div>
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">Download PDF</Button>
              </div>

              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded">
                <div>
                  <h3 className="font-medium text-neutral-900">February 2024</h3>
                  <p className="text-sm text-neutral-600">12 transactions</p>
                </div>
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">Download PDF</Button>
              </div>

              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded">
                <div>
                  <h3 className="font-medium text-neutral-900">January 2024</h3>
                  <p className="text-sm text-neutral-600">15 transactions</p>
                </div>
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">Download PDF</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
