
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Visa Information | ATLVS + GVTEWAY',
  description: 'Complete visa requirements and application guidance for international travel.',
}

export default function VisaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Visa Information</h1>
        <p className="text-lg text-neutral-600 mb-8">Navigate visa requirements with confidence for your international travels</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <span className="text-accent-secondary text-xl mr-3">ℹ️</span>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
              <p className="text-blue-800 text-sm">
                Visa requirements change frequently. This information is for guidance only.
                Always verify current requirements with official government sources and consult
                immigration authorities. We recommend checking 3-6 months before travel.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Visa Requirements by Destination</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">Country</th>
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">US Citizens</th>
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">EU Citizens</th>
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">Processing Time</th>
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Japan</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 90 days</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 90 days</td>
                  <td className="border border-neutral-300 px-4 py-3">N/A</td>
                  <td className="border border-neutral-300 px-4 py-3">Free</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Thailand</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 30 days</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 90 days</td>
                  <td className="border border-neutral-300 px-4 py-3">N/A</td>
                  <td className="border border-neutral-300 px-4 py-3">Free</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Vietnam</td>
                  <td className="border border-neutral-300 px-4 py-3">e-Visa required</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 45 days</td>
                  <td className="border border-neutral-300 px-4 py-3">3-5 business days</td>
                  <td className="border border-neutral-300 px-4 py-3">$25-80</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Morocco</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 90 days</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 90 days</td>
                  <td className="border border-neutral-300 px-4 py-3">N/A</td>
                  <td className="border border-neutral-300 px-4 py-3">Free</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Brazil</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 90 days</td>
                  <td className="border border-neutral-300 px-4 py-3">Visa-free up to 90 days</td>
                  <td className="border border-neutral-300 px-4 py-3">N/A</td>
                  <td className="border border-neutral-300 px-4 py-3">Free</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Types of Visas</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-semantic-success pl-4">
                <h4 className="font-medium text-neutral-900">Tourist/Visitor Visa</h4>
                <p className="text-sm text-neutral-600">For leisure travel, sightseeing, and short visits</p>
              </div>
              <div className="border-l-4 border-accent-primary pl-4">
                <h4 className="font-medium text-neutral-900">Business Visa</h4>
                <p className="text-sm text-neutral-600">For meetings, conferences, and business activities</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-neutral-900">Student Visa</h4>
                <p className="text-sm text-neutral-600">For academic studies and educational programs</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-neutral-900">Work Visa</h4>
                <p className="text-sm text-neutral-600">For employment and professional work</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Application Process</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                <div>
                  <strong className="text-neutral-900">Check Requirements</strong>
                  <p className="text-neutral-600">Review visa requirements for your nationality and destination</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                <div>
                  <strong className="text-neutral-900">Gather Documents</strong>
                  <p className="text-neutral-600">Collect passport, photos, application forms, and supporting documents</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                <div>
                  <strong className="text-neutral-900">Apply Online or at Embassy</strong>
                  <p className="text-neutral-600">Submit application through official channels with required fees</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
                <div>
                  <strong className="text-neutral-900">Wait for Processing</strong>
                  <p className="text-neutral-600">Processing times vary from same-day to several weeks</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Common Requirements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg"></span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-1">Valid Passport</h4>
              <p className="text-xs text-neutral-600">6+ months validity</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg"></span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-1">Photos</h4>
              <p className="text-xs text-neutral-600">Recent passport photos</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg"></span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-1">Application Form</h4>
              <p className="text-xs text-neutral-600">Completed official form</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg"></span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-1">Fee Payment</h4>
              <p className="text-xs text-neutral-600">Processing fees vary</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Need Help with Your Visa?</h3>
          <p className="text-yellow-800 mb-4">
            Our visa experts can guide you through the application process, help gather required documents,
            and ensure you meet all requirements for your destination.
          </p>
          <div className="flex gap-4">
            <Button className="bg-semantic-warning text-primary-foreground px-6 py-3 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2 font-medium">
              Get Visa Assistance
            </Button>
            <Button className="bg-background text-semantic-warning border border-yellow-600 px-6 py-3 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 font-medium">
              Check Requirements
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
