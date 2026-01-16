
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Logos & Assets | ATLVS + GVTEWAY',
  description: 'Download high-resolution logos and brand assets for media and editorial use.',
}

export default function LogosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Logos & Brand Assets</h1>
          <p className="text-lg text-neutral-600">High-resolution brand assets for editorial and media use</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <span className="text-semantic-warning text-xl mr-3">️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Usage Guidelines</h3>
              <p className="text-yellow-800 text-sm">
                These assets are for editorial use only. Commercial usage requires written permission from ATLVS + GVTEWAY.
                Always credit our brand when using these assets. Do not modify, distort, or alter the logos in any way.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Primary Logo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-neutral-100 rounded-lg p-8 mb-4">
                <div className="text-6xl mb-4"></div>
                <p className="text-sm text-neutral-600">Primary Logo</p>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Full Color Logo</h3>
              <p className="text-sm text-neutral-600 mb-4">Our primary brand identity</p>
              <div className="space-y-2">
                <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary text-sm">
                  Download PNG (5MB)
                </Button>
                <Button className="w-full bg-neutral-600 text-primary-foreground py-2 px-4 rounded-md hover:bg-neutral-700 text-sm">
                  Download SVG (Vector)
                </Button>
                <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 text-sm">
                  Download JPG (2MB)
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-4">Usage Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Minimum Size:</span>
                  <span className="font-medium">1 inch (72px at 72dpi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Clear Space:</span>
                  <span className="font-medium">0.5x logo height</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Color Space:</span>
                  <span className="font-medium">RGB for digital, CMYK for print</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">File Formats:</span>
                  <span className="font-medium">PNG, SVG, JPG, EPS, AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Logo Variations</h3>
            <div className="space-y-4">
              <div className="text-center p-4 border border-neutral-200 rounded">
                <div className="text-3xl mb-2"></div>
                <h4 className="font-medium text-neutral-900 mb-1">Horizontal Logo</h4>
                <p className="text-xs text-neutral-600 mb-2">For most applications</p>
                <Button className="bg-accent-secondary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-accent-tertiary">
                  Download
                </Button>
              </div>
              <div className="text-center p-4 border border-neutral-200 rounded">
                <div className="text-3xl mb-2"></div>
                <h4 className="font-medium text-neutral-900 mb-1">Stacked Logo</h4>
                <p className="text-xs text-neutral-600 mb-2">For vertical spaces</p>
                <Button className="bg-accent-secondary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-accent-tertiary">
                  Download
                </Button>
              </div>
              <div className="text-center p-4 border border-neutral-200 rounded">
                <div className="text-3xl mb-2"></div>
                <h4 className="font-medium text-neutral-900 mb-1">Icon Only</h4>
                <p className="text-xs text-neutral-600 mb-2">For favicons and small spaces</p>
                <Button className="bg-accent-secondary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-accent-tertiary">
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Color Variations</h3>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                  <span className="font-medium text-neutral-900">Full Color</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Primary brand colors</p>
                <Button className="bg-accent-secondary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-accent-tertiary">
                  Download
                </Button>
              </div>
              <div className="p-4 border border-neutral-200 rounded">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-neutral-800 rounded"></div>
                  <span className="font-medium text-neutral-900">Black</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">For dark backgrounds</p>
                <Button className="bg-neutral-600 text-primary-foreground px-3 py-1 rounded text-sm hover:bg-neutral-700">
                  Download
                </Button>
              </div>
              <div className="p-4 border border-neutral-200 rounded">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-background border border-neutral-300 rounded"></div>
                  <span className="font-medium text-neutral-900">White</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">For light backgrounds</p>
                <Button className="bg-neutral-600 text-primary-foreground px-3 py-1 rounded text-sm hover:bg-neutral-700">
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Brand Colors</h3>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-200 rounded">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-accent-secondary rounded"></div>
                  <div>
                    <span className="font-medium text-neutral-900">Primary Blue</span>
                    <p className="text-xs text-neutral-600">#2563EB</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-neutral-200 rounded">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-accent-primary rounded"></div>
                  <div>
                    <span className="font-medium text-neutral-900">Accent Purple</span>
                    <p className="text-xs text-neutral-600">#9333EA</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-neutral-200 rounded">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-neutral-900 rounded"></div>
                  <div>
                    <span className="font-medium text-neutral-900">Dark Gray</span>
                    <p className="text-xs text-neutral-600">#111827</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-neutral-200 rounded">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-neutral-100 rounded border"></div>
                  <div>
                    <span className="font-medium text-neutral-900">Light Gray</span>
                    <p className="text-xs text-neutral-600">#F3F4F6</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Typography</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Primary Font: Inter</h3>
              <div className="bg-background rounded-lg p-4 mb-4">
                <p className="font-light text-2xl mb-2">Light 300</p>
                <p className="font-normal text-xl mb-2">Regular 400</p>
                <p className="font-medium text-xl mb-2">Medium 500</p>
                <p className="font-semibold text-xl mb-2">Semibold 600</p>
                <p className="font-bold text-xl">Bold 700</p>
              </div>
              <p className="text-sm text-neutral-600">Sans-serif font for body text and UI elements</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Secondary Font: Playfair Display</h3>
              <div className="bg-background rounded-lg p-4 mb-4">
                <p className="font-normal text-2xl italic mb-2">Regular Italic 400</p>
                <p className="font-semibold text-xl mb-2">Semibold 600</p>
                <p className="font-bold text-xl">Bold 700</p>
              </div>
              <p className="text-sm text-neutral-600">Serif font for headings and decorative text</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Download All Assets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">Complete Logo Package</h3>
              <p className="text-neutral-600 mb-4">
                All logo variations, color options, and formats in one comprehensive package.
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-neutral-500">15.3MB • ZIP</span>
                <span className="text-sm text-neutral-500">Last updated: March 2024</span>
              </div>
              <Button className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium">
                Download Logo Package
              </Button>
            </div>
            <div className="border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">Brand Guidelines</h3>
              <p className="text-neutral-600 mb-4">
                Complete brand identity guidelines including usage rules, color specifications, and typography.
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-neutral-500">2.1MB • PDF</span>
                <span className="text-sm text-neutral-500">Version 2.0</span>
              </div>
              <Button className="w-full bg-semantic-success text-primary-foreground py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 font-medium">
                Download Guidelines
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Need Custom Assets?</h2>
          <p className="text-blue-800 mb-4">
            Don&apos;t see what you need? Contact our creative team for custom logo variations,
            specific color requirements, or additional brand assets.
          </p>
          <div className="flex gap-4">
            <a href="/press/contact" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Request Custom Assets
            </a>
            <a href="/press/media-kit" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              View Media Kit
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
