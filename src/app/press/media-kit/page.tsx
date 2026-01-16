
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Media Kit | ATLVS + GVTEWAY',
  description: 'Download our complete media kit with brand guidelines, assets, and company information.',
}

export default function MediaKitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Media Kit</h1>
          <p className="text-lg text-neutral-600">Everything you need for accurate and compelling coverage</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Complete Media Kit</h2>
            <p className="text-xl mb-6">Download our comprehensive media kit featuring brand assets, company facts, and usage guidelines</p>
            <Button className="bg-background text-accent-secondary px-8 py-4 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 font-semibold text-lg">
              Download Full Media Kit (2.4MB)
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">What&apos;s Included</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Brand Guidelines</h3>
                  <p className="text-sm text-neutral-600">Complete brand identity guidelines and usage rules</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Logo Assets</h3>
                  <p className="text-sm text-neutral-600">High-resolution logos in multiple formats</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Company Facts</h3>
                  <p className="text-sm text-neutral-600">Key statistics and company information</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Executive Bios</h3>
                  <p className="text-sm text-neutral-600">Leadership team profiles and photos</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Product Information</h3>
                  <p className="text-sm text-neutral-600">Detailed product and service descriptions</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Usage Guidelines</h3>
                  <p className="text-sm text-neutral-600">Terms and conditions for media usage</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Individual Downloads</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium text-neutral-900 mb-2">Brand Guidelines PDF</h3>
                <p className="text-sm text-neutral-600 mb-3">Complete brand identity and usage guidelines</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">2.1MB • PDF</span>
                  <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary text-sm">
                    Download
                  </Button>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                <h3 className="font-medium text-neutral-900 mb-2">Logo Package</h3>
                <p className="text-sm text-neutral-600 mb-3">High-resolution logos in multiple formats</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">15.3MB • ZIP</span>
                  <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                    Download
                  </Button>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <h3 className="font-medium text-neutral-900 mb-2">Company Fact Sheet</h3>
                <p className="text-sm text-neutral-600 mb-3">Key statistics and company overview</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">1.2MB • PDF</span>
                  <Button className="bg-accent-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-purple-700 text-sm">
                    Download
                  </Button>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                <h3 className="font-medium text-neutral-900 mb-2">Executive Bios</h3>
                <p className="text-sm text-neutral-600 mb-3">Leadership team profiles and headshots</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">8.7MB • ZIP</span>
                  <Button className="bg-semantic-warning text-primary-foreground px-4 py-2 rounded-md hover:bg-orange-700 text-sm">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Brand Assets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Primary Logo</h3>
              <p className="text-sm text-neutral-600 mb-3">Our main brand identity</p>
              <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary text-sm">
                Download PNG
              </Button>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-neutral-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-neutral-600">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Logo Variations</h3>
              <p className="text-sm text-neutral-600 mb-3">Alternative logo formats</p>
              <Button className="bg-neutral-600 text-primary-foreground px-4 py-2 rounded-md hover:bg-neutral-700 text-sm">
                Download Pack
              </Button>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-semantic-success/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-semantic-success"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Color Palette</h3>
              <p className="text-sm text-neutral-600 mb-3">Brand colors and usage</p>
              <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                Download Guide
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Brand Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Logo Usage</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Minimum clear space of 1x logo height</li>
                <li>• Do not modify colors or proportions</li>
                <li>• Maintain aspect ratio at all sizes</li>
                <li>• Use on appropriate backgrounds</li>
                <li>• Do not distort or rotate the logo</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Typography</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Primary font: Inter (sans-serif)</li>
                <li>• Secondary font: Playfair Display (serif)</li>
                <li>• Maintain proper hierarchy</li>
                <li>• Use approved color combinations</li>
                <li>• Consistent spacing and alignment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Usage Permissions</h2>
          <p className="text-blue-800 mb-4">
            Our media kit assets are available for editorial use only. Commercial usage requires explicit permission.
            Please credit &ldquo;ATLVS + GVTEWAY&rdquo; when using our brand assets in your content.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4">
              <h3 className="font-medium text-neutral-900 mb-2"> Permitted Uses</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Editorial articles and features</li>
                <li>• News coverage and reporting</li>
                <li>• Social media posts (with credit)</li>
                <li>• Educational content</li>
                <li>• Non-commercial presentations</li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-4">
              <h3 className="font-medium text-neutral-900 mb-2"> Prohibited Uses</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Commercial advertising</li>
                <li>• Competitor comparisons</li>
                <li>• Misleading contexts</li>
                <li>• Political campaigns</li>
                <li>• Offensive or inappropriate content</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Need Custom Assets?</h2>
          <p className="text-neutral-600 mb-6">Contact our press team for custom photography, interviews, or additional resources</p>
          <div className="flex justify-center gap-4">
            <a href="/press/contact" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Press Team
            </a>
            <a href="/press/logos" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Browse All Assets
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
